import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
    try {
        const data1 = await req.json();
        const { id, table } = data1;
    const blockedSeats = await prisma.ticket.findMany({ where: {
        eventID:id,
          table:table,
       },})
    await prisma.$disconnect()
    let maxSeat=0;
    console.log(blockedSeats)
  for (let i = 0; i < blockedSeats.length; i++) {
    if (maxSeat<blockedSeats[i].seat!) maxSeat=blockedSeats[i].seat!; 
  }  
  return new NextResponse(JSON.stringify({booked:blockedSeats.length, maxSeat:maxSeat}));
} catch (error) {
    console.log(error);
    await prisma.$disconnect();
    return new NextResponse( JSON.stringify({booked:-1, maxSeat:-1}));
  }
}
export const dynamic = 'force-dynamic'