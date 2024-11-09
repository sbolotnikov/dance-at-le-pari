import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function POST(
  req: Request
) {
  
  try {

    const data = await req.json();

    console.log(data)
    let event1= data[data.length-1];
    const createdInitialSchedule = await prisma.scheduleEvent.create({
        data: {
          date: event1.date,
          eventtype: event1.eventtype,
          length: event1.length,
          location: event1.location,
          studentid: event1.studentid,
          tag: event1.tag,
          teachersid: event1.teachersid,
        }
      })
      
    let events = data.slice(0,data.length-1);
    if (events.length > 0) {
    const createdSchedule = await prisma.scheduleEvent.createMany({
        data: events.map((event: any) => ({
          date: event.date,
          eventtype: event.eventtype,
          length: event.length,
          location: event.location,
          studentid: event.studentid,
          tag: event.tag,
          teachersid: event.teachersid,
          sequence: createdInitialSchedule.id,
        }))
      })
      const updateScheduleEvent = await prisma.scheduleEvent.update({
        where: {
          id: createdInitialSchedule.id
        },
        data:{sequence: createdInitialSchedule.id}
      })
      await prisma.$disconnect()
      return new NextResponse(
        JSON.stringify({ message: 'Schedule event created',createdInitialSchedule,createdSchedule,status: 201,
        }),
      );
    }
    await prisma.$disconnect()
    // Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Schedule event created', createdInitialSchedule ,status: 201,
      }),
    );
  } catch (error) {
    console.log(error);
    await prisma.$disconnect()
    return new NextResponse(
      JSON.stringify({ message: 'Internal server Error' , status: 500,}),
    );
  }
}