  
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';
import { image } from 'html2canvas/dist/types/css/types/image';

export async function GET() {

    const users = await prisma.user.findMany({
        where: {
            role: { in: ["Teacher", "Admin", "Owner"] },
            visible:true 
        },
      }); 
    await prisma.$disconnect()
    // console.log("Images:", users.length, imgs.length,imgs)
    if (users==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such user exist',status: 422}),
      );
    }
    const team = users.map((user) =>{return {id:user.id, name:user.name, image:user.image, role:user.role, image2:user.image2, visible:user.visible, bio:user.bio}})
    // team.forEach((user) => {user.image=imgs.find((img) => {return img.id==user.image})!.file})
  return new NextResponse(JSON.stringify(team), {
    status: 201,
  });
}