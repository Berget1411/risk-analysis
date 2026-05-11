# src

Standalone `uv` Python environment for the risk analysis work in this repository.

## Analysis Context

The notebooks in `analysis/` support the ME1316 report `Skadefrekvensanalys - Entreprenadförsäkring`.

- `analysis/descriptive-analysis/`: A1-A5 portfolio, segment, and correlation analysis.
- `analysis/predictive/`: B1-E Poisson-GLM, XGBoost, model comparison, and uncertainty analysis.
- Main model: GLM M2 with `Verksamhet`, `GeografisktOmrade`, `log(Omsattning)`, and `offset(log(Duration))`.
- Challenger: XGBoost `shallow-fast` with the same information set (`max_depth=3`, `learning_rate=0.10`, `num_boost_round=232`).
- Validation order: train on 2021-2023, validate on 2024, evaluate once on the 2025 holdout.
- Do not use the 2025 holdout for further tuning or model selection.

Included libraries:

- `numpy`
- `pandas`
- `matplotlib`
- `seaborn`
- `statsmodels`
- `scikit-learn`
- `xgboost`

Typical commands:

```bash
cd src
uv sync
uv run python
```
