import { ArrowUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ExpensesDetailView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Total Expenses (Monthly)</div>
          <div className="text-2xl font-bold">₹18,08,114</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              20%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Fixed Expenses</div>
          <div className="text-2xl font-bold">₹12,45,600</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              5%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Variable Expenses</div>
          <div className="text-2xl font-bold">₹5,62,514</div>
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
        <div className="p-4 border-b">
          <h3 className="font-medium">Expense Categories</h3>
        </div>
        <div className="p-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="h-[250px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Expense Distribution</div>
                  <div className="flex justify-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#40c79a]"></div>
                      <span className="text-xs">Inventory (40%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#9d9dfe]"></div>
                      <span className="text-xs">Salaries (30%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#e1aeda]"></div>
                      <span className="text-xs">Utilities (15%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#ffdf46]"></div>
                      <span className="text-xs">Marketing (15%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Tabs defaultValue="monthly">
                <TabsList className="mb-4">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
                <TabsContent value="monthly">
                  <div className="h-[200px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Monthly Expense Trend</span>
                  </div>
                </TabsContent>
                <TabsContent value="yearly">
                  <div className="h-[200px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Yearly Expense Trend</span>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Recent Expenses</h3>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            This Month
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left text-sm font-medium">Category</th>
                <th className="py-3 text-left text-sm font-medium">Description</th>
                <th className="py-3 text-left text-sm font-medium">Date</th>
                <th className="py-3 text-right text-sm font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                { category: "Inventory", description: "Product Stock Purchase", date: "15/06/24", amount: "₹3,45,000" },
                { category: "Salaries", description: "Staff Payroll", date: "10/06/24", amount: "₹2,80,000" },
                { category: "Marketing", description: "Digital Advertising", date: "08/06/24", amount: "₹1,25,000" },
                { category: "Utilities", description: "Electricity & Internet", date: "05/06/24", amount: "₹45,000" },
              ].map((item, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3 text-sm font-medium">{item.category}</td>
                  <td className="py-3 text-sm">{item.description}</td>
                  <td className="py-3 text-sm">{item.date}</td>
                  <td className="py-3 text-sm text-right">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
