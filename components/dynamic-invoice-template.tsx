"use client"

import { useState, useEffect } from "react"

const isColorBright = (color: string) => {
  if (color.startsWith("#")) {
    const hex = color.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128
  }

  const lightColors = ["white", "ivory", "lightyellow", "lightgray", "lightblue", "lightpink"]
  return lightColors.includes(color.toLowerCase())
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  })
    .format(amount)
    .replace("₹", "₹ ")
}

// Helper function to get logo
const getLogo = () => {
  return "/logo.png"
}

interface DynamicInvoiceTemplateProps {
  templateId: number
  color: string
  showImage: boolean
  showInvoiceType: boolean
  showBillingAddress: boolean
  showShippingAddress: boolean
  showBalanceAmount: boolean
  showTotalAmount: boolean
  showSignature?: boolean
  showQRCode?: boolean
  data?: {
    id: string
    invoiceNumber: string
    billDate: string
    paymentDeadline: string
    billingAddress: string
    brandName: string
    partyContactEmail: string
    partyContactNumber: string
    partyGst: string
    items: Array<{
      itemName: string
      itemType: string
      itemCode: string
      quantity: number
      measuringUnit: string
      unitPrice: number
      tax: number
      beforeTaxAmount: number
      afterTaxAmount: number
    }>
    totalTax: number
    totalBeforeTax: number
    totalAfterTax: number
    additionalCharges: number
    roundOff: number
    discount: number
    totalPayableAmount: number
  }
}

export default function DynamicInvoiceTemplate({
  templateId,
  color = "#1eb386",
  showImage = true,
  showInvoiceType = true,
  showBillingAddress = true,
  showShippingAddress = true,
  showBalanceAmount = true,
  showTotalAmount = true,
  showSignature = true,
  showQRCode = true,
  data,
}: DynamicInvoiceTemplateProps) {
  const isDarkColor = !isColorBright(color)
  const textColor = isDarkColor ? "text-white" : "text-gray-900"
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640)
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  return (
    <div className="w-full flex justify-center bg-white">
      <div className="w-full max-w-4xl print:w-full">
        <div className="w-full rounded-lg overflow-hidden print:overflow-visible shadow-lg">
          {/* Header */}
          <div className="bg-gray-800 text-white p-4 sm:p-6 print:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-0">
              {showImage && (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:space-x-4 text-center sm:text-left">
                  <div className="w-16 h-16 print:w-16 print:h-16">
                    <img
                      src={getLogo() || "/placeholder.svg"}
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{data?.brandName || ""}</h2>
                    <p className="text-sm opacity-80">
                      {data?.billingAddress?.split(",")[0] || ""}, {data?.billingAddress?.split(",")[1] || ""}
                    </p>
                    <p className="text-sm opacity-80">
                      {data?.partyContactNumber || ""} {data?.partyContactEmail ? ` ${data?.partyContactEmail}` : ""}
                    </p>
                    <p className="text-sm opacity-80">GST: {data?.partyGst || ""}</p>
                    <p className="text-sm opacity-80">CIN: {data?.id || ""}</p>
                  </div>
                </div>
              )}
              <div className="text-center sm:text-right">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 print:text-3xl">INVOICE</h1>
                <p className="text-lg">#{data?.invoiceNumber || ""}</p>
              </div>
            </div>
          </div>

          {/* Invoice Body */}
          <div className="p-4 sm:p-6 print:p-6">
            {/* Billing Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 print:grid-cols-3">
              <div>
                <h3 className="font-semibold text-gray-500 mb-2">Bill From</h3>
                <h4 className="font-bold">{data?.brandName || ""}</h4>
                <p className="text-sm text-gray-600">{data?.billingAddress || ""}</p>
                <p className="text-sm text-gray-600">
                  {data?.partyContactNumber || ""} {data?.partyContactEmail ? ` ${data?.partyContactEmail}` : ""}
                </p>
                <p className="text-sm text-gray-600">GST: {data?.partyGst || ""}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-500 mb-2">Bill Date</h3>
                <p className="text-sm text-gray-600">{data?.billDate || ""}</p>

                <h3 className="font-semibold text-gray-500 mt-4 mb-2">Payment Deadline</h3>
                <p className="text-sm text-gray-600">{data?.paymentDeadline || ""}</p>
              </div>
            </div>

            {/* Items Table - Responsive version */}
            <div className="mb-8 overflow-x-auto">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th scope="col" className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium">NO.</th>
                        <th scope="col" className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium">ARTICLE</th>
                        <th scope="col" className="py-3 px-2 sm:px-4 text-center text-xs sm:text-sm font-medium">QTY</th>
                        <th scope="col" className="py-3 px-2 sm:px-4 text-center text-xs sm:text-sm font-medium">PRICE</th>
                        <th scope="col" className="py-3 px-2 sm:px-4 text-center text-xs sm:text-sm font-medium">TAX</th>
                        <th scope="col" className="py-3 px-2 sm:px-4 text-right text-xs sm:text-sm font-medium">AMOUNT</th>
                        <th scope="col" className="py-3 px-2 sm:px-4 text-right text-xs sm:text-sm font-medium">FINAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(data?.items || []).map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{index + 1}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                            <div className="font-medium">{item.itemName}</div>
                            <div className="text-xs text-gray-500">{item.itemCode}</div>
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm">
                            {item.quantity} {item.measuringUnit}
                          </td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm">₹{item.unitPrice}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm">{item.tax}%</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs sm:text-sm">₹{item.beforeTaxAmount.toLocaleString("en-IN")}</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-xs sm:text-sm">₹{item.afterTaxAmount.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="flex justify-end">
              <div className="w-full sm:w-1/2 lg:w-1/3">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Total Amount(Before tax)

                    </span>
                    <span>₹{(data?.totalBeforeTax || 0).toLocaleString("en-IN")}</span>
                  </div>
                 
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Total Tax</span>
                    <span>₹{(data?.totalTax || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t text-sm sm:text-base">
                    <span>Total Price</span>
                    <span>₹{(data?.totalPayableAmount || 0).toLocaleString("en-IN")}</span>
                  </div>
                  
                 
                </div>
              </div>
            </div>

            {showSignature && (
              <div className="mt-8 sm:mt-12 flex justify-between">
                <div>
                  <p className="font-semibold mb-1 text-sm sm:text-base">Authorised Sign</p>
                  <p className="font-bold text-sm sm:text-base">
                    {data?.brandName?.split(" ")[0] || ""} {data?.brandName?.split(" ")[1] || ""}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Designation</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {data?.partyContactNumber || ""} {data?.partyContactEmail ? ` ${data?.partyContactEmail}` : ""}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 sm:mt-12 pt-4 border-t">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Terms & Conditions</h3>
              <p className="text-xs sm:text-sm text-gray-600">Please pay within 15 days of receiving this invoice.</p>
            </div>
          </div>

          <div className="bg-gray-800 text-white p-3 sm:p-4 text-center">
            <p className="text-xs sm:text-sm">Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
