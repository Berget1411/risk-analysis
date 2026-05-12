import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PRICING_EXAMPLE } from "@/lib/data";

export function ComparisonSection() {
  return (
    <section className="space-y-10">
      <div>
        <h2 className="font-heading text-2xl font-bold md:text-3xl">
          5. Analys
        </h2>
      </div>

      {/* 5.1 Samlad tolkning av riskmönster */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          5.1 Samlad tolkning av riskmönster
        </h3>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          <p>
            Resultaten visar att skadefrekvensen inte är jämnt fördelad i
            entreprenadportföljen. Skillnaderna mellan verksamheter, geografiska
            områden och omsättningsnivåer är tillräckligt tydliga för att motivera
            differentierad prissättning. VVS, storstad och hög omsättning
            framstår som de viktigaste riskhöjande faktorerna.
          </p>
          <p>
            Tolkningen är rimlig i försäkringskontext: större företag har fler
            projekt och fler exponeringspunkter, medan arbete i storstad och
            vissa verksamheter kan innebära mer komplexa arbetsmiljöer.
          </p>
          <p>
            Samtidigt ska resultaten tolkas som samband, inte orsakssamband. Att
            VVS har högre skadefrekvens betyder inte att verksamheten i sig
            orsakar skador. Skillnaden kan också spegla kundmix, projekttyp,
            rapporteringsbenägenhet eller säkerhetsrutiner.
          </p>
        </div>
      </div>

      {/* 5.2 Modellval */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          5.2 Modellval
        </h3>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          <p>
            XGBoost ger något lägre Poisson deviance än GLM, men förbättringen är
            mycket liten: cirka 0,21% på valideringsåret 2024 och 0,08% på
            teståret 2025. RMSE och MAE är i princip identiska, och GLM har något
            lägre portföljfel.
          </p>
          <p>
            GLM M2 bör därför väljas som huvudmodell eftersom den är transparent
            och direkt användbar i prissättning. Rate ratios kan översättas till
            premiejusteringar — exempelvis högre premie för VVS, storstad och hög
            omsättning.
          </p>
          <p>
            XGBoost fyller ändå en viktig roll som jämförelsemodell. Att den
            flexibla modellen använder samma tre variabler och landar i samma
            rangordning stärker slutsatsen att GLM fångar portföljens viktigaste
            riskstruktur. Den bästa XGBoost-modellen använder dessutom grunda
            träd, vilket tyder på att sambanden i datan till stor del är additiva.
          </p>
        </div>
      </div>

      {/* 5.3 Antaganden och begränsningar */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          5.3 Antaganden och begränsningar
        </h3>
        <div className="space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          <p>
            Poisson-GLM bygger på antagandet att variansen ungefär motsvarar
            väntevärdet. Överdispersionskontrollen gav en kvot nära 1 (0,986),
            vilket stödjer att Poisson är ett rimligt val.
          </p>
          <p>
            En central begränsning är att datan är artificiell. Onaturligt stabil
            data kan förklara varför GLM och XGBoost presterar nästan identiskt.
            För en rättvisare utvärdering borde modellerna tränas och testas på
            verkliga data.
          </p>
          <p>
            Den viktigaste begränsningen är att modellen bara beskriver
            skadefrekvens — den säger inget om skadornas storlek och kan inte
            ensam ge en fullständig premie. Frekvensmodellen behöver kombineras
            med en separat modell för skadekostnad.
          </p>
          <p>
            Modellen antar att sambanden från 2021–2024 gäller även 2025.
            Makroekonomiska förändringar kan fångas av omsättningen, men för att
            behålla noggrannheten bör modellen följas upp årligen.
          </p>
        </div>
      </div>

      {/* 5.4 Praktisk användning och osäkerhet */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold md:text-xl">
          5.4 Praktisk användning och osäkerhet
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          På portföljnivå är modellen välkalibrerad. GLM predikterar{" "}
          {PRICING_EXAMPLE.result * 1000 > 0 ? "5 581" : "5 581"} skador för
          2025 jämfört med 5 520 observerade — portföljfel +1,1%.
          Konfidensintervallet innehåller det observerade utfallet.
        </p>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">
              Exempelprofil: {PRICING_EXAMPLE.verksamhet}-företag i{" "}
              {PRICING_EXAMPLE.geografi}, 10 MSEK omsättning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded bg-muted px-4 py-3 font-mono text-sm leading-relaxed">
              <p className="text-muted-foreground">
                λ = exp(β₀ + β_verksamhet + β_geografi + β_omsättning ·
                ln(Omsättning)) · Duration
              </p>
              <p className="mt-2">
                = exp(−11,115 + 0,359 + 0,379 + 0,442 · ln(10 000 000)) · 1,0
              </p>
              <p className="mt-1">
                = exp(−3,253) ≈ <strong>0,039</strong>
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Den predikterade frekvensen är ungefär 1,8 gånger portföljens
              genomsnitt (0,021). I ett bestånd av 100 sådana kontrakt förväntas
              cirka fyra skador per år. Rate ratios kan på motsvarande sätt
              användas som multiplikatorer vid premiedifferentiering.
            </p>
          </CardContent>
        </Card>

        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          Stora segment (exempelvis byggföretag i storstad) är relativt
          välkalibrerade och kan användas direkt som tariffstöd, medan mindre
          segment med bredare konfidensintervall bör justeras med
          aktuariebedömning.
        </p>
      </div>
    </section>
  );
}
