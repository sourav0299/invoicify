"use client"

import { useState } from "react"
import { ChevronDown, Eye } from "lucide-react"
import Link from "next/link"
import CreateInvoice from "@/components/create-invoice"

export default function InvoicePage() {
  const [showCreateInvoice, setShowCreateInvoice] = useState(true)
  const [activePage, setActivePage] = useState(1)
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const itemsPerPage = 10
  const totalItems = 60

  const startItem = (activePage - 1) * itemsPerPage + 1
  const endItem = Math.min(activePage * itemsPerPage, totalItems)

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(Array.from({ length: 10 }, (_, i) => i))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectInvoice = (index: number) => {
    if (selectedInvoices.includes(index)) {
      setSelectedInvoices(selectedInvoices.filter((i) => i !== index))
    } else {
      setSelectedInvoices([...selectedInvoices, index])
    }
  }

  return (
    <div className="bg-universal_white_background min-h-screen">
      {showCreateInvoice ? (
        <CreateInvoice onClose={() => setShowCreateInvoice(false)} />
      ) : (
        <div className="p-4 md:p-6">
          {/* Responsive Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-[22px] font-semibold text-business_settings_black_text">Invoice List</h1>
              <p className="text-[14px] text-sidebar_black_text mt-1">
                An Overview of all your transactions over the year.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowCreateInvoice(true)}
                className="px-4 py-2.5 bg-universal_white_background border border-sidebar_gray_border rounded-md text-business_settings_black_text text-[14px] flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
              >
                Create New Invoice
              </button>
            </div>
          </header>

          {/* Notification Banner */}
          <div className="bg-[#fee0e0] rounded-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-business_settings_black_text text-[14px]">
              You have <span className="font-semibold">0/50</span> invoices remaining.
            </div>
            <Link href="#" className="text-business_settings_black_text text-[14px] underline font-medium">
              Upgrade your plan to enjoy more benefits.
            </Link>
          </div>

          {/* Desktop and Tablet Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-sidebar_gray_border">
                  <th className="py-3 px-4 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-3 h-4 w-4 rounded border-sidebar_gray_border"
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
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
                        <input
                          type="checkbox"
                          className="mr-3 h-4 w-4 rounded border-sidebar_gray_border"
                          checked={selectedInvoices.includes(index)}
                          onChange={() => handleSelectInvoice(index)}
                        />
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

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="flex items-center justify-between bg-universal_gray_background p-4 border-b border-sidebar_gray_border mb-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-3 h-4 w-4 rounded border-sidebar_gray_border"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <span className="text-[14px] font-medium text-sidebar_black_text">Select All</span>
              </div>
            </div>

            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="bg-white border border-sidebar_gray_border rounded-md mb-3 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-sidebar_gray_border">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-3 h-4 w-4 rounded border-sidebar_gray_border"
                      checked={selectedInvoices.includes(index)}
                      onChange={() => handleSelectInvoice(index)}
                    />
                    <div>
                      <div className="text-[14px] font-medium text-business_settings_black_text">AS_PUBLISHER</div>
                      <div className="text-[13px] text-sidebar_black_text">A10800120</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-change_password_green_background text-chart-profit rounded-full text-[13px]">
                    Paid
                  </span>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <div className="text-[12px] text-sidebar_black_text">Invoice Date</div>
                      <div className="text-[14px] text-business_settings_black_text">12/06/24</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-sidebar_black_text">Payout Date</div>
                      <div className="text-[14px] text-business_settings_black_text">12/06/24</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-sidebar_black_text">Invoice Type</div>
                      <div className="text-[14px] text-business_settings_black_text">Proforma</div>
                    </div>
                    <div>
                      <div className="text-[12px] text-sidebar_black_text">Amount</div>
                      <div className="text-[14px] font-medium text-business_settings_black_text">₹78,00,028</div>
                    </div>
                  </div>

                  <button className="flex items-center gap-1 text-download_purple_text text-[14px] w-full justify-center py-2 border-t border-sidebar_gray_border">
                    <Eye className="h-4 w-4" />
                    View Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Responsive Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <div className="text-[14px] text-sidebar_black_text order-2 sm:order-1">
              Showing:{" "}
              <span className="font-medium">
                {startItem}-{endItem}
              </span>{" "}
              of <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => activePage > 1 && setActivePage(activePage - 1)}
                className="w-8 h-8 flex items-center justify-center border border-sidebar_gray_border rounded-md text-sidebar_black_text"
                disabled={activePage === 1}
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </button>

              {/* Show fewer page numbers on mobile, all on desktop */}
              {[1, 2, 3].map((pageNumber) => (
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

              {/* Show ellipsis if there are more pages */}
              {totalItems / itemsPerPage > 3 && <span className="text-sidebar_black_text">...</span>}

              {/* Additional pages - visible on larger screens */}
              {[4, 5, 6].map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setActivePage(pageNumber)}
                  className={`hidden sm:flex w-8 h-8 items-center justify-center border border-sidebar_gray_border rounded-md ${
                    activePage === pageNumber
                      ? "bg-sidebar_green_button_background text-white"
                      : "text-sidebar_black_text"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => activePage < Math.ceil(totalItems / itemsPerPage) && setActivePage(activePage + 1)}
                className="w-8 h-8 flex items-center justify-center border border-sidebar_gray_border rounded-md text-sidebar_black_text"
                disabled={activePage === Math.ceil(totalItems / itemsPerPage)}
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
