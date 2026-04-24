"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import { SITE } from "@/lib/site-data";

/*
  Title: unblur is short so type isn’t “mushy” for 2+ seconds; rise can stay
  a bit longer. (Was one 1.75s transition on all props — kept blur on too long.)
*/
const EASE_ELEGANT = [0.22, 1, 0.36, 1] as const;

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    /* `none` avoids a lingering “almost sharp” subpixel blur in some engines */
    filter: "none",
    transition: {
      filter: { duration: 0.5, delay: 0.12, ease: EASE_ELEGANT },
      opacity: { duration: 0.55, delay: 0.12, ease: EASE_ELEGANT },
      y: { duration: 0.9, delay: 0.12, ease: EASE_ELEGANT },
    },
  },
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, delay: 0.7, ease: EASE_ELEGANT },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, delay: 1.1, ease: EASE_ELEGANT },
  },
};

export function Hero() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <section className="relative isolate mx-auto w-full max-w-7xl px-4 pt-12 sm:pt-16 md:pt-20">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={titleVariants}
        className="font-display relative z-10 mx-auto max-w-4xl text-center text-[clamp(2.15rem,6.25vw,4.4rem)] leading-[0.95] font-medium tracking-[-0.04em] text-balance"
      >
        Design that{" "}
        <span className="font-serif-italic text-foreground/90">speaks</span>.
        <br />
        Code that{" "}
        <span className="font-serif-italic text-foreground/90">lasts</span>.
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={subtitleVariants}
        className="relative z-10 mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground text-balance sm:mt-8 sm:text-base"
      >
        Hi, my name is{" "}
        <span className="font-serif-italic text-foreground/90">
          {SITE.name}
        </span>
        , a full-stack developer from{" "}
        <span className="font-serif-italic text-foreground/90">Ethiopia</span>,
        working with teams across the{" "}
        <span className="font-serif-italic text-foreground/90">
          United States
        </span>
        , building software that feels as considered as it looks.
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={ctaVariants}
        className="relative z-10 mx-auto mt-10 flex flex-wrap items-center justify-center gap-2.5 sm:mt-12"
      >
        <Link
          href="/contact"
          className="group inline-flex h-11 items-center gap-1.5 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Let&apos;s Build Together
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
        <button
          type="button"
          onClick={copyEmail}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border/70 bg-surface px-4 text-sm text-foreground/90 transition-colors hover:bg-canvas-2"
        >
          <span className="text-muted-foreground">Let&apos;s Connect</span>
          <span className="font-medium">{SITE.email}</span>
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5 text-muted-foreground" />
          )}
        </button>
      </motion.div>
    </section>
  );
}
