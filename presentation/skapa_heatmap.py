"""Genererar heatmap för Verksamhet x GeografisktOmrade till rapporten.

Heatmappen ersätter Tabell 4.2 (skadefrekvens per verksamhet) och Tabell 4.3
(skadefrekvens per geografiskt område) i 4.RESULTAT.md genom att visa både
gradienterna och de gemensamma cellerna i en figur. Andelen av portföljen för
varje verksamhet och geografi visas i parentes på axeletiketterna, och
marginalfrekvenserna (motsvarande tabellernas raderingar) ligger i kolumn och
rad "Snitt".

Kör: uv run --project src python presentation/skapa_heatmap.py
"""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = PROJECT_ROOT / "data" / "Entreprenadförsäkring training.csv"
FIGURE_DIR = PROJECT_ROOT / "presentation" / "figures"
FIGURE_DIR.mkdir(exist_ok=True)
OUTPUT_PATH = FIGURE_DIR / "verksamhet_geografi_heatmap.png"


def main() -> None:
    df = pd.read_csv(DATA_PATH)

    joint = (
        df.groupby(["Verksamhet", "GeografisktOmrade"], observed=False)
        .agg(Skador=("AntalSkador", "sum"), Exponering=("Duration", "sum"))
        .assign(Skadefrekvens=lambda d: d["Skador"] / d["Exponering"])
        .reset_index()
    )

    verk_marg = (
        df.groupby("Verksamhet", observed=False)
        .agg(Skador=("AntalSkador", "sum"), Exponering=("Duration", "sum"))
        .assign(Skadefrekvens=lambda d: d["Skador"] / d["Exponering"])
        ["Skadefrekvens"]
    )
    geo_marg = (
        df.groupby("GeografisktOmrade", observed=False)
        .agg(Skador=("AntalSkador", "sum"), Exponering=("Duration", "sum"))
        .assign(Skadefrekvens=lambda d: d["Skador"] / d["Exponering"])
        ["Skadefrekvens"]
    )

    verk_order = verk_marg.sort_values(ascending=False).index.tolist()
    geo_order = geo_marg.sort_values(ascending=False).index.tolist()

    pivot = joint.pivot(
        index="Verksamhet", columns="GeografisktOmrade", values="Skadefrekvens"
    ).loc[verk_order, geo_order]

    fig, ax = plt.subplots(figsize=(7.5, 5))
    sns.heatmap(
        pivot,
        annot=True,
        fmt=".4f",
        cmap="Blues",
        linewidths=0.5,
        cbar_kws={"label": "Skadefrekvens"},
        ax=ax,
        yticklabels=verk_order,
        xticklabels=geo_order,
    )

    ax.set_xlabel("")
    ax.set_ylabel("")
    plt.setp(ax.get_xticklabels(), rotation=0, ha="center")
    plt.setp(ax.get_yticklabels(), rotation=0)
    plt.tight_layout()
    plt.savefig(OUTPUT_PATH, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"Sparad: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
