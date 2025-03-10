"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const handleClick = () => {
      if (onCheckedChange) {
        onCheckedChange(!checked)
      }
    }

    return (
      <div className="flex items-center">
        <div
          className={cn(
            "h-4 w-4 rounded border border-gray-300 flex items-center justify-center cursor-pointer",
            checked ? "bg-teal-500 border-transparent" : "bg-white",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500",
            className,
          )}
          onClick={handleClick}
        >
          {checked && <Check className="h-3 w-3 text-white" />}
        </div>
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
      </div>
    )
  },
)

Checkbox.displayName = "Checkbox"

export { Checkbox }

