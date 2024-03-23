  
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET() {

    const users = await prisma.user.findMany({
        where: {
            role: { in: ["Teacher", "Admin", "Owner"] },
            visible:true 
        },
      });
    await prisma.$disconnect()
    if (users==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such user exist',status: 422}),
      );
    }
    const team=users.map((user) =>{return {id:user.id, name:user.name, image:user.image, role:user.role, image2:user.image2, visible:user.visible, bio:user.bio}})
  return new NextResponse(JSON.stringify(team), {
    status: 201,
  });
}