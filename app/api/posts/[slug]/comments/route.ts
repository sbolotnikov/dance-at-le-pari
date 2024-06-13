import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

// GET SINGLE POST
export const GET = async (req: Request, params: {params:{ slug: string }}) => {
    const slug = params.params.slug;


  try {
    const post = await prisma.comment.findMany({
      where: { postSlug :slug }, 
      include: { user: true },
    });
    await prisma.$disconnect()
    return new NextResponse(JSON.stringify({post,  status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" ,  status: 500 })
    );
  }
};
export const POST = async (req: Request, params: {params:{ slug: string }}) => {
    const slug = params.params.slug;

    const body = await req.json(); 
      
  try {
    const comment = await prisma.comment.create({ 
        data: { ...body, postSlug: slug },
    });
    await prisma.$disconnect()
    return new NextResponse(JSON.stringify({comment,  status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" ,  status: 500 })
    );
  }
};
export const PUT = async (
  req: Request,
  params: { params: { slug: string } }
) => {
  const slug = params.params.slug;

  const body = await req.json();
  const {  desc, id } = body;
  console.log("description :",desc)
  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { desc },
    });
    await prisma.$disconnect();
    return new NextResponse(JSON.stringify({ comment, status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: 'Something went wrong!', status: 500 })
    );
  }
};
export const DELETE = async (
    req: Request,
    params: { params: { slug: string } }
  ) => { 
  
    const body = await req.json();
    const { id } = body; 
    try {
      const comment = await prisma.comment.delete({
        where: { id }, 
      });
      await prisma.$disconnect();
      return new NextResponse(JSON.stringify({ comment, status: 200 }));
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: 'Something went wrong!', status: 500 })
      );
    }
  };