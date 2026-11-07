"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getPotentialDistribution } from "@/lib/groundwater";

export function PotentialDistributionChart() {
  const data = getPotentialDistribution();
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Groundwater Potential Distribution</CardTitle>
        <CardDescription className="text-xs">
          Share of surveyed sample locations by potential class
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="potential"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.potential} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, _name, item) => {
                  const pct = item.payload?.percentage ?? 0;
                  return [`${value} location${value === 1 ? "" : "s"} (${pct}%)`, `${item.payload?.potential} potential`];
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => (
                  <span className="text-foreground/80">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          {data.map((d) => (
            <div key={d.potential} className="rounded-lg bg-muted/60 px-2 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {d.potential}
              </p>
              <p className="text-sm font-semibold" style={{ color: d.color }}>
                {d.count}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
