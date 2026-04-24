import { AnnouncementBar } from "@/components/announcement-bar";
import { Hero } from "@/components/sections/hero";
import { TechDock } from "@/components/sections/tech-dock";
import { Bento } from "@/components/sections/bento";
import { CaseStudies } from "@/components/sections/case-studies";
import { FromTheDesk } from "@/components/sections/from-the-desk";
import { AboutStrip } from "@/components/sections/about-strip";
import { Testimonials } from "@/components/sections/testimonials";
import { MySiteGrid } from "@/components/sections/my-site-grid";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Hero />
      <TechDock />
      <Bento />
      <CaseStudies />
      <FromTheDesk />
      <AboutStrip />
      <Testimonials />
      <MySiteGrid />
    </>
  );
}
