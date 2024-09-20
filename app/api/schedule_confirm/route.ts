 
import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export const PUT = async (req: Request) => {
   

    try {
      const data = await req.json();
      const {changesmade} = data;
      let temp = [];
      for (let i = 0; i < changesmade.length; i++) {
        temp.push(
          await prisma.scheduleEvent.update({
            where: {
              id: changesmade[i].id,
            },
            data: {
              confirmed: changesmade[i].confirmed,
            },
          })
        );
      }
      await prisma.$disconnect()
      return new NextResponse(JSON.stringify({temp,  status: 200 }));
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" ,  status: 500 })
      );
    }
  };