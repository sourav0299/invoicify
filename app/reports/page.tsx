"use client"

import {
  type AwaitedReactNode,
  type JSXElementConstructor,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
  useState,
  useEffect,
} from "react"
import { ChevronDown, Download, Filter, Search, ChevronRight, Calendar, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useUserCheck } from "@/helper/useUserCheck"

interface Invoice {
  id: string
  billingAddress: string
  brandName: string
  partyContactEmail: string
  partyContactNumber: string
  partyGst: string
  invoiceNumber: string
  billDate: string
  paymentDeadline: string
  totalTax: number
  totalBeforeTax: number
  totalAfterTax: number
  additionalCharges: number
  roundOff: number
  discount: number
  totalPayableAmount: number
  status: string
  createdAt: string
  updatedAt: string
  userId: number
  items: Array<{
    id: string
    invoiceId: string
    itemName: string
    itemType: string
    itemCode: string
    quantity: number
    measuringUnit: string
    unitPrice: number
    tax: number
    beforeTaxAmount: number
    afterTaxAmount: number
  }>
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState("party")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("")
  const [selectedDateRange, setSelectedDateRange] = useState("")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/invoices')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        // Filter only pending invoices
        const pendingInvoices = data.filter((invoice: Invoice) => invoice.status === 'PENDING')
        setInvoices(pendingInvoices)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch invoices')
        console.error('Error fetching invoices:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.items.some(item => item.itemName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Replace the static transactions array with the invoices state
  const transactions = invoices

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
      case "PAID":
        bgColor = "bg-green-100"
        textColor = "text-green-800"
        break
      case "PENDING":
        bgColor = "bg-yellow-100"
        textColor = "text-yellow-800"
        break
      case "OVERDUE":
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
        data = transactions.map((t) => [
          t.id,
          new Date(t.billDate).toLocaleDateString(),
          t.brandName,
          t.totalAfterTax,
          t.status,
          t.items[0]?.itemType || 'N/A',
          t.items[0]?.itemName || 'N/A'
        ])
        break
      case "payment":
        headers = ["Invoice ID", "Date", "Party", "Amount", "Payment Method", "Status"]
        data = transactions.map((t) => [
          t.id,
          new Date(t.billDate).toLocaleDateString(),
          t.brandName,
          t.totalAfterTax,
          "Bank Transfer",
          t.status
        ])
        break
      case "item":
        headers = ["Item", "Quantity", "Unit Price", "Total Amount", "Category"]
        data = transactions.map((t) => [
          t.items[0]?.itemName || 'N/A',
          t.items[0]?.quantity || 0,
          t.items[0]?.unitPrice || 0,
          t.totalAfterTax,
          t.items[0]?.itemType || 'N/A'
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
        data = transactions.map((t) => [
          t.id,
          new Date(t.billDate).toLocaleDateString(),
          t.brandName,
          t.totalAfterTax,
          t.status,
          t.items[0]?.itemType || 'N/A',
          t.items[0]?.itemName || 'N/A'
        ])
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

  useUserCheck()

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Pending Invoices</h1>
          <p className="text-sm sm:text-base text-gray-600">Overview of all pending transactions</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
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
            <Input 
              placeholder="Search invoices..." 
              className="pl-10 w-full bg-white" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
      </div>

      {/* Desktop/Tablet Search and Filter */}
      <div className="hidden sm:flex sm:flex-row items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-medium text-gray-800">Filter by:</h2>
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search invoices..." 
              className="pl-10 w-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Tabs defaultValue="party" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1 sm:mx-0 sm:px-0">
            </div>
          </div>

          <TabsContent value="party" className="mt-0">
            <Card className="border-1 rounded-sm shadow-sm px-5">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-red-500 text-center">
                      <p className="text-lg font-medium">Error loading invoices</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Desktop and Tablet Table View */}
                    <div className="hidden sm:block overflow-x-auto py-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice Number</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Party</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Category</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredInvoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                              <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                              <TableCell>{new Date(invoice.billDate).toLocaleDateString()}</TableCell>
                              <TableCell>{invoice.brandName}</TableCell>
                              <TableCell>₹{invoice.totalAfterTax}</TableCell>
                              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                              <TableCell>{invoice.items[0]?.itemType || 'N/A'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden">
                      {filteredInvoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="mb-3 rounded-sm overflow-hidden border border-gray-200 bg-white"
                        >
                          <div
                            className={`p-3 flex justify-between items-start cursor-pointer ${
                              expandedRow === invoice.id ? "border-b border-gray-100" : ""
                            }`}
                            onClick={() => toggleRowExpansion(invoice.id)}
                          >
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full mr-2 flex-shrink-0 bg-yellow-500"></div>
                                <div className="font-medium text-gray-900 truncate">{invoice.invoiceNumber}</div>
                              </div>
                              <div className="text-sm font-medium text-gray-800 mt-1 truncate">{invoice.brandName}</div>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{new Date(invoice.billDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <div className="flex items-center">
                                <span className="text-gray-500 mr-1">₹</span>
                                <div className="text-sm font-bold text-gray-900">{invoice.totalAfterTax}</div>
                              </div>
                              <div>{getStatusBadge(invoice.status)}</div>
                              <button
                                className="mt-1 flex items-center justify-center bg-gray-50 rounded-full w-6 h-6"
                                aria-label={expandedRow === invoice.id ? "Collapse details" : "Expand details"}
                              >
                                {expandedRow === invoice.id ? (
                                  <ChevronDown className="h-4 w-4 text-gray-600" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-600" />
                                )}
                              </button>
                            </div>
                          </div>

                          {expandedRow === invoice.id && (
                            <div className="p-3 bg-gray-50 border-t border-gray-100">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white p-2 rounded-md shadow-sm">
                                  <div className="text-xs font-medium text-gray-500 mb-1">Category</div>
                                  <div className="text-sm font-medium text-gray-900 truncate">{invoice.items[0]?.itemType || 'N/A'}</div>
                                </div>
                                <div className="bg-white p-2 rounded-md shadow-sm">
                                  <div className="text-xs font-medium text-gray-500 mb-1">Item</div>
                                  <div className="text-sm font-medium text-gray-900 truncate">{invoice.items[0]?.itemName || 'N/A'}</div>
                                </div>
                              </div>

                              <div className="mt-3 flex items-center justify-between">
                                <div className="text-xs text-gray-500">#{invoice.id}</div>
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
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 sm:mt-6">
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Showing <span className="font-medium">{filteredInvoices.length}</span> pending{" "}
          <span className="font-medium">invoices</span>
        </div>
      </div>
    </div>
  )
}
