
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
type TUser =  {id: number; name: string | null; image: string | null; email: string; emailVerified: Date | null; password: string | null; telephone: string | null; bio: string | null; role: string; createdAt: Date; updatedAt: Date; }
export async function POST(req: Request) {
    const data = await req.json();
    const {id} = data;

    const event1 = await prisma.event.findUnique({
        where: {
          id:parseInt(id),
        }
      });
    const template1 = await prisma.eventTemplate.findUnique({
        where:{
          id:event1?.templateID
        }
    }) 

    if ((template1?.teachersid.length==undefined)||(template1?.teachersid.length==0)){
      await prisma.$disconnect()
    return new NextResponse(JSON.stringify({date:event1?.date,teacher:"", bio:"", teacher_img:"", ...template1}), {
      status: 201,
    });

  }
    const teacher1 = await prisma.user.findUnique({
      where:{
        id:template1?.teachersid[0]
      }
  })
    await prisma.$disconnect()
    if (event1==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such event exist',status: 422}),
      );
    }
    
  return new NextResponse(JSON.stringify({date:event1.date,teacher:teacher1?.name, bio:teacher1?.bio, teacher_img:teacher1?.image, ...template1}), {
    status: 201,
  });
}