
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET() {

    const event1 = await prisma.event.findMany();
    await prisma.$disconnect()
    if (event1==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such event exist',status: 422}),
      );
    }
  const eventJSON = event1.map((item)=>{return {date:item.date,tag:item.tag,eventtype:item.eventtype, id:-item.id, location:item.location, length:item.length, teachersid:item.teachersid, studentid:[]}})
  return new NextResponse(JSON.stringify({eventJSON}), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'