import { sendAnyEmail } from '@/utils/sendAnyEmail';
import { NextResponse } from 'next/server';
import { html_receipt, text_receipt } from '../../../utils/htmlEmail';

export async function POST(req: Request) {
  const data = await req.json();
  const { email,items, qrCodes, invoice, total } = data;
  console.log( html_receipt(items, invoice, total))
  let attachments = [{
    filename: 'logo.png',
    path: process.env.NEXTAUTH_URL!+'/logo.png',
    cid: 'logo' //same cid value as in the html img src
},];
   for(let i=0; i<qrCodes.length;i++){
    if(qrCodes[i]>"")
    attachments.push({"filename": "qr_code"+(i+1)+".jpg", "path": qrCodes[i], "cid": "qrImage"+i})
   }
   const res = await sendAnyEmail({
    email2: process.env.EMAIL_SERVER_USER ? process.env.EMAIL_SERVER_USER : '',
    email1: email,
    subject: `Purchase receipt for ${invoice}`,
    text: text_receipt(items, invoice, total),
    html: html_receipt(items, invoice, total),
    attachments:attachments   
  })
 
  
 return new NextResponse( JSON.stringify(res));
}
