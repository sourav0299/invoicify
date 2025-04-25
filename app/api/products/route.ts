import { NextResponse } from "next/server"
import { connectToDatabase } from "../../../utils/database"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.itemName || !body.itemCode) {
      return NextResponse.json(
        { error: "Missing required fields: itemName and itemCode are required" },
        { status: 400 },
      )
    }

  
    if (isNaN(body.salesPrice) || body.salesPrice < 0) {
      return NextResponse.json({ error: "Sales price must be a valid number" }, { status: 400 })
    }


    const { db } = await connectToDatabase()

    const result = await db.collection("products").insertOne(body)

   
    return NextResponse.json({ ...body, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const products = await db.collection("products").find({}).toArray()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
