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
- `src/analysis/preditice`: current placeholder for predictive work

The descriptive analysis track currently follows this notebook sequence:

1. `A1-datakontroll.ipynb`
2. `A2-grundlaggande-beskrivning.ipynb`
3. `A3-segmenterad-beskrivning.ipynb`
4. `A4-samvariation.ipynb`
5. `A5-figurer-och-sammanfattning.ipynb`

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