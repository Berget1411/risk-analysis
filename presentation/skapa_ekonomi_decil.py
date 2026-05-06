"""Genererar ihopslagen decilfigur för Omsättning och Försäkringsbelopp.

Visar skadefrekvens per decil som grupperade staplar i samma steel-blue-palett
som övriga presentationsfigurer. Självrisk ligger kvar som egen figur eftersom
dess sex unika nivåer inte passar på decilaxeln.

Kör: uv run --project src python presentation/skapa_ekonomi_decil.py
"""
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = PROJECT_ROOT / "data" / "Entreprenadförsäkring training.csv"
FIGURE_DIR = PROJECT_ROOT / "presentation" / "figures"
FIGURE_DIR.mkdir(exist_ok=True)
OUTPUT_PATH = FIGURE_DIR / "omsattning_forsakringsbelopp_decil.png"

COLOR_OMSATTNING = "#2c5282"
COLOR_FORSAKRINGSBELOPP = "#7aa6c2"
COLOR_REFERENCE = "#9aa3ad"
COLOR_TEXT = "#1a202c"


def decile_claim_rate(df: pd.DataFrame, kolumn: str) -> pd.Series:
    """Skadefrekvens per decil för en kontinuerlig variabel."""
    decil = pd.qcut(df[kolumn], 10, labels=False, duplicates="drop") + 1
    grouped = (
        df.assign(_decil=decil)
        .groupby("_decil", observed=False)
        .agg(Skador=("AntalSkador", "sum"), Exponering=("Duration", "sum"))
    )
    return (grouped["Skador"] / grouped["Exponering"]).rename(kolumn)


def main() -> None:
    df = pd.read_csv(DATA_PATH)

    oms = decile_claim_rate(df, "Omsattning")
    fb = decile_claim_rate(df, "Forsakringsbelopp")
    portfoljsnitt = df["AntalSkador"].sum() / df["Duration"].sum()

    deciler = np.arange(1, 11)
    bredd = 0.4

    fig, ax = plt.subplots(figsize=(10, 5.2))

    ax.bar(
        deciler - bredd / 2,
        oms.reindex(deciler).to_numpy(),
        width=bredd,
        color=COLOR_OMSATTNING,
        edgecolor="white",
        linewidth=0.5,
        label="Omsättning",
    )
    ax.bar(
        deciler + bredd / 2,
        fb.reindex(deciler).to_numpy(),
        width=bredd,
        color=COLOR_FORSAKRINGSBELOPP,
        edgecolor="white",
        linewidth=0.5,
        label="Försäkringsbelopp",
    )

    ax.axhline(
        portfoljsnitt,
        color=COLOR_REFERENCE,
        linestyle="--",
        linewidth=1.2,
        label=f"Portföljsnitt ({portfoljsnitt:.4f})",
    )

    ax.set_xticks(deciler)
    ax.set_xlabel("Decil (1 = lägst, 10 = högst)", color=COLOR_TEXT)
    ax.set_ylabel("Skador per exponerat år", color=COLOR_TEXT)
    ax.set_title(
        "Omsättning vs försäkringsbelopp: skadefrekvens per decil",
        color=COLOR_TEXT,
        fontweight="bold",
    )
    ax.yaxis.set_major_formatter(plt.matplotlib.ticker.FormatStrFormatter("%.3f"))

    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color(COLOR_REFERENCE)
    ax.spines["bottom"].set_color(COLOR_REFERENCE)
    ax.tick_params(colors=COLOR_TEXT)
    ax.grid(axis="y", alpha=0.3, linestyle="-", color=COLOR_REFERENCE)
    ax.set_axisbelow(True)

    ax.legend(loc="upper left", frameon=False)

    plt.tight_layout()
    plt.savefig(OUTPUT_PATH, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"Sparad: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
