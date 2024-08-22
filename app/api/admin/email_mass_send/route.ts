 
import { prisma } from '@/lib/prisma';
import { sendAnyEmail } from '@/utils/sendAnyEmail';
import { NextResponse } from 'next/server';

const BATCH_SIZE = 10; // Number of emails to send in each batch
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
          email1: 'sbolotnikov@gmail.com',
          email2: process.env.EMAIL_SERVER_USER || '',
          subject: title+' - '+contact.email,
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