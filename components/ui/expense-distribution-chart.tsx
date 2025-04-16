"use client"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card } from "@/components/ui/card"

const data = [
  { name: "Inventory", value: 40, color: "#40c79a" },
  { name: "Salaries", value: 30, color: "#9d9dfe" },
  { name: "Utilities", value: 15, color: "#e1aeda" },
  { name: "Marketing", value: 15, color: "#ffdf46" },
]

export function ExpenseDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="border-none shadow-md p-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: payload[0].payload.color }}></div>
                    <div className="text-sm font-medium">{payload[0].name}</div>
                  </div>
                  <div className="text-sm font-bold">{payload[0].value}%</div>
                </Card>
              )
            }
            return null
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
