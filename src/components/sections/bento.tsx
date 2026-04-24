"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Accessibility,
  Activity,
  ArrowRight,
  BarChart3,
  Lock,
  Search,
  ShieldCheck,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { TechIcon, techIconTitle } from "@/components/tech-icon";
import { cn } from "@/lib/utils";

/* Client-only WebGL: avoids SSR and guarantees a real mount in the bento. */
const BentoArcGlobe = dynamic(
  () => import("@/components/arc-globe").then((m) => m.ArcGlobe),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-64 w-full rounded-2xl border border-dashed border-border/35 bg-canvas-2/50 animate-pulse dark:bg-canvas-2/20"
        aria-hidden
      />
    ),
  },
);

/*
  Bento showcase — rich tiles that sit between the landing page and case studies.
  Layout: 12-col grid, 2 rows.
    Row 1: ConnectTile (4)  |  TechStackTile (8) — tech stack now dominates
    Row 2: WhatYouGetTile (4) | TimezonesTile (4) | UsesTile (4)
*/
/** Must stay in sync with the header logo <Link> for horizontal alignment. */
const HEADER_LOGO_MIRROR_CLASSES =
  "flex h-10 shrink-0 select-none items-end font-instrument-serif text-[2rem] leading-none text-transparent italic tracking-tight sm:text-[2.1rem]";

export function Bento() {
  return (
    <section
      aria-label="About the work"
      className="relative w-full py-20 sm:py-28"
    >
      {/*
        Same max width + px as the header. Left/right struts match the real logo
        and theme control widths so this grid lines up with “past LA” and “before theme.”
      */}
      <div className="mx-auto flex w-full max-w-[1440px] items-start gap-0 px-2 sm:px-3">
        <span
          className={cn(HEADER_LOGO_MIRROR_CLASSES, "pointer-events-none")}
          aria-hidden
        >
          LA
        </span>
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:grid-rows-[minmax(300px,auto)_minmax(310px,auto)]">
            <TileShell className="md:col-span-6" href="/contact">
              <ConnectTile />
            </TileShell>
            <TileShell
              className="md:col-span-6"
              href="/about"
              ambientGlow={false}
            >
              <TechStackTile />
            </TileShell>
            <TileShell className="md:col-span-4" href="/services">
              <WhatYouGetTile />
            </TileShell>
            <TileShell className="md:col-span-4">
              <TimezonesTile />
            </TileShell>
            <TileShell className="md:col-span-4" href="/uses">
              <UsesTile />
            </TileShell>
          </div>
        </div>
        <div className="size-10 shrink-0" aria-hidden />
      </div>
    </section>
  );
}

function TileShell({
  children,
  className,
  href,
  /** Soft corner glow; disabled on e.g. Tech stack so type/icons stay sharp. */
  ambientGlow = true,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  ambientGlow?: boolean;
}) {
  // Explicit hover (not only `group-hover`) so the link-arrow can use
  // a slower, ease-out-dominant y + opacity on mouse leave. Pure CSS
  // group-hover reuses the same `transition` for both directions, which
  // read as a harsh “drop” when the hand leaves the card.
  const [cardHovered, setCardHovered] = useState(false);

  // `translate-y-2.5` = 0.625rem; default 1rem=16px → 10px offset.
  const ARROW_OFF_Y = 10;

  // Inner: `group` still drives the glow. The tile surface is a nested
  // `overflow-hidden` box so content clips to the squircle, but the
  // link-arrow sits OUTSIDE that layer (see previous overflow note).
  const inner = (
    <div
      className="group relative h-full"
      onPointerEnter={() => setCardHovered(true)}
      onPointerLeave={() => setCardHovered(false)}
    >
      <div
        className={cn(
          "card-lift relative isolate h-full overflow-hidden rounded-2xl border border-white/10 bg-canvas",
        )}
      >
        {ambientGlow ? (
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -bottom-8 size-56 bg-[radial-gradient(closest-side_at_50%_50%,rgba(255,255,255,0.08),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        ) : null}
        {children}
      </div>

      {href ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-5 bottom-5 z-20 flex size-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-canvas-2 backface-hidden will-change-transform"
          initial={false}
          animate={{
            y: cardHovered ? 0 : ARROW_OFF_Y,
            opacity: cardHovered ? 1 : 0,
          }}
          transition={
            cardHovered
              ? {
                  y: {
                    type: "spring",
                    stiffness: 300,
                    damping: 32,
                    mass: 0.5,
                  },
                  opacity: { duration: 0.38, ease: [0.4, 0, 0.2, 1] },
                }
              : {
                  y: {
                    duration: 0.8,
                    ease: [0.4, 0, 0, 0.88],
                  },
                  opacity: {
                    duration: 0.55,
                    delay: 0.14,
                    ease: [0.4, 0, 0.2, 1],
                  },
                }
          }
        >
          <ArrowRight className="size-4 shrink-0 text-foreground/90" />
        </motion.div>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        // Without this, the browser can start a native <a> drag after
        // a few px of movement — the ghost URL tooltip appears and
        // pointer handling dies (breaks the tech-stack magnifier, etc.)
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className={cn("block h-full", className)}
      >
        {inner}
      </Link>
    );
  }
  return <div className={cn("h-full", className)}>{inner}</div>;
}

/* Eyebrows: Core Mono (per global font rules). */
const BENTO_EYEBROW =
  "font-coremono text-[0.65rem] font-medium tracking-[0.05em] text-muted-foreground uppercase sm:text-xs";
/* Section titles inside bento cards — Instrument Serif. */
const BENTO_TITLE =
  "mt-2.5 font-instrument-serif text-xl leading-snug tracking-tight sm:mt-3 sm:text-2xl";
/* Tech stack tile uses the same eyebrow + title rules. */
const BENTO_TECH_EYEBROW = BENTO_EYEBROW;
const BENTO_TECH_TITLE = BENTO_TITLE;

/* ─────────────────────────────────────────────────────────── */
/*  ConnectTile — profile with orbital rings                   */
/* ─────────────────────────────────────────────────────────── */
function ConnectTile() {
  return (
    <div className="relative flex h-full min-h-[300px] flex-col items-center justify-center p-6 text-center md:p-8">
      {/* Orbital rings behind the avatar */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="relative size-[520px] max-w-none">
          {/* 0% / 12% / 26% / 40% static rings. Dots: outer=green, next=yellow;
              red on 26% = second ring from the centre (not the inner 40%). */}
          <div className="absolute inset-0 rounded-full border border-white/15" />
          <div className="absolute inset-[12%] rounded-full border border-white/12" />
          <div className="absolute inset-[26%] rounded-full border border-white/10" />
          <div className="absolute inset-[40%] rounded-full border border-white/8" />
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 48, ease: "linear", repeat: Infinity }}
          >
            <div className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/80 shadow-[0_0_16px_rgba(16,185,129,0.7)]" />
          </motion.div>
          <motion.div
            className="absolute inset-[12%]"
            animate={{ rotate: -360 }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          >
            <div className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.75)]" />
          </motion.div>
          <motion.div
            className="absolute inset-[26%]"
            animate={{ rotate: 360 }}
            transition={{ duration: 32, ease: "linear", repeat: Infinity }}
          >
            <div className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/90 shadow-[0_0_16px_rgba(239,68,68,0.65)]" />
          </motion.div>
        </div>
      </div>

      <div className="relative z-10">
        <p className={BENTO_EYEBROW}>Let&apos;s Build Together</p>
        <h3 className={BENTO_TITLE}>
          Clear communication, fast iterations, no surprises.
        </h3>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  TechStackTile — 3 marquee rows + fixed center magnifier    */
/* ─────────────────────────────────────────────────────────── */

/*
  Three horizontal rows drift in alternating directions behind a
  stationary magnifier. A requestAnimationFrame loop checks each
  badge's bounding rect against the magnifier's circular zone;
  whichever one is currently under the lens gets scaled up and
  turns white via a data-attribute.
*/

// Split the stack into three visual rows of roughly equal weight.
// Feel free to rearrange — order determines what pops up in each row.
const TECH_ROW_1 = [
  "nextdotjs",
  "react",
  "typescript",
  "tailwindcss",
  "nodedotjs",
  "graphql",
];
const TECH_ROW_2 = [
  "postgresql",
  "mongodb",
  "redis",
  "prisma",
  "docker",
  "kubernetes",
];
const TECH_ROW_3 = ["vercel", "git", "figma", "framer", "bun", "turborepo"];

// Lens visual size in px (svg rendered at LENS_PX x LENS_PX) — smaller
// chips, lens scaled to match.
const LENS_PX = 160;
// Clip radius on the zoom layer — keep ~0.2 of LENS_PX for alignment.
const LENS_CLIP_RADIUS = 32;
// Strong zoom so a passing badge clearly “pops” inside the glass.
const LENS_ZOOM = 1.45;
// Optical alignment: the glass ring can sit a few px above the second-row
// badge line. `lens` state is (visible disc centre − nudge) so re-centre
// matches the row and drag still tracks the pointer. Render uses lens + nudge.
const LENS_Y_DISPLAY_NUDGE = 6;

function lensYClamped(h: number, y: number): number {
  const minY = LENS_CLIP_RADIUS - LENS_Y_DISPLAY_NUDGE;
  const maxY = h - LENS_CLIP_RADIUS - LENS_Y_DISPLAY_NUDGE;
  return Math.max(minY, Math.min(maxY, y));
}

function TechStackTile() {
  // Magnifier lens position in px, relative to the marquee container's
  // top-left. `null` before the container has been measured; set on
  // mount (centred) and then driven by pointer drag.
  const containerRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);
  // Tracks whether the pointer has actually moved during a drag. Used
  // to suppress the parent Link's click navigation when the user was
  // dragging (vs. just tapping). Without this, releasing the drag
  // would fire a click on the wrapping `<Link href="/about">` and
  // navigate away mid-interaction.
  const movedRef = useRef(false);

  // Centre the lens once we can measure the container. Re-centre if the
  // container is resized AND the user hasn't moved the lens themselves
  // (tracked via a ref so resize doesn't yank it out of their hand).
  const userMovedRef = useRef(false);
  // The middle marquee row: lens Y should pass through the centre of
  // this row's circle, not the vertical midpoint of the whole 3-row block
  // (which is skewed by the long magnifier handle).
  const secondRowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const center = () => {
      const c = el.getBoundingClientRect();
      const row2 = secondRowRef.current;
      const rawY = row2
        ? (() => {
            const b = row2.getBoundingClientRect();
            return b.top - c.top + b.height / 2;
          })()
        : c.height / 2;
      setLens({
        x: c.width / 2,
        y: lensYClamped(c.height, rawY - LENS_Y_DISPLAY_NUDGE),
      });
    };

    center();
    const obs = new ResizeObserver(() => {
      if (!userMovedRef.current) center();
    });
    obs.observe(el);
    const r2 = secondRowRef.current;
    if (r2) obs.observe(r2);
    return () => obs.disconnect();
  }, []);

  // Convert a pointer event to a clamped lens centre. We clamp so the
  // CLIP disc always stays inside the marquee container — lens cap'd
  // against the edges prevents half-empty magnifier views when the
  // user drags past the container border.
  const pointerToLens = (clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const x = Math.max(
      LENS_CLIP_RADIUS,
      Math.min(r.width - LENS_CLIP_RADIUS, clientX - r.left),
    );
    return {
      x,
      y: lensYClamped(r.height, clientY - r.top - LENS_Y_DISPLAY_NUDGE),
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    userMovedRef.current = true;
    movedRef.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
    const next = pointerToLens(e.clientX, e.clientY);
    if (next) setLens(next);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    // Any movement during a press counts as a drag → we'll swallow
    // the trailing click so the parent Link doesn't navigate.
    if (e.movementX !== 0 || e.movementY !== 0) {
      movedRef.current = true;
    }
    const next = pointerToLens(e.clientX, e.clientY);
    if (next) setLens(next);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    // Browsers can omit a final pointermove with the same coords as
    // pointerup — always commit the release point so the glass stays put.
    const next = pointerToLens(e.clientX, e.clientY);
    if (next) setLens(next);
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // no-op
    }
  };

  // If the user dragged (vs just tapped), kill the synthetic click that
  // the browser fires after pointerup so it doesn't bubble into the
  // wrapping `<Link>` and trigger navigation.
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      movedRef.current = false;
    }
  };

  return (
    <div className="relative flex h-full min-h-[280px] flex-col overflow-hidden p-5 md:p-6">
      <div className="relative z-10 text-center">
        <p className={BENTO_TECH_EYEBROW}>Tech Stack</p>
        <h3 className={BENTO_TECH_TITLE}>The stack behind everything I ship</h3>
      </div>

      {/* Marquee + lens stack. The magnifier is `pointer-events: none` so
          it doesn't steal hits — that meant the pointer targeted marquee
          badges/imgs under the glass, which can start a native <img> drag
          or the parent <a> drag, killing `setPointerCapture` after a few
          px. A full-area transparent `z-30` overlay sits on top, owns all
          pointer input, and drives the lens instead. */}
      <div
        ref={containerRef}
        className="relative my-auto flex flex-col gap-6 py-6"
      >
        <TechMarqueeRow slugs={TECH_ROW_1} duration={36} />
        <div ref={secondRowRef} className="w-full min-w-0">
          <TechMarqueeRow slugs={TECH_ROW_2} duration={32} reverse />
        </div>
        <TechMarqueeRow slugs={TECH_ROW_3} duration={42} />

        {lens ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 bg-canvas"
            style={{
              clipPath: `circle(${LENS_CLIP_RADIUS}px at ${lens.x}px ${
                lens.y + LENS_Y_DISPLAY_NUDGE
              }px)`,
            }}
          >
            <div
              className="flex flex-col gap-6 py-6 will-change-transform"
              style={{
                transform: `scale(${LENS_ZOOM})`,
                transformOrigin: `${lens.x}px ${
                  lens.y + LENS_Y_DISPLAY_NUDGE
                }px`,
              }}
            >
              <TechMarqueeRow slugs={TECH_ROW_1} duration={36} bright />
              <TechMarqueeRow slugs={TECH_ROW_2} duration={32} reverse bright />
              <TechMarqueeRow slugs={TECH_ROW_3} duration={42} bright />
            </div>
          </div>
        ) : null}

        {lens ? (
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 z-20"
            style={{
              transform: `translate(${lens.x - LENS_PX / 2}px, ${
                lens.y - LENS_PX / 2 + LENS_Y_DISPLAY_NUDGE
              }px)`,
            }}
          >
            <MagnifierGlass />
          </div>
        ) : null}

        <div
          aria-hidden
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
          className="absolute inset-0 z-30 cursor-grab select-none active:cursor-grabbing"
          style={{ touchAction: "none" }}
        />
      </div>
    </div>
  );
}

function TechMarqueeRow({
  slugs,
  duration,
  reverse = false,
  bright = false,
}: {
  slugs: string[];
  duration: number;
  reverse?: boolean;
  // When true, badges render in a high-contrast "lit up" style. Used in
  // the magnifier's zoom layer so text reads bright white as it passes
  // under the glass.
  bright?: boolean;
}) {
  // Doubled so the marquee can loop seamlessly after -50% translate.
  const doubled = [...slugs, ...slugs];

  return (
    <div className="relative overflow-x-clip">
      <div
        className="flex w-max gap-3"
        style={{
          animation: `marquee-x ${duration}s linear infinite${
            reverse ? " reverse" : ""
          }`,
        }}
      >
        {doubled.map((slug, i) => (
          <TechBadge key={`${slug}-${i}`} slug={slug} bright={bright} />
        ))}
      </div>
    </div>
  );
}

function TechBadge({
  slug,
  bright = false,
}: {
  slug: string;
  bright?: boolean;
}) {
  // Compact chips; a scaled clone under the magnifier (see LENS_ZOOM) reads as zoomed.
  return (
    <div
      className={cn(
        "font-coremono inline-flex shrink-0 items-center gap-1 rounded-sm border px-2.5 py-1.5 text-[11px] font-semibold leading-tight sm:text-[12px]",
        bright
          ? "border-white/30 bg-white/6 text-white"
          : "border-white/8 bg-canvas-2 text-foreground/85",
      )}
    >
      <TechIcon
        slug={slug}
        colored
        className="size-4 shrink-0 text-foreground"
      />
      <span className="whitespace-nowrap">{techIconTitle(slug)}</span>
    </div>
  );
}

function MagnifierGlass() {
  // Real Lucide Search icon paths (circle r=8 at (11,11), handle path
  // m21 21 -4.3 -4.3). Lucide's default viewBox puts the circle at
  // (45.8%, 45.8%), which would offset the magnified content off-centre.
  //
  // We shift the viewBox to "-7 -7 36 36" so the circle centre (11,11)
  // lands at exactly (50%, 50%) of the rendered element — required for
  // the lens to line up with `clip-path: circle(... at 50% 50%)` on the
  // zoom layer.
  //
  // Rendered ring radius: ~8.45/36*LENS_PX with current LENS_PX;
  // LENS_CLIP_RADIUS tracks LENS_PX so the magnified disc stays
  // framed by the glass ring.
  return (
    <svg
      viewBox="-7 -7 36 36"
      width={LENS_PX}
      height={LENS_PX}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Handle under rim; grey stroke, shorter than before. Ring is a
          bit wider (larger r) and a soft, fully-opaque off-white. */}
      <path
        d="M16.98 16.98L26.2 26.2"
        stroke="rgba(115,115,120,0.95)"
        strokeWidth="1.7"
      />
      <circle
        cx="11"
        cy="11"
        r="8.45"
        stroke="rgb(235 235 236)"
        strokeWidth="2.1"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  WhatYouGetTile — 8 feature cards cycling into a wire box   */
/* ─────────────────────────────────────────────────────────── */
/*
  Animation concept:
  - One card at a time is visible in a slot above the wireframe box.
  - Each card enters from the top (fade + slight scale), pauses briefly,
    then exits by shrinking + dropping into the open top of the box below.
  - Cards are narrower than the wireframe box so the "drop in" reads
    visually — you see the card tuck inside the container's opening.
*/
const WHAT_YOU_GET_ITEMS: {
  title: string;
  desc: string;
  icon: LucideIcon;
}[] = [
  { title: "SEO & AEO", desc: "SSR, SSG, semantic, crawlable", icon: Search },
  {
    title: "Accessibility",
    desc: "WCAG AA, keyboard, ARIA",
    icon: Accessibility,
  },
  { title: "Performance", desc: "Core Web Vitals, <100ms TTFB", icon: Zap },
  {
    title: "Type Safety",
    desc: "TypeScript strict, zero any",
    icon: ShieldCheck,
  },
  {
    title: "Responsive",
    desc: "Mobile-first, fluid layouts",
    icon: Smartphone,
  },
  { title: "Security", desc: "Auth, CSRF, CSP, headers", icon: Lock },
  { title: "Analytics", desc: "Events, funnels, cohorts", icon: BarChart3 },
  { title: "Observability", desc: "Logs, metrics, tracing", icon: Activity },
];

/*
  Scrolling-list picker.

  Visual concept: the tile shows a vertical "wheel" of feature pills
  cycling downward one-at-a-time. Three items are visible at once:

      [ previous — smaller, faded, partially masked at the top ]
      [ current  — full-size, full-opacity, center of the tile ]
      [ next     — smaller, faded, partially masked at the bottom ]

  Implementation notes:
  - We render a 5-slot window around the current index (offsets -2..+2).
    The outer two (±2) live inside the top/bottom mask fade so they
    visually disappear; they exist purely to give the +1 / -1 slots
    something to come from / go to, making the transition seamless.
  - Each motion.div is keyed by its real item index (not the slot), so
    when `index` advances, framer-motion smoothly tweens each pill's
    `y` / `scale` / `opacity` to its new slot. AnimatePresence handles
    the items leaving (-2 → unmount) and entering (+2 → mount).
  - Slow (~3.6s) cadence + long (1.5s) springy tween + fast ease-out
    curve = a calm, confident scroll, not a nervous flicker.
*/
const SLOT_OFFSETS = [-2, -1, 0, 1, 2] as const;
const STRIDE = 62; // px between slot centres

function WhatYouGetTile() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % WHAT_YOU_GET_ITEMS.length);
    }, 3600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative flex h-full min-h-[220px] flex-col overflow-hidden p-5 md:p-6">
      <p className={BENTO_EYEBROW}>What You Get</p>
      <h3 className={BENTO_TITLE}>
        Clean code, pixel-perfect UI, deployed &amp; scaling.
      </h3>

      {/* List viewport — centered vertically in the remaining tile
          space; mask-faded at the top and bottom so the outer
          (off-centre) pills bleed out softly instead of being cut
          off with a hard edge. */}
      <div
        className="relative mt-6 flex flex-1 items-center justify-center"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        }}
      >
        <AnimatePresence initial={false}>
          {SLOT_OFFSETS.map((offset) => {
            const n = WHAT_YOU_GET_ITEMS.length;
            const itemIdx = (((index + offset) % n) + n) % n;
            const item = WHAT_YOU_GET_ITEMS[itemIdx];

            const abs = Math.abs(offset);
            // Centre is full-size; neighbours shrink + fade; the ±2
            // "reservoir" slots are hidden by the mask but kept in
            // the DOM so entering/exiting items have a place to
            // travel to/from.
            const scale = abs === 0 ? 1 : abs === 1 ? 0.82 : 0.66;
            const opacity = abs === 0 ? 1 : abs === 1 ? 0.55 : 0.2;
            const y = offset * STRIDE;

            return (
              <motion.div
                key={itemIdx}
                initial={{
                  y: y + STRIDE * 0.5,
                  opacity: 0,
                  scale: scale * 0.9,
                }}
                animate={{ y, opacity, scale }}
                exit={{ y: y - STRIDE * 0.5, opacity: 0, scale: scale * 0.9 }}
                transition={{
                  y: { duration: 1.5, ease: [0.32, 0.72, 0, 1] },
                  scale: { duration: 1.5, ease: [0.32, 0.72, 0, 1] },
                  opacity: { duration: 1.2, ease: "easeOut" },
                }}
                // Each pill is absolutely positioned at the viewport
                // centre; the `y` transform alone determines which slot
                // it occupies, keeping the transition a pure 1-D
                // vertical translation regardless of tile width.
                className="absolute inset-x-4 flex items-center gap-3 rounded-full border border-white/8 bg-surface py-2.5 pr-5 pl-2.5 shadow-[0_8px_22px_-16px_rgba(0,0,0,0.6)]"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <item.icon
                    strokeWidth={2.25}
                    className="size-4 text-foreground/55"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  TimezonesTile — 3D stipple globe: US-based, global (ArcGlobe)         */
/* ─────────────────────────────────────────────────────────── */
function TimezonesTile() {
  return (
    <div className="flex h-full min-h-[260px] flex-col p-3 sm:min-h-[280px] sm:p-4 md:min-h-[300px] md:p-5">
      <div className="shrink-0 px-1 pt-1 md:px-0 md:pt-0">
        <p className={BENTO_EYEBROW}>When we can meet</p>
        <h3 className={BENTO_TITLE}>
          Located in the U.S., available globally.
        </h3>
      </div>
      {/* Globe: absolutely positioned + aspect-square so the sphere can stay
          large (sized by tile width) and simply clip against the card's
          overflow-hidden when the tile is short. Without `absolute`, the
          aspect-square would push the grid row tall to match. */}
      <div className="relative mt-1 w-full min-h-0 flex-1 md:mt-2">
        <div className="pointer-events-auto absolute top-[88%] left-1/2 aspect-square w-[92%] max-w-[22rem] -translate-x-1/2 -translate-y-1/2">
          <BentoArcGlobe
            className="h-full w-full"
            aria-label="Stipple-style globe. Cities: London, New York, Addis Ababa, Dubai, Tokyo. Great-circle arcs in blue. Drag to rotate; idles with slow spin."
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  UsesTile — horizontal row of tool icons                    */
/* ─────────────────────────────────────────────────────────── */
/*
  Uses tile design:
  - 5 tools on a single centered line (no wrap), cursor sits in the middle
    as the hero and renders noticeably bigger than its neighbors.
  - Squircle containers (rounded-[24%]) à la iOS app icons.
  - On hover, icons ripple up from the center; stagger 100ms per step, 500ms motion.
*/
const USES_ORDER = ["arc", "claude", "linear", "docker", "git"] as const;

function UsesTile() {
  const center = (USES_ORDER.length - 1) / 2; // 2 for 5 items

  return (
    <div className="group/uses relative flex h-full min-h-[220px] flex-col p-5 md:p-6">
      {/* Icons — single line, vertically centered in the available space. */}
      <div className="flex flex-1 flex-nowrap items-center justify-center gap-1.5 sm:gap-2">
        {USES_ORDER.map((slug, i) => {
          const distance = Math.abs(i - center); // 0, 1, 2
          // Stagger: tighter for a faster wave (still read as a cascade).
          const delay = distance * 100;
          const isHero = i === center;

          return (
            <div
              key={slug}
              title={techIconTitle(slug)}
              // Brisk timing: border + rise share one ease-out; stagger keeps overlap.
              style={{
                transitionProperty: "translate, transform, border-color",
                transitionDuration: "500ms, 500ms, 500ms",
                transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
                transitionDelay: `${delay}ms`,
              }}
              className={cn(
                "relative flex shrink-0 items-center justify-center border-2 border-border/70",
                "rounded-[22%]",
                /* Slightly smaller tiles with a bit more glyph presence. */
                isHero
                  ? "size-26 p-2 sm:size-28 sm:p-2"
                  : "size-20 p-1.5 sm:size-22 sm:p-1.5",
                "group-hover/uses:-translate-y-2 group-hover/uses:border-indigo-400",
              )}
            >
              <div
                className={cn(
                  "flex size-full items-center justify-center rounded-[18%] bg-canvas-2",
                  isHero ? "p-2.5 sm:p-3" : "p-2 sm:p-2.5",
                )}
              >
                <TechIcon
                  slug={slug}
                  colored
                  className={cn(
                    "shrink-0 text-foreground",
                    isHero ? "size-10 sm:size-12" : "size-8 sm:size-9",
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <p className={BENTO_EYEBROW}>Uses</p>
        <h3 className={BENTO_TITLE}>Check out my favorite tools</h3>
      </div>
    </div>
  );
}
