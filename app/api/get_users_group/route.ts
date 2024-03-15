import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
type Data = {
  name: string
}

export async function POST(request: Request) {
    const data = await request.json();
    const teachers = await prisma.user.findMany({ where: {
      OR: data},})
    await prisma.$disconnect()
    console.log(teachers)
    if (teachers==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'Not one user exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify(teachers.map((item)=>{return{image:item.image, name:item.name,id:item.id}})), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'