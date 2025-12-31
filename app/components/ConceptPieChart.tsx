"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#feb05d", "#FFCDC9", "#5a7acd"];

export default function ConceptPieChart({ data }: { data: any[] }) {
  // process data
  const { categoryPieData, conceptPieData } = useMemo(() => {
    if (!data || data.length === 0)
      return { categoryPieData: [], conceptPieData: [] };

    const groups: Record<string, number> = {};
    data.forEach((item) => {
      groups[item.category] = (groups[item.category] || 0) + item.value;
    });

    const sortedCategories = Object.keys(groups).sort(
      (a, b) => groups[b] - groups[a],
    );

    const orderedCategories: any[] = [];
    const orderedConcepts: any[] = [];

    sortedCategories.forEach((cat, index) => {
      orderedCategories.push({
        name: cat,
        value: groups[cat],
        color: COLORS[index % COLORS.length],
      });

      const catConcepts = data
        .filter((d) => d.category === cat)
        .sort((a, b) => b.value - a.value);

      catConcepts.forEach((concept) => {
        orderedConcepts.push({
          ...concept,
          color: COLORS[index % COLORS.length], // Inherit parent color!
        });
      });
    });

    return {
      categoryPieData: orderedCategories,
      conceptPieData: orderedConcepts,
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-10">No data to display</div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={conceptPieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}
            stroke="#fff"
            strokeWidth={1}
          >
            {conceptPieData.map((entry, index) => (
              <Cell
                key={`cell-inner-${index}`}
                fill={entry.color}
                opacity={0.8}
              />
            ))}
          </Pie>

          <Pie
            data={categoryPieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={65} // Starts where inner ends
            outerRadius={90}
            stroke="#fff"
            strokeWidth={2}
            label={
              ({ name, percent }) => (percent || 0.0 > 0.05 ? name : "") // Only label big slices
            }
          >
            {categoryPieData.map((entry, index) => (
              <Cell key={`cell-outer-${index}`} fill={entry.color} />
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
