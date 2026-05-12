import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Lightbulb } from "lucide-react";

export function ConclusionSection() {
  return (
    <section className="space-y-10">
      <div>
        <h2 className="font-heading text-2xl font-bold md:text-3xl">
          6. Slutsats
        </h2>
      </div>

      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
        <p>
          Projektets huvudfråga var om skadeantal i entreprenadförsäkring kan
          förutsägas med kund-, verksamhets- och försäkringsdata, och om XGBoost
          ger ett tillräckligt mervärde jämfört med en tolkbar Poisson-GLM.
        </p>
        <p>
          Slutsatsen är att skadefrekvensen kan predikteras väl på portföljnivå:
          GLM M2 predikterade 5 581 skador för 2025 jämfört med 5 520
          observerade, vilket motsvarar ett portföljfel på +1,1%. De viktigaste
          ratingfaktorerna är omsättning, geografiskt område och verksamhet.
          Skillnaderna är tillräckligt tydliga för att motivera
          premiedifferentiering, men ska tolkas som samband snarare än
          orsakssamband.
        </p>
        <p>
          XGBoost gav marginellt lägre Poisson deviance än GLM, men förbättringen
          var för liten för att motivera ett modellbyte. GLM M2 rekommenderas
          därför som huvudmodell. Den är stabil, transparent och ger rate ratios
          som kan översättas direkt till prissättnings- och segmenteringsbeslut.
          XGBoost bör i stället användas som challenger för att följa om mer
          komplexa samband får större betydelse i framtida data.
        </p>
        <p>
          Analysen har några viktiga begränsningar. Modellen skattar endast
          skadefrekvens, inte skadekostnad, och räcker därför inte ensam för en
          fullständig försäkringspremie. Den bygger också på antagandet att
          sambanden från 2021–2024 är relevanta för 2025 och framåt.
          Variabelval och jämförelse mellan modellerna påverkas av att datan är
          syntetisk.
        </p>
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
              <p>
                Komplettera med en skadekostnadsmodell (severity) för fullständig
                premieberäkning.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                Följ upp modellen årligen och kontrollera stabiliteten vid
                förändrad inflation eller portföljmix.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                Utveckla med mer detaljerade variabler: företagsålder,
                kundspecifik skadehistorik, detaljerad geografi.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                Validera på verklig data. Syntetisk data kan underskatta
                icke-linjära mönster.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Referenslista</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Chen, T. & Guestrin, C. (2016). XGBoost: A Scalable Tree Boosting
            System. <em>Proceedings of the 22nd ACM SIGKDD International
            Conference on Knowledge Discovery and Data Mining</em>, 785–794.
          </p>
          <p>
            Broström, A. & Wennberg, K. (2023).{" "}
            <em>Data och modeller – en handbok för analys</em>. Upplaga 1.1.
            Gleerups.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
