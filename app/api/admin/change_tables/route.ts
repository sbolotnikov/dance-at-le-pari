import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function PUT(
  req: Request
) {
  
  try {

    const data1 = await req.json();
    const {id, tables } = data1;

    const updateSeat = await prisma.event.update({
        where: {
          id:id
        },
        data:{
          tables
        },
      })
    console.log(updateSeat)
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Tables updated',status: 201,
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