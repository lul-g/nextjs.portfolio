import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CreditCard, Link2 } from "lucide-react";
import { MORE_DROPDOWN } from "@/lib/site-data";

const ICONS = {
  link: Link2,
  book: BookOpen,
  card: CreditCard,
} as const;

// Left-to-right reveal cadence. First tile leads, each subsequent
// item follows by ~100ms so the drawer unfolds as one smooth sweep.
const REVEAL_BASE_MS = 300;
const REVEAL_STEP_MS = 100;

function revealStyle(index: number): CSSProperties {
  return {
    ["--reveal-delay" as string]: `${REVEAL_BASE_MS + index * REVEAL_STEP_MS}ms`,
  };
}

export function MoreDropdown() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[1fr_1fr_1.1fr] gap-3.5">
        {MORE_DROPDOWN.featured.map((item, index) => (
          <div
            key={item.href}
            className="nav-reveal nav-reveal-x"
            style={revealStyle(index)}
          >
            <Link
              href={item.href}
              className="group/tile relative flex aspect-square overflow-hidden rounded-lg"
              style={{ background: item.gradient }}
            >
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 240px"
                className="object-cover transition-transform duration-950 ease-out will-change-transform group-hover/tile:scale-110"
                priority={false}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="font-display text-lg font-medium tracking-tight">
                  {item.label}
                </h3>
                <p className="mt-1 text-xs text-white/80">{item.description}</p>
              </div>
            </Link>
          </div>
        ))}

        <div className="grid h-full grid-rows-3 gap-3.5">
          {MORE_DROPDOWN.links.map((item, index) => {
            const Icon = ICONS[item.icon];
            return (
              <div
                key={item.href}
                className="nav-reveal nav-reveal-y h-full"
                style={revealStyle(MORE_DROPDOWN.featured.length + index)}
              >
                <Link
                  href={item.href}
                  className="nav-row group/row flex h-full items-center gap-3 rounded-lg p-3"
                >
                  <span className="nav-row-icon flex size-10 shrink-0 items-center justify-center rounded-md text-foreground/80 transition-colors group-hover/row:text-foreground">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
