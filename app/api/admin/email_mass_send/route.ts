import { db } from '@/firebase';
import { prisma } from '@/lib/prisma';
import { sendAnyEmail } from '@/utils/sendAnyEmail';
import { error } from 'console';
import { collection, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const { title, message, email, name } = data;
  
  try {
    const res = await sendAnyEmail({
      email1: email,
      email2: process.env.EMAIL_SERVER_USER
        ? process.env.EMAIL_SERVER_USER
        : '',
      subject: title,
      text: message
        .replace(/<[^>]*>/g, '')
        .replace('&NAME', name),
      html: message.replace('&NAME', name),
      attachments: undefined,
    });
    
    if (typeof res === 'object' && res !== null) {
      if ('accepted' in res && Array.isArray(res.accepted) && res.accepted.length > 0) {
        return new NextResponse(JSON.stringify({message:`accepted: ${res.accepted}`}));
      }
      if ('rejected' in res && Array.isArray(res.rejected) && res.rejected.length > 0) {
        return new NextResponse(JSON.stringify({message:`rejected: ${res.rejected}`}));
      }
    }
    
    return new NextResponse(JSON.stringify({message: 'Server is not ready to take our messages'}));
  } catch (error) {
    return new NextResponse(JSON.stringify({message: 'An error occurred while sending the email'}), { status: 500 });
  }
}
