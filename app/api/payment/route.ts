
import { NextResponse } from 'next/server';
import { Client } from 'square';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendAnyEmail } from '@/utils/sendAnyEmail';
import { html_receipt, text_receipt } from '@/utils/htmlEmail';

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
const { paymentsApi }= new Client ({
    accessToken:  process.env.SQUARE_ACCESS_TOKEN,
    environment:process.env.SQUARE_APP_ENVIRONMENT as any,
})
export  async function POST(
  req: any, 
) {
   console.log(req.body)
  try {

    const data = await req.json();
    const {currency, sourceId, items, amount, userID} = data;
    if (req.method === 'POST') {
            






            const { result } = await paymentsApi.createPayment({
              idempotencyKey: randomUUID(),
              sourceId: sourceId,
              amountMoney: {
                currency: currency,
                amount: amount*100  as any,
              }
            })

           
            
            let arrayOfTickets:{activityID:number,userID:number | undefined, purchasedAt:string, invoice:any,seat:number | null,table:number | null, image: string,eventtype:any,tag:string,price:number, amount:number,date:string | null, status:any}[] = [];
            console.log(items, result.payment?.id)
            for(let i=0;i<items.length;i++){
              if ((items[i].id>0)||((items[i].id<0)&&(items[i].seat==null))) {
                 arrayOfTickets.push({activityID:items[i].id,image:items[i].image,eventtype:items[i].eventtype,userID:userID,tag:items[i].tag,price:items[i].price,amount:items[i].amount,invoice:result.payment?.id,purchasedAt:result.payment?.createdAt!, seat: null, table: null, date:null,status:"Purchased"});
              }else{
                const updateTicket = await prisma.purchase.updateMany({
                  where: {
                    activityID: items[i].id,
                    seat: items[i].seat,
                    table: items[i].table
                  },
                  data:{
                    status:"Purchased", purchasedAt:result.payment?.createdAt!, invoice:result.payment?.id,
                  },
                })


                console.log(updateTicket)
              }
            }
            // console.log(seats,arrayOfTickets)
              const createdTickets = await prisma.purchase.createMany({
                data: arrayOfTickets
            }) 
                 
              
              if (userID) {
                const user = await prisma.user.findUnique({
                  where: {
                    id: userID
                  }
                });
              //Send email notification
              const res1 = await sendAnyEmail({
                email2: process.env.EMAIL_SERVER_USER1 ? process.env.EMAIL_SERVER_USER1 : '',
                email1: process.env.EMAIL_SERVER_USER1 ? process.env.EMAIL_SERVER_USER1 : '',
                subject: `New Purchase from ${user?.name} email ${user?.email} invoice# ${result.payment?.id}`,
                text: text_receipt(items, result.payment?.id, amount),
                html: html_receipt(items,result.payment?.id, amount),
                attachments:[{
                  filename: 'logo.png',
                  path: process.env.NEXTAUTH_URL!+'/logo.png',
                  cid: 'logo' //same cid value as in the html img src
              },]   
              }) 
            } else{
              const res1 = await sendAnyEmail({
                email2: process.env.EMAIL_SERVER_USER1 ? process.env.EMAIL_SERVER_USER1 : '',
                email1: process.env.EMAIL_SERVER_USER1 ? process.env.EMAIL_SERVER_USER1 : '',
                subject: `New Purchase from unknown user invoice# ${result.payment?.id}`,
                text: text_receipt(items, result.payment?.id, amount),
                html: html_receipt(items,result.payment?.id, amount),
                attachments:[{
                  filename: 'logo.png',
                  path: process.env.NEXTAUTH_URL!+'/logo.png',
                  cid: 'logo' //same cid value as in the html img src
              },]   
              })
            }
              await prisma.$disconnect()
              //Send success response

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