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

- Follow `.docs/PLAN.md` for scope, sequencing, and decision rules.
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
- `src/analysis/preditice`: current placeholder for the predictive track. Respect the existing name and structure unless the user explicitly asks to rename it.

## Expected Workflow

Work in the order defined by `.docs/PLAN.md`:

1. Phase A: data control and descriptive analysis
2. Phase B: Poisson-GLM as the main model
3. Phase C: XGBoost as challenger
4. Phase D: model comparison
5. Phase E: uncertainty on portfolio and row level
6. Phase F: prescriptive recommendations for pricing and segmentation

## Analysis Guardrails

- Model claim frequency, not claim severity.
- Treat `Duration` as exposure. In GLM work, use it as an offset, not as a normal explanatory feature.
- Keep interpretations associative, not causal.
- Handle correlation among `Omsattning`, `Forsakringsbelopp`, and `Sjalvrisk` explicitly.
- Preserve time order in validation. The default split is train on 2021-2023, validate on 2024, evaluate once on 2025.
- Prefer simple, defensible modeling decisions over unnecessary complexity.

## Notebook and File Conventions

- Keep descriptive work aligned with the existing `A1` to `A5` notebook sequence.
- If predictive notebooks or scripts are added, mirror the plan structure and use clear phase-based names.
- Keep outputs reproducible and avoid hard-coded local paths.
- Document any assumption that changes the interpretation of the plan, data, or evaluation logic.
