import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";
// DELETE A POST
export const POST = async (req: Request) => {
   
    try {
  
      const data = await req.json();
      const {id} = data;
  
      const deletedPost = await prisma.category.delete({
          where: {
           id
          },
        }) 
      await prisma.$disconnect()
    
  
      return new NextResponse(JSON.stringify({deletedPost,  status: 200 }));
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" ,  status: 500 })
      );
    }
  };