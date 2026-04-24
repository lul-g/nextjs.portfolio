"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export function AnnouncementBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.25, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-center px-4 pt-20 sm:pt-28"
    >
      <Link
        href="/contact"
        className="group relative inline-flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs text-muted-foreground shadow-[0_0_24px_-8px_rgba(16,185,129,0.35)] backdrop-blur transition-colors hover:text-foreground dark:border-emerald-400/20 dark:bg-emerald-400/10"
      >
        <span className="relative grid size-3 place-items-center">
          <span
            className="col-start-1 row-start-1 size-3 animate-ping rounded-full bg-emerald-500/50"
            style={{ animationDuration: "2s" }}
          />
          <span
            className="col-start-1 row-start-1 size-3 animate-ping rounded-full bg-emerald-500/50"
            style={{ animationDuration: "2s", animationDelay: "1s" }}
          />
          <span className="col-start-1 row-start-1 size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
        </span>
        <span className="font-medium text-foreground/90">
          Available to work
        </span>
        <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
