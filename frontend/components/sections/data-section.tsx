"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PORTFOLIO_STATS } from "@/lib/data";
import { DecilChart } from "@/components/charts/decil-chart";

export function DataSection() {
  return (
    <section className="space-y-10">
      <div>
        <h2 className="font-heading text-2xl font-bold md:text-3xl">
          3. Metod och data
        </h2>
      </div>

      {/* 3.1 Data */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          3.1 Data
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          Projektet bygger på artificiell försäkringsdata uppdelad i en
          träningsfil för 2021–2024 och en testfil för 2025. Varje rad
          representerar ett försäkringskontrakt med information om Verksamhet,
          Geografiskt Område, exponeringstiden Duration, AntalSkador samt
          Försäkringsbelopp, Omsättning och Självrisk.
        </p>
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
                Träningsskador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-2xl font-bold tabular-nums">
                {PORTFOLIO_STATS.trainingClaims.toLocaleString("sv-SE")}
              </p>
              <p className="text-sm text-muted-foreground">skador</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                Testskador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-2xl font-bold tabular-nums">
                {PORTFOLIO_STATS.testClaims.toLocaleString("sv-SE")}
              </p>
              <p className="text-sm text-muted-foreground">skador</p>
            </CardContent>
          </Card>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          Inga saknade värden förekom. AntalSkador är koncentrerad kring noll med
          cirka 98% nollskador — en naturlig följd av låg skadefrekvens per
          försäkringsrad.
        </p>
      </div>

      {/* 3.2 Valideringslogik */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          3.2 Valideringslogik
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          För att efterlikna en verklig prognossituation delades träningsfilen
          tidsmässigt. Slutmodellen tränades om på hela träningsfilen 2021–2024.
          Testfilen för 2025 reserverades för slutlig utvärdering.
        </p>
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {["2021", "2022", "2023"].map((y) => (
                  <Badge key={y} variant="default" className="text-xs">
                    {y}
                  </Badge>
                ))}
              </div>
              <span>→ Träning</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-xs">
                2024
              </Badge>
              <span>→ Validering (modellval, early stopping)</span>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                2025
              </Badge>
              <span>→ Slutlig utvärdering (använd en gång)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3.3 Deskriptiv analys */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          3.3 Deskriptiv analys
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          Den deskriptiva analysen fungerade som ett filter inför modellbygget.
          Variabler med tydliga skillnader i skadefrekvens togs vidare som
          kandidater.
        </p>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Skadefrekvens per decil — Omsättning vs Försäkringsbelopp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DecilChart />
            <p className="mt-3 text-xs italic text-muted-foreground">
              Figur 2 — Skadefrekvensen ökar monotont med ungefär en faktor 5,6
              från lägsta till högsta decilen för omsättning. Försäkringsbelopp
              visar liknande men svagare samband (faktor ~3,2).
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Korrelationsmatris (log-skala)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-1 text-center font-mono text-xs">
                <div />
                <div className="font-semibold text-muted-foreground">Oms.</div>
                <div className="font-semibold text-muted-foreground">
                  FörsB.
                </div>
                <div className="font-semibold text-muted-foreground">
                  Själv.
                </div>
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
              <p className="mt-3 text-xs italic text-muted-foreground">
                Figur 3 — Försäkringsbelopp exkluderades för att undvika
                multikollinearitet (r=0,57 med Omsättning). Omsättning har
                starkare samband med skadefrekvens.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Variabler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {PORTFOLIO_STATS.variables.map((v) => (
                  <Badge key={v} variant="outline" className="text-xs">
                    {v}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Duration</strong> —
                  exponeringstid (andel av år). Behandlas som offset i GLM.
                </p>
                <p>
                  <strong className="text-foreground">Omsättning</strong> —
                  ekonomisk storlek. Log-transformeras. Valdes som
                  storleksvariabel.
                </p>
                <p>
                  <strong className="text-foreground">Försäkringsbelopp</strong>{" "}
                  — exkluderat pga korrelation med Omsättning.
                </p>
                <p>
                  <strong className="text-foreground">Självrisk</strong> —
                  speglar riskaptit snarare än exponering. Exkluderat i
                  slutmodell.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3.4 Poisson-GLM */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          3.4 Poisson-GLM
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          Skadeantal är count-data och modellerades med en Poisson-GLM. Vanlig
          linjär regression är inte lämplig eftersom den kan ge negativa
          prediktioner. Poissonfördelningen kombineras med en log-länk så att
          logaritmen av det förväntade skadeantalet är linjär i riskfaktorerna.
        </p>
        <Card>
          <CardContent className="pt-6">
            <code className="block rounded bg-muted px-4 py-3 font-mono text-sm">
              log(E[AntalSkador]) = log(Duration) + β₀ + β₁·C(Verksamhet) +
              β₂·C(GeografisktOmråde) + β₃·log(Omsättning)
            </code>
          </CardContent>
        </Card>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          Duration behandlas som exponering via offset. Effekterna kan tolkas som
          procentuella skillnader i skadefrekvens. Fyra modeller specificerades
          sekventiellt: M0 (intercept only), M1 (+ Verksamhet + Geografi), M2 (+
          log(Omsättning)) och M3 (+ Självrisk). Modellerna jämfördes med AIC
          och valideringsdeviance på 2024.
        </p>
      </div>

      {/* 3.5 XGBoost */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          3.5 XGBoost
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          XGBoost användes som jämförelsemodell för att undersöka om en mer
          flexibel modell kunde förbättra prediktionen. Samma variabler som i
          slutgiltiga GLM-modellen användes. Sex konfigurationer testades med
          varierande träddjup och inlärningstakt. Antalet träd valdes med early
          stopping mot valideringsåret 2024.
        </p>
      </div>

      {/* 3.6–3.7 */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          3.6 Modelljämförelse & Osäkerhetsanalys
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          Testportföljen 2025 användes för slutlig utvärdering. Huvudmåttet var
          Poisson deviance, kompletterat med RMSE, MAE, totalt predikterat
          skadeantal och portföljfel i procent. XGBoost skulle bara väljas framför
          GLM om förbättringen var tydlig och stabil.
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          Osäkerheten bedömdes med 95-procentiga konfidensintervall, både för
          enskilda försäkringsrader och för hela 2025-portföljen. Relativ
          osäkerhet beräknades som konfidensintervallets bredd dividerad med
          prediktionen.
        </p>
      </div>
    </section>
  );
}
