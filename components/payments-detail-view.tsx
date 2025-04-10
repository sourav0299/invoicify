import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export function PaymentsDetailView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Payment Received (Monthly)</div>
          <div className="text-2xl font-bold">₹28,114</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-red-600">
              <ArrowDown className="mr-1 h-3 w-3" />
              3%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Outstanding Payments</div>
          <div className="text-2xl font-bold">₹1,86,400</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-red-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              12%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border">
          <div className="text-sm text-muted-foreground mb-1">Collection Rate</div>
          <div className="text-2xl font-bold">78%</div>
          <div className="flex items-center pt-1">
            <div className="flex items-center text-xs text-red-600">
              <ArrowDown className="mr-1 h-3 w-3" />
              5%
            </div>
            <span className="ml-2 text-xs text-muted-foreground">Than Last Month</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-medium">Payment Timeline</h3>
        </div>
        <div className="p-4">
          <Tabs defaultValue="monthly">
            <TabsList className="mb-4">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <div className="h-[250px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Monthly Payment Trend</div>
                  <div className="flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#3a8bff]"></div>
                      <span className="text-xs">Received</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#e0e2e7]"></div>
                      <span className="text-xs">Outstanding</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="weekly">
              <div className="h-[250px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Weekly Payment Trend</span>
              </div>
            </TabsContent>
            <TabsContent value="quarterly">
              <div className="h-[250px] w-full rounded-md bg-[#f0f1f3] flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Quarterly Payment Trend</span>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-medium">Payment Status by Client</h3>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            This Month
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {[
              { client: "AS_Publisher", paid: 78000, total: 100000, percentage: 78 },
              { client: "TechSolutions Inc", paid: 45000, total: 50000, percentage: 90 },
              { client: "Global Enterprises", paid: 30000, total: 60000, percentage: 50 },
              { client: "Innovative Designs", paid: 15000, total: 40000, percentage: 37.5 },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{item.client}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{item.paid.toLocaleString()} / ₹{item.total.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm font-medium">{item.percentage}%</div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
