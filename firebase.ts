
import { initializeApp, getApps, getApp } from 'firebase/app'; 
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, initializeFirestore } from 'firebase/firestore'; 
import { getStorage } from "firebase/storage";
import 'dotenv/config'

console.log("Email at firebase.ts:",process.env.EMAIL_SERVER_USER)
const firebaseConfig = {
  apiKey:process.env.FIREBASE_APIKEY,
  authDomain:process.env.FIREBASE_AUTH_DOMAIN,
  projectId:process.env.FIREBASE_PROJECT_ID,
  storageBucket:process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId:process.env.FIREBASE_APPID,
  measurementId:process.env.FIREBASE_MEASUREMENTID,
   
};
  
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
// const analytics = getAnalytics(app); 
// const db = initializeFirestore(app, {
//   experimentalForceLongPolling: true,
// });

const db = getFirestore();  
const storage = getStorage(app);
export { db,  storage };