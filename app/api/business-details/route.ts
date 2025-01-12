import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    const businessSettings = await prisma.businessSetting.findUnique({
      where: { userEmail },
    });

    if (!businessSettings) {
      return NextResponse.json({ error: 'Business settings not found' }, { status: 404 });
    }

    return NextResponse.json(businessSettings);
  } catch (error) {
    console.log('Error fetching business settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    const data = await req.json();
    const businessSettings = await prisma.businessSetting.create({
      data: {
        ...data,
        userEmail,
      },
    });

    return NextResponse.json(businessSettings, { status: 201 });
  } catch (error) {
    console.log('Error creating business settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }

    const userEmail = user.emailAddresses[0].emailAddress;

    let data;
    try {
      data = await req.json();
    } catch (parseError) {
      console.log('Error parsing request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }

    const existingSettings = await prisma.businessSetting.findUnique({
      where: { userEmail },
    });

    if (existingSettings) {
      const updatedSettings = await prisma.businessSetting.update({
        where: { userEmail },
        data: {
          ...data,
          userEmail,
        },
      });
      return NextResponse.json(updatedSettings);
    } else {
      const newSettings = await prisma.businessSetting.create({
        data: {
          ...data,
          userEmail,
        },
      });
      return NextResponse.json(newSettings);
    }
  } catch (error) {
    console.log('Error updating business settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}