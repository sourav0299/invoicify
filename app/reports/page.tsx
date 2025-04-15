"use client"

import {
  type AwaitedReactNode,
  type JSXElementConstructor,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react"
import { ChevronDown, Download, Filter, Search, ChevronRight, Calendar, ArrowRight } from "lucide-react"

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
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

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

  // Summary data
  const summaryData = {
    totalRevenue: 10331.5,
    totalExpenses: 2500.0,
    netProfit: 7831.5,
    pendingAmount: 3450.75,
    paidAmount: 6880.75,
    overdueAmount: 5000.0,
  }

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

  const getStatusBadge = (
    status:
      | string
      | number
      | bigint
      | boolean
      | ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<ReactNode>
      | Promise<AwaitedReactNode>
      | null
      | undefined,
  ) => {
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

  const toggleRowExpansion = (id: string) => {
    if (expandedRow === id) {
      setExpandedRow(null)
    } else {
      setExpandedRow(id)
    }
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
        data = transactions.map((t) => [t.id, t.date, t.party, t.amount, "Bank Transfer", t.status])
        break
      case "item":
        headers = ["Item", "Quantity", "Unit Price", "Total Amount", "Category"]
        data = transactions.map((t) => [t.item, "1", t.amount, t.amount, t.category])
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
    <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="text-sm sm:text-base text-gray-600">An overview of all your transactions over the year.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <div className="flex items-center">
              <Input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full sm:w-[160px] bg-white"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="w-full sm:w-auto justify-center bg-white hover:bg-gray-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards - Mobile View */}
      <div className="sm:hidden mb-3">
        <h2 className="text-base font-medium text-gray-800 mb-2">Financial Summary</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
            <div className="text-sm font-bold text-gray-900 truncate">₹{summaryData.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="text-xs text-gray-500 mb-1">Net Profit</div>
            <div className="text-sm font-bold text-green-600 truncate">₹{summaryData.netProfit.toLocaleString()}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="text-xs text-gray-500 mb-1">Pending</div>
            <div className="text-sm font-bold text-yellow-600 truncate">
              ₹{summaryData.pendingAmount.toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 w-full">
            <div className="text-xs text-gray-500 mb-1">Overdue</div>
            <div className="text-sm font-bold text-red-600 truncate">₹{summaryData.overdueAmount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Mobile Search and Filter Bar */}
      <div className="sm:hidden mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder="Search transactions..." className="pl-10 w-full bg-white" />
          </div>
          <Button
            variant="outline"
            size="icon"
            className={`min-w-[40px] h-10 flex-shrink-0 ${showMobileFilters ? "bg-gray-100" : ""}`}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showMobileFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3 animate-in slide-in-from-top duration-300">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Filter Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Date Range</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">Apply</Button>
                <Button variant="outline" className="flex-1">
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop/Tablet Search and Filter */}
      <div className="hidden sm:flex sm:flex-row items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-medium text-gray-800">Filter by:</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder="Search transactions..." className="pl-10 w-full" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Tabs defaultValue="party" value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tabs with indicator for mobile scrolling */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1 sm:mx-0 sm:px-0">
              <TabsList className="inline-flex min-w-max sm:grid sm:grid-cols-5 mb-3 sm:mb-4 bg-white border border-gray-200">
                <TabsTrigger
                  value="party"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 text-sm"
                >
                  Party
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 text-sm"
                >
                  Payment
                </TabsTrigger>
                <TabsTrigger
                  value="item"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 text-sm"
                >
                  Item
                </TabsTrigger>
                <TabsTrigger
                  value="category"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 text-sm"
                >
                  Category
                </TabsTrigger>
                <TabsTrigger
                  value="summary"
                  className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 text-sm"
                >
                  Summary
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Desktop/Tablet Filter Options */}
          <div className="hidden sm:flex sm:flex-row flex-wrap gap-2 mb-6">
            <div className="w-full sm:w-[180px]">
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

            <div className="w-full sm:w-[180px]">
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

            <div className="flex flex-wrap gap-2 w-full">
              <Button variant="outline" className="flex-1 sm:flex-none">
                Apply Filters
              </Button>
              <Button variant="ghost" className="flex-1 sm:flex-none">
                Clear
              </Button>
            </div>
          </div>

          <TabsContent value="party" className="mt-0">
            <Card>
              <CardContent className="p-0">
                {/* Desktop and Tablet Table View */}
                <div className="hidden sm:block overflow-x-auto">
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
                </div>

                {/* Improved Mobile Card View */}
                <div className="sm:hidden">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`mb-3 rounded-lg overflow-hidden shadow-sm border border-gray-200 ${
                        expandedRow === transaction.id ? "bg-white" : "bg-white"
                      }`}
                    >
                      <div
                        className={`p-3 flex justify-between items-start cursor-pointer ${
                          expandedRow === transaction.id ? "border-b border-gray-100" : ""
                        }`}
                        onClick={() => toggleRowExpansion(transaction.id)}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${
                                transaction.status === "Paid"
                                  ? "bg-green-500"
                                  : transaction.status === "Pending"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            ></div>
                            <div className="font-medium text-gray-900 truncate">{transaction.id}</div>
                          </div>
                          <div className="text-sm font-medium text-gray-800 mt-1 truncate">{transaction.party}</div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{transaction.date}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-1">₹</span>
                            <div className="text-sm font-bold text-gray-900">{transaction.amount.toFixed(2)}</div>
                          </div>
                          <div>{getStatusBadge(transaction.status)}</div>
                          <button
                            className="mt-1 flex items-center justify-center bg-gray-50 rounded-full w-6 h-6"
                            aria-label={expandedRow === transaction.id ? "Collapse details" : "Expand details"}
                          >
                            {expandedRow === transaction.id ? (
                              <ChevronDown className="h-4 w-4 text-gray-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>

                      {expandedRow === transaction.id && (
                        <div className="p-3 bg-gray-50 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white p-2 rounded-md shadow-sm">
                              <div className="text-xs font-medium text-gray-500 mb-1">Category</div>
                              <div className="text-sm font-medium text-gray-900 truncate">{transaction.category}</div>
                            </div>
                            <div className="bg-white p-2 rounded-md shadow-sm">
                              <div className="text-xs font-medium text-gray-500 mb-1">Item</div>
                              <div className="text-sm font-medium text-gray-900 truncate">{transaction.item}</div>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-gray-500">#{transaction.id.split("-")[1]}</div>
                            <Button
                              size="sm"
                              className="flex items-center bg-green-600 hover:bg-green-700 text-xs py-1 h-7"
                            >
                              View Details
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-0">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-medium mb-4">Payment Collection Reports</h3>
                <p className="text-gray-600">Filter and view reports based on payment methods and collection status.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="item" className="mt-0">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-medium mb-4">Item-wise Reports</h3>
                <p className="text-gray-600">View reports categorized by products and services.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="category" className="mt-0">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-medium mb-4">Category Reports</h3>
                <p className="text-gray-600">Analyze transactions by business categories.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="mt-0">
            <Card>
              <CardContent className="p-0">
                {/* Desktop Summary View */}
                <div className="hidden sm:block p-6">
                  <h3 className="text-lg font-medium mb-4">Summary Reports</h3>
                  <p className="text-gray-600 mb-6">
                    Get an overview of your business performance across different time periods.
                  </p>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h4>
                      <p className="text-2xl font-bold text-gray-900">₹{summaryData.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Total Expenses</h4>
                      <p className="text-2xl font-bold text-gray-900">₹{summaryData.totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Net Profit</h4>
                      <p className="text-2xl font-bold text-green-600">₹{summaryData.netProfit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Summary View */}
                <div className="sm:hidden p-3">
                  <h3 className="text-base font-medium mb-3">Summary Reports</h3>

                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-500">Total Revenue</h4>
                        <p className="text-sm font-bold text-gray-900">₹{summaryData.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-500">Total Expenses</h4>
                        <p className="text-sm font-bold text-gray-900">₹{summaryData.totalExpenses.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-500">Net Profit</h4>
                        <p className="text-sm font-bold text-green-600">₹{summaryData.netProfit.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Pending</div>
                        <div className="text-sm font-bold text-yellow-600 truncate">
                          ₹{summaryData.pendingAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Overdue</div>
                        <div className="text-sm font-bold text-red-600 truncate">
                          ₹{summaryData.overdueAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700">Generate Detailed Report</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Improved Mobile Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-3">
        <div className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">Showing 5 of 24 transactions</div>

        <div className="flex items-center gap-1 order-1 sm:order-2 w-full sm:w-auto justify-center sm:justify-end bg-white p-2 rounded-lg shadow-sm border border-gray-200">
          <Button variant="outline" size="sm" disabled className="px-1 sm:px-3 text-xs">
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200 w-7 h-7 p-0">
            1
          </Button>
          <Button variant="outline" size="sm" className="w-7 h-7 p-0">
            2
          </Button>
          <Button variant="outline" size="sm" className="w-7 h-7 p-0">
            3
          </Button>
          <Button variant="outline" size="sm" className="px-1 sm:px-3 text-xs">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
