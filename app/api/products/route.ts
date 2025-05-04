import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../utils/database";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    // Get user info
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user email from Clerk
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
    const product = await req.json();

    // Add user email to product
    product.userEmail = userEmail;

    if (!product.itemName || !product.itemCode) {
      return NextResponse.json(
        { error: "Product name and code are required" },
        { status: 400 }
      );
    }

    const result = await db.collection("products").insertOne(product);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json(
      { error: "Error saving product" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get user info
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user email from Clerk
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
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search");

    // Always filter by user email
    let query: any = { userEmail };

    if (search) {
      query = {
        $and: [
          { userEmail },
          {
            $or: [
              { itemName: { $regex: search, $options: "i" } },
              { itemCode: { $regex: search, $options: "i" } },
            ],
          },
        ],
      };
    }

    const products = await db
      .collection("products")
      .find(query)
      .limit(10)
      .toArray();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in GET /api/products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}