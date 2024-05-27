import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

// GET SINGLE POST
export const GET = async (req: Request, params: {params:{ slug: string }}) => {
    const slug = params.params.slug;


  try {
    const post = await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: { user: true },
    });

    return new NextResponse(JSON.stringify({post,  status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" ,  status: 500 })
    );
  }
};