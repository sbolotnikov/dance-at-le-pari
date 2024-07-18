 "use client"
import { createContext, useRef,  useState, useEffect } from 'react';
import {  Party } from '@prisma/client'; 
import { createClient } from '@supabase/supabase-js';
// import { useRouter } from 'next/router';

// interface Message {
//   id: string;
//   userId: string;
//   text: string;
//   timestamp: number;
// }
 
 
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

export default function usePartySettings(): PartyContextType   {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY! );
  const [compArray, setCompArray] = useState<Party[]>([]); 
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
  
  
   
  
  async function getCompArray() {
    const partyArray = await fetch('/api/admin/get_parties').then((res) => res.json());
    console.log(partyArray)
    setImage(partyArray[0].image),
    setName(partyArray[0].name ),
    setMessage(partyArray[0].message),
    setMode(partyArray[0].mode),
    setFontSize(partyArray[0].fontSize),
    setDisplayedPictures(partyArray[0].displayedPictures.map((str1:string)=>JSON.parse(str1))),
    setDisplayedVideos(partyArray[0].displayedVideos.map((str1:string)=>JSON.parse(str1))),
    setVideoChoice(JSON.parse(partyArray[0].videoChoice)),
    setCompLogo(JSON.parse(partyArray[0].compLogo)),
    setTitleBarHider(partyArray[0].titleBarHider),
    setShowUrgentMessage(partyArray[0].showUrgentMessage) ,
    setDisplayedPicturesAuto(partyArray[0].displayedPicturesAuto.map((str1:string)=>JSON.parse(str1))) ,
    setSeconds(partyArray[0]?.seconds),
    setManualPicture(JSON.parse(partyArray[0].manualPicture)),
    setSavedMessages(partyArray[0].savedMessages),
    setTextColor(partyArray[0].textColor),
    setCompArray(partyArray);
  }
  getCompArray()
    // Set up real-time listener
    const channel = supabase
      .channel('party_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Party' },
        (payload) => {
          console.log('Change received!', payload);
          getCompArray();
        }
      )
      .subscribe();

    // Cleanup function
    // return () => {
      supabase.removeChannel(channel);
    // };
  // }, []);
  
 

  const value: PartyContextType = {
    image: compArray[0]?.image ?? '',
    name: compArray[0]?.name ?? '',
    message: compArray[0]?.message ?? '',
    mode: compArray[0]?.mode ?? '',
    fontSize: compArray[0]?.fontSize ?? 0,
    displayedPictures: compArray[0]?.displayedPictures.map((str1:string)=>JSON.parse(str1)) ?? [],
    displayedVideos: compArray[0]?.displayedVideos.map((str1:string)=>JSON.parse(str1)) ?? [],
    videoChoice:compArray[0]?.videoChoice? JSON.parse(compArray[0]?.videoChoice): { link: '', name: '' },
    compLogo: compArray[0]?.compLogo?JSON.parse(compArray[0]?.compLogo) : { link: '', name: '' },
    titleBarHider: compArray[0]?.titleBarHider ?? false,
    showUrgentMessage: compArray[0]?.showUrgentMessage ?? false,
    displayedPicturesAuto: compArray[0]?.displayedPicturesAuto.map((str1:string)=>JSON.parse(str1)) ?? [],
    seconds: compArray[0]?.seconds ?? 10,
    manualPicture:compArray[0]?.manualPicture? JSON.parse(compArray[0]?.manualPicture) : { link: '', name: '' },
    savedMessages: compArray[0]?.savedMessages ?? [],
    textColor: compArray[0]?.textColor ?? '#000000',
  };

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