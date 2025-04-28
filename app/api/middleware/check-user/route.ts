import { NextResponse } from "next/server";
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from "../../../../utils/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: No user found" },
        { status: 401 }
      );
    }

    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json(
        { error: "Invalid user profile" },
        { status: 401 }
      );
    }

    const clerkEmail = user.emailAddresses[0].emailAddress;
    
    // Get user with their subscription and business settings
    const prismaUser = await prisma.user.findUnique({
      where: { email: clerkEmail },
      include: {
        subscription: {
          where: {
            status: "active",
            nextBillingDate: {
              gt: new Date()
            }
          },
          include: {
            plan: true
          }
        }
      }
    });

    if (!prismaUser) {
      return NextResponse.json(
        { 
          error: "User not found in database",
          redirectTo: "/sync-user"
        },
        { status: 404 }
      );
    }

    // Check if user has business settings
    const businessSettings = await prisma.businessSetting.findUnique({
      where: { userEmail: clerkEmail }
    });

    if (!businessSettings) {
      return NextResponse.json(
        { 
          error: "Business settings not found",
          redirectTo: "/sync-business"
        },
        { status: 404 }
      );
    }

    // Check if user has an active subscription
    if (!prismaUser.subscription || prismaUser.subscription.length === 0) {
      return NextResponse.json(
        { 
          error: "No active subscription found",
          redirectTo: "/sync-plans"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User found with complete profile",
      user: {
        ...prismaUser,
        businessSettings
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Check user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}