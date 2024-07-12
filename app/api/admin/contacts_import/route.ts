import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function POST(
  req: Request
) {
  
  try {

    const data = await req.json();
 
    // const contacts = await prisma.contact.createMany({
    //     data
    //   })
      let contacts = []
      for (let i=0;i<data.length;i++){
        console.log(data[i])
        contacts[i] = await prisma.contact.create({ data: data[i]})}
    await prisma.$disconnect()
    // Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Contacts created',contacts,status: 201,
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