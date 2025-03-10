"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "./ui/checkbox"
import TemplatePreview from "./invoice-template-preview"
import ColorPicker from "./color-picker"
import DynamicInvoiceTemplate from "./dynamic-invoice-template"

export default function InvoiceSettingsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(1)
  const [selectedColor, setSelectedColor] = useState("#E5E7EB")
  const [invoiceDetails, setInvoiceDetails] = useState({
    image: true,
    invoiceType: true,
    partyBillingAddress: true,
    partyShippingAddress: false,
    balanceAmount: true,
    totalAmount: true,
  })

  const colors = [
    "#E5E7EB", // Light gray
    "#FCA5A5", // Light red
    "#000000", // Black
    "#F472B6", // Pink
    "#2DD4BF", // Teal
    "linear-gradient(to right, #f00, #0f0, #00f)", // Rainbow
  ]

  const handleTemplateChange = (templateId: number) => {
    setSelectedTemplate(templateId)
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }

  const handleCheckboxChange = (field: keyof typeof invoiceDetails) => {
    console.log(`Toggling ${field} from ${invoiceDetails[field]} to ${!invoiceDetails[field]}`)
    setInvoiceDetails((prev) => {
      const newState = {
        ...prev,
        [field]: !prev[field],
      }
      console.log("New state:", newState)
      return newState
    })
  }

  const handleSaveTemplate = () => {
    // Save template settings to backend or local storage
    console.log("Saving template settings:", {
      templateId: selectedTemplate,
      color: selectedColor,
      invoiceDetails,
    })
    // Show success message
    alert("Invoice template settings saved successfully!")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content - Invoice Preview */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Invoice Settings</h1>
          <p className="text-gray-600 mt-1 mb-6">An Overview of all your transactions over the year.</p>

          {/* Invoice Preview */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <DynamicInvoiceTemplate
              templateId={selectedTemplate}
              color={selectedColor}
              showImage={invoiceDetails.image}
              showInvoiceType={invoiceDetails.invoiceType}
              showBillingAddress={invoiceDetails.partyBillingAddress}
              showShippingAddress={invoiceDetails.partyShippingAddress}
              showBalanceAmount={invoiceDetails.balanceAmount}
              showTotalAmount={invoiceDetails.totalAmount}
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Customization Options */}
      <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
        <div className="space-y-8">
          {/* Templates Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Templates</h2>
              <a href="#" className="text-blue-600 text-sm">
                See All
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((id) => (
                <TemplatePreview
                  key={id}
                  id={id}
                  isSelected={selectedTemplate === id}
                  onClick={() => handleTemplateChange(id)}
                />
              ))}
            </div>
          </div>

          {/* Color Section */}
          <div>
            <h2 className="text-lg font-medium mb-4">Color</h2>
            <ColorPicker colors={colors} selectedColor={selectedColor} onChange={handleColorChange} />
          </div>

          {/* Invoice Details Section */}
          <div>
            <h2 className="text-lg font-medium mb-4">Invoice Details</h2>
            <div className="space-y-3">
              {[
                { id: "image", label: "Image" },
                { id: "invoiceType", label: "Invoice Type" },
                { id: "partyBillingAddress", label: "Party Billing Address" },
                { id: "partyShippingAddress", label: "Party Shipping Address" },
                { id: "balanceAmount", label: "Balance Amount" },
                { id: "totalAmount", label: "Total Amount" },
              ].map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={invoiceDetails[item.id as keyof typeof invoiceDetails]}
                    onCheckedChange={() => handleCheckboxChange(item.id as keyof typeof invoiceDetails)}
                  />
                  <label
                    htmlFor={item.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    onClick={() => handleCheckboxChange(item.id as keyof typeof invoiceDetails)}
                  >
                    {item.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white" onClick={handleSaveTemplate}>
            Set Invoice Template
          </Button>
        </div>
      </div>
    </div>
  )
}

