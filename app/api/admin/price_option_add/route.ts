import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function POST(
  req: Request
) {
  
 

  try {

    const data = await req.json();
    const { price,amount, tag, templateID} = data;

    const createdTemplate = await prisma.priceOptions.create({
        data:{price:parseFloat(price), amount,  tag, templateID }
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