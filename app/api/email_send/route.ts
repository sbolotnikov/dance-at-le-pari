// import { sendEmail } from '@/utils/sendEmail';

import { sendAnyEmail } from '@/utils/sendAnyEmail';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const { email, name, message } = data;
  // await new Promise((resolve, reject) => {
   const res = await sendAnyEmail({
    email1: process.env.EMAIL_SERVER_USER ? process.env.EMAIL_SERVER_USER : '',
    email2: process.env.EMAIL_SERVER_USER ? process.env.EMAIL_SERVER_USER : '',
    subject: `Special request from ${name} <${email}>`,
    text: message,
    html: `<b>${message}</b>`,
  })
  
 return new NextResponse( JSON.stringify(res));
}
//  .then((response) => {
//   console.log(response);
//   return new NextResponse( JSON.stringify({ message: 'EMail sent',status: 201,}));
//  }).catch((err) => {
//   console.error(err);
//   return new NextResponse( JSON.stringify({ message: 'Internal server Error' , status: 500,}));
//  })
