import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
export  async function POST(
  req: Request
) {
  
  try {

    // const data = await req.json();
    // const {id} = data;
    let obj1={}
   
      return new NextResponse(
        JSON.stringify({ obj1 , status: 404,}),
      );
  } catch (error) {
    console.log(error);
    await prisma.$disconnect()
    return new NextResponse(
      JSON.stringify({ message: 'Internal server Error' , status: 500,}),
    );
  }
}