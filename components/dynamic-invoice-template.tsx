"use client"

import React from 'react';
import { cn } from '@/lib/utils';

// Helper function to determine if a color is bright
const isColorBright = (color: string) => {
  // For hex colors
  if (color.startsWith("#")) {
    const hex = color.replace("#", "")
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128
  }
  // For named colors, assume they're dark unless they're known light colors
  const lightColors = ["white", "ivory", "lightyellow", "lightgray", "lightblue", "lightpink"]
  return lightColors.includes(color.toLowerCase())
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount).replace('₹', '₹ ')
}

// Helper function to get logo
const getLogo = () => {
  return '/logo.png' // Replace with your actual logo path
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
  color = '#1eb386',
  showImage = true,
  showInvoiceType = true,
  showBillingAddress = true,
  showShippingAddress = true,
  showBalanceAmount = true,
  showTotalAmount = true,
  showSignature = true,
  showQRCode = true,
  data
}: DynamicInvoiceTemplateProps) {
  const isDarkColor = !isColorBright(color);
  const textColor = isDarkColor ? 'text-white' : 'text-gray-900';

  return (
    <div className="w-full print:w-full">
      <div className={cn(
        "w-full rounded-lg overflow-hidden print:overflow-visible",
        "print:bg-white print:text-black"
      )}>
        {templateId === 4 && (
          <div 
            className="absolute top-0 left-0 w-full h-40 print:h-40"
            style={{ backgroundColor: color }}
          >
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

        <div className="relative p-8 print:p-8">
          <div className="flex justify-between items-start mb-8">
            {showImage && (
              <div className="w-40 h-auto print:w-40">
                <img
                  src={getLogo()}
                  alt="Company Logo"
                  className="w-full h-auto object-contain print:object-contain"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8 print:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2 print:text-lg">Bill From:</h3>
              <p className="print:text-base">{data?.brandName || 'Brand Name'}</p>
              <p className="print:text-base">{data?.billingAddress || 'Address'}</p>
              <p className="print:text-base">{data?.partyContactEmail || 'Email'}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 print:text-lg">Bill To:</h3>
              <p className="print:text-base">{data?.brandName || 'Customer Name'}</p>
              <p className="print:text-base">{data?.billingAddress || 'Address'}</p>
              <p className="print:text-base">{data?.partyContactEmail || 'Email'}</p>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full border-collapse print:border-collapse">
              <thead>
                <tr className="bg-gray-100 print:bg-gray-100">
                  <th className="p-3 text-left border print:border print:p-3">Item</th>
                  <th className="p-3 text-left border print:border print:p-3">Quantity</th>
                  <th className="p-3 text-left border print:border print:p-3">Rate</th>
                  <th className="p-3 text-left border print:border print:p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data?.items.map((item, index) => (
                  <tr key={index} className="border-b print:border-b">
                    <td className="p-3 border print:border print:p-3">{item.itemName}</td>
                    <td className="p-3 border print:border print:p-3">{item.quantity}</td>
                    <td className="p-3 border print:border print:p-3">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-3 border print:border print:p-3">{formatCurrency(item.beforeTaxAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end print:justify-end">
            <div className="w-1/3 space-y-2 print:w-1/3">
              <div className="flex justify-between print:justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(data?.totalBeforeTax || 0)}</span>
              </div>
              <div className="flex justify-between print:justify-between">
                <span>Tax ({data?.totalTax || 0}%):</span>
                <span>{formatCurrency(data?.totalTax || 0)}</span>
              </div>
              <div className="flex justify-between font-bold print:font-bold">
                <span>Total:</span>
                <span>{formatCurrency(data?.totalPayableAmount || 0)}</span>
              </div>
            </div>
          </div>

          {showSignature && (
            <div className="mt-12 pt-8 border-t print:mt-12 print:pt-8 print:border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold mb-8 print:font-semibold">Authorized Signature</p>
                  <div className="w-40 h-0.5 bg-gray-300 print:bg-gray-300"></div>
                </div>
                {showQRCode && (
                  <div className="w-24 h-24 print:w-24 print:h-24">
                    {/* QR Code implementation */}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

