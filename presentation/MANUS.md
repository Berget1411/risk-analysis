# Presentationsmanus

Ca 5 minuter. 8 slides, ~35-40 sek per slide.

---

## Slide 1: Titel (5 sek)

Ingen pratning, bara visa titeln medan ni samlar er.

---

## Slide 2: Frågeställning (45 sek)

"Vi har analyserat skadefrekvensen i Länsförsäkringars entreprenadportfölj. Tre frågor: Vilka faktorer driver risk? Kan vi prediktera 2025? Och behövs maskininlärning?

Datan: en miljon avtal över fyra år. 98 procent har noll skador, så modellen måste klara extremt gles data. Vi delar i tid — tränar på historik, testar framåt. Aldrig tvärtom."

---

## Slide 3: Deskriptiva fynd — figur (45 sek)

"Innan modellering tittade vi på rådatan. Tre faktorer sticker ut.

VVS har dubbelt så hög skadefrekvens som Målare. Storstad dubbelt mot Småstad. Omsättning visar starkaste gradienten — 5,6 gångers spridning mellan lägsta och högsta decil.

Det här ger oss tre tydliga kandidater till modellen."

---

## Slide 4: Poisson-GLM (40 sek)

"Vi bygger en Poisson-GLM, som är standardmodellen för räknedata i försäkring. Duration hanteras som offset så vi skattar frekvens per år, inte bara antal.

Modell M2 med alla tre variabler ger en AIC-förbättring på 2 752 enheter. Dispersionskvoten nära 1 bekräftar att Poisson-antagandet håller. Årseffekt testades men gav ingenting — ΔAIC bara 2."

---

## Slide 5: Rate Ratios — forest plot (50 sek)

"Det här är studiens viktigaste figur. Rate ratios visar hur varje faktor multiplicerar skadefrekvensen, allt annat lika.

Röda punkter = högre risk. VVS 43 procent mer än Byggföretag. Storstad 46 procent mer än Landsbyggd. Blå = lägre risk — Målare minus 36 procent.

Alla har snäva konfidensintervall. Skillnaderna är inte slump."

---

## Slide 6: Rate Ratios — tabell (30 sek)

"Samma information i siffror. Notera att fördubblad omsättning ger 36 procent högre frekvens — det är utöver den exponering Duration redan fångar. Det här är stort nog för premiedifferentiering."

---

## Slide 7: GLM vs XGBoost — tabell (45 sek)

"Vår challenger. XGBoost med grunda träd — djup 3 fungerade bäst, vilket bekräftar att signalen är additiv, precis som GLM antar.

På testdatan: deviance skiljer 0,08 procent. RMSE identiskt. Portföljfelet faktiskt lägre för GLM. Ingen anledning att byta till en svårtolkad modell."

---

## Slide 8: Slutsats (40 sek)

"GLM predikterar 5 581 skador mot 5 520 observerade. 1,1 procent fel.

Rekommendation: differentierad premie efter alla tre faktorer. GLM som huvudmodell för sin transparens. XGBoost som bakgrundskontroll.

Och kom ihåg: det här är samband, inte bevisad orsak. Och det är frekvens, inte kostnad — fullständig premie kräver en kostnadsmodell utöver denna."

---

## Vanliga frågor (backup)

- **"Varför inte negativ binomial?"** — Dispersionskvoten 0,986 visar att Poisson räcker. Ingen överdispersion.
- **"Varför log(Omsättning)?"** — Högersnedfördelad. Log gör tolkningen naturlig: "per fördubbling" istället för "per krona".
- **"Är det kausalitet?"** — Nej. Associationer i observationsdata. Vi har inte bevisat att VVS *orsakar* skador.
- **"Varför inte fler variabler?"** — Försäkringsbelopp korrelerar 0,57 med Omsättning (multikollinearitet). Självrisk har svagast gradient.
- **"Hur säker är portföljprognosen?"** — 95% KI: [5 503, 5 659]. Relativ osäkerhet 2,8%. Observerat 5 520 ligger i intervallet.
- **"Var är modellen mest osäker?"** — Ovanliga kombinationer (VVS + Småstad, Takarbeten + Landsbyggd) och extrema omsättningar.
