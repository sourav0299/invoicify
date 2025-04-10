import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import  prisma  from '../../../../utils/prisma';

export async function checkUserInfo(req: NextRequest) {
  try {
    // Check Clerk authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check Clerk user details
    const clerkUser = await currentUser();
    if (!clerkUser || !clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
      return NextResponse.json({ error: 'Clerk user information not found' }, { status: 404 });
    }

    // Check Prisma user data
    const prismaUser = await prisma.user.findUnique({
      where: {
        email: clerkUser.emailAddresses[0].emailAddress,
      }
    });

    if (!prismaUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // Attach user info to request for later use
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