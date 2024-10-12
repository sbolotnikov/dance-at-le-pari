import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
 
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/configs/authOptions';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401
    })
  }
  const schedule = await prisma.scheduleEvent.findMany({});
    await prisma.$disconnect()
if ((session.user.role=="Admin")||(session.user.role=="Teacher")||(session.user.role=="OutTeacher")){
    return NextResponse.json( schedule, { status:201})
}else if (session.user.role=="Student"){
    
    const studentSchedule =schedule.filter( (item)=>item.studentid.indexOf(session.user.id)!==-1)
    await prisma.$disconnect()
    console.log(studentSchedule)
    return NextResponse.json( studentSchedule , { status:201})
}
  
}