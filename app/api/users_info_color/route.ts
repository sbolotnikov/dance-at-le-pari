import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    

    const users = await prisma.user.findMany({});
    await prisma.$disconnect()
    if (users==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No  users exist',status: 422}),
      );
    }
    const info=users.map((user)=>{return {id:user.id, color:user.color,role:user.role, image:user.image, name:user.name}})
  return new NextResponse(JSON.stringify(info), {status: 201});
}