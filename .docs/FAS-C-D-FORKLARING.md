# Fas C + Fas D — XGBoost Challenger och Modelljämförelse

## Syfte

Bygga XGBoost som utmanare till Poisson-GLM M2 (Fas C) och göra en defensibel jämförelse av båda modellerna på validering (2024) och låst testset (2025) (Fas D). Resultatet avgör om XGBoost ska rekommenderas som pris- eller scoring-motor eller om GLM M2 behålls som huvudmodell.

## Upplägg

| Notebook | Roll |
|---|---|
| `C-xgboost.ipynb` | Bygger XGBoost-baseline, jämför 6 handplockade konfigurationer, sparar bästa som JSON. |
| `D1-modelljamforelse.ipynb` | GLM vs XGBoost på 2024. Sedan slutligt test på 2025 med omskolade modeller. Per-segment-analys + rekommendation. |

## Vad är XGBoost i korthet

XGBoost bygger många små beslutsträd sekventiellt. Varje nytt träd korrigerar felen från de tidigare. Summan av alla träd ger slutprediktionen. För räknedata används `objective="count:poisson"` — modellen förutsäger log(förväntat antal skador) och jämförs med observerat antal via Poisson-likelihood. Samma statistiska ramverk som GLM, men med icke-linjära beslutsgränser istället för en linjär prediktor.

## Principer

- **Feature-paritet:** `Verksamhet`, `GeografisktOmrade`, `log(Omsättning)`. `Ar` exkluderat — GLM M2 kan inte prediktera osedda år (2024/2025 = okända kategorinivåer). XGBoost följer samma begränsning för rättvis jämförelse.
- **Exponering:** `log(Duration)` som offset i GLM och `base_margin` i XGBoost. Båda sätten säger "en policy med dubbel Duration ska få dubbelt förväntat skadeantal, allt annat lika".
- **Temporell split:** Träning 2021–2023, validering 2024, test 2025. 2025 används endast en gång, i D1 del 2.
- **Metrik:** Poisson-deviance (primär, via `sklearn.metrics.mean_poisson_deviance` × antal obs), RMSE, MAE, totalt observerat vs predikterat, portföljfel %.
- **Reproducerbarhet:** Seed 42 överallt. `pd.CategoricalDtype` låst på träningsdatan och återanvänds på val + test.

## Modellval i C (6 konfigurationer)

Istället för slumpmässig hyperparametersökning provas 6 handplockade kombinationer. Täcker rimliga kombinationer av trädjup och inlärningstakt:

| Namn | `max_depth` | `learning_rate` | Val deviance | Portföljfel |
|---|---|---|---|---|
| baseline | 5 | 0.05 | 40,932.7 | −3.43 % |
| shallow-slow | 3 | 0.03 | 40,918.5 | −3.55 % |
| **shallow-fast** | **3** | **0.10** | **40,918.1** | **−3.55 %** |
| medium-slow | 5 | 0.03 | 40,932.2 | −3.27 % |
| deep-slow | 8 | 0.03 | 40,999.0 | −1.86 % |
| deep-fast | 8 | 0.10 | 41,003.9 | −1.23 % |

**Vinnare: `shallow-fast`** (`max_depth=3`, `learning_rate=0.10`, 232 träd). Sparad i `artifacts/C-best-config.json`.

Att grunda träd vinner över djupa är en **tydlig signal** att datan är väsentligen additiv — relationen mellan features och skadefrekvens följer huvudsakligen separata effekter från verksamhet, geografi och omsättning, inte komplexa interaktioner. Det är också exakt vad GLM antar per konstruktion.

## Resultat

### Validering 2024

| Metrik | GLM M2 | XGBoost | Δ (XGB − GLM) |
|---|---|---|---|
| Poisson deviance | 41,002.4 | 40,918.1 | −84.3 (−0.21 %) |
| RMSE | 0.1406 | 0.1406 | ~0 |
| MAE | 0.0375 | 0.0375 | ~0 |
| Totalt observerat | 5,446 | 5,446 | 0 |
| Totalt predikterat | 5,250.3 | 5,252.8 | +2.5 |
| Portföljfel % | −3.59 % | −3.55 % | +0.04 pp |

### Test 2025

| Metrik | GLM M2 | XGBoost | Δ (XGB − GLM) |
|---|---|---|---|
| Poisson deviance | 41,889.2 | 41,855.7 | −33.5 (−0.08 %) |
| Portföljfel % | +1.10 % | +1.22 % | +0.12 pp |

Båda modellerna träffar portföljen inom 1,3 % på 2025 — mycket bra för ett osett år. Skillnaden mellan modellerna är försumbar.

## Slutsats och modellval

XGBoost är marginellt bättre på både 2024-validering (−0.21 %) och 2025-test (−0.08 %) i Poisson-deviance. Portföljfelet är i praktiken identiskt (~1,1–1,2 % på 2025 för båda). Per-segment-tabellerna visar inga segment där XGBoost ger materiell förbättring.

**Rekommendation: Behåll GLM M2 som huvudmodell.**

Motivering:

1. **Prestanda är likvärdig.** Förbättringen på <1 % är för liten för att motivera ökad komplexitet.
2. **Tolkningsbarhet vinner.** GLM M2 ger rate ratios med konfidensintervall (B2) som går direkt att översätta till prissättningsbeslut. XGBoost kräver SHAP eller motsvarande för samma nivå av tolkning.
3. **Inga icke-linjära interaktioner hittades.** Grunda träd (depth 3) vann → signalen är väsentligen additiv, precis som GLM antar. Om starka interaktioner funnits skulle XGBoost vunnit tydligt.
4. **Driftsmässigt enklare.** Färre parametrar, stabilare skattningar, enklare att validera mot regelverk.

**XGBoost rapporteras som sanity check** och challenger-referens i rapporten — bekräftar att GLM M2 inte lämnar systematisk prediktiv vinst på bordet.

## Artefakter

- `src/analysis/predictive/C-xgboost.ipynb`
- `src/analysis/predictive/D1-modelljamforelse.ipynb`
- `src/analysis/predictive/artifacts/C-best-config.json` — låsta hyperparametrar
- `src/analysis/predictive/artifacts/C-candidates.csv` — alla 6 konfigurationer med valideringsresultat

## Verifieringskontroller

- [x] GLM 2024-deviance matchar B1 (41,002.4)
- [x] XGBoost val-deviance < baseline
- [x] Alla prediktioner ≥ 0
- [x] Portföljfel på träning <5 % för båda modellerna
- [x] Inga okända kategorinivåer på 2025
- [x] Seed 42 fixerad
- [x] Versioner loggade i D1 (xgboost 3.2.0, sklearn 1.8.0, statsmodels 0.14.6)
