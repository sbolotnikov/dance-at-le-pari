import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
 
  const event1 = await prisma.event.findMany({
    where: {
      date: {
        gte: new Date().toISOString().split('T')[0],
      },
    },
  });

  let teachersIds: number[] = [];
  let minPriceOptions: number[] = []; 
  for (let i = 0; i < event1.length; i++) {
    const options = await prisma.priceOptions.findMany({where:{ templateID: event1[i].templateID} })
    minPriceOptions.push(Math.min(...options.map((option) => option.price)))
    if (event1[i].teachersid[0] != undefined)
      teachersIds.push(event1[i].teachersid[0]);
  } 
  let teachers: { id: number; name: string |null}[] = [];
  if (teachersIds.length !== 0) {
    teachers = await prisma.user.findMany({
      where: {
        id: { in: teachersIds },
      },
      select: {
        id: true,
        name: true,
      },
    });
  } 
  await prisma.$disconnect();
  if (event1 == null) {
    return new NextResponse(
      JSON.stringify({ message: 'No such event exist', status: 422 })
    );
  }
  const eventJSON = event1.map((item,index) => {
    return {
      date: item.date,
      tag: item.tag,
      description: item.description,
      eventtype: item.eventtype,
      image: item.image,
      id: item.id,
      length: item.length, 
      minprice:minPriceOptions[index],
      teacher:
        item.teachersid[0] != undefined
          ? teachers.find((i) => i.id === item.teachersid[0])?.name || ''
          : '',
    };
  }); 
  return new NextResponse(JSON.stringify({ eventJSON }), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic';
