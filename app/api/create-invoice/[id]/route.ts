import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

// Get single invoice
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { items: true }
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

// Update invoice
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    // Delete existing items
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: params.id }
    });

    // Update invoice with new items
    const invoice = await prisma.invoice.update({
      where: { id: params.id },
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
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

// Delete invoice
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: params.id }
    });

    await prisma.invoice.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}