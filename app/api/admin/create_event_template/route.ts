import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function POST(
  req: Request
) {
  
 

  try {

    const data = await req.json();
    const {eventtype,length, price,amount, image, tag, title, location, description,visible,priceOptions,teachersid} = data;

    const createdTemplate = await prisma.eventTemplate.create({
        data:{eventtype,length:parseInt(length), price:parseFloat(price), amount, image, tag,  title, location, description, visible,teachersid }
      })
    if(priceOptions){
      for (const option of priceOptions) {
        await prisma.priceOptions.create({
          data:{tag:option.tag, price:option.price, amount:option.amount, templateID:createdTemplate.id}
        })
      }
    }
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