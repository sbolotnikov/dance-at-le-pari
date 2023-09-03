 
import { sendEmail } from '@/utils/sendEmail';
import { NextResponse } from 'next/server';

export  async function POST(
  req: Request
) {
  
  try {

    const data = await req.json();
    const {email, name, message} = data;
    const sendEmailObj = await sendEmail({
        to: process.env.EMAIL_SERVER_USER,
        from: process.env.EMAIL_SERVER_USER,
        subject: `Special request from ${name} <${email}>`,
        text: message,
        html:`<b>${message}</b>`
      });
      console.log(sendEmailObj)
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'EMail sent',status: 201,
      }),
    );
  } catch (error) {
    console.log(error); 
    return new NextResponse(
      JSON.stringify({ message: 'Internal server Error' , status: 500,}),
    );
  }
}