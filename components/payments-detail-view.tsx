"use client"

import { ArrowDown, ArrowUp, ChevronDown, Download, Calendar, CreditCard, Wallet, Users } from "lucide-react"
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
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const monthlyData = [
  { name: "Jan", Received: 8, Expected: 6 },
  { name: "Feb", Received: 9, Expected: 7 },
  { name: "Mar", Received: 10, Expected: 8 },
  { name: "Apr", Received: 12, Expected: 9 },
  { name: "May", Received: 11, Expected: 8 },
  { name: "Jun", Received: 13, Expected: 10 },
  { name: "Jul", Received: 14, Expected: 11 },
  { name: "Aug", Received: 15, Expected: 12 },
  { name: "Sep", Received: 16, Expected: 13 },
  { name: "Oct", Received: 18, Expected: 14 },
  { name: "Nov", Received: 20, Expected: 16 },
  { name: "Dec", Received: 22, Expected: 18 },
]

const quarterlyData = [
  { name: "Q1", Received: 30, Expected: 25 },
  { name: "Q2", Received: 36, Expected: 30 },
  { name: "Q3", Received: 45, Expected: 38 },
  { name: "Q4", Received: 60, Expected: 50 },
]


const paymentMethodsData = [
  { name: "UPI", value: 60, color: "#ff6b6b", amount: "₹16,868" },
  { name: "Bank Transfer", value: 30, color: "#ffd166", amount: "₹8,434" },
  { name: "Cash", value: 10, color: "#06d6a0", amount: "₹2,811" },
]


const payments = [
  {
    id: "PAY-45678",
    date: "2024-06-15",
    customer: "Rahul Sharma",
    invoice: "INV-78945",
    amount: "₹12,500",
    method: "UPI",
    status: "completed",
  },
  {
    id: "PAY-45679",
    date: "2024-06-12",
    customer: "Priya Patel",
    invoice: "INV-78946",
    amount: "₹10,700",
    method: "Bank Transfer",
    status: "completed",
  },
  {
    id: "PAY-45680",
    date: "2024-06-10",
    customer: "Amit Kumar",
    invoice: "INV-78947",
    amount: "₹5,250",
    method: "UPI",
    status: "processing",
  },
  {
    id: "PAY-45681",
    date: "2024-06-08",
    customer: "Neha Singh",
    invoice: "INV-78948",
    amount: "₹8,000",
    method: "Cash",
    status: "completed",
  },
  {
    id: "PAY-45682",
    date: "2024-06-05",
    customer: "Vikram Mehta",
    invoice: "INV-78949",
    amount: "₹6,250",
    method: "UPI",
    status: "failed",
  },
]

// Sample payment insights
const paymentInsights = [
  {
    title: "Average Payment Time",
    value: "3.2 days",
    change: "-0.5 days",
    trend: "positive",
    icon: Calendar,
  },
  {
    title: "Payment Success Rate",
    value: "92%",
    change: "+2%",
    trend: "positive",
    icon: CreditCard,
  },
  {
    title: "Recurring Customers",
    value: "68%",
    change: "+5%",
    trend: "positive",
    icon: Users,
  },
  {
    title: "Digital Payments",
    value: "90%",
    change: "+8%",
    trend: "positive",
    icon: Wallet,
  },
]

// Custom tooltip component for the bar chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="border-none shadow-md p-2">
        <div className="text-sm font-medium">{label}</div>
        {payload.map((entry: any, index: number) => (
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
}

export function PaymentsDetailView() {
  return (
    <div className="space-y-6">
      {/* Payment Summary Cards in a different layout */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payment Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <div className="text-2xl font-bold">₹28,114</div>
                <div className="text-sm text-muted-foreground">Total Payments (Monthly)</div>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100">
                <Wallet className="h-6 w-6 text-pink-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex items-center text-xs text-red-600">
                <ArrowDown className="mr-1 h-3 w-3" />
                3%
              </div>
              <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-green-50 p-3">
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-xl font-bold text-green-600">₹31,200</div>
                <div className="mt-1 text-xs text-green-600">+12% from last month</div>
              </div>
              <div className="rounded-lg bg-amber-50 p-3">
                <div className="text-sm text-muted-foreground">Pending</div>
                <div className="text-xl font-bold text-amber-600">₹15,750</div>
                <div className="mt-1 text-xs text-amber-600">+8% from last month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Insights - A unique section for payments */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Payment Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {paymentInsights.map((insight, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100">
                  <insight.icon className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{insight.title}</div>
                  <div className="text-xl font-bold">{insight.value}</div>
                  <div
                    className={`flex items-center text-xs ${insight.trend === "positive" ? "text-green-600" : "text-red-600"}`}
                  >
                    {insight.trend === "positive" ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {insight.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Payment Trends</CardTitle>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly">
            <TabsList className="mb-4">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            </TabsList>

            <TabsContent value="monthly">
              <div className="bg-[#f9f9f9] rounded-md p-4">
                <ResponsiveContainer width="100%" height={300}>
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
                        { value: "Received", type: "square", color: "#ff6b6b" },
                        { value: "Expected", type: "square", color: "#e0e2e7" },
                      ]}
                    />
                    <Bar dataKey="Received" fill="#ff6b6b" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="Expected" fill="#e0e2e7" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="weekly">
              <div className="bg-[#f9f9f9] rounded-md p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData.slice(0, 4)}>
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
                        { value: "Received", type: "square", color: "#ff6b6b" },
                        { value: "Expected", type: "square", color: "#e0e2e7" },
                      ]}
                    />
                    <Bar dataKey="Received" fill="#ff6b6b" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="Expected" fill="#e0e2e7" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="quarterly">
              <div className="bg-[#f9f9f9] rounded-md p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={quarterlyData}>
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
                        { value: "Received", type: "square", color: "#ff6b6b" },
                        { value: "Expected", type: "square", color: "#e0e2e7" },
                      ]}
                    />
                    <Bar dataKey="Received" fill="#ff6b6b" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="Expected" fill="#e0e2e7" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Payment Methods</CardTitle>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              This Month
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value}% - ${paymentMethodsData.find((item) => item.name === name)?.amount}`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-3 gap-4 w-full">
                {paymentMethodsData.map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="mt-1 text-sm font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.value}%</span>
                    <span className="mt-1 text-sm">{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Payment Timeline</CardTitle>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              This Month
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { day: "Today", payments: [{ time: "10:30 AM", amount: "₹5,250", customer: "Amit Kumar" }] },
                {
                  day: "Yesterday",
                  payments: [
                    { time: "3:45 PM", amount: "₹10,700", customer: "Priya Patel" },
                    { time: "11:20 AM", amount: "₹8,000", customer: "Neha Singh" },
                  ],
                },
                { day: "15 Jun 2024", payments: [{ time: "2:15 PM", amount: "₹12,500", customer: "Rahul Sharma" }] },
              ].map((day, i) => (
                <div key={i}>
                  <div className="mb-2 text-sm font-medium">{day.day}</div>
                  <div className="space-y-3">
                    {day.payments.map((payment, j) => (
                      <div key={j} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <div className="text-sm font-medium">{payment.customer}</div>
                          <div className="text-xs text-muted-foreground">{payment.time}</div>
                        </div>
                        <div className="text-sm font-medium">{payment.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

     
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Recent Payments</CardTitle>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="grid grid-cols-6 gap-4 border-b bg-muted/40 p-4 text-sm font-medium">
              <div>Payment ID</div>
              <div>Date</div>
              <div>Customer</div>
              <div>Method</div>
              <div>Amount</div>
              <div className="text-right">Status</div>
            </div>
            {payments.map((payment, i) => (
              <div
                key={i}
                className={`grid grid-cols-6 gap-4 p-4 text-sm ${i !== payments.length - 1 ? "border-b" : ""}`}
              >
                <div className="font-medium">{payment.id}</div>
                <div>{payment.date}</div>
                <div>{payment.customer}</div>
                <div>{payment.method}</div>
                <div>{payment.amount}</div>
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      payment.status === "completed"
                        ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                        : payment.status === "processing"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                          : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                    }
                  >
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
