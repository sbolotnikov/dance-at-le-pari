
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET() {

    const event1 = await prisma.event.findMany(
        {
        where:{
          date:{
            gte:new Date().toISOString().split('T')[0]

          }

        },    
        include: {
          template: true,
          },
    }
    );
    let teachersIds: number[] = [];
    for (let i=0; i<event1.length; i++) {
       if (event1[i].template.teachersid[0]!=undefined) 
       teachersIds.push(event1[i].template.teachersid[0])
    }
    const teachers = await prisma.user.findMany({
        where:{
            id:{in: teachersIds}
        }
    })
    console.log(teachers)
    await prisma.$disconnect()
    if (event1==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such event exist',status: 422}),
      );
    }
  const eventJSON = event1.map((item)=>{return {date:item.date,tag:item.tag,description:item.template.description,eventtype:item.eventtype, image:item.image, id:item.id, length:item.template.length, price:item.template.price,teacher:(item.template.teachersid[0]!=undefined)?teachers.filter(i=>i.id===item.template.teachersid[0])[0].name:""}})
  return new NextResponse(JSON.stringify({eventJSON}), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'