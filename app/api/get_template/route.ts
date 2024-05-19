
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const data = await req.json();
    const {id} = data;
    const product1 = await prisma.eventTemplate.findUnique({
        where: {
            id:parseInt(id),
          },
        include:{options:true }});
    await prisma.$disconnect()
    if (product1==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such products exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify({template:product1}), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'