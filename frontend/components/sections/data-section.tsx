import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PORTFOLIO_STATS, CORRELATION_MATRIX } from "@/lib/data";
import { DecilChart } from "@/components/charts/decil-chart";

export function DataSection() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold md:text-3xl">
          Data & Portfölj
        </h2>
        <p className="mt-2 text-muted-foreground">
          Artificiell försäkringsdata uppdelad i en träningsfil (2021–2024) och
          en testfil (2025). Varje rad representerar ett försäkringskontrakt med
          exponeringstid och eventuella skador.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Träningsdata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {PORTFOLIO_STATS.trainingRows.toLocaleString("sv-SE")}
            </p>
            <p className="text-sm text-muted-foreground">
              rader ({PORTFOLIO_STATS.trainingPeriod})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Testdata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {PORTFOLIO_STATS.testRows.toLocaleString("sv-SE")}
            </p>
            <p className="text-sm text-muted-foreground">
              rader ({PORTFOLIO_STATS.testPeriod})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Snittfrekvens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-bold tabular-nums">
              {PORTFOLIO_STATS.avgClaimFreq}
            </p>
            <p className="text-sm text-muted-foreground">
              skador/exp. år
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-muted-foreground">
              Nollskador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-bold tabular-nums">
              ~{PORTFOLIO_STATS.zeroPct}%
            </p>
            <p className="text-sm text-muted-foreground">
              av alla rader
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Variabler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {PORTFOLIO_STATS.variables.map((v) => (
              <Badge key={v} variant="outline" className="text-xs">
                {v}
              </Badge>
            ))}
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <p><strong className="text-foreground">Duration</strong> — exponeringstid (andel av år, 0–1). Behandlas som offset i GLM.</p>
              <p><strong className="text-foreground">Omsättning</strong> — ekonomisk storlek. Log-transformeras. Starkare samband med frekvens (faktor 5,6 mellan lägsta och högsta decil).</p>
            </div>
            <div className="space-y-1">
              <p><strong className="text-foreground">Försäkringsbelopp</strong> — korrelerar med Omsättning (r=0,57). Exkluderas pga multikollinearitet.</p>
              <p><strong className="text-foreground">Självrisk</strong> — korrelerar med Omsättning (r=0,45). Speglar riskaptit snarare än exponering.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skadefrekvens per decil</CardTitle>
          </CardHeader>
          <CardContent>
            <DecilChart />
            <p className="mt-2 text-xs text-muted-foreground">
              Omsättning visar monotont ökande samband med faktor ~5,6.
              Försäkringsbelopp visar svagare samband (~3,2×).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Korrelationsmatris (log-skala)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-1 text-center text-xs font-mono">
              <div />
              <div className="font-semibold text-muted-foreground">Oms.</div>
              <div className="font-semibold text-muted-foreground">FörsB.</div>
              <div className="font-semibold text-muted-foreground">Själv.</div>

              <div className="text-left font-semibold">Oms.</div>
              <div className="rounded bg-chart-5 py-2 text-white">1,00</div>
              <div className="rounded bg-chart-3 py-2 text-white">0,57</div>
              <div className="rounded bg-chart-2 py-2">0,45</div>

              <div className="text-left font-semibold">FörsB.</div>
              <div className="rounded bg-chart-3 py-2 text-white">0,57</div>
              <div className="rounded bg-chart-5 py-2 text-white">1,00</div>
              <div className="rounded bg-chart-1 py-2">0,26</div>

              <div className="text-left font-semibold">Själv.</div>
              <div className="rounded bg-chart-2 py-2">0,45</div>
              <div className="rounded bg-chart-1 py-2">0,26</div>
              <div className="rounded bg-chart-5 py-2 text-white">1,00</div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Omsättning och Försäkringsbelopp bär liknande information
              (r=0,57). Omsättning valdes för starkare samband med
              skadefrekvens.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Valideringslogik</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {["2021", "2022", "2023"].map((y) => (
                <Badge key={y} variant="default" className="text-xs">{y}</Badge>
              ))}
            </div>
            <span>→ Träning</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-xs">2024</Badge>
            <span>→ Validering (modellval, early stopping)</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-xs">2025</Badge>
            <span>→ Slutlig utvärdering (använd en gång)</span>
          </div>
          <p className="mt-2">
            Temporal uppdelning undviker look-ahead bias. Slutmodellen
            omtränas på 2021–2024 innan 2025-prediktion.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
