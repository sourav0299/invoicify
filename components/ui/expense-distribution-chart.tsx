"use client"

export function ExpenseDistributionChart() {
  return (
    <div className="relative h-[150px] w-[150px] mx-auto">
      <svg viewBox="0 0 100 100" className="h-full w-full transform -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#40c79a"
          strokeWidth="20"
          strokeDasharray="188.5 251.3"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#9d9dfe"
          strokeWidth="20"
          strokeDasharray="71.5 251.3"
          transform="rotate(270 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#e1aeda"
          strokeWidth="20"
          strokeDasharray="25.5 251.3"
          transform="rotate(198 50 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#ffdf46"
          strokeWidth="20"
          strokeDasharray="54.8 251.3"
          transform="rotate(150 50 50)"
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-white"
        style={{ margin: "25px" }}
      >
        <span className="text-xs text-muted-foreground">Total Expenses</span>
        <span className="text-lg font-bold">₹1.20 L</span>
      </div>
    </div>
  )
}

