
import { sendAnyEmail } from '@/utils/sendAnyEmail';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const { email, name,title, message } = data;
  // await new Promise((resolve, reject) => {
   const res = await sendAnyEmail({
    email1:  email,
    email2: process.env.EMAIL_SERVER_USER ? process.env.EMAIL_SERVER_USER : '',
    subject: title,
    text: message,
    html: message.replace(/<[^>]*>/g, ''),
    attachments: undefined
  })
  
 return new NextResponse( JSON.stringify(res));
}