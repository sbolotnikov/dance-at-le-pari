import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function POST(
  req: Request
) {
  
  try {

    const data1 = await req.json();
    const {id, oldPlace } = data1;
    console.log(oldPlace,id);
    const ticketToDelete = await prisma.purchase.findFirst({
        where: {
            activityID:-parseInt(id),
          table:oldPlace.table, seat:oldPlace.seat
        },
      })
      console.log(ticketToDelete)
      if (ticketToDelete?.invoice!="00000") return new NextResponse(
        JSON.stringify({ message: 'Can not remove bought ticket only move!',status: 301,
        }),
      );
    const deleteSeat = await prisma.purchase.delete({
        where: {
          id:ticketToDelete?.id
        },
        
      })
    console.log(deleteSeat)
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Block removed successfully',status: 201,
      }),
    );
  } catch (error) {
    console.log(error);
    await prisma.$disconnect()
    return new NextResponse(
      JSON.stringify({ message: 'Internal server Error' , status: 500,}),
    );
  }
} 