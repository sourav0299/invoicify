import { ArrowUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SalesDetailView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Total Sales (Monthly)</div>
          <div className="text-2xl font-bold">₹23,08,114</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              20%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Average Sale Value</div>
          <div className="text-2xl font-bold">₹64,114</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              12%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Total Transactions</div>
          <div className="text-2xl font-bold">36</div>
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
        <div className="p-4 border-b">
          <h3 className="font-medium">Sales Breakdown</h3>
        </div>
        <div className="p-4">
          <Tabs defaultValue="monthly">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <div className="h-[300px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Monthly Sales Chart</div>
                  <div className="flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#3a8bff]"></div>
                      <span className="text-xs">Current Month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#e0e2e7]"></div>
                      <span className="text-xs">Previous Month</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="weekly">
              <div className="h-[300px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Weekly Sales Chart</span>
              </div>
            </TabsContent>
            <TabsContent value="daily">
              <div className="h-[300px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Daily Sales Chart</span>
              </div>
            </TabsContent>
            <TabsContent value="yearly">
              <div className="h-[300px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Yearly Sales Chart</span>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Top Selling Products</h3>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            This Month
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
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
              {[
                { product: "Blue Vintage Lantern", units: "42", revenue: "₹5,24,000", growth: "+18%" },
                { product: "Modern Desk Lamp", units: "36", revenue: "₹3,86,400", growth: "+12%" },
                { product: "Ceramic Vase Set", units: "28", revenue: "₹2,94,000", growth: "+8%" },
                { product: "Wooden Wall Clock", units: "24", revenue: "₹1,92,000", growth: "+5%" },
              ].map((item, i) => (
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
  )
}
