 
import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
 
  const cat = searchParams.get("cat"); 

  const query = { 
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

// UPDATE A POST
export const PUT = async (req: Request) => {
   

  try {
    const data = await req.json();
    const {id,title,desc,img,slug,userID,catSlug} = data;
    const post = await prisma.post.update({
      where: {
        id:id
      },
      data:{title,desc,img,slug,userID,catSlug}
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

