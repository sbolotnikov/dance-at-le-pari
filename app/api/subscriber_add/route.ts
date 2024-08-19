import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const {name, lastname,email } = data; 
    const existingContact = await prisma.contact.findFirst({
      where: {
        email: email,
      },
    });
    if (existingContact) {
      await prisma.$disconnect()  
      return new NextResponse(JSON.stringify({message:"Already exist!",  status: 200 }));
    }
    try {
    const contact = await prisma.contact.create({ data: {
        name, lastname, telephone1:null,telephone2:null,email, source:'Subscribed to newsletter', status: 'Subscribed', labels: null, createdAt: new Date(), lastactivity: 'Subscribed to newsletter', lastcontact: new Date(),
     },})
    await prisma.$disconnect()
   
 
 return new NextResponse( JSON.stringify({message:"Thank you for subscribing to our newsletter",  status: 200 }));
} catch (error) {
    console.log(error);
    await prisma.$disconnect()
    return new NextResponse(
      JSON.stringify({ message: 'Can not connect to db!' , status: 500, error}),
    );
}}