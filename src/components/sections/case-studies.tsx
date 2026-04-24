"use client";

import { ArrowRight, Plus } from "lucide-react";
import { useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { PROJECTS, type Project } from "@/lib/site-data";
import { LuminousFrame } from "@/components/luminous-frame";
import { TechIcon } from "@/components/tech-icon";
import { cn } from "@/lib/utils";

/*
  Case Studies — scrollytelling layout.

  Left column: stack of project visuals (gradient cards with device mockups).
                Each card is ~viewport tall so one fills the screen at a time.
  Right column: a sticky text panel that swaps content to match whichever
                visual is currently centered in the viewport.

  Active detection: each visual uses `useInView` with a shrunk margin so a
  project only becomes active when it's roughly in the middle 40% of the screen.
*/

export function CaseStudies() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = PROJECTS[activeIndex];

  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:py-32">
      <SectionHeading
        kicker="CASE STUDIES"
        kickerClassName="font-coremono"
        titleClassName="font-curated-title"
        title={
          <>
            <span>Curated</span> <span className="title-work-gradient">work</span>
          </>
        }
      />

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
        {/* LEFT: scrolling visuals */}
        <div className="flex flex-col gap-16 sm:gap-20">
          {PROJECTS.map((project, index) => (
            <ProjectVisual
              key={project.id}
              project={project}
              index={index}
              onActive={setActiveIndex}
            />
          ))}
        </div>

        {/* RIGHT: sticky text */}
        <div className="relative hidden lg:block">
          <div className="sticky top-28">
            <ProjectDetails key={activeProject.id} project={activeProject} />
          </div>
        </div>

        {/* MOBILE: details render inline under each visual */}
        <div className="lg:hidden">
          <div className="flex flex-col gap-10">
            {PROJECTS.map((project) => (
              <ProjectDetails key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────── */
/*  LEFT: one visual per project                    */
/* ─────────────────────────────────────────────── */
function ProjectVisual({
  project,
  index,
  onActive,
}: {
  project: Project;
  index: number;
  onActive: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Detection zone: only the middle band of the viewport counts as "active".
  const isInView = useInView(ref, {
    amount: 0.5,
    margin: "-35% 0px -35% 0px",
  });

  useEffect(() => {
    if (isInView) onActive(index);
  }, [isInView, index, onActive]);

  return (
    <article
      ref={ref}
      className="noise relative overflow-hidden rounded-md p-8 text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] sm:p-10"
      style={{ background: project.gradient }}
    >
      {/* Top row: tagline on left, arrow on right */}
      <div className="relative z-10 flex items-start justify-between gap-6">
        <p className="max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
          {project.description}
        </p>
        <ArrowRight
          className="mt-1 size-5 shrink-0 text-white/60"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mt-8 flex items-center justify-center sm:mt-10">
        <MockPreview project={project} />
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────── */
/*  RIGHT: the sticky text panel                    */
/* ─────────────────────────────────────────────── */
function ProjectDetails({ project }: { project: Project }) {
  return (
    <div>
      {/* Short dash + title — left-aligned, dash only on the left side */}
      <div className="flex items-center gap-3">
        <span
          className="h-px w-6 shrink-0"
          style={{ background: project.accent }}
          aria-hidden
        />
        <h3 className="font-bluu-next text-lg leading-[1.12] tracking-tight sm:text-xl sm:leading-[1.1]">
          {project.title}
        </h3>
      </div>

      <p className="font-outfit mt-4 text-sm leading-relaxed text-muted-foreground">
        {project.longDescription}
      </p>

      <ul className="mt-5 space-y-2.5">
        {project.features.map((feature) => (
          <li
            key={feature}
            className="font-outfit flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85"
          >
            <span
              className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: `${project.accent}22`,
                color: project.accent,
              }}
            >
              <Plus className="size-2.5" strokeWidth={3} />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 14).map((tech) => (
          <StackPill key={tech} name={tech} />
        ))}
      </div>

      <div className="mt-6">
        <Link
          href={`/projects/${project.id}`}
          className="font-outfit group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
        >
          View case study
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

/*
  Stack pill — small uppercase chip with a brand logo when available.
  Display names like "Next.js" get mapped to simple-icons slugs;
  unmapped ones render text-only (no broken icon).
*/
const STACK_ICON_MAP: Record<string, string> = {
  "Next.js": "nextdotjs",
  React: "react",
  "React Native": "react",
  TypeScript: "typescript",
  "Tailwind CSS": "tailwindcss",
  "Node.js": "nodedotjs",
  "Express.js": "express",
  MongoDB: "mongodb",
  PostgreSQL: "postgresql",
  Redis: "redis",
  Prisma: "prisma",
  GraphQL: "graphql",
  Docker: "docker",
  Kubernetes: "kubernetes",
  Vercel: "vercel",
  Git: "git",
  Figma: "figma",
  "Motion.dev": "framer",
  Bun: "bun",
  Turborepo: "turborepo",
  Razorpay: "razorpay",
  Zod: "zod",
  Sentry: "sentry",
  "Sanity CMS": "sanity",
  Markdown: "markdown",
  Expo: "expo",
  Firebase: "firebase",
  Cloudinary: "cloudinary",
  "Shadcn UI": "shadcnui",
  "TanStack Query": "reactquery",
};

function StackPill({ name }: { name: string }) {
  const slug = STACK_ICON_MAP[name];
  return (
    <span className="font-coremono inline-flex items-center gap-1.5 rounded border border-border/70 bg-canvas-2 px-2 py-1 text-[10px] font-medium tracking-[0.08em] text-foreground/75 uppercase">
      {slug ? (
        <TechIconSafe slug={slug} />
      ) : (
        <span
          className="flex size-3 shrink-0 items-center justify-center rounded-sm bg-foreground/10 text-[7px] font-bold text-foreground/60"
          aria-hidden
        >
          {name.charAt(0)}
        </span>
      )}
      {name}
    </span>
  );
}

/* Wraps TechIcon so a bad slug just renders nothing instead of crashing. */
function TechIconSafe({ slug }: { slug: string }) {
  try {
    return <TechIcon slug={slug} className="size-3 shrink-0" colored />;
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────── */
/*  Mock frame: subtle border → #020202 padding →  */
/*  “image” (tighter corner radius than the card)   */
/* ─────────────────────────────────────────────── */
function CaseStudyMediaFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <LuminousFrame
      size="sm"
      className={cn("shadow-[0_10px_28px_-10px_rgba(0,0,0,0.55)]", className)}
      innerClassName="bg-[#020202] p-1.5"
    >
      {children}
    </LuminousFrame>
  );
}

/* ─────────────────────────────────────────────── */
/*  Reused mock preview (desktop window / phone)    */
/* ─────────────────────────────────────────────── */
function MockPreview({ project }: { project: Project }) {
  const isMobile = project.category.toLowerCase().includes("mobile");

  if (isMobile) {
    return (
      <div className="flex h-full w-full min-w-0 items-end justify-center gap-2 sm:gap-3">
        {[0, 1, 2].map((i) => (
          <CaseStudyMediaFrame key={i} className="w-fit shrink-0">
            <div
              className={cn(
                "relative h-56 w-28 overflow-hidden rounded-sm bg-black/80 shadow-inner sm:h-72 sm:w-36",
                i === 1 && "h-64 sm:h-80",
              )}
              style={{
                background: `linear-gradient(160deg, ${project.accent}33, transparent 60%), #0a0a0a`,
              }}
            >
              <div className="absolute top-2 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/30" />
              <div className="mt-6 space-y-2 p-3">
                <div
                  className="h-2 w-16 rounded-full"
                  style={{ background: project.accent }}
                />
                <div className="h-2 w-24 rounded-full bg-white/20" />
                <div className="mt-4 h-20 rounded-md bg-white/10" />
                <div className="space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-white/10" />
                  <div className="h-1.5 w-3/4 rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </CaseStudyMediaFrame>
        ))}
      </div>
    );
  }

  return (
    <CaseStudyMediaFrame className="w-full max-w-md">
      <div
        className="relative overflow-hidden rounded-sm border border-white/5 bg-black/40 backdrop-blur"
        style={{
          background: `linear-gradient(160deg, ${project.accent}22, transparent 70%), rgba(0,0,0,0.5)`,
        }}
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 p-2.5">
          <span className="size-1.5 rounded-full bg-red-400/80" />
          <span className="size-1.5 rounded-full bg-yellow-400/80" />
          <span className="size-1.5 rounded-full bg-green-500/80" />
          <span className="ml-3 h-3.5 flex-1 rounded-sm bg-white/5" />
        </div>
        <div className="space-y-3 p-4 sm:p-5">
          <div
            className="h-3 w-24 rounded-full"
            style={{ background: project.accent }}
          />
          <div className="h-6 w-48 rounded-md bg-white/20" />
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-white/10" />
            <div className="h-2 w-5/6 rounded-full bg-white/10" />
            <div className="h-2 w-2/3 rounded-full bg-white/10" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-video rounded-sm bg-white/5 ring-1 ring-white/10"
              />
            ))}
          </div>
          <div className="mt-3 flex gap-2 sm:mt-4">
            <div
              className="h-7 w-24 rounded-full"
              style={{ background: project.accent }}
            />
            <div className="h-7 w-20 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </CaseStudyMediaFrame>
  );
}

export function SectionHeading({
  kicker,
  title,
  className,
  kickerClassName,
  titleClassName,
}: {
  kicker: string;
  title: ReactNode;
  className?: string;
  kickerClassName?: string;
  /** Override for the default Instrument Serif `font-title`. */
  titleClassName?: string;
}) {
  return (
    <div className={cn("text-center", className)}>
      <p
        className={cn(
          "text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase",
          kickerClassName,
        )}
      >
        {kicker}
      </p>
      <h2
        className={cn(
          "text-balance mt-3 text-3xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-4xl sm:leading-[1.08]",
          titleClassName ?? "font-title",
        )}
      >
        {title}
      </h2>
    </div>
  );
}
