"use client"
import { createContext, useState, useEffect } from 'react';
  
 
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
  displayedPicturesAuto: { link: string; name: string }[];
  seconds: number;
  manualPicture: { link: string; name: string };
  savedMessages: string[];
  textColor: string; 
}
 
export const PartyContext = createContext<PartyContextType  >({} as PartyContextType );

export default function usePartySettings(refreshVar:boolean): PartyContextType   {
   
  const [image, setImage] = useState('');  
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('');
  const [fontSize, setFontSize] = useState<number>(0);
  const [displayedPictures, setDisplayedPictures] = useState<{ link: string; name: string }[]>([]);
  const [displayedVideos, setDisplayedVideos] = useState<{ name: string; image: string; link: string;}[]>([]);
  const [videoChoice, setVideoChoice] = useState<{ link: string; name: string }>({link: '', name: ''});
  const [compLogo, setCompLogo] = useState<{ link: string; name: string }>({link: '', name: ''});
  const [titleBarHider, setTitleBarHider] = useState(false);
  const [showUrgentMessage, setShowUrgentMessage] = useState(false);
  const [displayedPicturesAuto, setDisplayedPicturesAuto] = useState<{ link: string; name: string }[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [manualPicture, setManualPicture] = useState<{ link: string; name: string }>({link: '', name: ''});
  const [savedMessages, setSavedMessages] = useState<string[]>([]);
  const [textColor, setTextColor] = useState('');
  
  
   
  // const [snapshot, loading, err] = useCollection(
  //   query(collection(db, 'competitions')),
  //   {
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //   }
  // );
  // const [compArray, setCompArray] = useState({
  //   image: '',
  //   dates: '',
  //   currentHeat: '',
  //   name: '',
  //   message: '',
  //   id: '',
  //   program: '',
  //   programFileName: '',
  //   mode:'',
  //   fontSize:"",
  //   displayedPictures:[],
  //   displayedVideos:[],
  //   videoChoice:{},
  //   videoBGChoice:{},
  //   compLogo:{},
  //   displayedPicturesAuto:[],
  //   manualPicture:{},
  //   seconds:0,
  //   titleBarHider:false,
  //   showUrgentMessage:false,
  //   savedMessages:[],
  //   textColor:"",
  // });
  // const [compID, setCompID] = useState('');

  // useEffect(() => {
  //   if (snapshot) {
  //     let arr = [];
  //     snapshot.docs.forEach((doc1) => {
  //       arr.push({
  //         ...doc1.data(),
  //         id: doc1.id,
  //       });
  //     });
  //     setCompArray(arr.filter((x)=>x.id==compID));

     
  //   }
  // }, [snapshot]);
  // useEffect(() => {
  //   console.log("in useEffect" +compID)
  //   if (snapshot) {
  //     let arr = [];
  //     snapshot.docs.forEach((doc1) => {
  //       arr.push({
  //         ...doc1.data(),
  //         id: doc1.id,
  //       });
  //     });
  //     setCompArray(arr.filter((x)=>x.id==compID));

     
  //   }
  // }, [compID]);




  useEffect(() => {
      
     
    fetch('/api/admin/get_parties').
    then((res) => res.json())
    .then ((partyArray)=>{
      console.log(partyArray)
      setImage(partyArray[0].image)
      setName(partyArray[0].name )
      setMessage(partyArray[0].message)
      setMode(partyArray[0].mode)
      setFontSize(partyArray[0].fontSize)
      setDisplayedPictures(partyArray[0].displayedPictures.map((str1:string)=>JSON.parse(str1)))
      setDisplayedVideos(partyArray[0].displayedVideos.map((str1:string)=>JSON.parse(str1)))
      setVideoChoice(JSON.parse(partyArray[0].videoChoice))
      setCompLogo(JSON.parse(partyArray[0].compLogo))
      setTitleBarHider(partyArray[0].titleBarHider)
      setShowUrgentMessage(partyArray[0].showUrgentMessage)
      setDisplayedPicturesAuto(partyArray[0].displayedPicturesAuto.map((str1:string)=>JSON.parse(str1))) 
      setSeconds(partyArray[0]?.seconds)
      setManualPicture(JSON.parse(partyArray[0].manualPicture))
      setSavedMessages(partyArray[0].savedMessages)
      setTextColor(partyArray[0].textColor) 
    })
 
  } ,[refreshVar]);
  

  return { image, name, message, mode, fontSize, displayedPictures, displayedVideos, videoChoice, compLogo, titleBarHider, showUrgentMessage, displayedPicturesAuto, seconds, manualPicture, savedMessages, textColor };
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