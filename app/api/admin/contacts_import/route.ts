import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function POST(
  req: Request
) {
  
  try {

    const data = await req.json();

    console.log(data)
    const createdSchedule = await prisma.contact.createMany({
        data,
        skipDuplicates: true,
      })
    await prisma.$disconnect()
    // Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Schedule event created',createdSchedule,status: 201,
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