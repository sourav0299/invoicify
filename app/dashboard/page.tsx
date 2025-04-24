"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Eye, X, FileDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesSummaryChart } from "@/components/ui/sales-summary-chart"
import { CashflowChart } from "@/components/ui/cashflow-char"
import { SalesDetailView } from "@/components/sales-detail-view"
import { ExpensesDetailView } from "@/components/expenses-detail-view"
import { PaymentsDetailView } from "@/components/payments-detail-view"
import { useRouter } from "next/navigation"
import { useUserCheck } from "@/helper/useUserCheck"
import { useUser } from "@clerk/nextjs"
import InvoiceModal from "@/components/invoice-modal"

type DetailViewType = "sales" | "expenses" | "payments" | null

interface Invoice {
  id: string
  invoiceNumber: string
  billDate: string
  paymentDeadline: string
  billingAddress: string
  brandName: string
  partyContactEmail: string
  partyContactNumber: string
  partyGst: string
  items: Array<{
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
  totalTax: number
  totalBeforeTax: number
  totalAfterTax: number
  additionalCharges: number
  roundOff: number
  discount: number
  totalPayableAmount: number
  status: string
}

// async function checkUser() {
//   try {
//     const response = await fetch("/api/middleware/check-user", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     })

//     const data = await response.json()

//     if (!response.ok) {
//       return {
//         error: data.error,
//         status: response.status,
//       }
//     }

//     return {
//       user: data.user,
//       message: data.message,
//     }
//   } catch (error) {
//     return {
//       error: "Connection failed",
//       status: 500,
//     }
//   }
// }

export default function DashboardPage() {
  const [activeDetailView, setActiveDetailView] = useState<DetailViewType>(null)
  const [showFullView, setShowFullView] = useState<DetailViewType>(null)
  const [pendingInvoices, setPendingInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const router = useRouter()
  const { user } = useUser()

  const handleCardClick = (view: DetailViewType) => {
    setShowFullView(view)
  }

  const closeDetailView = () => {
    setActiveDetailView(null)
  }

  const backToDashboard = () => {
    setShowFullView(null)
  }

  // Net profit chart data
  const netProfitData = [
    { name: "Income", value: 2300000000, color: "#3a8bff" },
    { name: "Expenses", value: 1800000000, color: "#c369b7" },
    { name: "Profit", value: 500000000, color: "#40c79a" },
  ]

  useUserCheck()

  useEffect(() => {
    const fetchPendingInvoices = async () => {
      try {
        const response = await fetch("/api/invoices")
        if (!response.ok) {
          throw new Error("Failed to fetch invoices")
        }
        const data = await response.json()
        // Filter for pending invoices only
        const pending = data.filter((invoice: Invoice) => invoice.status === "PENDING")
        setPendingInvoices(pending)
      } catch (error) {
        console.error("Error fetching pending invoices:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPendingInvoices()
  }, [])

  // useEffect(() => {
  //   const verifyUser = async () => {
  //     try {
  //       const result = await checkUser()

  //       if (result.error) {
  //         switch (result.status) {
  //           case 401:
  //             router.push("/login")
  //             break
  //           case 404:
  //             router.push("/sync-user")
  //             break
  //           default:
  //             router.push("/sync-user")
  //             break
  //         }
  //         return
  //       }
  //     } catch (error) {
  //       console.error("Verification error:", error)
  //       router.push("/error")
  //     }
  //   }

  //   verifyUser()
  // }, [router])

  // Add these functions for modal handling
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowPdfPreview(false)
    setShowInvoiceModal(true)
  }

  const handlePdfPreview = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowPdfPreview(true)
    setShowInvoiceModal(true)
  }

  const closeInvoiceModal = () => {
    setShowInvoiceModal(false)
    setSelectedInvoice(null)
    setShowPdfPreview(false)
  }

  // If showFullView is set, render only the corresponding detail view
  if (showFullView) {
    return (
      <div className="flex-1 space-y-4 p-3 sm:p-6 md:p-8 bg-[#FAFAFA]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={backToDashboard}>
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-semibold">
              {showFullView === "sales" && "Sales Details"}
              {showFullView === "expenses" && "Expenses Details"}
              {showFullView === "payments" && "Payment Details"}
            </h1>
          </div>
          <Button className="bg-[#1eb386] hover:bg-[#1eb386]/90 text-white w-full sm:w-auto">
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Create New Invoice
          </Button>
        </div>
        {showFullView === "sales" && <SalesDetailView />}
        {showFullView === "expenses" && <ExpensesDetailView />}
        {showFullView === "payments" && <PaymentsDetailView />}
      </div>
    )
  }

  // Otherwise, render the regular dashboard
  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-3 sm:p-6 md:p-8 bg-[#FAFAFA] pb-16 sm:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold">Hi {user?.firstName || "there"},</h1>
        <Button
          onClick={() => router.push("/invoice-management")}
          className="bg-[#1eb386] hover:bg-[#1eb386]/90 text-white w-full sm:w-auto"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Create New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card
          className={`overflow-hidden shadow-sm cursor-pointer transition-all ${activeDetailView === "sales" ? "ring-2 ring-[#3a8bff]" : "hover:shadow-md"}`}
          onClick={() => handleCardClick("sales")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            <div className="rounded-full bg-blue-100 p-2">
              <svg
                className="h-4 w-4 text-blue-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m16 8-4 4-4-4" />
                <path d="M12 16V8" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">₹23,08,114</div>
            <div className="flex items-center pt-1">
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="mr-1 h-3 w-3" />
                20%
              </div>
              <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`overflow-hidden shadow-sm cursor-pointer transition-all ${activeDetailView === "expenses" ? "ring-2 ring-[#3a8bff]" : "hover:shadow-md"}`}
          onClick={() => handleCardClick("expenses")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <div className="rounded-full bg-purple-100 p-2">
              <svg
                className="h-4 w-4 text-purple-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect height="18" rx="2" width="18" x="3" y="3" />
                <path d="M7 7h10" />
                <path d="M7 12h10" />
                <path d="M7 17h10" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">₹18,08,114</div>
            <div className="flex items-center pt-1">
              <div className="flex items-center text-xs text-green-600">
                <ArrowUp className="mr-1 h-3 w-3" />
                20%
              </div>
              <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`overflow-hidden shadow-sm cursor-pointer transition-all ${activeDetailView === "payments" ? "ring-2 ring-[#3a8bff]" : "hover:shadow-md"}`}
          onClick={() => handleCardClick("payments")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payment Received</CardTitle>
            <div className="rounded-full bg-pink-100 p-2">
              <svg
                className="h-4 w-4 text-pink-500"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">₹28,114</div>
            <div className="flex items-center pt-1">
              <div className="flex items-center text-xs text-red-600">
                <ArrowDown className="mr-1 h-3 w-3" />
                3%
              </div>
              <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail View Section - Shows when a card is clicked */}
      {activeDetailView && (
        <Card className="shadow-sm border-t-4 border-t-[#3a8bff] animate-in fade-in duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>
              {activeDetailView === "expenses" && "Expenses Details"}
              {activeDetailView === "payments" && "Payment Details"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={closeDetailView}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          <CardContent>
            {activeDetailView === "expenses" && <ExpensesDetailView />}
            {activeDetailView === "payments" && <PaymentsDetailView />}
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Net Cashflow Chart */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2">
            <CardTitle>Net Cashflow</CardTitle>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-xs">Inflow</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-3 w-3 rounded-full bg-green-300"></div>
                <span className="text-xs">Outflow</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="yearly">
              <TabsList className="mb-4 w-full overflow-x-auto flex-nowrap">
                <TabsTrigger value="daily" className="flex-1">
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly" className="flex-1">
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="monthly" className="flex-1">
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="yearly" className="flex-1">
                  Yearly
                </TabsTrigger>
              </TabsList>
              <TabsContent value="yearly">
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[500px]">
                    <CashflowChart />
                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="monthly">
                <div className="h-[200px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Monthly Chart</span>
                </div>
              </TabsContent>
              <TabsContent value="weekly">
                <div className="h-[200px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Weekly Chart</span>
                </div>
              </TabsContent>
              <TabsContent value="daily">
                <div className="h-[200px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Daily Chart</span>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Sales Summary */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2">
            <CardTitle>Sales Summary</CardTitle>
            <Button variant="outline" size="sm" className="h-8 gap-1 mt-2 sm:mt-0">
              Jan -Jun 2024
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-hidden">
              <div className="w-full h-[200px] sm:h-[220px]">
                <SalesSummaryChart />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - First Row */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 auto-rows-auto">
        {/* Expense Distribution */}
        {/* <Card className="shadow-sm h-auto">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex justify-center">
              <ExpenseDistributionChart />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-[#40c79a]"></div>
                <span>Inventory</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-[#9d9dfe]"></div>
                <span>Salaries</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-[#e1aeda]"></div>
                <span>Utilities</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-[#ffdf46]"></div>
                <span>Marketing/Ads</span>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Net Profit - Updated with RadialChart */}
        {/* <Card className="shadow-sm h-auto">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2">
            <CardTitle>Net Profit</CardTitle>
            <Button variant="outline" size="sm" className="h-8 gap-1 mt-2 sm:mt-0">
              This Year
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-lg sm:text-2xl font-bold mb-4 text-center">₹22,18,508,114</div>
            <div className="relative h-[120px] w-full">
              <RadialChart data={netProfitData} innerRadius={25} outerRadius={60} height={120} />
            </div>
            <div className="mt-4 flex w-full justify-around text-xs gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-[#3a8bff]"></div>
                <span>Income</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-[#c369b7]"></div>
                <span>Expenses</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-[#40c79a]"></div>
                <span>Profit</span>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Top Performers */}
        <Card className="shadow-sm h-auto w-full">
          <CardHeader className="pb-2">
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {[
              {
                id: 1,
                name: "Blue Vintage Lantern",
                code: "0178922",
                amount: "1,24,000",
                revenue: "21",
                progress: 70,
              },
              { id: 2, name: "Item Name", code: "Item Code", amount: "0,00,000", revenue: "21", progress: 60 },
              { id: 3, name: "Item Name", code: "Item Code", amount: "0,00,000", revenue: "21", progress: 50 },
            ].map((item) => (
              <div key={item.id} className="flex items-start gap-2 w-full">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    item.id === 1 ? "bg-[#D8F6E5] text-[#1eb386]" : "bg-[#DDEBFF] text-[#3a8bff]"
                  } text-sm font-medium`}
                >
                  {item.id}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.code}</p>
                    </div>
                    <div className="sm:text-right mt-1 sm:mt-0">
                      <p className="text-sm font-medium">₹{item.amount}</p>
                      <p className="text-xs text-green-600">{item.revenue}% Revenue</p>
                    </div>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#F7F7F7]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#77deb8] to-[#40c79a]"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="md:col-span-1 w-full">
          <Card className="shadow-sm w-full">
            <CardHeader className="pb-2">
              <CardTitle>Top Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 1, name: "AS_Publisher", invoices: "36", amount: "1,24,000", revenue: "29", progress: 80 },
                { id: 2, name: "Party Name", invoices: "00", amount: "0,00,000", revenue: "17", progress: 50 },
                { id: 3, name: "Party Name", invoices: "00", amount: "0,00,000", revenue: "08", progress: 30 },
              ].map((item) => (
                <div key={item.id} className="flex items-start gap-2 w-full">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      item.id === 1 ? "bg-[#D8F6E5] text-[#1eb386]" : "bg-[#DDEBFF] text-[#3a8bff]"
                    } text-sm font-medium`}
                  >
                    {item.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.invoices} Invoices</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-sm font-medium">₹{item.amount}</p>
                        <p className="text-xs text-green-600">{item.revenue}% Revenue</p>
                      </div>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#F7F7F7]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#77deb8] to-[#3a8bff]"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3 ">
        <div className="md:col-span-3">
          <Card className="shadow-sm ">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 ">
              <CardTitle>Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-100 overflow-hidden">
                <div className="w-full">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        <th className="py-3 pl-4 sm:pl-6 text-left text-xs sm:text-sm font-medium w-8 sm:w-12"></th>
                        <th className="py-3 text-left text-xs sm:text-sm font-medium">Invoice ID</th>
                        <th className="py-3 text-left text-xs sm:text-sm font-medium hidden sm:table-cell">
                          Invoice Date
                        </th>
                        <th className="py-3 text-left text-xs sm:text-sm font-medium">Amount</th>
                        <th className="py-3 px-4 sm:pr-6 text-right text-xs sm:text-sm font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                            Loading invoices...
                          </td>
                        </tr>
                      ) : pendingInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                            No pending invoices found
                          </td>
                        </tr>
                      ) : (
                        pendingInvoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b last:border-0">
                            <td className="py-3 pl-4 sm:pl-6">
                              <div className="h-3 w-3 sm:h-4 sm:w-4 rounded border border-gray-300"></div>
                            </td>
                            <td className="py-3 text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-none">
                              {invoice.invoiceNumber}
                              <div className="text-xs text-muted-foreground sm:hidden">
                                {new Date(invoice.billDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="py-3 text-xs sm:text-sm hidden sm:table-cell">
                              {new Date(invoice.billDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 text-xs sm:text-sm">
                              ₹{invoice.totalPayableAmount.toLocaleString("en-IN")}
                            </td>
                            <td className="py-3 pr-4 sm:pr-6 text-right">
                              <div className="flex gap-1 sm:gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 sm:h-8 px-2 sm:px-3 text-[#3a8bff]"
                                  onClick={() => handleViewInvoice(invoice)}
                                >
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline ml-1">View</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 sm:h-8 px-2 sm:px-3 text-[#3a8bff]"
                                  onClick={() => handlePdfPreview(invoice)}
                                >
                                  <FileDown className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="hidden sm:inline ml-1">PDF</span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      {selectedInvoice && (
        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={closeInvoiceModal}
          invoice={selectedInvoice}
          showPdfPreview={showPdfPreview}
        />
      )}
    </div>
  )
}
