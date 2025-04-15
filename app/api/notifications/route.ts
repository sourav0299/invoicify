import { NextResponse } from "next/server"

// This would be replaced with actual database queries in a real application
export async function GET() {
  // Mock data for demonstration
  const notifications = [
    {
      id: "1",
      type: "low-stock",
      title: "Low Stock Alert",
      description: "Printer paper is running low (5 units remaining)",
      timestamp: "10 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "out-of-stock",
      title: "Out of Stock",
      description: "Blue ink cartridges are out of stock",
      timestamp: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "invoice",
      title: "Invoice Generated",
      description: "Invoice #INV-2023-042 has been generated",
      timestamp: "3 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "payment",
      title: "Payment Received",
      description: "₹5,000 received from Customer ABC",
      timestamp: "4 hours ago",
      read: false,
    },
    {
      id: "5",
      type: "low-stock",
      title: "Low Stock Alert",
      description: "A4 notebooks are running low (8 units remaining)",
      timestamp: "5 hours ago",
      read: true,
    },
    {
      id: "6",
      type: "invoice",
      title: "Invoice Generated",
      description: "Invoice #INV-2023-041 has been generated",
      timestamp: "Yesterday",
      read: true,
    },
  ]

  return NextResponse.json(notifications)
}

// In a real application, you would also have endpoints to mark notifications as read
export async function POST(request: Request) {
  const { notificationId } = await request.json()

  // Here you would update the database to mark the notification as read

  return NextResponse.json({ success: true })
}
