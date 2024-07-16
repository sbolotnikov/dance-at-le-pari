 
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PrismaClient, Party } from '@prisma/client';
// import pg from 'pg'
// const { Pool, Client } = pg 

const prisma = new PrismaClient();
 
interface PartyContextType {
  image: string;
  name: string;
  message: string;
  mode: string;
  fontSize: number;
  displayedPictures: { link: string; name: string }[];
  displayedVideos: {
    tag: string;
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
  const [compArray, setCompArray] = useState<Party[]>([]); 

  
  
  
  
//   async function listenForChanges() {
//     const pool = new Pool({
//         connectionString: process.env.DIRECT_URL,
//       })
       
//       await pool.query('LISTEN party_changes')
//       await pool.end()
       
//       const client = new Client({
//         connectionString: process.env.DIRECT_URL,
//       })
       
//       await client.connect()

//     try {
//       await client.query('LISTEN party_changes');
//       console.log('Listening for changes on the Party table...');
  
//       client.on('notification', async (msg:any) => {
//         const payload = JSON.parse(msg.payload);
//         console.log('Change detected:', payload);
  
//         if (payload.action === 'INSERT') {
//           console.log('New party added:', payload.data);
//         } else if (payload.action === 'UPDATE') {
//           console.log('Party updated:', payload.data);
//         } else if (payload.action === 'DELETE') {
//           console.log('Party deleted:', payload.data);
//         }
//       });
  
//       setInterval(() => {
//         client.query('SELECT 1');
//       }, 60000);
  
//     } catch (err) {
//       console.error('Error setting up listener:', err);
//       client.end()
//     }
//   }
  
  async function getCompArray() {
    const partyArray = await prisma.party.findMany();
    console.log(partyArray)
    setCompArray(partyArray);
  }




  useEffect(() => { 
    getCompArray() 
    // listenForChanges();
  }, []);
 

  const value: PartyContextType = {
    image: compArray[0]?.image ?? '',
    name: compArray[0]?.name ?? '',
    message: compArray[0]?.message ?? '',
    mode: compArray[0]?.mode ?? '',
    fontSize: compArray[0]?.fontSize ?? 0,
    displayedPictures: compArray[0]?.displayedPictures.map((str1:string)=>JSON.parse(str1)) ?? [],
    displayedVideos: compArray[0]?.displayedVideos.map((str1:string)=>JSON.parse(str1)) ?? { tag: '', image: '', link: '' },
    videoChoice:compArray[0]?.videoChoice? JSON.parse(compArray[0]?.videoChoice): { link: '', name: '' },
    compLogo: compArray[0]?.compLogo?JSON.parse(compArray[0]?.compLogo) : { link: '', name: '' },
    titleBarHider: compArray[0]?.titleBarHider ?? false,
    showUrgentMessage: compArray[0]?.showUrgentMessage ?? false,
    displayedPicturesAuto: compArray[0]?.displayedPicturesAuto.map((str1:string)=>JSON.parse(str1)) ?? [],
    seconds: compArray[0]?.seconds ?? 10,
    manualPicture:compArray[0]?.manualPicture? JSON.parse(compArray[0]?.manualPicture) : { tag: '', image: '' },
    savedMessages: compArray[0]?.savedMessages ?? [],
    textColor: compArray[0]?.textColor ?? '#000000',
  };

  return ( {...value } 
  );
};

  
 



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