
import { NextResponse } from 'next/server'


// export async function POST(req: Request) {
//     const data = await req.json();
//     const {id} = data; 
//   return new NextResponse(JSON.stringify({id:process.env[id] }), {
//     status: 201,
//   });
// }

export function POST(req: Request) {
  const firebaseConfig= {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIREBASE_MEASUREMENTID,
  }
  const firebaseConfig2= {
    apiKey: process.env.FIREBASE_APIKEY2,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN2,
    projectId: process.env.FIREBASE_PROJECT_ID2,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET2,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID2,
    appId: process.env.FIREBASE_APPID2,
    measurementId: process.env.FIREBASE_MEASUREMENTID2,
  }
  return new NextResponse(JSON.stringify({
     firebaseConfig
   
  }), {
    status: 200,
  });
}