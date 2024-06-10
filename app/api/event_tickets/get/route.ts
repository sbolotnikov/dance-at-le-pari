
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const data = await req.json();
    const {id} = data;
    console.log(id)
    const overpending=await prisma.purchase.deleteMany({
      where: {
          status:"Pending",
          createdAt: {
              lt:new Date(Date.now() -10*60*1000),
          }
      },
    });   
    // earlier then 10 not wise because they might be in the cart
    const tickets = await prisma.purchase.findMany({
        where: {
          activityID:-1*id,
        },
        include:{user:true}
      });
    await prisma.$disconnect()
    if (tickets==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such template exist',status: 422}),
      );
    }
  const tix=tickets.map(ticket => {return{ id:ticket.id, name:ticket.user?.name,personNote:ticket.personNote, seat:ticket.seat, table:ticket.table}})
  return new NextResponse(JSON.stringify([...tix]), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'