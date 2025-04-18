import { NextResponse } from 'next/server'
import prisma from '../../../utils/prisma'
import { auth } from "@clerk/nextjs/server"

export async function GET(request: Request) {
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

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    )
  }
} 