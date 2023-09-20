
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const data = await req.json();
    const {id} = data;

    const event1 = await prisma.event.findUnique({
        where: {
          id:parseInt(id),
        },
      });
    await prisma.$disconnect()
    if (event1==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such event exist',status: 422}),
      );
    }
    
  return new NextResponse(JSON.stringify({event1}), {
    status: 201,
  });
}