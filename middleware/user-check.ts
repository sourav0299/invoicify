
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/utils/prisma";

export async function userCheckMiddleware(request: Request) {
  console.log("Middleware running for URL:", request.url);
  
  // Skip middleware for specific routes
  if (
    request.url.includes("/sync-user") ||
    request.url.includes("/api/auth") ||
    request.url.includes("/_next/static") ||
    request.url.includes("/_next/image") ||
    request.url.includes("/favicon.ico")
  ) {
    console.log("Skipping middleware for:", request.url);
    return NextResponse.next();
  }

  try {
    const { userId: clerkUserId } = await auth();
    console.log("Clerk User ID:", clerkUserId);
    
    if (!clerkUserId) {
      console.log("No Clerk user ID found");
      return NextResponse.next();
    }

    // Get the user's email from Clerk
    const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${clerkUserId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
      }
    }).then(res => res.json());

    console.log("Clerk User:", clerkUser);

    if (!clerkUser.email_addresses?.[0]?.email_address) {
      console.log("No email found for user");
      return NextResponse.next();
    }

    const userEmail = clerkUser.email_addresses[0].email_address;
    console.log("User email:", userEmail);
    
    // Check if user exists in Prisma
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    console.log("Prisma user found:", !!user);

    // If user doesn't exist, redirect to sync-user page
    if (!user) {
      console.log("Redirecting to sync-user");
      const url = new URL("/sync-user", request.url);
      url.searchParams.set("redirect", request.url);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error in user check middleware:", error);
    return NextResponse.next();
  }
}

// Match all routes except the ones we want to skip
export const config = {
  matcher: [
    "/((?!_next|api/auth|sync-user|favicon.ico).*)",
  ],
}; 