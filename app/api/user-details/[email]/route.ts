import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma';

export async function GET(
  request: NextRequest,
  context: { params: { email: string } }
) {
  try {
    const { email } = await context.params;
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { email: string } }
) {
  try {
    const { email } = await context.params;
    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }

    const body = await request.json();
    const { firstname, lastname, contactnumber } = body;

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        firstname,
        lastname,
        contactnumber,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}
