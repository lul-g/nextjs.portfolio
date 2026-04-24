export const SITE = {
  name: "Lulseged Admasu",
  initials: "LA",
  email: "hello@lulseged.dev",
  tagline: "Full Stack Developer & Design Engineer",
  location: "Based in Ethiopia, available globally",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
];

export const TECH_STACK = [
  "nextdotjs",
  "react",
  "typescript",
  "tailwindcss",
  "nodedotjs",
  "postgresql",
  "prisma",
  "docker",
  "vercel",
  "git",
  "figma",
  "framer",
  "mongodb",
  "redis",
  "graphql",
  "kubernetes",
];

export const USES_TOOLS = [
  "cursor",
  "figma",
  "arc",
  "raycast",
  "linear",
  "notion",
  "warp",
  "github",
];

export type Project = {
  id: string;
  number: string;
  category: string;
  title: string;
  quarter: string;
  description: string;
  longDescription: string;
  features: string[];
  stack: string[];
  gradient: string;
  accent: string;
};

export const PROJECTS: Project[] = [
  {
    id: "nextdemy",
    number: "01",
    category: "Web App",
    title: "Nextdemy",
    quarter: "Q4 2024",
    description:
      "A monorepo-powered learning platform with real payments, real auth, and real content delivery.",
    longDescription:
      "Full-stack EdTech platform with course marketplace, Razorpay payments, video streaming, and role-based dashboards for students and instructors.",
    features: [
      "Course marketplace with search, categories, ratings, and progress tracking.",
      "Razorpay checkout with server-side payment verification.",
      "Instructor dashboard with course builder, media uploads, and revenue analytics.",
      "JWT auth with role-based access — Student, Instructor, Admin.",
      "Cloudinary-powered video streaming and image delivery.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "TanStack Query",
      "Zustand",
      "Shadcn UI",
      "Motion.dev",
      "Express.js",
      "Bun",
      "MongoDB",
      "Zod",
      "Razorpay",
      "Turborepo",
      "Docker",
    ],
    gradient:
      "linear-gradient(135deg, #0f172a 0%, #134e4a 45%, #0891b2 100%)",
    accent: "#22d3ee",
  },
  {
    id: "next-venture",
    number: "02",
    category: "Web App",
    title: "Next Venture",
    quarter: "Q1 2025",
    description:
      "A space for entrepreneurs to pitch ideas, explore others, and gain exposure with clean design.",
    longDescription:
      "A pitch-sharing platform for founders to publish ideas, gather feedback, and build momentum — powered by Sanity CMS and Better Auth.",
    features: [
      "Sanity-backed content with GROQ queries for rich pitch pages.",
      "Better Auth sessions with OAuth providers and magic links.",
      "Markdown-first pitch editor with live preview.",
      "Sentry-wired error tracking and performance monitoring.",
      "Server components + ISR for fast, fresh pitch feeds.",
    ],
    stack: [
      "Next.js",
      "React",
      "Sanity CMS",
      "TypeScript",
      "Better Auth",
      "GROQ",
      "Sentry",
      "Markdown",
      "Tailwind CSS",
      "Motion.dev",
    ],
    gradient:
      "linear-gradient(135deg, #0b1220 0%, #1e293b 50%, #0f172a 100%)",
    accent: "#f97316",
  },
  {
    id: "finote",
    number: "03",
    category: "Mobile App",
    title: "Finote — Master Your Finances",
    quarter: "Q4 2025",
    description:
      "An intuitive mobile companion for organizing your digital wallets and analyzing your financial health.",
    longDescription:
      "A cross-platform finance companion built with Expo and Firebase — track wallets, visualize spend, and understand your money at a glance.",
    features: [
      "Multi-wallet tracking with live balance aggregation.",
      "Gifted Charts for smooth, animated spend visualizations.",
      "Firebase auth + Firestore sync across devices.",
      "Reanimated gestures for native-feeling transitions.",
      "Cloudinary-powered receipt capture and storage.",
    ],
    stack: [
      "React Native",
      "Expo",
      "TypeScript",
      "Firebase",
      "Zod",
      "Zustand",
      "Cloudinary",
      "Reanimated",
      "Gifted Charts",
    ],
    gradient:
      "linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #ec4899 100%)",
    accent: "#f0abfc",
  },
  {
    id: "starforge",
    number: "04",
    category: "Web App",
    title: "StarForge — AI SaaS Template",
    quarter: "Q1 2024",
    description:
      "A sleek AI SaaS landing page with a user-friendly design that enhances engagement.",
    longDescription:
      "A production-ready AI SaaS template — parallax storytelling, conversion-focused layout, and pixel-perfect motion out of the box.",
    features: [
      "Parallax scroll narrative that sells the product visually.",
      "Conversion-optimized hero, pricing, and CTA structure.",
      "Zero-config Vercel deploy with edge caching.",
      "Fully typed component library for painless customization.",
      "Dark mode, responsive, and Core Web Vitals tuned.",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Parallax",
      "Vercel",
    ],
    gradient:
      "linear-gradient(135deg, #7f1d1d 0%, #be123c 50%, #f43f5e 100%)",
    accent: "#fda4af",
  },
  {
    id: "snippix",
    number: "05",
    category: "Web App",
    title: "Snippix",
    quarter: "Q2 2025",
    description:
      "A platform for creating and sharing code snippets with a clean and intuitive design.",
    longDescription:
      "A snippet playground for developers — syntax-highlighted, keyboard-first, and built to make sharing beautiful code effortless.",
    features: [
      "highlight.js-powered syntax coloring across 180+ languages.",
      "Keyboard shortcuts for every action via react-hotkeys-hook.",
      "Shareable URLs with embedded preview cards.",
      "Zustand-managed snippet library with instant search.",
      "Shadcn UI components for accessible, polished controls.",
    ],
    stack: [
      "Next.js",
      "React",
      "Zustand",
      "TypeScript",
      "Shadcn UI",
      "Tailwind CSS",
      "highlight.js",
      "Hotkeys Hook",
    ],
    gradient:
      "linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)",
    accent: "#fde68a",
  },
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-optimise-a-nextjs-web-app",
    title: "How to Optimise a Next.js Web App",
    excerpt:
      "Practical techniques to fix your Next.js Lighthouse score — bundle analysis, caching strategies, React Compiler, and the next.config flags nobody talks about.",
    date: "Apr 14, 2026",
    readTime: "15 min read",
    image:
      "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)",
  },
  {
    slug: "terminal-first-dev-setup",
    title: "Every Tool in My Terminal-First Dev Setup",
    excerpt:
      "Neovim, Wezterm, Tmux, and the rest — what survived two years of daily use and why I picked each one over the obvious alternatives.",
    date: "Oct 19, 2025",
    readTime: "12 min read",
    image:
      "linear-gradient(135deg, #1f2937 0%, #111827 50%, #030712 100%)",
  },
  {
    slug: "build-a-blog-with-nextjs-and-mdx",
    title: "Build a Blog with Next.js and MDX from Scratch",
    excerpt:
      "File-based content, zero database, full control. A complete walkthrough of building a statically-generated blog with Next.js, MDX, and gray-matter.",
    date: "Mar 12, 2025",
    readTime: "11 min read",
    image:
      "linear-gradient(135deg, #be185d 0%, #db2777 50%, #f472b6 100%)",
  },
];

export type Testimonial = {
  quote: string;
  body: string;
  name: string;
  role: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Shipped faster than any team I've worked with",
    body: "We had designs sitting in Figma for months. A staging link went up in days, production in under two weeks. Page loads dropped under a second and conversions jumped noticeably in the first week.",
    name: "Marcus T.",
    role: "Marketing Director, SaaS startup",
  },
  {
    quote: "A developer who actually listens",
    body: "I'm not technical and previous devs made me feel small for asking questions. I got regular walkthroughs after every milestone so I always knew exactly where things stood, and changes mid-build were handled without friction.",
    name: "Lauren K.",
    role: "Founder, DTC skincare brand",
  },
  {
    quote: "Core Web Vitals went from red to green overnight",
    body: "Our old marketing site scored 38 on PageSpeed. The rebuild scores 97. CMS integration is set up so our content team can publish without touching code. Senior-level architecture and codebase quality.",
    name: "Daniel R.",
    role: "CTO, fintech startup",
  },
  {
    quote: "Caught problems we didn't know we had",
    body: "We hired for product page redesigns. During the build our image pipeline was quietly serving uncompressed files and mobile nav was broken on Safari — both fixed unprompted. That attention to the whole product is rare.",
    name: "James L.",
    role: "Co-founder, e-commerce brand",
  },
  {
    quote: "Turned a messy brief into something beautiful",
    body: "We handed over a half-baked mood board and rough wireframes. What came back was cleaner and more thoughtful than we'd imagined. Animations feel intentional, typography is perfect, and clients have asked us who built it.",
    name: "Sofia M.",
    role: "Creative Director, branding agency",
  },
  {
    quote: "We've shipped four projects together now",
    body: "Started with a landing page, then a client portal, then a headless-CMS blog, and most recently an analytics dashboard. Every project ahead of schedule. Basically our dev team at this point.",
    name: "Ryan H.",
    role: "Founder, B2B agency",
  },
];

export const MY_SITE_TILES = [
  {
    id: "uses",
    title: "Uses",
    description: "Check out my favorite tools",
    href: "/uses",
  },
  {
    id: "about",
    title: "Behind The Code",
    description: "Journey, skills & experience",
    href: "/about",
  },
  {
    id: "guestbook",
    title: "Guestbook",
    description: "Let me know you were here",
    href: "/guestbook",
  },
];

export const MORE_DROPDOWN = {
  featured: [
    {
      label: "Guestbook",
      description: "Let me know you were here",
      href: "/guestbook",
      // Ornate open tome with feather quill — Hogwarts guestbook, but sunlit.
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
      gradient:
        "linear-gradient(135deg, #3b0764 0%, #581c87 40%, #f59e0b 100%)",
    },
    {
      label: "Bucket List",
      description: "Things to do at least once in my life",
      href: "/bucket-list",
      // Tobias van Schneider's iconic mountain layers at sunset — pure wanderlust.
      image:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
      gradient:
        "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 45%, #fde68a 100%)",
    },
  ],
  links: [
    {
      label: "Links",
      description: "All my links are here",
      href: "/links",
      icon: "link",
    },
    {
      label: "Uses",
      description: "A peek into my digital setup",
      href: "/uses",
      icon: "book",
    },
    {
      label: "Attribution",
      description: "Journey to create this site",
      href: "/attribution",
      icon: "card",
    },
  ],
} as const;

export const FOOTER_LINKS = {
  general: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
  ],
  specifics: [
    { label: "Guest Book", href: "/guestbook" },
    { label: "Bucket List", href: "/bucket-list" },
    { label: "Uses", href: "/uses" },
    { label: "Attribution", href: "/attribution" },
  ],
  more: [
    { label: "Book a call", href: "/contact" },
    { label: "Links", href: "/links" },
    { label: "RSS", href: "/rss" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};
