"use client"

interface InvoiceTemplateProps {
  templateId: number
  color: string
  showImage: boolean
  showInvoiceType: boolean
  showBillingAddress: boolean
  showShippingAddress: boolean
  showBalanceAmount: boolean
  showTotalAmount: boolean
  data?: any
}

export default function InvoiceTemplate({
  templateId = 1,
  color = "#E5E7EB",
  showImage = true,
  showInvoiceType = true,
  showBillingAddress = true,
  showShippingAddress = false,
  showBalanceAmount = true,
  showTotalAmount = true,
  data,
}: InvoiceTemplateProps) {
  // Template styles based on templateId
  const getTemplateStyles = () => {
    switch (templateId) {
      case 1:
        return {
          fontFamily: "Inter, sans-serif",
          headerBg: "bg-white",
          tableBg: "bg-white",
          tableBorder: "border-gray-200",
          headerTextColor: "text-gray-900",
        }
      case 2:
        return {
          fontFamily: "Roboto, sans-serif",
          headerBg: "bg-gray-50",
          tableBg: "bg-white",
          tableBorder: "border-gray-300",
          headerTextColor: "text-gray-800",
        }
      case 3:
        return {
          fontFamily: "Poppins, sans-serif",
          headerBg: "bg-white",
          tableBg: "bg-gray-50",
          tableBorder: "border-gray-200",
          headerTextColor: "text-gray-900",
        }
      case 4:
        return {
          fontFamily: "Montserrat, sans-serif",
          headerBg: "bg-gray-100",
          tableBg: "bg-white",
          tableBorder: "border-gray-300",
          headerTextColor: "text-gray-800",
        }
      default:
        return {
          fontFamily: "Inter, sans-serif",
          headerBg: "bg-white",
          tableBg: "bg-white",
          tableBorder: "border-gray-200",
          headerTextColor: "text-gray-900",
        }
    }
  }

  const styles = getTemplateStyles()

  // Apply dynamic color to elements
  const getColorStyle = () => {
    return {
      color: color,
      borderColor: color,
    }
  }

  return (
    <div className="invoice-template" style={{ fontFamily: styles.fontFamily }}>
      {/* Header section with company info and logo */}
      <div className={`p-6 ${styles.headerBg} rounded-t-lg`}>
        <div className="flex flex-col md:flex-row justify-between">
          {showImage && (
            <div className="mb-4 md:mb-0">
              <div className="w-24 h-24 bg-orange-100 rounded-md flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-orange-400 rounded-tl-full"></div>
                  <div className="absolute left-0 top-0 w-3/4 h-3/4 bg-blue-400"></div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-grow">
            <h2 className={`text-xl font-bold ${styles.headerTextColor}`}>Sourav Kumar</h2>
            <p className="text-gray-600">Minesh Patel</p>
            <p className="text-gray-600">123 Sector-26, 38200 Gandhinagar, France</p>
            <p className="text-gray-600">848172194 | contact@dezainahub.com</p>
          </div>

          <div className="text-right mt-4 md:mt-0">
            {showInvoiceType && (
              <div className="mb-2">
                <span className="px-3 py-1 text-sm rounded" style={getColorStyle()}>
                  INVOICE
                </span>
              </div>
            )}
            <p className="text-gray-600">#2020-05-0001</p>
            {showTotalAmount && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold" style={{ color: color }}>
                  ₹3,030.00
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice details */}
      <div className="p-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Bill Date</h3>
            <p className="font-medium">03/05/2020</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-500 mb-1">Payment Deadline</h3>
            <p className="font-medium">05/18/2020</p>
          </div>
          {showBillingAddress && (
            <div>
              <h3 className="text-sm text-gray-500 mb-1">Billing Address</h3>
              <p className="font-medium">Karuna Shrestha</p>
              <p className="text-sm text-gray-600">1445 West Avenue, Kormangaa, Bangalore, India</p>
              <p className="text-sm text-gray-600">97223041054 | Karuna@Minesh.com</p>
            </div>
          )}
        </div>

        {showShippingAddress && (
          <div className="mt-4">
            <h3 className="text-sm text-gray-500 mb-1">Shipping Address</h3>
            <p className="font-medium">Karuna Shrestha</p>
            <p className="text-sm text-gray-600">1445 West Avenue, Kormangaa, Bangalore, India</p>
          </div>
        )}
      </div>

      {/* Invoice items */}
      <div className="px-6 py-4">
        <table className={`w-full border-collapse ${styles.tableBg}`}>
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-2 text-left text-sm font-medium text-gray-500">NO.</th>
              <th className="py-2 px-2 text-left text-sm font-medium text-gray-500">ARTICLE</th>
              <th className="py-2 px-2 text-left text-sm font-medium text-gray-500">QUANTITY</th>
              <th className="py-2 px-2 text-left text-sm font-medium text-gray-500">UNIT PRICE</th>
              <th className="py-2 px-2 text-left text-sm font-medium text-gray-500">TAX</th>
              <th className="py-2 px-2 text-left text-sm font-medium text-gray-500">AMOUNT</th>
              <th className="py-2 px-2 text-left text-sm font-medium text-gray-500">FINAL AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 px-2 text-sm">1</td>
              <td className="py-3 px-2 text-sm">
                <div>
                  <p className="font-medium">Product Name</p>
                  <p className="text-gray-500">Product Description</p>
                </div>
              </td>
              <td className="py-3 px-2 text-sm">150 Unit(s)</td>
              <td className="py-3 px-2 text-sm">₹20</td>
              <td className="py-3 px-2 text-sm">0%</td>
              <td className="py-3 px-2 text-sm">₹3,000</td>
              <td className="py-3 px-2 text-sm">₹3,000</td>
            </tr>
            <tr>
              <td className="py-3 px-2 text-sm">2</td>
              <td className="py-3 px-2 text-sm">
                <div>
                  <p className="font-medium">Product Name</p>
                  <p className="text-gray-500">Product Description</p>
                </div>
              </td>
              <td className="py-3 px-2 text-sm">150 Unit(s)</td>
              <td className="py-3 px-2 text-sm">₹20</td>
              <td className="py-3 px-2 text-sm">0%</td>
              <td className="py-3 px-2 text-sm">₹3,000</td>
              <td className="py-3 px-2 text-sm">₹3,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="px-6 py-4 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-1">
            <span className="text-gray-600 text-sm">Total HT</span>
            <span className="font-medium text-sm">₹3,000</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600 text-sm">Total Disbursements</span>
            <span className="font-medium text-sm">₹30</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600 text-sm">Total Tax</span>
            <span className="font-medium text-sm">₹0</span>
          </div>
          {showBalanceAmount && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600 text-sm">Balance Due</span>
              <span className="font-medium text-sm">₹3,030.00</span>
            </div>
          )}
          <div className="flex justify-between py-1 border-t border-gray-200 mt-1 pt-1">
            <span className="text-gray-600 font-medium text-sm">Total Price</span>
            <span className="font-bold text-sm" style={{ color: color }}>
              ₹3,030.00
            </span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="px-6 py-4 border-t border-gray-200">
        <p className="font-medium text-sm">Terms & Conditions</p>
        <p className="text-gray-600 text-sm">Please pay within 15 days of receiving this invoice.</p>
      </div>
    </div>
  )
}

