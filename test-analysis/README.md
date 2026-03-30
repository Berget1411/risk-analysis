# Entreprenadforsakring analysis

This folder contains a reproducible analysis for project 3 in ME1316.

Files:

- `analysis/insurance_analysis.py`: descriptive analysis, model comparison, uncertainty estimation, and test portfolio prediction.
- `analysis/output/`: generated CSV outputs used in the report draft.
- `analysis/report_draft.md`: report draft in Swedish built from the generated results.

Run locally:

```bash
python3 -m pip install pandas numpy scikit-learn
python3 analysis/insurance_analysis.py
```

The script writes CSV files to `analysis/output/`, including model metrics, descriptive summaries, coefficients, full test predictions, and rows with the largest/smallest uncertainty intervals.
