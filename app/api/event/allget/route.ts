
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
  const eventJSON = event1.map((item)=>{return {date:item.date,tag:item.tag, id:item.id}})
  return new NextResponse(JSON.stringify({eventJSON}), {
    status: 201,
  });
}

// {color:"#e09c6b",date:'2023-09-09T19:00:00',tag:"Party", id:0}