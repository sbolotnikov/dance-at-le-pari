// import { db } from '@/firebase';
// import { prisma } from '@/lib/prisma';
// import { sendAnyEmail } from '@/utils/sendAnyEmail';
// import { error } from 'console';
// import { collection, addDoc } from 'firebase/firestore';
// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   const data = await req.json();
//   const { title, message, email, name } = data;
  
//   try {
//     const res = await sendAnyEmail({
//       email1: email,
//       email2: process.env.EMAIL_SERVER_USER
//         ? process.env.EMAIL_SERVER_USER
//         : '',
//       subject: title,
//       text: message
//         .replace(/<[^>]*>/g, '')
//         .replace('&NAME', name),
//       html: message.replace('&NAME', name),
//       attachments: undefined,
//     });
    
//     if (typeof res === 'object' && res !== null) {
//       if ('accepted' in res && Array.isArray(res.accepted) && res.accepted.length > 0) {
//         return new NextResponse(JSON.stringify({message:`accepted: ${res.accepted}`}));
//       }
//       if ('rejected' in res && Array.isArray(res.rejected) && res.rejected.length > 0) {
//         return new NextResponse(JSON.stringify({message:`rejected: ${res.rejected}`}));
//       }
//     }
    
//     return new NextResponse(JSON.stringify({message: 'Server is not ready to take our messages'}));
//   } catch (error) {
//     return new NextResponse(JSON.stringify({message: 'An error occurred while sending the email'}), { status: 500 });
//   }
// }
import { prisma } from '@/lib/prisma';
import { sendAnyEmail } from '@/utils/sendAnyEmail';
import { NextResponse } from 'next/server';

const BATCH_SIZE = 50; // Number of emails to send in each batch
const DELAY_BETWEEN_BATCHES = 1000; // Delay in milliseconds between batches

export async function POST(req: Request) {
  const data = await req.json();
  const { title, message } = data;

  try {
    const contacts = await prisma.contact.findMany({
      where: {
        OR: [{ status: 'Subscribed' }],
      },
    });

    let resArr = [];
    
    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
      const batch = contacts.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (contact) => {
        let name = "";
        if (contact.name) name += contact.name + " ";
        if (contact.lastname) name += contact.lastname;
        // email1: contact.email,
        const res = await sendAnyEmail({
          email1: 'serge.bolotnikov@gmail.com',
          email2: process.env.EMAIL_SERVER_USER || '',
          subject: title,
          text: message.replace(/<[^>]*>/g, '').replace('&NAME', name.trim() || ""),
          html: message.replace('&amp;NAME', name.trim() || ""),
          attachments: undefined
        });
        return res;
      });

      const batchResults = await Promise.all(batchPromises);
      resArr.push(...batchResults);

      // Add a delay between batches to avoid overwhelming the email server
      if (i + BATCH_SIZE < contacts.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    return new NextResponse(JSON.stringify(resArr));
  } catch (error) {
    console.error('Error sending emails:', error);
    return new NextResponse(JSON.stringify({ accepted:['Failed to send emails'] }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}