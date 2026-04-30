Bygg Fas B — Poisson-GLM. Två notebooks: B1 (specifikation), B2 (kontroll + tolkning).

### Kontext från deskriptiv analys (redan beslutat)

- Omsättning vald som storleksvariabel (A4: starkast samband, 5.6× spridning)
- Verksamhet + Geografi additivt (A3: VVS × Storstad stärker varandra)
- Självrisk + Försäkringsbelopp exkluderade (A4)

### B1 — Grundspecifikation och årseffekt

Modellsekvens:
- M0: Intercept only (null-baseline) "vet från deskriptiva att variabler kommer hjälpa men vill ha som referens"
- M1: C(Verksamhet) + C(GeografisktOmrade)  
- M2: M1 + log(Omsättning) ← primär slutmodell
- M3: M2 + C(Ar) ← årseffekt, enbart in-sample (kan inte prediktera 2024/2025 — osedd kategorinivå)

Jämför M0–M2 med AIC + valideringsdeviance (2024).
M3 jämförs enbart in-sample (AIC + årskoefficienter). 

Visa koefficienter + rate ratios för M2.

### B2 — Modellkontroll och tolkning

- Överdispersion: Pearson χ²/frihetsgrader. Nämn negativ binomial om problem, Poisson förblir huvudspår.
- Inga residualplottar (98% nollor → oinformativa, motivera varför i text).
- Rate ratios med KI i klartext
- Referenskategorier: Byggföretag, Landsbyggd
- Affärsmässig innebörd för prissättning/segmentering

### Regler
- Kursnivå likt innehåll i /info/... Enkla motiveringar. Inga formella test-batterier (ingen VIF, inga LR-test).
- Variabelvalet gjort i A4. B1 bekräftar med AIC, inte upprepar.
- Träna 2021–2023, validera 2024, test 2025 reserverad.
- Duration offset, log-länk, svenska variabelnamn.
