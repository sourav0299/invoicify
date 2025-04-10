"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Eye, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SalesSummaryChart } from "@/components/ui/sales-summary-chart"
import { CashflowChart } from "@/components/ui/cashflow-char" // Fixed typo in import
import { ExpenseDistributionChart } from "@/components/ui/expense-distribution-chart"
import { SalesDetailView } from "@/components/sales-detail-view"
import { ExpensesDetailView } from "@/components/expenses-detail-view"
import { PaymentsDetailView } from "@/components/payments-detail-view"
import { useRouter } from "next/navigation"

type DetailViewType = "sales" | "expenses" | "payments" | null

// Moved checkUser function outside of component
async function checkUser() {
  try {
    const response = await fetch("/api/middleware/check-user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      console.log("something is wrong")
    }
    return response.json()
  } catch (error) {
    return null
  }
}

export default function DashboardPage() {
  const [activeDetailView, setActiveDetailView] = useState<DetailViewType>(null)
  const router = useRouter()

  const handleCardClick = (view: DetailViewType) => {
    setActiveDetailView(view === activeDetailView ? null : view)
  }

  const closeDetailView = () => {
    setActiveDetailView(null)
  }

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const userVerification = await checkUser()
        if (!userVerification || userVerification.error) {
          router.push("/sync-user")
        }
      } catch (error) {
        router.push("/sync-user")
      }
    }

    verifyUser()
  }, [router])

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 bg-[#FAFAFA]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Hi Minesh,</h1>
        <Button className="bg-[#1eb386] hover:bg-[#1eb386]/90 text-white">
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
      <div className="grid gap-6 md:grid-cols-3">
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
            <div className="text-2xl font-bold">₹23,08,114</div>
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
            <div className="text-2xl font-bold">₹18,08,114</div>
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
            <div className="text-2xl font-bold">₹28,114</div>
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
              {activeDetailView === "sales" && "Sales Details"}
              {activeDetailView === "expenses" && "Expenses Details"}
              {activeDetailView === "payments" && "Payment Details"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={closeDetailView}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </CardHeader>
          <CardContent>
            {activeDetailView === "sales" && <SalesDetailView />}
            {activeDetailView === "expenses" && <ExpensesDetailView />}
            {activeDetailView === "payments" && <PaymentsDetailView />}
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Net Cashflow Chart */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Net Cashflow</CardTitle>
            <div className="flex items-center space-x-2">
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
              <TabsList className="mb-4">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
              <TabsContent value="yearly">
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
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Sales Summary</CardTitle>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              Jan -Jun 2024
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <SalesSummaryChart />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid - First Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Expense Distribution */}
        <Card className="shadow-sm h-[280px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-56px)] flex flex-col justify-center">
            <ExpenseDistributionChart />
            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
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
        </Card>

        {/* Net Profit */}
        <Card className="shadow-sm h-[280px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Net Profit</CardTitle>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              This Year
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="h-[calc(100%-56px)] flex flex-col items-center justify-center">
            <div className="text-2xl font-bold mb-4">₹22,18,508,114</div>
            <div className="relative h-[120px] w-[120px]">
              <svg viewBox="0 0 100 100" className="h-full w-full transform -rotate-90">
                <circle cx="50" cy="50" r="45" fill="transparent" stroke="#e0e2e7" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#3a8bff"
                  strokeWidth="8"
                  strokeDasharray="220 283"
                />
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="#e0e2e7" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#c369b7"
                  strokeWidth="8"
                  strokeDasharray="180 220"
                />
                <circle cx="50" cy="50" r="25" fill="transparent" stroke="#e0e2e7" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="25"
                  fill="transparent"
                  stroke="#40c79a"
                  strokeWidth="8"
                  strokeDasharray="140 157"
                />
              </svg>
            </div>
            <div className="mt-4 flex w-full justify-between text-xs">
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
        </Card>

        {/* Top Performers */}
        <Card className="shadow-sm h-[280px]">
          <CardHeader className="pb-2">
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100%-56px)] flex flex-col justify-center space-y-4">
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
              <div key={item.id} className="flex items-start gap-3">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    item.id === 1 ? "bg-[#D8F6E5] text-[#1eb386]" : "bg-[#DDEBFF] text-[#3a8bff]"
                  } text-sm font-medium`}
                >
                  {item.id}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.code}</p>
                    </div>
                    <div className="text-right">
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
      </div>

      {/* Main Content Grid - Second Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Pending Invoices - Takes 2 columns */}
        <div className="md:col-span-2">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Pending Invoices</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-[#3a8bff]">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="py-3 pl-6 text-left text-sm font-medium w-12"></th>
                      <th className="py-3 text-left text-sm font-medium">Invoice ID</th>
                      <th className="py-3 text-left text-sm font-medium">Invoice Date</th>
                      <th className="py-3 text-left text-sm font-medium">Amount</th>
                      <th className="py-3 pr-6 text-right text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((_, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3 pl-6">
                          <div className="h-4 w-4 rounded border border-gray-300"></div>
                        </td>
                        <td className="py-3 text-sm font-medium">AS_PUBLISHER</td>
                        <td className="py-3 text-sm">12/06/24</td>
                        <td className="py-3 text-sm">₹78,00,028</td>
                        <td className="py-3 pr-6 text-right">
                          <Button variant="outline" size="sm" className="h-8 gap-1 text-[#3a8bff]">
                            <Eye className="h-4 w-4" />
                            View Invoice
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Parties */}
        <div className="md:col-span-1">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Top Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 1, name: "AS_Publisher", invoices: "36", amount: "1,24,000", revenue: "29", progress: 80 },
                { id: 2, name: "Party Name", invoices: "00", amount: "0,00,000", revenue: "17", progress: 50 },
                { id: 3, name: "Party Name", invoices: "00", amount: "0,00,000", revenue: "08", progress: 30 },
              ].map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      item.id === 1 ? "bg-[#D8F6E5] text-[#1eb386]" : "bg-[#DDEBFF] text-[#3a8bff]"
                    } text-sm font-medium`}
                  >
                    {item.id}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.invoices} Invoices</p>
                      </div>
                      <div className="text-right">
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
    </div>
  )
}
