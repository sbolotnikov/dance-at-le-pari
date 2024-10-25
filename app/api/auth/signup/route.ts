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
    const {email, password} = data;
   

   
    //Validate


    if (!email || !email.includes('@') || !password) {
      return new NextResponse(JSON.stringify({ message: 'Invalid Data', status: 422}));
    }


    //Connect with database
    //Check existing


    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    //Send error response if duplicate user is found

    if (user!==null) {
      return new NextResponse(
        JSON.stringify({ message: 'User already exists',status: 422}),

      );
    }


    //Hash password  process.env.BCRYPT_SALT

    let salt=0
    salt=parseInt((process.env.BCRYPT_SALT)?process.env.BCRYPT_SALT:"10",10)
    const status = await prisma.user.create({
      data: {
        email:email,
      password: await bcrypt.hash(password, salt),
      image:process.env.NEXTAUTH_URL+'/images/defaultuser.png',
      role:'User'
      },
    });
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'User created',status: 201,
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

