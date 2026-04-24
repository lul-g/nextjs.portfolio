"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { cn } from "@/lib/utils";

/**
 * Dots-of-light globe.
 *
 * A dark sphere with a THREE.Points cloud of ~N vertices on its surface.
 * Each vertex is a Fibonacci-distributed direction that passes a land test
 * against a low-res luminance mask — so only continents light up, oceans stay
 * black. Draggable via OrbitControls; idles with a slow rotation.
 *
 * Pure three.js, no react-globe.gl — keeps the scene graph tiny and avoids the
 * extra image-baking the previous implementation did every mount.
 */

/**
 * Grayscale elevation / bump map. Oceans are black (0). Land is brighter
 * based on elevation — even sea-level coastal plains read well above 0.
 *
 * Using a grayscale topology (instead of trying to classify the Blue Marble
 * JPEG by color channels) is unambiguous: no false positives from clouds,
 * no false negatives from dark jungle, no dependency on the JPEG encoder.
 */
const LAND_MASK_URL =
  "https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png";

/** Globe radius in world units. */
const RADIUS = 100;
/** Candidates evaluated against the mask. ~30% typically survive as land. */
const SAMPLE_POINTS = 55000;

/**
 * Land test for the topology PNG — simply "brighter than black".
 * Threshold is low enough that low-elevation plains still pass.
 */
const LAND_LUM_MIN = 8;
function isLandPixel(r: number, g: number, b: number): boolean {
  return (r + g + b) / 3 > LAND_LUM_MIN;
}

/** Minimal set of anchor cities — orange dots on the globe. */
const CITIES: { name: string; lat: number; lng: number }[] = [
  { name: "New York", lat: 40.7128, lng: -74.006 },
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Addis Ababa", lat: 9.03, lng: 38.74 },
  { name: "Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
];

/**
 * Light touch on arcs — only three connections so the globe stays clean.
 * Each entry is [fromName, toName] and must match names in CITIES.
 */
const ARC_PAIRS: [string, string][] = [
  ["New York", "London"],
  ["London", "Dubai"],
  ["Dubai", "Tokyo"],
  ["Addis Ababa", "New York"],
  ["Addis Ababa", "London"],
  ["Addis Ababa", "Dubai"],
  ["Addis Ababa", "Tokyo"],
];

/**
 * Lat/lng → Cartesian in the same convention used by the land-point sampler
 * (Greenwich on +Z, East on +X). Must match exactly or cities would appear
 * in the wrong place while the dots are correct.
 */
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (lat * Math.PI) / 180;
  const theta = (lng * Math.PI) / 180;
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(theta),
  );
}

/**
 * Great-circle arc between two lat/lng anchors. Interpolates via slerp on the
 * sphere and lifts the midpoint above the surface so the arc visibly hops.
 */
function greatCircleArcPoints(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  radius: number,
  steps = 48,
  maxLift = 0.22,
): THREE.Vector3[] {
  const a = latLngToVec3(from.lat, from.lng, 1);
  const b = latLngToVec3(to.lat, to.lng, 1);
  const dot = Math.max(-1, Math.min(1, a.dot(b)));
  const omega = Math.acos(dot);
  const sinO = Math.sin(omega);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let v: THREE.Vector3;
    if (sinO < 1e-6) {
      v = a.clone().lerp(b, t);
    } else {
      const ka = Math.sin((1 - t) * omega) / sinO;
      const kb = Math.sin(t * omega) / sinO;
      v = a.clone().multiplyScalar(ka).add(b.clone().multiplyScalar(kb));
    }
    const lift = 1 + maxLift * Math.sin(t * Math.PI);
    v.normalize().multiplyScalar(radius * lift);
    pts.push(v);
  }
  return pts;
}

/** Tiny radial-gradient sprite so each point renders as a soft circle of light. */
function createDotSprite(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255, 255, 255, 1)");
  g.addColorStop(0.35, "rgba(230, 240, 255, 0.95)");
  g.addColorStop(0.7, "rgba(180, 205, 255, 0.25)");
  g.addColorStop(1, "rgba(180, 205, 255, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Load image as an HTMLImageElement (CORS-safe for canvas sampling). */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error("image load failed"));
    im.src = url;
  });
}

/**
 * Build a BufferGeometry of land-only points on the unit sphere, scaled to
 * the globe radius. Sampling uses a Fibonacci lattice for even coverage.
 */
function buildLandPoints(maskData: ImageData): THREE.BufferGeometry {
  const positions: number[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  const { width, height, data } = maskData;

  for (let i = 0; i < SAMPLE_POINTS; i++) {
    const y = 1 - (i / (SAMPLE_POINTS - 1)) * 2; // -1..1
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    // Sphere → equirectangular UV on the mask.
    // atan2(x, z) (NOT atan2(z, x)) puts Greenwich (lng=0) on the +Z axis and
    // East (lng=+90°) on the +X axis — the standard Earth orientation. The
    // alternative swaps east and west, mirroring every continent.
    const lat = Math.asin(y); // -PI/2..PI/2
    const lng = Math.atan2(x, z); // -PI..PI
    const u = 0.5 + lng / (2 * Math.PI);
    const v = 0.5 - lat / Math.PI;
    const px = Math.min(width - 1, Math.max(0, Math.floor(u * width)));
    const py = Math.min(height - 1, Math.max(0, Math.floor(v * height)));
    const idx = (py * width + px) * 4;
    if (!isLandPixel(data[idx]!, data[idx + 1]!, data[idx + 2]!)) continue;

    positions.push(x * RADIUS * 1.005, y * RADIUS * 1.005, z * RADIUS * 1.005);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  return geom;
}

export function ArcGlobe({
  className,
  "aria-label": ariaLabel = "3D globe with continents rendered as points of light. Drag to rotate; idles with a slow spin.",
}: {
  className?: string;
  "aria-label"?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const mount = mountRef.current;
    if (!host || !mount) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    // Scene + camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 2000);
    camera.position.set(0, 0, 320);

    // Dark sphere — the “water” backdrop behind the points.
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 96, 96),
      new THREE.MeshBasicMaterial({ color: 0x05070c }),
    );
    scene.add(sphere);

    // Atmosphere rim glow — fresnel shader on a slightly larger sphere.
    // Classic three.js trick: render the BackSide of an outer sphere, modulate
    // the output by (bias − dot(normal, viewDir))^power. That gives a bright
    // halo that peaks right at the silhouette and fades both inward and
    // outward, matching the reference image.
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x9cc6ff) },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPosView;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vPosView = mvPos.xyz;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vPosView;
        uniform vec3 glowColor;
        void main() {
          vec3 viewDir = normalize(-vPosView);
          float intensity = pow(max(0.6 - dot(vNormal, viewDir), 0.0), 3.0);
          gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.35;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.12, 64, 64),
      atmosphereMat,
    );
    scene.add(atmosphere);

    // Points group — populated after the mask loads.
    const group = new THREE.Group();
    scene.add(group);

    const sprite = createDotSprite();
    let pointsMesh: THREE.Points | null = null;
    let cancelled = false;

    // ── City markers (tiny orange dots) ──────────────────────────────
    const cityPositions: number[] = [];
    CITIES.forEach((c) => {
      const v = latLngToVec3(c.lat, c.lng, RADIUS * 1.012);
      cityPositions.push(v.x, v.y, v.z);
    });
    const cityGeom = new THREE.BufferGeometry();
    cityGeom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(cityPositions, 3),
    );
    const cityMat = new THREE.PointsMaterial({
      map: sprite,
      color: 0xff7a2e,
      size: 10,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      alphaTest: 0.02,
      blending: THREE.AdditiveBlending,
    });
    const cityPoints = new THREE.Points(cityGeom, cityMat);
    scene.add(cityPoints);

    // ── Arcs (thin blue great-circle lines) ──────────────────────────
    const arcMat = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.85,
    });
    const arcs: THREE.Line[] = [];
    ARC_PAIRS.forEach(([fromName, toName]) => {
      const from = CITIES.find((c) => c.name === fromName);
      const to = CITIES.find((c) => c.name === toName);
      if (!from || !to) return;
      const pts = greatCircleArcPoints(from, to, RADIUS * 1.01, 64, 0.22);
      const geom = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geom, arcMat);
      arcs.push(line);
      scene.add(line);
    });

    // ── City name labels (HTML overlay) ───────────────────────────────
    // Small white pill floating above each orange dot. We project the city's
    // world position into screen space each frame and hide the label when the
    // city rotates to the far hemisphere (simple occlusion test: vector to
    // camera must point outward from the sphere surface).
    const labelLayer = document.createElement("div");
    labelLayer.style.cssText =
      "position:absolute;inset:0;pointer-events:none;overflow:hidden;";
    host.appendChild(labelLayer);

    const cityLabels = CITIES.map((c) => {
      const pos = latLngToVec3(c.lat, c.lng, RADIUS * 1.012);
      const el = document.createElement("div");
      el.textContent = c.name.toUpperCase();
      el.style.cssText = [
        "position:absolute",
        "left:0",
        "top:0",
        "padding:3px 6px",
        "border-radius:6px",
        "background:rgba(255,255,255,0.95)",
        "color:#0b0d12",
        "font-family:var(--font-coremono),ui-monospace,monospace",
        "font-size:9px",
        "font-weight:600",
        "letter-spacing:0.06em",
        "line-height:1",
        "white-space:nowrap",
        "transform:translate(-50%,-160%)",
        "box-shadow:0 2px 6px rgba(0,0,0,0.35)",
        "transition:opacity 160ms ease-out",
        "will-change:left,top,opacity",
        "opacity:0",
      ].join(";");
      labelLayer.appendChild(el);
      return { el, pos };
    });

    void (async () => {
      try {
        const img = await loadImage(LAND_MASK_URL);
        if (cancelled) return;
        const w = 1024;
        const h = 512;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const maskData = ctx.getImageData(0, 0, w, h);

        const geom = buildLandPoints(maskData);
        const mat = new THREE.PointsMaterial({
          map: sprite,
          color: 0xc7dcff,
          size: 1.8,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          alphaTest: 0.02,
          blending: THREE.AdditiveBlending,
        });
        pointsMesh = new THREE.Points(geom, mat);
        group.add(pointsMesh);
      } catch {
        /* leave the dark sphere alone on failure */
      }
    })();

    // Controls — drag to rotate, no zoom/pan, slow idle rotation.
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.6;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;

    let resumeTimer: number | undefined;
    const pauseAutoRotate = () => {
      if (resumeTimer) window.clearTimeout(resumeTimer);
      controls.autoRotate = false;
    };
    const resumeAutoRotate = () => {
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        controls.autoRotate = true;
        resumeTimer = undefined;
      }, 1200);
    };
    controls.addEventListener("start", pauseAutoRotate);
    controls.addEventListener("end", resumeAutoRotate);

    // Start camera at a flattering angle (~Atlantic).
    const pitch = THREE.MathUtils.degToRad(14);
    const yaw = THREE.MathUtils.degToRad(-30);
    camera.position.set(
      Math.sin(yaw) * Math.cos(pitch) * 320,
      Math.sin(pitch) * 320,
      Math.cos(yaw) * Math.cos(pitch) * 320,
    );
    camera.lookAt(0, 0, 0);
    controls.update();

    // Animation loop.
    let raf = 0;
    const tmpVec = new THREE.Vector3();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);

      // Update city labels — project 3D to screen and fade out back-of-globe.
      // The canvas is a centered square inside `host`; `labelLayer` fills the
      // full host, so we offset projected coords by the centering delta.
      const w = renderer.domElement.clientWidth;
      const h = renderer.domElement.clientHeight;
      const hostRect = host.getBoundingClientRect();
      const offX = (hostRect.width - w) / 2;
      const offY = (hostRect.height - h) / 2;
      for (const { el, pos } of cityLabels) {
        tmpVec.copy(camera.position).sub(pos);
        const visible = tmpVec.dot(pos) > 0;
        if (!visible) {
          el.style.opacity = "0";
          continue;
        }
        tmpVec.copy(pos).project(camera);
        const x = (tmpVec.x * 0.5 + 0.5) * w + offX;
        const y = (-tmpVec.y * 0.5 + 0.5) * h + offY;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.opacity = "1";
      }
    };
    tick();

    // Square viewport — the host div is free-form (no aspect-square), so we
    // pick s = min(width, height) and render a square canvas of that size.
    // The canvas is centered via flex on the mount div, so the globe stays
    // visually centered regardless of aspect ratio of the enclosing tile.
    const resize = () => {
      const rect = host.getBoundingClientRect();
      // CRITICAL: never fall back to `rect.width` if height is missing —
      // that would render a square sized by tile WIDTH, which then forces
      // the entire row to grow to match (a measurement feedback loop).
      // Bail early and wait for the ResizeObserver to fire with real dims.
      if (rect.width < 8 || rect.height < 8) return;
      const s = Math.max(120, Math.floor(Math.min(rect.width, rect.height)));
      renderer.setSize(s, s, false);
      renderer.domElement.style.width = `${s}px`;
      renderer.domElement.style.height = `${s}px`;
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(resize);
    });
    ro.observe(host);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.removeEventListener("start", pauseAutoRotate);
      controls.removeEventListener("end", resumeAutoRotate);
      controls.dispose();
      if (resumeTimer) window.clearTimeout(resumeTimer);
      if (pointsMesh) {
        pointsMesh.geometry.dispose();
        (pointsMesh.material as THREE.Material).dispose();
      }
      cityPoints.geometry.dispose();
      (cityPoints.material as THREE.Material).dispose();
      arcs.forEach((l) => l.geometry.dispose());
      arcMat.dispose();
      sprite.dispose();
      sphere.geometry.dispose();
      (sphere.material as THREE.Material).dispose();
      atmosphere.geometry.dispose();
      (atmosphere.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      if (labelLayer.parentNode === host) {
        host.removeChild(labelLayer);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "arc-globe-host flex h-full w-full flex-col items-center justify-center",
        className,
      )}
      role="img"
      aria-label={ariaLabel}
    >
      {/* No aspect-square: the host flexes to fill its parent, and the
          WebGL canvas is rendered as a square of `min(width, height)`
          (see resize() in the effect), so the globe stays circular even
          when the tile is much shorter than wide. Host MUST have h-full
          all the way down, otherwise getBoundingClientRect().height is 0
          at first paint and the square falls back to `width`, which then
          forces the entire grid row to grow. */}
      <div
        ref={hostRef}
        className="relative h-full w-full"
        style={{ touchAction: "none" }}
      >
        <div
          ref={mountRef}
          className="absolute inset-0 flex items-center justify-center"
        />
      </div>
    </div>
  );
}
