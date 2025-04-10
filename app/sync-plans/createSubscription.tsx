'use client';

type SubscriptionResponse = {
    subscription: {
        id: number;
        userId: number;
        planId: number;
        pluralOrderId: string;
        status: string;
        nextBillingDate: string;
    };
};

export async function createSubscription(userId: number, planId: number, orderId: string) {
    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                planId,
                pluralOrderId: orderId,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create subscription');
        }

        const data = await response.json() as SubscriptionResponse;
        return data;
    } catch (error) {
        console.error('Subscription error:', error);
        throw error;
    }
}

export async function checkUserSubscription(userId: number): Promise<boolean> {
    try {
        const response = await fetch(`/api/user/${userId}/subscription`);
        if (!response.ok) {
            throw new Error('Failed to fetch subscription status');
        }
        const data = await response.json();
        return data.hasActiveSubscription;
    } catch (error) {
        console.error('Error checking subscription:', error);
        return false;
    }
}