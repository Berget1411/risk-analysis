# Presentationsmanus

Ca 10 minuter. 13 slides, ~45 sek per slide.

---

## Slide 1: Titel (5 sek)

Ingen pratning, bara visa titeln medan ni samlar er.

---

## Slide 2: Bakgrund och Syfte (50 sek)

"Entreprenadförsäkring är försäkring för entreprenörer — byggföretag, VVS-firmor, elektriker, takläggare och så vidare. Premien som kunden betalar består av två delar: hur ofta skador inträffar och hur dyra de blir. Vi fokuserar på frekvenskomponenten.

Syftet: identifiera vilka faktorer som driver risken, prediktera ett helt nytt portföljår, och testa om maskininlärning ger mervärde jämfört med en tolkbar modell."

---

## Slide 3: Frågeställning och Metod (50 sek)

"Tre frågor: Vilka faktorer driver skadefrekvensen? Kan vi prediktera 2025 med god träffsäkerhet? Och ger XGBoost bättre resultat än en tolkbar GLM?

Metoden är tidsbaserad validering. Vi tränar på 2021–2023, väljer modell baserat på 2024, och utvärderar slutligen på 2025 som modellen aldrig sett. Det här är samma logik som i verklig prissättning — man måste bestämma sig innan utfallet är känt. Inga framtida data läcker in."

---

## Slide 4: Dataöverblick (45 sek)

"En miljon avtal över fyra år i träning, 291 tusen i test. 98 procent har noll skador — det är extremt glest, men förväntat för försäkringsdata. Poisson-modeller är byggda för exakt den här situationen.

Viktigt: skadefrekvensen är nästan identisk i tränings- och testdata, 0,0214 mot 0,0212. Portföljen är stabil över tid, vilket gör att modellen har goda förutsättningar att generalisera."

---

## Slide 5: Deskriptiva fynd — segment (45 sek)

"Innan modellering tittade vi på rådatan. Två kategoriska faktorer sticker ut.

VVS har dubbelt så hög skadefrekvens som Målare. Storstad dubbelt mot Småstad. Skillnaderna är stora nog för att motivera differentierad prissättning redan i rådatan — men vi behöver en modell för att kvantifiera effekterna allt annat lika."

---

## Slide 6: Deskriptiva fynd — Omsättning (45 sek)

"Omsättning visar den starkaste gradienten av alla variabler. Från lägsta till högsta decilen ökar skadefrekvensen 5,6 gånger. Det är därför vi använder log-omsättning i modellen.

Försäkringsbelopp korrelerar 0,57 med omsättning — multikollinearitet — så vi väljer bara en av dem. Självrisk har svagast gradient och exkluderas också."

---

## Slide 7: Poisson-GLM: Modellval (50 sek)

"Vi bygger en Poisson-GLM. Duration hanteras som offset så vi skattar frekvens per år, inte bara antal.

Fyra modeller i steg. Från M0 till M1 ger verksamhet och geografi minus 1 363 AIC. Att lägga till omsättning ger ytterligare minus 2 752 — den enskilt största förbättringen. Årseffekt ger nästan ingenting och kan inte extrapoleras till 2025, så den exkluderas.

Dispersionskvoten 0,986 bekräftar att Poisson räcker — vi behöver inte negativ binomial."

---

## Slide 8: Rate Ratios — forest plot (50 sek)

"Det här är studiens viktigaste figur. Rate ratios visar hur varje faktor multiplicerar skadefrekvensen, allt annat lika.

Röda punkter = högre risk. VVS 43 procent mer än Byggföretag. Storstad 46 procent mer än Landsbyggd. Blå = lägre risk — Målare minus 36 procent.

Alla har snäva konfidensintervall. Skillnaderna är inte slump."

---

## Slide 9: Rate Ratios — tabell (35 sek)

"Samma information i siffror. Notera att fördubblad omsättning ger 36 procent högre frekvens — det är utöver den exponering Duration redan fångar. Det här är stort nog för premiedifferentiering."

---

## Slide 10: XGBoost: Challenger (45 sek)

"Vår challenger är XGBoost med Poisson-objektiv och samma tre variabler. Det intressanta: djup 3 fungerar bäst. Djupare träd ger sämre resultat, vilket bekräftar att signalen är additiv — precis det GLM antar.

Feature importance visar samma tre variabler i samma ordning: omsättning dominerar, följt av geografi och verksamhet. XGBoost hittar inga dolda mönster som GLM missar."

---

## Slide 11: GLM vs XGBoost — tabell (50 sek)

"Slutlig utvärdering på testportföljen 2025. Deviance skiljer 0,08 procent. RMSE identiskt. Portföljfelet faktiskt lägre för GLM.

På valideringen 2024 var mönstret detsamma — 0,21 procent skillnad i deviance. Ingen anledning att byta till en svårtolkad modell när den enklare fungerar lika bra, eller till och med marginellt bättre på kalibrering."

---

## Slide 12: Osäkerhet (45 sek)

"Hur säker är modellen? På portföljnivå: 2,8 procent relativ osäkerhet. Konfidensintervallet 5 503 till 5 659. Observerat utfall 5 520 ligger inom intervallet.

På radnivå varierar det mer. Ovanliga kundprofiler — VVS i småstad, extremt hög omsättning — har bredare intervall. Det innebär att automatisk prissättning fungerar bra för vanliga segment, men ovanliga profiler kräver manuell granskning."

---

## Slide 13: Slutsats och Rekommendation (50 sek)

"GLM predikterar 5 581 skador mot 5 520 observerade. 1,1 procent fel. Tre faktorer ger ungefär 3 gångers spridning mellan lägsta och högsta riskprofil.

Rekommendation: differentierad premie efter alla tre faktorer. GLM som huvudmodell för sin transparens — rate ratios översätts direkt till premiejusteringar. XGBoost som bakgrundskontroll som larmar vid drift.

Och två viktiga förbehåll: det här är samband i observationsdata, inte bevisad orsak. Och det är frekvens — full premie kräver en separat kostnadsmodell."

---

## Vanliga frågor (backup)

- **"Varför inte negativ binomial?"** — Dispersionskvoten 0,986 visar att Poisson räcker. Ingen överdispersion.
- **"Varför log(Omsättning)?"** — Högersnedfördelad. Log gör tolkningen naturlig: "per fördubbling" istället för "per krona".
- **"Är det kausalitet?"** — Nej. Associationer i observationsdata. Vi har inte bevisat att VVS *orsakar* skador.
- **"Varför inte fler variabler?"** — Försäkringsbelopp korrelerar 0,57 med Omsättning (multikollinearitet). Självrisk har svagast gradient.
- **"Hur säker är portföljprognosen?"** — 95% KI: [5 503, 5 659]. Relativ osäkerhet 2,8%. Observerat 5 520 ligger i intervallet.
- **"Var är modellen mest osäker?"** — Ovanliga kombinationer (VVS + Småstad, Takarbeten + Landsbyggd) och extrema omsättningar.
- **"Varför inte interaktioner i GLM?"** — Testades implicit via XGBoost (djup >1). Ingen förbättring → additivitet håller.
- **"Kan modellen användas direkt för prissättning?"** — Rate ratios kan översättas till multiplikatorer, men full premie kräver kostnadsmodell + riskpåslag + driftskostnader.
