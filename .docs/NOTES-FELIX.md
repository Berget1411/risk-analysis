# NOTES-FELIX.md — Beslut och motiveringar

## Vad det här dokumentet handlar om

Det här dokumentet samlar resonemangen bakom de viktigaste metodbesluten i Poisson-GLM-delen av projektet. Det uppstod ur en diskussion om hur vi förenklar fas B utan att tappa metodmässig förankring — och hur vi håller oss inom kursens och uppgiftens scope utan att överkompicera.

Tre övergripande frågor utreds:

1. **Vilket variabelval är motiverat?** Kan vi använda den deskriptiva analysen för att direkt forma modellspecifikationen, eller måste vi testa alla alternativ i GLM?
2. **Hur hanterar vi `Ar`?** Ska årseffekt inkluderas, och i så fall hur — och vad innebär det att exkludera den?
3. **Var går modellens gräns?** Vad antar vi om den datagenererande processen, och hur kommunicerar vi det i rapporten utan att undergräva analysens värde?

---

## Kondenserad sammanfattning

**Scope:** Projektet syftar till att bygga, jämföra och tolka modeller för skadefrekvens samt prediktera testportföljen 2025 — inte att designa ett fullständigt prissättningssystem för löpande drift. Det är en analytikeruppgift med en definierad tidshorisont. Alla beslut nedan är fattade i det ljuset.

**Röd tråd:** Den deskriptiva analysen (A3, A4) formar modellspecifikationen direkt. Det enda genuint osäkra valet — `Ar` — avgörs av validering med fast beslutskriterium satt i förväg. Alla andra variabelbeslut är redan fattade av deskriptiv analys.

| Beslut | Slutsats | Grund |
|---|---|---|
| `Ar` | Testa numerisk trend på 2024-validering (ΔAIC > 10 + valideringsförbättring). Förväntat utfall: utesluts. | Validering — genuint osäkert |
| `log(Omsattning)` | Inkludera — starkast samband (5,6× decilspridning) | Deskriptiv analys A4 |
| `Forsakringsbelopp` | Uteslut — svagare gradient (3,2×) + måttlig korrelation med Omsattning | Deskriptiv analys A4 |
| `Sjalvrisk` | Uteslut — svagast empiriskt samband trots konceptuellt intressant | Deskriptiv analys A4 |
| VIF-analys | Behövs inte — multikollinearitet löst uppströms i variabelvalsfasen | Konsekvens av ovanstående |
| DGP-stabilitet | Antas stabil, kommuniceras öppet som begränsning | Nödvändigt antagande givet att `Ar` utesluts |
| Scope | Engångsprediktion 2025, inte löpande drift — förändrar vilka krav som är rimliga | PLAN.md |

**Vad som inte görs, och varför:**
- Ingen VIF-genomgång — löst uppströms
- Inga LR-test — AIC + validering fyller samma syfte på kursnivå
- Ingen bred modellsökning bland storleksvariabler — deskriptiv analys har redan avgjort det
- Ingen design för löpande drift — utanför scope

---

---

## Scope-analys — vad vårt faktiska syfte innebär, och varför det håller oss på rätt spår

### Vad syftet faktiskt är

Enligt `PLAN.md` är projektets syfte:

> "Att bygga, jämföra och tolka två modeller för skadefrekvens i Länsförsäkringars entreprenadportfölj — en Poisson-GLM och en XGBoost-modell — samt att använda dessa för att förutsäga skadeutfall i testportföljen 2025 och formulera verksamhetsrelevanta rekommendationer."

Det innebär konkret tre leverabler:
1. En tolkbar modell som förklarar vilka faktorer som hänger samman med skadefrekvens
2. En prediktiv jämförelse mellan GLM och XGBoost
3. Beslutsunderlag för prissättning, segmentering och vidare datainsamling

Det är **inte** syftet att:
- bygga ett fullständigt prissättningssystem
- leverera en modell redo för kontinuerlig drift
- täcka alla tänkbara scenarion och contingencies

Den distinktionen är viktig — inte för att begränsa ambitionsnivån, utan för att hålla analysen fokuserad på det som faktiskt svarar på uppgiften.

### Varför detta är den rätta avgränsningen

En vanlig fallgrop i modellprojekt är att börja lösa ett större problem än det som faktiskt ställts. Om vi börjar designa för löpande drift — med rekalibrering, DGP-monitorering, rullande validering och robusthet mot distribution shift — lägger vi tid på krav som uppgiften inte ställer och riskerar att missa det vi faktiskt ska leverera: en välmotiverad, tolkbar analys med tydliga slutsatser.

Vår uppgift är att ta en väldefinierad historisk dataset, bygga en rimlig modell, och svara på om den predikterar 2025 väl. Det är en analytikeruppgift, inte en systemdesignuppgift.

Vi jämför ändå med ett bredare scope — inte för att vi ska lösa det, utan för att tydliggöra vad vi *inte* gör och ge en naturlig grund till de preskriptiva rekommendationerna. Det är en skillnad att känna till mot att arbeta med.

---

### Jämförelse: vårt scope vs löpande prissättningsmodell

| Beslut | Engångsprediktion 2025 (vårt scope) | Löpande prissättningsmodell |
|---|---|---|
| **`Ar`** | Utesluts — kan inte extrapoleras, svag trend | Bör hanteras explicit — modellen behöver mekanism för att fånga tidsrörelse och flagga DGP-skiften |
| **`Sjalvrisk`** | Utesluts — svag empirisk evidens räcker som skäl | Värt att undersöka vidare — konceptuellt relevant riskbenägenhetsignal, kräver mer data |
| **DGP-stabilitet** | Antas stabil, erkänns som begränsning | Kräver aktivt monitorering och rekalibrering när DGP förändras |
| **VIF** | Bedöms inte nödvändig för engångsskattning | Bör kontrolleras formellt vid löpande användning, eftersom korrelationsstrukturen kan förändras när portföljen växer |
| **Modellkomplexitet** | Enkelhet och tolkbarhet prioriteras | Tolkbarhet fortfarande viktig, men robusthet mot distribution shift blir lika central |
| **Valideringslogik** | Tidssplit 2021–2023 / 2024 / 2025 | Rullande validering — modellen utvärderas löpande mot faktiskt utfall varje år |
| **Osäkerhetshantering** | Nämns som begränsning, preskriptiv rekommendation | Måste byggas in i systemet — konfidensintervall, flaggor för osäkra segment, eskaleringsregler |

---

### Varför detta är relevant för rapporten

Att göra denna distinktion explicit i rapporten är ett starkt drag av tre skäl:

1. **Det avgränsar projektet ärligt.** Vi bygger inte en komplett prissättningsstrategi — vi levererar ett välmotiverat beslutsunderlag för ett definierat syfte. Det är en annan uppgift, och den ska beskrivas som det.

2. **Det visar att vi förstår vad vi *inte* löser.** Att identifiera vad som krävs för löpande användning — monitorering, rekalibrering, robusthet mot DGP-skiften — visar att gruppen förstår modellens gränser i verklig tillämpning.

3. **Det ger en naturlig preskriptiv rekommendation.** Om Länsförsäkringar vill använda modellen framöver pekar analysen på exakt vad som behöver byggas till — utan att vi behöver leverera det inom projektet.

Rapporttext:
> "Syftet med projektet är att bygga, jämföra och tolka modeller för skadefrekvens samt att förutsäga skadeutfall i testportföljen 2025 — inte att leverera ett fullständigt prissättningssystem för löpande drift. Flera metodval är motiverade inom detta scope: att exkludera en explicit tidskomponent, att inte formellt testa alla variabelkombinationer, och att behandla DGP-stabilitet som ett erkänt antagande snarare än ett aktivt hanterat krav. Om modellen avsågs användas löpande skulle dessa val kräva omprövning — med rekalibrering, monitorering av den datagenererande processen och rullande validering mot faktiskt utfall. Att designa ett sådant system ligger utanför detta projekts scope och uppgiftens krav."

---

## Hantering av `Ar` i Poisson-GLM

### Bakgrund

`Ar` är en kandidatvariabel som representerar kalenderår (2021–2024 i träning, 2025 i test). Frågan är om den bör inkluderas i Poisson-GLM och i så fall hur.

Två spår är möjliga:

- **Spår A:** Exkludera `Ar` direkt, motiverat av deskriptiv analys och principiella argument
- **Spår B:** Testa `Ar` explicit och låt valideringsdata avgöra

---

### Spår A — Exkludera direkt

**Argument för:**

1. **Kategorisk årseffekt kan inte extrapoleras.** `C(Ar)` lär sig koefficienter för 2021–2023. År 2025 finns inte i träningsdatan — modellen kan inte prediktera en okänd kategori. Det gör `C(Ar)` oanvändbar för projektets huvudsyfte.

2. **Trenden är svag i deskriptiv analys.** A3 visade en svag och ojämn uppåtrörelse 2022–2024, inte en tydlig monoton trend. Det ger begränsat stöd för att en numerisk trendterm skulle generalisera meningsfullt till 2025.

3. **Rörelsen bedöms delvis fångas av `log(Omsattning)`.** Om portföljens sammansättning förändrats över tid — exempelvis fler stora företag — absorberas det av omsättningsvariabeln. En separat årsterm riskerar att delvis dubbelräkna denna rörelse.

4. **Sparar resurser inom projektets scope.** Att exkludera `Ar` med tydlig motivering från deskriptiv analys är ett legitimt och kursrelevant val. Projektet handlar om att bygga en tolkbar, väl motiverad modell — inte att prova alla tänkbara specifikationer.

**Svaghet:** Beslutet är principiellt, inte datadrivet. En kritiker kan invända att trenden faktiskt finns och att vi avfärdar den utan att ha provat ordentligt.

---

### Spår B — Testa och låt validering avgöra

**Argument för:**

1. **Datadrivet och transparent.** Kör modell med och utan `Ar` (numerisk), jämför AIC och valideringsdeviance på 2024. Om `Ar` inte förbättrar out-of-sample är det faktisk evidens — starkare än principiella argument.

2. **Stärker trovärdigheten i slutsatsen.** "Vi testade och det hjälpte inte" är ett bättre argument i rapporten än "vi antog att det inte skulle hjälpa".

3. **Begränsad extra arbetsinsats.** Det är en modell till med ett extra steg i valideringen — inte en stor omgång.

**Svaghet:** Riskerar att dra in i en bredare diskussion om tidsvariation som tar fokus från kärnanalysen. Om `Ar` faktiskt förbättrar 2024 marginellt uppstår ett svårt beslut om hur det ska hanteras för 2025-prediktionen.

---

### Avvägning

Båda spåren är metodmässigt försvarbara. Skillnaden är:

| | Spår A | Spår B |
|---|---|---|
| Grund för beslut | Deskriptiv analys + principiella argument | Valideringsdata |
| Arbetsinsats | Lägre | Marginellt högre |
| Trovärdighet i rapport | God om argumenten är tydliga | Starkare — datadrivet |
| Risk | Kritik för att inte ha testat | Om `Ar` hjälper marginellt — svårt beslut |

Projektets syfte är att bygga en tolkbar, väl motiverad modell för prissättning — inte att optimera teknisk träffsäkerhet. Kurslogiken betonar motiverade val och tydliga resonemang, inte uttömmande modellsökning.

---

### Slutsats

**Välj Spår B, men med ett fast beslutskriterium satt i förväg.**

Testa `Ar` som numerisk variabel mot basmodellen på 2024-valideringsdata. Sätt beslutskriteriet innan ni kör:

- Om ΔAIC > 10 **och** valideringsdeviance förbättras tydligt → inkludera `Ar` och diskutera extrapolationsproblemet öppet
- Annars → exkludera `Ar` och rapportera att testet inte gav tillräckligt stöd

Det ger det bästa av båda spåren: ett datadrivet beslut med begränsad extra arbetsinsats, och en tydlig metodtext i rapporten. Principargumenten från Spår A används som kompletterande motivering, inte som huvudargument.

**Förväntat utfall:** Baserat på A3 (svag trend) är sannolikheten hög att `Ar` inte förbättrar 2024-valideringen tillräckligt. Slutsatsen blir troligen densamma som Spår A — men nu med faktisk evidens bakom sig.

---

### Rapporttext

> "`Ar` testades som numerisk trendvariabel i Poisson-GLM och jämfördes mot basmodellen på valideringsåret 2024. Årseffekten förbättrade inte prediktionen tillräckligt för att motivera inkludering (ΔAIC = X, valideringsdeviance ökade/minskade marginellt). Detta är i linje med den svaga tidsrörelsen i deskriptiv analys (A3). Eftersom en kategorisk årseffekt inte kan extrapoleras till testperioden 2025 och en linjär trend bedömdes ge sken av precision som data inte stödjer, uteslöts `Ar` ur slutmodellen."

---

### Gardering för omvärldseffekter

Strukturella skiften i skadefrekvens till följd av inflation, lagstiftning eller konjunktur kan inte fångas av tillgänglig portföljdata oavsett modellspecifikation. Detta hanteras i rapporten på tre sätt:

1. **Erkänn begränsningen explicit** i metodavsnittet.
2. **Använd 2024-valideringen som indikator** — om modellen predikterar 2024 väl utan `Ar` är omvärldseffekterna under perioden tillräckligt svaga för att modellen ska hålla.
3. **Preskriptiv rekommendation:** Modellen bör utvärderas löpande mot faktiskt utfall. Systematisk avvikelse under ett nytt år indikerar ett omvärldsskifte som motiverar rekalibrering.

---

### Modellens giltighetsgräns — stabil datagenererande process

En statistisk modell lär sig mönster från historisk data. Det förutsätter att den process som genererar data — alltså de underliggande riskfaktorerna i portföljen — är tillräckligt stabil över tid för att historiska samband ska gälla framåt.

**Modellen är ett beslutsunderlag, inte en sanning.**

Om den datagenererande processen förändras väsentligt — exempelvis genom:
- kraftig prisinflation i byggbranschen som ändrar skadebilden
- ny lagstiftning om arbetsmiljö eller entreprenadansvar
- ett makroekonomiskt skifte som förändrar vilka projekt som genomförs
- stora portföljförändringar hos Länsförsäkringar

— är modellens skattningar inte längre giltiga som direkt grund för prissättning. Modellen känner inte till att världen har förändrats; den fortsätter prediktera som om 2021–2024 fortfarande gäller.

**Vad detta innebär för rapporten:**

Vi ska vara tydliga med att modellen är giltig som beslutsunderlag under förutsättning att portföljens riskstruktur är rimligt stabil. Detta är inte en svaghet som är unik för vår modell — det är en grundläggande begränsning för all statistisk modellering på observationsdata.

Rapporttext:
> "Modellen är ett beslutsunderlag under antagandet att den datagenererande processen är tillräckligt stabil mellan träningsperioden och den period då modellen används. Vid väsentliga förändringar i omvärlden — exempelvis ny lagstiftning, kraftig prisinflation eller stora strukturella förändringar i portföljen — bör modellens prediktioner användas med försiktighet och kompletteras med expertbedömning. Att bygga en fullständig prissättningsstrategi med contingencies för sådana scenarion ligger utanför detta projekts scope."

**Varför detta är ett starkt avslut i rapporten:**

Det visar att gruppen förstår skillnaden mellan en modell som verktyg och en modell som sanning. Det är precis den typ av kritisk reflektion kursen efterfrågar — och det avgränsar projektet på ett ärligt och trovärdigt sätt utan att undergräva analysens värde.

### Koppling till årseffekten — en nypa salt

Att exkludera `Ar` och att anta stabil DGP är inte två separata beslut — de är två sidor av samma mynt.

**Vad sambandet innebär:**

En modell utan årseffekt har ingen mekanism för att registrera att världen förändras mellan år. Den antar implicit att skadebeteendet som gällde 2021–2023 (träningsperioden) fortfarande gäller 2025 — justerat för verksamhet, geografi och omsättning, men inte för tid i sig. Det är precis definitionen av ett DGP-stabilitetsantagande.

Om DGP faktiskt är stabil är det rätt val — en årsterm hade bara absorberat brus och riskerat överanpassning. Men om DGP har förändrats finns det ingen variabel i modellen som fångar det. Modellen vet inte vad den inte vet och kommer att prediktera 2025 som om det vore 2022.

**Varför de hänger ihop i rapporten:**

Det vore inkonsekvent att å ena sidan motivera att `Ar` utesluts eftersom trenden är svag och svår att extrapolera, och å andra sidan inte erkänna att detta val vilar på ett antagande om att det inte finns någon tidsrörelse att fånga. Dessa två resonemang måste presenteras tillsammans — annars ser det ut som att vi exkluderar `Ar` för att det är smidigt, snarare än för att vi gjort ett medvetet val med kända konsekvenser.

**Praktisk konsekvens för tolkning:**

Om valideringsresultatet på 2024 är gott utan `Ar` är det empiriskt stöd för att DGP-antagandet håller för perioden 2021–2024. Det stärker men garanterar inte att det håller för 2025. Prediktionen för 2025 bör därför tas med en nypa salt specifikt i detta avseende — inte för att modellen är dålig, utan för att vi medvetet valt bort den mekanism som annars hade flaggat för tidsrörelse.

Rapporttext:
> "Modellen inkluderar ingen explicit tidskomponent. Det innebär ett implicit antagande om att den datagenererande processen är tillräckligt stabil över tid — att de mönster som gäller för 2021–2023 även gäller för 2025, justerat för portföljens sammansättning. Att årseffekten inte förbättrade prediktionen på valideringsåret 2024 ger visst empiriskt stöd för detta antagande, men garanterar det inte. Om skadebeteendet förändrats strukturellt efter träningsperioden — exempelvis till följd av inflation, reglering eller portföljförändringar — fångas detta inte av modellen. Prediktionen för 2025 bör tolkas med denna begränsning i åtanke."

---

## Variabelval — deskriptiv analys som primärt filter

### Frågeställningen

Bör vi testa alla tillgängliga variabler i GLM och låta skattningarna avgöra, eller är deskriptiv analys tillräcklig grund för att exkludera variabler utan att testa dem?

### Den viktiga distinktionen — två olika typer av beslut

`Ar`-fallet och storleksvariablerna är **inte samma typ av beslut** och bör därför hanteras olika.

**`Ar`** var genuint osäkert — deskriptiv analys gav svagt stöd åt båda håll. Testas därför med validering för att lösa osäkerheten med data.

**`Forsakringsbelopp` vs `Omsattning`** är inte en fråga om *om* de tillför något, utan *vilken av dem* som är bättre. A4 visade att de mäter delvis samma sak (r = 0,57 på log-skala). Det är ett multikollinearitetsproblem — att inkludera båda skapar instabila skattningar eftersom modellen inte kan skilja deras effekter åt. Du måste välja en, och det valet kan göras på deskriptiv grund.

**`Sjalvrisk`** mäter något konceptuellt annorlunda (riskbenägenhet/självriskval, inte enbart storlek) men visade svagast och minst tydligt samband med skadefrekvens av alla tre ekonomiska variabler i A4.

### Varför deskriptiv analys är tillräcklig grund här

Argumenten för att testa alla variabler i GLM är starka när man genuint inte vet vilket bidrag de har. Men A4 visade redan:

- `Omsattning`: 5,6× spridning i skadefrekvens mellan deciler — starkast
- `Forsakringsbelopp`: 3,2× — samma riktning men svagare gradient
- `Sjalvrisk`: svagast och ojämnast mönster
- `Forsakringsbelopp` och `Omsattning` korrelerar (r = 0,57 på log-skala) — strukturellt kollinearitetsproblem

Det är uppmätt evidens, inte hypoteser. Att köra GLM-varianter för att bekräfta detta tillför i bästa fall marginell extra trovärdighet, i värsta fall en lång modellsökning som distraherar från kärnanalysen och ger sken av att variabelval gjordes data-drivet när det i praktiken var förutbestämt av deskriptiv analys.

### Rekommendation

**Använd deskriptiv analys som primärt filter för storleksvariablerna. Testa inte alla kombinationer i GLM.**

- `Omsattning` väljs över `Forsakringsbelopp` — motiverat av starkare gradient och kollinearitetsproblem vid simultant inkludering. Det är ett val *mellan alternativ*, inte ett test av om de hjälper.
- `Sjalvrisk` utesluts — motiverat av svagast samband i deskriptiv analys. Inget GLM-test behövs.
- `Ar` testas — genuint osäkert bidrag, inget kollinearitetsproblem, deskriptiv analys otillräcklig för att avgöra.

### Sammanfattande beslutstabell

| Variabel | Beslut | Metod | Anledning |
|---|---|---|---|
| `C(Verksamhet)` | Inkludera | Deskriptiv analys | Tydliga segmentskillnader (A3) |
| `C(GeografisktOmrade)` | Inkludera | Deskriptiv analys | Tydlig urban-rural-gradient (A3) |
| `log(Omsattning)` | Inkludera | Deskriptiv analys | Starkast gradient, väljs över Forsakringsbelopp (A4) |
| `log(Forsakringsbelopp)` | Uteslut | Deskriptiv analys | Kollinear med Omsattning, svagare gradient — strukturellt val (A4) |
| `log(Sjalvrisk)` | Uteslut | Deskriptiv analys | Svagast samband, tillför lite utöver storleksmåtten (A4) |
| `Ar` (numerisk) | Testa | Validering på 2024 | Genuint osäkert bidrag, deskriptiv otillräcklig (A3) |

### Vad detta gör för rapportens röda tråd

Den deskriptiva analysen får ett explicit och tydligt syfte: att forma modellspecifikationen. Variabelval i GLM grundas på uppmätta samband och kollinearitetsstruktur från A4, inte på in-sample-optimering i modellsteget. Det är en starkare och mer beslutsrelevant berättelse än att testa sig fram till samma slutsats.

Rapporttext:
> "Variabelval i Poisson-GLM motiverades direkt av den deskriptiva analysen. Omsättning valdes som storleksmått baserat på starkaste monotona samband med skadefrekvens (A4) och utesluter behovet av att inkludera det kollineära Försäkringsbelopp. Självrisk uteslöts på grund av svagast samband. Årseffektens bidrag — som deskriptiv analys inte entydigt kunde avgöra — testades separat på valideringsdata 2024."

### Konsekvens: VIF-analys behövs inte

Eftersom multikollineariteten hanterades redan i deskriptiv fas — genom att välja `Omsattning` och explicit utesluta det korrelerade `Forsakringsbelopp` — innehåller slutmodellen inga variabler med problematisk överlappning. De återstående variablerna (`Verksamhet`, `GeografisktOmrade`, `Omsattning`) är konceptuellt oberoende och kräver ingen formell VIF-kontroll.

Problemet löstes uppströms istället för att diagnostiseras nedströms. VIF-analys kan därför skalas bort utan motiveringsbrister.

Rapporttext:
> "Eftersom korrelerade storleksmått reducerades till ett i variabelvalsfasen, baserat på deskriptiv analys, kräver slutmodellen ingen formell multikollinearitetskontroll."
