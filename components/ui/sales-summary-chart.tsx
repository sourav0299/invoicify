"use client"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface Invoice {
  id: string
  billDate: string
  totalPayableAmount: number
}

interface MonthlyData {
  name: string
  total: number
}

export function SalesSummaryChart() {
  const [data, setData] = useState<MonthlyData[]>([])

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/invoices')
        if (response.ok) {
          const invoices: Invoice[] = await response.json()
          
          // Process invoices to get monthly totals
          const monthlyTotals = new Map<string, number>()
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          
          // Initialize all months with 0
          monthNames.forEach(month => {
            monthlyTotals.set(month, 0)
          })

          // Sum up totals for each month
          invoices.forEach(invoice => {
            const date = new Date(invoice.billDate)
            const monthName = monthNames[date.getMonth()]
            const currentTotal = monthlyTotals.get(monthName) || 0
            monthlyTotals.set(monthName, currentTotal + invoice.totalPayableAmount)
          })

          // Convert to array format for chart
          const chartData = monthNames.map(month => ({
            name: month,
            total: monthlyTotals.get(month) || 0
          }))

          setData(chartData)
        } else {
          console.error('Failed to fetch invoices')
        }
      } catch (error) {
        console.error('Error fetching invoices:', error)
      } finally {

      }
    }

    fetchInvoices()
  }, [])

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} className="px-1">
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
        />
        <Tooltip
          cursor={{ fill: "rgba(58, 139, 255, 0.1)" }}
          content={({ active, payload }) => {
            if (active && payload?.[0]?.payload?.name && payload?.[0]?.value !== undefined) {
              return (
                <Card className="border-none shadow-md p-2">
                  <div className="text-sm font-medium">{payload[0].payload.name}</div>
                  <div className="text-sm font-bold">₹{payload[0].value.toLocaleString('en-IN')}</div>
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
