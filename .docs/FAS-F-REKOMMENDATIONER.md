# Fas F — Preskriptiva rekommendationer

## Syfte

Översätta resultaten från Fas A–E till konkret beslutsstöd för Länsförsäkringars entreprenadportfölj. Fokus: prissättning, segmentering, operativ modellanvändning och datainsamling. Ren textsyntes — inga nya beräkningar. Siffror refererar till specifika notebook-celler.

## 1. Ratingfaktorer — vilka håller?

Baserat på rate ratios från B2 (cell med full koefficienttabell) samt deskriptiva slutsatser från A4.

| Variabel | Rate ratio (95 % KI) | Rekommendation | Motivering |
|---|---|---|---|
| `Verksamhet` | 0.64 (Målare) → 1.43 (VVS), ref Byggföretag | **Använd som ratingfaktor** | Spridning 2.2× mellan lägst och högst, stabila estimat (snäva KI) |
| `GeografisktOmrade` | 1.46 (Storstad) vs Landsbyggd; Småstad 0.76 | **Använd som ratingfaktor** | Spridning ~1.9×, konsistent med A3-heatmap |
| `log(Omsättning)` | 1.358 per fördubbling (+35.8 %) | **Använd som storlekskontinuum** | Starkaste enskilda prediktor (A4: 5.6× spridning mellan deciler) |
| `Försäkringsbelopp` | — (ej i modell) | **Avvakta** | Korrelation 0.57 med Omsättning (A4) → multikollinearitet om båda inkluderas |
| `Självrisk` | — (ej i modell) | **Avvakta** | Svagt samband med skadefrekvens (A4-deciler), diskreta nivåer |
| `Ar` | — (ej i modell) | **Följ upp utan drift** | Kan inte prediktera osedda år (M3 i B1). Övervaka årlig drift istället. |

**Affärsbeslut:** De tre valda faktorerna ger tillsammans ~3× spridning i förväntad frekvens mellan lägsta och högsta profil — tillräckligt för meningsfull premiedifferentiering.

## 2. Högrisksegment

Från D1 per-segment-tabell (cell `d1-segments` + `d1-seg-decile`) och A3-heatmap.

- **VVS × Storstad:** Högsta observerade skadefrekvens (~0.04/år, A3-heatmap). Rate ratio 1.43 × 1.46 ≈ 2.09 gånger baselinen Byggföretag/Landsbyggd. **Rekommendation:** Eget prissteg eller tilläggspremie.
- **Omsättningsdeciler D9–D10:** Rate ratio ~2× över median-decilen (A4 + B2 log-effekt). **Rekommendation:** Volymrabatt motiveras *inte* — risken ökar proportionellt med omsättningen.
- **Elektriker × Storstad:** Näst högsta kombinerade rate ratio (1.11 × 1.46 ≈ 1.62). **Rekommendation:** Standardpremie men bevaka.

## 3. Segment som kräver manuell granskning

Från Fas E (cell `e-segments` topp-10-tabell).

Genomgående mönster: **Små nischade verksamheter på Landsbyggden i lägsta och högsta omsättningsdeciler.**

- **Takarbeten × Landsbyggd × D1–D4** — hög relativ osäkerhet (~0.15), få observationer per cell
- **Målare / Grävning & Schaktning × Landsbyggd × D1** — samma mönster
- **Takarbeten × Landsbyggd × D9–D10** — höga omsättningar i litet segment → hävstång i log-omsättning

**Operativt:** Dessa segment ska *inte* automatprissättas via GLM. Manuell underwriting eller riskbaserat påslag tills databasen fylls på.

## 4. Modellarkitektur i drift

- **GLM M2 = huvudmodell för prissättning.** Tolkningsbar, rate ratios med KI (B2), direkt affärslogik. Portföljfel 2025: +1.10 % (D1). Relativ osäkerhet på portfölj 2.8 % (E).
- **XGBoost = challenger / monitor.** D1 visade försumbar förbättring (deviance −0.08 % på 2025). **Roll:** Köra parallellt och larma om gapet växer — signal om att GLM-antaganden börjar svikta (nya interaktioner, tidsdrift).
- **Omskolning:** Refitta båda modellerna årligen när nytt helårsdata finns. Jämför nya rate ratios mot förra årets KI — signifikant rörelse = verksamhetsdrift.

## 5. Begränsningar och datainsamling

### Metodologiska begränsningar

- **Endast frekvens, ej kostnad.** Full premieberäkning kräver även severity-modell (medelskadekostnad × frekvens). Ej i scope här.
- **Observationsdata.** Rate ratios visar *samband*, inte kausala effekter. Inga interventioner testade.
- **Ingen årseffekt modellerad.** `Ar` uteslöts för att kunna prediktera 2025. Möjlig underrapportering av tidstrender — B1-M3 visade dock endast 2 % årlig variation.
- **Wald-KI antar normalitet.** Asymptotiskt korrekt givet n > 10⁶. Eventuell överdispersion kontrollerad i B2 (deviance/df ≈ 1) → ingen material effekt.
- **Portfölj-KI oberoendeantagande:** Fas E använder delta-metod med full kovarians (ger 2.8 % relativ KI). Enkla oberoendeapproxen underskattar kraftigt (<1 %).

### Datainsamling — önskelista

1. **Finkornig branschkod** (SNI eller motsvarande). Nuvarande 7 Verksamhet-kategorier maskerar undergrupper.
2. **Företagsålder + finansiell historik.** Etablerade bolag har sannolikt lägre frekvens än nystartade.
3. **Mer granulär geografi** — postnummer eller kommun istället för 4 nivåer. Skulle fånga lokala riskfaktorer.
4. **Typ av projekt / byggnad** (nybyggnation vs renovering, kommersiell vs bostad).
5. **Historisk skadehistorik per kund.** Enskild kundfaktor är starkast prediktorn för framtida skador i de flesta försäkringsgrenar.
6. **Tidsstämplade skadehändelser** för att möjliggöra säsongsanalys.

## 6. Sammanfattning i ett stycke

GLM M2 rekommenderas som huvudmodell för prissättning av entreprenadförsäkring baserat på `Verksamhet`, `GeografisktOmrade` och log(Omsättning) med `Duration` som exponering. Modellen ger portföljprognos 5 581 skador för 2025 med 95 % KI 5 503–5 659 (observerat utfall 5 520 — inom intervallet). XGBoost presterar likvärdigt men saknar tolkningsbarhet och rekommenderas som parallell challenger för driftövervakning. Högriskssegment (VVS × Storstad, stora omsättningar) prissätts med påslag. Små segment på Landsbyggden (Takarbeten / Målare / Grävning, låga deciler) kräver manuell underwriting tills mer data finns. Viktigaste nästa steg i datainsamling: finare branschkod, kundnivå-historik, granulär geografi.

## Referenser till artefakter

| Avsnitt | Källa |
|---|---|
| Rate ratios | `src/analysis/predictive/B2-modellkontroll-tolkning.ipynb` |
| Segmentjämförelse per Verksamhet/Geografi/Decil | `src/analysis/predictive/D1-modelljamforelse.ipynb` (celler `d1-segments`, `d1-seg-geo`, `d1-seg-decile`) |
| Portfölj-KI för 2025 | `src/analysis/predictive/E-osakerhet.ipynb` (cell `e-portfolio`) |
| Mest/minst osäkra segment | `src/analysis/predictive/E-osakerhet.ipynb` (celler `e-segments`, `e-segments-low`, `e-row-level`) |
| Variabelval | `.docs/A4-SLUTSATS.md` |
| Modellspec M2 | `.docs/FAS-B-FORKLARING.md` |
| XGBoost-jämförelse | `.docs/FAS-C-D-FORKLARING.md` |
