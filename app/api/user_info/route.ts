 
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const data = await req.json();
    const {id} = data;

    const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
    await prisma.$disconnect()
    if (user==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such user exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify({bio:user.bio, color:user.color}), {
    status: 201,
  });
}