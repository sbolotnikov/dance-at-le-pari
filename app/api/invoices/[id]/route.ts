import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { equal } from 'assert';
 

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {

  try {
    const invoices = await prisma.invoice.findMany({
      where: { customer: { id: parseInt(params.id) } },
      include: {
        customer: true,
        installments: true,
        sessions: true,
        manager: true,
      },
    });
    if (!invoices) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}