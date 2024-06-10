import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  let dt = new Date();
  const dateString =
    dt.toISOString().split('T')[0] +
    'T' +
    dt.toLocaleString('es-CL').split(' ')[1].slice(0, -3);
  const eventsArray = await prisma.event.findMany({
    where: {
      specialEvent: true,
      date: { gt: dateString },
    },
  });

  eventsArray.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));
  await prisma.$disconnect();
  const events = eventsArray.map((event, index) => {
    return {
      eventtype: event.eventtype,
      id: event.id,
      image: event.image,
      tag:
        new Date(event.date).toLocaleDateString('en-us', {
          weekday: 'short',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }) +
        ' ' +
        new Date(event.date).toLocaleTimeString('en-US', {
          timeStyle: 'short',
        }) +
        ' ' +
        event.tag, 
      description: event.description,
    };
  });

  return new NextResponse(JSON.stringify(events), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic';
