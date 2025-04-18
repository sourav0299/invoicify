import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from "@clerk/nextjs/server"

const prisma = new PrismaClient()

const validStatuses = ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'] as const
type ValidStatus = typeof validStatuses[number]

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get and validate the ID
    const { id } = (await params)
    if (!id) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 })
    }

    const { userId: clerkUserId } = await auth()
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()

    // Validate status
    if (!validStatuses.includes(status as ValidStatus)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      )
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

    // Update the invoice status
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

    await prisma.$queryRaw`
      UPDATE "Invoice" 
      SET status = ${status}::text
      WHERE id = ${id}::text
    `

    const updatedInvoice = await prisma.invoice.findUnique({
      where: { id }
    })

    return NextResponse.json(updatedInvoice)
  } catch (error) {
    console.error('Error updating invoice status:', error)
    return NextResponse.json(
      { error: 'Failed to update invoice status' },
      { status: 500 }
    )
  }
} 