import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function POST(
  req: Request
) {
  
 

  try {

    const data = await req.json();
    const {eventtype,length, price, image, tag, title, location, description,} = data;

    const createdTemplate = await prisma.eventTemplate.create({
        data:{eventtype,length:parseInt(length), price:parseFloat(price), image, tag,  title, location, description, visible:true,teachersid:[2] }
      })
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Template created',id:createdTemplate.id,status: 201,
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