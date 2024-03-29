import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
type Data = {
  name: string
}

export async function GET(request: Request) {

    const templates = await prisma.eventTemplate.findMany({ where: {
      OR: [{eventtype:'Group'},{ eventtype:'Party' },],
     },})
    await prisma.$disconnect()
    if (templates==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'Not one user exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify(templates), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'
