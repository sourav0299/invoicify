"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import InvoiceTemplate from "./invoice-template"

export default function InvoiceSettingsContent() {
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

  const handleTemplateChange = (templateId: number) => {
    setSelectedTemplate(templateId)
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }

  const handleCheckboxChange = (field: keyof typeof invoiceDetails) => {
    setInvoiceDetails((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Invoice Settings</h1>
        <p className="text-gray-600 mt-1 mb-6">An Overview of all your transactions over the year.</p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Invoice Preview Section */}
          <div className="flex-grow lg:w-2/3 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <InvoiceTemplate
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

          {/* Customization Section */}
          <div className="lg:w-1/3 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="space-y-6">
              {/* Templates */}
              <div>
                <h2 className="text-lg font-medium mb-4">Templates</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((id) => (
                    <div
                      key={id}
                      className={`cursor-pointer rounded-md border ${selectedTemplate === id ? "border-teal-500 ring-1 ring-teal-500" : "border-gray-200"}`}
                      onClick={() => handleTemplateChange(id)}
                    >
                      <div className="p-2">
                        <div className="bg-gray-100 aspect-video rounded-sm flex items-center justify-center">
                          <div className="w-full px-2">
                            <div className="h-1 bg-gray-300 w-full mb-1 rounded-sm"></div>
                            <div className="h-1 bg-gray-300 w-3/4 mb-1 rounded-sm"></div>
                            <div className="h-1 bg-gray-300 w-1/2 mb-1 rounded-sm"></div>
                            <div className="h-4"></div>
                            <div className="h-2 bg-gray-300 w-1/4 mb-1 rounded-sm"></div>
                          </div>
                        </div>
                        <p className="text-center text-sm mt-1">Template {id}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h2 className="text-lg font-medium mb-4">Color</h2>
                <div className="flex flex-wrap gap-3">
                  {[
                    "#E5E7EB", // Light gray
                    "#FCA5A5", // Light red
                    "#000000", // Black
                    "#F472B6", // Pink
                    "#2DD4BF", // Teal
                    "linear-gradient(to right, #f00, #0f0, #00f)", // Rainbow
                  ].map((color, index) => (
                    <div
                      key={index}
                      className={`w-10 h-10 rounded-md cursor-pointer ${selectedColor === color ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                      style={{ background: color }}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Invoice Details */}
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
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
      </div>
    </div>
  )
}

