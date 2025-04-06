import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// GET handler for fetching all categories
export async function GET() {
  try {
    // Connect to the database
    const { db } = await connectToDatabase()

    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Get all categories
    const categories = await db.collection("categories").find({}).toArray()

    // Return the categories as JSON
    return NextResponse.json(categories)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST handler for creating a new category
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    // Connect to the database
    const { db } = await connectToDatabase()

    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    // Create a new category
    const result = await db.collection("categories").insertOne({
      name,
      createdAt: new Date(),
    })

    // Return the created category
    return NextResponse.json(
      {
        _id: result.insertedId,
        name,
        createdAt: new Date(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

