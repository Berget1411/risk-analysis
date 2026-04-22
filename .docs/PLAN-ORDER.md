# PLAN-ORDER.md

## Purpose

This file converts `.docs/PLAN.md` into a working order of execution.

Use it to answer three things fast:

- what must be done in sequence
- what can be done in parallel
- what blocks later work

## Non-Negotiable Rules

- Use `data/Entreprenadförsäkring training.csv` for development only.
- Use `data/Entreprenadförsäkring test.csv` only once for final 2025 evaluation.
- Preserve time order: train on 2021-2023, validate on 2024, evaluate on 2025.
- Model claim frequency, not severity.
- Treat `Duration` as exposure. In GLM, use it as an offset.

## Master Order

`A. Data control + descriptive` -> `B. Poisson-GLM` -> `C. XGBoost` -> `D. Model comparison` -> `E. Uncertainty` -> `F. Recommendations` -> `Report finalization`

## Sequential Flow

### 1. Phase A: Data Control and Descriptive Analysis

Must finish first because every later phase depends on verified data, exposure handling, and a stable understanding of the variables.

Do in this order:

1. A1 `Datakontroll`
2. A2 `Grundlaggande beskrivning`
3. A3 `Segmenterad beskrivning`
4. A4 `Samvariation`
5. A5 `Figurer och sammanfattning`

Main outputs:

- validated data structure
- cleaned handling of `Duration`
- confirmed category levels
- descriptive tables and figures
- decision basis for economic-variable handling in modeling

Blocks:

- B if `Duration` is not validated
- B if missing/extreme values are unresolved
- B if correlation among `Omsattning`, `Forsakringsbelopp`, `Sjalvrisk` is not described

### 2. Phase B: Poisson-GLM Main Model

Starts only after Phase A is stable.

Do in this order:

1. define base GLM with `Verksamhet` + `GeografisktOmrade` + offset(`log(Duration)`)
2. test economic variables one at a time
3. check multicollinearity and interpretability
4. test year effect with and without `Ar`
5. run model diagnostics
6. lock final GLM specification

Main outputs:

- final interpretable Poisson-GLM
- documented variable choice
- decision on year effect
- diagnostics and interpretation-ready results

Blocks:

- C if the feature set for fair comparison is not defined
- D if final GLM is not locked
- E if final GLM predictions are not available

### 3. Phase C: XGBoost Challenger

Starts after the modeling inputs and validation logic are fixed in B.

Do in this order:

1. mirror the agreed feature set from GLM work
2. define consistent exposure handling for `Duration`
3. train on 2021-2023
4. validate on 2024
5. do limited tuning only
6. lock final challenger model

Main outputs:

- final XGBoost challenger
- validation metrics on 2024
- documented exposure handling

Blocks:

- D if the challenger is not locked
- unfair comparison risk if features or exposure treatment differ from GLM without clear reason

### 4. Phase D: Model Comparison

Starts only when both B and C are locked.

Do in this order:

1. define baselines
2. compare on validation year 2024
3. choose main model using predictive performance plus interpretability
4. run one final evaluation on 2025

Main outputs:

- baseline vs GLM vs XGBoost comparison
- model-choice decision
- final 2025 performance summary

Blocks:

- E if model choice is unclear
- F if there is no agreed main model

### 5. Phase E: Uncertainty

Starts after final model comparison. Use the chosen main model, and optionally compare uncertainty framing against the challenger if useful.

Do in this order:

1. estimate portfolio-level uncertainty for 2025
2. estimate row-level uncertainty
3. identify most and least uncertain rows or segments
4. explain what drives uncertainty

Main outputs:

- portfolio uncertainty interval
- row-level uncertainty ranking
- segment-level uncertainty interpretation

Blocks:

- F if uncertainty is not translated into decision meaning

### 6. Phase F: Recommendations

Starts after D and E.

Do in this order:

1. identify usable rating factors
2. identify high-risk segments
3. identify segments needing caution or manual review
4. recommend main-model / challenger setup
5. state limits and next data needs

Main outputs:

- pricing and segmentation recommendations
- business-facing interpretation
- limits for operational use

## What Can Run in Parallel

Only run parallel work when it does not break the dependency chain.

### Inside Phase A

- A2 and A3 can partly run in parallel after A1 is complete.
- A4 can begin once the numeric variables are validated in A1, even if all A2/A3 visuals are not finished.
- A5 should wait until A2-A4 are mostly done.

### Inside Phase B

- diagnostics code can be prepared while variable testing is running
- interpretation tables can be drafted once candidate models exist

But:

- final interpretation must wait until the GLM is locked
- year-effect decision must wait until core variable choice is stable

### Across Phases B and C

- some XGBoost pipeline setup can be prepared while GLM selection is nearing completion

But:

- final XGBoost training should wait until the fair comparison feature set is fixed
- do not tune XGBoost against a moving target

### Inside Phase D and E

- portfolio-level and row-level uncertainty work can run in parallel after final predictions exist
- report drafting for methods and descriptive sections can run while uncertainty is computed

## Hard Blockers

These stop downstream work.


| Blocker                                     | Stops                               |
| ------------------------------------------- | ----------------------------------- |
| unresolved data-quality issues              | B, C, D, E, F                       |
| unclear handling of `Duration`              | B, C, D, E                          |
| no decision on economic-variable strategy   | B finalization, C fairness, D       |
| no locked GLM                               | D, E, F                             |
| no locked XGBoost                           | D                                   |
| use of 2025 for tuning or feature selection | invalidates D, E, F                 |
| no agreed main model after comparison       | E interpretation, F recommendations |


## Recommended Working Pattern

### Track 1: Analysis Core

Owns:

- data validation
- GLM
- XGBoost
- model comparison

### Track 2: Reporting and Figures

Owns:

- descriptive visuals
- result tables
- report text for intro, data, method, and descriptive findings

### Safe Parallel Split

After A1 is done:

- one track finishes A2-A5
- one track starts B scaffolding

After GLM feature choice is nearly fixed:

- one track finalizes GLM diagnostics and interpretation
- one track prepares XGBoost pipeline and comparison templates

After model comparison is locked:

- one track computes uncertainty
- one track writes recommendations and report integration

## Minimum Gate Before Moving On

- Move from A -> B only when data quality and `Duration` handling are signed off.
- Move from B -> C only when the comparison feature set is clear enough to keep fairness.
- Move from C -> D only when both models are locked.
- Move from D -> E only when 2025 evaluation is done once.
- Move from E -> F only when uncertainty results are interpretable enough for decisions.

## Short Version

If time is limited, do this:

1. finish A completely
2. lock GLM
3. train one fair XGBoost challenger
4. compare on 2024, then evaluate once on 2025
5. quantify uncertainty
6. write pricing and segmentation recommendations