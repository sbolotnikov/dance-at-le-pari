 
import { sendAnyEmail } from '@/utils/sendAnyEmail';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const { title, message, email } = data;
 
   const res = await sendAnyEmail({
    email1:  email,
    email2: process.env.EMAIL_SERVER_USER1 ? process.env.EMAIL_SERVER_USER1 : '',
    subject: title,
    text:  message.replace(/<[^>]*>/g, '').replace('&NAME', "sir/madam"),
    html: message.replace('&amp;NAME', "sir/madam"),
    attachments: undefined
  }) 
 return new NextResponse( JSON.stringify(res));
}
