import { prisma } from '@/lib/prisma';
 
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data1 = await req.json();
    const { id, oldPlace,userID, note, image, eventtype, tag, price,date } = data1;

    const createSeat = await prisma.purchase.create({
      data: {
        personNote: note,
        activityID: parseInt(id),
        seat: oldPlace.seat,
        table: oldPlace.table,
        userID: parseInt(userID),
        purchasedAt: new Date().toISOString(),
        status: 'Purchased',
        invoice:"00000",
        amount:1,
        image,
        eventtype,
        tag,
        price,      
        date
      },
    });
    console.log(createSeat);
    await prisma.$disconnect();
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Ticket created', status: 201 })
    );
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    return new NextResponse(
      JSON.stringify({ message: 'Internal server Error', status: 500 })
    );
  }
}
