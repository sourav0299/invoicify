import { NextResponse } from "next/server"
import prisma from "@/utils/prisma"
import { auth } from "@clerk/nextjs/server"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the user's email from Clerk
    const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${clerkUserId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    }).then(res => res.json())

    if (!clerkUser.email_addresses?.[0]?.email_address) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    const userEmail = clerkUser.email_addresses[0].email_address
    
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 })
    }

    const id = (await params).id
    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      )
    }

    // First check if the invoice belongs to the user
    const invoice = await prisma.invoice.findFirst({
      where: {
        id,
        userId: user.id
      }
    })

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found or unauthorized" },
        { status: 404 }
      )
    }

    // Delete all related invoice items first
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: id }
    })

    // Then delete the invoice
    await prisma.invoice.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: "Invoice deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting invoice:", error)
    return NextResponse.json(
      { error: "Error deleting invoice" },
      { status: 500 }
    )
  }
}
