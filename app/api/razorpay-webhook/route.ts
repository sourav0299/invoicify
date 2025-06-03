import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { Readable } from 'stream';

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET as string;

export const config = {
  api: {
    bodyParser: false, // Required to get the raw body
  },
};

// Helper to buffer the incoming stream
async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['x-razorpay-signature'] as string;

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid Signature' });
    }

    const event = JSON.parse(rawBody.toString());

    // Access data from payload
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
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

      // TODO: update your database here
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
}
