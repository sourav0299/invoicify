"use client"

import { ArrowUp, ChevronDown, Download, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Card } from "@/components/ui/card"
import { useState } from "react"

// Sample data for the charts
const monthlyData = [
  { name: "Jan", "Current Month": 12, "Previous Month": 10 },
  { name: "Feb", "Current Month": 14, "Previous Month": 12 },
  { name: "Mar", "Current Month": 16, "Previous Month": 14 },
  { name: "Apr", "Current Month": 20, "Previous Month": 17 },
  { name: "May", "Current Month": 18, "Previous Month": 15 },
  { name: "Jun", "Current Month": 22, "Previous Month": 19 },
  { name: "Jul", "Current Month": 25, "Previous Month": 21 },
  { name: "Aug", "Current Month": 28, "Previous Month": 24 },
  { name: "Sep", "Current Month": 30, "Previous Month": 26 },
  { name: "Oct", "Current Month": 32, "Previous Month": 28 },
  { name: "Nov", "Current Month": 35, "Previous Month": 30 },
  { name: "Dec", "Current Month": 38, "Previous Month": 33 },
]

const weeklyData = [
  { name: "Week 1", "Current Week": 8, "Previous Week": 7 },
  { name: "Week 2", "Current Week": 10, "Previous Week": 8 },
  { name: "Week 3", "Current Week": 12, "Previous Week": 10 },
  { name: "Week 4", "Current Week": 14, "Previous Week": 12 },
]

const dailyData = [
  { name: "Mon", "Current Day": 3, "Previous Day": 2.5 },
  { name: "Tue", "Current Day": 3.2, "Previous Day": 2.8 },
  { name: "Wed", "Current Day": 3.5, "Previous Day": 3 },
  { name: "Thu", "Current Day": 3.8, "Previous Day": 3.2 },
  { name: "Fri", "Current Day": 4, "Previous Day": 3.5 },
  { name: "Sat", "Current Day": 3.6, "Previous Day": 3.1 },
  { name: "Sun", "Current Day": 3.2, "Previous Day": 2.7 },
]

const yearlyData = [
  { name: "2020", "Current Year": 25, "Previous Year": 22 },
  { name: "2021", "Current Year": 30, "Previous Year": 26 },
  { name: "2022", "Current Year": 35, "Previous Year": 30 },
  { name: "2023", "Current Year": 40, "Previous Year": 35 },
  { name: "2024", "Current Year": 45, "Previous Year": 40 },
]

// Sample expense categories data for pie chart
const expenseCategoriesData = [
  { name: "Inventory", value: 40, color: "#40c79a" },
  { name: "Salaries", value: 30, color: "#9d9dfe" },
  { name: "Utilities", value: 15, color: "#e1aeda" },
  { name: "Marketing", value: 15, color: "#ffdf46" },
]

// Sample expense categories data
const expenseCategories = [
  { category: "Inventory", percentage: 40, amount: "₹7,23,246" },
  { category: "Salaries", percentage: 30, amount: "₹5,42,434" },
  { category: "Utilities", percentage: 15, amount: "₹2,71,217" },
  { category: "Marketing", percentage: 15, amount: "₹2,71,217" },
]


const expenseTransactions = [
  {
    id: "EXP-12345",
    date: "2024-06-15",
    category: "Inventory",
    description: "Product Stock Purchase",
    amount: "₹3,45,000",
    status: "completed",
  },
  {
    id: "EXP-12346",
    date: "2024-06-10",
    category: "Salaries",
    description: "Staff Payroll",
    amount: "₹2,80,000",
    status: "completed",
  },
  {
    id: "EXP-12347",
    date: "2024-06-08",
    category: "Marketing",
    description: "Digital Advertising",
    amount: "₹1,25,000",
    status: "processing",
  },
  {
    id: "EXP-12348",
    date: "2024-06-05",
    category: "Utilities",
    description: "Electricity & Internet",
    amount: "₹45,000",
    status: "completed",
  },
  {
    id: "EXP-12349",
    date: "2024-06-03",
    category: "Inventory",
    description: "Raw Materials",
    amount: "₹1,85,000",
    status: "failed",
  },
]

const categoryComparisonData = [
  {
    category: "Inventory",
    thisMonth: "₹7,23,246",
    lastMonth: "₹6,85,000",
    change: "+5.6%",
  },
  {
    category: "Salaries",
    thisMonth: "₹5,42,434",
    lastMonth: "₹5,42,434",
    change: "0%",
  },
  {
    category: "Utilities",
    thisMonth: "₹2,71,217",
    lastMonth: "₹2,50,000",
    change: "+8.5%",
  },
  {
    category: "Marketing",
    thisMonth: "₹2,71,217",
    lastMonth: "₹2,10,000",
    change: "+29.2%",
  },
]


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="border-none shadow-md p-2">
        <div className="text-sm font-medium">{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <div className="text-xs">
              {entry.name}: ₹{entry.value}
            </div>
          </div>
        ))}
      </Card>
    );
  }
  return null;
};

export function ExpensesDetailView() {
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null)

  const toggleTransaction = (index: number) => {
    setExpandedTransaction(expandedTransaction === index ? null : index)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="bg-white rounded-lg p-3 sm:p-4 border">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Total Expenses (Monthly)</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">₹18,08,114</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              20%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 border">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Fixed Expenses</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">₹12,45,600</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              5%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 sm:p-4 border">
          <div className="text-xs sm:text-sm text-muted-foreground mb-1">Variable Expenses</div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">₹5,62,514</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              15%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
      </div>

     
      <div className="bg-white rounded-lg border">
        <div className="p-3 sm:p-4 border-b">
          <h3 className="font-medium text-sm sm:text-base">Expense Breakdown</h3>
        </div>
        <div className="p-2 sm:p-4">
          <Tabs defaultValue="monthly">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div className="w-full sm:w-auto overflow-x-auto pb-1 -mx-1 px-1">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="daily" className="text-xs sm:text-sm">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs sm:text-sm">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs sm:text-sm">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly" className="text-xs sm:text-sm">Yearly</TabsTrigger>
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
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        wrapperStyle={{ paddingTop: "10px" }}
                        payload={[
                          { value: 'Current Month', type: 'square', color: '#9d9dfe' },
                          { value: 'Previous Month', type: 'square', color: '#e0e2e7' }
                        ]}
                      />
                      <Bar dataKey="Current Month" fill="#9d9dfe" radius={[4, 4, 0, 0]} barSize={16} />
                      <Bar dataKey="Previous Month" fill="#e0e2e7" radius={[4, 4, 0, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weekly">
              <div className="bg-[#f9f9f9] rounded-md p-2 sm:p-4 overflow-hidden">
                <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        wrapperStyle={{ paddingTop: "10px" }}
                        payload={[
                          { value: 'Current Week', type: 'square', color: '#9d9dfe' },
                          { value: 'Previous Week', type: 'square', color: '#e0e2e7' }
                        ]}
                      />
                      <Bar dataKey="Current Week" fill="#9d9dfe" radius={[4, 4, 0, 0]} barSize={16} />
                      <Bar dataKey="Previous Week" fill="#e0e2e7" radius={[4, 4, 0, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="daily">
              <div className="bg-[#f9f9f9] rounded-md p-2 sm:p-4 overflow-hidden">
                <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        wrapperStyle={{ paddingTop: "10px" }}
                        payload={[
                          { value: 'Current Day', type: 'square', color: '#9d9dfe' },
                          { value: 'Previous Day', type: 'square', color: '#e0e2e7' }
                        ]}
                      />
                      <Bar dataKey="Current Day" fill="#9d9dfe" radius={[4, 4, 0, 0]} barSize={16} />
                      <Bar dataKey="Previous Day" fill="#e0e2e7" radius={[4, 4, 0, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="yearly">
              <div className="bg-[#f9f9f9] rounded-md p-2 sm:p-4 overflow-hidden">
                <div className="w-full h-[200px] sm:h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        wrapperStyle={{ paddingTop: "10px" }}
                        payload={[
                          { value: 'Current Year', type: 'square', color: '#9d9dfe' },
                          { value: 'Previous Year', type: 'square', color: '#e0e2e7' }
                        ]}
                      />
                      <Bar dataKey="Current Year" fill="#9d9dfe" radius={[4, 4, 0, 0]} barSize={16} />
                      <Bar dataKey="Previous Year" fill="#e0e2e7" radius={[4, 4, 0, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      
      <div className="bg-white rounded-lg border">
        <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-medium text-sm sm:text-base">Expense Categories</h3>
          <Button variant="outline" size="sm" className="h-8 gap-1 w-full sm:w-auto text-xs sm:text-sm">
            This Month
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart Section */}
            <div>
              <div className="h-[200px] sm:h-[250px] w-full rounded-md bg-[#f9f9f9] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategoriesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {expenseCategoriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value:number, name) => [`₹${(value / 100 * 1808114).toLocaleString('en-IN')} (${value}%)`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-2">
                {expenseCategories.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        i === 0 ? "bg-[#40c79a]" : i === 1 ? "bg-[#9d9dfe]" : i === 2 ? "bg-[#e1aeda]" : "bg-[#ffdf46]"
                      }`}
                    ></div>
                    <span className="text-xs">
                      {item.category} ({item.percentage}%) - {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
           
            <div className="md:hidden space-y-3">
              {categoryComparisonData.map((item, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium">{item.category}</p>
                    <p className="text-xs text-green-600 font-medium">{item.change}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">This Month</p>
                      <p className="text-sm font-medium">{item.thisMonth}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Last Month</p>
                      <p className="text-sm">{item.lastMonth}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Category Comparison - Tablet/Desktop View */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left text-sm font-medium">Category</th>
                      <th className="py-3 text-left text-sm font-medium">This Month</th>
                      <th className="py-3 text-left text-sm font-medium">Last Month</th>
                      <th className="py-3 text-right text-sm font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryComparisonData.map((item, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3 text-sm font-medium">{item.category}</td>
                        <td className="py-3 text-sm">{item.thisMonth}</td>
                        <td className="py-3 text-sm">{item.lastMonth}</td>
                        <td className="py-3 text-sm text-right text-green-600">{item.change}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Transactions Section */}
      <div className="bg-white rounded-lg border">
        <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="font-medium text-sm sm:text-base">Recent Expenses</h3>
          <Button variant="outline" size="sm" className="h-8 gap-1 w-full sm:w-auto text-xs sm:text-sm">
            View All
          </Button>
        </div>
        
        {/* Mobile view for transactions (accordion) */}
        <div className="sm:hidden p-3 space-y-3">
          {expenseTransactions.map((transaction, i) => (
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
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium">{transaction.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Description</p>
                      <p className="font-medium">{transaction.description}</p>
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
                  <th className="py-3 text-left text-sm font-medium">Category</th>
                  <th className="py-3 text-left text-sm font-medium">Description</th>
                  <th className="py-3 text-left text-sm font-medium">Amount</th>
                  <th className="py-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {expenseTransactions.map((transaction, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 text-sm font-medium">{transaction.id}</td>
                    <td className="py-3 text-sm">{transaction.date}</td>
                    <td className="py-3 text-sm">{transaction.category}</td>
                    <td className="py-3 text-sm">{transaction.description}</td>
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
