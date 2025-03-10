"use client"

export function SalesSummaryChart() {
  const data = [
    { month: "Jan", sales: 30000 },
    { month: "Feb", sales: 20000 },
    { month: "Mar", sales: 35000 },
    { month: "Apr", sales: 50000 },
    { month: "May", sales: 25000 },
    { month: "Jun", sales: 40000 },
  ]

  const maxValue = Math.max(...data.map((item) => item.sales))

  return (
    <div className="h-[200px] w-full">
      <div className="flex h-full items-end justify-between gap-2">
        {data.map((item, i) => (
          <div key={i} className="relative flex w-full flex-col items-center">
            <div
              className={`w-full rounded-t-md bg-gradient-to-t from-[#40c79a] to-[#adedd2] ${
                item.sales === 50000
                  ? "after:content-[''] after:absolute after:top-0 after:right-0 after:text-xs after:bg-black after:text-white after:px-1 after:rounded"
                  : ""
              }`}
              style={{ height: `${(item.sales / maxValue) * 100}%` }}
            ></div>
            <span className="mt-2 text-xs text-muted-foreground">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

