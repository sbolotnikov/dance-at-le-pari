 import { prisma } from '@/lib/prisma';
    import { NextResponse } from 'next/server';
    
    export  async function POST(
      req: Request
    ) {
      
      try {
    
        const data = await req.json();
        const {id} = data;
    
        const user = await prisma.user.findUnique({
            where: {
             id
            },
          })
        await prisma.$disconnect()
        //Send success response
        if (user!==null)
        return new NextResponse(
          JSON.stringify({ id: user.id,
            image: user.image,
            name: user.name}),{status: 201,
          });
          return new NextResponse(
            JSON.stringify({ message: 'User not found...' , status: 404,}),
          );
      } catch (error) {
        console.log(error);
        await prisma.$disconnect()
        return new NextResponse(
          JSON.stringify({ message: 'Internal server Error' , status: 500,}),
        );
      }
    }
