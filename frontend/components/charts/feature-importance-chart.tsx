"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { FEATURE_IMPORTANCE_DATA } from "@/lib/data";

const chartConfig = {
  gain: {
    label: "Gain",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function FeatureImportanceChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[160px] w-full">
      <BarChart data={FEATURE_IMPORTANCE_DATA} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" />
        <YAxis
          dataKey="feature"
          type="category"
          width={130}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="gain" fill="var(--color-gain)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
