import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type LuminousFrameSize = "lg" | "sm";

const outerRadius: Record<LuminousFrameSize, string> = {
  /* ~24px — bento & large cards */
  lg: "rounded-3xl",
  /* Device chrome, nested mockups */
  sm: "rounded-md",
};

/* Inner radius matches outer minus border padding. */
const innerRadius: Record<LuminousFrameSize, string> = {
  /* 24px − 1.5px each side */
  lg: "rounded-[1.3125rem]",
  /* 6px border box − 1px ring */
  sm: "rounded", /* 0.25rem = 4px, pairs with md (−1px) */
};

const pad: Record<LuminousFrameSize, string> = {
  lg: "p-[1.5px]",
  sm: "p-px",
};

type LuminousFrameProps = {
  children: ReactNode;
  className?: string;
  /** Face wraps children — use for `overflow-hidden`, `bg-canvas`, etc. */
  innerClassName?: string;
  size?: LuminousFrameSize;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;

/**
 * “Rim light” border: base stroke + very fine hairline on the outside plus a
 * soft top inner highlight, matching a dark premium card / device chrome. Works
 * in light and dark: light mode dials the rim up slightly so it does not read flat.
 */
export function LuminousFrame({
  children,
  className,
  innerClassName,
  size = "lg",
  ...rest
}: LuminousFrameProps) {
  return (
    <div
      className={cn("luminous-frame", pad[size], outerRadius[size], className)}
      {...rest}
      data-luminous={size}
    >
      <div
        className={cn(
          "luminous-frame__face h-full min-h-0",
          innerRadius[size],
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
