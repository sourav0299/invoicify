import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "../../../utils/database"

export async function POST(req: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const product = await req.json()
    const result = await db.collection("products").insertOne(product)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Error saving product" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get("search")

    let query = {}
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      }
    }

    const products = await db.collection("products").find(query).limit(10).toArray()

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error in GET /api/products:", error)
    return NextResponse.json({ error: "Error fetching products" }, { status: 500 })
  }
}
