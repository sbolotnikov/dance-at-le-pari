import { db } from '@/firebase';
import { prisma } from '@/lib/prisma';
import { sendAnyEmail } from '@/utils/sendAnyEmail';
import { collection, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const { title, message } = data;
  // await new Promise((resolve, reject) => {
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [{ status: 'Subscribed' }],
    },
  });
  await prisma.$disconnect();
  let name1 = '' as string | null;
  const emailSession =  await addDoc(collection(db, "emails"), {accepted:[],rejected:[]});
  let accepted = '';
  let rejected = '';
  for (let i = 0; i < contacts.length; i++) {
    name1 = contacts[i].name != null ? contacts[i].name + ' ' : '';
    name1 += contacts[i].lastname != null ? contacts[i].lastname : '';
    console.log(name1);
    const timerInterval = setInterval(async () => {
      const res = await sendAnyEmail({
        email1: contacts[i].email,
        email2: process.env.EMAIL_SERVER_USER
          ? process.env.EMAIL_SERVER_USER
          : '',
        subject: title,
        text: message
          .replace(/<[^>]*>/g, '')
          .replace('&NAME', name1 != null ? name1 : ''),
        html: message.replace('&amp;NAME', name1 != null ? name1 : ''),
        attachments: undefined,
      });
      if (
        res &&
        typeof res === 'object' &&
        'accepted' in res &&
        'rejected' in res
      ) {
         
          accepted= Array.isArray(res.accepted) ? res.accepted[0] : '';
          rejected= Array.isArray(res.rejected) ? res.rejected[0] : '';
        };
        if (accepted!=''){
          await addDoc(collection(db, "emails/"+emailSession.id+"/accepted"), {email:accepted});
        }
        if (rejected!=''){
          await addDoc(collection(db, "emails/"+emailSession.id+"/rejected"), {email:rejected});
        }
      
    }, 1000);
  
    // Server is ready to take our messages
    //   0:{accepted: ['serge.bolotnikov@gmail.com']
    // rejected: []}

    return new NextResponse(JSON.stringify({emailID:emailSession.id}));
  }
}
