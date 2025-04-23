"use client"
import DynamicInvoiceTemplate from "@/components/dynamic-invoice-template"
// import InvoiceSettingsPage from "@/components/dynamic-invoice-template"
import { useUserCheck } from "@/helper/useUserCheck"

export default function Page() {
  useUserCheck()
  return <DynamicInvoiceTemplate templateId={0} color={""} showImage={false} showInvoiceType={false} showBillingAddress={false} showShippingAddress={false} showBalanceAmount={false} showTotalAmount={false}/>
}

