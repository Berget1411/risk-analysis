# NEW-PLAN.md — Entreprenadförsäkring (ME1316)

## 1. Uppdrag och beslutskontext

Projektets kontext är försäkringsprissättning. Länsförsäkringar vill förstå vilka faktorer som hänger samman med skadefrekvens i entreprenadportföljen och samtidigt kunna förutsäga antalet skador i testportföljen för 2025. Analysen ska därför både ge:

- en tolkbar modell för skadefrekvens
- en prediktiv jämförelse mellan en klassisk statistisk modell och en ML-modell
- ett beslutsunderlag för prissättning, segmentering och vidare datainsamling

Detta ligger väl i linje med materialet i `/info`:

- `info/Uppgiftsbakgrund.docx` anger att målet är att bygga en prissättningsmodell för att förutsäga antal skador samt att prediktera det totala skadeantalet i testportföljen
- `info/PM projektarbete.pdf` betonar att frågeställningen ska vara relevant för beslutsfattande, metodvalet ska vara motiverat och analysen ska hantera antaganden och begränsningar
- `info/Intro projekt.pptx` säger att grundläggande deskriptiv och prediktiv analys krävs för godkänt, medan mer systematisk bearbetning och väl anpassade statistiska analyser krävs för högre betyg
- `info/Mall projektrapport ME1316.pdf` sätter ramarna för rapportens disposition
- `info/sammanfattning-kursbok.pdf` ger en tydlig logik: deskriptiv analys -> prediktiv analys -> preskriptiv analys

Viktig precisering: uppgiftsbakgrunden nämner data från 2020 till 2025, men de levererade filerna innehåller i praktiken träningsdata för 2021-2024 och testdata för 2025. Planen ska därför utgå från de faktiska filerna.

## 2. Rekommenderat syfte och huvudfråga

### Syfte

Syftet är att bygga, jämföra och tolka två modeller för skadefrekvens i Länsförsäkringars entreprenadportfölj, en Poisson-GLM och en XGBoost-modell, samt att använda dessa för att förutsäga skadeutfall i testportföljen 2025 och formulera verksamhetsrelevanta rekommendationer.

### Huvudfråga

Hur väl kan skadeantal i entreprenadförsäkring förutsägas med hjälp av kund-, verksamhets- och försäkringsdata, och ger XGBoost ett tillräckligt mervärde jämfört med en tolkbar Poisson-GLM?

### Delfrågor

1. Vilka variabler är viktigast för skadefrekvensen enligt Poisson-GLM, och hur ska effekterna tolkas i försäkringsteknisk och affärsmässig kontext?
2. Hur bör korrelationen mellan `Omsattning`, `Forsakringsbelopp` och `Sjalvrisk` hanteras i modelleringen?
3. Finns det tidsvariation mellan 2021 och 2024 som bör fångas i modellen, och förbättrar en årseffekt prognoserna?
4. Hur väl förutsäger Poisson-GLM respektive XGBoost testportföljen 2025, både på portföljnivå och på radnivå?
5. Vilka observationer eller segment är modellen mest respektive minst säker på, och vad betyder det för beslutsfattande?

## 3. Avgränsningar

För att hålla projektet skarpt och genomförbart ska följande gälla:

- Fokus ligger på skadefrekvens, inte skadekostnad. Rapporten analyserar alltså frekvensdelen av prissättning, inte full premie i kronor.
- Huvudjämförelsen ska stå mellan Poisson-GLM och XGBoost. Enkla baseline-modeller kan användas som referens, men ska inte ta över analysen.
- `Duration` ska behandlas som exponering. Den får inte behandlas som en vanlig förklarande variabel i GLM-huvudmodellen.
- Tolkningar av modellkoefficienter ska beskrivas som samband eller associationer, inte som kausala effekter, eftersom datan är observationsdata.
- Testfilen 2025 ska användas som slutlig utvärdering, inte som grund för modellval. Modellval ska göras inom träningsmaterialet.

Valfria fördjupningar ska endast göras om kärnanalysen först är klar:

- interaktioner mellan verksamhet och geografi
- känslighetsanalys med negativ binomial som robusthetskontroll
- SHAP eller annan lokal förklaring av XGBoost

## 4. Datagrund

### Filer

| Fil | Roll | Observationer |
|---|---|---:|
| `data/Entreprenadförsäkring training.csv` | träning och intern validering | 1 033 386 |
| `data/Entreprenadförsäkring test.csv` | slutlig testmängd | 291 649 |

### Variabler

- `Omsattning`
- `Verksamhet`
- `GeografisktOmrade`
- `Ar`
- `Forsakringsbelopp`
- `Sjalvrisk`
- `AntalSkador`
- `Duration`

### Bekräftade datapunkter

- Träningsfilen omfattar åren 2021-2024
- Testfilen omfattar år 2025
- Träningsdatan innehåller totalt 19 730 skador
- Testdatan innehåller totalt 5 520 skador
- Andelen nollskador är cirka 98 procent i både träning och test

Det betyder att analysen rör gles count-data med stark nollövervikt, vilket motiverar en tydlig diskussion om modellantaganden och utvärderingsmått.

## 5. Kurslogik: deskriptiv, prediktiv och preskriptiv analys

Planen bör uttryckligen följa kursbokens logik.

### 5.1 Deskriptiv analys

Här ska gruppen beskriva datan, fördelningar, skillnader mellan grupper och samvariation mellan variabler. Detta knyter an till kursbokens kapitel om att beskriva data och skapa överblick innan modellering.

### 5.2 Prediktiv analys

Här byggs och valideras Poisson-GLM och XGBoost. Tyngdpunkten ligger på prediktiv förmåga på osedd data, i linje med kursbokens kapitel om validering och prognosmodeller.

### 5.3 Preskriptiv analys

Här översätts resultaten till rekommendationer. I detta projekt innebär preskriptiv analys inte att optimera ett helt prissättningssystem, utan att använda modellresultaten för att resonera om:

- vilka segment som bör följas extra noga
- vilka variabler som verkar rimliga som ratingfaktorer
- var modellen är för osäker för att ensam bära beslut
- när en enkel, tolkbar modell är bättre än en mer komplex modell

## 6. Analysstrategi

## Fas A — Datakontroll och deskriptiv analys

Syftet i denna fas är att skapa överblick, verifiera datakvalitet och förbereda de första figurerna till rapporten.

### A.1 Datakontroll

- kontrollera datatyper och kategorinivåer
- kontrollera saknade värden
- kontrollera extrema värden i numeriska variabler
- kontrollera att `Duration` ligger i rimligt intervall och hantera eventuella nollor innan log-offset beräknas

### A.2 Grundläggande beskrivning

- total skadefrekvens i träning och test
- fördelning av `AntalSkador`
- fördelning av `Duration`
- beskrivning av ekonomiska variabler med medelvärde, median, kvartiler och spridningsmått

### A.3 Segmenterad beskrivning

- skadefrekvens per `Verksamhet`
- skadefrekvens per `GeografisktOmrade`
- skadefrekvens per `Ar`
- tabell eller heatmap för `Verksamhet x GeografisktOmrade`

### A.4 Samvariation

- korrelationsmatris för `Omsattning`, `Forsakringsbelopp`, `Sjalvrisk`
- samma analys på log-transformerad skala
- kort diskussion om vilka variabler som sannolikt fångar liknande underliggande riskstorlek

### A.5 Figurer som sannolikt ska in i rapporten

- stapeldiagram över skadefrekvens per verksamhet
- stapeldiagram över skadefrekvens per geografi
- linjediagram över skadefrekvens över tid
- histogram eller täthetsdiagram för log-transformerade ekonomiska variabler
- heatmap för verksamhet och geografi

## Fas B — Poisson-GLM som huvudmodell

Poisson-GLM bör vara huvudmodellen eftersom:

- målet är att modellera antal skador
- exponeringstiden kan hanteras naturligt via offset
- modellen är tolkbar och affärsmässigt användbar
- uppgiften efterfrågar resonemang om effekter, osäkerhet och modellval

### B.1 Grundspecifikation

Huvudmodellen bör ha en form i stil med:

`AntalSkador ~ C(Verksamhet) + C(GeografisktOmrade) + vald storleksvariabel + ev. C(Ar) + offset(log(Duration))`

Den valda storleksvariabeln ska sannolikt vara en log-transformerad version av någon av:

- `Omsattning`
- `Forsakringsbelopp`
- `Sjalvrisk`

eller en begränsad kombination av dem om multikollineariteten bedöms hanterbar.

### B.2 Variabelval

Eftersom uppgiftsbakgrunden explicit lyfter korrelationen mellan ekonomiska variabler ska planen innehålla ett tydligt spår för variabelval:

- börja med en basmodell med verksamhet och geografi
- lägg till en ekonomisk variabel i taget
- jämför modeller med AIC och gärna även BIC eller out-of-sample-mått på valideringsåret
- kontrollera VIF för att undvika onödigt instabila skattningar

Här ska gruppen inte bara fråga vilken modell som får bäst passform, utan också vilken modell som är mest rimlig att tolka i verksamhetskontext.

### B.3 Tidsvariation

Årseffekt ska testas explicit eftersom uppgiften nämner att skadebeteende kan förändras över tid.

Två modeller ska därför jämföras:

- Poisson-GLM utan `Ar`
- Poisson-GLM med `Ar` som kategorisk variabel

Slutsatsen ska inte bara bygga på in-sample-passform utan på om år förbättrar prediktionen på en senare period.

### B.4 Modellkontroll

Följande kontroller ska göras:

- dispersion eller överdispersionskontroll
- residualplottar på en nivå som är rimlig för count-data
- kontroll av om skattade effekter verkar stabila och rimliga

Om Poisson visar tydliga problem kan negativ binomial användas som robusthetskontroll, men Poisson ska fortsatt vara huvudspåret eftersom det är den modell uppgiften explicit utgår från.

### B.5 Tolkning

GLM-resultaten ska översättas till:

- incidenskvoter eller annan tydlig effektstorlek
- tolkning av referenskategorier
- diskussion om affärsmässig innebörd

Det är här rapporten ska bli stark. Det räcker inte att visa koefficienter; resultatet måste förklaras så att någon i försäkringsverksamheten förstår vad de betyder.

## Fas C — XGBoost som challenger-modell

XGBoost ska användas som jämförelsemodell för att testa om en mer flexibel ML-ansats fångar icke-linjära samband eller interaktioner som GLM missar.

### C.1 Modellidé

Målet är inte att maximera teknisk komplexitet, utan att göra en rättvis jämförelse med GLM.

### C.2 Feature-set

Samma kärnvariabler som i GLM ska användas:

- `Verksamhet`
- `GeografisktOmrade`
- `Ar`
- log-transformerade ekonomiska variabler
- explicit hantering av `Duration`

För rättvis jämförelse måste exponering hanteras konsekvent även i ML-modellen. Rekommenderat spår är att modellera skadefrekvens med exponeringsviktning, eller att på annat transparent sätt justera för `Duration`.

### C.3 Valideringsupplägg

Eftersom datan är tidsordnad bör intern validering vara tidsmässig:

- träna på 2021-2023
- validera på 2024
- lås modellval
- utvärdera en gång på 2025

Detta är bättre än vanlig slumpmässig korsvalidering eftersom det efterliknar den verkliga prognossituationen.

### C.4 Tuning

Hyperparametertuning ska vara begränsad och pragmatisk. Planen ska inte fastna i stora grid searches på över en miljon rader. Några centrala parametrar räcker:

- `max_depth`
- `learning_rate`
- `n_estimators`
- `subsample`
- `colsample_bytree`
- eventuell regularisering

### C.5 Tolkning

ML-modellen ska inte bara bedömas på träffsäkerhet. Om den vinner marginellt men är mycket svårare att tolka kan slutsatsen ändå vara att GLM är bättre som huvudmodell. Detta passar väl med kursbokens resonemang om modeller som förenklingar av verkligheten och om avvägningen mellan enkelhet och komplexitet.

## Fas D — Modelljämförelse

Jämförelsen ska göras systematiskt och med tydlig prioritering av mått.

### D.1 Jämförelsemodeller

- global baseline
- enkel segmentbaseline, till exempel per `Verksamhet` eller `Verksamhet x GeografisktOmrade`
- Poisson-GLM
- XGBoost

### D.2 Primära utvärderingsmått

- Poisson deviance eller annat mått som passar count-data
- fel i totalt predikterat skadeantal för testportföljen
- MAE eller RMSE som kompletterande mått

Portföljprognosen är central eftersom uppgiften särskilt ber om totalantalet i testportföljen.

### D.3 Beslutsregel för val av huvudmodell

En rimlig beslutsregel är:

- om XGBoost tydligt förbättrar prediktiv förmåga ska det framgå varför
- om skillnaden är liten bör Poisson-GLM föredras på grund av tolkbarhet och verksamhetsmässig användbarhet

Detta ger en analys som inte bara svarar på vilken modell som är bäst numeriskt, utan vilken som är mest användbar.

## Fas E — Osäkerhet och konfidensintervall

Uppgiftsbakgrunden frågar uttryckligen vilka rader som modellen är mest och minst säker på. Den delen ska därför vara obligatorisk, inte ett bihang.

### E.1 Portföljnivå

För GLM bör osäkerheten uppskattas för den totala prognosen för 2025, till exempel med:

- analytiskt prediktionsintervall om det är praktiskt möjligt
- bootstrap som robust och lättförklarad metod

### E.2 Radnivå

För varje rad i testdatan ska gruppen beräkna eller approximera ett osäkerhetsmått, till exempel:

- standardfel för prediktion
- intervallbredd
- relativ osäkerhet

Sedan ska de mest och minst osäkra raderna beskrivas:

- vilka segment de tillhör
- vilka egenskaper som verkar driva osäkerheten
- vad detta betyder för användning av modellen i praktiken

## Fas F — Preskriptiv analys och verksamhetsrekommendationer

Här ska gruppen svara på frågan: vad gör man med analysen?

Preskriptiva slutsatser kan till exempel handla om:

- om vissa segment bör betraktas som tydligt högre risk
- om `Omsattning` verkar vara en rimlig ratingfaktor
- om `Forsakringsbelopp` eller `Sjalvrisk` tillför tillräckligt mycket för att motivera inkludering
- om vissa segment kräver manuell bedömning eller mer data på grund av hög osäkerhet
- om GLM bör användas som huvudmodell och XGBoost som challenger i modellövervakning

Detta ska kopplas tillbaka till kursbokens idé om att preskriptiv analys stödjer val av handlingsalternativ.

## 7. Rapportstruktur enligt mall

## 1. Inledning

Ska innehålla:

- problembakgrund i försäkring och prissättning
- varför skadefrekvens är central
- syfte och huvudfråga
- kort presentation av att två modeller jämförs

## 2. Ämnesbeskrivning

Ska innehålla:

- vad man typiskt gör i försäkringsprissättning
- varför frekvensmodellering är relevant
- kort verksamhetskontext
- kursbokskoppling kring deskriptiv, prediktiv och preskriptiv analys

Här ska man inte lägga statistisk metodteori i detalj.

## 3. Metod

Ska innehålla:

- databeskrivning och eventuella datarensningar
- motivering av Poisson-GLM
- motivering av XGBoost som challenger
- hur `Duration` hanteras
- hur intern validering och slutlig testning görs
- hur validitet och reliabilitet diskuteras
- begränsningar med observationsdata

## 4. Resultat

Ska innehålla:

- deskriptiva figurer och tabeller
- huvudresultat från Poisson-GLM
- jämförelse mellan modeller
- total prediktion för testportföljen
- osäkerhetsresultat

## 5. Analys

Ska innehålla:

- tolkning av viktigaste fynden
- varför en modell föredras framför den andra
- diskussion av multikollinearitet, tidsvariation och modellantaganden
- reflektion kring robusthet och begränsningar

## 6. Slutsats

Ska innehålla:

- kort svar på huvudfrågan
- kort svar på de viktigaste delfrågorna
- begränsningar
- förslag till vidare arbete

## 8. Rekommenderad arbetsordning

1. Slutför deskriptiv analys och fastställ vilka figurer och tabeller som ska in i rapporten.
2. Bygg Poisson-GLM med tydligt variabelval och kontroll av multikollinearitet.
3. Testa årseffekt och fatta beslut om slutlig GLM-specifikation.
4. Träna XGBoost med samma informationsmängd och samma valideringslogik.
5. Jämför modellerna på valideringsåret och därefter på teståret 2025.
6. Beräkna portföljprognos och osäkerhet.
7. Skriv analys- och slutsatsdelarna utifrån beslutsrelevans, inte bara statistik.

## 9. Vad som bör förbättras jämfört med tidigare utkast

Den nya planen ska tydligt förbättra följande punkter:

- Frågeställningen ska kopplas hårdare till beslut om prissättning och modellval.
- Testfilen ska reserveras för slutlig utvärdering, inte användas löpande för att välja modell.
- Resultat som ännu inte är fastställda ska inte skrivas in som om de vore slutsatser.
- Moderationsanalys ska inte vara huvudspår. Om interaktioner undersöks ska de formuleras inom Poisson-ramen, inte som en vanlig linjär modell `Y = a + bX`.
- Preskriptiv analys ska beskrivas som rekommendationer och beslutsstöd, inte som att ni måste bygga en full optimeringsmodell.
- Kursbokskopplingen ska vara konkret: beskrivning av data, validitet och reliabilitet, samband kontra orsak, prediktiv validering och slutligen beslutsrelevanta rekommendationer.

## 10. Kriterier för att planen är genomförd

Planen är genomförd när gruppen har:

- en tydlig Poisson-GLM med motiverad variabeluppsättning
- en rättvist tränad XGBoost-modell
- en tydlig jämförelse på osedd data
- en prognos för totalt antal skador i testportföljen 2025
- en analys av vilka rader eller segment som är mest och minst osäkra
- en rapport som följer mallens struktur och tydligt diskuterar antaganden, begränsningar och beslutsrelevans
