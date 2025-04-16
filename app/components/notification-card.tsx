"use client"

import type React from "react"
import { CheckCircle, AlertTriangle, AlertCircle, FileText } from "lucide-react"

export interface NotificationCardProps {
  type: "low-stock" | "out-of-stock" | "invoice" | "payment"
  title: string
  description: string
  timestamp: string
  read: boolean
  onRead: () => void
}

const NotificationCard: React.FC<NotificationCardProps> = ({ type, title, description, timestamp, read, onRead }) => {
  return (
    <div
      className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer border-l-4 ${
        !read
          ? type === "low-stock"
            ? "border-l-amber-500"
            : type === "out-of-stock"
              ? "border-l-red-500"
              : type === "invoice"
                ? "border-l-green-500"
                : "border-l-blue-500"
          : "border-l-transparent"
      }`}
      onClick={onRead}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 mt-1">
          {type === "low-stock" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
          {type === "out-of-stock" && <AlertCircle className="h-5 w-5 text-red-500" />}
          {type === "invoice" && <FileText className="h-5 w-5 text-green-500" />}
          {type === "payment" && <CheckCircle className="h-5 w-5 text-blue-500" />}
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="text-xs text-gray-500">{timestamp}</p>
          </div>
          <p className="text-xs text-gray-600 mt-1">{description}</p>

          {type === "invoice" && (
            <div className="mt-2">
              <button className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 transition-colors">
                View Invoice
              </button>
            </div>
          )}

          {type === "payment" && (
            <div className="mt-2">
              <button className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors">
                View Receipt
              </button>
            </div>
          )}
        </div>
        {!read && (
          <div className="ml-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationCard
