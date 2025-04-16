"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Eye, FileText, Plus } from "lucide-react"
import { BrowserQRCodeReader } from "@zxing/browser"
import { Dialog } from "@headlessui/react"
import toast from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"

interface CreateInvoiceProps {
  onClose: () => void
}

interface Invoice {
  id: string
  date: string
  customer: string
  amount: string
}

interface ScanData {
  userEmail: string
  itemName: string
  itemType: "Product" | "Service"
  itemCode: string
  inventory: string
  measuringUnit: string
  salesPrice: string
  taxIncluded: boolean
  taxRate: string
}

export default function CreateInvoice({ onClose }: CreateInvoiceProps) {
  const { userId } = useAuth()
  const [billDateOpen, setBillDateOpen] = useState(false)
  const [paymentDateOpen, setPaymentDateOpen] = useState(false)
  const [billDate, setBillDate] = useState("14/12/2024")
  const [paymentDate, setPaymentDate] = useState("14/12/2024")
  const [showPreviousInvoices, setShowPreviousInvoices] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [billingAddress, setBillingAddress] = useState("")
  const [note, setNote] = useState("")
  const [brandName, setBrandName] = useState("")
  const [partyContactEmail, setPartyContactEmail] = useState("")
  const [partyContactNumber, setPartyContactNumber] = useState("")
  const [partyGST, setPartyGst] = useState("")
  const [previousInvoices, setPreviousInvoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      date: "01/04/2025",
      customer: "ABC Corp",
      amount: "₹8,500",
    },
    {
      id: "INV-002",
      date: "15/03/2025",
      customer: "XYZ Ltd",
      amount: "₹12,300",
    },
    {
      id: "INV-003",
      date: "28/02/2025",
      customer: "123 Industries",
      amount: "₹5,750",
    },
    {
      id: "INV-004",
      date: "10/02/2025",
      customer: "Tech Solutions",
      amount: "₹9,200",
    },
  ])

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const currentDate = new Date()
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<ScanData[]>([])

  const startScanning = async () => {
    setScanning(true)
    const codeReader = new BrowserQRCodeReader()

    try {
      const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices()
      const selectedDeviceId = videoInputDevices[0].deviceId

      const previewElem = document.getElementById("preview")
      if (!previewElem) return

      const result = await codeReader.decodeFromVideoDevice(selectedDeviceId, "preview", (result, _, controls) => {
        if (result) {
          try {
            const jsonData: ScanData = JSON.parse(result.getText())
            setResults((prev) => [...prev, jsonData])
            toast.success("Item added successfully!")
            setScanning(false)
            setIsModalOpen(false)
            controls.stop()
          } catch (error) {
            console.error("Invalid JSON data")
          }
        }
      })
    } catch (error) {
      setScanning(false)
    }
  }

  const stopScanning = () => {
    setScanning(false)
    setIsModalOpen(false)
  }

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days: React.ReactNode[] = []

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <button
          key={i}
          onClick={() => handleDateSelect(i)}
          className="h-8 w-8 rounded-full hover:bg-[#f0f1f3] flex items-center justify-center text-[13px]"
        >
          {i}
        </button>,
      )
    }

    return days
  }

  const handleDateSelect = (day: number): void => {
    const formattedDay = day < 10 ? `0${day}` : day.toString()
    const formattedMonth = currentMonth + 1 < 10 ? `0${currentMonth + 1}` : (currentMonth + 1).toString()
    const formattedDate = `${formattedDay}/${formattedMonth}/${currentYear}`

    if (billDateOpen) {
      setBillDate(formattedDate)
      setBillDateOpen(false)
    } else if (paymentDateOpen) {
      setPaymentDate(formattedDate)
      setPaymentDateOpen(false)
    }
  }

  const prevMonth = (): void => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = (): void => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const calculateTotalBeforeTax = () => {
    return results.reduce((sum, item) => sum + Number(item.inventory) * Number(item.salesPrice), 0)
  }

  const calculateTotalTax = () => {
    return results.reduce(
      (sum, item) => sum + (Number(item.inventory) * Number(item.salesPrice) * Number(item.taxRate)) / 100,
      0,
    )
  }

  const calculateTotalAfterTax = () => {
    return results.reduce(
      (sum, item) => sum + Number(item.inventory) * Number(item.salesPrice) * (1 + Number(item.taxRate) / 100),
      0,
    )
  }

  const calculateTotalQuantity = () => {
    return results.reduce((total, item) => total + Number(item.inventory), 0)
  }

  const calculateTotalIgst = () => {
    return results.reduce((total, item) => {
      const igst = Number(item.salesPrice) * Number(item.inventory) * 0.09
      return total + igst
    }, 0)
  }

  const handleSaveInvoice = async () => {
    if (!userId) {
      toast.error("You must be logged in to create an invoice")
      return
    }

    try {
      // Convert Clerk userId string to integer
      const numericUserId = Number.parseInt(userId.replace(/\D/g, ""), 10)

      const response = await fetch("/api/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billingAddress,
          brandName,
          partyContactEmail,
          partyContactNumber,
          partyGst: partyGST,
          invoiceNumber,
          billDate: new Date(billDate.split("/").reverse().join("-")),
          paymentDeadline: new Date(paymentDate.split("/").reverse().join("-")),
          items: results.map((item) => ({
            ...item,
            beforeTaxAmount: Number(item.inventory) * Number(item.salesPrice),
            afterTaxAmount: Number(item.inventory) * Number(item.salesPrice) * (1 + Number(item.taxRate) / 100),
          })),
          totalTax: calculateTotalTax(),
          totalBeforeTax: calculateTotalBeforeTax(),
          totalAfterTax: calculateTotalAfterTax(),
          totalPayableAmount: calculateTotalAfterTax(),
        }),
      })
      if (response.ok) {
        const data = await response.json()
        toast.success("Invoice Generated Successfully")
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="bg-white p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-[22px] font-semibold text-[#212626]">Create Invoice</h1>
            <p className="text-[14px] text-[#667085] mt-1">An Overview of all your transactions over the year.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-[#e0e2e7] rounded-md bg-white text-[#333843] text-[14px]"
            >
              Preview Invoices
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#f0f1f3] rounded-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-3">
            <div className="">
              <h3 className="text-[13px] text-[#667085] mb-2">Brand Name</h3>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full border border-[#e0e2e7] rounded-md py-2.5 px-3 text-[14px] text-[#333843] h-[42px]"
                placeholder="eg. Reliance"
              />
            </div>
            <div className="">
              <h3 className="text-[13px] text-[#667085] mb-2">Party Contact Email</h3>
              <input
                type="text"
                value={partyContactEmail}
                onChange={(e) => setPartyContactEmail(e.target.value)}
                className="w-full border border-[#e0e2e7] rounded-md py-2.5 px-3 text-[14px] text-[#333843] h-[42px]"
                placeholder="eg. party@email.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-3">
            <div className="">
              <h3 className="text-[13px] text-[#667085] mb-2">Party Contact Number</h3>
              <input
                type="text"
                value={partyContactNumber}
                onChange={(e) => setPartyContactNumber(e.target.value)}
                className="w-full border border-[#e0e2e7] rounded-md py-2.5 px-3 text-[14px] text-[#333843] h-[42px]"
                placeholder="eg. 9876543210"
              />
            </div>
            <div className="">
              <h3 className="text-[13px] text-[#667085] mb-2">Party GSTIN No:</h3>
              <input
                type="text"
                value={partyGST}
                onChange={(e) => setPartyGst(e.target.value)}
                className="w-full border border-[#e0e2e7] rounded-md py-2.5 px-3 text-[14px] text-[#333843] h-[42px]"
                placeholder="eg. 27AAPFU0939F1ZV"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[13px] text-[#667085] mb-2">Billing Address</h3>
              <textarea
                placeholder="eg. banashankari, bangalore"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                className="border border-[#e0e2e7] rounded-md p-4 h-[72px] flex items-center justify-center w-full resize-none"
              ></textarea>
            </div>
            <div className="">
              <h3 className="text-[13px] text-[#667085] mb-2">Sales Invoice No:</h3>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full border border-[#e0e2e7] rounded-md py-2.5 px-3 text-[14px] text-[#333843] h-[42px]"
                placeholder="eg. INV-001-2025"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div></div>
            <div>
              <h3 className="text-[13px] text-[#667085] mb-2">Payment Terms:</h3>
              <div className="flex">
                <div className="relative w-full">
                  <select className="w-full appearance-none border border-[#e0e2e7] rounded-l-md py-2.5 px-3 pr-8 text-[14px] text-[#333843] bg-white h-[42px]">
                    <option>30</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-[13px] text-[#667085] pointer-events-none" />
                </div>
                <div className="relative w-full">
                  <select className="w-full appearance-none border border-[#e0e2e7] border-l-0 rounded-r-md py-2.5 px-3 pr-8 text-[14px] text-[#333843] bg-white h-[42px]">
                    <option>Days</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-[13px] text-[#667085] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] text-[#667085]">Terms & Conditions</h3>
              </div>
              <div className="mt-2 text-[13px] text-[#667085]">
                <p>Please pay within 30 days of receiving this invoice.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-[13px] text-[#667085] mb-2">Bill Date</h3>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-[#e0e2e7] rounded-md py-2.5 px-3 text-[14px] text-[#333843] h-[42px] text-left pr-10"
                    value={billDate}
                    onChange={(e) => {
                      const value = e.target.value
                      // Basic date format validation (DD/MM/YYYY)
                      if (/^\d{0,2}\/?\d{0,2}\/?\d{0,4}$/.test(value)) {
                        setBillDate(value)
                      }
                    }}
                    placeholder="DD/MM/YYYY"
                  />
                  <button
                    onClick={() => {
                      setBillDateOpen(!billDateOpen)
                      setPaymentDateOpen(false)
                    }}
                    className="absolute right-3 top-[12px] text-[#1eb386]"
                  >
                    <CalendarIcon size={18} />
                  </button>

                  {billDateOpen && (
                    <div className="absolute right-0 mt-1 bg-white border border-[#e0e2e7] rounded-md shadow-lg z-10 p-3 w-[280px]">
                      <div className="flex justify-between items-center mb-2">
                        <button onClick={prevMonth} className="p-1 hover:bg-[#f0f1f3] rounded-full">
                          <ChevronLeft size={16} className="text-[#667085]" />
                        </button>
                        <div className="text-[14px] font-medium">
                          {months[currentMonth]} {currentYear}
                        </div>
                        <button onClick={nextMonth} className="p-1 hover:bg-[#f0f1f3] rounded-full">
                          <ChevronRight size={16} className="text-[#667085]" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-1">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                          <div
                            key={day}
                            className="h-8 w-8 flex items-center justify-center text-[12px] text-[#667085]"
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-[13px] text-[#667085] mb-2">Payment Deadline</h3>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-[#e0e2e7] rounded-md py-2.5 px-3 text-[14px] text-[#333843] h-[42px] text- pr-10"
                    value={paymentDate}
                    onChange={(e) => {
                      const value = e.target.value
                      // Basic date format validation (DD/MM/YYYY)
                      if (/^\d{0,2}\/?\d{0,2}\/?\d{0,4}$/.test(value)) {
                        setPaymentDate(value)
                      }
                    }}
                    placeholder="DD/MM/YYYY"
                  />
                  <button
                    onClick={() => {
                      setPaymentDateOpen(!paymentDateOpen)
                      setBillDateOpen(false)
                    }}
                    className="absolute right-3 top-[12px] text-[#1eb386]"
                  >
                    <CalendarIcon size={18} />
                  </button>

                  {paymentDateOpen && (
                    <div className="absolute right-0 mt-1 bg-white border border-[#e0e2e7] rounded-md shadow-lg z-10 p-3 w-[280px]">
                      <div className="flex justify-between items-center mb-2">
                        <button onClick={prevMonth} className="p-1 hover:bg-[#f0f1f3] rounded-full">
                          <ChevronLeft size={16} className="text-[#667085]" />
                        </button>
                        <div className="text-[14px] font-medium">
                          {months[currentMonth]} {currentYear}
                        </div>
                        <button onClick={nextMonth} className="p-1 hover:bg-[#f0f1f3] rounded-full">
                          <ChevronRight size={16} className="text-[#667085]" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-1">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                          <div
                            key={day}
                            className="h-8 w-8 flex items-center justify-center text-[12px] text-[#667085]"
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f7f7f7] text-[#667085] text-[13px]">
                <th className="py-3 px-4 text-left font-medium w-16">NO.</th>
                <th className="py-3 px-4 text-left font-medium">ARTICLE</th>
                <th className="py-3 px-4 text-right font-medium">QUANTITY</th>
                <th className="py-3 px-4 text-right font-medium">UNIT PRICE</th>
                <th className="py-3 px-4 text-right font-medium">TAX</th>
                <th className="py-3 px-4 text-right font-medium">AMOUNT</th>
                <th className="py-3 px-4 text-right font-medium">FINAL AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-b border-[#f0f1f3]">
                  <td className="py-4 px-4 text-[14px] text-[#333843]">{index + 1}</td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-[14px] text-[#333843] font-medium">{result.itemName}</p>
                      <p className="text-[13px] text-[#667085]">{result.itemCode}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div>
                      <p className="text-[14px] text-[#333843]">{result.inventory}</p>
                      <p className="text-[13px] text-[#667085]">{result.measuringUnit}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right text-[14px] text-[#333843]">₹{result.salesPrice}</td>
                  <td className="py-4 px-4 text-right text-[14px] text-[#333843]">{result.taxRate}%</td>
                  <td className="py-4 px-4 text-right text-[14px] text-[#333843]">
                    ₹{Number(result.inventory) * Number(result.salesPrice)}
                  </td>
                  <td className="py-4 px-4 text-right text-[14px] text-[#333843]">
                    ₹
                    {(
                      Number(result.inventory) *
                      Number(result.salesPrice) *
                      (1 + Number(result.taxRate) / 100)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4 mb-6">
          <button className="flex items-center text-[#1eb386] border border-[#e0e2e7] rounded-md py-3 px-4 text-[14px] w-[800px]">
            <Plus size={16} className="mr-1.5" />
            Add Item/Product/Service
          </button>
          <button
            onClick={() => {
              setIsModalOpen(true)
              startScanning()
            }}
            className="flex items-center text-[#1eb386] border border-[#e0e2e7] rounded-md py-3 px-4 text-[14px] w-[370px] justify-center"
          >
            Scan Barcode
            <svg
              className="ml-2"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="2" y="4" width="2" height="16" fill="#1eb386" />
              <rect x="6" y="4" width="1" height="16" fill="#1eb386" />
              <rect x="9" y="4" width="2" height="16" fill="#1eb386" />
              <rect x="13" y="4" width="1" height="16" fill="#1eb386" />
              <rect x="16" y="4" width="2" height="16" fill="#1eb386" />
              <rect x="20" y="4" width="2" height="16" fill="#1eb386" />
            </svg>
          </button>
        </div>

        <Dialog
          open={isModalOpen}
          onClose={() => {
            stopScanning()
            setIsModalOpen(false)
          }}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-4">
              <Dialog.Title className="text-lg font-bold mb-4">Scan QR Code</Dialog.Title>

              <div className="relative">
                <video id="preview" className="w-full rounded" style={{ maxWidth: "400px" }}></video>

                <button
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                  onClick={stopScanning}
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        <div className="flex flex-col md:flex-row justify-end gap-6 mt-4">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="flex justify-between bg-[#f7f7f7] p-3 rounded-md font-semibold">
              <span className="text-[14px] text-[#667085]">Subtotal</span>
              <div className="flex gap-6">
                <div className="text-right">
                  <p className="text-[14px] text-[#333843]">{calculateTotalQuantity()}</p>
                  <p className="text-[13px] text-[#667085]">Unit(s)</p>
                </div>
                <div className="w-20 text-right text-[14px] text-[#333843]">
                  <p className="text-[14px] text-[#333843]">{calculateTotalIgst()}</p>
                  <p className="text-[13px] text-[#667085]">(IGST)</p>
                </div>
                <div className="w-20 text-right text-[14px] text-[#333843]">
                  <p className="text-[14px] text-[#333843]">{calculateTotalIgst()}</p>
                  <p className="text-[13px] text-[#667085]">(CGST)</p>
                </div>
                <div className="w-20 text-right text-[14px] text-[#333843]">{calculateTotalBeforeTax()}</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#333843] font-medium">Total Taxable Amount</span>
              <div className="w-32 rounded-md py-2 px-3 text-right text-[14px] text-[#333843] h-[36px] flex items-center justify-end font-bold">
                {calculateTotalAfterTax().toFixed(2)}
              </div>
            </div>

            <button
              onClick={handleSaveInvoice}
              className="w-full bg-[#1eb386] text-white py-3.5 rounded-md hover:bg-[#40c79a] transition-colors mt-6 text-[14px]"
            >
              Generate Invoice
            </button>

            <button
              onClick={() => setShowPreviousInvoices(!showPreviousInvoices)}
              className="w-full flex items-center justify-center text-[#1eb386] border border-[#e0e2e7] py-3.5 rounded-md hover:bg-[#f9f9f9] transition-colors mt-4 text-[14px]"
            >
              <Eye size={16} className="mr-1.5" />
              {showPreviousInvoices ? "Hide Previous Invoices" : "Preview Previous Invoices"}
            </button>
          </div>
        </div>

        {showPreviousInvoices && (
          <div className="border border-[#e0e2e7] rounded-md p-4 mt-6 w-full transition-all duration-300">
            <h4 className="text-[15px] font-medium text-[#333843] mb-3 flex items-center">
              <FileText size={16} className="mr-2 text-[#1eb386]" />
              Previous Invoices
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f7f7f7] text-[#667085] text-[13px]">
                    <th className="py-2 px-3 text-left font-medium">INVOICE #</th>
                    <th className="py-2 px-3 text-left font-medium">DATE</th>
                    <th className="py-2 px-3 text-left font-medium">CUSTOMER</th>
                    <th className="py-2 px-3 text-right font-medium">AMOUNT</th>
                    <th className="py-2 px-3 text-center font-medium">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {previousInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-[#f0f1f3] hover:bg-[#f9f9f9]">
                      <td className="py-3 px-3 text-[14px] text-[#333843]">{invoice.id}</td>
                      <td className="py-3 px-3 text-[14px] text-[#333843]">{invoice.date}</td>
                      <td className="py-3 px-3 text-[14px] text-[#333843]">{invoice.customer}</td>
                      <td className="py-3 px-3 text-right text-[14px] text-[#333843]">{invoice.amount}</td>
                      <td className="py-3 px-3 text-center">
                        <button className="text-[#1eb386] hover:text-[#40c79a]">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
