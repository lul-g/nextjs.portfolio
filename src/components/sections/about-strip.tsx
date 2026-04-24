import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/site-data";

export function AboutStrip() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:py-32">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <h2 className="font-display text-3xl leading-[1.06] font-medium tracking-tight sm:text-4xl md:text-[2.75rem]">
            Full-Stack Developer and{" "}
            <span className="font-serif-italic text-foreground/85">
              design-obsessed
            </span>{" "}
            builder.
          </h2>
          <p className="max-w-lg text-muted-foreground">
            I craft dynamic web applications and deliver seamless user
            experiences — from the first spark of an idea to a polished,
            production-ready release.
          </p>
          <Link
            href="/about"
            className="group inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface px-4 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted"
          >
            Behind The Code
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
          <PortraitCard />
          <MonogramCard />
        </div>
      </div>
    </section>
  );
}

function PortraitCard() {
  return (
    <div className="card-lift relative aspect-[3/4] overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30">
      <div className="absolute inset-0 flex items-end justify-center p-5">
        <div className="flex w-full items-end justify-center">
          <div className="relative h-full w-full">
            <svg
              viewBox="0 0 200 240"
              className="h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fde68a" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="90" r="42" fill="url(#skin)" />
              <path
                d="M100 48 Q70 48 62 78 Q60 92 70 96 Q72 70 100 68 Q128 70 130 96 Q140 92 138 78 Q130 48 100 48"
                fill="#1f2937"
              />
              <path
                d="M40 260 Q40 170 100 160 Q160 170 160 260 Z"
                fill="url(#shirt)"
              />
              <circle cx="88" cy="92" r="3" fill="#1f2937" />
              <circle cx="112" cy="92" r="3" fill="#1f2937" />
              <path
                d="M88 108 Q100 116 112 108"
                stroke="#1f2937"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute top-3 left-3 rounded-full bg-background/80 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-foreground/80 backdrop-blur">
        {SITE.name.split(" ")[0]}
      </div>
    </div>
  );
}

function MonogramCard() {
  return (
    <div className="card-lift relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-foreground/5 via-foreground/10 to-foreground/5">
      <div className="absolute inset-0 bg-dot-grid opacity-60" />
      <div className="relative flex size-28 items-center justify-center rounded-2xl bg-foreground text-background shadow-xl sm:size-36">
        <span className="font-display text-4xl font-semibold tracking-tighter sm:text-5xl">
          {SITE.initials}
        </span>
      </div>
      <div className="absolute bottom-3 left-3 text-[10px] tracking-wider text-muted-foreground uppercase">
        Monogram
      </div>
    </div>
  );
}
