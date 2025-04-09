import { NextResponse } from 'next/server';
import prisma from '../../../../../utils/prisma';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        // Await params and validate userId
        if (!params?.userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const userId = parseInt(await params.userId);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: 'Invalid user ID' },
                { status: 400 }
            );
        }

        const subscription = await prisma.subscription.findFirst({
            where: {
                userId,
                status: 'active',
                nextBillingDate: {
                    gt: new Date()
                }
            }
        });

        return NextResponse.json({
            hasActiveSubscription: !!subscription
        });
    } catch (error) {
        console.error('Error checking subscription:', error);
        return NextResponse.json(
            { error: 'Failed to check subscription status' },
            { status: 500 }
        );
    }
}