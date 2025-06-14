"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Search,
  X,
} from "lucide-react"
import { BrowserQRCodeReader } from "@zxing/browser"
import { Dialog } from "@headlessui/react"
import toast from "react-hot-toast"
import { useAuth } from "@clerk/nextjs"

interface CreateInvoiceProps {
  onClose: () => void
}

interface Invoice {
  id: string
  billDate: string
  brandName: string
  totalPayableAmount: number
  items: Array<{
    itemName: string
    quantity: number
    unitPrice: number
  }>
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

interface BusinessDetails {
  businessName: string
  billingAddress: string
  city: string
  state: string
  pincode: string
  companyEmail: string
  companyNumber: string
  gstNumber: string
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
  const [previousInvoices, setPreviousInvoices] = useState<Invoice[]>([])
  const [businessDetails, setBusinessDetails ] = useState<BusinessDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [businessSearchQuery, setBusinessSearchQuery] = useState("")
  const [businessSearchResults, setBusinessSearchResults] = useState<any[]>([])
  const [isBusinessSearching, setIsBusinessSearching] = useState(false)
  const [showBusinessSearchResults, setShowBusinessSearchResults] = useState(false)
  const [showInvoicePreview, setShowInvoicePreview] = useState(false)
  const [currentInvoice, setCurrentInvoice] = useState<any>(null)

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  const searchProducts = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      try {
        setIsSearching(true)
        const searchUrl = `/api/products?search=${encodeURIComponent(query)}`
        console.log("Making API request to:", searchUrl)

        const response = await fetch(searchUrl)
        console.log("API Response Status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("API Response Data:", data)
          if (Array.isArray(data)) {
            setSearchResults(data)
            console.log("Search results set:", data.length, "items")
          } else {
            console.error("Unexpected API response format:", data)
            setSearchResults([])
          }
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error("API Error Response:", response.status, errorData)
          toast.error("Failed to search products")
          setSearchResults([])
        }
      } catch (error) {
        console.error("Search Error Details:", error)
        toast.error("Error searching products")
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300),
    [],
  )

  const searchBusinesses = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setBusinessSearchResults([])
        setIsBusinessSearching(false)
        return
      }

      try {
        setIsBusinessSearching(true)
        const searchUrl = `/api/business-search?search=${encodeURIComponent(query)}`
        console.log("Making API request to:", searchUrl)

        const response = await fetch(searchUrl)
        console.log("API Response Status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("API Response Data:", data)
          if (Array.isArray(data)) {
            setBusinessSearchResults(data)
            console.log("Search results set:", data.length, "items")
          } else {
            console.error("Unexpected API response format:", data)
            setBusinessSearchResults([])
          }
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.error("API Error Response:", response.status, errorData)
          toast.error("Failed to search businesses")
          setBusinessSearchResults([])
        }
      } catch (error) {
        console.error("Search Error Details:", error)
        toast.error("Error searching businesses")
        setBusinessSearchResults([])
      } finally {
        setIsBusinessSearching(false)
      }
    }, 300),
    [],
  )

  const addProductToInvoice = (product: any) => {
    console.log("Adding product to invoice:", product)
    try {
      const newItem: ScanData = {
        userEmail: product.userEmail || "",
        itemName: product.itemName || "Product",
        itemType: "Product",
        itemCode: product.itemCode || "",
        inventory: product.inventory || "1",
        measuringUnit: product.measuringUnit || "Piece",
        salesPrice: product.salesPrice?.toString() || "0",
        taxIncluded: product.taxIncluded || false,
        taxRate: product.taxRate?.toString() || "18",
      }
      console.log("Created new item:", newItem)

      setResults((prevResults) => {
        const newResults = [...prevResults, newItem]
        console.log("Updated results array:", newResults)
        return newResults
      })

      setSearchQuery("")
      setSearchResults([])
      setShowSearchResults(false)
      toast.success(`Added ${product.itemName} to invoice`)
    } catch (error) {
      console.error("Error adding product to invoice:", error)
      toast.error("Failed to add product to invoice")
    }
  }

  const selectBusiness = (business: any) => {
    console.log("Selected business:", business)
    try {
      setBrandName(business.businessName || "")
      setPartyContactEmail(business.companyEmail || "")
      setPartyContactNumber(business.companyNumber || "")
      setPartyGst(business.gstNumber || "")
      setBillingAddress(business.billingAddress || "")

      setBusinessSearchQuery("")
      setBusinessSearchResults([])
      setShowBusinessSearchResults(false)
      toast.success(`Selected ${business.businessName}`)
    } catch (error) {
      console.error("Error selecting business:", error)
      toast.error("Failed to select business")
    }
  }

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

      const selectedDate = new Date(currentYear, currentMonth, day)
      const paymentDueDate = new Date(selectedDate)
      paymentDueDate.setDate(paymentDueDate.getDate() + 30)

      const paymentDay = paymentDueDate.getDate()
      const paymentMonth = paymentDueDate.getMonth() + 1
      const paymentYear = paymentDueDate.getFullYear()

      const formattedPaymentDay = paymentDay < 10 ? `0${paymentDay}` : paymentDay.toString()
      const formattedPaymentMonth = paymentMonth < 10 ? `0${paymentMonth}` : paymentMonth.toString()
      const formattedPaymentDate = `${formattedPaymentDay}/${formattedPaymentMonth}/${paymentYear}`

      setPaymentDate(formattedPaymentDate)
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
      const igst =
        Number(item.salesPrice) * Number(item.inventory) * (1 + Number(item.taxRate) / 100) -
        Number(item.salesPrice) * Number(item.inventory)
      return igst / 2
    }, 0)
  }

  // Function to show invoice preview
  const showInvoicePreviewModal = () => {
    const invoiceData = {
      invoiceNumber: invoiceNumber || `INV-${Math.floor(Math.random() * 10000)}`,
      billDate,
      paymentDate,
      brandName,
      partyContactEmail,
      partyContactNumber,
      partyGST,
      billingAddress,
      items: results,
      totalBeforeTax: calculateTotalBeforeTax(),
      totalTax: calculateTotalTax(),
      totalAfterTax: calculateTotalAfterTax(),
      totalQuantity: calculateTotalQuantity(),
      totalIgst: calculateTotalIgst(),
    }

    setCurrentInvoice(invoiceData)
    setShowInvoicePreview(true)
  }

  const handleSaveInvoice = async () => {
    if (!userId) {
      toast.error("You must be logged in to create an invoice")
      return
    }

    showInvoicePreviewModal()
  }

  const handleConfirmSaveInvoice = async () => {
    try {
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
        createPaymentLink(data)
        setShowInvoicePreview(false)
        // Refresh the previous invoices list
        const updatedResponse = await fetch("/api/invoices")
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json()
          setPreviousInvoices(
            updatedData.map((invoice: any) => ({
              id: invoice.invoiceNumber,
              billDate: new Date(invoice.billDate).toLocaleDateString("en-GB"),
              brandName: invoice.brandName,
              totalPayableAmount: invoice.totalPayableAmount,
            })),
          )
        }
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to generate invoice")
      }
    } catch (error) {
      console.error("Error saving invoice:", error)
      toast.error("Failed to generate invoice")
    }
  }

const createPaymentLink = async (invoice: any) => {
  try {
    const response = await fetch('/api/create-payment-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: invoice.totalAfterTax,
        customerName: invoice.brandName,
        customerEmail: invoice.partyContactEmail,
        customerPhone: invoice.partyContactNumber,
        invoiceNumber: invoice.invoiceNumber,
        dueDate: invoice.paymentDate,
        description: `Payment for Invoice #${invoice.invoiceNumber}`
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create payment link');
    }

    toast.success('Payment link created and sent successfully!');
    return data.paymentLink;

  } catch (error) {
    console.error('Error:', error);
    toast.error('Failed to create payment link');
    return null;
  }
};

// Update handleSendInvoice function
const handleSendInvoice = async (method: "email" | "sms" | "whatsapp") => {
  if (!currentInvoice) return;

  const paymentLink = await createPaymentLink(currentInvoice);
  
  if (paymentLink) {
    let message = "";
    switch (method) {
      case "email":
        message = `Payment link sent via email to ${currentInvoice.partyContactEmail}`;
        break;
      case "sms":
        message = `Payment link sent via SMS to ${currentInvoice.partyContactNumber}`;
        break;
      case "whatsapp":
        message = `Payment link sent via WhatsApp to ${currentInvoice.partyContactNumber}`;
        break;
    }
    toast.success(message);
  }
};

  const handleDeleteItem = (index: number) => {
    setResults((prevResults) => prevResults.filter((_, i) => i !== index))
    toast.success("Item removed successfully!")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".search-container")) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch previous invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/invoices")
        if (response.ok) {
          const data = await response.json()
          setPreviousInvoices(
            data.map((invoice: any) => ({
              id: invoice.invoiceNumber,
              billDate: new Date(invoice.billDate).toLocaleDateString("en-GB"),
              brandName: invoice.brandName,
              totalPayableAmount: invoice.totalPayableAmount,
            })),
          )
        } else {
          const error = await response.json()
          console.error("Failed to fetch invoices:", error)
          toast.error(error.error || "Failed to fetch invoices")
        }
      } catch (error) {
        console.error("Error fetching invoices:", error)
        toast.error("Failed to fetch invoices")
      }
    }

    fetchInvoices()
  }, [])

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try{
        const response = await fetch('/api/business-details');
        if(!response.ok){
          throw new Error('Failed to fetch business details');
        }
        const data = await response.json();
        setBusinessDetails(data);
      }catch(error){
        toast.error('Try Again later');
        console.error('Error fetching data', error);
      }
    };
    fetchBusinessDetails();
  }, [])

  return (
    <div className="bg-white p-4 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-[22px] font-semibold text-[#212626]">Create Invoice</h1>
            <p className="text-[13px] sm:text-[14px] text-[#667085] mt-1">
              An Overview of all your transactions over the year.
            </p>
          </div>
          <div>
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-[#e0e2e7] rounded-md bg-white text-[#333843] text-[14px] w-full sm:w-auto"
            >
              <span className="flex items-center justify-center">
                <Eye className="mr-2 h-4 w-4" />
                Preview Invoices
              </span>
            </button>
          </div>
        </div>

        {/* Invoice Details Form */}
        <div className="bg-white border border-[#f0f1f3] rounded-md p-4 sm:p-6 mb-6">
          <div className="relative">
            <div className="flex items-center border border-[#e0e2e7] rounded-md overflow-hidden mb-3">
              <input
                type="text"
                value={businessSearchQuery}
                onChange={(e) => {
                  setBusinessSearchQuery(e.target.value)
                  searchBusinesses(e.target.value)
                  setShowBusinessSearchResults(true)
                }}
                onFocus={() => {
                  setShowBusinessSearchResults(true)
                  if (businessSearchQuery.trim()) {
                    searchBusinesses(businessSearchQuery)
                  }
                }}
                placeholder="Search for party who are already part of invoicify..."
                className="py-3 px-4 text-[14px] w-full outline-none"
              />
              <div className="px-3 text-[#667085]">
                <Search size={18} />
              </div>
            </div>

            {showBusinessSearchResults && (businessSearchResults.length > 0 || isBusinessSearching) && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e0e2e7] rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {isBusinessSearching ? (
                  <div className="p-3 text-center text-[14px] text-[#667085]">Searching...</div>
                ) : businessSearchResults.length > 0 ? (
                  businessSearchResults.map((business, index) => (
                    <div
                      key={index}
                      onClick={() => selectBusiness(business)}
                      className="p-3 hover:bg-[#f7f7f7] cursor-pointer border-b border-[#f0f1f3] last:border-b-0"
                    >
                      <div className="text-[14px] font-medium text-[#333843]">{business.businessName}</div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[13px] text-[#667085]">GST: {business.gstNumber || "No GST"}</span>
                        <span className="text-[13px] text-[#667085]">{business.companyNumber || "No phone"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-[14px] text-[#667085]">No businesses found</div>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-3">
            <div>
              <h3 className="text-[13px] text-[#667085] mb-2">Brand Name</h3>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full border border-[#e0e2e7] rounded-md py-2.5 px-3 text-[14px] text-[#333843] h-[42px]"
                placeholder="eg. Reliance"
              />
            </div>
            <div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-3">
            <div>
              <h3 className="text-[13px] text-[#667085] mb-2">Party Contact Number</h3>
              <input
                type="text"
                value={partyContactNumber}
                onChange={(e) => setPartyContactNumber(e.target.value)}
                className="w-full border border-[#e0e2e7] rounded-md py-2.5 px-3 text-[14px] text-[#333843] h-[42px]"
                placeholder="eg. 9876543210"
              />
            </div>
            <div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-[13px] text-[#667085] mb-2">Billing Address</h3>
              <textarea
                placeholder="eg. banashankari, bangalore"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                className="border border-[#e0e2e7] rounded-md p-4 h-[72px] flex items-center justify-center w-full resize-none"
              ></textarea>
            </div>
            <div>
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

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[13px] text-[#667085]">Terms & Conditions</h3>
              </div>
              <div className="mt-2 text-[13px] text-[#667085]">
                <p>Please pay within 30 days of receiving this invoice.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[13px] text-[#667085] mb-2">Bill Date</h3>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-[#e0e2e7] rounded-md py-2.5 px-3 text-[14px] text-[#333843] h-[42px] text-left pr-10"
                    value={billDate}
                    onChange={(e) => {
                      const value = e.target.value

                      if (/^\d{0,2}\/?\d{0,2}\/?\d{0,4}$/.test(value)) {
                        setBillDate(value)

                        // Try to parse the date and set payment date to 30 days later
                        if (value.length === 10) {
                          // Only if it's a complete date
                          const [day, month, year] = value.split("/").map(Number)
                          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                            // JavaScript months are 0-indexed
                            const billDateObj = new Date(year, month - 1, day)
                            const paymentDueDate = new Date(billDateObj)
                            paymentDueDate.setDate(paymentDueDate.getDate() + 30)

                            const paymentDay = paymentDueDate.getDate()
                            const paymentMonth = paymentDueDate.getMonth() + 1
                            const paymentYear = paymentDueDate.getFullYear()

                            const formattedPaymentDay = paymentDay < 10 ? `0${paymentDay}` : paymentDay.toString()
                            const formattedPaymentMonth =
                              paymentMonth < 10 ? `0${paymentMonth}` : paymentMonth.toString()
                            const formattedPaymentDate = `${formattedPaymentDay}/${formattedPaymentMonth}/${paymentYear}`

                            setPaymentDate(formattedPaymentDate)
                          }
                        }
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

        <div className="overflow-x-auto mb-4 rounded-md border border-[#f0f1f3]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f7f7f7] text-[#667085] text-[13px]">
                <th className="py-3 px-2 sm:px-4 text-left font-medium w-12 sm:w-16">NO.</th>
                <th className="py-3 px-2 sm:px-4 text-left font-medium">ARTICLE</th>
                <th className="py-3 px-2 sm:px-4 text-right font-medium">QTY</th>
                <th className="py-3 px-2 sm:px-4 text-right font-medium">PRICE</th>
                <th className="py-3 px-2 sm:px-4 text-right font-medium">TAX</th>
                <th className="py-3 px-2 sm:px-4 text-right font-medium hidden sm:table-cell">AMOUNT</th>
                <th className="py-3 px-2 sm:px-4 text-right font-medium">TOTAL</th>
                <th className="py-3 px-2 sm:px-4 text-center font-medium">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-b border-[#f0f1f3]">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-[13px] sm:text-[14px] text-[#333843]">{index + 1}</td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4">
                    <div>
                      <p className="text-[13px] sm:text-[14px] text-[#333843] font-medium">{result.itemName}</p>
                      <p className="text-[12px] sm:text-[13px] text-[#667085]">{result.itemCode}</p>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-right">
                    <div>
                      <p className="text-[13px] sm:text-[14px] text-[#333843]">{result.inventory}</p>
                      <p className="text-[12px] sm:text-[13px] text-[#667085]">{result.measuringUnit}</p>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-right text-[13px] sm:text-[14px] text-[#333843]">
                    ₹{result.salesPrice}
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-right text-[13px] sm:text-[14px] text-[#333843]">
                    {result.taxRate}%
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-right text-[13px] sm:text-[14px] text-[#333843] hidden sm:table-cell">
                    ₹{Number(result.inventory) * Number(result.salesPrice)}
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-right text-[13px] sm:text-[14px] text-[#333843]">
                    ₹
                    {(
                      Number(result.inventory) *
                      Number(result.salesPrice) *
                      (1 + Number(result.taxRate) / 100)
                    ).toFixed(2)}
                  </td>
                  <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                    <button
                      onClick={() => handleDeleteItem(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#667085] text-[14px]">
                    No items added to invoice yet. Search for products or scan a barcode to add items.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Search and Scan Section */}
        <div className="flex flex-col sm:flex-row justify-between mt-4 mb-6 gap-4">
          <div className="relative w-full sm:w-2/3 search-container">
            <div className="flex items-center border border-[#e0e2e7] rounded-md overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  searchProducts(e.target.value)
                  setShowSearchResults(true)
                }}
                onFocus={() => {
                  setShowSearchResults(true)
                  if (searchQuery.trim()) {
                    searchProducts(searchQuery)
                  }
                }}
                placeholder="Search for products by name or code..."
                className="py-3 px-4 text-[14px] w-full outline-none"
              />
              <div className="px-3 text-[#667085]">
                <Search size={18} />
              </div>
            </div>

            {showSearchResults && (searchResults.length > 0 || isSearching) && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e0e2e7] rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="p-3 text-center text-[14px] text-[#667085]">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product, index) => (
                    <div
                      key={index}
                      onClick={() => addProductToInvoice(product)}
                      className="p-3 hover:bg-[#f7f7f7] cursor-pointer border-b border-[#f0f1f3] last:border-b-0"
                    >
                      <div className="text-[14px] font-medium text-[#333843]">{product.itemName}</div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[13px] text-[#667085]">Code: {product.itemCode || "No code"}</span>
                        <span className="text-[13px] font-medium text-[#333843]">₹{product.salesPrice || "0"}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-[14px] text-[#667085]">No products found</div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setIsModalOpen(true)
              startScanning()
            }}
            className="flex items-center text-[#1eb386] border border-[#e0e2e7] rounded-md py-3 px-4 text-[14px] w-full sm:w-1/3 justify-center"
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

        {/* QR Code Scanner Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => {
            stopScanning()
            setIsModalOpen(false)
          }}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl w-full">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-xl font-semibold text-[#333843]">Scan Barcode</Dialog.Title>
                <button className="text-[#667085] hover:text-[#333843] transition-colors" onClick={stopScanning}>
                  <X size={20} />
                </button>
              </div>

              <div className="text-[#667085] text-sm mb-4">
                Position the barcode within the scanner frame to automatically capture it.
              </div>

              <div className="relative rounded-lg overflow-hidden border-4 border-[#1eb386] mb-4">
                <video id="preview" className="w-full h-64 object-cover bg-black"></video>

                {scanning && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-xs py-1 px-3 rounded-full flex items-center">
                    <div className="w-2 h-2 bg-[#1eb386] rounded-full mr-2 animate-pulse"></div>
                    Scanning...
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-4">
                <button
                  className="flex-1 py-2.5 border border-[#e0e2e7] rounded-md bg-white text-[#333843] text-[14px] hover:bg-gray-50 transition-colors"
                  onClick={stopScanning}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 py-2.5 bg-[#1eb386] text-white rounded-md text-[14px] hover:bg-[#40c79a] transition-colors"
                  onClick={() => {
                    if (!scanning) {
                      startScanning()
                    } else {
                      stopScanning()
                    }
                  }}
                >
                  {scanning ? "Stop Scanning" : "Start Scanning"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        <div className="flex flex-col md:flex-row justify-end gap-6 mt-4">
          <div className="w-full md:w-1/2 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between bg-[#f7f7f7] p-3 rounded-md font-semibold">
              <span className="text-[14px] text-[#667085] mb-3 sm:mb-0">Subtotal</span>
              <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 sm:gap-6">
                <div className="text-right">
                  <p className="text-[14px] text-[#333843]">{calculateTotalQuantity()}</p>
                  <p className="text-[13px] text-[#667085]">Unit(s)</p>
                </div>
                <div className="text-right text-[14px] text-[#333843]">
                  <p className="text-[14px] text-[#333843]">{calculateTotalIgst().toFixed(2)}</p>
                  <p className="text-[13px] text-[#667085]">(IGST)</p>
                </div>
                <div className="text-right text-[14px] text-[#333843]">
                  <p className="text-[14px] text-[#333843]">{calculateTotalIgst().toFixed(2)}</p>
                  <p className="text-[13px] text-[#667085]">(CGST)</p>
                </div>
                <div className="text-right text-[14px] text-[#333843]">
                  <p className="text-[14px] text-[#333843]">₹{calculateTotalBeforeTax().toFixed(2)}</p>
                  <p className="text-[13px] text-[#667085]">(Before tax amount)</p>
                </div>
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
                    <th className="py-2 px-3 text-left font-medium hidden sm:table-cell">CUSTOMER</th>
                    <th className="py-2 px-3 text-right font-medium">AMOUNT</th>
                    <th className="py-2 px-3 text-center font-medium">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {previousInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-[#f0f1f3] hover:bg-[#f9f9f9]">
                      <td className="py-3 px-3 text-[13px] sm:text-[14px] text-[#333843]">{invoice.id}</td>
                      <td className="py-3 px-3 text-[13px] sm:text-[14px] text-[#333843]">{invoice.billDate}</td>
                      <td className="py-3 px-3 text-[13px] sm:text-[14px] text-[#333843] hidden sm:table-cell">
                        {invoice.brandName}
                      </td>
                      <td className="py-3 px-3 text-right text-[13px] sm:text-[14px] text-[#333843]">
                        ₹{invoice.totalPayableAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button className="text-[#1eb386] hover:text-[#40c79a]">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {previousInvoices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-[#667085] text-[14px]">
                        No previous invoices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Preview Modal */}
      <Dialog open={showInvoicePreview} onClose={() => setShowInvoicePreview(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <Dialog.Panel className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-xl w-full">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-semibold text-[#333843]">Invoice Preview</Dialog.Title>
              <button
                className="text-[#667085] hover:text-[#333843] transition-colors"
                onClick={() => setShowInvoicePreview(false)}
              >
                <X size={20} />
              </button>
            </div>

            {currentInvoice && (
              <div className="bg-white p-6 rounded-md border border-[#e0e2e7]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#333843]">INVOICE</h2>
                    <p className="text-[#667085] mt-1">#{currentInvoice.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#333843]">Invoice Date: {currentInvoice.billDate}</p>
                    <p className="text-[#667085] mt-1">Due Date: {currentInvoice.paymentDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-medium text-[#333843] mb-2">From:</h3>
                    <p className="text-[#333843]">{businessDetails?.businessName}</p>
                    <p className="text-[#667085]">{businessDetails?.billingAddress}</p>
                    <p className="text-[#667085]">Email: {businessDetails?.companyEmail}</p>
                    <p className="text-[#667085]">Phone: {businessDetails?.companyNumber}</p>
                    <p className="text-[#667085]">GST: {businessDetails?.gstNumber}</p>                    
                  </div>
                  <div>
                    <h3 className="font-medium text-[#333843] mb-2">To:</h3>
                    <p className="text-[#333843]">{currentInvoice.brandName}</p>
                    <p className="text-[#667085]">{currentInvoice.billingAddress}</p>
                    <p className="text-[#667085]">Email: {currentInvoice.partyContactEmail}</p>
                    <p className="text-[#667085]">Phone: {currentInvoice.partyContactNumber}</p>
                    <p className="text-[#667085]">GST: {currentInvoice.partyGST}</p>
                  </div>
                </div>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#f7f7f7] text-[#667085]">
                        <th className="py-3 px-4 text-left font-medium">Item</th>
                        <th className="py-3 px-4 text-right font-medium">Qty</th>
                        <th className="py-3 px-4 text-right font-medium">Price</th>
                        <th className="py-3 px-4 text-right font-medium">Tax</th>
                        <th className="py-3 px-4 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentInvoice.items.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-[#f0f1f3]">
                          <td className="py-4 px-4">
                            <p className="text-[#333843] font-medium">{item.itemName}</p>
                            <p className="text-[#667085] text-sm">{item.itemCode}</p>
                          </td>
                          <td className="py-4 px-4 text-right text-[#333843]">
                            {item.inventory} {item.measuringUnit}
                          </td>
                          <td className="py-4 px-4 text-right text-[#333843]">₹{item.salesPrice}</td>
                          <td className="py-4 px-4 text-right text-[#333843]">{item.taxRate}%</td>
                          <td className="py-4 px-4 text-right text-[#333843]">
                            ₹
                            {(
                              Number(item.inventory) *
                              Number(item.salesPrice) *
                              (1 + Number(item.taxRate) / 100)
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between py-2">
                      <span className="text-[#667085]">Subtotal:</span>
                      <span className="text-[#333843]">₹{currentInvoice.totalBeforeTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-[#667085]">Tax:</span>
                      <span className="text-[#333843]">₹{currentInvoice.totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold border-t border-[#e0e2e7] mt-2 pt-2">
                      <span>Total:</span>
                      <span>₹{currentInvoice.totalAfterTax.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-[#667085] text-sm">
                  <p className="font-medium text-[#333843] mb-1">Terms & Conditions:</p>
                  <p>Please pay within 30 days of receiving this invoice.</p>
                  <p>Thank you for your business!</p>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleConfirmSaveInvoice}
                className="px-4 py-2 bg-[#1eb386] text-white rounded-md hover:bg-[#40c79a] transition-colors"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
