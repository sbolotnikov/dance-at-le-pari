// const nodemailer = require('nodemailer');
// interface MailData {
//   email1: string;
//   email2: string;
//   subject: string;
//   text: string;
//   html: string;
//   attachments: { filename: string, path:string, cid:string}[] | undefined //same cid value as in the html img src

// }
// interface ReturnValue {
//   status: string;
//   text: string;
// }
// export const sendAnyEmail = async (mailData: MailData) => {
//   const transporter = nodemailer.createTransport({
//     port: 465,
//     host: 'smtp.gmail.com',
//     auth: {
//       user: process.env.EMAIL_SERVER_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     secure: true,
//   });
//   await new Promise((resolve, reject) => {
//     transporter.verify(function (error: any, success: any) {
//       if (error) {
//         console.log(error);
//         reject(error);
//         return 'error';
//       } else {
//         console.log('Server is ready to take our messages');
//         resolve(success);
//       }
//     });
//   });
//   const res = await new Promise((resolve, reject) => {
//       transporter.sendMail(
//       {
//         to: mailData.email1,
//         from: mailData.email2,
//         subject: mailData.subject,
//         text: mailData.text,
//         html: mailData.html,
//         attachments: mailData.attachments ? mailData.attachments : undefined
//       },
//       (err: any, info: any) => {
//         if (err) {
//             // return (err)  
//           reject(err);
//         } else { 
//         //   return (info)
//           resolve(info);
//         }
//       }
//     ); 
//   });
//   return res
  
// };
import { promisify } from 'util';
const nodemailer = require('nodemailer');

interface MailData {
  email1: string;
  email2: string;
  subject: string;
  text: string;
  html: string;
  attachments: { filename: string, path: string, cid: string }[] | undefined
}

// export const sendAnyEmail1 = async (mailData: MailData) => {
//   const transporter = nodemailer.createTransport({
//     pool: true, // Use pooled connections
//     maxConnections: 5, // Limit the number of simultaneous connections
//     rateDelta: 1000, // Limit to 1 email per second
//     rateLimit: 1,
//     port: 465,
//     host: 'smtp.gmail.com',
//     auth: {
//       user: process.env.EMAIL_SERVER_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     secure: true,
//   });
  export const sendAnyEmail = async (mailData: MailData) => {
    const transporter = nodemailer.createTransport({

      host: "smtpout.secureserver.net",  
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
        ciphers:'SSLv3'
    },
    requireTLS:true,
    port: 465,
    debug: true,
    auth: {
        user: process.env.EMAIL_SERVER_USER1,
        pass: process.env.EMAIL_PASS1 
    }
});

    //   secure:false, 
    //   port: 587,
    //   encryption: 'STARTTLS',
    //   host: 'smtp-mail.outlook.com',
    //   authenticationMethod:"OAuth2/Modern Auth",
    //   auth: {
    //     user: process.env.EMAIL_SERVER_USER1,
    //     pass: process.env.EMAIL_PASS1,
    //   },
    // });
  const sendMailPromise = promisify(transporter.sendMail).bind(transporter);

  try {
    await transporter.verify();
    const info = await sendMailPromise({
      to: mailData.email1,
      from: mailData.email2,
      subject: mailData.subject,
      text: mailData.text,
      html: mailData.html,
      attachments: mailData.attachments
    });
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}; 