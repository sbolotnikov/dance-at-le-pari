 
import { sendAnyEmail } from '@/utils/sendAnyEmail';
import { NextResponse } from 'next/server';
  

export async function POST(req: Request) {
  const data = await req.json();
  const { title,message,email,name } = data;

  // try {
 
        const res = await sendAnyEmail({
          email1: email,
          email2: process.env.EMAIL_SERVER_USER1 ? process.env.EMAIL_SERVER_USER1 : '',
          subject: title,
          text: message.replace(/<[^>]*>/g, '').replace('&NAME', name.trim() || ""),
          html: message.replace('&amp;NAME', name.trim() || ""),
          attachments: undefined
        }); 
        
        return new NextResponse(JSON.stringify(res));
  // } catch (error) {
  //   console.error('Error sending emails:', error);
  //   return new NextResponse(JSON.stringify({ accepted:['Failed to send email'] }), { status: 500 });
  // } 
}