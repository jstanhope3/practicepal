"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#feb05d",
  "#FFCDC9",
  "#5a7acd",
  "#FEEAC9",
  "#FDACAC",
  "#FD7979",
];

export default function RepertoirePieChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            stroke="#fff"
            strokeWidth={1}
            label={({ name, percent }) => (percent || 0.0 > 0.05 ? name : "")}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-inner-${index}`}
                fill={COLORS[index]}
                opacity={1.0}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: any, name: any, props: any) => {
              return [`${value} min`, `${name}`];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
