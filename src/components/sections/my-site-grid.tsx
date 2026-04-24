import Link from "next/link";
import { ArrowUpRight, Terminal, User, PenLine } from "lucide-react";
import { SectionHeading } from "@/components/sections/case-studies";
import { cn } from "@/lib/utils";

const TILES = [
  {
    id: "uses",
    title: "Uses",
    description: "Check out my favorite tools",
    href: "/uses",
    Icon: Terminal,
    gradient:
      "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(139,92,246,0.18))",
  },
  {
    id: "about",
    title: "Behind The Code",
    description: "Journey, skills & experience",
    href: "/about",
    Icon: User,
    gradient:
      "linear-gradient(135deg, rgba(236,72,153,0.18), rgba(239,68,68,0.18))",
  },
  {
    id: "guestbook",
    title: "Guestbook",
    description: "Let me know you were here",
    href: "/guestbook",
    Icon: PenLine,
    gradient:
      "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(20,184,166,0.18))",
  },
];

export function MySiteGrid() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:py-32">
      <SectionHeading
        kicker="MY SITE"
        title="Explore, experiment && say hello"
      />

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {TILES.map((tile) => (
          <Link
            key={tile.id}
            href={tile.href}
            className={cn(
              "group card-lift relative flex min-h-48 flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-surface p-6",
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{ background: tile.gradient }}
            />
            <div className="relative flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl border border-border/70 bg-background/60 text-foreground/80 backdrop-blur">
                <tile.Icon className="size-4" />
              </div>
              <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
            </div>
            <div className="relative">
              <h3 className="font-display text-xl font-medium tracking-tight sm:text-2xl">
                {tile.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {tile.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
