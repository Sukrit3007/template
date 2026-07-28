import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ClosingCta } from "@/components/sections/closing-cta";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Network } from "@/components/sections/network";
import { ValueProps } from "@/components/sections/value-props";
import { WhyPanels } from "@/components/sections/why-panels";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="content">
        <Hero />
        <ValueProps />
        <HowItWorks />
        <WhyPanels />
        <Network />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
