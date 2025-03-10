"use client"

import { useState } from "react"
// import { InvoiceGenerator, Template } from 'react-invoice-generator' // Invalid package
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const templates = [
  { id: 1, name: "Template 1", image: "/placeholder.svg?height=100&width=100" },
  { id: 2, name: "Template 2", image: "/placeholder.svg?height=100&width=100" },
  { id: 3, name: "Template 3", image: "/placeholder.svg?height=100&width=100" },
  { id: 4, name: "Template 4", image: "/placeholder.svg?height=100&width=100" },
]

const colors = [
  { id: 1, value: "#E5E7EB" },
  { id: 2, value: "#FCA5A5" },
  { id: 3, value: "#000000" },
  { id: 4, value: "#F472B6" },
  { id: 5, value: "#2DD4BF" },
  { id: 6, value: "linear-gradient(to right, #ff0000, #00ff00, #0000ff)" },
]

export default function InvoiceSettings() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [selectedColor, setSelectedColor] = useState(colors[0].value)
  const [invoiceDetails, setInvoiceDetails] = useState({
    image: true,
    invoiceType: true,
    partyBillingAddress: true,
    partyShippingAddress: true,
    balanceAmount: true,
    totalAmount: true,
  })

  const handleTemplateChange = (template: (typeof templates)[0]) => {
    setSelectedTemplate(template)
  }

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
  }

  const handleInvoiceDetailChange = (detail: keyof typeof invoiceDetails) => {
    setInvoiceDetails((prev) => ({ ...prev, [detail]: !prev[detail] }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Tabs defaultValue="preview">
        <TabsList className="mb-4">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div className="border rounded-lg p-4">
            {/* <InvoiceGenerator // Removed due to invalid package
              template={selectedTemplate.name as Template}
              data={{
                invoice: {
                  name: 'Sourav Kumar',
                  address: '123 Sector-26, 38200 Gandhinagar, France',
                  phone: '848172194',
                  email: 'contact@dezainahub.com',
                  logoUrl: '/placeholder.svg?height=100&width=100',
                },
                customer: {
                  name: 'Karuna Shrestha',
                  address: '1445 West Avenue, Kormangaa, Bangalore, India',
                  email: 'Karuna@Minesh.com',
                },
                items: [
                  { name: 'Product Name', quantity: 150, price: 20 },
                  { name: 'Product Name', quantity: 150, price: 20 },
                ],
                bottomNotice: 'Please pay within 15 days of receiving this invoice.',
              }}
              color={selectedColor}
            /> */}
            <div>Preview Placeholder</div>
          </div>
        </TabsContent>
        <TabsContent value="customize">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Templates</h2>
              <div className="grid grid-cols-2 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`cursor-pointer border rounded-lg p-2 ${
                      selectedTemplate.id === template.id ? "border-blue-500" : ""
                    }`}
                    onClick={() => handleTemplateChange(template)}
                  >
                    <img src={template.image || "/placeholder.svg"} alt={template.name} className="w-full h-auto" />
                    <p className="text-center mt-2">{template.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Color</h2>
              <div className="flex flex-wrap gap-4">
                {colors.map((color) => (
                  <div
                    key={color.id}
                    className={`w-8 h-8 rounded-full cursor-pointer ${
                      selectedColor === color.value ? "ring-2 ring-blue-500" : ""
                    }`}
                    style={{ background: color.value }}
                    onClick={() => handleColorChange(color.value)}
                  />
                ))}
              </div>
              <h2 className="text-xl font-semibold mt-6 mb-4">Invoice Details</h2>
              <div className="space-y-4">
                {Object.entries(invoiceDetails).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={() => handleInvoiceDetailChange(key as keyof typeof invoiceDetails)}
                    />
                    <Label htmlFor={key}>
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button className="mt-6 w-full">Set Invoice Template</Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}

