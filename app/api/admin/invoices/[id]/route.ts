import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
 

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        installments: true,
        sessions: true,
        manager: true,
      },
    });
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
   

  try {
    const body = await req.json();
    const { customerId, installments, sessions, discount, effectiveDate, packageType } = body;

    const updatedInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        customer: { connect: { id: parseInt(customerId, 10) } },
        installments: {
          deleteMany: {},
          create: installments.map((i: any) => ({ ...i, date: new Date(i.date) }))
        },
        sessions: {
          deleteMany: {},
          create: sessions.map((s: any) => ({ ...s, sessionType: s.sessionType.charAt(0).toUpperCase() + s.sessionType.slice(1) }))
        },
        discount,
        effectiveDate: new Date(effectiveDate),
        packageType
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  console.log('Received DELETE request for invoice ID:', params.id);
  try {
    await prisma.invoice.delete({ where: { id: params.id } });
    console.log('Invoice deleted successfully from DB.');
    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice from DB:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}
