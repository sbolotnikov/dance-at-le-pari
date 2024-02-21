
import { NextResponse } from 'next/server';
import { Client } from 'square';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
const { paymentsApi }= new Client ({
    accessToken:  process.env.SQUARE_ACCESS_TOKEN,
    environment:'sandbox' as any,
})
export  async function POST(
  req: any, 
) {
   console.log(req.body)
  try {

    const data = await req.json();
    const {currency, sourceId, items, amount} = data;
    if (req.method === 'POST') {
            const { result } = await paymentsApi.createPayment({
              idempotencyKey: randomUUID(),
              sourceId: sourceId,
              amountMoney: {
                currency: currency,
                amount: amount*100  as any,
              }
            })
            let arrayOfTickets:{eventID:number,userID:number, purchasedAt:string, invoice:string | undefined,seat:number | null,table:number | null}[]=[]
            console.log(items, result.payment?.id)
            // for(let i=0;i<seats.length;i++){
            //   arrayOfTickets.push({eventID:parseInt(eventID),userID:parseInt(userID), purchasedAt:result.payment?.createdAt!, invoice:result.payment?.id,seat:seats[i].seat,table:seats[i].table})
            // }
            // console.log(seats,arrayOfTickets)
            //   const createdTickets = await prisma.ticket.createMany({
            //     data: arrayOfTickets
            // }) 
                 
              await prisma.$disconnect()
              //Send success response

              
            console.log(result);

            return new NextResponse(
                JSON.stringify({ message: 'Success' , status: 200,result,
                // createdTickets
              }),
              );
          } 
    
    
  } catch (error) {
    console.log(error);
    await prisma.$disconnect()
    return new NextResponse(
      JSON.stringify({ message: 'Payment did not get thru ' , status: 500, error}),
    );
  }
}