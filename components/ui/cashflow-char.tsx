"use client"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"

const data = [
  {
    name: "Jan",
    inflow: 2400,
    outflow: 1400,
  },
  {
    name: "Feb",
    inflow: 1398,
    outflow: 980,
  },
  {
    name: "Mar",
    inflow: 9800,
    outflow: 3908,
  },
  {
    name: "Apr",
    inflow: 3908,
    outflow: 4800,
  },
  {
    name: "May",
    inflow: 4800,
    outflow: 3800,
  },
  {
    name: "Jun",
    inflow: 3800,
    outflow: 1500,
  },
  {
    name: "Jul",
    inflow: 4300,
    outflow: 2300,
  },
  {
    name: "Aug",
    inflow: 5300,
    outflow: 3300,
  },
  {
    name: "Sep",
    inflow: 4300,
    outflow: 2100,
  },
  {
    name: "Oct",
    inflow: 6300,
    outflow: 3700,
  },
  {
    name: "Nov",
    inflow: 7300,
    outflow: 4200,
  },
  {
    name: "Dec",
    inflow: 8300,
    outflow: 5100,
  },
]

export function CashflowChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3a8bff" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3a8bff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#40c79a" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#40c79a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="name" hide={true} />
        <YAxis hide={true} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="border-none shadow-md p-2">
                  <div className="text-sm font-medium">{payload[0].payload.name}</div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <div className="text-xs">Inflow: ₹{payload[0].value}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-300"></div>
                    <div className="text-xs">Outflow: ₹{payload[1].value}</div>
                  </div>
                </Card>
              )
            }
            return null
          }}
        />
        <Area type="monotone" dataKey="inflow" stroke="#3a8bff" fillOpacity={1} fill="url(#colorInflow)" />
        <Area type="monotone" dataKey="outflow" stroke="#40c79a" fillOpacity={1} fill="url(#colorOutflow)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
