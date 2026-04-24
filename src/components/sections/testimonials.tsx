import { TESTIMONIALS, type Testimonial } from "@/lib/site-data";
import { SectionHeading } from "@/components/sections/case-studies";

export function Testimonials() {
  const firstRow = TESTIMONIALS.slice(0, 3);
  const secondRow = TESTIMONIALS.slice(3);

  return (
    <section className="relative mx-auto w-full max-w-7xl px-0 py-24 sm:py-32">
      <div className="px-4">
        <SectionHeading
          kicker="TESTIMONIALS"
          title="Word on the street about me"
        />
      </div>

      <div className="mt-14 space-y-4">
        <MarqueeRow
          items={firstRow}
          direction="left"
          speedClass="animate-marquee"
        />
        <MarqueeRow
          items={secondRow}
          direction="right"
          speedClass="animate-marquee-slow"
        />
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  direction,
  speedClass,
}: {
  items: Testimonial[];
  direction: "left" | "right";
  speedClass: string;
}) {
  const doubled = [...items, ...items, ...items];
  return (
    <div className="pause-on-hover group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        className={`${speedClass} flex w-max gap-4`}
        style={direction === "right" ? { animationDirection: "reverse" } : undefined}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[22rem] shrink-0 flex-col gap-4 rounded-2xl border border-border/70 bg-surface p-6 sm:w-[26rem]">
      <blockquote className="space-y-2">
        <p className="text-sm font-medium tracking-tight text-foreground">
          {t.quote}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t.body}
        </p>
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-border/60 pt-4">
        <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-xs font-medium text-white">
          {t.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{t.name}</p>
          <p className="truncate text-xs text-muted-foreground">{t.role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
