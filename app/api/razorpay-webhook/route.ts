import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { Twilio } from 'twilio';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET as string;
const prisma = new PrismaClient();

const twilio = new Twilio(
  process.env.TWILIO_ACCOUNT_SID as string,
  process.env.TWILIO_AUTH_TOKEN as string
);

// Validate environment variables
if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
  throw new Error('RAZORPAY_WEBHOOK_SECRET is required');
}

interface RazorpayPaymentEntity {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
}

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment: {  // Changed from payment_link to payment
      entity: RazorpayPaymentEntity;
    };
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.text(); // Get raw body as text
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body) as RazorpayWebhookEvent;
    
    // Check for payment success
    if (event.event === 'payment.captured') {  // Changed from payment_link.paid
      const payment = event.payload.payment.entity;
      
      try {
        // Update invoice status
        const updatedInvoice = await prisma.invoice.update({
          where: {
            id: payment.order_id // Using order_id instead of payment.id
          },
          data: {
            status: 'PAID',
          }
        });

        // Send SMS notification
        await twilio.messages.create({
          body: `Payment Received: ₹${payment.amount/100} for Invoice #${payment.order_id}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: '+919110010117'
        });

        console.log('✅ Payment processed:', {
          invoiceId: payment.order_id,
          paymentId: payment.id,
          amount: payment.amount/100,
          status: 'PAID'
        });

        return NextResponse.json({ success: true, invoice: updatedInvoice });
      } catch (dbError) {
        console.error('Database Error:', dbError);
        return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}