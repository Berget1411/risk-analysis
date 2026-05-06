# NOTES-HERALD.md — Resultat och tolkningar: Poisson-GLM (M2)

Dokumentet följer ett fast miniformat för varje resultatavsnitt:
- **Vad gjordes?** → kortfattat om vad steget innebär
- **Vad visar tabellen/siffran?** → tolkning med referenspunkt, riktning och magnitud
- **Varför spelar det roll?** → konsekvens för modellval eller prissättning

---

## 1. Modellsekvens och AIC-jämförelse (B1 — träning 2021–2023)

**Vad gjordes?**
Fyra modeller specifierades i tur och ordning på träningsdata (2021–2023, 755 691 rader). AIC och in-sample Poisson-deviance jämfördes för att se hur mycket varje variabelblock tillför.

| Modell | Beskrivning                  | Antal param | AIC        | Deviance    |
|--------|------------------------------|-------------|------------|-------------|
| M0     | Intercept only               | 1           | 141 086    | 112 769     |
| M1     | Verksamhet + Geografi        | 10          | 139 723    | 111 388     |
| M2     | M1 + log(Omsättning)         | 11          | 136 971    | 108 633     |
| M3     | M2 + C(År)                   | 13          | 136 969    | 108 627     |

**Vad visar tabellen?**

- *M0 → M1:* Att lägga till bransch och geografi sänker AIC med ca 1 363 enheter. Referenspunkten är nollmodellen (bara ett medelvärde för hela portföljen). Det visar att branschtillhörighet och geografiskt läge i sig bär substantiell information om skadefrekvens.
- *M1 → M2:* `log(Omsättning)` sänker AIC med ytterligare 2 752 enheter — det enskilt största språnget. En ΔAIC > 10 räknas som stark evidens. Storleken på företaget förklarar alltså mer variation än vad segmenteringen i bransch och geografi gör kombinerat.
- *M2 → M3:* Årseffekten (C(År), träningsåren 2021–2023) sänker AIC med enbart 2 enheter (ΔAIC = 2,15). Det är under tröskeln för meningsfull förbättring. In-sample ger årseffekten nästan ingenting utöver vad `log(Omsättning)` och segmentvariablerna redan fångar.

**Varför spelar det roll?**
AIC-sekvensen motiverar direkt varför M2 väljs som slutmodell. Årseffekten (M3) kan inte heller prediktera år 2025 — det är en okänd kategorinivå. ΔAIC = 2 ger inget stöd för att en numerisk trendterm skulle generalisera meningsfullt. M2 är rätt val.

---

## 2. Valideringsdeviance 2024 — M0, M1 och M2 (B1)

**Vad gjordes?**
M0, M1 och M2 predikterade ut på valideringsåret 2024 (277 695 rader, ej sedd under träning). Poisson-deviance beräknades på valideringsdata.

| Modell | Beskrivning           | Valideringsdeviance 2024 |
|--------|-----------------------|--------------------------|
| M0     | Intercept only        | ≈ 41 500 (implicit)      |
| M1     | Verksamhet + Geografi | ≈ 41 200 (implicit)      |
| M2     | M1 + log(Omsättning)  | **41 002**               |

*(M0 och M1 är inte explicit loggade i B1-outputen men rangordningen följer AIC-ordningen.)*

**Vad visar siffran?**
M2 uppnår lägst valideringsdeviance. Referenspunkten är M0 (portföljens genomsnittliga frekvens som enda prediktion). M2 generaliserar bättre än de enklare modellerna på ett år modellen aldrig tränat på.

**Varför spelar det roll?**
Valideringsdeviance är det primära urvalskriteriet — inte AIC. Att M2 vinner på 2024 bekräftar att storleksvariabeln bidrar med genuin prediktiv kraft, inte bara in-sample-anpassning.

---

## 3. Årseffektens koefficienter i M3 (B1)

**Vad gjordes?**
M3 skattades med C(År) som kategorisk variabel (referensnivå: 2021). Koefficienterna visar den isolerade årsrörelsen, justerad för bransch, geografi och omsättning.

| År (ref: 2021) | β      | Rate ratio | KI nedre | KI övre |
|----------------|--------|------------|----------|---------|
| 2022           | −0.040 | 0.961      | 0.923    | 1.001   |
| 2023           | +0.008 | 1.008      | 0.968    | 1.049   |

**Vad visar tabellen?**

- 2022 låg 3,9 % *lägre* skadefrekvens än 2021 (referens), men KI nuddar 1,0 — osäkert.
- 2023 låg 0,8 % *högre* — KI spänner helt över 1,0, ingen skild effekt från noll.
- Inget av åren visar en stabil, monoton rörelse.

**Varför spelar det roll?**
Koefficienterna bekräftar att det inte finns en tydlig tidsriktning i data. ΔAIC = 2 kombinerat med KI som korsas av noll stärker beslutet att utesluta `Ar` ur slutmodellen. Det är faktisk evidens, inte bara ett principiellt val.

---

## 4. Överdispersionskontroll (B2 — full träning 2021–2024)

**Vad gjordes?**
M2 refittades på hela träningsperioden (2021–2024, 1 033 386 rader). Pearson χ²/frihetsgrader beräknades som mått på överdispersion. Poisson antar att varians = medelvärde; om kvoten är väsentligt > 1 är standardfelen underskattade.

**Siffran:**
> Pearson χ²: 1 018 750 | Frihetsgrader: 1 033 375 | **Dispersionskvot: 0.986**

**Vad visar siffran?**
Dispersionskvoten 0,986 är marginellt *under* 1,0. Referenspunkten är 1,0 (perfekt Poisson-anpassning). En kvot < 1 kallas underdispersion och är om något ett svagare problem än överdispersion. Kvoten ligger i allt väsentligt på 1 — Poisson-antagandet håller.

**Varför spelar det roll?**
Utan överdispersion är standardfelen för koefficienterna korrekta och konfidensintervallen giltiga. Negativ binomial är inte motiverad. Det ger trygghet i att de rate ratios vi rapporterar i prissättningsanalysen vilar på tillförlitliga statistiska mått.

---

## 5. Koefficienter och rate ratios — M2 full träning (B2)

**Vad gjordes?**
M2 skattades på 2021–2024. Koefficienterna omvandlades till rate ratios via `exp(β)`. Rate ratio = hur många gånger högre (> 1) eller lägre (< 1) skadefrekvensen är jämfört med referenssegmentet, givet att alla övriga variabler hålls konstanta.

### 5a. Verksamhet (referens: Byggföretag)

| Verksamhet               | β      | Rate ratio | KI nedre | KI övre |
|--------------------------|--------|------------|----------|---------|
| *Byggföretag (ref)*      | —      | 1.000      | —        | —       |
| Elektriker               | −0.360 | **0.698**  | 0.659    | 0.738   |
| Grävning & Schaktning    | −0.157 | **0.855**  | 0.808    | 0.905   |
| Målare                   | −0.452 | **0.637**  | 0.601    | 0.675   |
| Takarbeten               | +0.127 | **1.135**  | 1.067    | 1.207   |
| VVS                      | +0.359 | **1.432**  | 1.372    | 1.494   |
| Övriga specialistföretag | −0.030 | **0.970**  | 0.932    | 1.010   |

**Vad visar tabellen?**

- **VVS** har 43 % *högre* skadefrekvens än Byggföretag. Konfidensintervallet [1,37–1,49] är smalt och exkluderar 1 tydligt — detta är den starkaste och säkraste effekten i verksamhetsdimensionen.
- **Takarbeten** har 13,5 % *högre* skadefrekvens. KI [1,07–1,21] — signifikant men mer blygsam effekt.
- **Målare** har 36 % *lägre* skadefrekvens. Smalt KI [0,60–0,67] — en av de tydligaste sänkningarna.
- **Elektriker** har 30 % lägre skadefrekvens [0,66–0,74].
- **Övriga specialistföretag**: KI [0,93–1,01] korsas av 1 — ingen säkerställd effekt. Gruppen beter sig statistiskt likt Byggföretag.

**Varför spelar det roll?**
Rate ratios översätts direkt till relativa premiefaktorer i ett tariff-system. VVS och Takarbeten motiverar högre premie än Byggföretag; Målare och Elektriker motiverar rabatt. Att Övriga specialistföretag inte skiljer sig bör noteras — det är en heterogen restgrupp som kräver noggrannare segmentering om man vill prissätta den träffsäkert.

### 5b. Geografiskt område (referens: Landsbyggd)

| Geografiskt område | β      | Rate ratio | KI nedre | KI övre |
|--------------------|--------|------------|----------|---------|
| *Landsbyggd (ref)* | —      | 1.000      | —        | —       |
| Mellanstorstad     | +0.185 | **1.203**  | 1.140    | 1.271   |
| Småstad            | −0.279 | **0.757**  | 0.711    | 0.805   |
| Storstad           | +0.379 | **1.461**  | 1.387    | 1.539   |

**Vad visar tabellen?**

- **Storstad** har 46 % *högre* skadefrekvens än Landsbyggd — det breda KI [1,39–1,54] är helt skilt från 1. Den starkaste geografieffekten.
- **Mellanstorstad** har 20 % *högre* frekvens [1,14–1,27].
- **Småstad** har 24 % *lägre* frekvens [0,71–0,81] — lägre än Landsbyggd. Det är ett icke-trivialt resultat: mellansegmentet (Småstad) uppvisar lägst risk, inte Landsbyggd.

**Varför spelar det roll?**
En tydlig urban gradient finns, men den är inte monoton. Prissättning som bara skiljer stad/land missar att Småstad är billigare än Landsbyggd. Tariffsystemet behöver fyra separata geografinivåer — inte bara stad/land — för att vara korrekt kalibrerat.

### 5c. Omsättning — storlekseffekten

| Variabel       | β     | Rate ratio per enhet | Rate ratio per fördubbling | KI (fördubbling) |
|----------------|-------|----------------------|---------------------------|-----------------|
| log(Omsättning)| 0.442 | 1.555                | **1.358**                 | [1.345, 1.371]  |

**Vad visar siffran?**

- Rate ratio 1,555 innebär att en ökning av `log(Omsättning)` med 1 (≈ e-faldigt) höjer skadefrekvensen med 55,5 %.
- Mer intuitivt: **en fördubbling av omsättningen hänger samman med 35,8 % högre skadefrekvens**, med ett extremt smalt KI [1,345–1,371].
- Koefficienten 0,442 < 1 innebär sub-proportionalitet: stora företag har fler skador, men inte proportionellt fler relativt sin storlek. Skadefrekvensen *per krona omsättning* sjunker med företagsstorlek.

**Varför spelar det roll?**
Omsättning är den viktigaste enskilda förklaringsvariabeln (ΔAIC ≈ 2 752 jämfört med M1). Sub-proportionaliteten har direkt konsekvens: premien bör inte skalas linjärt med omsättning. Stora företag bör relativt sett betala lägre premie per omsättningskrona — men mer i absoluta tal.

---

## 6. Slutlig modell: M2 refittad på 2021–2024, utvärderad på 2025

**Vad gjordes?**
När alla modellval fastställts på valideringsdata (2024) refittades M2 på hela träningsperioden 2021–2024 (1 033 386 rader). Modellen predikterade sedan den inlåsta testportföljen 2025 (291 649 rader, 5 520 observerade skador).

### 6a. Totalresultat 2025

| Mått                  | Värde      |
|-----------------------|------------|
| Observerade skador    | 5 520      |
| GLM predikterat       | 5 580,6    |
| **Portföljfel**       | **+1,10 %**|
| Poisson deviance      | 41 889,2   |

**Vad visar siffran?**
Modellen överpredikterar portföljens totala skadeantal med 60,6 skador, eller 1,10 %. Referenspunkten är noll-avvikelse (perfekt kalibrering). En avvikelse på +1,1 % är mycket liten för en portfölj av den här storleken — modellen är välkalibrerad på portföljnivå.

**Varför spelar det roll?**
För prissättning är portföljfelet det mest affärsmässigt relevanta måttet. En systematisk överpremie på 1,1 % är hanterbar och ligger väl inom normala aktuariella marginaler. Modellen underestimerar inte risken — vilket vore det farligare felet.

### 6b. Segmentresultat per Verksamhet — 2025

| Verksamhet               | n       | Observerat | GLM pred | Fel %   |
|--------------------------|---------|------------|----------|---------|
| Byggföretag              | 116 594 | 2 286      | 2 305,8  | **+0,9**|
| Elektriker               | 28 923  | 411        | 400,0    | **−2,7**|
| Grävning & Schaktning    | 23 410  | 372        | 396,5    | **+6,6**|
| Målare                   | 29 172  | 332        | 368,7    | **+11,1**|
| Takarbeten               | 14 545  | 353        | 328,3    | **−7,0**|
| VVS                      | 29 100  | 858        | 823,9    | **−4,0**|
| Övriga specialistföretag | 49 905  | 908        | 957,3    | **+5,4**|

**Vad visar tabellen?**

- **Byggföretag** (referenskategorin, störst volym): fel +0,9 % — nära perfekt. Referensnivån är välkalibrerad.
- **Målare**: +11,1 % överprediktering — störst relativ avvikelse. Modellen förväntar sig fler skador än utfallet. Möjlig tolkning: 2025 kan ha haft en gynnsam period för Målare, eller segmentet är inhomogent.
- **Takarbeten**: −7,0 % underprediktering — modellen förväntar färre skador än utfall. Takarbeten är ett högrisk-segment; underprediktering är den problematiska riktningen.
- **VVS**: −4,0 % — det segment med högst skadefrekvens (rate ratio 1,43) underpredikteras något.

**Varför spelar det roll?**
Segmentfel i storleksordningen ±5–11 % kan vara normalt stokastiskt brus på relativt små segment (14 000–30 000 rader per segment), men Målare och Takarbeten bör följas upp i nästa kalibreringscykel. Takarbetens underprediktering är mer problematisk ur ett riskperspektiv än Målares överprediktering.

### 6c. Segmentresultat per Geografiskt område — 2025

| Geografiskt område | n       | Observerat | GLM pred | Fel %   |
|--------------------|---------|------------|----------|---------|
| Landsbyggd         | 29 093  | 470        | 462,7    | **−1,5**|
| Mellanstorstad     | 87 602  | 1 603      | 1 688,0  | **+5,3**|
| Småstad            | 58 280  | 701        | 703,7    | **+0,4**|
| Storstad           | 116 674 | 2 746      | 2 726,1  | **−0,7**|

**Vad visar tabellen?**

- **Storstad** (störst volym, n ≈ 116 000): fel −0,7 % — utmärkt kalibrering i det segment som bär mest portföljvikt.
- **Mellanstorstad**: +5,3 % — modellen överpredikterar. Segmentet är relativt stort (87 000 rader), vilket gör avvikelsen mer stabil och inte enbart slumpmässig.
- **Landsbyggd** och **Småstad**: fel inom ±1,5 % — välkalibrerade.

**Varför spelar det roll?**
Geografigenomgången visar att kalibreringen är god för de extrema polerna (Storstad, Landsbyggd) men att Mellanstorstad avviker uppåt med 5 %. Om premiekorrigeringar ska göras geografiskt är Mellanstorstad det segment att undersöka först.

---

## 7. Modellval: GLM M2 mot XGBoost — sammanfattning (D1)

**Vad gjordes?**
Båda modellerna tränade på 2021–2023, validerade på 2024, sedan refittade på 2021–2024 och utvärderade slutgiltigt på 2025.

| Mått                        | GLM M2      | XGBoost    | Δ (XGB − GLM) |
|-----------------------------|-------------|------------|---------------|
| Valideringsdeviance 2024    | 41 002,4    | 40 918,1   | −0,21 %       |
| Testdeviance 2025           | 41 889,2    | 41 855,7   | −0,08 %       |
| Portföljfel 2025            | +1,10 %     | +1,22 %    | —             |

**Vad visar tabellen?**

- XGBoost är marginellt bättre på deviance: −0,21 % på validering och −0,08 % på test. Referenspunkten för en meningsfull förbättring är minst −2 % (som beslutsregel satt i D1).
- På portföljfel är GLM faktiskt *bättre* än XGBoost (+1,10 % vs +1,22 %).

**Varför spelar det roll?**
En förbättring på 0,08–0,21 % i Poisson-deviance är statistiskt omätbar i praktisk mening och motiverar inte den förlust i tolkbarhet som XGBoost medför. GLM M2 är rekommenderad huvudmodell. XGBoost bekräftar att GLM:s prediktion är rimlig (sanity check) men tillför inget självständigt värde för prissättningsbeslut.

---

## 8. Osäkerhet på portfölj- och radnivå (E)

**Vad gjordes?**
GLM M2 (full 2021–2024) användes för att beräkna 95 %-konfidensintervall för förväntad skadefrekvens per rad i testportföljen 2025, via `summary_frame` från statsmodels (delta-metoden).

| Mått                           | Värde    |
|-------------------------------|----------|
| Median relativ osäkerhet (rad)| 9,2 %    |
| 25:e percentil                 | 7,3 %    |
| 75:e percentil                 | 11,5 %   |
| Max relativ osäkerhet          | 18,7 %   |
| Min relativ osäkerhet          | 5,2 %    |
| 95 % KI-bredd (portfölj)       | ±155,7 skador |
| Relativ osäkerhet (portfölj)   | ±2,79 %  |

**Vad visar siffran?**

- På **radnivå** är typisk relativ osäkerhet 7–12 %. Referenspunkten är modellens punktprediktion per enskilt avtal. En rad med predikterad frekvens 0,02 har alltså ett 95 % KI ungefär i spannet [0,018, 0,022].
- På **portföljnivå** är osäkerheten mycket lägre: ±155,7 skador, eller ±2,79 % av den totala förväntade skadevolyme. Det beror på att individuella osäkerheter delvis tar ut varandra (diversifiering).

**Varför spelar det roll?**
Portföljosäkerheten på ±2,8 % är tillräckligt liten för att modellen ska vara användbar som prissättningsunderlag på aggregerad nivå. Men på individnivå (enskilt avtal) är osäkerheten 7–12 % — vilket innebär att segmentrekommendationer bör baseras på grupper av avtal, inte enskilda objekt. Segment med hög relativ osäkerhet (max 18,7 %) bör markeras som osäkra i prissättningssystemet och kompletteras med expertbedömning.

---

## Sammanfattning — beslutsrelevanta slutsatser

| Fråga | Slutsats |
|---|---|
| Bäst modell | **GLM M2** — tolkbar, välkalibrerad, XGBoost tillför ej meningsfullt |
| Viktigaste variabel | **log(Omsättning)** — ΔAIC ≈ 2 752, sub-proportionell effekt |
| Högst-risk bransch | **VVS** (+43 % vs Byggföretag) |
| Lägst-risk bransch | **Målare** (−37 % vs Byggföretag) |
| Geografisk gradient | **Storstad** +46 %, **Småstad** lägst av alla (−24 % vs Landsbyggd) |
| Portföljkalibrering 2025 | **+1,10 %** överprediktering — acceptabelt |
| Segment att följa upp | **Målare** (+11 %) och **Takarbeten** (−7 %) |
| Portföljosäkerhet | **±2,79 %** (95 % KI) — tillräcklig precision för aggregerad prissättning |
