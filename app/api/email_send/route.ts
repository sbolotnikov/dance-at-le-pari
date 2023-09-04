 
// import { sendEmail } from '@/utils/sendEmail';
const nodemailer= require('nodemailer');
import { NextResponse } from 'next/server';

export  async function POST(
  req: Request
) {
   const transporter = nodemailer.createTransport({
    port:465,
    host:"smtp.gmail.com",
    auth:{
        user:process.env.EMAIL_SERVER_USER,
        pass:process.env.EMAIL_PASS
    },
    secure:true,
   });
   await new Promise ((resolve, reject)=>{
    transporter.verify(function (error:any, success:any){
        if (error){
            console.log(error);
            reject(error)
        } else {
            console.log("Server is ready to take our messages");
            resolve(success)
        }
    })
   })
//   try {

    const data = await req.json();
    const {email, name, message} = data;
    await new Promise((resolve, reject) => {
        transporter.sendMail({
            to: process.env.EMAIL_SERVER_USER,
            from: process.env.EMAIL_SERVER_USER,
            subject: `Special request from ${name} <${email}>`,
            text: message,
            html:`<b>${message}</b>`
          }, (err:any, info:any)=>{
            if (err) {
                console.error(err);
                reject(err)
            }else {
                console.log(info);
                resolve(info)
            }
          }) 
    })
    
    //Send success response
    return new NextResponse(
      JSON.stringify({ message: 'EMail sent',status: 201,
      }),
    );
//   } catch (error) {
//     console.log(error); 
//     return new NextResponse(
//       JSON.stringify({ message: 'Internal server Error' , status: 500,}),
//     );
//   }
}