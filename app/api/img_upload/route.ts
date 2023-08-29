import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function POST(
  req: Request
) {
  
  try {

    const data = await req.json();
    const {file, file_name} = data;

    const createdPic = await prisma.picture.create({
        data:{file, file_name}
      })
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Picture created',id:createdPic.id,status: 201,
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