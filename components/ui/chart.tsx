"use client"
import { BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type React from "react"

import { Card } from "@/components/ui/card"

interface ChartProps {
  // Update the data type to accept any object with a name property
  data: Array<Record<string, any>>
  labels: string[]
  colors: string[]
  height?: number
  children?: React.ReactNode
}

export function Chart({ data, labels, colors, height = 300, children }: ChartProps) {
  // No need to transform the data since it's already in the correct format
  return (
    <ResponsiveContainer width="100%" height={height}>
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
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="border-none shadow-md p-2">
                  <div className="text-sm font-medium">{label}</div>
                  {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <div className="text-xs">
                        {entry.name}: ₹{entry.value}
                      </div>
                    </div>
                  ))}
                </Card>
              )
            }
            return null
          }}
        />
        <Legend
          content={({ payload }) => {
            if (payload && payload.length) {
              return (
                <div className="flex justify-center gap-6 mt-2">
                  {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-xs">{entry.value}</span>
                    </div>
                  ))}
                </div>
              )
            }
            return null
          }}
        />
        {children}
      </BarChart>
    </ResponsiveContainer>
  )
}
