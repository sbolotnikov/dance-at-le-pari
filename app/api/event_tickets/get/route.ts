
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const data = await req.json();
    const {id} = data;

    const tickets = await prisma.ticket.findMany({
        where: {
          eventID:id,
        },
        include:{user:true}
      });
    await prisma.$disconnect()
    if (tickets==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such template exist',status: 422}),
      );
    }
  const tix=tickets.map(ticket => {return{ id:ticket.id, name:ticket.user?.name, seat:ticket.seat, table:ticket.table}})
  return new NextResponse(JSON.stringify([...tix]), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'