"use client"

import { useState } from "react"
import { ChevronDown, Download, Eye, Send, X } from "lucide-react"
import Link from "next/link"
import CreateInvoice from "@/components/create-invoice"

export default function InvoicePage() {
  const [showCreateInvoice, setShowCreateInvoice] = useState(false)
  const [activeTab, setActiveTab] = useState("All")
  const [sortBy, setSortBy] = useState("newest first")
  const [activePage, setActivePage] = useState(1)


  const itemsPerPage = 10
  const totalItems = 60 

  const startItem = (activePage - 1) * itemsPerPage + 1
  const endItem = Math.min(activePage * itemsPerPage, totalItems)

  return (
    <div className="bg-universal_white_background min-h-screen">
      {showCreateInvoice ? (
        <CreateInvoice onClose={() => setShowCreateInvoice(false)} />
      ) : (
        <div className="p-6">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-[22px] font-semibold text-business_settings_black_text">Invoice List</h1>
              <p className="text-[14px] text-sidebar_black_text mt-1">
                An Overview of all your transactions over the year.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateInvoice(true)}
                className="px-4 py-2.5 bg-universal_white_background border border-sidebar_gray_border rounded-md text-business_settings_black_text text-[14px] flex items-center gap-2"
              >
                Create New Invoice
              </button>
              <button className="px-4 py-2.5 bg-sidebar_green_button_background text-white rounded-md hover:bg-[#40c79a] transition-colors text-[14px] flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </header>

          <div className="bg-[#fee0e0] rounded-md p-4 mb-6 flex justify-between items-center">
            <div className="text-business_settings_black_text text-[14px]">
              You have <span className="font-semibold">0/50</span> invoices remaining.
            </div>
            <Link href="#" className="text-business_settings_black_text text-[14px] underline font-medium">
              Upgrade your plan to enjoy more benefits.
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-universal_white_background border border-sidebar_gray_border rounded-md p-4 flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#ddebff] flex items-center justify-center mr-3">
                <Send className="h-5 w-5 text-chart-income" />
              </div>
              <div>
                <div className="text-business_settings_black_text text-xl font-semibold">₹23,08,114</div>
                <div className="text-sidebar_black_text text-sm">Sales</div>
                <div className="mt-2">
                  <span className="text-chart-income font-semibold">3843</span> Invoices Sent
                </div>
              </div>
            </div>
            <div className="bg-universal_white_background border border-sidebar_gray_border rounded-md p-4 flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#d3ffe2] flex items-center justify-center mr-3">
                <div className="h-5 w-5 text-chart-profit flex items-center justify-center">
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1 5L5 9L13 1"
                      stroke="#40c79a"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-business_settings_black_text text-xl font-semibold">₹18,08,114</div>
                <div className="text-sidebar_black_text text-sm">Sales</div>
                <div className="mt-2">
                  <span className="text-chart-sales font-semibold">3843</span> Paid Invoices
                </div>
              </div>
            </div>
            <div className="bg-universal_white_background border border-sidebar_gray_border rounded-md p-4 flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#ffefcd] flex items-center justify-center mr-3">
                <div className="h-5 w-5 text-[#d98f07]">⊙</div>
              </div>
              <div>
                <div className="text-business_settings_black_text text-xl font-semibold">₹4,08,114</div>
                <div className="text-sidebar_black_text text-sm">Sales</div>
                <div className="mt-2">
                  <span className="text-[#d98f07] font-semibold">3843</span> Pending Invoices
                </div>
              </div>
            </div>
            <div className="bg-universal_white_background border border-sidebar_gray_border rounded-md p-4 flex items-start">
              <div className="w-10 h-10 rounded-full bg-[#fee0e0] flex items-center justify-center mr-3">
                <X className="h-5 w-5 text-[#e30000]" />
              </div>
              <div>
                <div className="text-business_settings_black_text text-xl font-semibold">₹28,114</div>
                <div className="text-sidebar_black_text text-sm">Sales</div>
                <div className="mt-2">
                  <span className="text-[#e30000] font-semibold">3843</span> Cancelled Invoices
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 border-b border-sidebar_gray_border">
            <div className="flex justify-between items-center">
              <div className="flex flex-nowrap whitespace-nowrap">
                <button
                  onClick={() => setActiveTab("All")}
                  className={`px-6 py-3 text-[14px] ${activeTab === "All" ? "text-sidebar_green_button_background border-b-2 border-sidebar_green_button_background" : "text-sidebar_black_text"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("Sales")}
                  className={`px-6 py-3 text-[14px] ${activeTab === "Sales" ? "text-sidebar_green_button_background border-b-2 border-sidebar_green_button_background" : "text-sidebar_black_text"}`}
                >
                  Sales
                </button>
                <button
                  onClick={() => setActiveTab("Purchases")}
                  className={`px-6 py-3 text-[14px] ${activeTab === "Purchases" ? "text-sidebar_green_button_background border-b-2 border-sidebar_green_button_background" : "text-sidebar_black_text"}`}
                >
                  Purchases
                </button>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-sidebar_black_text pr-4">
                <span>sort by:</span>
                <div className="relative">
                  <button className="flex items-center gap-1">
                    {sortBy}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-sidebar_gray_border">
                  <th className="py-3 px-4 text-left">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-3 h-4 w-4 rounded border-sidebar_gray_border" />
                      <span className="text-[14px] font-medium text-sidebar_black_text">Invoice ID</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-[14px] font-medium text-sidebar_black_text">Invoice Date</th>
                  <th className="py-3 px-4 text-left text-[14px] font-medium text-sidebar_black_text">Payout Date</th>
                  <th className="py-3 px-4 text-left text-[14px] font-medium text-sidebar_black_text">Invoice Type</th>
                  <th className="py-3 px-4 text-left text-[14px] font-medium text-sidebar_black_text">Amount</th>
                  <th className="py-3 px-4 text-left text-[14px] font-medium text-sidebar_black_text">Status</th>
                  <th className="py-3 px-4 text-left text-[14px] font-medium text-sidebar_black_text">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="border-b border-sidebar_gray_border hover:bg-universal_gray_background">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-3 h-4 w-4 rounded border-sidebar_gray_border" />
                        <div>
                          <div className="text-[14px] font-medium text-business_settings_black_text">AS_PUBLISHER</div>
                          <div className="text-[13px] text-sidebar_black_text">A10800120</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[14px] text-business_settings_black_text">12/06/24</td>
                    <td className="py-4 px-4 text-[14px] text-business_settings_black_text">12/06/24</td>
                    <td className="py-4 px-4 text-[14px] text-business_settings_black_text">Proforma</td>
                    <td className="py-4 px-4 text-[14px] text-business_settings_black_text">₹78,00,028</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-change_password_green_background text-chart-profit rounded-full text-[13px]">
                        Paid
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="flex items-center gap-1 text-download_purple_text text-[14px]">
                        <Eye className="h-4 w-4" />
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-[14px] text-sidebar_black_text">
              Showing:{" "}
              <span className="font-medium">
                {startItem}-{endItem}
              </span>{" "}
              of <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => activePage > 1 && setActivePage(activePage - 1)}
                className="w-8 h-8 flex items-center justify-center border border-sidebar_gray_border rounded-md text-sidebar_black_text"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </button>
              {[1, 2, 3, 4, 5, 6].map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setActivePage(pageNumber)}
                  className={`w-8 h-8 flex items-center justify-center border border-sidebar_gray_border rounded-md ${
                    activePage === pageNumber
                      ? "bg-sidebar_green_button_background text-white"
                      : "text-sidebar_black_text"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                onClick={() => activePage < 6 && setActivePage(activePage + 1)}
                className="w-8 h-8 flex items-center justify-center border border-sidebar_gray_border rounded-md text-sidebar_black_text"
              >
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

