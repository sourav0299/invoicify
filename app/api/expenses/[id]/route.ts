import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db } = await connectToDatabase()

    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      )
    }

    const id = (await params).id
    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      )
    }

    // Convert string ID to MongoDB ObjectId
    const objectId = new ObjectId(id)

    const result = await db.collection("expenses").deleteOne({
      _id: objectId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Expense deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json(
      { error: "Error deleting expense" },
      { status: 500 }
    )
  }
}
