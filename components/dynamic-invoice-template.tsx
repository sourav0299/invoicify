"use client"
import { cn } from "@/lib/utils"

// Helper function to determine if a color is bright
const isColorBright = (color: string) => {
  // For hex colors
  if (color.startsWith("#")) {
    const hex = color.replace("#", "")
    const r = Number.parseInt(hex.substr(0, 2), 16)
    const g = Number.parseInt(hex.substr(2, 2), 16)
    const b = Number.parseInt(hex.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128
  }
  // For named colors, assume they're dark unless they're known light colors
  const lightColors = ["white", "ivory", "lightyellow", "lightgray", "lightblue", "lightpink"]
  return lightColors.includes(color.toLowerCase())
}

// Helper function to format currency
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
  return "/logo.png" // Replace with your actual logo path
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

  return (
    <div className="w-full print:w-full bg-white">
      <div
        className={cn(
          "w-full rounded-lg overflow-hidden print:overflow-visible shadow-lg",
          "print:bg-white print:text-black",
        )}
      >
        {templateId === 4 && (
          <div className="absolute top-0 left-0 w-full h-48 print:h-48" style={{ backgroundColor: color }}>
            <div className="absolute bottom-0 w-full">
              <svg className="w-full" viewBox="0 0 1440 320">
                <path
                  fill="#ffffff"
                  fillOpacity="1"
                  d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
            </div>
          </div>
        )}

        <div className="relative p-10 print:p-10">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-12">
            {showImage && (
              <div className="w-48 h-auto print:w-48">
                <img
                  src={getLogo() || "/placeholder.svg"}
                  alt="Company Logo"
                  className="w-full h-20 object-contain print:object-contain"
                />
              </div>
            )}

            <div className="text-right">
              <h1 className="text-3xl font-bold mb-2 print:text-3xl" style={{ color }}>
                INVOICE
              </h1>
              <div className="text-gray-600">
                <p className="print:text-base font-medium"># {data?.invoiceNumber || "INV-0001"}</p>
                <p className="print:text-base">Issue Date: {data?.billDate || "April 20, 2025"}</p>
                <p className="print:text-base">Due Date: {data?.paymentDeadline || "May 20, 2025"}</p>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="grid grid-cols-2 gap-12 mb-12 print:grid-cols-2">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 print:text-lg" style={{ color }}>
                Bill From:
              </h3>
              <p className="text-gray-800 font-medium print:text-base">{data?.brandName || "Brand Name"}</p>
              <p className="text-gray-600 print:text-base">{data?.billingAddress || "Address"}</p>
              <p className="text-gray-600 print:text-base">{data?.partyContactEmail || "Email"}</p>
              {data?.partyContactNumber && <p className="text-gray-600 print:text-base">{data.partyContactNumber}</p>}
              {data?.partyGst && <p className="text-gray-600 print:text-base">GST: {data.partyGst}</p>}
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3 print:text-lg" style={{ color }}>
                Bill To:
              </h3>
              <p className="text-gray-800 font-medium print:text-base">{data?.brandName || "Customer Name"}</p>
              <p className="text-gray-600 print:text-base">{data?.billingAddress || "Address"}</p>
              <p className="text-gray-600 print:text-base">{data?.partyContactEmail || "Email"}</p>
              {data?.partyContactNumber && <p className="text-gray-600 print:text-base">{data.partyContactNumber}</p>}
              {data?.partyGst && <p className="text-gray-600 print:text-base">GST: {data.partyGst}</p>}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <table className="w-full border-collapse print:border-collapse">
              <thead>
                <tr style={{ backgroundColor: `${color}15` }}>
                  <th
                    className="p-4 text-left font-semibold border-b-2 print:border-b-2"
                    style={{ borderColor: color }}
                  >
                    Item
                  </th>
                  <th
                    className="p-4 text-center font-semibold border-b-2 print:border-b-2"
                    style={{ borderColor: color }}
                  >
                    Quantity
                  </th>
                  <th
                    className="p-4 text-right font-semibold border-b-2 print:border-b-2"
                    style={{ borderColor: color }}
                  >
                    Rate
                  </th>
                  <th
                    className="p-4 text-right font-semibold border-b-2 print:border-b-2"
                    style={{ borderColor: color }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((item, index) => (
                  <tr key={index} className="border-b print:border-b hover:bg-gray-50">
                    <td className="p-4 print:p-4">
                      <div className="font-medium">{item.itemName}</div>
                      {item.itemCode && <div className="text-sm text-gray-500">Code: {item.itemCode}</div>}
                    </td>
                    <td className="p-4 text-center print:p-4">
                      {item.quantity} {item.measuringUnit}
                    </td>
                    <td className="p-4 text-right print:p-4">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-4 text-right print:p-4">{formatCurrency(item.beforeTaxAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="flex justify-end print:justify-end">
            <div className="w-1/3 space-y-3 print:w-1/3 bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between print:justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(data?.totalBeforeTax || 0)}</span>
              </div>
              <div className="flex justify-between print:justify-between text-gray-600">
                <span>Tax ({data?.totalTax || 0}%):</span>
                <span>{formatCurrency(data?.totalTax || 0)}</span>
              </div>
              {data?.discount !== undefined && data.discount > 0 && (
                <div className="flex justify-between print:justify-between text-gray-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(data.discount)}</span>
                </div>
              )}
              {data?.additionalCharges !== undefined && data.additionalCharges > 0 && (
                <div className="flex justify-between print:justify-between text-gray-600">
                  <span>Additional Charges:</span>
                  <span>{formatCurrency(data.additionalCharges)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-3 border-t print:font-bold" style={{ color }}>
                <span>Total:</span>
                <span>{formatCurrency(data?.totalPayableAmount || 0)}</span>
              </div>
            </div>
          </div>

       
          {showSignature && (
            <div className="mt-16 pt-8 border-t print:mt-16 print:pt-8 print:border-t">
              <div className="flex justify-between items-end">
                <div>
                  <p className="font-semibold mb-10 print:font-semibold text-gray-600">Authorized Signature</p>
                  <div className="w-48 h-0.5 bg-gray-300 print:bg-gray-300"></div>
                </div>
                {showQRCode && (
                  <div className="w-28 h-28 print:w-28 print:h-28 border p-2 rounded-md">
                 
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      QR Code
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
