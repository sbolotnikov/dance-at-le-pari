
import { initializeApp, getApps, getApp } from 'firebase/app'; 
// import { getAnalytics } from "firebase/analytics";
import { getFirestore  } from 'firebase/firestore' 
  
const firebaseConfig = {
  apiKey:process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId:process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
   
};
// const configReturn=async()=>{
// fetch('/api/firebase_config', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   }
// })
//   .then(response => response.json())
//   .then(data => {
//     return data;
//     console.log('Firebase config:', data);
//   })
//   .catch(error => {
//     console.error('Error fetching Firebase config:', error);
//     return null;
//   });
// }

 if(!getApps().length) {
  initializeApp(firebaseConfig);
}else 
{
  getApp()
}
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp() 

const db = getFirestore();   
export { db  };