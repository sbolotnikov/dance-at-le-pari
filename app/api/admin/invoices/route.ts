import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export async function GET(req: Request) {
 

  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
        installments: true,
        sessions: true,
      },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Incoming POST request body:', body);
    const { customerId, installments, sessions, discount, managerId, packageType, effectiveDate } = body;

    const newInvoice = await prisma.invoice.create({
      data: {
        customer: { connect: { id: parseInt(customerId, 10) } },
        manager: { connect: { id: parseInt(managerId, 10) } },
        installments: {
          create: installments.map((i: any) => ({ ...i, date: new Date(i.date) }))
        },
        sessions: {
          create: sessions.map((s: any) => ({ ...s, sessionType: s.sessionType.charAt(0).toUpperCase() + s.sessionType.slice(1) }))
        },
        discount,
        packageType,
        effectiveDate
      },
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
