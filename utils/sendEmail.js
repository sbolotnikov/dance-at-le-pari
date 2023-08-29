const nodemailer = require('nodemailer');
export const sendEmail=async(mailData) =>{
 

        try {
    
        const transporter = nodemailer.createTransport(

        {
          host: process.env.EMAIL_SERVER_HOST,
          // port: process.env.EMAIL_SERVER_PORT,
          port: 587,
          secure: false,

          // secure: true,
          auth: {
            user: process.env.EMAIL_SERVER_USER, 
            pass: process.env.EMAIL_SERVER_PASSWORD, 
          },
        }
        );

    const result = await transporter.sendMail(mailData);
    return result;
} catch (error) {
  return error;
}


  }
  
