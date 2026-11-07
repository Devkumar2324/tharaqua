"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getDepthChartData } from "@/lib/groundwater";

export function DepthComparisonChart() {
  const data = getDepthChartData();
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Estimated Groundwater Depth</CardTitle>
        <CardDescription className="text-xs">
          Average estimated water-table depth by town (metres) — illustrative sample
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 16, right: 8, bottom: 4, left: -16 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                unit=" m"
                width={50}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--accent))", fillOpacity: 0.3 }}
                formatter={(value: number, _name, item) => {
                  const p = item.payload;
                  return [
                    `${p.depthMin}–${p.depthMax} m (avg ${value} m)`,
                    `${p.name} (${p.potential})`,
                  ];
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="depthAvg"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
                <LabelList
                  dataKey="depthAvg"
                  position="top"
                  formatter={(v: number) => `${v}m`}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    fill: "hsl(var(--foreground))",
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Bars are coloured by groundwater potential class. Hover a bar to see the full depth range.
        </p>
      </CardContent>
    </Card>
  );
}
