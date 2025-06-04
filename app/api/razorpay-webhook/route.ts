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
    const body = await request.text();
    console.log('📥 Webhook received:', body); // Log raw webhook data

    const signature = request.headers.get('x-razorpay-signature');
    console.log('🔑 Signature:', signature);

    // ...existing signature verification...

    const event = JSON.parse(body) as RazorpayWebhookEvent;
    console.log('🎯 Event type:', event.event);
    
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      console.log('💰 Payment details:', payment);
      
      try {
        // First check if invoice exists
        const invoice = await prisma.invoice.findUnique({
          where: { id: payment.order_id }
        });
        
        if (!invoice) {
          console.error('❌ Invoice not found:', payment.order_id);
          return NextResponse.json(
            { error: 'Invoice not found' },
            { status: 404 }
          );
        }

        // Update invoice with more details
        const updatedInvoice = await prisma.invoice.update({
          where: { id: payment.order_id },
          data: {
            status: 'PAID',
            paymentId: payment.id,
            paidAmount: payment.amount / 100,
            paidAt: new Date(),
          },
        });
        console.log('✅ Invoice updated:', updatedInvoice);

        // Verify Twilio environment variables
        if (!process.env.TWILIO_PHONE_NUMBER) {
          console.error('❌ Missing TWILIO_PHONE_NUMBER');
          throw new Error('TWILIO_PHONE_NUMBER is required');
        }

        // Send SMS with try-catch
        try {
          const message = await twilio.messages.create({
            body: `Payment Received: ₹${payment.amount/100} for Invoice #${payment.order_id}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: '+919110010117'
          });
          console.log('📱 SMS sent:', message.sid);
        } catch (twilioError) {
          console.error('❌ Twilio Error:', twilioError);
          // Continue execution even if SMS fails
        }

        return NextResponse.json({
          success: true,
          invoice: updatedInvoice,
          event: event.event,
          paymentId: payment.id
        });
      } catch (dbError) {
        console.error('❌ Database Error:', dbError);
        return NextResponse.json(
          { error: 'Failed to update invoice', details: dbError },
          { status: 500 }
        );
      }
    } else {
      console.log('⏭️ Ignoring non-payment event:', event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
}