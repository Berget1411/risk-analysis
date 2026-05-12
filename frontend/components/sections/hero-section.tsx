import { ExternalLink, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AUTHORS, GITHUB_URL } from "@/lib/data";

export function HeroSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-5xl">
            Skadefrekvensanalys
          </h1>
          <p className="mt-2 font-heading text-xl text-muted-foreground md:text-2xl">
            Entreprenadförsäkring
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            ME1316 Kvantitativ Affärsanalys — Grupp 40
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {AUTHORS.map((author) => (
              <Badge key={author} variant="secondary">
                {author}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          <p>
            I skadeförsäkring ska premien spegla den risk kunden förväntas bidra
            med. Risken delas upp i två delar: hur ofta skador inträffar och hur
            stora kostnaderna blir. Detta projekt fokuserar på den första delen
            — <strong className="text-foreground">skadefrekvensen</strong>.
          </p>
          <p>
            Syftet är att undersöka om skadeantal kan förutsägas med hjälp av
            kund-, verksamhets- och försäkringsdata. Analysen jämför en
            Poisson-GLM, som är transparent och etablerad för skadeantal, med
            XGBoost, en mer flexibel maskininlärningsmodell.
          </p>
        </div>

        <blockquote className="mx-auto max-w-3xl border-l-4 border-primary pl-4 italic">
          Hur väl kan skadeantal i entreprenadförsäkring förutsägas med hjälp av
          kund-, verksamhets- och försäkringsdata?
        </blockquote>

        <div className="mx-auto max-w-3xl space-y-2 text-sm text-muted-foreground md:text-base">
          <p className="font-medium text-foreground">Delfrågor:</p>
          <ul className="list-inside list-disc space-y-1 pl-2">
            <li>Vilka portföljsegment har högst respektive lägst skadefrekvens?</li>
            <li>Vilka variabler framstår som mest relevanta ratingfaktorer?</li>
          </ul>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <Button asChild>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/rapport.pdf" download>
              <FileDown className="mr-2 h-4 w-4" />
              Rapport (PDF)
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
