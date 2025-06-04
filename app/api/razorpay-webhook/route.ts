import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { Twilio } from 'twilio';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET as string;
const prisma = new PrismaClient()

const twilio = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


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
    payment_link: {
      entity: RazorpayPaymentEntity;
    };
  };
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to buffer the incoming stream
async function getRawBody(request: NextRequest): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = request.body?.getReader();
  if (!reader) throw new Error('No request body');
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await getRawBody(request);
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ message: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ message: 'Invalid Signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody.toString()) as RazorpayWebhookEvent;

    if (event.event === 'payment_link.paid') {
      const payment = event.payload.payment_link.entity;
      const paymentId: string = payment.id;
      const orderId: string = payment.order_id;
      const amount: number = payment.amount;
      const currency: string = payment.currency;
      const status: string = payment.status;

      console.log('✅ Payment Captured:', {
        paymentId,
        orderId,
        amount,
        currency,
        status,
      });

      await twilio.messages.create({
      body: `Console.log ${paymentId}, ${orderId}, ${amount}, ${currency}, ${status}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+919110010117`
    });

  // Update using the same pattern as your status route
  const updatedInvoice = await prisma.$queryRaw`
    UPDATE "Invoice" 
    SET status = 'PAID'::text
    WHERE id = ${paymentId}::text
    RETURNING *
  `;
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}