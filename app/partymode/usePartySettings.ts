"use client"
import { createContext, useState, useEffect } from 'react';
import { addDoc, collection, doc, query, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
 
interface PartyContextType {
  image: string;
  name: string;
  message: string;
  mode: string;
  fontSize: number;
  displayedPictures: { link: string; name: string }[];
  displayedVideos: {
    name: string;
    image: string;
    link: string;
  }[]; 
  videoChoice: { link: string; name: string };
  compLogo: { link: string; name: string };
  titleBarHider: boolean;
  showUrgentMessage: boolean;
  showSVGAnimation: boolean;
  displayedPicturesAuto: { link: string; name: string }[];
  seconds: number;
  manualPicture: { link: string; name: string };
  savedMessages: string[];
  textColor: string;
  id: string;
  animationSpeed: number;
  speedVariation: number;
    particleCount: number;
    maxSize: number;
    animationOption:number;
    rainAngle: number;
    originX: number;
    originY: number;
    particleTypes:string[];
}
interface ReturnPartyContextType {
  image: string;
  name: string;
  message: string;
  mode: string;
  fontSize: number;
  displayedPictures: { link: string; name: string }[];
  displayedVideos: {
    name: string;
    image: string;
    link: string;
  }[]; 
  videoChoice: { link: string; name: string };
  compLogo: { link: string; name: string };
  titleBarHider: boolean;
  showUrgentMessage: boolean;
  showSVGAnimation: boolean;
  displayedPicturesAuto: { link: string; name: string }[];
  seconds: number;
  manualPicture: { link: string; name: string };
  savedMessages: string[];
  textColor: string;
  animationSpeed: number;
  speedVariation: number;
  particleCount: number;
  maxSize: number;
  animationOption:number;
  rainAngle: number;
  originX: number;
  originY: number;
  particleTypes:string[];
  setCompID: (id: string) => void;

} 
export const PartyContext = createContext<ReturnPartyContextType >({} as ReturnPartyContextType );

export default function usePartySettings(): ReturnPartyContextType {

  const [compID, setCompID] = useState('A9UgRuKLaxvLPiSOwO1E');
  const [partyArray, setPartyArray] = useState<PartyContextType>({
    image: '',
    name: '', 
    message: '',
    mode: '',
    fontSize:10,
    displayedPictures:[],
    displayedVideos:[],
    videoChoice:{link:"",name:""}, 
    compLogo:{link:"",name:""},
    titleBarHider:false,
    showUrgentMessage:false,
    showSVGAnimation:false,
    displayedPicturesAuto:[],  
    seconds:0, 
    manualPicture:{link:"",name:""},
    savedMessages:[],
    textColor:"",
    id:"",
    animationSpeed: 0,
    speedVariation: 0,
    particleCount: 0,
    maxSize: 0,
    animationOption:0,
    rainAngle: 0,
    originX: 0,
    originY: 0,
    particleTypes:["star",'snowflake', 'heart', 'home',"maple",'rose','diamond','clover','streamer','lightning','hydrangea'],
  });
  
   
  const [snapshot, loading, err] = useCollection(
    query(collection(db, 'parties')),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
 

  useEffect(() => {
    if (snapshot) {
      let arr: PartyContextType[] = [];
      snapshot.docs.forEach((doc1) => {
        arr.push({
          ...(doc1.data() as any),
          id: doc1.id,
        });
      });
      const filteredParty = arr.find((x) => x.id === compID);
      if (filteredParty) {
        let party
        setPartyArray(filteredParty);

        console.log("got object",filteredParty)
      }
    }
    //      fetch('/api/admin/get_parties').
    // then((res) => res.json())
    // .then (async(partyArray)=>{
    //   console.log(partyArray)
    
    //   let vv=await addDoc(collection(db, 'parties'), {
    //     image:partyArray[0].image,
    //     name:partyArray[0].name,
    //     message:partyArray[0].message,
    //     mode:partyArray[0].mode,
    //     fontSize:partyArray[0].fontSize,
    //     displayedPictures:partyArray[0].displayedPictures.map((str1:string)=>JSON.parse(str1)),
    //     displayedVideos:partyArray[0].displayedVideos.map((str1:string)=>JSON.parse(str1)),
    //     videoChoice:JSON.parse(partyArray[0].videoChoice),
    //     compLogo:JSON.parse(partyArray[0].compLogo),
    //     titleBarHider:partyArray[0].titleBarHider,
    //     showUrgentMessage:partyArray[0].showUrgentMessage,
    //     displayedPicturesAuto:partyArray[0].displayedPicturesAuto.map((str1:string)=>JSON.parse(str1)), 
    //     seconds:partyArray[0]?.seconds,
    //     manualPicture:JSON.parse(partyArray[0].manualPicture),
    //     savedMessages:partyArray[0].savedMessages,
    //     textColor:partyArray[0].textColor
    //   })}); 
  }, [snapshot, compID]);   

 

 
  return {...partyArray, setCompID};
}
  




 

 
 

  





// NEED TO ADD TO POSTGRESQL DB  QUERIES AT THE DATABASE:

// CREATE OR REPLACE FUNCTION notify_party_changes()
// RETURNS trigger AS $$
// DECLARE
//   data json;
//   notification json;
// BEGIN
//   -- Determine the operation type
//   IF (TG_OP = 'UPDATE') THEN
//     data = row_to_json(OLD);
//   ELSE
//     data = row_to_json(NEW);
//   END IF;

//   -- Construct the notification as a JSON string
//   notification = json_build_object(
//     'table', 'Party',
//     'action', 'UPDATE',
//     'data', data
//   );

//   -- Send the notification
//   PERFORM pg_notify('party_changes', notification::text);

//   RETURN NULL;
// END;
// $$ LANGUAGE plpgsql;

// -- Create a trigger that calls this function after INSERT, UPDATE, or DELETE on the party table
// CREATE TRIGGER party_changes_trigger
// AFTER INSERT OR UPDATE OR DELETE ON "Party"
// FOR EACH ROW EXECUTE FUNCTION notify_party_changes();