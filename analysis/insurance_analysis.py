from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import PoissonRegressor
from sklearn.metrics import mean_absolute_error, mean_poisson_deviance, mean_squared_error
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = Path(__file__).resolve().parent / "output"
BOOTSTRAP_SEED = 42
BOOTSTRAP_ITERATIONS = 20
YEAR_BASE = 2021.0


def locate_dataset(pattern: str) -> Path:
    matches = sorted(ROOT.glob(pattern))
    if len(matches) != 1:
        raise FileNotFoundError(f"Expected exactly one match for {pattern}, found {len(matches)}")
    return matches[0]


def load_datasets() -> tuple[pd.DataFrame, pd.DataFrame]:
    train_path = locate_dataset("*training.csv")
    test_path = locate_dataset("*test.csv")
    train = pd.read_csv(train_path)
    test = pd.read_csv(test_path)
    train["observation_id"] = np.arange(1, len(train) + 1)
    test["observation_id"] = np.arange(1, len(test) + 1)
    return train, test


def add_features(df: pd.DataFrame, include_year: bool) -> pd.DataFrame:
    enriched = df.copy()
    duration = np.clip(enriched["Duration"].to_numpy(), 1e-9, None)
    enriched["claim_rate"] = enriched["AntalSkador"] / duration
    enriched["log_Omsattning"] = np.log1p(enriched["Omsattning"])
    enriched["log_Forsakringsbelopp"] = np.log1p(enriched["Forsakringsbelopp"])
    enriched["log_Sjalvrisk"] = np.log1p(enriched["Sjalvrisk"])
    if include_year:
        enriched["ArNum"] = enriched["Ar"] - YEAR_BASE
    return enriched


def feature_columns(include_year: bool) -> tuple[list[str], list[str]]:
    numeric = ["log_Omsattning", "log_Forsakringsbelopp", "log_Sjalvrisk"]
    if include_year:
        numeric.append("ArNum")
    categorical = ["Verksamhet", "GeografisktOmrade"]
    return numeric, categorical


def score_predictions(actual: pd.Series, predicted: np.ndarray) -> dict[str, float]:
    clipped = np.clip(predicted, 1e-12, None)
    actual_total = float(actual.sum())
    predicted_total = float(clipped.sum())
    return {
        "mae": float(mean_absolute_error(actual, clipped)),
        "rmse": float(np.sqrt(mean_squared_error(actual, clipped))),
        "poisson_deviance": float(mean_poisson_deviance(actual, clipped)),
        "predicted_total_claims": predicted_total,
        "actual_total_claims": actual_total,
        "total_error_pct": float((predicted_total / actual_total - 1.0) * 100.0),
    }


def fit_poisson_model(train: pd.DataFrame, include_year: bool) -> Pipeline:
    numeric, categorical = feature_columns(include_year)
    transformer = ColumnTransformer(
        [
            ("num", SimpleImputer(strategy="median"), numeric),
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", drop="first"),
                categorical,
            ),
        ]
    )
    model = Pipeline(
        [
            ("transformer", transformer),
            ("poisson", PoissonRegressor(alpha=0.0, max_iter=500)),
        ]
    )
    model.fit(
        train[numeric + categorical],
        train["claim_rate"],
        poisson__sample_weight=train["Duration"],
    )
    return model


def predict_poisson_claims(model: Pipeline, frame: pd.DataFrame, include_year: bool) -> np.ndarray:
    numeric, categorical = feature_columns(include_year)
    predicted_rate = np.clip(model.predict(frame[numeric + categorical]), 1e-12, None)
    return predicted_rate * frame["Duration"].to_numpy()


def fit_hgb_model(train: pd.DataFrame, include_year: bool) -> tuple[HistGradientBoostingRegressor, OrdinalEncoder, list[str]]:
    numeric, categorical = feature_columns(include_year)
    features = numeric + categorical
    encoder = OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1)
    train_matrix = train[features].copy()
    train_matrix[categorical] = encoder.fit_transform(train_matrix[categorical])
    categorical_mask = [False] * len(numeric) + [True] * len(categorical)
    model = HistGradientBoostingRegressor(
        loss="poisson",
        learning_rate=0.05,
        max_depth=4,
        max_iter=120,
        min_samples_leaf=1000,
        l2_regularization=0.1,
        categorical_features=categorical_mask,
        random_state=0,
    )
    model.fit(train_matrix, train["claim_rate"], sample_weight=train["Duration"])
    return model, encoder, features


def predict_hgb_claims(
    model: HistGradientBoostingRegressor,
    encoder: OrdinalEncoder,
    features: list[str],
    frame: pd.DataFrame,
) -> np.ndarray:
    encoded = frame[features].copy()
    categorical = ["Verksamhet", "GeografisktOmrade"]
    encoded[categorical] = encoder.transform(encoded[categorical])
    predicted_rate = np.clip(model.predict(encoded), 1e-12, None)
    return predicted_rate * frame["Duration"].to_numpy()


def evaluate_models(train: pd.DataFrame, validation: pd.DataFrame, test: pd.DataFrame) -> pd.DataFrame:
    model_rows: list[dict[str, float | str]] = []

    base_rate = train["AntalSkador"].sum() / train["Duration"].sum()
    for split_name, split_frame in [("validation_2024", validation), ("test_2025", test)]:
        predicted = np.full(len(split_frame), base_rate) * split_frame["Duration"].to_numpy()
        metrics = score_predictions(split_frame["AntalSkador"], predicted)
        model_rows.append({"model": "global_average", "split": split_name, **metrics})

    segment_rates = (
        train.groupby(["Verksamhet", "GeografisktOmrade"])
        .agg(total_claims=("AntalSkador", "sum"), exposure=("Duration", "sum"))
        .reset_index()
    )
    segment_rates["segment_rate"] = segment_rates["total_claims"] / segment_rates["exposure"]
    segment_lookup = {
        (row["Verksamhet"], row["GeografisktOmrade"]): row["segment_rate"]
        for _, row in segment_rates.iterrows()
    }
    for split_name, split_frame in [("validation_2024", validation), ("test_2025", test)]:
        predicted_rate = np.array(
            [
                segment_lookup.get((verksamhet, omrade), base_rate)
                for verksamhet, omrade in zip(
                    split_frame["Verksamhet"], split_frame["GeografisktOmrade"]
                )
            ]
        )
        predicted = predicted_rate * split_frame["Duration"].to_numpy()
        metrics = score_predictions(split_frame["AntalSkador"], predicted)
        model_rows.append({"model": "segment_average", "split": split_name, **metrics})

    for include_year, model_name in [
        (False, "poisson_no_year"),
        (True, "poisson_with_year"),
    ]:
        train_enriched = add_features(train, include_year=include_year)
        validation_enriched = add_features(validation, include_year=include_year)
        test_enriched = add_features(test, include_year=include_year)
        poisson_model = fit_poisson_model(train_enriched, include_year=include_year)
        for split_name, split_frame in [
            ("validation_2024", validation_enriched),
            ("test_2025", test_enriched),
        ]:
            predicted = predict_poisson_claims(poisson_model, split_frame, include_year=include_year)
            metrics = score_predictions(split_frame["AntalSkador"], predicted)
            model_rows.append({"model": model_name, "split": split_name, **metrics})

    train_enriched = add_features(train, include_year=False)
    validation_enriched = add_features(validation, include_year=False)
    test_enriched = add_features(test, include_year=False)
    hgb_model, hgb_encoder, hgb_features = fit_hgb_model(train_enriched, include_year=False)
    for split_name, split_frame in [
        ("validation_2024", validation_enriched),
        ("test_2025", test_enriched),
    ]:
        predicted = predict_hgb_claims(hgb_model, hgb_encoder, hgb_features, split_frame)
        metrics = score_predictions(split_frame["AntalSkador"], predicted)
        model_rows.append({"model": "hist_gradient_boosting", "split": split_name, **metrics})

    return pd.DataFrame(model_rows)


def bootstrap_uncertainty(
    train: pd.DataFrame,
    test: pd.DataFrame,
    iterations: int = BOOTSTRAP_ITERATIONS,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    train_enriched = add_features(train, include_year=False)
    test_enriched = add_features(test, include_year=False)
    numeric, categorical = feature_columns(include_year=False)
    features = numeric + categorical
    rng = np.random.default_rng(BOOTSTRAP_SEED)

    point_model = fit_poisson_model(train_enriched, include_year=False)
    point_rate = np.clip(point_model.predict(test_enriched[features]), 1e-12, None)

    bootstrap_rates = []
    for _ in range(iterations):
        sample_index = rng.integers(0, len(train_enriched), size=len(train_enriched))
        bootstrap_train = train_enriched.iloc[sample_index]
        bootstrap_model = fit_poisson_model(bootstrap_train, include_year=False)
        predicted_rate = np.clip(
            bootstrap_model.predict(test_enriched[features]),
            1e-12,
            None,
        )
        bootstrap_rates.append(predicted_rate)

    stacked_rates = np.vstack(bootstrap_rates)
    lower_rate = np.quantile(stacked_rates, 0.025, axis=0)
    upper_rate = np.quantile(stacked_rates, 0.975, axis=0)
    predicted_claims = point_rate * test_enriched["Duration"].to_numpy()

    predictions = test[[
        "observation_id",
        "Omsattning",
        "Verksamhet",
        "GeografisktOmrade",
        "Ar",
        "Forsakringsbelopp",
        "Sjalvrisk",
        "Duration",
        "AntalSkador",
    ]].copy()
    predictions["predicted_claim_rate"] = point_rate
    predictions["predicted_claim_count"] = predicted_claims
    predictions["rate_ci_low_95"] = lower_rate
    predictions["rate_ci_high_95"] = upper_rate
    predictions["rate_ci_width_95"] = upper_rate - lower_rate
    predictions["relative_ci_width_95"] = predictions["rate_ci_width_95"] / np.clip(
        predictions["predicted_claim_rate"], 1e-12, None
    )

    totals = stacked_rates * test_enriched["Duration"].to_numpy()
    portfolio_summary = pd.DataFrame(
        [
            {
                "final_model": "poisson_no_year",
                "predicted_total_claims": float(predicted_claims.sum()),
                "actual_total_claims": float(test_enriched["AntalSkador"].sum()),
                "bootstrap_mean_total_claims": float(totals.sum(axis=1).mean()),
                "bootstrap_ci_low_95_total_claims": float(np.quantile(totals.sum(axis=1), 0.025)),
                "bootstrap_ci_high_95_total_claims": float(np.quantile(totals.sum(axis=1), 0.975)),
            }
        ]
    )

    return predictions, portfolio_summary


def coefficient_table(train: pd.DataFrame) -> pd.DataFrame:
    train_enriched = add_features(train, include_year=False)
    poisson_model = fit_poisson_model(train_enriched, include_year=False)
    transformer = poisson_model.named_steps["transformer"]
    coefficients = poisson_model.named_steps["poisson"].coef_
    features = transformer.get_feature_names_out()
    table = pd.DataFrame({"feature": features, "coefficient": coefficients})
    table["rate_multiplier"] = np.exp(table["coefficient"])
    table["percent_effect"] = (table["rate_multiplier"] - 1.0) * 100.0
    return table.sort_values("coefficient", ascending=False).reset_index(drop=True)


def descriptive_outputs(train: pd.DataFrame, test: pd.DataFrame) -> dict[str, pd.DataFrame]:
    train_exposure = train["Duration"].sum()
    test_exposure = test["Duration"].sum()
    summary = pd.DataFrame(
        [
            {"metric": "train_rows", "value": len(train)},
            {"metric": "test_rows", "value": len(test)},
            {"metric": "train_total_claims", "value": train["AntalSkador"].sum()},
            {"metric": "test_total_claims", "value": test["AntalSkador"].sum()},
            {"metric": "train_total_exposure", "value": train_exposure},
            {"metric": "test_total_exposure", "value": test_exposure},
            {
                "metric": "train_claim_frequency_per_exposure_year",
                "value": train["AntalSkador"].sum() / train_exposure,
            },
            {
                "metric": "test_claim_frequency_per_exposure_year",
                "value": test["AntalSkador"].sum() / test_exposure,
            },
            {
                "metric": "train_zero_claim_share",
                "value": (train["AntalSkador"] == 0).mean(),
            },
            {
                "metric": "test_zero_claim_share",
                "value": (test["AntalSkador"] == 0).mean(),
            },
            {
                "metric": "claim_count_dispersion",
                "value": train["AntalSkador"].var() / train["AntalSkador"].mean(),
            },
        ]
    )
    correlation = train[["Omsattning", "Forsakringsbelopp", "Sjalvrisk"]].corr().reset_index()
    correlation = correlation.rename(columns={"index": "variable"})

    by_year = (
        train.groupby("Ar")
        .agg(total_claims=("AntalSkador", "sum"), exposure=("Duration", "sum"))
        .reset_index()
    )
    by_year["claim_frequency"] = by_year["total_claims"] / by_year["exposure"]

    by_verksamhet = (
        train.groupby("Verksamhet")
        .agg(total_claims=("AntalSkador", "sum"), exposure=("Duration", "sum"))
        .reset_index()
    )
    by_verksamhet["claim_frequency"] = by_verksamhet["total_claims"] / by_verksamhet["exposure"]
    by_verksamhet = by_verksamhet.sort_values("claim_frequency", ascending=False)

    by_geo = (
        train.groupby("GeografisktOmrade")
        .agg(total_claims=("AntalSkador", "sum"), exposure=("Duration", "sum"))
        .reset_index()
    )
    by_geo["claim_frequency"] = by_geo["total_claims"] / by_geo["exposure"]
    by_geo = by_geo.sort_values("claim_frequency", ascending=False)

    return {
        "descriptive_summary": summary,
        "correlation_matrix": correlation,
        "claim_frequency_by_year": by_year,
        "claim_frequency_by_verksamhet": by_verksamhet,
        "claim_frequency_by_geography": by_geo,
    }


def save_outputs(outputs: dict[str, pd.DataFrame]) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for name, frame in outputs.items():
        frame.to_csv(OUTPUT_DIR / f"{name}.csv", index=False)


def main() -> None:
    train, test = load_datasets()
    validation = train.loc[train["Ar"] == 2024].copy()
    train_for_validation = train.loc[train["Ar"] <= 2023].copy()

    descriptive = descriptive_outputs(train, test)
    model_comparison = evaluate_models(train_for_validation, validation, test)
    final_coefficients = coefficient_table(train)
    predictions, portfolio_summary = bootstrap_uncertainty(train, test)

    most_uncertain = predictions.sort_values("rate_ci_width_95", ascending=False).head(10)
    least_uncertain = predictions.sort_values("rate_ci_width_95", ascending=True).head(10)
    most_relative_uncertain = (
        predictions.loc[predictions["predicted_claim_rate"] > 0.01]
        .sort_values("relative_ci_width_95", ascending=False)
        .head(10)
    )

    outputs = {
        **descriptive,
        "model_comparison": model_comparison,
        "poisson_coefficients": final_coefficients,
        "test_predictions_poisson": predictions,
        "test_portfolio_summary": portfolio_summary,
        "most_uncertain_rows": most_uncertain,
        "least_uncertain_rows": least_uncertain,
        "most_relative_uncertain_rows": most_relative_uncertain,
    }
    save_outputs(outputs)

    print("Saved analysis outputs to", OUTPUT_DIR)
    print("\nModel comparison")
    print(model_comparison.to_string(index=False))
    print("\nPortfolio summary")
    print(portfolio_summary.to_string(index=False))


if __name__ == "__main__":
    main()
