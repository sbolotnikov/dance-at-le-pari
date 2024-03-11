import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { updateBookingCustomAttributeDefinitionResponseSchema } from 'square/dist/types/models/updateBookingCustomAttributeDefinitionResponse';


export  async function PUT(
  req: Request
) {
  
  try {

    const data = await req.json();
    const {id, status} = data;

    const updateStatus = await prisma.purchase.update({
        where: {
          id:id
        },
        data:{status: status}
      })
    console.log(updateStatus)
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'User updated',status: 201,
      }),
    );
  } catch (error) {
    console.log(error);
    await prisma.$disconnect()
    return new NextResponse(
      JSON.stringify({ message: 'Internal server Error' , error: error, status: 500,}),
    );
  }
}