"use client"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface MonthlyData {
  name: string
  sales: number
  expenses: number
}

export function CashflowChart() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch invoices and expenses
        const [invoicesResponse, expensesResponse] = await Promise.all([
          fetch('/api/invoices'),
          fetch('/api/expenses')
        ])

        if (invoicesResponse.ok && expensesResponse.ok) {
          const invoices = await invoicesResponse.json()
          const expenses = await expensesResponse.json()

          // Create a map to store monthly totals
          const monthlyTotals = new Map<string, { sales: number, expenses: number }>()

          // Initialize all months of the current year
          const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ]
          
          const currentYear = new Date().getFullYear()
          months.forEach((month, index) => {
            monthlyTotals.set(month, { 
              sales: 0, 
              expenses: 0 
            })
          })

          // Aggregate invoice amounts by month
          invoices.forEach((invoice: any) => {
            const date = new Date(invoice.billDate)
            if (date.getFullYear() === currentYear) {
              const month = months[date.getMonth()]
              const current = monthlyTotals.get(month)!
              current.sales += invoice.totalPayableAmount
              monthlyTotals.set(month, current)
            }
          })

          // Aggregate expense amounts by month
          expenses.forEach((expense: any) => {
            const date = new Date(expense.expenseDate || expense.date || expense.createdAt)
            if (date.getFullYear() === currentYear) {
              const month = months[date.getMonth()]
              const current = monthlyTotals.get(month)!
              // If taxIncluded is true, use totalPrice, otherwise use expenseAmount + tax
              let expenseAmount = 0
              if (expense.totalPrice) {
                expenseAmount = expense.totalPrice
              } else {
                const baseAmount = expense.expenseAmount || 0
                const taxRate = expense.taxRate || 0
                expenseAmount = expense.taxIncluded ? 
                  baseAmount : // If tax included, use base amount
                  baseAmount * (1 + (taxRate / 100)) // If tax excluded, add tax
              }
              current.expenses += expenseAmount
              monthlyTotals.set(month, current)
            }
          })

          // Convert map to array format for Recharts
          const chartData: MonthlyData[] = months.map(month => ({
            name: month,
            sales: monthlyTotals.get(month)!.sales,
            expenses: monthlyTotals.get(month)!.expenses
          }))

          setMonthlyData(chartData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="h-[200px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">Loading chart data...</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        data={monthlyData}
        margin={{
          top: 10,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3a8bff" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3a8bff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#40c79a" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#40c79a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="name" hide={true} />
        <YAxis hide={true} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length >= 2) {
              const salesValue = payload[0]?.value
              const expensesValue = payload[1]?.value
              
              if (typeof salesValue === 'number' && typeof expensesValue === 'number') {
                return (
                  <Card className="border-none shadow-md p-2">
                    <div className="text-sm font-medium">{payload[0].payload.name}</div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <div className="text-xs">Sales: ₹{salesValue.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-300"></div>
                      <div className="text-xs">Expenses: ₹{expensesValue.toLocaleString('en-IN')}</div>
                    </div>
                  </Card>
                )
              }
            }
            return null
          }}
        />
        <Area 
          type="monotone" 
          dataKey="sales" 
          stroke="#3a8bff" 
          fillOpacity={1} 
          fill="url(#colorSales)" 
          name="Sales"
        />
        <Area 
          type="monotone" 
          dataKey="expenses" 
          stroke="#40c79a" 
          fillOpacity={1} 
          fill="url(#colorExpenses)" 
          name="Expenses"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
