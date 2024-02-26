import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';


export  async function POST(
  req: Request
) {
  
  try {

    const data = await req.json();
    const {activityID,image,eventtype,tag,price,invoice,purchasedAt,seat,table,date,userID} = data;

    const overpending=await prisma.purchase.deleteMany({
        where: {
            status:"Pending",
            createdAt: {
                lt:new Date(Date.now() -4*60*1000),
            }
        },
      });
      console.log(overpending)

    const purchase = await prisma.purchase.findMany({
        where: {
            activityID, seat,table
        },
      });  
      console.log(purchase)
      if (purchase.length==0) {
        const createdPurchaseBlock = await prisma.purchase.create({
            data:{activityID,image,eventtype,tag,price,invoice,purchasedAt,seat,table,date,userID,status:"Pending"} 
          })
        return new NextResponse(JSON.stringify({message:createdPurchaseBlock}), {
            status: 201,
          });  
        
      }
      console.log("Doublebook")
      return new NextResponse(
        JSON.stringify({ message: 'Sorry seat is taken already',status: 422}),
      );
    


    
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'Purchase block created',status: 201,
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