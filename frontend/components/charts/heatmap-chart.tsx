"use client";

import { Fragment } from "react";
import { HEATMAP_DATA } from "@/lib/data";

function getColor(value: number): string {
  const min = 0.0097;
  const max = 0.0398;
  const t = (value - min) / (max - min);
  const lightness = 0.85 - t * 0.45;
  return `oklch(${lightness} 0.15 250)`;
}

export function HeatmapChart() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[500px]">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `140px repeat(${HEATMAP_DATA.geografier.length}, 1fr)`,
          }}
        >
          <div />
          {HEATMAP_DATA.geografier.map((geo) => (
            <div
              key={geo}
              className="text-center text-xs font-medium text-muted-foreground"
            >
              {geo}
            </div>
          ))}

          {HEATMAP_DATA.verksamheter.map((verk, i) => (
            <Fragment key={verk}>
              <div className="flex items-center text-xs font-medium">
                {verk}
              </div>
              {HEATMAP_DATA.values[i].map((val, j) => (
                <div
                  key={`${verk}-${HEATMAP_DATA.geografier[j]}`}
                  className="flex h-10 items-center justify-center rounded text-xs font-mono font-medium"
                  style={{
                    backgroundColor: getColor(val),
                    color: val > 0.025 ? "white" : "var(--foreground)",
                  }}
                >
                  {val.toFixed(4)}
                </div>
              ))}
            </Fragment>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Låg</span>
          <div
            className="h-3 flex-1 rounded"
            style={{
              background:
                "linear-gradient(to right, oklch(0.85 0.15 250), oklch(0.40 0.15 250))",
            }}
          />
          <span>Hög</span>
          <span className="ml-2">(skador per exponerat år)</span>
        </div>
      </div>
    </div>
  );
}
