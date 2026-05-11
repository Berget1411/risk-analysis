import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_EXAMPLE, UNCERTAINTY_STATS } from "@/lib/data";

export function PricingSection() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold md:text-3xl">
          Prissättning & Osäkerhet
        </h2>
        <p className="mt-2 text-muted-foreground">
          Rate ratios översätts direkt till premiejusteringar. Här illustreras
          hur modellen kan användas i praktiken.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">
            Exempelprofil: {PRICING_EXAMPLE.verksamhet}-företag i{" "}
            {PRICING_EXAMPLE.geografi}, 10 MSEK omsättning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded bg-muted px-4 py-3 font-mono text-sm leading-relaxed">
            <p className="text-muted-foreground">λ = exp(β₀ + β_verksamhet + β_geografi + β_omsättning · ln(Omsättning)) · Duration</p>
            <p className="mt-2">{PRICING_EXAMPLE.calculation}</p>
            <p className="mt-1">= exp(−3,25) ≈ <strong>{PRICING_EXAMPLE.result}</strong></p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Predikterad frekvens</p>
              <p className="font-mono text-2xl font-bold">{PRICING_EXAMPLE.result}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Portföljsnitt</p>
              <p className="font-mono text-2xl font-bold">{PRICING_EXAMPLE.portfolioAvg}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Relativt portföljen</p>
              <p className="font-mono text-2xl font-bold">{PRICING_EXAMPLE.factor}×</p>
              <Badge variant="destructive" className="mt-1">Högrisk</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            I ett bestånd av 100 sådana kontrakt förväntas cirka fyra skador per
            år. VVS-faktorn 1,43 och storstadsfaktorn 1,46 multipliceras med
            bastariffens nivå.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Portföljnivå</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">95% KI totala skador</span>
              <span className="font-mono font-semibold">{UNCERTAINTY_STATS.portfolioCI}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Relativ osäkerhet</span>
              <span className="font-mono font-semibold">{UNCERTAINTY_STATS.portfolioRelative}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Observerat utfall (5 520) ligger inom intervallet → modellen är
              välkalibrerad på aggregerad nivå.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Radnivå</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Relativ osäkerhet (min)</span>
              <span className="font-mono font-semibold">{UNCERTAINTY_STATS.rowLevelMin}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Relativ osäkerhet (max)</span>
              <span className="font-mono font-semibold">{UNCERTAINTY_STATS.rowLevelMax}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Vanliga kundprofiler har smalare intervall. Ovanliga
              kombinationer av verksamhet, geografi och omsättning ger bredare
              osäkerhet.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Praktisk användning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Rate ratios kan användas som multiplikatorer vid premiedifferentiering.
            Stora segment (byggföretag, storstad) är välkalibrerade och kan användas
            direkt som tariffstöd.
          </p>
          <p>
            Små segment med bredare konfidensintervall bör hanteras försiktigare
            och justeras med aktuariebedömning snarare än mekanisk tillämpning.
          </p>
          <p>
            Modellen bör följas upp årligen. Om sambanden förändras vid inflation,
            lagstiftning eller portföljmix behöver koefficienter omkattas.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
