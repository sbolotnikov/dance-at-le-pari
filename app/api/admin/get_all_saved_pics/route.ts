import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
type Data = {
  name: string
}

export async function GET(request: Request) {

    const pictures = await prisma.picture.findMany({ where: {
        file_name:'Events'
       },})
    await prisma.$disconnect()
    if (pictures==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'Not one user exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify(pictures.map((item)=>{return{file:item.file,id:item.id}})), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'