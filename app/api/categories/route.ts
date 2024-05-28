 
import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  

  try {
    const categories = await  prisma.category.findMany();
    await prisma.$disconnect()
    return new NextResponse(JSON.stringify({ categories ,  status: 200}));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" ,  status: 500 })
    );
  }
};










// CREATE A POST
export const POST = async (req: Request) => {
   

  try {
    const body = await req.json();
    const category = await prisma.category.create({
      data: { ...body },
    });
    await prisma.$disconnect()
    return new NextResponse(JSON.stringify({category,  status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" ,  status: 500 })
    );
  }
};

