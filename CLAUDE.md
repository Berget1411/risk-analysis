# CLAUDE.md

## Project Context

This repository supports the ME1316 project on pricing and claim-frequency analysis for `Entreprenadförsäkring`.

The target outcome is a defensible end-to-end analysis that:

1. describes the portfolio and its risk patterns
2. builds a Poisson-GLM as the primary interpretable model
3. benchmarks it against XGBoost
4. predicts the 2025 test portfolio
5. turns findings into business-facing recommendations

## Primary Reference

- Use `.docs/PLAN.md` as the main planning document.
- Keep all work consistent with the report logic in the course material under `info/`.
- Use `data/Entreprenadförsäkring training.csv` for training and internal validation.
- Reserve `data/Entreprenadförsäkring test.csv` for final evaluation only.

## Current Project Layout

- `src/` contains the Python environment managed with `uv`.
- `src/analysis/descriptive-analysis/` is the implemented descriptive track:
  - `A1-datakontroll.ipynb`
  - `A2-grundlaggande-beskrivning.ipynb`
  - `A3-segmenterad-beskrivning.ipynb`
  - `A4-samvariation.ipynb`
  - `A5-figurer-och-sammanfattning.ipynb`
- `src/analysis/predictive/` is the predictive modelling track:
  - `B1-grundspecifikation-arseffekt.ipynb` — modellval M0–M3, AIC + valideringsdeviance, M2 vald som slutmodell
  - `B2-modellkontroll-tolkning.ipynb` — överdispersion, rate ratios med KI, affärsmässig tolkning

## Working Rules

- Follow the phase order in `.docs/PLAN.md`.
- Keep the distinction clear between descriptive, predictive, and prescriptive analysis.
- Treat `Duration` as exposure in count models.
- Preserve temporal validation logic. Default workflow: train on 2021-2023, validate on 2024, evaluate on 2025.
- Discuss model effects as associations, not causal effects.
- Make model comparison decision-ready: accuracy matters, but interpretability and business usefulness matter too.

## Practical Expectations

- Build on the existing notebook structure instead of creating parallel ad hoc workflows.
- Use Swedish variable names exactly as they appear in the data.
- Keep analysis outputs reproducible, concise, and easy to map into the final report.
- Flag any mismatch between `.docs/PLAN.md`, the data files, and the repository structure before changing the workflow.
