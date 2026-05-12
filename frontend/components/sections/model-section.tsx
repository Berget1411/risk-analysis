"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  MODEL_SELECTION_TABLE,
  GLM_COEFFICIENTS,
  MODEL_COMPARISON_TABLE,
  XGBOOST_CONFIGS,
  KEY_RESULTS,
  UNCERTAINTY_STATS,
} from "@/lib/data";
import { VerksamhetChart } from "@/components/charts/verksamhet-chart";
import { GeografiChart } from "@/components/charts/geografi-chart";
import { HeatmapChart } from "@/components/charts/heatmap-chart";
import { FeatureImportanceChart } from "@/components/charts/feature-importance-chart";

export function ModelSection() {
  return (
    <section className="space-y-10">
      <div>
        <h2 className="font-heading text-2xl font-bold md:text-3xl">
          4. Resultat
        </h2>
      </div>

      {/* 4.1 Poisson-GLM */}
      <div className="space-y-6">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          4.1 Poisson-GLM
        </h3>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Tabell 1: Modellval — AIC och valideringsdeviance (2024)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modell</TableHead>
                    <TableHead>Beskrivning</TableHead>
                    <TableHead className="text-right">AIC</TableHead>
                    <TableHead className="text-right">
                      Valideringsdeviance
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MODEL_SELECTION_TABLE.map((row) => (
                    <TableRow
                      key={row.model}
                      className={
                        row.selected ? "bg-primary/5 font-medium" : undefined
                      }
                    >
                      <TableCell>
                        {row.model}
                        {row.selected && (
                          <Badge className="ml-2" variant="default">
                            Vald
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell className="text-right font-mono">
                        {row.aic.toLocaleString("sv-SE")}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {row.validationDeviance.toLocaleString("sv-SE")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              M2 valdes som slutmodell eftersom Självrisk korrelerar med
              Omsättning. Förbättringen till M3 bedöms inte uppväga den ökade
              komplexiteten i en prissättningskontext.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Tabell 2: Koefficienter och rate ratios (träning 2021–2024, 95% KI)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium">Verksamhet</p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Verksamhet</TableHead>
                        <TableHead className="text-right">β</TableHead>
                        <TableHead className="text-right">Rate ratio</TableHead>
                        <TableHead className="text-right">95% KI</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {GLM_COEFFICIENTS.verksamhet.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell className="text-sm">{row.name}</TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {row.beta}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {row.rateRatio.toFixed(3)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm text-muted-foreground">
                            {row.ci}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Geografiskt område</p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Område</TableHead>
                        <TableHead className="text-right">β</TableHead>
                        <TableHead className="text-right">Rate ratio</TableHead>
                        <TableHead className="text-right">95% KI</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {GLM_COEFFICIENTS.geografi.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell className="text-sm">{row.name}</TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {row.beta}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {row.rateRatio.toFixed(3)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm text-muted-foreground">
                            {row.ci}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            <div className="rounded border p-3 text-sm">
              <strong>log(Omsättning):</strong> β = {GLM_COEFFICIENTS.logOmsattning.beta},
              rate ratio per fördubbling ={" "}
              <span className="font-mono font-semibold">
                {GLM_COEFFICIENTS.logOmsattning.rateRatioPerDoubling}
              </span>{" "}
              (95% KI: {GLM_COEFFICIENTS.logOmsattning.ci})
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Rate Ratios — Verksamhet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VerksamhetChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Rate Ratios — Geografi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GeografiChart />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Figur 1: Skadefrekvens per exponerat år — Verksamhet × Geografi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HeatmapChart />
            <p className="mt-3 text-xs italic text-muted-foreground">
              Skadefrekvensen varierar tydligt mellan verksamhet och geografiskt
              område, vilket motiverar att variablerna bör testas i modellen.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4.2 XGBoost-resultat */}
      <div className="space-y-6">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          4.2 XGBoost-resultat
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          Sex konfigurationer testades med olika träddjup och inlärningstakt. De
          enklare modellerna med träddjup 3 presterade bäst, medan djupare träd
          gav högre deviance. Den bästa konfigurationen var max_depth=3,
          learning_rate=0,10 och 232 träd.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              XGBoost-konfigurationer — Valideringsdeviance 2024
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Konfiguration</TableHead>
                    <TableHead className="text-right">max_depth</TableHead>
                    <TableHead className="text-right">learning_rate</TableHead>
                    <TableHead className="text-right">Träd</TableHead>
                    <TableHead className="text-right">Val. deviance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {XGBOOST_CONFIGS.map((row) => (
                    <TableRow
                      key={row.config}
                      className={
                        row.selected ? "bg-primary/5 font-medium" : undefined
                      }
                    >
                      <TableCell>
                        {row.config}
                        {row.selected && (
                          <Badge className="ml-2" variant="default">
                            Vald
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {row.depth}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {row.lr}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {row.trees}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {row.deviance.toLocaleString("sv-SE")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Feature Importance (Gain)</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureImportanceChart />
            <p className="mt-3 text-xs italic text-muted-foreground">
              XGBoost identifierar samma tre drivare som GLM: log(omsättning)
              (gain=20,04) är klart viktigast, följt av geografiskt område
              (gain=8,26) och verksamhet (gain=6,46).
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4.3 Modelljämförelse */}
      <div className="space-y-6">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          4.3 Modelljämförelse
        </h3>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Tabell 3: Modelljämförelse — slutgiltigt resultat 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mått</TableHead>
                    <TableHead className="text-right">GLM M2</TableHead>
                    <TableHead className="text-right">XGBoost</TableHead>
                    <TableHead className="text-right">Skillnad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MODEL_COMPARISON_TABLE.map((row) => (
                    <TableRow key={row.metric}>
                      <TableCell className="font-medium">{row.metric}</TableCell>
                      <TableCell className="text-right font-mono">
                        {row.glm}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {row.xgboost}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {row.diff}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Båda modellerna presterar i stort sett identiskt på osedd data.
              XGBoost är marginellt bättre på Poisson deviance, medan GLM har
              lite lägre portföljfel.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 4.4 Osäkerhet i prediktioner */}
      <div className="space-y-6">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          4.4 Osäkerhet i prediktioner
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          För hela 2025-portföljen predikterade modellen{" "}
          {KEY_RESULTS.glmPredicted.toLocaleString("sv-SE")} skador med ett
          konfidensintervall på {UNCERTAINTY_STATS.portfolioCI}, vilket
          motsvarar en osäkerhet på {UNCERTAINTY_STATS.portfolioRelative}. Det
          observerade utfallet var {KEY_RESULTS.observedClaims.toLocaleString("sv-SE")}{" "}
          skador, vilket ligger inom intervallet.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Portföljnivå</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  95% KI totala skador
                </span>
                <span className="font-mono font-semibold">
                  {UNCERTAINTY_STATS.portfolioCI}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  Relativ osäkerhet
                </span>
                <span className="font-mono font-semibold">
                  {UNCERTAINTY_STATS.portfolioRelative}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Radnivå</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  Relativ osäkerhet (min)
                </span>
                <span className="font-mono font-semibold">
                  {UNCERTAINTY_STATS.rowLevelMin}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">
                  Relativ osäkerhet (max)
                </span>
                <span className="font-mono font-semibold">
                  {UNCERTAINTY_STATS.rowLevelMax}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Vanliga kundprofiler har smalare intervall. Ovanliga
                kombinationer ger bredare osäkerhet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
