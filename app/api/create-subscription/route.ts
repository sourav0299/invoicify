import { NextResponse } from 'next/server';
import prisma from '../../../utils/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    
    const { userEmail, planId } = body;

    if (!userEmail || !planId) {
      console.log('Missing required fields:', { userEmail, planId });
      return NextResponse.json(
        { error: 'Email and plan ID are required' },
        { status: 400 }
      );
    }

    // Check if plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: parseInt(planId.toString()) }
    });

    if (!plan) {
      console.log('Plan not found:', planId);
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    console.log('Looking for user with email:', userEmail);
    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      console.log('Creating new user with email:', userEmail);
      // Create new user
      user = await prisma.user.create({
        data: {
          email: userEmail,
          firstname: userEmail.split('@')[0], // Temporary name
          lastname: '',
          contactnumber: ''
        }
      });
      console.log('Created new user:', user);
    }

    console.log('Found/Created user:', user);
    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'active',
        nextBillingDate: {
          gt: new Date()
        }
      }
    });

    if (existingSubscription) {
      console.log('User has existing subscription:', existingSubscription);
      return NextResponse.json(
        { error: 'User already has an active subscription' },
        { status: 400 }
      );
    }

    // Create new subscription
    const orderId = `ORDER_${Date.now()}`;
    const nextBillingDate = new Date();
    nextBillingDate.setDate(nextBillingDate.getDate() + 14); // 14 days trial

    console.log('Creating subscription with data:', {
      userId: user.id,
      planId,
      orderId,
      nextBillingDate
    });

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: parseInt(planId.toString()),
        pluralOrderId: orderId,
        status: 'active',
        nextBillingDate
      }
    });

    console.log('Created subscription:', subscription);
    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    // More detailed error logging
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create subscription',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 