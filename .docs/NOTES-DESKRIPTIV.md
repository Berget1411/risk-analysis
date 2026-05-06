# NOTES-DESKRIPTIV.md — Resultat och tolkningar: Deskriptiv Analys (A1–A5)

Dokumentet följer ett fast miniformat för varje resultatavsnitt:
- **Vad gjordes?** → kortfattat om vad steget innebär
- **Vad visar tabellen/siffran?** → tolkning med referenspunkt, riktning och magnitud
- **Varför spelar det roll?** → konsekvens för modellval eller prissättning

Den deskriptiva analysen bygger på träningsdatan (2021–2024) med totalt 1 033 386 rader.

---

## 1. Skadefrekvens per Verksamhet (A3)

**Vad gjordes?**
Portföljen aggregerades per verksamhetsområde. För varje grupp beräknades andelen av den totala portföljen samt *skadefrekvensen* (antalet observerade skador dividerat med total exponeringstid).

| Verksamhet               | Andel av portföljen | Skador per exponerat år |
|--------------------------|---------------------|-------------------------|
| VVS                      | 9,98 %              | 0,0316                  |
| Takarbeten               | 4,99 %              | 0,0250                  |
| Byggföretag              | 39,96 %             | 0,0221                  |
| Övriga specialistföretag | 16,99 %             | 0,0214                  |
| Grävning & Schaktning    | 8,03 %              | 0,0189                  |
| Elektriker               | 9,99 %              | 0,0154                  |
| Målare                   | 10,05 %             | 0,0141                  |

**Vad visar tabellen?**
- **Spridningen:** Skadefrekvensen varierar kraftigt. VVS har högst frekvens (drygt 3,1 skador per 100 år), vilket är mer än dubbelt så högt som Målare (1,4 skador per 100 år).
- **Volymen:** Byggföretag dominerar portföljen (40 %) och utgör en naturlig "mittpunkt" i skaderisk (0,0221), vilket är mycket nära portföljens totala genomsnitt (ca 0,021).

**Varför spelar det roll?**
Tabellen bevisar att "Entreprenad" inte är en homogen riskgrupp. De enorma skillnaderna i historisk skadefrekvens innebär att verksamhetstyp måste vara en central ratingfaktor i modellen för att undvika systematisk felprissättning. Det motiverar också valet av Byggföretag som referenskategori, eftersom det utgör den största och mest stabila basen.

---

## 2. Skadefrekvens per Geografiskt område (A3)

**Vad gjordes?**
På samma sätt som för verksamhet grupperades all historisk data efter geografiskt område och skadefrekvensen beräknades.

| Geografiskt område | Andel av portföljen | Skador per exponerat år |
|--------------------|---------------------|-------------------------|
| Storstad           | 40,00 %             | 0,0261                  |
| Mellanstorstad     | 29,98 %             | 0,0215                  |
| Landsbyggd         | 10,00 %             | 0,0179                  |
| Småstad            | 20,03 %             | 0,0135                  |

**Vad visar tabellen?**
- **Storstad** har tydligt högst skadefrekvens (0,0261) och utgör den största enskilda volymen (40 %).
- Det finns ingen rak "stad-till-land"-gradient. Medan frekvensen sjunker från Storstad till Mellanstorstad till Landsbyggd, så har **Småstad** den absolut lägsta skadefrekvensen i hela portföljen (0,0135).

**Varför spelar det roll?**
Att Storstad har hög risk stämmer med branschpraxis, men att Småstad har mycket lägre frekvens än Landsbyggd är en viktig insikt. Det innebär att en prissättningsmodell inte bara kan använda en binär "Stad/Land"-indelning. Den geografiska variabeln måste behållas med sina fyra separata kategorier i GLM-modellen för att prissättningen ska bli korrekt kalibrerad.

---

## 3. Tidsutveckling — Årseffekten (A3)

**Vad gjordes?**
Skadefrekvensen beräknades aggregerat per kalenderår över hela träningsperioden (2021–2024).

| År   | Antal rader | Totala skador | Skador per exponerat år |
|------|-------------|---------------|-------------------------|
| 2021 | 239 213     | 4 565         | 0,0213                  |
| 2022 | 252 034     | 4 627         | 0,0205                  |
| 2023 | 264 444     | 5 092         | 0,0215                  |
| 2024 | 277 695     | 5 446         | 0,0219                  |

**Vad visar tabellen?**
- Portföljen växer jämnt (från knappt 240 000 rader år 2021 till nästan 278 000 rader år 2024).
- Skadefrekvensen är anmärkningsvärt stabil. Den dippar något 2022 (till 0,0205) och stiger svagt till 2024 (0,0219), men överlag rör sig hela portföljens frekvens inom ett mycket smalt band runt 2,1 procent. Det saknas en tydlig, kraftig och monoton trend.

**Varför spelar det roll?**
Den stabila frekvensen över tid utgör det första empiriska stödet för att ifrågasätta om en årskomponent (trend) behövs i modellen. Eftersom skadefrekvensen inte rört sig dramatiskt är det troligt att variabler som beskriver portföljens sammansättning (vilka företag som tecknar försäkring) är mycket viktigare än tidsvariabeln. Detta ledde sedan fram till valideringstestet i GLM där årseffekten till slut exkluderades.

---

## 4. Ekonomiska variabler och samvariation (A4)

**Vad gjordes?**
Sambandet mellan de ekonomiska variablerna (Omsättning, Försäkringsbelopp och Självrisk) undersöktes. Dels beräknades Pearson-korrelationen mellan dem (på logaritmisk skala), och dels delades portföljen in i 10 lika stora grupper (deciler) för varje variabel för att studera hur skadefrekvensen förändrades när variabelns värde ökade.

**Samvariation (korrelation på log-skala):**
- Omsättning och Försäkringsbelopp: $r = 0,57$

**Skadefrekvens per decil (lägsta till högsta värde):**
- **Omsättning:** Ökar monotont från 0,0072 (Decil 1) till 0,0404 (Decil 10). En spridning på **5,6 gånger**.
- **Försäkringsbelopp:** Ökar från 0,0107 (Decil 1) till 0,0343 (Decil 10). En spridning på **3,2 gånger**.

**Vad visar siffrorna?**
- Omsättning och Försäkringsbelopp överlappar varandra till stor del ($r=0,57$), vilket betyder att de i mångt och mycket mäter samma sak: företagsstorlek.
- Spridningen i skadefrekvens är betydligt bredare (brantare lutning) för Omsättning än för Försäkringsbelopp. Omsättning differentierar risken från 0,7 % upp till över 4 %, medan Försäkringsbeloppet stannar inom ett snävare band.

**Varför spelar det roll?**
På grund av den höga korrelationen riskerar modellen att drabbas av multikollinearitet om båda variablerna inkluderas; de skulle "tävla" om samma förklaringsvärde vilket gör koefficienterna instabila. Eftersom decil-analysen entydigt visade att Omsättning har en starkare förmåga att separera högrisk från lågrisk (5,6 gångers spridning mot 3,2), fälldes beslutet att enbart inkludera Omsättning i GLM-modellen och helt exkludera Försäkringsbelopp (och Självrisk). Detta filtersteg förenklade modellbygget drastiskt.
