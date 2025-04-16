"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"

interface RadialChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
  innerRadius?: number
  outerRadius?: number
  height?: number
}

export function RadialChart({ data, innerRadius = 60, outerRadius = 80, height = 200 }: RadialChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <Card className="border-none shadow-md p-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }}></div>
                    <div className="text-sm font-medium">{data.name}</div>
                  </div>
                  <div className="text-sm font-bold">₹{data.value.toLocaleString()}</div>
                </Card>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
