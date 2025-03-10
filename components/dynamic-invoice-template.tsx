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
  // Apply template-specific styles based on templateId
  const getTemplateStyles = () => {
    switch (templateId) {
      case 1:
        return {
          headerStyle: "flex flex-col md:flex-row gap-6",
          bodyStyle: "mt-8",
          tableStyle: "mt-6",
          footerStyle: "mt-8",
          accentColor: color || "#2DD4BF",
        }
      case 2:
        return {
          headerStyle: "flex flex-col md:flex-row gap-6 bg-gray-50 p-4 rounded-lg",
          bodyStyle: "mt-6",
          tableStyle: "mt-4 bg-white rounded-lg",
          footerStyle: "mt-6 bg-gray-50 p-4 rounded-lg",
          accentColor: color || "#FCA5A5",
        }
      case 3:
        return {
          headerStyle: "flex flex-col md:flex-row gap-6 border-b border-gray-200 pb-6",
          bodyStyle: "mt-6",
          tableStyle: "mt-6 border rounded-lg overflow-hidden",
          footerStyle: "mt-6 border-t border-gray-200 pt-4",
          accentColor: color || "#000000",
        }
      case 4:
        return {
          headerStyle: "flex flex-col md:flex-row gap-6 bg-gray-100 p-6 rounded-lg",
          bodyStyle: "mt-6 p-4 bg-white rounded-lg",
          tableStyle: "mt-4",
          footerStyle: "mt-6 bg-gray-100 p-4 rounded-lg",
          accentColor: color || "#F472B6",
        }
      default:
        return {
          headerStyle: "flex flex-col md:flex-row gap-6",
          bodyStyle: "mt-8",
          tableStyle: "mt-6",
          footerStyle: "mt-8",
          accentColor: color || "#2DD4BF",
        }
    }
  }

  const styles = getTemplateStyles()

  return (
    <div className="invoice-template">
      {/* Header section */}
      <div className={styles.headerStyle}>
        {/* Logo */}
        {showImage && (
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-orange-100 rounded-md flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full">
                <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-orange-400 rounded-tl-full"></div>
                <div className="absolute left-0 top-0 w-3/4 h-3/4 bg-blue-400"></div>
              </div>
            </div>
          </div>
        )}

        {/* Company Details */}
        <div className="flex-grow">
          <h2 className="text-lg font-semibold">Sourav Kumar</h2>
          <p className="text-sm text-gray-600">Minesh Patel</p>
          <p className="text-sm text-gray-600">123 Sector-26, 38200 Gandhinagar, France</p>
          <p className="text-sm text-gray-600">848172194 | contact@dezainahub.com</p>
          <p className="text-sm text-gray-600">GST: 362 521 879 00034</p>
          <p className="text-sm text-gray-600">CIN: 842-484021</p>
        </div>

        {/* Invoice Number and Total */}
        <div className="text-right">
          {showInvoiceType && (
            <div className="mb-2">
              <span
                className="px-3 py-1 text-sm rounded border"
                style={{ borderColor: styles.accentColor, color: styles.accentColor }}
              >
                INVOICE
              </span>
            </div>
          )}
          <p className="text-sm text-gray-600">#2020-05-0001</p>
          {showTotalAmount && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold" style={{ color: styles.accentColor }}>
                ₹3,030.00
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Billing Info and Dates */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${styles.bodyStyle}`}>
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
            <p className="text-sm text-gray-600">VAT: 842-484021</p>
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

      {/* Note */}
      <div className="mt-6">
        <h3 className="text-sm text-gray-500 mb-1">Note</h3>
        <p className="text-sm text-gray-600">
          This is a custom message that might be relevant to the customer. It can span up to three or four rows. It can
          span up to three or four rows.
        </p>
      </div>

      {/* Invoice Table */}
      <div className={`overflow-x-auto ${styles.tableStyle}`}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-2 px-2 font-medium text-gray-500">NO.</th>
              <th className="py-2 px-2 font-medium text-gray-500">ARTICLE</th>
              <th className="py-2 px-2 font-medium text-gray-500">QUANTITY</th>
              <th className="py-2 px-2 font-medium text-gray-500">UNIT PRICE</th>
              <th className="py-2 px-2 font-medium text-gray-500">TAX</th>
              <th className="py-2 px-2 font-medium text-gray-500">AMOUNT</th>
              <th className="py-2 px-2 font-medium text-gray-500">FINAL AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 px-2">1</td>
              <td className="py-3 px-2">
                <div>
                  <p className="font-medium">Product Name</p>
                  <p className="text-gray-500">Product Description</p>
                </div>
              </td>
              <td className="py-3 px-2">150 Unit(s)</td>
              <td className="py-3 px-2">₹20</td>
              <td className="py-3 px-2">0%</td>
              <td className="py-3 px-2">₹3,000</td>
              <td className="py-3 px-2">₹3,000</td>
            </tr>
            <tr>
              <td className="py-3 px-2">2</td>
              <td className="py-3 px-2">
                <div>
                  <p className="font-medium">Product Name</p>
                  <p className="text-gray-500">Product Description</p>
                </div>
              </td>
              <td className="py-3 px-2">150 Unit(s)</td>
              <td className="py-3 px-2">₹20</td>
              <td className="py-3 px-2">0%</td>
              <td className="py-3 px-2">₹3,000</td>
              <td className="py-3 px-2">₹3,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-6 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Total HT</span>
            <span className="font-medium">₹3,000</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Total Disbursements</span>
            <span className="font-medium">₹30</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Total Tax</span>
            <span className="font-medium">₹0</span>
          </div>
          {showBalanceAmount && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Balance Due</span>
              <span className="font-medium">₹3,030.00</span>
            </div>
          )}
          <div className="flex justify-between py-1 border-t border-gray-200 mt-1 pt-1">
            <span className="text-gray-600 font-medium">Total Price</span>
            <span className="font-bold" style={{ color: styles.accentColor }}>
              ₹3,030.00
            </span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className={styles.footerStyle}>
        <p className="font-medium text-sm">Terms & Conditions</p>
        <p className="text-gray-600 text-sm">Please pay within 15 days of receiving this invoice.</p>
      </div>
    </div>
  )
}

