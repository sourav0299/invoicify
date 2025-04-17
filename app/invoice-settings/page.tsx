"use client"
import InvoiceSettingsPage from "@/components/invoice-settings-page"
import { useUserCheck } from "@/helper/useUserCheck"

export default function Page() {
  useUserCheck()
  return <InvoiceSettingsPage />
}

