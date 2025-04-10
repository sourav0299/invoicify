import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import prisma from '../../../../utils/prisma';

// Export the HTTP method handlers
export async function GET(req: NextRequest) {
  return await checkUserInfo(req);
}

export async function POST(req: NextRequest) {
  return await checkUserInfo(req);
}

// Move the checkUserInfo function to be a helper function
async function checkUserInfo(req: NextRequest) {
  try {
    // ...existing code...
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ...existing code...
    const clerkUser = await currentUser();
    if (!clerkUser || !clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
      return NextResponse.json({ error: 'Clerk user information not found' }, { status: 404 });
    }

    // ...existing code...
    const prismaUser = await prisma.user.findUnique({
      where: {
        email: clerkUser.emailAddresses[0].emailAddress,
      }
    });

    if (!prismaUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const request = req as any;
    request.user = {
      ...prismaUser,
      clerkUser
    };

    return NextResponse.next();
  } catch (error) {
    console.error('Error checking user information:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}