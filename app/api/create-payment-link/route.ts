import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
// import * as Brevo from '@brevo/nodejs-sdk';
import { Twilio } from 'twilio';
// import { TrelloClient } from '@trello/api-client';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// const brevo = new Brevo.TransactionalEmailsApi();
// brevo.setApiKey(process.env.BREVO_API_KEY);

const twilio = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// const trello = new TrelloClient({
//   key: process.env.TRELLO_API_KEY,
//   token: process.env.TRELLO_TOKEN,
// });

export async function POST(request: Request) {
  try {
    const { 
      amount,
      customerName,
      customerEmail,
      customerPhone,
      invoiceNumber,
      dueDate,
      description 
    } = await request.json();

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, 
      currency: "INR",
      accept_partial: false,
      description: description,
      customer: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone
      },
      notify: {
        sms: true,
        email: true,
        whatsapp: true
      },
      reminder_enable: true,
      notes: {
        invoiceNumber: invoiceNumber
      },
      expire_by: Math.floor(expiryDate.getTime() / 1000),
    });

    const emailParams = {
      to: [{ email: customerEmail, name: customerName }],
      subject: `Payment Link for Invoice #${invoiceNumber}`,
      htmlContent: `
        <h2>Payment Link for Invoice #${invoiceNumber}</h2>
        <p>Dear ${customerName},</p>
        <p>Please find the payment link for your invoice below:</p>
        <p><a href="${paymentLink.short_url}">Click here to make payment</a></p>
        <p>Amount: ₹${amount}</p>
        <p>Due Date: ${dueDate}</p>
        <p>This payment link will expire in 30 days.</p>
      `,
      sender: { name: "Your Company", email: "invoices@yourcompany.com" }
    };

    // await brevo.sendTransacEmail(emailParams);

    await twilio.messages.create({
      body: `Payment link for Invoice #${invoiceNumber}: ${paymentLink.short_url}. Amount: ₹${amount}. Due date: ${dueDate}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: customerPhone
    });

    // const card = await trello.card.create({
    //   name: `Payment Link - Invoice #${invoiceNumber}`,
    //   desc: `
    //     Customer: ${customerName}
    //     Email: ${customerEmail}
    //     Phone: ${customerPhone}
    //     Amount: ₹${amount}
    //     Due Date: ${dueDate}
    //     Payment Link: ${paymentLink.short_url}
    //     Expiry Date: ${expiryDate.toLocaleDateString()}
    //   `,
    //   idList: process.env.TRELLO_LIST_ID,
    //   due: expiryDate.toISOString()
    // });

    // Send WhatsApp message via Twilio
    await twilio.messages.create({
      body: `Payment link for Invoice #${invoiceNumber}: ${paymentLink.short_url}. Amount: ₹${amount}. Due date: ${dueDate}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${customerPhone}`
    });

    return NextResponse.json({
      success: true,
      paymentLink: paymentLink.short_url,
      expiryDate: expiryDate,
    //   trelloCard: card.url
    });

  } catch (error) {
    console.error('Error creating payment link:', error);
    return NextResponse.json(
      { error: 'Failed to create payment link' },
      { status: 500 }
    );
  }
}