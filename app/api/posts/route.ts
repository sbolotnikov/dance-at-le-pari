 
import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const page = (searchParams.get("page")!=null)?parseInt(searchParams.get("page")!):1;
  const cat = searchParams.get("cat");

  const POST_PER_PAGE = 2;

  const query = {
    take: POST_PER_PAGE,
    skip: POST_PER_PAGE * (page - 1),
    where: {
      ...(cat && { catSlug: cat }),
    },
    include:{user:true}
  };

  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count({ where: query.where }),
    ]);
    await prisma.$disconnect()
    return new NextResponse(JSON.stringify({ posts, count ,  status: 200}));
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
    const post = await prisma.post.create({
      data: { ...body },
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

