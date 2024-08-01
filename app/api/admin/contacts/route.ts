
import { prisma } from '@/lib/prisma'; 
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const { status } = data; 
    const contacts = await prisma.contact.findMany({ where: {
    status
     },})
    await prisma.$disconnect()
   
 
 return new NextResponse( JSON.stringify(contacts));
}
export async function DELETE(req: Request) {
    const data = await req.json();
    const { id } = data; 
    var deleted1 ={};
        (id == 0)?deleted1 = await prisma.contact.deleteMany({where: {id: {gt: 0}}}):
        deleted1 = await prisma.contact.delete({
        where: {
         id
        },
      })
      await prisma.$disconnect()
     
   
   return new NextResponse( JSON.stringify(deleted1));
  }
  export async function PUT(req: Request) {
    const data = await req.json();
    const { id, name, lastname, telephone1,telephone2,email } = data; 
    console.log(id, name, lastname, telephone1,telephone2,email)
      let updated1 = await prisma.contact.update({
        where: {
          id:id
        },
        data:{name, lastname, telephone1,telephone2,email,lastcontact:new Date()}
      });
      updated1 = await prisma.contact.update({
        where: {
          id:id
        },
        data:{labels:updated1.labels?updated1.labels+"; updated info":"updated info"}
      });
      await prisma.$disconnect()
     console.log(updated1)
   
   return new NextResponse( JSON.stringify(updated1));
  }