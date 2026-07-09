"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { week: string; lost_revenue: number };

export function LostRevenueChart({ data }: { data: Point[] }) {
  const chartData = data.map((d) => ({
    week: d.week.replace(/ .*/, ""),
    lost: Number(d.lost_revenue.toFixed(0)),
  }));

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid stroke="rgba(45, 212, 168, 0.12)" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: "#8aa39a", fontSize: 11 }} />
          <YAxis tick={{ fill: "#8aa39a", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "#102018",
              border: "1px solid rgba(45, 212, 168, 0.35)",
              borderRadius: 10,
            }}
            formatter={(value: number) => [`R$ ${value}`, "Receita perdida"]}
          />
          <Bar dataKey="lost" fill="#2dd4a8" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
