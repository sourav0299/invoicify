"use client"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"

const data = [
  {
    name: "Jan",
    total: 1200,
  },
  {
    name: "Feb",
    total: 1800,
  },
  {
    name: "Mar",
    total: 2200,
  },
  {
    name: "Apr",
    total: 2800,
  },
  {
    name: "May",
    total: 2500,
  },
  {
    name: "Jun",
    total: 3000,
  },
]

export function SalesSummaryChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          cursor={{ fill: "rgba(58, 139, 255, 0.1)" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="border-none shadow-md p-2">
                  <div className="text-sm font-medium">{payload[0].payload.name}</div>
                  <div className="text-sm font-bold">₹{payload[0].value}</div>
                </Card>
              )
            }
            return null
          }}
        />
        <Bar dataKey="total" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} barSize={30} />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a8bff" stopOpacity={1} />
            <stop offset="100%" stopColor="#3a8bff" stopOpacity={0.6} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  )
}
