"use client"

interface DynamicInvoiceTemplateProps {
  templateId: number
  color: string
  showImage: boolean
  showInvoiceType: boolean
  showBillingAddress: boolean
  showShippingAddress: boolean
  showBalanceAmount: boolean
  showTotalAmount: boolean
}

export default function DynamicInvoiceTemplate({
  templateId,
  color,
  showImage,
  showInvoiceType,
  showBillingAddress,
  showShippingAddress,
  showBalanceAmount,
  showTotalAmount,
}: DynamicInvoiceTemplateProps) {
  // Helper function to determine if a color is a gradient
  const isGradient = (color: string) => color.includes("gradient")

  // Helper function to determine if a color is light or dark
  const isLightColor = (color: string) => {
    // For gradients, assume they're colorful enough to use dark text
    if (isGradient(color)) return true

    // For simple hex colors
    if (color.startsWith("#")) {
      const hex = color.replace("#", "")
      const r = Number.parseInt(hex.substr(0, 2) || "00", 16)
      const g = Number.parseInt(hex.substr(2, 2) || "00", 16)
      const b = Number.parseInt(hex.substr(4, 2) || "00", 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 128
    }

    // For named colors, assume they're dark unless they're known light colors
    const lightColors = ["white", "ivory", "lightyellow", "lightgray", "lightblue", "lightpink"]
    if (lightColors.includes(color.toLowerCase())) return true

    // Default to assuming it's dark
    return false
  }

  // If template 4 is selected, use the curved design
  if (templateId === 4) {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Header with curved element */}
        <div className="relative">
          {/* Curved blue element */}
          <div
            className="absolute top-0 left-0 w-1/3 h-40 bg-[#3b4a8f]"
            style={{
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
            }}
          ></div>

          <div className="relative z-10 p-6">
            <div className="flex justify-between items-start">
              {/* Logo and brand name */}
              <div className="flex items-center">
                {showImage && (
                  <div className="w-16 h-16 bg-[#f8f0e3] flex items-center justify-center mr-3 rounded-sm">
                    <div className="relative w-3/4 h-3/4">
                      <div className="absolute left-0 top-0 w-full h-full">
                        <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-[#FF7E33] rounded-tl-full"></div>
                        <div className="absolute left-0 top-0 w-3/4 h-3/4 bg-[#4A9FFF]"></div>
                      </div>
                    </div>
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-900">Brand Name</h2>
              </div>

              {/* Invoice box */}
              {showInvoiceType && (
                <div className="bg-[#e9ecf6] px-6 py-3 rounded-lg">
                  <h3 className="text-3xl font-bold text-[#3b4a8f]">INVOICE</h3>
                  <p className="text-[#3b4a8f] text-right">#2020-05-0001</p>
                </div>
              )}
            </div>

            {/* Company details */}
            <div className="mt-6">
              <p className="text-lg font-medium text-gray-800">Sourav Kumar</p>
              <div className="flex justify-between mt-1">
                <div>
                  <p className="text-gray-600">123 Sector-2c, 38200 Gandhinagar, France</p>
                  <p className="text-gray-600">848172194 | contact@dezainahub.com</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">GST: 362 521 879 00034</p>
                  <p className="text-gray-600">CIN: 842-484021</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Info and Dates */}
        <div className="bg-[#3b4a8f] text-white p-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {showBillingAddress && (
              <div>
                <h3 className="text-sm font-medium mb-2">Billing Address</h3>
                <p className="font-semibold text-lg">Karuna Shrestha</p>
                <p className="text-sm opacity-90">1445 West Avenue, Kormangaa, Bangalore, India</p>
                <p className="text-sm opacity-90">97223041054 | Karuna@Minesh.com</p>
                <p className="text-sm opacity-90">VAT: 842-484021</p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium mb-2">Note</h3>
              <p className="text-sm opacity-90">
                This is a custom message that might be relevant to the customer. It can span up to three or four rows.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Bill Date</h3>
              <p className="font-semibold text-lg">03/05/2020</p>

              <h3 className="text-sm font-medium mt-4 mb-2">Payment Deadline</h3>
              <p className="font-semibold text-lg">05/18/2020</p>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#e9ecf6]">
                <th className="py-3 px-4 text-left font-medium text-gray-700">NO.</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">ARTICLE</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">QUANTITY</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">UNIT PRICE</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">TAX</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">AMOUNT</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">FINAL AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 text-gray-900">1</td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">Product Name</p>
                    <p className="text-gray-500">Product Description</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">
                  150
                  <br />
                  Unit(s)
                </td>
                <td className="py-4 px-4 text-gray-900">₹20</td>
                <td className="py-4 px-4 text-gray-900">0%</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-900">2</td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">Product Name</p>
                    <p className="text-gray-500">Product Description</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">
                  150
                  <br />
                  Unit(s)
                </td>
                <td className="py-4 px-4 text-gray-900">₹20</td>
                <td className="py-4 px-4 text-gray-900">0%</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
              </tr>
            </tbody>
          </table>

          {/* Totals and Signature */}
          <div className="flex flex-col md:flex-row justify-between p-6">
            {/* Signature box */}
            <div className="border border-gray-200 rounded-lg p-4 w-64 h-32 flex items-center justify-center mb-6 md:mb-0">
              <p className="text-gray-500 text-lg">Authorised Sign</p>
            </div>

            {/* Totals */}
            <div className="w-64">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Total HT</span>
                <span className="font-medium text-gray-900">₹3,000</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Total Disbursements</span>
                <span className="font-medium text-gray-900">₹30</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Total Tax</span>
                <span className="font-medium text-gray-900">₹0</span>
              </div>

              <div className="flex justify-between py-2 mt-1 bg-[#e9ecf6] px-3">
                <span className="text-gray-800 font-medium">Total Price</span>
                <span className="font-bold text-gray-900">₹3,030.00</span>
              </div>

              <div className="flex justify-between py-1 mt-1">
                <span className="text-gray-600">Amount Received</span>
                <span className="font-medium text-gray-900">₹1,530.00</span>
              </div>

              {showBalanceAmount && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Balance Remaining</span>
                  <span className="font-medium text-gray-900">₹1500</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with curved element */}
        <div className="relative">
          <div className="p-6">
            <p className="font-medium text-gray-800">Terms & Conditions</p>
            <p className="text-gray-600">Please pay within 15 days of receiving this invoice.</p>
          </div>

          {/* Curved blue element */}
          <div
            className="absolute bottom-0 right-0 w-full h-20 bg-[#3b4a8f]"
            style={{
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              borderTopLeftRadius: "100% 200%",
            }}
          ></div>
        </div>
      </div>
    )
  }

  // Other templates remain the same...
  // (I'm only showing the Template 4 code for brevity, but the full component would include all templates)

  // If template 1 is selected, use the modern dark design
  if (templateId === 1) {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Header section with dark background */}
        <div className="bg-[#262930] p-6 flex justify-between items-center">
          <div className="flex items-start gap-4">
            {showImage && (
              <div className="w-32 h-32 bg-[#f8f0e3] flex items-center justify-center">
                <div className="relative w-3/4 h-3/4">
                  <div className="absolute left-0 top-0 w-full h-full">
                    <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-[#FF7E33] rounded-tl-full"></div>
                    <div className="absolute left-0 top-0 w-3/4 h-3/4 bg-[#4A9FFF]"></div>
                  </div>
                </div>
              </div>
            )}
            <div className="text-white">
              <h2 className="text-xl font-bold mb-1">Brand Name</h2>
              <p className="text-gray-300 text-sm">123 Sector-2c, 38200 Gandhinagar, France</p>
              <p className="text-gray-300 text-sm">848172194 | contact@dezainahub.com</p>
              <p className="text-gray-300 text-sm">GST: 362 521 879 00034</p>
              <p className="text-gray-300 text-sm">CIN: 842-484021</p>
            </div>
          </div>
          <div className="text-right">
            {showInvoiceType && (
              <div className="mb-2">
                <h3 className="text-white text-4xl font-bold">INVOICE</h3>
                <p className="text-gray-300 text-xl mt-2">#2020-05-0001</p>
              </div>
            )}
          </div>
        </div>

        {/* Billing Info and Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50">
          {showBillingAddress && (
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-2">Billing Address</h3>
              <p className="font-semibold text-gray-900">Karuna Shrestha</p>
              <p className="text-gray-600 text-sm">1445 West Avenue, Kormangaa, Bangalore, India</p>
              <p className="text-gray-600 text-sm">97223041054 | Karuna@Minesh.com</p>
              <p className="text-gray-600 text-sm">VAT: 842-484021</p>
            </div>
          )}

          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-2">Note</h3>
            <p className="text-gray-600 text-sm">
              This is a custom message that might be relevant to the customer. It can span up to three or four rows.
            </p>
          </div>

          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-2">Bill Date</h3>
            <p className="font-semibold text-gray-900">03/05/2020</p>

            <h3 className="text-gray-500 text-sm font-medium mt-4 mb-2">Payment Deadline</h3>
            <p className="font-semibold text-gray-900">05/18/2020</p>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#262930] text-white">
                <th className="py-3 px-4 text-left font-medium">NO.</th>
                <th className="py-3 px-4 text-left font-medium">ARTICLE</th>
                <th className="py-3 px-4 text-left font-medium">QUANTITY</th>
                <th className="py-3 px-4 text-left font-medium">UNIT PRICE</th>
                <th className="py-3 px-4 text-left font-medium">TAX</th>
                <th className="py-3 px-4 text-left font-medium">AMOUNT</th>
                <th className="py-3 px-4 text-left font-medium">FINAL AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 text-gray-900">1</td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">Product Name</p>
                    <p className="text-gray-500">Product Description</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">
                  150
                  <br />
                  Unit(s)
                </td>
                <td className="py-4 px-4 text-gray-900">₹20</td>
                <td className="py-4 px-4 text-gray-900">0%</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-4 px-4 text-gray-900">2</td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">Product Name</p>
                    <p className="text-gray-500">Product Description</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">
                  150
                  <br />
                  Unit(s)
                </td>
                <td className="py-4 px-4 text-gray-900">₹20</td>
                <td className="py-4 px-4 text-gray-900">0%</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 text-gray-900">3</td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">Product Name</p>
                    <p className="text-gray-500">Product Description</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">
                  150
                  <br />
                  Unit(s)
                </td>
                <td className="py-4 px-4 text-gray-900">₹20</td>
                <td className="py-4 px-4 text-gray-900">0%</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature and Totals */}
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <div className="border border-gray-200 rounded p-4 mb-4 w-48 h-24 flex items-center justify-center">
              <p className="text-gray-500">Authorised Sign</p>
            </div>
            <p className="font-semibold text-gray-900">Sourav Kumar</p>
            <p className="text-gray-500 text-sm">Designation</p>
            <p className="text-gray-500 text-sm">848172194 | contact@dezainahub.com</p>
          </div>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total HT</span>
                <span className="font-medium text-gray-900">₹3,000</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total Disbursements</span>
                <span className="font-medium text-gray-900">₹30</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total Tax</span>
                <span className="font-medium text-gray-900">₹0</span>
              </div>
              <div className="flex justify-between py-1 border-t border-gray-200 mt-1 pt-1">
                <span className="text-gray-800 font-medium">Total Price</span>
                <span className="font-bold text-gray-900">₹3,030.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Amount Received</span>
                <span className="font-medium text-gray-900">₹3,030.00</span>
              </div>
              {showBalanceAmount && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-600 text-sm">Balance Remaining</span>
                  <span className="font-medium text-gray-900">₹0</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-[#262930] p-6 text-white">
          <p className="font-medium">Terms & Conditions</p>
          <p className="text-gray-300 text-sm">Please pay within 15 days of receiving this invoice.</p>
        </div>
      </div>
    )
  }

  // If template 2 is selected, use the clean minimalist design
  if (templateId === 2) {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Header section */}
        <div className="p-6 flex justify-between items-start">
          <div className="flex items-start gap-4">
            {showImage && (
              <div className="w-32 h-32 bg-[#f8f0e3] flex items-center justify-center">
                <div className="relative w-3/4 h-3/4">
                  <div className="absolute left-0 top-0 w-full h-full">
                    <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-[#FF7E33] rounded-tl-full"></div>
                    <div className="absolute left-0 top-0 w-3/4 h-3/4 bg-[#4A9FFF]"></div>
                  </div>
                </div>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">RP Home Decor</h2>
              <p className="text-gray-600 text-sm">Minesh Patel</p>
              <p className="text-gray-600 text-sm">123 Sector-2c, 38200 Gandhinagar, France</p>
              <p className="text-gray-600 text-sm">848172194 | contact@dezainahub.com</p>
              <p className="text-gray-600 text-sm">GST: 362 521 879 00034</p>
              <p className="text-gray-600 text-sm">CIN: 842-484021</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gray-100 px-3 py-1 rounded-md inline-block mb-4">
              <p className="text-gray-700">#2020-05-0001</p>
            </div>
            {showTotalAmount && (
              <div className="mt-2">
                <p className="text-gray-600 text-sm">Total Amount</p>
                <p className="text-3xl font-bold text-gray-800">₹3,030.00</p>
              </div>
            )}
          </div>
        </div>

        {/* Main content with sidebar */}
        <div className="border-t border-gray-200 flex flex-col md:flex-row">
          {/* Left sidebar */}
          <div className="md:w-1/4 bg-gray-50 p-6">
            <div className="mb-6">
              <h3 className="text-gray-500 text-sm font-medium mb-2">Bill Date</h3>
              <p className="font-semibold text-gray-900">03/05/2020</p>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-2">Payment Deadline</h3>
              <p className="font-semibold text-gray-900">05/18/2020</p>
            </div>
          </div>

          {/* Right content */}
          <div className="md:w-3/4 p-6">
            {showBillingAddress && (
              <div className="mb-6">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Billing Address</h3>
                <p className="font-semibold text-gray-900">Karuna Shrestha</p>
                <p className="text-gray-600 text-sm">1445 West Avenue, Kormangaa, Bangalore, India</p>
                <p className="text-gray-600 text-sm">97223041054 | Karuna@Minesh.com</p>
                <p className="text-gray-600 text-sm">VAT: 842-484021</p>
              </div>
            )}

            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-2">Note</h3>
              <p className="text-gray-600 text-sm">
                This is a custom message that might be relevant to the customer. It can span up to three or four rows.
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="border-t border-gray-200 p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left font-medium text-gray-500">NO.</th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">ARTICLE</th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">QUANTITY</th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">UNIT PRICE</th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">TAX</th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">AMOUNT</th>
                <th className="py-3 px-4 text-left font-medium text-gray-500">FINAL AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 text-gray-900">1</td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">Product Name</p>
                    <p className="text-gray-500">Product Description</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">
                  150
                  <br />
                  Unit(s)
                </td>
                <td className="py-4 px-4 text-gray-900">₹20</td>
                <td className="py-4 px-4 text-gray-900">0%</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-4 px-4 text-gray-900">2</td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">Product Name</p>
                    <p className="text-gray-500">Product Description</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">
                  150
                  <br />
                  Unit(s)
                </td>
                <td className="py-4 px-4 text-gray-900">₹20</td>
                <td className="py-4 px-4 text-gray-900">0%</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mt-6">
            <div className="w-64">
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total HT</span>
                <span className="font-medium text-gray-900">₹3,000</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total Disbursements</span>
                <span className="font-medium text-gray-900">₹30</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total Tax</span>
                <span className="font-medium text-gray-900">₹0</span>
              </div>
              <div className="flex justify-between py-1 border-t border-gray-200 mt-1 pt-1">
                <span className="text-gray-800 font-medium">Total Price</span>
                <span className="font-bold text-gray-900">₹3,030.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Amount Received</span>
                <span className="font-medium text-gray-900">₹3,030.00</span>
              </div>
              {showBalanceAmount && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-600 text-sm">Balance Remaining</span>
                  <span className="font-medium text-gray-900">₹0</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-800">Terms & Conditions</p>
            <p className="text-gray-600 text-sm">Please pay within 15 days of receiving this invoice.</p>
          </div>

          <div className="border border-gray-200 rounded p-4 w-48 h-16 flex items-center justify-center">
            <p className="text-gray-500">Authorised Sign</p>
          </div>
        </div>
      </div>
    )
  }

  // If template 3 is selected, use the diagonal split design
  if (templateId === 3) {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Header section with diagonal split */}
        <div className="relative h-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[#e6f7f2]"></div>
          <div
            className="absolute top-0 right-0 w-1/2 h-full bg-[#0a5c4a]"
            style={{
              clipPath: "polygon(100% 0, 0 0, 100% 100%)",
            }}
          ></div>

          <div className="relative z-10 flex justify-between items-start p-6 h-full">
            <div className="text-gray-800">
              {showInvoiceType && (
                <div>
                  <h3 className="text-4xl font-bold">INVOICE</h3>
                  <p className="text-xl mt-2">#2020-05-0001</p>
                </div>
              )}
            </div>

            <div className="flex items-center">
              {showImage && (
                <div className="w-16 h-16 bg-[#f8f0e3] flex items-center justify-center mr-3">
                  <div className="relative w-3/4 h-3/4">
                    <div className="absolute left-0 top-0 w-full h-full">
                      <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-[#FF7E33] rounded-tl-full"></div>
                      <div className="absolute left-0 top-0 w-3/4 h-3/4 bg-[#4A9FFF]"></div>
                    </div>
                  </div>
                </div>
              )}
              <h2 className="text-xl font-bold text-white">Brand Name</h2>
            </div>
          </div>
        </div>

        {/* Billing Info and Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {showBillingAddress && (
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-2">Billing Address</h3>
              <p className="font-semibold text-gray-900">Karuna Shrestha</p>
              <p className="text-gray-600 text-sm">1445 West Avenue, Kormangaa, Bangalore, India</p>
              <p className="text-gray-600 text-sm">97223041054 | Karuna@Minesh.com</p>
              <p className="text-gray-600 text-sm">VAT: 842-484021</p>
            </div>
          )}

          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-2">Note</h3>
            <p className="text-gray-600 text-sm">
              This is a custom message that might be relevant to the customer. It can span up to three or four rows.
            </p>
          </div>

          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-2">Bill Date</h3>
            <p className="font-semibold text-gray-900">03/05/2020</p>

            <h3 className="text-gray-500 text-sm font-medium mt-4 mb-2">Payment Deadline</h3>
            <p className="font-semibold text-gray-900">05/18/2020</p>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#e6f7f2]">
                <th className="py-3 px-4 text-left font-medium text-gray-700">NO.</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">ARTICLE</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">QUANTITY</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">UNIT PRICE</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">TAX</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">AMOUNT</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">FINAL AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 text-gray-900">1</td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">Product Name</p>
                    <p className="text-gray-500">Product Description</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">
                  150
                  <br />
                  Unit(s)
                </td>
                <td className="py-4 px-4 text-gray-900">₹20</td>
                <td className="py-4 px-4 text-gray-900">0%</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 text-gray-900">2</td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">Product Name</p>
                    <p className="text-gray-500">Product Description</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">
                  150
                  <br />
                  Unit(s)
                </td>
                <td className="py-4 px-4 text-gray-900">₹20</td>
                <td className="py-4 px-4 text-gray-900">0%</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals and Signature */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <p className="font-semibold text-gray-900">Sourav Kumar</p>
              <p className="text-gray-600 text-sm">123 Sector-2c, 38200 Gandhinagar, France</p>
              <p className="text-gray-600 text-sm">848172194 | contact@dezainahub.com</p>
              <p className="text-gray-600 text-sm">GST: 362 521 879 00034</p>
              <p className="text-gray-600 text-sm">CIN: 842-484021</p>
            </div>

            <div className="border border-gray-200 rounded p-4 w-48 h-24 flex items-center justify-center">
              <p className="text-gray-500">Authorised Sign</p>
            </div>

            <div className="w-64">
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total HT</span>
                <span className="font-medium text-gray-900">₹3,000</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total Disbursements</span>
                <span className="font-medium text-gray-900">₹30</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total Tax</span>
                <span className="font-medium text-gray-900">₹0</span>
              </div>
              <div className="flex justify-between py-1 border-t border-gray-200 mt-1 pt-1">
                <span className="text-gray-800 font-medium">Total Price</span>
                <span className="font-bold text-gray-900">₹3,030.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Amount Received</span>
                <span className="font-medium text-gray-900">₹3,030.00</span>
              </div>
              {showBalanceAmount && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-600 text-sm">Balance Remaining</span>
                  <span className="font-medium text-gray-900">₹0</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative h-20">
          <div className="absolute bottom-0 left-0 w-full h-full bg-[#e6f7f2]"></div>
          <div
            className="absolute bottom-0 right-0 w-full h-full bg-[#0a5c4a]"
            style={{
              clipPath: "polygon(100% 0, 0% 100%, 100% 100%)",
            }}
          ></div>

          <div className="relative z-10 p-6">
            <p className="font-medium text-gray-800">Terms & Conditions</p>
            <p className="text-gray-600 text-sm">Please pay within 15 days of receiving this invoice.</p>
          </div>
        </div>
      </div>
    )
  }

  // If template 5 is selected, use the fully customizable design
  if (templateId === 5) {
    // Use the selected color for accents
    const accentColor = color || "#4F46E5"
    const isLight = isLightColor(accentColor)
    const textOnAccent = isLight ? "text-gray-900" : "text-white"
    const mutedTextOnAccent = isLight ? "text-gray-700" : "text-gray-200"

    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Header section with customizable color */}
        <div style={{ backgroundColor: accentColor }} className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              {showImage && (
                <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                  <div className="relative w-3/4 h-3/4">
                    <div className="absolute left-0 top-0 w-full h-full">
                      <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-[#FF7E33] rounded-tl-full"></div>
                      <div className="absolute left-0 top-0 w-3/4 h-3/4 bg-[#4A9FFF]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <h2 className={`text-xl font-bold ${textOnAccent} mb-1`}>Brand Name</h2>
                <p className={`text-sm ${mutedTextOnAccent}`}>123 Sector-2c, 38200 Gandhinagar, France</p>
                <p className={`text-sm ${mutedTextOnAccent}`}>848172194 | contact@dezainahub.com</p>
                <p className={`text-sm ${mutedTextOnAccent}`}>GST: 362 521 879 00034</p>
                <p className={`text-sm ${mutedTextOnAccent}`}>CIN: 842-484021</p>
              </div>
            </div>

            {showInvoiceType && (
              <div className="text-right">
                <h3 className={`text-3xl font-bold ${textOnAccent}`}>INVOICE</h3>
                <p className={`text-xl ${mutedTextOnAccent}`}>#2020-05-0001</p>
              </div>
            )}
          </div>
        </div>

        {/* Billing Info and Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {showBillingAddress && (
            <div>
              <h3 className="text-gray-500 text-sm font-medium mb-2">Billing Address</h3>
              <p className="font-semibold text-gray-900">Karuna Shrestha</p>
              <p className="text-gray-600 text-sm">1445 West Avenue, Kormangaa, Bangalore, India</p>
              <p className="text-gray-600 text-sm">97223041054 | Karuna@Minesh.com</p>
              <p className="text-gray-600 text-sm">VAT: 842-484021</p>
            </div>
          )}

          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-2">Note</h3>
            <p className="text-gray-600 text-sm">
              This is a custom message that might be relevant to the customer. It can span up to three or four rows.
            </p>
          </div>

          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-2">Bill Date</h3>
            <p className="font-semibold text-gray-900">03/05/2020</p>

            <h3 className="text-gray-500 text-sm font-medium mt-4 mb-2">Payment Deadline</h3>
            <p className="font-semibold text-gray-900">05/18/2020</p>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="px-6">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: accentColor }}>
                <th className={`py-3 px-4 text-left font-medium ${textOnAccent}`}>NO.</th>
                <th className={`py-3 px-4 text-left font-medium ${textOnAccent}`}>ARTICLE</th>
                <th className={`py-3 px-4 text-left font-medium ${textOnAccent}`}>QUANTITY</th>
                <th className={`py-3 px-4 text-left font-medium ${textOnAccent}`}>UNIT PRICE</th>
                <th className={`py-3 px-4 text-left font-medium ${textOnAccent}`}>TAX</th>
                <th className={`py-3 px-4 text-left font-medium ${textOnAccent}`}>AMOUNT</th>
                <th className={`py-3 px-4 text-left font-medium ${textOnAccent}`}>FINAL AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 text-gray-900">1</td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">Product Name</p>
                    <p className="text-gray-500">Product Description</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">
                  150
                  <br />
                  Unit(s)
                </td>
                <td className="py-4 px-4 text-gray-900">₹20</td>
                <td className="py-4 px-4 text-gray-900">0%</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
              </tr>
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-4 px-4 text-gray-900">2</td>
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">Product Name</p>
                    <p className="text-gray-500">Product Description</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900">
                  150
                  <br />
                  Unit(s)
                </td>
                <td className="py-4 px-4 text-gray-900">₹20</td>
                <td className="py-4 px-4 text-gray-900">0%</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
                <td className="py-4 px-4 text-gray-900">₹3,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signature and Totals */}
        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <div className="border border-gray-200 rounded p-4 mb-4 w-48 h-24 flex items-center justify-center">
              <p className="text-gray-500">Authorised Sign</p>
            </div>
            <p className="font-semibold text-gray-900">Sourav Kumar</p>
            <p className="text-gray-500 text-sm">Designation</p>
            <p className="text-gray-500 text-sm">848172194 | contact@dezainahub.com</p>
          </div>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total HT</span>
                <span className="font-medium text-gray-900">₹3,000</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total Disbursements</span>
                <span className="font-medium text-gray-900">₹30</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Total Tax</span>
                <span className="font-medium text-gray-900">₹0</span>
              </div>
              <div className="flex justify-between py-1 border-t border-gray-200 mt-1 pt-1">
                <span className="text-gray-800 font-medium">Total Price</span>
                <span className="font-bold text-gray-900">₹3,030.00</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">Amount Received</span>
                <span className="font-medium text-gray-900">₹3,030.00</span>
              </div>
              {showBalanceAmount && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-600 text-sm">Balance Remaining</span>
                  <span className="font-medium text-gray-900">₹0</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: accentColor }} className="p-6">
          <p className={`font-medium ${textOnAccent}`}>Terms & Conditions</p>
          <p className={`text-sm ${mutedTextOnAccent}`}>Please pay within 15 days of receiving this invoice.</p>
        </div>
      </div>
    )
  }

  // Apply template-specific styles based on templateId
  const getTemplateStyles = () => {
    switch (templateId) {
      case 3: // Diagonal Split
        return {
          containerStyle: "rounded-lg overflow-hidden",
          headerStyle: "flex flex-col md:flex-row gap-6 p-6",
          bodyStyle: "p-6",
          tableStyle: "mt-6",
          tableHeaderStyle: "",
          tableRowStyle: "border-b",
          footerStyle: "mt-6 p-6",
          accentColor: color || "#0a5c4a",
          fontFamily: '"Inter", sans-serif',
          logoStyle: "rounded-lg overflow-hidden",
          headingStyle: "text-xl font-semibold",
          subheadingStyle: "text-sm font-medium",
          textStyle: "text-sm",
          invoiceTypeStyle: "px-3 py-1 text-sm rounded font-medium",
          totalStyle: "text-2xl font-bold",
        }
      case 4: // Curved Design
        return {
          containerStyle: "rounded-lg overflow-hidden",
          headerStyle: "flex flex-col md:flex-row gap-6 p-6",
          bodyStyle: "p-6",
          tableStyle: "mt-6",
          tableHeaderStyle: "",
          tableRowStyle: "border-b",
          footerStyle: "mt-6 p-6",
          accentColor: color || "#3b4a8f",
          fontFamily: '"Inter", sans-serif',
          logoStyle: "rounded-lg overflow-hidden",
          headingStyle: "text-xl font-semibold",
          subheadingStyle: "text-sm font-medium",
          textStyle: "text-sm",
          invoiceTypeStyle: "px-3 py-1 text-sm rounded font-medium",
          totalStyle: "text-2xl font-bold",
        }
      case 5: // Customizable
        return {
          containerStyle: "rounded-lg overflow-hidden",
          headerStyle: "flex flex-col md:flex-row gap-6 p-6",
          bodyStyle: "p-6",
          tableStyle: "mt-6",
          tableHeaderStyle: "",
          tableRowStyle: "border-b",
          footerStyle: "mt-6 p-6",
          accentColor: color || "#4F46E5",
          fontFamily: '"Inter", sans-serif',
          logoStyle: "rounded-lg overflow-hidden",
          headingStyle: "text-xl font-semibold",
          subheadingStyle: "text-sm font-medium",
          textStyle: "text-sm",
          invoiceTypeStyle: "px-3 py-1 text-sm rounded font-medium",
          totalStyle: "text-2xl font-bold",
        }
      default:
        return {
          containerStyle: "rounded-lg overflow-hidden",
          headerStyle: "flex flex-col md:flex-row gap-6 p-6",
          bodyStyle: "p-6",
          tableStyle: "mt-6",
          tableHeaderStyle: "",
          tableRowStyle: "border-b",
          footerStyle: "mt-6 p-6",
          accentColor: color || "#2DD4BF",
          fontFamily: '"Inter", sans-serif',
          logoStyle: "rounded-lg overflow-hidden",
          headingStyle: "text-xl font-semibold",
          subheadingStyle: "text-sm font-medium",
          textStyle: "text-sm",
          invoiceTypeStyle: "px-3 py-1 text-sm rounded font-medium",
          totalStyle: "text-2xl font-bold",
        }
    }
  }

  const styles = getTemplateStyles()

  // Determine text and border colors based on background color
  const textColor = isGradient(color) ? "text-gray-900" : isLightColor(color) ? "text-gray-900" : "text-white"
  const mutedTextColor = isGradient(color) ? "text-gray-600" : isLightColor(color) ? "text-gray-600" : "text-gray-300"
  const borderColor = isGradient(color)
    ? "border-gray-200"
    : isLightColor(color)
      ? "border-gray-200"
      : "border-gray-700"
  const tableHeaderBg = isGradient(color) ? "bg-gray-50" : isLightColor(color) ? "bg-gray-50" : "bg-gray-800"
  const tableBg = isGradient(color) ? "bg-white" : isLightColor(color) ? "bg-white/10" : "bg-gray-900/30"

  // Helper function to apply color or gradient to elements
  const getColorStyle = (element: "text" | "border" | "background" | "shadow") => {
    if (isGradient(styles.accentColor)) {
      // For text with gradient, we need to use background-clip
      if (element === "text") {
        return {
          background: styles.accentColor,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }
      }
      // For borders with gradient, we need a different approach
      else if (element === "border") {
        return {
          borderWidth: "1px",
          borderStyle: "solid",
          borderImage: styles.accentColor.replace("linear-gradient", "linear-gradient") + " 1",
        }
      }
      // For shadow with gradient
      else if (element === "shadow") {
        // This is a simplified approach - true gradient shadows require more complex CSS
        return {
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
        }
      }
      // For background with gradient
      else {
        return {
          background: styles.accentColor,
        }
      }
    } else {
      // For solid colors
      if (element === "text") {
        return { color: styles.accentColor }
      } else if (element === "border") {
        return { borderColor: styles.accentColor }
      } else if (element === "shadow") {
        return { boxShadow: `0 4px 12px ${styles.accentColor}33` }
      } else {
        return { backgroundColor: styles.accentColor }
      }
    }
  }

  // Get template-specific logo
  const getLogo = () => {
    switch (templateId) {
      case 2: // Corporate Professional
        return (
          <div
            className={`w-24 h-24 ${styles.logoStyle} flex items-center justify-center overflow-hidden`}
            style={getColorStyle("background")}
          >
            <div className="text-white font-bold text-2xl">SK</div>
          </div>
        )
      case 3: // Diagonal Split
        return (
          <div
            className={`w-24 h-24 bg-white ${styles.logoStyle} flex items-center justify-center overflow-hidden border-2`}
            style={getColorStyle("border")}
          >
            <div className="font-extrabold text-3xl" style={getColorStyle("text")}>
              SK
            </div>
          </div>
        )
      case 4: // Curved Design
        return (
          <div
            className={`w-24 h-24 bg-white ${styles.logoStyle} flex items-center justify-center overflow-hidden border`}
          >
            <div className="font-light text-3xl tracking-widest">SK</div>
          </div>
        )
      default:
        return (
          <div className={`w-24 h-24 bg-white ${styles.logoStyle} flex items-center justify-center overflow-hidden`}>
            <div className="relative w-full h-full">
              <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-orange-400 rounded-tl-full"></div>
              <div className="absolute left-0 top-0 w-3/4 h-3/4 bg-blue-400"></div>
            </div>
          </div>
        )
    }
  }

  return (
    <div
      className={styles.containerStyle}
      style={{
        fontFamily: styles.fontFamily,
        background: color,
        color: isLightColor(color) ? "#333" : "#fff",
      }}
    >
      {/* Header section */}
      <div className={`${styles.headerStyle} ${borderColor}`} style={{ background: "transparent" }}>
        {/* Logo */}
        {showImage && <div className="flex-shrink-0">{getLogo()}</div>}

        {/* Company Details */}
        <div className="flex-grow">
          <h2 className={`${styles.headingStyle} ${textColor}`}>Sourav Kumar</h2>
          <p className={`${styles.textStyle} ${mutedTextColor}`}>Minesh Patel</p>
          <p className={`${styles.textStyle} ${mutedTextColor}`}>123 Sector-26, 38200 Gandhinagar, France</p>
          <p className={`${styles.textStyle} ${mutedTextColor}`}>848172194 | contact@dezainahub.com</p>
          <p className={`${styles.textStyle} ${mutedTextColor}`}>GST: 362 521 879 00034</p>
          <p className={`${styles.textStyle} ${mutedTextColor}`}>CIN: 842-484021</p>
        </div>

        {/* Invoice Number and Total */}
        <div className="text-right">
          {showInvoiceType && (
            <div className="mb-2">
              <span
                className={styles.invoiceTypeStyle}
                style={{
                  ...(templateId === 4
                    ? {
                        borderBottom: "2px solid",
                        borderColor: styles.accentColor,
                        borderRadius: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                      }
                    : getColorStyle("background")),
                  ...(templateId === 4 ? getColorStyle("text") : { color: "white" }),
                }}
              >
                INVOICE
              </span>
            </div>
          )}
          <p className={`${styles.textStyle} ${mutedTextColor}`}>#2020-05-0001</p>
          {showTotalAmount && (
            <div className="mt-2">
              <p className={`${styles.subheadingStyle} ${mutedTextColor}`}>Total Amount</p>
              <p className={styles.totalStyle} style={getColorStyle("text")}>
                ₹3,030.00
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Billing Info and Dates */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${styles.bodyStyle}`}
        style={{ background: "transparent" }}
      >
        <div>
          <h3 className={`${styles.subheadingStyle} ${mutedTextColor}`}>Bill Date</h3>
          <p className={`font-medium ${textColor}`}>03/05/2020</p>
        </div>
        <div>
          <h3 className={`${styles.subheadingStyle} ${mutedTextColor}`}>Payment Deadline</h3>
          <p className={`font-medium ${textColor}`}>05/18/2020</p>
        </div>
        {showBillingAddress && (
          <div>
            <h3 className={`${styles.subheadingStyle} ${mutedTextColor}`}>Billing Address</h3>
            <p className={`font-medium ${textColor}`}>Karuna Shrestha</p>
            <p className={`${styles.textStyle} ${mutedTextColor}`}>1445 West Avenue, Kormangaa, Bangalore, India</p>
            <p className={`${styles.textStyle} ${mutedTextColor}`}>97223041054 | Karuna@Minesh.com</p>
            <p className={`${styles.textStyle} ${mutedTextColor}`}>VAT: 842-484021</p>
          </div>
        )}
      </div>

      {showShippingAddress && (
        <div className={styles.bodyStyle} style={{ paddingTop: 0 }}>
          <h3 className={`${styles.subheadingStyle} ${mutedTextColor}`}>Shipping Address</h3>
          <p className={`font-medium ${textColor}`}>Karuna Shrestha</p>
          <p className={`${styles.textStyle} ${mutedTextColor}`}>1445 West Avenue, Kormangaa, Bangalore, India</p>
        </div>
      )}

      {/* Note */}
      <div className={styles.bodyStyle} style={{ paddingTop: 0 }}>
        <h3 className={`${styles.subheadingStyle} ${mutedTextColor}`}>Note</h3>
        <p className={`${styles.textStyle} ${mutedTextColor}`}>
          This is a custom message that might be relevant to the customer. It can span up to three or four rows.
        </p>
      </div>

      {/* Invoice Table */}
      <div
        className={`${styles.bodyStyle} ${styles.tableStyle} ${borderColor}`}
        style={{
          paddingTop: 0,
          background: "transparent",
        }}
      >
        <table className={`w-full text-sm`}>
          <thead>
            <tr className={`${styles.tableHeaderStyle} ${tableHeaderBg}`}>
              <th className={`py-3 px-4 text-left ${textColor}`}>NO.</th>
              <th className={`py-3 px-4 text-left ${textColor}`}>ARTICLE</th>
              <th className={`py-3 px-4 text-left ${textColor}`}>QUANTITY</th>
              <th className={`py-3 px-4 text-left ${textColor}`}>UNIT PRICE</th>
              <th className={`py-3 px-4 text-left ${textColor}`}>TAX</th>
              <th className={`py-3 px-4 text-left ${textColor}`}>AMOUNT</th>
              <th className={`py-3 px-4 text-left ${textColor}`}>FINAL AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr className={`${styles.tableRowStyle} ${borderColor} ${tableBg}`}>
              <td className={`py-4 px-4 ${textColor}`}>1</td>
              <td className="py-4 px-4">
                <div>
                  <p className={`font-medium ${textColor}`}>Product Name</p>
                  <p className={`${styles.textStyle} ${mutedTextColor}`}>Product Description</p>
                </div>
              </td>
              <td className={`py-4 px-4 ${textColor}`}>150 Unit(s)</td>
              <td className={`py-4 px-4 ${textColor}`}>₹20</td>
              <td className={`py-4 px-4 ${textColor}`}>0%</td>
              <td className={`py-4 px-4 ${textColor}`}>₹3,000</td>
              <td className={`py-4 px-4 ${textColor}`}>₹3,000</td>
            </tr>
            <tr className={`${styles.tableRowStyle} ${borderColor} ${tableBg}`}>
              <td className={`py-4 px-4 ${textColor}`}>2</td>
              <td className="py-4 px-4">
                <div>
                  <p className={`font-medium ${textColor}`}>Product Name</p>
                  <p className={`${styles.textStyle} ${mutedTextColor}`}>Product Description</p>
                </div>
              </td>
              <td className={`py-4 px-4 ${textColor}`}>150 Unit(s)</td>
              <td className={`py-4 px-4 ${textColor}`}>₹20</td>
              <td className={`py-4 px-4 ${textColor}`}>0%</td>
              <td className={`py-4 px-4 ${textColor}`}>₹3,000</td>
              <td className={`py-4 px-4 ${textColor}`}>₹3,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className={styles.bodyStyle} style={{ paddingTop: 0 }}>
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span className={`${styles.textStyle} ${mutedTextColor}`}>Total HT</span>
              <span className={`font-medium ${textColor}`}>₹3,000</span>
            </div>
            <div className="flex justify-between py-1">
              <span className={`${styles.textStyle} ${mutedTextColor}`}>Total Disbursements</span>
              <span className={`font-medium ${textColor}`}>₹30</span>
            </div>
            <div className="flex justify-between py-1">
              <span className={`${styles.textStyle} ${mutedTextColor}`}>Total Tax</span>
              <span className={`font-medium ${textColor}`}>₹0</span>
            </div>
            {showBalanceAmount && (
              <div className="flex justify-between py-1">
                <span className={`${styles.textStyle} ${mutedTextColor}`}>Balance Due</span>
                <span className={`font-medium ${textColor}`}>₹3,030.00</span>
              </div>
            )}
            <div className={`flex justify-between py-1 border-t ${borderColor} mt-1 pt-1`}>
              <span className={`${styles.textStyle} font-medium ${textColor}`}>Total Price</span>
              <span className={`font-bold ${textColor}`}>₹3,030.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div
        className={`${styles.footerStyle}`}
        style={{ background: isLightColor(color) ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)" }}
      >
        <p className={`${styles.subheadingStyle} ${textColor}`}>Terms & Conditions</p>
        <p className={`${styles.textStyle} ${mutedTextColor}`}>Please pay within 15 days of receiving this invoice.</p>
      </div>
    </div>
  )
}

