
import { NextResponse } from 'next/server';
import { Client } from 'square';
import { randomUUID } from 'crypto';

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
    const {currency, amount, sourceId} = data;
    if (req.method === 'POST') {
            const { result } = await paymentsApi.createPayment({
              idempotencyKey: randomUUID(),
              sourceId: sourceId,
              amountMoney: {
                currency: currency,
                amount: amount as any
              }
            })
            console.log(result);
            return new NextResponse(
                JSON.stringify({ message: 'Success' , status: 200,result}),
              );
          } 
    
    
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({ message: 'Payment did not get thru ' , status: 500,}),
    );
  }
}