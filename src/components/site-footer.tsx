import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FOOTER_LINKS, SITE } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="relative mt-12">
      <div className="cta-wash relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-30" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 pt-24 pb-12 sm:pt-32">
          <div className="text-center">
            <p className="text-xs font-medium tracking-[0.25em] text-foreground/70 uppercase">
              From concept to creation
            </p>
            <h2 className="font-display mt-5 text-[clamp(2.35rem,8.5vw,5.75rem)] leading-[0.9] font-medium tracking-[-0.04em] text-balance sm:mt-6">
              Let&apos;s make it{" "}
              <span className="font-serif-italic">happen!</span>
            </h2>
            <div className="mt-10 flex flex-col items-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Get In Touch
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <p className="max-w-md text-sm text-foreground/70">
                I&apos;m available for full-time roles & freelance projects.
                Let&apos;s build something memorable.
              </p>
            </div>
          </div>

          <div className="grid gap-10 border-t border-foreground/10 pt-12 md:grid-cols-[1.2fr_repeat(3,1fr)]">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-foreground text-background text-xs font-semibold">
                  {SITE.initials}
                </div>
                <span className="font-display text-sm font-medium tracking-tight">
                  {SITE.name}
                </span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-foreground/70">
                I&apos;m {SITE.name.split(" ")[0]} — a full-stack developer,
                freelancer & problem solver. Thanks for checking out my site.
              </p>
            </div>

            <FooterColumn title="General" links={FOOTER_LINKS.general} />
            <FooterColumn title="Specifics" links={FOOTER_LINKS.specifics} />
            <FooterColumn title="More" links={FOOTER_LINKS.more} />
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-6 text-xs text-foreground/60 sm:flex-row">
            <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold tracking-wider text-foreground/80 uppercase">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

