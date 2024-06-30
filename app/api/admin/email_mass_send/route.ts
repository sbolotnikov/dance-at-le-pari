
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
    text:  message.replace(/<[^>]*>/g, ''),
    html: message,
    attachments: undefined
  })
  
 return new NextResponse( JSON.stringify(res));
}


// `
//   <html lang="en" >
  
// <body>
//   <div style="width:100%;padding:0.25rem;">
//     <div style="width:100%;height:12rem; color:#110c6e;">
//       <img src="cid:logo" style="display: block;margin-left: auto;margin-right: auto;" width="100" height="100" alt="Logo" />

//       <h2 style="text-align:center;font-weight:700;font-size:1.25rem;line-height:1.75rem;">
//         Dance At Le Pari
//       </h2>
//     </div>