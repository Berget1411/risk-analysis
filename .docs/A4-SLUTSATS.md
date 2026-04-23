# A4 Samvariation — Slutsats

## Korrelationsanalys (log-skala)

| Variabelpar                      | Pearson r |
|----------------------------------|-----------|
| Omsättning ↔ Försäkringsbelopp   | 0.57      |
| Omsättning ↔ Självrisk           | 0.45      |
| Försäkringsbelopp ↔ Självrisk    | 0.26      |

## Decilanalys — skadefrekvens per storleksgrupp

- **Omsättning:** Starkast monoton trend (0.007 → 0.040). Tydlig gradient över alla 10 deciler.
- **Försäkringsbelopp:** Monoton men svagare spridning (0.011 → 0.034).
- **Självrisk:** Bara 4 deciler (få unika värden), svag trend (0.021 → 0.027).

## Beslut inför B.1 Grundspecifikation

### Primär storleksvariabel: `log1p(Omsattning)`

Motivering:
- Starkast univariat samband med skadefrekvens
- Bäst spridning och flest distinkta deciler
- Rimlig affärstolkning: omsättning speglar projektvolym och exponering

### Multikollinearitet

r = 0.57 mellan Omsättning och Försäkringsbelopp = måttlig kollinearitet. Att inkludera båda ger instabila koefficienter utan tydligt prediktivt mervärde. Välj en.

### Självrisk exkluderas

- Svagt samband med skadefrekvens
- Få unika värden (4 deciler)
- Mäter delvis riskbenägenhet snarare än företagsstorlek
- Kan utvärderas separat i känslighetsanalys

### Känslighetscheck

Kör alternativ modell med `log1p(Forsakringsbelopp)` istället för `log1p(Omsattning)`. Jämför via AIC/BIC. Skillnad >10 = stark evidens, <2 = likvärdiga.

## Föreslagen grundmodell (B.1)

```
AntalSkador ~ C(Verksamhet) + C(GeografisktOmrade) + log1p(Omsattning) + offset(log(Duration))
```

Eventuellt med `C(Ar)` för tidstrend — utvärderas i B.1.
