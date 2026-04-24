"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { NAV_LINKS } from "@/lib/site-data";
import { ThemeToggle } from "@/components/theme-toggle";
import { MoreDropdown } from "@/components/more-dropdown";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <>
      {/*
        Full-bleed blur strip pinned to the viewport top. The height covers the
        header + its small top gap; a gradient mask fades the blur out at the
        bottom so content doesn't show a hard rectangular edge. Anything that
        scrolls up into this strip gets blurred uniformly — no visible seam
        between the sticky header and the top of the window.
      */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-90 h-16 backdrop-blur-sm sm:h-20"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0, black 72%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, black 0, black 72%, transparent 100%)",
        }}
      />
      <header className="pointer-events-auto sticky top-2 z-100 mx-auto flex w-full max-w-[1440px] items-start justify-between px-2 pt-1.5 sm:top-3 sm:px-3 sm:pt-2">
        <Link
          href="/"
          aria-label="Home"
          className="font-instrument-serif flex h-10 shrink-0 items-end leading-none text-foreground italic text-[2rem] tracking-tight sm:text-[2.1rem]"
        >
          LA
        </Link>

        <nav className="nav-morph group/nav relative flex w-[468px] min-w-0 flex-col has-[[data-more-zone]:focus-within]:w-[760px] has-[[data-more-zone]:hover]:w-[760px] bg-black/5 backdrop-blur-lg">
          <div className="flex h-10 items-center justify-center gap-1 p-1">
            <ul className="hidden h-full items-center gap-1 sm:flex">
              {NAV_LINKS.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <li key={link.href} className="flex h-full items-center">
                    <Link
                      href={link.href}
                      className={cn(
                        "inline-flex h-full items-center rounded-full px-3 text-sm text-muted-foreground transition-colors hover:text-foreground",
                        active && "nav-active text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li
                data-more-zone
                className="group/more flex h-full items-center"
              >
                <button
                  type="button"
                  className="inline-flex h-full cursor-pointer items-center gap-1 rounded-full px-3 text-sm text-muted-foreground transition-colors group-hover/more:text-foreground group-focus-within/more:text-foreground"
                  aria-haspopup="true"
                >
                  More
                  <ChevronDown className="size-3 transition-transform duration-500 group-hover/more:-rotate-180 group-focus-within/more:-rotate-180" />
                </button>
              </li>
            </ul>

            <Link
              href="/contact"
              className="ml-0.5 inline-flex h-8 items-center gap-1 whitespace-nowrap rounded-full border border-border/70 bg-foreground/5 px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/10 dark:border-white/18 dark:bg-white/8 dark:hover:bg-white/14"
            >
              Book a Call
              <ArrowUpRight className="size-3" />
            </Link>
          </div>

          <div
            data-more-zone
            className="nav-drawer grid grid-rows-[0fr] opacity-0 group-has-[[data-more-zone]:focus-within]/nav:grid-rows-[1fr] group-has-[[data-more-zone]:focus-within]/nav:opacity-100 group-has-[[data-more-zone]:hover]/nav:grid-rows-[1fr] group-has-[[data-more-zone]:hover]/nav:opacity-100"
          >
            <div className="overflow-hidden">
              <div className="px-3 pb-3 pt-2">
                <MoreDropdown />
              </div>
            </div>
          </div>
        </nav>

        <ThemeToggle className="nav-shell size-10 shrink-0 border-border/60" />
      </header>
    </>
  );
}
