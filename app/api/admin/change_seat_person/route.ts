import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function PUT(
  req: Request
) {
  
  try {

    const data1 = await req.json();
    const {id, oldPlace, note } = data1;
    const ticketToUpdate = await prisma.purchase.findFirst({
        where: {
            activityID:parseInt(id),
          table:oldPlace.table, seat:oldPlace.seat
        },
      })
      console.log(ticketToUpdate)
    const updateSeat = await prisma.purchase.update({
        where: {
          id:ticketToUpdate?.id
        },
        data:{
            personNote: note
        },
      })
    console.log(updateSeat)
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Person updated',status: 201,
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