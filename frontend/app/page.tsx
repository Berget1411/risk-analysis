import { Separator } from "@/components/ui/separator";
import { NavHeader } from "@/components/nav-header";
import { HeroSection } from "@/components/sections/hero-section";
import { DataSection } from "@/components/sections/data-section";
import { ModelSection } from "@/components/sections/model-section";
import { ComparisonSection } from "@/components/sections/comparison-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { ConclusionSection } from "@/components/sections/conclusion-section";
import { GITHUB_URL } from "@/lib/data";

export default function Page() {
  return (
    <>
      <NavHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <div id="oversikt" className="scroll-mt-16">
          <HeroSection />
        </div>

        <Separator className="my-12" />

        <div id="data" className="scroll-mt-16">
          <DataSection />
        </div>

        <Separator className="my-12" />

        <div id="modell" className="scroll-mt-16">
          <ModelSection />
        </div>

        <Separator className="my-12" />

        <div id="jamforelse" className="scroll-mt-16">
          <ComparisonSection />
        </div>

        <Separator className="my-12" />

        <div id="prissattning" className="scroll-mt-16">
          <PricingSection />
        </div>

        <Separator className="my-12" />

        <div id="slutsats" className="scroll-mt-16">
          <ConclusionSection />
        </div>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>
          ME1316 Kvantitativ Affärsanalys — Grupp 40 |{" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            GitHub
          </a>
          {" | "}
          <a href="/rapport.pdf" download className="underline hover:text-foreground">
            Rapport (PDF)
          </a>
        </p>
        <p className="mt-1 text-xs">
          Referens: Broström, A. & Wennberg, K. (2023). Data och modeller – en handbok för analys. Gleerups.
        </p>
      </footer>
    </>
  );
}
