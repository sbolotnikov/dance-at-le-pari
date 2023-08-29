import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export  async function POST(
  req: Request
) {
  
  try {

    const data = await req.json();
    const {id} = data;

    const deletedPicture = await prisma.picture.delete({
        where: {
         id
        },
      })

    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Picture deleted',status: 201,
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