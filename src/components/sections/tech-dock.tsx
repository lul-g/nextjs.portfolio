"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { TECH_STACK } from "@/lib/site-data";
import { TechIcon, techIconTitle } from "@/components/tech-icon";

/*
  Full-width tech dock.
  - No box, no grid — just icons drifting across the width of the page.
  - macOS dock magnification: icons near the cursor scale up and gain color,
    neighbors scale less (smooth falloff curve), giving the 3D curved feel.
  - Marquee pauses on hover so the dock effect can target stable positions.
*/

const ICON_SIZE = 32;
const ICON_GAP = 24;
const HOVER_RADIUS = 120;
const MAX_SCALE = 1.75;

export function TechDock() {
  // Duplicated 3x so the loop always fills ultrawide screens with no visible seam.
  const tripled = [...TECH_STACK, ...TECH_STACK, ...TECH_STACK];
  const mouseX = useMotionValue<number>(Number.POSITIVE_INFINITY);

  return (
    // `overflow-x-clip` instead of `overflow-hidden` so scaled-up icons can
    // overflow vertically without being chopped at the top.
    // Constrained to the site container so the fade edges align with the
    // rest of the page (hero, case studies, etc.) instead of the screen edges.
    //
    // Scroll reveal: the whole dock eases in with an upward drift and a
    // blur-to-clear transition when it first enters the viewport. This
    // matches the premium "curtain lifts" feel of the hero reveal and
    // stops the marquee from appearing mid-motion when users scroll
    // down onto the section. `viewport.once` ensures we only play it
    // once so it doesn't retrigger on every scroll pass.
    <motion.section
      aria-label="Tech stack"
      className="relative mx-auto mt-6 mb-24 w-full max-w-7xl overflow-x-clip px-4 select-none sm:mt-10 sm:mb-32"
      initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 2.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        className="pause-on-hover group relative w-full overflow-x-clip mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        // Mask slides in from the middle outward so the icons appear to
        // be "unveiled" across the full width rather than all at once.
        // We drive the CSS `clip-path` via a motion property so it
        // plays in step with the parent's blur/opacity reveal.
        initial={{ clipPath: "inset(0 50% 0 50%)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0%)" }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{
          duration: 2.5,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.32,
        }}
      >
        <div
          className="animate-marquee-slow flex w-max items-end"
          style={{ gap: `${ICON_GAP}px`, padding: "56px 0" }}
        >
          {tripled.map((slug, i) => (
            <DockIcon key={`${slug}-${i}`} slug={slug} mouseX={mouseX} />
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

function DockIcon({
  slug,
  mouseX,
}: {
  slug: string;
  mouseX: MotionValue<number>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Distance from cursor to icon center (viewport-relative).
  const distance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return HOVER_RADIUS * 2;
    return Math.abs(val - (rect.left + rect.width / 2));
  });

  // Scale falls off smoothly past the hover radius.
  const scaleRaw = useTransform(distance, [0, HOVER_RADIUS], [MAX_SCALE, 1], {
    clamp: true,
  });
  const scale = useSpring(scaleRaw, { mass: 0.12, stiffness: 120, damping: 18 });

  // Lift up as it grows — sells the 3D curve.
  const yRaw = useTransform(distance, [0, HOVER_RADIUS], [-10, 0], {
    clamp: true,
  });
  const y = useSpring(yRaw, { mass: 0.12, stiffness: 120, damping: 18 });

  // Color bloom — swap grayscale to full brand color as cursor nears.
  const colorOpacity = useTransform(
    distance,
    [0, HOVER_RADIUS * 0.7],
    [1, 0],
    { clamp: true },
  );

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        y,
        width: ICON_SIZE,
        height: ICON_SIZE,
        transformOrigin: "bottom center",
      }}
      className="relative flex shrink-0 items-center justify-center"
      title={techIconTitle(slug)}
    >
      {/* Base: monochrome, subdued. */}
      <TechIcon
        slug={slug}
        className="absolute inset-0 m-auto size-full text-foreground/55"
      />
      {/* Overlay: full-color, fades in on proximity.
          `text-foreground` themes the dark-brand icons (Next.js, Vercel…) via currentColor. */}
      <motion.div
        style={{ opacity: colorOpacity }}
        className="absolute inset-0 flex items-center justify-center text-foreground"
      >
        <TechIcon slug={slug} colored className="size-full" />
      </motion.div>
    </motion.div>
  );
}
