"use client"

import { useRef, useEffect, useState } from 'react'
import { usePDF } from 'react-to-pdf'
import { Button } from './ui/button'
import { FileDown } from 'lucide-react'
import DynamicInvoiceTemplate from './dynamic-invoice-template'
import React from 'react'
import { cn } from '@/lib/utils'

interface InvoicePDFProps {
  invoice: {
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

interface TemplateSettings {
  templateId: number
  color: string
  invoiceDetails: {
    image: boolean
    invoiceType: boolean
    partyBillingAddress: boolean
    partyShippingAddress: boolean
    balanceAmount: boolean
    totalAmount: boolean
  }
}

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

// Helper function to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

interface DynamicInvoiceTemplateProps {
  templateId: number
  color?: string
  showLogo?: boolean
  showSignature?: boolean
  showQRCode?: boolean
  showWatermark?: boolean
  data: {
    brandName?: string
    billingAddress?: string
    partyContactEmail?: string
    items: Array<{
      itemName: string
      quantity: number
      unitPrice: number
      beforeTaxAmount: number
    }>
    totalBeforeTax?: number
    totalTax?: number
    totalPayableAmount?: number
  }
}

export default function InvoicePDF({ invoice }: InvoicePDFProps) {
  const [settings, setSettings] = useState<TemplateSettings>({
    templateId: 1,
    color: "#262930",
    invoiceDetails: {
      image: true,
      invoiceType: true,
      partyBillingAddress: true,
      partyShippingAddress: false,
      balanceAmount: true,
      totalAmount: true,
    }
  })

  const { targetRef, toPDF } = usePDF({
    filename: `invoice-${invoice.invoiceNumber}.pdf`,
    method: 'save'
  })

  useEffect(() => {
    // Load template settings from localStorage
    const savedSettings = localStorage.getItem('invoiceTemplateSettings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(parsed)
      } catch (error) {
        console.error('Error loading template settings:', error)
      }
    }
  }, [])

  const handleDownload = async () => {
    try {
      await toPDF()
    } catch (error) {
      console.error('Failed to generate PDF:', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Download PDF
        </button>
      </div>
      <div 
        ref={targetRef}
        className="w-full max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md print:p-0 print:shadow-none print:max-w-none"
      >
        <div className="print:block print:w-full print:max-w-none print:bg-white print:p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 print:text-2xl">INVOICE</h1>
              <p className="text-gray-600 print:text-gray-600">#{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 print:text-gray-600">Date: {formatDate(invoice.billDate)}</p>
              <p className="text-gray-600 print:text-gray-600">Due: {formatDate(invoice.paymentDeadline)}</p>
            </div>
          </div>
          <DynamicInvoiceTemplate
            templateId={settings.templateId}
            color={settings.color}
            showImage={settings.invoiceDetails.image}
            showInvoiceType={settings.invoiceDetails.invoiceType}
            showBillingAddress={settings.invoiceDetails.partyBillingAddress}
            showShippingAddress={settings.invoiceDetails.partyShippingAddress}
            showBalanceAmount={settings.invoiceDetails.balanceAmount}
            showTotalAmount={settings.invoiceDetails.totalAmount}
            data={invoice}
          />
        </div>
      </div>
    </div>
  )
} 