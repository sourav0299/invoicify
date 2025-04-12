"use client"

import { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode, SetStateAction, useState } from "react"
import { ChevronDown, Download, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Reports() {
  const [activeTab, setActiveTab] = useState("party")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState("")

  // Sample data for reports
  const transactions = [
    {
      id: "INV-001",
      date: "2023-04-10",
      party: "Acme Corp",
      amount: 1250.0,
      status: "Paid",
      category: "Sales",
      item: "Consulting Services",
    },
    {
      id: "INV-002",
      date: "2023-04-08",
      party: "TechGiant Inc",
      amount: 3450.75,
      status: "Pending",
      category: "Services",
      item: "Web Development",
    },
    {
      id: "INV-003",
      date: "2023-04-05",
      party: "Local Shop",
      amount: 450.25,
      status: "Paid",
      category: "Supplies",
      item: "Office Materials",
    },
    {
      id: "INV-004",
      date: "2023-04-01",
      party: "Global Partners",
      amount: 5000.0,
      status: "Overdue",
      category: "Consulting",
      item: "Strategic Planning",
    },
    {
      id: "INV-005",
      date: "2023-03-28",
      party: "City Services",
      amount: 180.5,
      status: "Paid",
      category: "Utilities",
      item: "Electricity Bill",
    },
  ]

  // Filter options based on active tab
  const getFilterOptions = () => {
    switch (activeTab) {
      case "party":
        return ["All Parties", "Customers", "Vendors", "Employees", "Others"]
      case "payment":
        return ["All Payments", "Cash", "Bank Transfer", "Credit Card", "UPI", "Check"]
      case "item":
        return ["All Items", "Products", "Services", "Subscriptions"]
      case "category":
        return ["All Categories", "Sales", "Purchases", "Expenses", "Utilities"]
      case "summary":
        return ["Daily", "Weekly", "Monthly", "Quarterly", "Yearly"]
      default:
        return []
    }
  }

  const getStatusBadge = (status: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => {
    let bgColor = "bg-gray-100"
    let textColor = "text-gray-800"

    switch (status) {
      case "Paid":
        bgColor = "bg-green-100"
        textColor = "text-green-800"
        break
      case "Pending":
        bgColor = "bg-yellow-100"
        textColor = "text-yellow-800"
        break
      case "Overdue":
        bgColor = "bg-red-100"
        textColor = "text-red-800"
        break
    }

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>{status}</span>
  }

  const handleFilterChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSelectedFilter(e.target.value)
  }

  const handleDateRangeChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSelectedDateRange(e.target.value)
  }

  const handleDateChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSelectedDate(e.target.value)
  }


  const exportToCSV = () => {
    
    const date = new Date()
    const formattedDate = date.toISOString().split("T")[0]

   
    let headers = []
    let data = []

    switch (activeTab) {
      case "party":
        headers = ["Invoice ID", "Date", "Party", "Amount", "Status", "Category", "Item"]
        data = transactions.map((t) => [t.id, t.date, t.party, t.amount, t.status, t.category, t.item])
        break
      case "payment":
        
        headers = ["Invoice ID", "Date", "Party", "Amount", "Payment Method", "Status"]
        data = transactions.map((t) => [
          t.id,
          t.date,
          t.party,
          t.amount,
          "Bank Transfer", 
          t.status,
        ])
        break
      case "item":
        
        headers = ["Item", "Quantity", "Unit Price", "Total Amount", "Category"]
        data = transactions.map((t) => [
          t.item,
          "1", 
          t.amount,
          t.amount,
          t.category,
        ])
        break
      case "category":
        
        headers = ["Category", "Total Amount", "Number of Transactions"]
        data = [
          ["Sales", "4700.75", "2"],
          ["Supplies", "450.25", "1"],
          ["Consulting", "5000.00", "1"],
          ["Utilities", "180.50", "1"],
        ]
        break
      case "summary":
        // Add summary-specific data here
        headers = ["Period", "Total Revenue", "Total Expenses", "Net Profit"]
        data = [
          ["Jan 2023", "8500.00", "2300.00", "6200.00"],
          ["Feb 2023", "7200.00", "1800.00", "5400.00"],
          ["Mar 2023", "9100.00", "2500.00", "6600.00"],
          ["Apr 2023", "10200.00", "2700.00", "7500.00"],
        ]
        break
      default:
        headers = ["Invoice ID", "Date", "Party", "Amount", "Status", "Category", "Item"]
        data = transactions.map((t) => [t.id, t.date, t.party, t.amount, t.status, t.category, t.item])
    }

    const csvContent = [headers.join(","), ...data.map((row) => row.join(","))].join("\n")

   
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

    
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `${activeTab}_report_${formattedDate}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="text-gray-600">An overview of all your transactions over the year.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input type="date" value={selectedDate} onChange={handleDateChange} className="w-[160px]" />
          </div>
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">Filter by:</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Search transactions..." className="pl-8 max-w-xs" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="party" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="party">Party</TabsTrigger>
            <TabsTrigger value="payment">Payment Collection</TabsTrigger>
            <TabsTrigger value="item">Item</TabsTrigger>
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="w-[180px]">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedFilter}
                onChange={handleFilterChange}
              >
                <option value="" disabled>
                  Select filter
                </option>
                {getFilterOptions().map((option, index) => (
                  <option key={index} value={option.toLowerCase().replace(/\s+/g, "-")}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-[180px]">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedDateRange}
                onChange={handleDateRangeChange}
              >
                <option value="" disabled>
                  Date range
                </option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <Button variant="outline">Apply Filters</Button>
            <Button variant="ghost">Clear</Button>
          </div>

          
          <TabsContent value="party" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Party</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.party}</TableCell>
                        <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>
                          <div className="relative inline-block text-left">
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Payment Collection Reports</h3>
                <p className="text-gray-600">Filter and view reports based on payment methods and collection status.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="item" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Item-wise Reports</h3>
                <p className="text-gray-600">View reports categorized by products and services.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="category" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Category Reports</h3>
                <p className="text-gray-600">Analyze transactions by business categories.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Summary Reports</h3>
                <p className="text-gray-600">
                  Get an overview of your business performance across different time periods.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">Showing 5 of 24 transactions</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-100">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
