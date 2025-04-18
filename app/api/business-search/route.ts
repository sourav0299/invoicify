import { type NextRequest, NextResponse } from "next/server"
import prisma from "../../../utils/prisma"

export async function GET(req: NextRequest) {
  try {
    console.log("Received GET request for business search")
    
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get("search")
    console.log("Business search query:", search)

    const businesses = await prisma.businessSetting.findMany({
      where: search ? {
        businessName: {
          contains: search,
          mode: 'insensitive'
        }
      } : {},
      take: 10
    })

    console.log(`Found ${businesses.length} businesses matching query`)

    return NextResponse.json(businesses)
  } catch (error) {
    console.error("Error in GET /api/business-search:", error)
    return NextResponse.json(
      { error: "Error fetching businesses", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 