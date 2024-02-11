
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET() {

    const product1 = await prisma.eventTemplate.findMany();
    await prisma.$disconnect()
    if (product1==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such products exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify({products:product1}), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'