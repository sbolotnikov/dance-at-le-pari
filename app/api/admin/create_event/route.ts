
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function POST(
  req: Request
) {




    const data = await req.json();
    
    const {date, eventtype, tag, image, templateID, tables,seatmap,length,price,teachersid,title,location,description,visible,repeating,interval,until} = data;
    let dateArr = [] as string[];
    dateArr.push(date);
    
    if (repeating == true && interval! > 0) {
      let time1=date
      .split('T')[1];
      // if (time1.length==4) time1='0'+time1;
      let dateObj = Date.parse(date);
      
      let newDateOBJ = new Date(dateObj + interval!);
      
      let d =
        newDateOBJ.toLocaleDateString('sv-SE', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }) +
        'T' +
        time1;
      let i = 2;
      
      while (d <= until!) {
        dateArr.push(d);
        newDateOBJ = new Date(dateObj + i * interval!);

        d =
          newDateOBJ.toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }) +
          'T' +
          time1 ;
           
        i++;
      }
      // console.log(dateArr.map((date) =>{ return{ date, eventtype, tag, image, templateID:parseInt(templateID), tables,seatmap,length,price,teachersid,title,location,description,visible 
      // }}));
    }

    try {
    const createdTemplate = await prisma.event.createMany({
      data: dateArr.map((date) =>{ return{ date, eventtype, tag, image, templateID:parseInt(templateID), tables,seatmap,length,price,teachersid,title,location,description,visible 
    }})
  })
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Event created',createdTemplate,status: 201,
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