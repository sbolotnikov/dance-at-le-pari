import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function PUT(
  req: Request
) {
  
 

  try {

    const data = await req.json();
    const {eventtype,
        length,
        price,
        image,
        seatmap,
        tag,
        title,
        location,
        description,
        specialEvent,
        date:eventDateTime,
        // visible,
        teachersid,
        id} = data;

    const createdTemplate = await prisma.event.update({
        where: {
            id: id,
          },
        data:{eventtype,
            image,
            seatmap,
            tag,
            title,
            location,
            description,
            specialEvent,
            date:eventDateTime,
            // visible,
            teachersid,
            length:parseInt(length), 
            price:parseFloat(price),}
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