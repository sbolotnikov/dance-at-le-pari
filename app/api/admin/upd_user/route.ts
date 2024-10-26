import { prisma } from '@/lib/prisma';
import { data } from 'autoprefixer';
import { NextResponse } from 'next/server';

export  async function PUT(
  req: Request
) {
  
  try {

    const data = await req.json();
    const {id, name, bio} = data;
    let dataObj: { name?: string, bio?: string} = {};
    
    if(name!==undefined){
      dataObj.name = name;
    }
    if(bio!==undefined){
        dataObj.bio = bio;
      }
    let updatedUser = await prisma.user.update({
        where: {
          id:id
        },
        data:dataObj
      });
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