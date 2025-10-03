
import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const { emailArray, status } = data; 
    const contacts = await prisma.contact.findMany({ where: {
    email: {
      in: emailArray,
    },
    status
     },})
    await prisma.$disconnect()
   
 
 return new NextResponse( JSON.stringify(contacts));
}
