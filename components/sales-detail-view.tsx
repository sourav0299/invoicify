"use client"

import { ArrowUp, ChevronDown, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Chart } from "@/components/ui/chart"
import { Bar } from "recharts"
import { useState } from "react"

const monthlyData = [
  { name: "Jan", "Current Month": 15, "Previous Month": 12 },
  { name: "Feb", "Current Month": 18, "Previous Month": 14 },
  { name: "Mar", "Current Month": 22, "Previous Month": 18 },
  { name: "Apr", "Current Month": 28, "Previous Month": 22 },
  { name: "May", "Current Month": 25, "Previous Month": 20 },
  { name: "Jun", "Current Month": 30, "Previous Month": 24 },
  { name: "Jul", "Current Month": 35, "Previous Month": 26 },
  { name: "Aug", "Current Month": 40, "Previous Month": 30 },
  { name: "Sep", "Current Month": 45, "Previous Month": 32 },
  { name: "Oct", "Current Month": 50, "Previous Month": 38 },
  { name: "Nov", "Current Month": 55, "Previous Month": 40 },
  { name: "Dec", "Current Month": 60, "Previous Month": 45 },
]

const weeklyData = [
  { name: "Week 1", "Current Week": 12, "Previous Week": 10 },
  { name: "Week 2", "Current Week": 14, "Previous Week": 11 },
  { name: "Week 3", "Current Week": 16, "Previous Week": 13 },
  { name: "Week 4", "Current Week": 18, "Previous Week": 15 },
]

const dailyData = [
  { name: "Mon", "Current Day": 4, "Previous Day": 3.5 },
  { name: "Tue", "Current Day": 4.5, "Previous Day": 3.8 },
  { name: "Wed", "Current Day": 4.8, "Previous Day": 4 },
  { name: "Thu", "Current Day": 5.2, "Previous Day": 4.2 },
  { name: "Fri", "Current Day": 5.8, "Previous Day": 4.5 },
  { name: "Sat", "Current Day": 6.2, "Previous Day": 4.8 },
  { name: "Sun", "Current Day": 5.5, "Previous Day": 4.4 },
]

const yearlyData = [
  { name: "2020", "Current Year": 35, "Previous Year": 30 },
  { name: "2021", "Current Year": 42, "Previous Year": 35 },
  { name: "2022", "Current Year": 48, "Previous Year": 42 },
  { name: "2023", "Current Year": 55, "Previous Year": 48 },
  { name: "2024", "Current Year": 60, "Previous Year": 55 },
]

// Sample transaction data
const transactions = [
  {
    id: "TRX-78945",
    date: "2024-04-11",
    customer: "Rahul Sharma",
    product: "Blue Vintage Lantern",
    amount: "₹12,500",
    status: "completed",
  },
  {
    id: "TRX-78946",
    date: "2024-04-10",
    customer: "Priya Patel",
    product: "Modern Desk Lamp",
    amount: "₹10,700",
    status: "completed",
  },
  {
    id: "TRX-78947",
    date: "2024-04-10",
    customer: "Amit Kumar",
    product: "Ceramic Vase Set",
    amount: "₹10,500",
    status: "processing",
  },
  {
    id: "TRX-78948",
    date: "2024-04-09",
    customer: "Neha Singh",
    product: "Wooden Wall Clock",
    amount: "₹8,000",
    status: "completed",
  },
  {
    id: "TRX-78949",
    date: "2024-04-09",
    customer: "Vikram Mehta",
    product: "Blue Vintage Lantern",
    amount: "₹12,500",
    status: "failed",
  },
]

const topProducts = [
  { product: "Blue Vintage Lantern", units: "42", revenue: "₹5,24,000", growth: "+18%" },
  { product: "Modern Desk Lamp", units: "36", revenue: "₹3,86,400", growth: "+12%" },
  { product: "Ceramic Vase Set", units: "28", revenue: "₹2,94,000", growth: "+8%" },
  { product: "Wooden Wall Clock", units: "24", revenue: "₹1,92,000", growth: "+5%" },
]

export function SalesDetailView() {
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null)

  const toggleTransaction = (index: number) => {
    setExpandedTransaction(expandedTransaction === index ? null : index)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="bg-white rounded-lg p-3 sm:p-4 border">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Total Sales (Monthly)</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">₹23,08,114</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              20%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 border">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Average Sale Value</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">₹64,114</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              12%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 border">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Total Transactions</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">36</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              8%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-3 sm:p-4 border-b">
          <h3 className="font-medium text-sm sm:text-base">Sales Breakdown</h3>
        </div>
        <div className="p-2 sm:p-4">
          <Tabs defaultValue="monthly">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div className="w-full sm:w-auto overflow-x-auto pb-1 -mx-1 px-1">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="daily" className="text-xs sm:text-sm">
                    Daily
                  </TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs sm:text-sm">
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs sm:text-sm">
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger value="yearly" className="text-xs sm:text-sm">
                    Yearly
                  </TabsTrigger>
                </TabsList>
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1 w-full sm:w-auto text-xs sm:text-sm">
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Export
              </Button>
            </div>

            <TabsContent value="monthly">
              <div className="bg-[#f9f9f9] rounded-md p-2 sm:p-4 overflow-hidden">
                <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
                  <Chart
                    data={monthlyData}
                    labels={["Current Month", "Previous Month"]}
                    colors={["#3a8bff", "#e0e2e7"]}
                  >
                    <Bar dataKey="Current Month" fill="#3a8bff" radius={[4, 4, 0, 0]} barSize={16} />
                    <Bar dataKey="Previous Month" fill="#e0e2e7" radius={[4, 4, 0, 0]} barSize={16} />
                  </Chart>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weekly">
              <div className="bg-[#f9f9f9] rounded-md p-2 sm:p-4 overflow-hidden">
                <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
                  <Chart data={weeklyData} labels={["Current Week", "Previous Week"]} colors={["#3a8bff", "#e0e2e7"]}>
                    <Bar dataKey="Current Week" fill="#3a8bff" radius={[4, 4, 0, 0]} barSize={16} />
                    <Bar dataKey="Previous Week" fill="#e0e2e7" radius={[4, 4, 0, 0]} barSize={16} />
                  </Chart>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="daily">
              <div className="bg-[#f9f9f9] rounded-md p-2 sm:p-4 overflow-hidden">
                <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
                  <Chart data={dailyData} labels={["Current Day", "Previous Day"]} colors={["#3a8bff", "#e0e2e7"]}>
                    <Bar dataKey="Current Day" fill="#3a8bff" radius={[4, 4, 0, 0]} barSize={16} />
                    <Bar dataKey="Previous Day" fill="#e0e2e7" radius={[4, 4, 0, 0]} barSize={16} />
                  </Chart>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="yearly">
              <div className="bg-[#f9f9f9] rounded-md p-2 sm:p-4 overflow-hidden">
                <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
                  <Chart data={yearlyData} labels={["Current Year", "Previous Year"]} colors={["#3a8bff", "#e0e2e7"]}>
                    <Bar dataKey="Current Year" fill="#3a8bff" radius={[4, 4, 0, 0]} barSize={16} />
                    <Bar dataKey="Previous Year" fill="#e0e2e7" radius={[4, 4, 0, 0]} barSize={16} />
                  </Chart>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-medium text-sm sm:text-base">Top Selling Products</h3>
          <Button variant="outline" size="sm" className="h-8 gap-1 w-full sm:w-auto text-xs sm:text-sm">
            This Month
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        <div className="sm:hidden p-3 space-y-3">
          {topProducts.map((item, i) => (
            <div key={i} className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium">{item.product}</p>
                  <p className="text-xs text-muted-foreground">{item.units} units</p>
                </div>
                <p className="text-xs text-green-600 font-medium">{item.growth}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{item.revenue}</p>
                <Badge variant="outline" className="bg-green-50 text-green-700 text-xs border-green-100">
                  Revenue
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet/Desktop view for products (table) */}
        <div className="hidden sm:block p-2 sm:p-4 overflow-x-auto">
          <div className="min-w-[500px]">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left text-sm font-medium">Product</th>
                  <th className="py-3 text-left text-sm font-medium">Units Sold</th>
                  <th className="py-3 text-left text-sm font-medium">Revenue</th>
                  <th className="py-3 text-right text-sm font-medium">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((item, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 text-sm font-medium">{item.product}</td>
                    <td className="py-3 text-sm">{item.units}</td>
                    <td className="py-3 text-sm">{item.revenue}</td>
                    <td className="py-3 text-sm text-right text-green-600">{item.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-medium text-sm sm:text-base">Recent Transactions</h3>
          <Button variant="outline" size="sm" className="h-8 gap-1 w-full sm:w-auto text-xs sm:text-sm">
            View All
          </Button>
        </div>

        <div className="sm:hidden p-3 space-y-3">
          {transactions.map((transaction, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div
                className="p-3 flex justify-between items-center cursor-pointer bg-gray-50"
                onClick={() => toggleTransaction(i)}
              >
                <div>
                  <p className="text-xs font-medium">{transaction.id}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium">{transaction.amount}</p>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0.5 ${
                      transaction.status === "completed"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : transaction.status === "processing"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </div>
              </div>
              {expandedTransaction === i && (
                <div className="p-3 border-t bg-white">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Customer</p>
                      <p className="font-medium">{transaction.customer}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Product</p>
                      <p className="font-medium">{transaction.product}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3 h-7 text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden sm:block p-2 sm:p-4 overflow-x-auto">
          <div className="min-w-[700px]">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left text-sm font-medium">Transaction ID</th>
                  <th className="py-3 text-left text-sm font-medium">Date</th>
                  <th className="py-3 text-left text-sm font-medium">Customer</th>
                  <th className="py-3 text-left text-sm font-medium">Product</th>
                  <th className="py-3 text-left text-sm font-medium">Amount</th>
                  <th className="py-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 text-sm font-medium">{transaction.id}</td>
                    <td className="py-3 text-sm">{transaction.date}</td>
                    <td className="py-3 text-sm">{transaction.customer}</td>
                    <td className="py-3 text-sm">{transaction.product}</td>
                    <td className="py-3 text-sm">{transaction.amount}</td>
                    <td className="py-3 text-sm">
                      <Badge
                        variant="outline"
                        className={
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                            : transaction.status === "processing"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                              : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                        }
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
