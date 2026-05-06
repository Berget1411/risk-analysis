# AGENTS.md

## Project Focus

This repository is for the ME1316 insurance pricing project on `Entreprenadförsäkring`.

The working objective is to:

1. describe the portfolio and claim frequency patterns
2. build an interpretable Poisson-GLM as the main model
3. compare it against an XGBoost challenger
4. predict claim counts for the 2025 test portfolio
5. translate results into pricing and segmentation recommendations

## Source of Truth

- Treat `data/Entreprenadförsäkring training.csv` as the development dataset.
- Treat `data/Entreprenadförsäkring test.csv` as the final 2025 holdout.
- Do not use 2025 test data for feature selection, tuning, or iterative model choice.

## Repository Structure

- `data/`: training and test CSV files.
- `info/`: course background, report template, and supporting material.
- `src/`: standalone `uv` Python environment for analysis work.
- `src/analysis/descriptive-analysis/`: current descriptive notebooks:
  - `A1-datakontroll.ipynb`
  - `A2-grundlaggande-beskrivning.ipynb`
  - `A3-segmenterad-beskrivning.ipynb`
  - `A4-samvariation.ipynb`
  - `A5-figurer-och-sammanfattning.ipynb`
- `src/analysis/predictive/`: current predictive track:
  - `B1-grundspecifikation-arseffekt.ipynb`
  - `B2-modellkontroll-tolkning.ipynb`
  - `C-xgboost.ipynb`
  - `D1-modelljamforelse.ipynb`
  - `E-osakerhet.ipynb`
  - `artifacts/C-best-config.json`
  - `artifacts/C-candidates.csv`

## Analysis Guardrails

- Model claim frequency, not claim severity.
- Treat `Duration` as exposure. In GLM work, use it as an offset, not as a normal explanatory feature.
- Use `log(Omsattning)` as the locked size feature in predictive models, matching B1/B2/C/D/E.
- Keep interpretations associative, not causal.
- Handle correlation among `Omsattning`, `Forsakringsbelopp`, and `Sjalvrisk` explicitly.
- Preserve time order in validation. The default split is train on 2021-2023, validate on 2024, evaluate once on 2025.
- Prefer simple, defensible modeling decisions over unnecessary complexity.
- Overdispersion for GLM M2 is checked with Pearson χ²/frihetsgrader.

## Current Analysis Status

- Phase A-F analysis artifacts are complete.
- GLM M2 is the recommended main model because XGBoost only improves Poisson deviance marginally while reducing interpretability.
- XGBoost `shallow-fast` is the locked challenger (`max_depth=3`, `learning_rate=0.10`, `num_boost_round=232`).
- 2025 test data has already been used for final evaluation in D1/E. Do not use it for further tuning or model-selection iteration.


## Notebook and File Conventions

- Keep descriptive work aligned with the existing `A1` to `A5` notebook sequence.
- Keep predictive work aligned with the existing `B1`, `B2`, `C`, `D1`, `E` sequence.
- If new predictive notebooks or scripts are added, mirror the plan structure and use clear phase-based names.
- Keep outputs reproducible and avoid hard-coded local paths.
- Document any assumption that changes the interpretation of the plan, data, or evaluation logic.
