import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "../../../utils/database"

// Handle GET request to check if test product exists
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const testProduct = await db.collection("products").findOne({ itemCode: "9595" })
    
    if (testProduct) {
      return NextResponse.json({ message: "Test product exists", product: testProduct })
    }
    return NextResponse.json({ message: "Test product not found" })
  } catch (error) {
    console.error("Error checking test product:", error)
    return NextResponse.json(
      { error: "Error checking test product", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// Handle POST request to create test product
export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    
    // Sample test product
    const testProduct = {
      name: "Test Product",
      code: "9595",
      description: "Test product description",
      price: 100,
      unit: "Piece",
      taxRate: "18"
    }
    
    // First, check if product with this code already exists
    const existing = await db.collection("products").findOne({ code: testProduct.code })
    if (existing) {
      console.log("Test product already exists:", existing)
      return NextResponse.json({ message: "Test product already exists", product: existing }, { status: 200 })
    }
    
    // Insert the test product
    const result = await db.collection("products").insertOne(testProduct)
    console.log("Test product inserted:", result)
    
    return NextResponse.json(
      { 
        message: "Test product added successfully", 
        id: result.insertedId,
        product: testProduct 
      }, 
      { status: 201 }
    )
  } catch (error) {
    console.error("Error adding test product:", error)
    return NextResponse.json(
      { error: "Error adding test product", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 