# AGENTS.md

## Project Focus

This repository is for the ME1316 insurance pricing project on `Entreprenadförsäkring`.

The working objective is to support the report `Skadefrekvensanalys - Entreprenadförsäkring` by answering:

> How well can claim counts in entreprenadförsäkring be predicted using customer, business, and insurance data?

The analysis objective is to:

1. describe the portfolio and claim frequency patterns
2. build an interpretable Poisson-GLM as the main model
3. compare it against an XGBoost challenger
4. predict claim counts for the 2025 test portfolio
5. translate results into pricing, segmentation, uncertainty, and data-collection recommendations

## Source of Truth

- Treat `data/Entreprenadförsäkring training.csv` as the development dataset.
- Treat `data/Entreprenadförsäkring test.csv` as the final 2025 holdout.
- Do not use 2025 test data for feature selection, tuning, or iterative model choice.
- Use the report's final model narrative unless explicitly changing the report: GLM M2 is the main model and XGBoost is the challenger.

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
- Do not tune further on 2025. The 2025 data has already been used for final evaluation in D1/E.
- XGBoost must use the same information set as GLM M2: `Verksamhet`, `GeografisktOmrade`, `log(Omsattning)`, and exposure through `log(Duration)`.
- `Forsakringsbelopp` and `Sjalvrisk` may be discussed as robustness checks, but they are not part of the recommended main model.
- In the report, M3 refers to the `M2 + Sjalvrisk` robustness model. In B1, the year-effect model is a separate in-sample check and should not be treated as a candidate final model.

## Current Analysis Status

- The A1-A5 and B1-E analysis notebooks are complete.
- GLM M2 is the recommended main model because XGBoost only improves Poisson deviance marginally while reducing interpretability.
- GLM M2 specification: `AntalSkador ~ C(Verksamhet) + C(GeografisktOmrade) + log(Omsattning) + offset(log(Duration))`.
- XGBoost `shallow-fast` is the locked challenger (`max_depth=3`, `learning_rate=0.10`, `num_boost_round=232`).
- Key 2025 results:
  - observed claims: 5,520
  - GLM M2 predicted claims: 5,580.6, portfolio error +1.10%
  - XGBoost predicted claims: 5,587.3, portfolio error +1.22%
  - GLM M2 Poisson deviance: 41,889.2
  - XGBoost Poisson deviance: 41,855.7
  - XGBoost deviance improvement: about 0.08%, too small to justify replacing GLM M2
  - GLM M2 total 95% interval: approximately 5,503-5,659 claims
- GLM M2 overdispersion ratio is about 0.986, supporting the Poisson model.
- 2025 test data has already been used for final evaluation in D1/E. Do not use it for further tuning or model-selection iteration.


## Notebook and File Conventions

- Keep descriptive work aligned with the existing `A1` to `A5` notebook sequence.
- Keep predictive work aligned with the existing `B1`, `B2`, `C`, `D1`, `E` sequence.
- If new predictive notebooks or scripts are added, mirror the plan structure and use clear phase-based names.
- Keep outputs reproducible and avoid hard-coded local paths.
- Document any assumption that changes the interpretation of the plan, data, or evaluation logic.
- If updating report numbers, prefer exact values from notebook outputs over rounded prose.
- Avoid renaming final conclusions unless the report is updated at the same time.
