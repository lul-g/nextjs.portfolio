import type { SVGProps } from "react";
import { cn } from "@/lib/utils";
import {
  siNextdotjs,
  siReact,
  siTypescript,
  siTailwindcss,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siDocker,
  siVercel,
  siGit,
  siFigma,
  siFramer,
  siMongodb,
  siRedis,
  siGraphql,
  siKubernetes,
  siCursor,
  siArc,
  siRaycast,
  siLinear,
  siNotion,
  siWarp,
  siGithub,
  siObsidian,
  siExpress,
  siBun,
  siTurborepo,
  siRazorpay,
  siZod,
  siSentry,
  siSanity,
  siMarkdown,
  siExpo,
  siFirebase,
  siCloudinary,
  siShadcnui,
  siReactquery,
  siClaude,
  siZedindustries,
  type SimpleIcon,
} from "simple-icons";

const ICON_MAP: Record<string, SimpleIcon> = {
  nextdotjs: siNextdotjs,
  react: siReact,
  typescript: siTypescript,
  tailwindcss: siTailwindcss,
  nodedotjs: siNodedotjs,
  postgresql: siPostgresql,
  prisma: siPrisma,
  docker: siDocker,
  vercel: siVercel,
  git: siGit,
  figma: siFigma,
  framer: siFramer,
  mongodb: siMongodb,
  redis: siRedis,
  graphql: siGraphql,
  kubernetes: siKubernetes,
  cursor: siCursor,
  arc: siArc,
  raycast: siRaycast,
  linear: siLinear,
  notion: siNotion,
  warp: siWarp,
  github: siGithub,
  obsidian: siObsidian,
  express: siExpress,
  bun: siBun,
  turborepo: siTurborepo,
  razorpay: siRazorpay,
  zod: siZod,
  sentry: siSentry,
  sanity: siSanity,
  markdown: siMarkdown,
  expo: siExpo,
  firebase: siFirebase,
  cloudinary: siCloudinary,
  shadcnui: siShadcnui,
  reactquery: siReactquery,
  claude: siClaude,
  // simple-icons ships Zed editor as "zedindustries" — alias to the
  // friendlier `zed` slug so callers don't need to know the brand name.
  zed: siZedindustries,
};

// Brands whose hex is effectively black — they'd vanish in dark mode.
// `linear` is included because its actual app/brand mark reads as a
// whitish-grey glyph on dark surfaces; the simple-icons hex (5E6AD2)
// is a marketing accent and doesn't match what people recognize as
// the Linear icon.
// For these we fall back to `currentColor` so the parent can theme them.
const THEME_ADAPTIVE_BRANDS = new Set([
  "nextdotjs",
  "vercel",
  "express",
  "github",
  "linear",
]);

// Some brands don't have a useful monochrome mark — their identity
// lives in the full colored app icon (e.g. Arc's gradient + swirl).
// For these we render the real icon PNG from /public/icons instead of
// the simple-icons SVG so callers get the authentic look.
const IMAGE_ICONS: Record<string, { src: string; title: string }> = {
  arc: { src: "/icons/arc.png", title: "Arc" },
};

type TechIconProps = SVGProps<SVGSVGElement> & {
  slug: string;
  colored?: boolean;
};

export function TechIcon({
  slug,
  colored = false,
  className,
  ...props
}: TechIconProps) {
  // Image-based brand — render the authentic app icon PNG. Sizing is
  // inherited from `className` (e.g. `size-full`) just like the SVG
  // path, so call sites don't need to care which flavour this is.
  const image = IMAGE_ICONS[slug];
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={image.src}
        alt={image.title}
        className={cn("rounded-[22%]", className)}
        draggable={false}
      />
    );
  }

  const icon = ICON_MAP[slug];
  if (!icon) return null;
  const useCurrentColor = !colored || THEME_ADAPTIVE_BRANDS.has(slug);
  const fill = useCurrentColor ? "currentColor" : `#${icon.hex}`;
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={icon.title}
      className={className}
      {...props}
    >
      <title>{icon.title}</title>
      <path d={icon.path} fill={fill} />
    </svg>
  );
}

export function techIconTitle(slug: string) {
  return IMAGE_ICONS[slug]?.title ?? ICON_MAP[slug]?.title ?? slug;
}

export function techIconHex(slug: string) {
  return ICON_MAP[slug]?.hex ?? "ffffff";
}
