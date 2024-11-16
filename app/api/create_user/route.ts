import { prisma } from '@/lib/prisma';
const bcrypt = require("bcryptjs");
import { NextResponse } from 'next/server'; 

// interface ExtendedNextApiRequest extends NextApiRequest {
//     body: {
//         email: string;
//         password: string;
//     };
//   }

export  async function POST(
  req: Request,
  res: NextResponse
) {
  
  try {
     //Only POST method is accepted
    if (req.method !== 'POST') {
      return  new NextResponse(JSON.stringify({ message: 'Only POST method is accepted',status: 405}));
    }
    const data = await req.json();
    const {email, telephone, name} = data;
   
 
 
    //Check existing


    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    //Send error response if duplicate user is found

    if (user!==null) {
        console.log(user.id)
      return new NextResponse(
        JSON.stringify({ message: user.id,status: 201}),

      );
    }


    //Hash password  process.env.BCRYPT_SALT
 
    const status = await prisma.user.create({
      data: {
        email:email, 
      name:name,
      telephone,
      image:process.env.NEXTAUTH_URL+'/images/defaultuser.png',
      role:'User'
      },
    });
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: status.id,status: 201,
      }),
    );
  } catch (error) {
    console.log(error);
    await prisma.$disconnect()
    return new NextResponse(
      JSON.stringify({ message: 'Internal server Error' , status: 500,}),
    );
  }
}
