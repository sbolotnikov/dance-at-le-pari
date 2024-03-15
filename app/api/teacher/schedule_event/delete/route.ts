import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export  async function POST(
  req: Request
) {
  
  try {

    const data = await req.json();
    const {id} = data;
    console.log(id)
    const deletedScheduleEvent = await prisma.scheduleEvent.delete({
        where: {
         id
        },
      })
    console.log(deletedScheduleEvent)
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'User deleted', deletedScheduleEvent, status: 201,
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