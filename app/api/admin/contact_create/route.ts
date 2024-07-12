
import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const {name, lastname, telephone1,telephone2,email, source } = data; 
    const contact = await prisma.contact.create({ data: {
        name, lastname, telephone1,telephone2,email, source
     },})
    await prisma.$disconnect()
   
 
 return new NextResponse( JSON.stringify(contact));
}