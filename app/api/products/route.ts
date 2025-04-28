import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "../../../utils/database"

export async function POST(req: NextRequest) {
  try {
    console.log("Received POST request for products")
    const { db } = await connectToDatabase()
    const product = await req.json()
    
    if (!product.itemName || !product.itemCode) {
      return NextResponse.json(
        { error: "Product name and code are required" },
        { status: 400 }
      )
    }
    
    console.log("Attempting to insert product:", product)
    
    const result = await db.collection("products").insertOne(product)
    console.log("Product inserted successfully:", result)
    
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/products:", error)
    return NextResponse.json(
      { error: "Error saving product", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log("Received GET request for products")
    const { db } = await connectToDatabase()
    
    // First check if we can access the products collection
    const totalProducts = await db.collection("products").countDocuments()
    console.log("Total products in database:", totalProducts)
    
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get("search")
    console.log("Search query:", search)

    let query = {}
    if (search) {
      query = {
        $or: [
          { itemName: { $regex: search, $options: "i" } },
          { itemCode: { $regex: search, $options: "i" } },
          { userEmail: { $regex: search, $options: "i" } }
        ],
      }
    }
    console.log("MongoDB query:", JSON.stringify(query))

    // Let's log a sample of products to verify data structure
    const sampleProducts = await db.collection("products").find().limit(1).toArray()
    console.log("Sample product from database:", JSON.stringify(sampleProducts))

    const products = await db.collection("products").find(query).limit(10).toArray()
    console.log(`Found ${products.length} products matching query:`, JSON.stringify(products))

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error in GET /api/products:", error)
    return NextResponse.json(
      { error: "Error fetching products", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
