import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
type Data = {
  name: string
}

export async function GET(request: Request) {

    const templates = await prisma.eventTemplate.findMany()
    await prisma.$disconnect()
    if (templates==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'Not one user exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify(templates.map((item)=>{return{tag:item.tag,eventtype:item.eventtype,templateID:item.id, image:item.image}})), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'
