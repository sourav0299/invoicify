import { NextResponse } from 'next/server';
import prisma from '../../../utils/prisma';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const userId = parseInt(params.userId);

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