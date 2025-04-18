"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Eye, MoreVertical } from "lucide-react"
import Link from "next/link"
import CreateInvoice from "@/components/create-invoice"
import { useUserCheck } from "@/helper/useUserCheck"
import toast from "react-hot-toast"

interface Invoice {
  id: string
  invoiceNumber: string
  billDate: string
  paymentDeadline: string
  brandName: string
  totalPayableAmount: number
  status: string
  items: Array<{
    itemName: string
    quantity: number
    unitPrice: number
  }>
}

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PAID':
      return 'bg-change_password_green_background text-chart-profit'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'OVERDUE':
      return 'bg-red-100 text-red-800'
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function InvoicePage() {
  const [showCreateInvoice, setShowCreateInvoice] = useState(true)
  const [activePage, setActivePage] = useState(1)
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null)

  const itemsPerPage = 10
  const totalItems = invoices.length

  const startItem = (activePage - 1) * itemsPerPage + 1
  const endItem = Math.min(activePage * itemsPerPage, totalItems)

  const currentPageInvoices = invoices.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(currentPageInvoices.map(invoice => invoice.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectInvoice = (id: string) => {
    if (selectedInvoices.includes(id)) {
      setSelectedInvoices(selectedInvoices.filter((i) => i !== id))
    } else {
      setSelectedInvoices([...selectedInvoices, id])
    }
  }

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update the local state
        setInvoices(invoices.map(invoice => 
          invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
        ))
        toast.success('Invoice status updated successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update invoice status')
      }
    } catch (error) {
      console.error('Error updating invoice status:', error)
      toast.error('Failed to update invoice status')
    } finally {
      setShowStatusMenu(null)
    }
  }

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/invoices')
        if (response.ok) {
          const data = await response.json()
          setInvoices(data)
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to fetch invoices')
        }
      } catch (error) {
        console.error('Error fetching invoices:', error)
        toast.error('Failed to fetch invoices')
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  useUserCheck()

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
              You have <span className="font-semibold">{invoices.length}/50</span> invoices created.
            </div>
            <Link href="#" className="text-business_settings_black_text text-[14px] underline font-medium">
              Upgrade your plan to enjoy more benefits.
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading invoices...</div>
          ) : (
            <>
              {/* Desktop and Tablet Table View */}
              <div className="hidden md:block relative">
                <div className="overflow-x-auto">
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
                        <th className="py-3 px-4 text-left text-[14px] font-medium text-sidebar_black_text">Customer</th>
                        <th className="py-3 px-4 text-left text-[14px] font-medium text-sidebar_black_text">Amount</th>
                        <th className="py-3 px-4 text-left text-[14px] font-medium text-sidebar_black_text">Status</th>
                        <th className="py-3 px-4 text-left text-[14px] font-medium text-sidebar_black_text">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-sidebar_gray_border hover:bg-universal_gray_background">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="mr-3 h-4 w-4 rounded border-sidebar_gray_border"
                                checked={selectedInvoices.includes(invoice.id)}
                                onChange={() => handleSelectInvoice(invoice.id)}
                              />
                              <div>
                                <div className="text-[14px] font-medium text-business_settings_black_text">{invoice.invoiceNumber}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-[14px] text-business_settings_black_text">
                            {new Date(invoice.billDate).toLocaleDateString('en-GB')}
                          </td>
                          <td className="py-4 px-4 text-[14px] text-business_settings_black_text">
                            {new Date(invoice.paymentDeadline).toLocaleDateString('en-GB')}
                          </td>
                          <td className="py-4 px-4 text-[14px] text-business_settings_black_text">{invoice.brandName}</td>
                          <td className="py-4 px-4 text-[14px] text-business_settings_black_text">
                            ₹{invoice.totalPayableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-4 px-4">
                            <div className="relative">
                              <button 
                                className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] cursor-pointer ${getStatusColor(invoice.status)}`}
                                onClick={() => setShowStatusMenu(showStatusMenu === invoice.id ? null : invoice.id)}
                              >
                                {invoice.status}
                                <ChevronDown className="h-4 w-4 ml-1" />
                              </button>
                              {showStatusMenu === invoice.id && (
                                <div className="fixed transform translate-y-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                  <div className="py-1" role="menu">
                                    {['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'].map((status) => (
                                      <button
                                        key={status}
                                        className={`block w-full text-left px-4 py-2 text-sm ${
                                          invoice.status === status 
                                            ? 'bg-gray-100 font-medium' 
                                            : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => handleStatusChange(invoice.id, status)}
                                      >
                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(status)}`}></span>
                                        {status}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <button className="flex items-center gap-1 text-download_purple_text text-[14px]">
                              <Eye className="h-4 w-4" />
                              View Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                      {currentPageInvoices.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-sidebar_black_text">
                            No invoices found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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

                {currentPageInvoices.map((invoice) => (
                  <div key={invoice.id} className="bg-white border border-sidebar_gray_border rounded-md mb-3 overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-sidebar_gray_border">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-3 h-4 w-4 rounded border-sidebar_gray_border"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={() => handleSelectInvoice(invoice.id)}
                        />
                        <div>
                          <div className="text-[14px] font-medium text-business_settings_black_text">{invoice.invoiceNumber}</div>
                        </div>
                      </div>
                      <div className="relative">
                        <button 
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] cursor-pointer ${getStatusColor(invoice.status)}`}
                          onClick={() => setShowStatusMenu(showStatusMenu === invoice.id ? null : invoice.id)}
                        >
                          {invoice.status}
                          <ChevronDown className="h-4 w-4 ml-1" />
                        </button>
                        {showStatusMenu === invoice.id && (
                          <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                            <div className="py-1" role="menu">
                              {['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'].map((status) => (
                                <button
                                  key={status}
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    invoice.status === status 
                                      ? 'bg-gray-100 font-medium' 
                                      : 'hover:bg-gray-50'
                                  }`}
                                  onClick={() => handleStatusChange(invoice.id, status)}
                                >
                                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(status)}`}></span>
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <div className="text-[12px] text-sidebar_black_text">Invoice Date</div>
                          <div className="text-[14px] text-business_settings_black_text">
                            {new Date(invoice.billDate).toLocaleDateString('en-GB')}
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] text-sidebar_black_text">Payout Date</div>
                          <div className="text-[14px] text-business_settings_black_text">
                            {new Date(invoice.paymentDeadline).toLocaleDateString('en-GB')}
                          </div>
                        </div>
                        <div>
                          <div className="text-[12px] text-sidebar_black_text">Customer</div>
                          <div className="text-[14px] text-business_settings_black_text">{invoice.brandName}</div>
                        </div>
                        <div>
                          <div className="text-[12px] text-sidebar_black_text">Amount</div>
                          <div className="text-[14px] font-medium text-business_settings_black_text">
                            ₹{invoice.totalPayableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>

                      <button className="flex items-center gap-1 text-download_purple_text text-[14px] w-full justify-center py-2 border-t border-sidebar_gray_border">
                        <Eye className="h-4 w-4" />
                        View Invoice
                      </button>
                    </div>
                  </div>
                ))}
                {currentPageInvoices.length === 0 && (
                  <div className="text-center py-8 text-sidebar_black_text">
                    No invoices found
                  </div>
                )}
              </div>

              {/* Pagination */}
              {invoices.length > 0 && (
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

                    {Array.from({ length: Math.min(Math.ceil(totalItems / itemsPerPage), 6) }).map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setActivePage(index + 1)}
                        className={`w-8 h-8 flex items-center justify-center border border-sidebar_gray_border rounded-md ${
                          activePage === index + 1
                            ? "bg-sidebar_green_button_background text-white"
                            : "text-sidebar_black_text"
                        }`}
                      >
                        {index + 1}
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
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

