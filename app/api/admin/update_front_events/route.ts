import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function PUT(
  req: Request
) {
  
  try {

    const data = await req.json();
    const {events} = data;

    const updateSettings = await prisma.settingVar.update({
        where: {
          id:0
        },
        data:{front_templates_ids: events}
      })
    console.log(updateSettings)
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
      JSON.stringify({ message: 'Internal server Error' , status: 500,}),
    );
  }
}