
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const data = await req.json();
    const {id} = data;

    const template = await prisma.eventTemplate.findUnique({
        where: {
          id,
        },
      });
    await prisma.$disconnect()
    if (template==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such template exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify({template}), {
    status: 201,
  });
}