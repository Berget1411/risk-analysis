import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export function ConclusionSection() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold md:text-3xl">
          Slutsats & Rekommendationer
        </h2>
        <p className="mt-2 text-muted-foreground">
          Skadefrekvensen kan predikteras väl på portföljnivå. GLM M2 ger
          bäst balans mellan träffsäkerhet, stabilitet och tolkbarhet för
          användning i prissättningskontext.
        </p>
      </div>

      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
            <div className="space-y-2">
              <p className="font-medium">
                Huvudslutsats: Skadefrekvensen kan förutsägas väl
              </p>
              <p className="text-sm text-muted-foreground">
                GLM M2 predikterade 5 581 skador i 2025-portföljen mot 5 520
                observerade — portföljfel +1,1%. De viktigaste
                ratingfaktorerna är omsättning, geografiskt område och
                verksamhet. XGBoost gav marginellt lägre Poisson deviance men
                förbättringen (0,08%) var för liten för att motivera modellbyte.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Modellprestanda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Portföljfel +1,1%. Konfidensintervallet [5 503–5 658] täcker utfallet.</p>
            <p>Overdispersion = 0,986 → Poisson-antagandet stödjs.</p>
            <p>Identisk RMSE/MAE mellan GLM och XGBoost.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Riskmönster</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>VVS 1,43× och Storstad 1,46× — högsta risknivåer.</p>
            <p>Omsättning har faktor 5,6 mellan lägsta och högsta decil.</p>
            <p>Tolkbar i försäkringskontext: fler projekt, fler exponeringspunkter.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Begränsningar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Enbart skadefrekvens — för fullständig premie behövs skadekostnadsmodell.</p>
            <p>Artificiell data — onaturligt stabil, varför GLM ≈ XGBoost.</p>
            <p>Antar att samband 2021–2024 gäller 2025+.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-5 w-5 text-primary" />
            Rekommendationer för fortsatt arbete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>Använd GLM M2 som primär tariffmodell. Rate ratios översätts direkt till premiejusteringar.</p>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>Behåll XGBoost som kontrollmodell. Om framtida data ger större gap, undersök icke-linjära samband.</p>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>Komplettera med skadekostnadsmodell (severity) för fullständig premieberäkning.</p>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>Samla in mer detaljerade variabler: företagsålder, kundspecifik skadehistorik, detaljerad geografi.</p>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>Följ upp modellen årligen. Kontrollera om sambanden är stabila vid förändrad inflation eller portföljmix.</p>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>Validera på verklig data. Syntetisk data kan underskatta icke-linjära mönster.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analysflöde (Broström, 2023)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="default">Deskriptiv</Badge>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <Badge variant="default">Prediktiv</Badge>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <Badge variant="default">Preskriptiv</Badge>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Beskrivning → Modellering → Rekommendationer. Analyslogiken
            följer den tredelade strukturen i kurslitteraturen.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
