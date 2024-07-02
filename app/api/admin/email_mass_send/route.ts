
import { prisma } from '@/lib/prisma';
import { sendAnyEmail } from '@/utils/sendAnyEmail';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const { title, message } = data;
  // await new Promise((resolve, reject) => {
    const contacts = await prisma.contact.findMany({ where: {
      OR: [{status:'Subscribed'}],
     },})
    await prisma.$disconnect()
    let resArr=[];
    let name1="" as string | null
    for (let i=0; i<contacts.length; i++){
    name1=contacts[i].name!=null?contacts[i].name+" ":""
    name1+=contacts[i].lastname!=null?contacts[i].lastname:""
    console.log(name1)
   const res = await sendAnyEmail({
    email1:  contacts[i].email,
    email2: process.env.EMAIL_SERVER_USER ? process.env.EMAIL_SERVER_USER : '',
    subject: title,
    text:  message.replace(/<[^>]*>/g, '').replace('&NAME', name1!=null?name1:""),
    html: message.replace('&amp;NAME', name1!=null?name1:""),
    attachments: undefined
  })
  resArr.push(res) 
}
 return new NextResponse( JSON.stringify(resArr));
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