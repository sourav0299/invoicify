import { Dialog, DialogContent } from "../components/ui/dialog"
import DynamicInvoiceTemplate from "./dynamic-invoice-template"
import InvoicePDF from "./invoice-pdf"
import { useEffect, useState } from "react"

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
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
  showPdfPreview?: boolean
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

export default function InvoiceModal({ isOpen, onClose, invoice, showPdfPreview = false }: InvoiceModalProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw]">
        {showPdfPreview ? (
          <InvoicePDF invoice={invoice} />
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  )
} 