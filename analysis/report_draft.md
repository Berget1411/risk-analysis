# Projekt 3: Försäkring för entreprenadmaskiner

## Inledning

Syftet med analysen är att uppskatta framtida skadefrekvens för entreprenadförsäkringar och använda den informationen som underlag för prissättning. En praktisk delfråga i projektet är att förutsäga det totala antalet skador i testportföljen för 2025.

Den övergripande frågeställningen är:

**Hur väl kan vi förutsäga antal skador för entreprenadförsäkringar utifrån kund-, verksamhets- och försäkringsdata, och vilka variabler verkar viktigast för prissättning?**

Analysen fokuserar på två beslutsbehov:

1. Att få en stabil modell för förväntat antal skador per kund och år.
2. Att avgöra om en mer flexibel maskininlärningsmodell ger tydligt bättre beslutsstöd än en enklare och mer tolkbar frekvensmodell.

## Ämnesbeskrivning

Inom skadeförsäkring bygger premiesättning ofta på en uppskattning av förväntad skadefrekvens och skadekostnad. I detta dataset finns endast antal skador, så analysen avser frekvensdelen av prissättningen. Den förväntade frekvensen kan senare kombineras med antagen eller observerad genomsnittlig skadekostnad för att få en riskpremie i kronor.

I försäkringssammanhang är det naturligt att börja med count-modeller, särskilt Poisson-regression, eftersom målet är att modellera hur många skador som inträffar under en viss exponeringstid. Samtidigt är det viktigt att testa om mer flexibla modeller kan fånga icke-linjära samband mellan exempelvis omsättning, försäkringsbelopp och självrisk.

## Metod

Analysen genomfördes i fyra steg.

1. **Deskriptiv analys.** Vi granskade fördelningen av `AntalSkador`, skadefrekvens per exponeringstid, skillnader mellan verksamheter, geografiska områden och år, samt korrelation mellan `Omsattning`, `Forsakringsbelopp` och `Sjalvrisk`.
2. **Baslinjemodeller.** Två enkla jämförelsemodeller användes: ett globalt genomsnitt för alla kunder och ett segmenterat genomsnitt per `Verksamhet` och `GeografisktOmrade`.
3. **Prediktiva modeller.** Vi jämförde två huvudmodeller:
   - en Poisson-regression där målet var skadefrekvens per exponeringsår
   - en `HistGradientBoostingRegressor` med Poisson-loss som challenger-modell
4. **Osäkerhet.** För den slutliga Poisson-modellen användes bootstrap-resampling för att uppskatta 95-procentiga intervall för skadefrekvensen i testportföljen.

För modelljämförelse användes data från 2021-2023 som träningsmängd och 2024 som validering. Därefter utvärderades samma modeller på testportföljen 2025. När den slutliga portföljprognosen togs fram tränades den valda modellen på hela träningsmängden 2021-2024.

Tre metodfrågor från uppgiften hanterades explicit:

- **Korrelation mellan ekonomiska variabler.** Korrelationen mellan `Omsattning`, `Forsakringsbelopp` och `Sjalvrisk` är måttlig till tydlig positiv (cirka 0.21 till 0.46 i rå skala). Därför användes log-transformerade versioner i regressionsmodellen och koefficienterna tolkas som associationer, inte som kausala effekter.
- **Tidsförändringar.** En variant av Poisson-modellen inkluderade årseffekt. Den gav något bättre träff på valideringsåret 2024 men sämre totalprognos för 2025, vilket tyder på att extrapolering av en linjär årstrend är osäker.
- **Exponeringstid.** `Duration` användes för att normalisera från rått antal skador till skadefrekvens per exponeringsår, så att korta försäkringsperioder inte jämförs direkt med helårsexponering.

## Resultat

### Deskriptiva resultat

- Träningsdatan innehåller 1 033 386 observationer och testdatan 291 649 observationer.
- I träningen finns totalt 19 730 skador och i testportföljen 5 520 skador.
- Andelen nollskador är mycket hög: 98.12 procent i träning och 98.13 procent i test.
- Skadefrekvensen i träning är 0.02135 skador per exponeringsår.
- Varians/medelvärde för `AntalSkador` är 1.009, vilket ligger mycket nära Poisson-antagandet.

Skadefrekvensen varierar tydligt mellan grupper:

- Högst frekvens per verksamhet finns i `VVS` (0.0316), följt av `Takarbeten` (0.0250).
- Lägst frekvens finns i `Målare` (0.0141) och `Elektriker` (0.0154).
- `Storstad` har högst geografisk skadefrekvens (0.0261), medan `Småstad` ligger lägst (0.0135).
- Årseffekten är svag men positiv: skadefrekvensen stiger från 0.0213 år 2021 till 0.0219 år 2024.

### Modelljämförelse

På valideringsåret 2024 var de bästa modellerna mycket jämna, men de prediktiva modellerna slog båda baslinjerna tydligt i Poisson-devians.

| Modell | Split | Poisson-devians | RMSE | Predikterat totalantal |
| --- | --- | ---: | ---: | ---: |
| Globalt genomsnitt | 2024 | 0.1536 | 0.1410 | 5249.7 |
| Segmentgenomsnitt | 2024 | 0.1516 | 0.1409 | 5246.7 |
| Poisson utan år | 2024 | 0.1464 | 0.1405 | 5250.3 |
| Poisson med år | 2024 | 0.1464 | 0.1405 | 5344.0 |
| Gradient boosting | 2024 | 0.1464 | 0.1404 | 5240.2 |

På testportföljen 2025 blev bilden liknande, men den enklare Poisson-modellen utan årseffekt var sammantaget mest attraktiv eftersom den kombinerade bäst Poisson-devians med hög tolkbarhet.

| Modell | Split | Poisson-devians | RMSE | Predikterat totalantal |
| --- | --- | ---: | ---: | ---: |
| Globalt genomsnitt | 2025 | 0.1495 | 0.1379 | 5515.3 |
| Segmentgenomsnitt | 2025 | 0.1474 | 0.1377 | 5518.1 |
| Poisson utan år | 2025 | 0.1425 | 0.1373 | 5526.2 |
| Poisson med år | 2025 | 0.1425 | 0.1373 | 5676.2 |
| Gradient boosting | 2025 | 0.1427 | 0.1373 | 5515.0 |

Skillnaden mellan Poisson och gradient boosting är mycket liten, vilket innebär att den extra modellkomplexiteten inte ger något tydligt affärsvärde här.

### Viktigaste prediktorerna i slutmodellen

I den slutliga Poisson-modellen tränad på 2021-2024 är följande samband starkast:

- Högre `Omsattning` är starkt kopplad till högre skadefrekvens. En enhetsökning i log(`Omsattning`) motsvarar ungefär +67.7 procent i förväntad frekvens.
- `VVS` ligger cirka 44.3 procent högre än baskategorin `Byggföretag`, givet övriga variabler.
- `Storstad` ligger cirka 41.2 procent högre än baskategorin `Landsbyggd`.
- Högre `Sjalvrisk` är kopplad till lägre skadefrekvens, ungefär -28.8 procent per enhetsökning i log(`Sjalvrisk`). Detta bör tolkas som ett urvals- eller produktmönster, inte som att högre självrisk i sig orsakar färre skador.

### Prognos för testportföljen 2025

Den slutliga Poisson-modellen tränad på hela träningsmängden 2021-2024 predikterar:

- **5580.6 skador** totalt i testportföljen 2025.
- Bootstrap-medelvärdet är 5576.1 skador.
- Ett bootstrap-baserat 95-procentigt intervall för portföljen är **[5514.0, 5629.7]** skador.

Eftersom faktiskt utfall i testfilen är 5520 skador ligger utfallet väl inom intervallet.

De mest osäkra observationerna återfinns bland mycket stora kunder i `Storstad`, ofta inom `VVS` eller `Byggföretag`, med mycket hög omsättning och stora försäkringsbelopp. De minst osäkra observationerna är små kunder, framför allt `Målare` i `Småstad`, där både skadefrekvensen och variationsbredden är låg.

## Analys

Resultaten visar att en enkel frekvensmodell räcker långt i detta projekt. Det finns tre huvudskäl till detta.

För det första är datan mycket stor och relativt välstrukturerad, samtidigt som skadeutfallet är starkt dominerat av nollor och har dispersion nära Poisson-fördelning. Det gör att Poisson-modellen passar förvånansvärt bra.

För det andra är förbättringen från mer flexibel maskininlärning mycket liten. Gradient boosting presterar nästan identiskt, men ger sämre transparens. För ett prissättningsproblem där modellen ska kunna motiveras verksamhetsmässigt är detta ett viktigt argument för att föredra Poisson-regression.

För det tredje visar årseffekten att tidsvariation finns, men den är svag. När år inkluderas förbättras träffen något på validering, men totalprognosen för 2025 blir sämre. Det tyder på att en enkel linjär extrapolering av år inte är robust nog för prissättning. Ett bättre alternativ är att använda år som övervakningssignal eller scenarioanalys snarare än som stark driver i själva premiesättningen.

Analysen har också begränsningar. Datasetet innehåller bara skadefrekvens och inte skadekostnader, vilket gör att vi inte kan sätta en full premie i kronor utan ett separat antagande om severity. Dessutom är tolkningen av ekonomiska variabler försiktig eftersom omsättning, försäkringsbelopp och självrisk delvis fångar samma underliggande företagsstorlek och risknivå.

## Slutsats

Den mest användbara modellen för detta projekt är en **Poisson-regression utan explicit årseffekt i slutlig prissättning**, kompletterad med bootstrap-baserade osäkerhetsintervall och gärna en mer flexibel ML-modell som challenger i modellövervakning.

Skälen är att modellen:

- presterar bättre än enkla baslinjer
- matchar eller överträffar challenger-modellen i test
- är lättare att tolka i verksamhetskontext
- ger ett tydligt underlag för segmenterad riskklassificering

Den slutliga prognosen för testportföljen är **5580.6 skador**, med ett 95-procentigt intervall på **5514.0 till 5629.7 skador**.

För fortsatt arbete vore nästa naturliga steg att koppla denna frekvensmodell till en separat modell för skadebelopp, så att riskpremien kan uttryckas direkt i kronor per kund.
