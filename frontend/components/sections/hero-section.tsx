import { ExternalLink, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AUTHORS, GITHUB_URL, KEY_RESULTS } from "@/lib/data";

export function HeroSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="space-y-6 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight md:text-5xl">
          Skadefrekvensanalys
        </h1>
        <p className="font-heading text-xl text-muted-foreground md:text-2xl">
          Entreprenadförsäkring
        </p>
        <p className="text-sm text-muted-foreground">
          ME1316 Kvantitativ Affärsanalys — Grupp 40
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {AUTHORS.map((author) => (
            <Badge key={author} variant="secondary">
              {author}
            </Badge>
          ))}
        </div>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
          Hur väl kan skadeantal i entreprenadförsäkring förutsägas med hjälp
          av kund-, verksamhets- och försäkringsdata? Analys med Poisson-GLM
          och XGBoost.
        </p>
        <div className="flex justify-center gap-3">
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

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground">
              Observerade skador 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {KEY_RESULTS.observedClaims.toLocaleString("sv-SE")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground">
              GLM M2 prediktion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {KEY_RESULTS.glmPredicted.toLocaleString("sv-SE")}
            </p>
            <Badge variant="secondary" className="mt-1 text-xs">
              {KEY_RESULTS.glmError}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground">
              XGBoost prediktion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {KEY_RESULTS.xgbPredicted.toLocaleString("sv-SE")}
            </p>
            <Badge variant="secondary" className="mt-1 text-xs">
              {KEY_RESULTS.xgbError}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground">
              95% konfidensintervall
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {KEY_RESULTS.ci95Low.toLocaleString("sv-SE")}–
              {KEY_RESULTS.ci95High.toLocaleString("sv-SE")}
            </p>
            <Badge variant="secondary" className="mt-1 text-xs">
              ±{KEY_RESULTS.ciWidth}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-normal text-muted-foreground">
              Overdispersion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {KEY_RESULTS.overdispersion}
            </p>
            <Badge variant="secondary" className="mt-1 text-xs">
              Poisson OK
            </Badge>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
