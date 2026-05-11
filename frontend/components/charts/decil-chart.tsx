"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { DECIL_DATA } from "@/lib/data";

const chartConfig = {
  omsattning: {
    label: "Omsättning",
    color: "var(--chart-2)",
  },
  forsakringsbelopp: {
    label: "Försäkringsbelopp",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function DecilChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <BarChart data={DECIL_DATA} margin={{ left: 10, right: 10 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="decil"
          label={{ value: "Decil (1 = lägst, 10 = högst)", position: "bottom", offset: -5, fontSize: 11 }}
        />
        <YAxis
          label={{ value: "Skador per exp. år", angle: -90, position: "insideLeft", offset: 10, fontSize: 11 }}
          domain={[0, 0.04]}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <ReferenceLine
          y={0.0214}
          stroke="var(--color-muted-foreground)"
          strokeDasharray="3 3"
          label={{ value: "Snitt 0,0214", position: "right", fontSize: 10 }}
        />
        <Bar dataKey="omsattning" fill="var(--color-omsattning)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="forsakringsbelopp" fill="var(--color-forsakringsbelopp)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
