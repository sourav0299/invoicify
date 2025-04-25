import { NextResponse } from "next/server"
import { connectToDatabase } from "../../../../lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Connect to database
    const { db } = await connectToDatabase()

    // Check if db is null
    if (!db) {
      throw new Error("Failed to connect to database")
    }

    // Convert string ID to MongoDB ObjectId
    const objectId = new ObjectId(id)

    // Delete the product
    const result = await db.collection("products").deleteOne({ _id: objectId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product", message: error.message }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

   
    const { db } = await connectToDatabase()

   
    if (!db) {
      throw new Error("Failed to connect to database")
    }

  
    const objectId = new ObjectId(id)

   
    const product = await db.collection("products").findOne({ _id: objectId })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product", message: error.message }, { status: 500 })
  }
}
