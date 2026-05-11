"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { MODEL_SELECTION_TABLE, GLM_COEFFICIENTS } from "@/lib/data";
import { VerksamhetChart } from "@/components/charts/verksamhet-chart";
import { GeografiChart } from "@/components/charts/geografi-chart";
import { HeatmapChart } from "@/components/charts/heatmap-chart";

export function ModelSection() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold md:text-3xl">
          Modellspecifikation
        </h2>
        <p className="mt-2 text-muted-foreground">
          Poisson-GLM med log-länk. Skadeantal modelleras som count-data med
          Duration som exponering.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <code className="block rounded bg-muted px-4 py-3 font-mono text-sm">
            log(E[AntalSkador]) = log(Duration) + β₀ + β₁·C(Verksamhet) +
            β₂·C(GeografisktOmråde) + β₃·log(Omsättning)
          </code>
        </CardContent>
      </Card>

      <Tabs defaultValue="modellval">
        <TabsList>
          <TabsTrigger value="modellval">Modellval</TabsTrigger>
          <TabsTrigger value="koefficienter">Koefficienter</TabsTrigger>
          <TabsTrigger value="heatmap">Skadefrekvens</TabsTrigger>
        </TabsList>

        <TabsContent value="modellval" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Modellval — AIC och valideringsdeviance (2024)
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
                        Val. deviance
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MODEL_SELECTION_TABLE.map((row) => (
                      <TableRow
                        key={row.model}
                        className={
                          row.selected
                            ? "bg-primary/5 font-medium"
                            : undefined
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
                M2 valdes: tydlig förbättring i AIC och valideringsdeviance. M3
                (+ Självrisk) ger marginellt bättre passform men sämre
                tolkbarhet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="koefficienter" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Verksamhet — Rate Ratios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Verksamhet</TableHead>
                        <TableHead className="text-right">Rate ratio</TableHead>
                        <TableHead className="text-right">95% KI</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {GLM_COEFFICIENTS.verksamhet.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell className="text-right font-mono">
                            {row.rateRatio.toFixed(3)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">
                            {row.ci}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-6">
                  <VerksamhetChart />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Geografiskt Område — Rate Ratios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Område</TableHead>
                        <TableHead className="text-right">Rate ratio</TableHead>
                        <TableHead className="text-right">95% KI</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {GLM_COEFFICIENTS.geografi.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell className="text-right font-mono">
                            {row.rateRatio.toFixed(3)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">
                            {row.ci}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-6">
                  <GeografiChart />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm">
                <strong>log(Omsättning):</strong> Rate ratio per fördubbling ={" "}
                <span className="font-mono font-semibold">
                  {GLM_COEFFICIENTS.logOmsattning.rateRatioPerDoubling}
                </span>{" "}
                (95% KI: {GLM_COEFFICIENTS.logOmsattning.ci})
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Skadefrekvens per exponerat år — Verksamhet × Geografi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HeatmapChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
