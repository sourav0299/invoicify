import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

// Create invoice
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const invoice = await prisma.invoice.create({
      data: {
        billingAddress: data.billingAddress,
        invoiceNumber: data.invoiceNumber,
        billDate: new Date(data.billDate),
        paymentDeadline: new Date(data.paymentDeadline),
        totalTax: data.totalTax,
        totalBeforeTax: data.totalBeforeTax,
        totalAfterTax: data.totalAfterTax,
        additionalCharges: data.additionalCharges || 0,
        roundOff: data.roundOff || 0,
        discount: data.discount || 0,
        totalPayableAmount: data.totalPayableAmount,
        userId: data.userId,
        items: {
          create: data.items.map((item: any) => ({
            itemName: item.itemName,
            itemType: item.itemType,
            itemCode: item.itemCode,
            quantity: parseInt(item.inventory),
            measuringUnit: item.measuringUnit,
            unitPrice: parseFloat(item.salesPrice),
            tax: parseFloat(item.taxRate),
            beforeTaxAmount: item.beforeTaxAmount,
            afterTaxAmount: item.afterTaxAmount,
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

// Get all invoices
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: userId ? parseInt(userId) : undefined
      },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}