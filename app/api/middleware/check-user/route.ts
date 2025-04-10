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
    const prismaUser = await prisma.user.findUnique({
      where: { email: clerkEmail },
    });

    if (!prismaUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User found",
      user: prismaUser
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}