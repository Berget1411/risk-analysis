PLEASE IMPLEMENT THIS PLAN:
# PLAN.md — Riskanalys Entreprenadförsäkring (ME1316, KTH)

## Kontext

Länsförsäkringars entreprenadportfölj (~1M policyer 2021-2024, ~291K testpolicyer 2025). Uppgift: modellera skadefrekvens (AntalSkador) med Poisson GLM och XGBoost, jämföra, och ge beslutsunderlag. Kursen kräver deskriptiv → prediktiv → preskriptiv analyskedja enligt kursboken "Data, Modeller och Verkligheter" (Broström).

Rapporten ska följa Mall projektrapport ME1316: Inledning → Ämnesbeskrivning → Metod → Resultat → Analys → Slutsats.

---

## 1. Förbättrade frågeställningar

**(1) Ratingfaktorernas effekt**
Vilka variabler har statistiskt signifikant effekt på skadefrekvensen i en Poisson-regressionsmodell, och hur stora är effekterna uttryckta som incidenskvottal (IRR)? Tolkning i försäkringstekniskt och affärsmässigt sammanhang.

**(2) Multikollinearitet och variabelval**
Hur påverkar korrelationen mellan Omsättning, Försäkringsbelopp och Självrisk modellens stabilitet (VIF) och prediktiva förmåga (AIC), och vilken kombination av ekonomiska variabler ger bäst modell?

**(3) Tidsvariation och kohorteffekter**
Finns statistiskt signifikanta årseffekter 2021-2024, och förbättrar inklusion av årseffekter prognosförmågan för 2025?

**(4) Prognosnoggrannhet och konfidensintervall**
Hur väl stämmer totalt predikterat skadeantal med faktiskt utfall 2025? Hur brett är konfidensintervallet (delta-metoden + parametrisk bootstrap)? Vilka policyer har högst/lägst prediktionsosäkerhet — och vilka kovariatkombinationer driver det?

**(5) GLM vs ML**
Ger XGBoost bättre prediktiv förmåga än Poisson GLM på testdatan, och motiverar eventuell förbättring den ökade komplexiteten? Koppling till kursbokens resonemang om modellkomplexitet vs tolkbarhet (Kap. 5).

**(6) Moderationsanalys**
Modererar GeografisktOmråde effekten av Omsättning → skadefrekvens? Dvs: är sambandet företagsstorlek–skadefrekvens starkare i storstad? Specifikation: `Y = β₀ + β₁·log(Oms) + β₂·Geografi + β₃·log(Oms)×Geografi + offset(log(Duration))`

---

## 2. Data

| Fil | Rader | Period | Roll |
|-----|-------|--------|------|
| `data/Entreprenadförsäkring training.csv` | ~1 033 386 | 2021-2024 | Träning |
| `data/Entreprenadförsäkring test.csv` | ~291 649 | 2025 | Test |

**Kolumner:** Omsattning, Verksamhet (7 kat), GeografisktOmrade (4 kat), Ar, Forsakringsbelopp, Sjalvrisk, AntalSkador (count, 98% nollor), Duration (exponering 0-1)

**Viktigt:** Omsättning/Försäkringsbelopp/Självrisk kraftigt högerskevda → log-transformera. Duration används som offset (log(Duration)) i Poisson GLM, inte som vanlig förklarande variabel.

---

## 3. Filstruktur

```
src/
├── descriptive-analysis.ipynb   ← BEFINTLIG, kompletteras med visualiseringar
├── poisson-glm.ipynb            ← NY, statsmodels Poisson GLM (Fas B)
├── xgboost-model.ipynb          ← NY, XGBoost count:poisson (Fas C)
├── model-comparison.ipynb       ← NY, jämförelse + osäkerhetsanalys (Fas D)
├── prescriptive-analysis.ipynb  ← NY, preskriptiv analys / beslutsunderlag (Fas E)
└── pyproject.toml               ← BEFINTLIG, alla deps redan på plats
```

Beroenden i `src/pyproject.toml` täcker redan: statsmodels ≥0.14.5, xgboost ≥3.1.0, scikit-learn, seaborn, matplotlib, pandas, numpy. Eventuellt lägg till `shap` för SHAP-analys av XGBoost.

---

## Fas A — Deskriptiv analys (komplettera `src/descriptive-analysis.ipynb`)

### Redan klart (sektionerna 2-11)
- Skadebild: 98.12% nollor, 19 730 skador, frekvens 0.02135/exponeringsår
- Numeriska variabelsammanfattningar
- Frekvens per Verksamhet, GeografisktOmråde, År
- Duration som exponering (stabil frekvens över durationsband)
- Storleksdeciler vs skadefrekvens
- Korrelationsmatris (r ≈ 0.21-0.46)
- Topp-riskkombinationer (VVS × Storstad högst)

### Att lägga till

1. **Visualiseringar med seaborn/matplotlib:**
   - `sns.barplot` — skadefrekvens per Verksamhet (sorterat, horisontellt)
   - `sns.barplot` — skadefrekvens per GeografisktOmråde
   - `sns.heatmap` — 7×4 matris Verksamhet × Geografi skadefrekvens (`annot=True, fmt=".4f"`)
   - `sns.heatmap` — korrelationsmatris (råa + log-transformerade ekonomiska variabler)
   - `plt.plot` — skadefrekvens över tid 2021-2024 (linjediagram)
   - Histogram/KDE av log(Omsättning), log(Försäkringsbelopp), log(Självrisk)
   - Boxplot av Duration

2. **Pairplot:** `sns.pairplot` av log-transformerade ekonomiska variabler, färgade efter `AntalSkador > 0`, för visuell separation.

3. **Kursbokskoppling:** Kap 2 (beskriva data — medelvärde, median, spridningsmått, visualisering, samvariation), Kap 3 (validitet & reliabilitet — portföljdata har hög reliabilitet, diskutera Omsättning som construct-validitet-mått på riskexponering), Kap 2.4 (sammanfattande råd — korrelationstabell).

---

## Fas B — Poisson GLM med statsmodels (`src/poisson-glm.ipynb`)

### Varför statsmodels, inte sklearn?
`sklearn.linear_model.PoissonRegressor` (som befintlig `test-analysis/insurance_analysis.py` använder) ger koefficienter men **inga p-värden, inget AIC, inga deviansresidualer, inget VIF, inga konfidensintervall**. Kursen kräver statistisk inferens → statsmodels.

### Steg

#### B.1 Datapreparering
```python
import statsmodels.api as sm
import statsmodels.formula.api as smf

df["log_Omsattning"] = np.log1p(df["Omsattning"])
df["log_Forsakringsbelopp"] = np.log1p(df["Forsakringsbelopp"])
df["log_Sjalvrisk"] = np.log1p(df["Sjalvrisk"])
df["log_Duration"] = np.log(df["Duration"].clip(lower=1e-9))
```

Referenskategorier: Byggföretag (40% av portföljen, störst) och Landsbyggd (lägst frekvens).

#### B.2 Modellspecifikation (formula API)
```python
model = smf.glm(
    'AntalSkador ~ C(Verksamhet, Treatment("Byggföretag")) + '
    'C(GeografisktOmrade, Treatment("Landsbyggd")) + '
    'log_Omsattning',
    data=df,
    family=sm.families.Poisson(),
    offset=df["log_Duration"]
)
results = model.fit()
print(results.summary())
```

#### B.3 Variabelval via AIC-jämförelse (→ fråga 2)
Anpassa en serie nästlade modeller och jämför `results.aic`:

| Modell | Variabler | AIC |
|--------|-----------|-----|
| M1 | Verksamhet + Geografi | ? |
| M2 | M1 + log_Omsattning | ? |
| M3 | M1 + log_Forsakringsbelopp | ? |
| M4 | M1 + log_Sjalvrisk | ? |
| M5 | M2 + log_Sjalvrisk | ? |
| M6 | M2 + Ar (som kategorisk) | ? |
| M7 | M2 + Verksamhet × Geografi (interaktion) | ? |

Systematisk AIC-tabell avgör vilken ekonomisk variabel som har störst förklaringskraft och om multikollinearitetsproblem motiverar att utesluta Försäkringsbelopp.

#### B.4 VIF-analys (→ fråga 2)
```python
from statsmodels.stats.outliers_influence import variance_inflation_factor

X_numeric = df[["log_Omsattning", "log_Forsakringsbelopp", "log_Sjalvrisk"]].values
X_numeric = sm.add_constant(X_numeric)
for i in range(1, X_numeric.shape[1]):
    print(f"VIF {i}: {variance_inflation_factor(X_numeric, i):.2f}")
```
Tumregel: VIF > 5 → överväg att ta bort variabel. Korrelationer (0.21-0.46) antyder VIF ≈ 1.2-1.5 → troligen OK, men verifiera.

#### B.5 Dispersiontest — behövs negativ binomial?
```python
dispersion = results.pearson_chi2 / results.df_resid
print(f"Dispersion ratio: {dispersion:.4f}")
```
Deskriptiv analys visade varians/medelvärde ≈ 1.009 → stark indikation att Poisson passar. Om dispersion > 1.5 → överväg NB. Anpassa NB som robusthetstest oavsett och jämför AIC.

#### B.6 IRR-tabell med konfidensintervall (→ fråga 1, centralresultat)
```python
irr = np.exp(results.params)
irr_ci = np.exp(results.conf_int())
p_values = results.pvalues

irr_table = pd.DataFrame({
    "Koefficient": results.params,
    "IRR": irr,
    "95% KI nedre": irr_ci[0],
    "95% KI övre": irr_ci[1],
    "p-värde": p_values
})
```
Tolkning: IRR = 1.45 för VVS → VVS har 45% högre skadefrekvens än Byggföretag (referens), allt annat lika.

#### B.7 Residualdiagnostik
- Deviansresidualer vs predikterade värden (`results.resid_deviance` vs `results.fittedvalues`)
- Q-Q-plot av deviansresidualer
- OBS: count-data med 98% nollor → residualer ser diskreta ut, fokusera på systematiska mönster

#### B.8 Interaktions-/moderationsanalys (→ fråga 6)
```python
# Verksamhet × Geografi interaktion
model_interact = smf.glm(
    'AntalSkador ~ C(Verksamhet) * C(GeografisktOmrade) + log_Omsattning',
    data=df, family=sm.families.Poisson(), offset=df["log_Duration"]
)

# Moderationstest: Geografi modererar Omsättning→frekvens?
model_moderate = smf.glm(
    'AntalSkador ~ C(Verksamhet) + C(GeografisktOmrade) + log_Omsattning + '
    'log_Omsattning:C(GeografisktOmrade)',
    data=df, family=sm.families.Poisson(), offset=df["log_Duration"]
)
```
Jämför AIC med grundmodell. Deskriptiv analys antyder interaktion (VVS×Storstad oproportionerligt hög).

#### B.9 Årseffekter (→ fråga 3)
Jämför modell med och utan `C(Ar)`. Befintlig analys visar att årsmodellen har nästan identisk devianse på validering men sämre totalprediktioner vid extrapolering till 2025 (linjär trend-extrapolering osäker). Koppla till Kap 7.3 (prognosmodeller) — DGP kan förändras.

---

## Fas C — XGBoost (`src/xgboost-model.ipynb`)

### C.1 Modellkonfiguration
```python
import xgboost as xgb

model = xgb.XGBRegressor(
    objective="count:poisson",
    learning_rate=0.05,
    max_depth=4,
    n_estimators=500,
    min_child_weight=1000,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_lambda=1.0,
    enable_categorical=True,
    random_state=42
)
```

### C.2 Feature engineering
- Samma log-transformerade numeriska features: log_Omsattning, log_Forsakringsbelopp, log_Sjalvrisk
- Verksamhet och GeografisktOmrade → `pd.Categorical` (XGBoost hanterar nativt med `enable_categorical=True`)
- Target: `claim_rate = AntalSkador / Duration` med `sample_weight=Duration`
- Optionellt: ArNum = Ar - 2021 (numerisk)

### C.3 Hyperparametertuning (resurssnålt)
**Inte** dyr grid search på 1M rader. Istället:
1. Träna på 2021-2023, validera på 2024 (early stopping)
2. `eval_set=[(X_val, y_val)]`, `eval_metric="poisson-nloglik"`, `early_stopping_rounds=50`
3. Hitta optimalt n_estimators → omträna på hela 2021-2024

### C.4 Feature importance
- Inbyggd: `model.feature_importances_` (gain-baserad)
- SHAP: `shap.TreeExplainer(model)` → beeswarm plot + summary plot
  - SHAP visar riktning (positiv/negativ) → jämförbart med GLM IRR
- Jämförelseplot: GLM-koefficienter vs SHAP-värden sida vid sida

### C.5 Prediktion
```python
predicted_rate = model.predict(X_test)
predicted_claims = predicted_rate * test["Duration"].values
total_predicted = predicted_claims.sum()
```

---

## Fas D — Prediktiv analys / Modelljämförelse (`src/model-comparison.ipynb`)

### D.1 Modeller att jämföra

| Modell | Typ |
|--------|-----|
| Globalt medelvärde | Baseline |
| Segment-medelvärde (Verksamhet × Geografi) | Baseline |
| Poisson GLM (utan år) | Huvudmodell |
| Poisson GLM (med år) | Variant |
| XGBoost count:poisson | ML-utmanare |

### D.2 Metrik (på testdatan 2025)
- Mean Poisson deviance
- MAE
- RMSE
- Totalt predikterat vs faktiskt skadeantal
- Total error %

### D.3 Konfidensintervall — delta-metoden (GLM)
```python
predictions = results.get_prediction(X_test)
pred_summary = predictions.summary_frame(alpha=0.05)
# Ger: mean, mean_se, mean_ci_lower, mean_ci_upper
```
Mer beräkningseffektivt än bootstrap för GLM.

### D.4 Konfidensintervall — parametrisk bootstrap
- B = 200 bootstrap-iterationer (öka från befintliga 20)
- Omsampling av träningsdata → anpassa GLM → prediktera test → summera
- 2.5:e och 97.5:e percentil → 95% KI för portföljtotalen
- Radnivå: beräkna KI-bredd per policy

### D.5 Policyer med högst/lägst osäkerhet (→ fråga 4)
Sortera på KI-bredd. Karaktärisera:
- **Högst osäkerhet:** Stora VVS/Byggföretag i Storstad med hög Omsättning
- **Lägst osäkerhet:** Små Målare i Småstad
- **Preskriptivt:** Policyer med hög osäkerhet → behov av mer data eller annan modell

### D.6 Jämförelsenarativ (→ fråga 5)
Befintliga resultat antyder att GLM och XGBoost presterar nästan identiskt (Poisson devianse ~0.14 för båda). Nyckelargument:
- Extra komplexitet i ML ger ingen förbättring → GLM föredras (tolkbarhet, regulatoriska krav)
- Koppla till Kap 5 (modeller och verklighet): "En bra modell behöver inte beskriva verkligheten exakt"
- Koppla till Kap 7.1 (validering): prediktiv förmåga på osedd data (2025) bekräftar generalisering

---

## Fas E — Preskriptiv analys (`src/prescriptive-analysis.ipynb`)

### E.1 Risksegmentering — rekommendationer till Länsförsäkringar
- Tabell: predikterad årsfrekvens per Verksamhet × Geografi-segment
- VVS i Storstad bör ha högst premie (IRR ~1.45 × 1.40 ≈ 2.0× basfrekvens)
- Målare i Småstad lägst

### E.2 Omsättning som ratingfaktor
- Högre Omsättning → starkt kopplat till högre frekvens (IRR ~1.68 per log-enhet)
- Rekommendation: använd log_Omsättning som kontinuerlig ratingvariabel i tariffen

### E.3 Självriskseffekt — orsak vs samband
- Högre Självrisk → lägre frekvens (IRR ~0.71)
- Kausal? Moral hazard / incitamentseffekt ELLER selektion (lågriskföretag väljer hög självrisk)
- **Koppla till Kap 4 (orsak vs samband):** observationsdata → kan ej fastställa kausalitet. Koefficienten är association, ej kausal effekt.

### E.4 Osäkerhetsdriven beslutsfattning
- Policyer med bredast KI → Länsförsäkringar bör investera i mer data / expertbedömning
- Rekommendation: samla mer granulär data (projekttyper, skadehistorik, säkerhetscertifieringar)
- Om modellen är osäker på viss kombination → slutsats att annan modell krävs för dessa kunder

### E.5 Portföljprognos
- Modellen predikterar ~5 520-5 580 skador 2025 (faktiskt: 5 520)
- Bootstrap KI inkluderar faktiskt utfall → ger Länsförsäkringar förtroende för reservsättning
- **Koppla till Kap 1.3 (preskriptiv analys):** "algoritmiskt välja ut det bästa beslutsalternativet"

---

## Fas F — Rapportskrivning (mappning till Mall projektrapport ME1316)

### 1. Inledning (1 sida)
- **Problembakgrund:** Länsförsäkringar förvaltar entreprenadportfölj. Korrekt premiesättning kräver förståelse av skadefrekvens.
- **Frågeställning:** "Vilka faktorer påverkar skadefrekvensen i entreprenadförsäkringar, och hur väl kan vi förutsäga antalet skador för 2025?"
- **Syfte:** Bygga, validera och tolka Poisson GLM + XGBoost, jämföra, ge beslutsunderlag.

### 2. Ämnesbeskrivning (0.5-1 sida)
- Försäkringsprissättning: frekvens × svårighetsgrad
- Entreprenadförsäkringsmarknaden i Sverige
- **OBS:** Statistisk teori hör hemma under Metod, INTE här

### 3. Metod (2 sidor)
- Motivera Poisson: count-data, log-länk, offset för exponering, aktuariestandard
- Motivera XGBoost: fångar icke-linjäriteter, inga fördelningsantaganden
- Valideringsstrategi: train 2021-2024, test 2025; intern validering 2021-2023 / 2024
- Validitet: portföljdata (ej stickprov), hög reliabilitet
- Construct-validitet: Omsättning som proxy för riskexponering
- Datajusteringar: log-transform, Duration som offset, dummy-kodning

### 4. Resultat (3 sidor)
- **Tabell 1:** IRR-tabell från Poisson GLM (centralresultat)
- **Tabell 2:** Modelljämförelse-metrik (alla modeller)
- **Tabell 3:** Portföljprediktion med KI
- **Figur 1:** Skadefrekvens per Verksamhet (stapeldiagram)
- **Figur 2:** Heatmap Verksamhet × Geografi
- **Figur 3:** Feature importance jämförelse (GLM IRR vs XGBoost SHAP)

### 5. Analys (1-2 sidor)
- Varför GLM föredras (samma prestanda, bättre tolkbarhet)
- Multikollinearitetsfynd och konsekvenser
- Poisson-antagande: dispersion ~1.0 → håller väl
- Orsak vs samband (Kap 4): koefficienter = associationer, ej kausala
- Robusthet: vad händer utan Försäkringsbelopp? (VIF/AIC-jämförelse)

### 6. Slutsats (0.5 sidor)
- Sammanfattning av nyckelfynd
- Begränsningar: bara frekvens (ej svårighetsgrad), observationsdata
- Framtida arbete: svårighetsmodell, paneldata (individuella företag över tid), mer granulär data

---

## Verifiering / Testplan

1. **Deskriptiv:** Kör om `descriptive-analysis.ipynb` — alla celler ska exekvera utan fel, visualiseringar genereras
2. **GLM:** Kör `poisson-glm.ipynb` — kontrollera att `results.summary()` visar rimliga koefficienter, AIC beräknas, IRR-tabell genereras
3. **XGBoost:** Kör `xgboost-model.ipynb` — early stopping konvergerar, feature importance plottas
4. **Jämförelse:** Kör `model-comparison.ipynb` — alla 5 modeller utvärderade, bootstrap KI beräknas, portföljprediktionen ska ligga nära 5 520 faktiska skador
5. **Slutkontroll:** Totalt predikterat skadeantal (GLM) inom bootstrap-KI och nära faktiskt utfall

---

## Kritiska filer

| Fil | Roll |
|-----|------|
| `data/Entreprenadförsäkring training.csv` | Träningsdata |
| `data/Entreprenadförsäkring test.csv` | Testdata |
| `src/descriptive-analysis.ipynb` | Befintlig deskriptiv analys → komplettera |
| `src/pyproject.toml` | Miljödefinition (alla deps redan på plats) |
| `test-analysis/insurance_analysis.py` | Referensimplementation (sklearn) → ersätts av statsmodels |
| `info/sammanfattning-kursbok.pdf` | Kursboksreferenser |
| `info/Mall projektrapport ME1316.pdf` | Rapportmall |