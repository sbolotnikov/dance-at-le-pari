

    import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
type Data = {
  name: string
}

export async function GET(request: Request) {

    const users = await prisma.user.findMany({ where: {
      OR: [
        {role:'Student'}, {role:'User'}
]},})
    await prisma.$disconnect()
    if (users==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'Not one user exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify(users.map((item)=>{return{image:item.image,email:item.email, name:item.name,id:item.id}})), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'