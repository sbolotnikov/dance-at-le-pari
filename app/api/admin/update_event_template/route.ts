import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function PUT(
  req: Request
) {
  
 

  try {

    const data = await req.json();
    const {eventtype,length,amount, image, tag, title, location, description,visible, priceOptions,teachersid,id} = data;
    const optionsToDelete = await prisma.priceOptions.deleteMany({
      where: {
        templateID: id,
      }
    })
    const createdTemplate = await prisma.eventTemplate.update({
        where: {
            id: id,
          },
        data:{eventtype,length:parseInt(length),amount, image, tag,  title, location, description, visible,teachersid }
      })
      if(priceOptions){
        for (const option of priceOptions) {
          await prisma.priceOptions.create({
            data:{tag:option.tag, price:option.price, amount:option.amount, templateID:id}
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