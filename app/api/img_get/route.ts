
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    const data = await req.json();
    const {id} = data;

    const picture = await prisma.picture.findUnique({
        where: {
          id,
        },
      });
    await prisma.$disconnect()
    if (picture==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such picture exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify({message:picture.file}), {
    status: 201,
  });
}