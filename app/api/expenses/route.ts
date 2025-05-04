import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from "../../../utils/database";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    }).then(res => res.json());

    if (!clerkUser.email_addresses?.[0]?.email_address) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    const userEmail = clerkUser.email_addresses[0].email_address;
    
    const { db } = await connectToDatabase();
    const expense = await req.json();
    expense.userEmail = userEmail;
    
    const result = await db.collection('expenses').insertOne(expense);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json(
      { error: "Error saving expense" }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    }).then(res => res.json());

    if (!clerkUser.email_addresses?.[0]?.email_address) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    const userEmail = clerkUser.email_addresses[0].email_address;
    
    const { db } = await connectToDatabase();
    const expenses = await db.collection('expenses')
      .find({ userEmail })
      .toArray();
      
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { error: 'Error fetching expenses' }, 
      { status: 500 }
    );
  }
}