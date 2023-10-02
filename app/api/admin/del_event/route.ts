import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export  async function POST(
  req: Request
) {
  
  try {

    const data = await req.json();
    const {id} = data;

    const deletedEvent = await prisma.event.delete({
        where: {
         id
        },
      })
    console.log(deletedEvent)
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Event deleted',status: 201,
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