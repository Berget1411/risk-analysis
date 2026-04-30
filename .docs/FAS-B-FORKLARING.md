# Fas B — Poisson-GLM, förklarat

## Varför Poisson-GLM?

Vi räknar antal skador. Poisson-fördelningen är gjord för att modellera "hur många gånger något händer".

**Offset = exponeringstid.** En försäkring aktiv i 6 månader ska inte jämföras rakt av med en aktiv i 12 månader. `offset(log(Duration))` justerar för detta automatiskt — modellen lär sig *frekvens* (skador per år), inte bara antal.

**Tolkbar.** Varje koefficient säger "den här gruppen har X% högre/lägre skadefrekvens". Försäkringsfolk kan agera på det direkt.

---

## B.1 Grundspecifikation

```
AntalSkador ~ C(Verksamhet) + C(GeografisktOmrade) + log(Omsattning) + offset(log(Duration))
```

Översatt: "Förklara antal skador med hjälp av vilken bransch kunden tillhör, var kunden finns, och hur stor kunden är — justerat för hur länge försäkringen varit aktiv."

`C(...)` = kategorisk variabel (grupper, inte siffror). Modellen skapar en koefficient per kategori.

---

## B.2 Variabelval

**Problem:** Omsättning, Försäkringsbelopp och Självrisk mäter delvis samma sak (företagsstorlek). Stoppar man in alla → modellen blir förvirrad, koefficienter vinglar.

**Strategi:**

1. Börja med bara bransch + geografi (basmodell)
2. Lägg till EN ekonomisk variabel i taget
3. Jämför med AIC/BIC (lägre = bättre modell, straffar onödig komplexitet)
4. Kolla VIF (Variance Inflation Factor) — om >5–10, för mycket överlapp mellan variabler

Inte bara "vilken siffra vinner" utan "vilken modell går att förklara för en kund?"

### AIC/BIC

Mått på modellkvalitet som balanserar fit mot komplexitet.

- AIC = -2·log-likelihood + 2·k
- BIC = -2·log-likelihood + k·log(n)

Där k = antal parametrar, n = antal observationer. Lägre = bättre. BIC straffar komplexitet hårdare vid stort n. Skillnad >10 = stark evidens, <2 = likvärdiga.

---

## B.3 Tidsvariation

Skadebeteende kan ändras mellan år. Testa:

- Modell **utan** `Ar` → antar att alla år är likadana
- Modell **med** `C(Ar)` → varje år får egen nivå

Inte bara kolla om det ser bättre ut på träningsdata. Testa om årseffekten faktiskt förbättrar prediktion på 2024 (valideringsåret). Annars = överanpassning.

---

## B.4 Modellkontroll

**Överdispersion:** Poisson antar att varians = medelvärde. Ofta i verkligheten: varians > medelvärde. Kollas med dispersionstest. Om stor avvikelse → standardfel blir för små → falska signifikanser.

**Residualplottar:** Visualisera "var har modellen fel?" Deviance-residualer fungerar bäst för count-data.

**Stabilitet:** Är koefficienterna rimliga? Ändras de vilt om man tar bort några observationer?

Om Poisson funkar dåligt → testa negativ binomial (hanterar överdispersion). Men Poisson = huvudspår per uppgiftens krav.

---

## B.5 Tolkning

**Incidenskvot (rate ratio):** `exp(koefficient)`. Om koefficient = 0.3 → `exp(0.3) = 1.35` → 35% högre skadefrekvens jämfört med referensgruppen.

**Referenskategori:** En grupp (t.ex. Verksamhet="Bygg") blir bas. Alla andra jämförs mot den.

**Affärstolkning:** Inte "koefficienten är 0.3 med p<0.05". Utan: *"Anläggningsföretag har 35% högre skadefrekvens än byggföretag, justerat för storlek och geografi. Det motiverar högre premie."*

---

## Temporal validering — varför hålla undan 2024?

All träningsdata: 2021–2024. Testdata: 2025 (låst, rör ej).

Om vi fittar på ALL träningsdata och utvärderar på 2025 har vi inget sätt att veta om modellen generaliserar innan vi förbrukar testdatan. En chans, ingen ångerrätt.

### Uppdelning

| Data       | Roll                        |
|------------|-----------------------------|
| 2021–2023  | Fitta modell                |
| 2024       | Validera (välj modell)      |
| 2025       | Slutgiltig utvärdering      |

### Varför tidssplit, inte slumpmässig?

Försäkringsdata har tidsstruktur. Skademönster kan skifta mellan år (inflation, lagstiftning, pandemier). Slumpmässig split → modellen "ser" framtida mönster under träning → överskattad prestanda. Temporal split simulerar verkligheten: fitta på historik, prediktera framåt.

### Varför 2024 specifikt?

Senaste tillgängliga året → närmast testperioden. Om modellen funkar på 2024 finns rimlig evidens att den funkar på 2025.

### Vad validering ger

- **Variabelval:** Vilken storleksvariabel ger bäst prediktion framåt?
- **Årseffekt:** Hjälper `C(Ar)` eller bara överfittar?
- **Modellval:** Poisson vs negativ binomial vs XGBoost — vilken generaliserar?
- **Skydd mot överanpassning:** AIC/BIC mäter in-sample. Validering mäter out-of-sample.

### Slutlig modell

När alla val är gjorda baserat på 2024-validering → refitt på 2021–2024 (hela träningsdata) → prediktera 2025. Ingen data slösas, men besluten togs utan att ha sett testdatan.
