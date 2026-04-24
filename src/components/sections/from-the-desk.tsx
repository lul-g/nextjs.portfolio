import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BLOG_POSTS } from "@/lib/site-data";
import { SectionHeading } from "@/components/sections/case-studies";

export function FromTheDesk() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:py-32">
      <SectionHeading kicker="FROM THE DESK" title="Thoughts & writings" />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group card-lift flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-surface"
          >
            <div
              className="aspect-[16/10] w-full"
              style={{ background: post.image }}
            />
            <div className="flex flex-1 flex-col gap-3 p-5">
              <h3 className="font-display text-lg leading-snug font-medium tracking-tight text-balance">
                {post.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
                <span>
                  {post.date} · {post.readTime}
                </span>
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface px-4 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-muted"
        >
          Read more posts
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
}
