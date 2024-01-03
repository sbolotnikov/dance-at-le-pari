
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET() {


    const settings = await prisma.settingVar.findUnique({
        where: {
          id:0,
        },
      }); 
    let dt= new Date()
    const dateString = dt.toISOString().split('T')[0]+'T'+dt.toLocaleString('es-CL').split(" ")[1].slice(0,-3);
    const eventsArray = await prisma.event.findMany({
        where: {
            templateID: { in: settings!.front_templates_ids },
            date:{ gt: dateString}
        }
    })
    
    eventsArray.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))
    let events1=[]
    for (let i=0; i<settings!.front_templates_ids.length;i++){
      if (eventsArray.filter(item=>item.templateID==settings!.front_templates_ids[i])[0]!=undefined)
       events1.push(eventsArray.filter(item=>item.templateID==settings!.front_templates_ids[i])[0])
    }    
    let picsArr:string[] =[];
    let aStr
    for (let i=0; i<events1.length;i++){
      aStr = await prisma.picture.findUnique({
        where: {
          id:events1[i].image!,
        },
      });
      picsArr[i]=aStr?.file!.toString()!
    }
    await prisma.$disconnect()


    const events=events1.map((event,index)=>{return{date:event.date, eventtype:event.eventtype, id:event.id, image:picsArr[index], tag:event.tag}})
    if (settings==null) {
      
      return new NextResponse(
        JSON.stringify({ message: 'No such template exist',status: 422}),
      );
    }
  return new NextResponse(JSON.stringify(events ), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'