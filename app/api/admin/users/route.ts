// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
type Data = {
  name: string
}

export async function GET(request: Request) {

    const users = await prisma.user.findMany({})
    await prisma.$disconnect()
    if (users==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'Not one user exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify(users), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'