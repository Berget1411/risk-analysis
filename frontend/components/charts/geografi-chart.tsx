"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { GEOGRAFI_CHART_DATA } from "@/lib/data";

const chartConfig = {
  rateRatio: {
    label: "Rate Ratio",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function GeografiChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[180px] w-full">
      <BarChart data={GEOGRAFI_CHART_DATA} layout="vertical" margin={{ left: 20 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" domain={[0, 1.6]} tickCount={5} />
        <YAxis
          dataKey="name"
          type="category"
          width={130}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ReferenceLine
          x={1}
          stroke="var(--color-muted-foreground)"
          strokeDasharray="3 3"
        />
        <Bar dataKey="rateRatio" fill="var(--color-rateRatio)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
