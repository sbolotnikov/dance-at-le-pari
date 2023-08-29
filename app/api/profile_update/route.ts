import { prisma } from '@/lib/prisma';
const bcrypt = require("bcryptjs");
import { NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';


var obj: {[k: string]: any} = {};

export  async function POST(
  req: Request,
  res: NextApiResponse
) {
  
  try {
     //Only POST mothod is accepted
    if (req.method !== 'POST') {
      return res.status(405).end();
    }
    const data = await req.json();
    const {name, id, image,email,phone, password} = data;


    //Connect with database
    //Check existing


    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    //Send error response if duplicate user is found

    if (user==null) {
      return new NextResponse(
        JSON.stringify({ message: 'No such user exist',status: 422}),

      );
    }
   if (user?.name!==name) obj.name = name;
   if (user?.image!==image) obj.image = image;
   if (user?.telephone!==phone) obj.telephone = phone;
   if (user?.email!==email) {obj.email = email; obj.emailVerified=null}
   if (password.length>0){
    //Hash password  process.env.BCRYPT_SALT
    let salt=0
    salt=parseInt((process.env.BCRYPT_SALT)?process.env.BCRYPT_SALT:"10",10)
    let psword=""
    psword = await bcrypt.hash(password, salt),
    obj.password=psword
   }


   console.log(obj)
    const updateUser = await prisma.user.update({
        where: {
          id
        },
        data: obj,
      })
    console.log(updateUser)
    await prisma.$disconnect()
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'User created',status: 200,
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
