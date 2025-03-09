"use client"

export function CashflowChart() {
  return (
    <div className="h-[200px] w-full rounded-md bg-[#f0f1f3] relative">
      {/* Placeholder for chart */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Net Cashflow Chart</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-[#ddf9f9]/50 to-transparent"></div>
    </div>
  )
}

