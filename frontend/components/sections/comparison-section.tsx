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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MODEL_COMPARISON_TABLE, XGBOOST_CONFIGS } from "@/lib/data";
import { FeatureImportanceChart } from "@/components/charts/feature-importance-chart";

export function ComparisonSection() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold md:text-3xl">
          Modelljämförelse
        </h2>
        <p className="mt-2 text-muted-foreground">
          GLM M2 jämförs med XGBoost på testportföljen 2025. Samma
          informationsset används: Verksamhet, GeografisktOmråde,
          log(Omsättning) och log(Duration) som exponering.
        </p>
      </div>

      <Tabs defaultValue="resultat">
        <TabsList>
          <TabsTrigger value="resultat">Slutresultat 2025</TabsTrigger>
          <TabsTrigger value="xgboost">XGBoost-konfigurationer</TabsTrigger>
        </TabsList>

        <TabsContent value="resultat" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Slutgiltig utvärdering — Testår 2025
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
                        <TableCell className="font-medium">
                          {row.metric}
                        </TableCell>
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
              <div className="mt-4 rounded bg-muted/50 p-3 text-sm text-muted-foreground">
                <strong className="text-foreground">Takeaway:</strong> RMSE och
                MAE är identiska. XGBoost ger 0,08% bättre deviance men GLM har
                lägre portföljfel. Skillnaden är för liten för att motivera
                modellbyte.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="xgboost" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Sex XGBoost-konfigurationer — Valideringsdeviance 2024
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
                        className={row.selected ? "bg-primary/5 font-medium" : undefined}
                      >
                        <TableCell>
                          {row.config}
                          {row.selected && (
                            <Badge className="ml-2" variant="default">Vald</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-mono">{row.depth}</TableCell>
                        <TableCell className="text-right font-mono">{row.lr}</TableCell>
                        <TableCell className="text-right font-mono">{row.trees}</TableCell>
                        <TableCell className="text-right font-mono">
                          {row.deviance.toLocaleString("sv-SE")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Grundare modeller (depth=3) presterar bäst. Djupare träd ger
                högre deviance — tyder på att sambanden i datan är additivt
                snarare än starkt komplexa.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Feature Importance (Gain)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureImportanceChart />
            <p className="mt-3 text-xs text-muted-foreground">
              XGBoost identifierar samma tre drivare i samma rangordning som
              GLM. log(Omsättning) dominerar, geografi före verksamhet.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Analys: Varför GLM vinner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Identisk rankningsordning</strong> — att ML-modellen landar i samma rangordning stärker
              förtroendet för GLM:s variabelval.
            </p>
            <p>
              <strong className="text-foreground">Grunda träd bäst</strong> — XGBoost med depth=3 slår depth=5/7,
              vilket bekräftar att portföljens riskstruktur är i huvudsak additiv.
            </p>
            <p>
              <strong className="text-foreground">Tolkbarhet</strong> — GLM ger rate ratios som direkt
              översätts till premiejusteringar. XGBoost kräver SHAP-värden
              för tolkning.
            </p>
            <p>
              <strong className="text-foreground">Slutsats:</strong>{" "}
              GLM M2 rekommenderas som huvudmodell. XGBoost fyller en viktig
              roll som kontrollmodell över tid.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
