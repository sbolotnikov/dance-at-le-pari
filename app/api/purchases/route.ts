 
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse(JSON.stringify({ message: 'unauthorized', status: 401}), )
    }
    let purchases:any
    if (session.user.role !=='Admin'){ 
      purchases = await prisma.purchase.findMany({
        where:{
            userID:session.user.id
        }
})} else {  
     purchases = await prisma.purchase.findMany({include:{user:true}})
}
    await prisma.$disconnect()
    if (purchases==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such products exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify({purchases}), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'