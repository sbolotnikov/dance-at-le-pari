import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function PUT(
  req: Request
) {
  
  try {

    const data1 = await req.json();
    const {id, data } = data1;

    const updateScheduleEvent = await prisma.scheduleEvent.update({
        where: {
          id
        },
        data
      })
    console.log(updateScheduleEvent)
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Schedule event updated',updateScheduleEvent,status: 201,
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