
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function POST(
  req: Request
) {
  
 

  try {

    const data = await req.json();
    const {date, eventtype, tag, image, templateID, tables,seatmap,length,price,teachersid,title,location,description,visible} = data;
    
    const createdTemplate = await prisma.event.create({
        data:{ date,eventtype, tag, image, templateID:parseInt(templateID), tables,seatmap,length,price,teachersid,title,location,description,visible }
      })
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Event created',id:createdTemplate.id,status: 201,
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