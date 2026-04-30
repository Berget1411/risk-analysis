# Risk Analysis

Project repository for the KTH ME1316 analysis of `Entreprenadförsäkring`, focused on claim-frequency modeling and pricing support.

## Objective

The project follows `.docs/PLAN.md` and is organized around three linked tasks:

1. descriptive analysis of the insurance portfolio
2. predictive comparison between Poisson-GLM and XGBoost
3. prescriptive recommendations for pricing, segmentation, and data collection

The final modeling goal is to predict the number of claims in the 2025 test portfolio without using that test set for iterative model selection.

## Data

- `data/Entreprenadförsäkring training.csv`: development data for 2021-2024
- `data/Entreprenadförsäkring test.csv`: final 2025 holdout

## Project Structure

- `data/`: raw training and test files
- `info/`: assignment background, report template, and course material
- `.docs/PLAN.md`: project plan and recommended workflow
- `src/`: isolated Python environment managed with `uv`
- `src/analysis/descriptive-analysis/`: descriptive notebooks
- `src/analysis/predictive/`: predictive modelling notebooks and model artifacts
- `.docs/REPORT.md/`: report draft folder; analysis is available, but the final report text is still incomplete

The descriptive analysis track follows this notebook sequence:

1. `A1-datakontroll.ipynb`
2. `A2-grundlaggande-beskrivning.ipynb`
3. `A3-segmenterad-beskrivning.ipynb`
4. `A4-samvariation.ipynb`
5. `A5-figurer-och-sammanfattning.ipynb`

The predictive track follows this notebook sequence:

1. `B1-grundspecifikation-arseffekt.ipynb`
2. `B2-modellkontroll-tolkning.ipynb`
3. `C-xgboost.ipynb`
4. `D1-modelljamforelse.ipynb`
5. `E-osakerhet.ipynb`

Key predictive artifacts:

- `src/analysis/predictive/artifacts/C-best-config.json`
- `src/analysis/predictive/artifacts/C-candidates.csv`

## Current Analysis Status

The analysis track A-F is complete and ready to be synthesized into the report:

- Poisson-GLM M2 is the recommended main model for pricing because it is interpretable and performs essentially on par with XGBoost.
- XGBoost `shallow-fast` is the locked challenger configuration (`max_depth=3`, `learning_rate=0.10`, `num_boost_round=232`).
- XGBoost is marginally better on Poisson deviance, but the improvement is too small to justify replacing GLM M2 as the main model.
- 2025 GLM portfolio prediction is about 5,581 claims versus 5,520 observed claims, with a 95% interval of about 5,503-5,659 claims.
- The remaining work is report writing in `.docs/REPORT.md/`, not new model development.

## Analysis Workflow

The intended order of work is:

1. validate data quality and produce descriptive figures
2. build a Poisson-GLM with `Duration` handled as exposure
3. train an XGBoost challenger on the same information set
4. compare models on time-ordered validation
5. evaluate once on the 2025 holdout
6. summarize uncertainty and business recommendations

## Environment

The Python environment lives in `src/` and is managed with `uv`.

```bash
cd src
uv sync
uv run python
```

Installed libraries include `numpy`, `pandas`, `matplotlib`, `seaborn`, `statsmodels`, `scikit-learn`, and `xgboost`.
