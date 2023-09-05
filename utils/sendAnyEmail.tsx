const nodemailer = require('nodemailer');
interface MailData {
  email1: string;
  email2: string;
  subject: string;
  text: string;
  html: string;
}
interface ReturnValue {
  status: string;
  text: string;
}
export const sendAnyEmail = async (mailData: MailData) => {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: true,
  });
  await new Promise((resolve, reject) => {
    transporter.verify(function (error: any, success: any) {
      if (error) {
        console.log(error);
        reject(error);
        return 'error';
      } else {
        console.log('Server is ready to take our messages');
        resolve(success);
      }
    });
  });
  const res = await new Promise((resolve, reject) => {
      transporter.sendMail(
      {
        to: mailData.email1,
        from: mailData.email2,
        subject: mailData.subject,
        text: mailData.text,
        html: mailData.html,
      },
      (err: any, info: any) => {
        if (err) {
            // return (err)  
          reject(err);
        } else { 
        //   return (info)
          resolve(info);
        }
      }
    ); 
  });
  return res
  
};
