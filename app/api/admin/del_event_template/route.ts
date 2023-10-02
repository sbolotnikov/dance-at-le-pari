import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export  async function POST(
  req: Request
) {
  
  try {

    const data = await req.json();
    const {id} = data;

    const deletedTemplate = await prisma.eventTemplate.delete({
        where: {
         id
        },
      })
    console.log(deletedTemplate)
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Event Template deleted',status: 201,
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