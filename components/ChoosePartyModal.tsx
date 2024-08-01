import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  getDocs, 
} from 'firebase/firestore';
import { db } from '@/firebase';
import { save_Template } from '@/utils/functions'; 
type Props = {
  onReturn: (str: string) => void;
  onAlert: (name: string,id:string) => void
};
type PartyType = {
  image: string;
  name: string;
  message: string;
  mode: string;
  fontSize: number;
  displayedPictures: { link: string; name: string; dances: string[] }[];
  displayedVideos: {
    name: string;
    image: string;
    link: string;
    dances: string[];
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
  animationOption: number;
  rainAngle: number;
  originX: number;
  originY: number;
  particleTypes: string[];
};
const ChoosePartyModal = ({ onReturn, onAlert }: Props) => {
  const [parties, setParties] = useState<PartyType[]>([]);
  const [choosenParty, setChoosenParty] = useState<string>('');
  const [visibleInput, setVisibleInput] = useState(false);
  const [partyName, setPartyName] = useState<string>('');
  
  async function getPartyArray() {
    const q = await getDocs(collection(db, 'parties'));
    let arr1 = q.docs.map((doc) => doc.data());
    let arr2 = q.docs.map((doc) => doc.id);
    let arr = arr1.map((x, i) => ({ ...x, id: arr2[i] })) as PartyType[];
    console.log(arr);
    setChoosenParty(arr2[0])
    setParties(arr);
  }

  useEffect(() => {
    // if (snapshot) {
    //   let arr: PartyContextType[] = [];
    //   snapshot.docs.forEach((doc1) => {
    //     arr.push({
    //       ...(doc1.data() as any),
    //       id: doc1.id,
    //     });
    //   });
    //   const filteredParty = arr.find((x) => x.id === compID);
    //   if (filteredParty) {
    //     let party
    //     setPartyArray(filteredParty);

    // console.log("got object",filteredParty)
    //   }
    // }
    getPartyArray();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    let file1 = e.currentTarget.files![0];

    const reader = new FileReader();
    reader.onload = (function (file) {
      return async function () {
        let res = this.result?.toString();
        let resObj=JSON.parse(res !== undefined ? res : '');
        delete resObj.id;

        const partyRef = collection(db, "parties");

        await addDoc(partyRef, resObj);
        location.reload() 
      };
    })(file1);
    reader.readAsText(file1);
  };
 
  return (
    <div className="w-full flex flex-col justify-center items-center">
             
      <select
        className="w-1/2 p-2"
        name="parties"
        id="parties"
        onChange={(e) => {
          setChoosenParty(e.target.value);
        }}
      >
        {parties.map((party, index) => {
          return (
            <option key={index} value={party.id}>
              {party.name}
            </option>
          );
        })}
      </select>
      {choosenParty.length > 0 && (
        <div className="w-full flex flex-row flex-wrap justify-center items-center">
          <button
            className="btnFancy"
            onClick={() => {
              onReturn(choosenParty);
            }}
          >
            Use
          </button>
          <button
            className="btnFancy"
            onClick={() => {
              save_Template(
                JSON.stringify(
                  parties.filter((party) => party.id == choosenParty)[0]
                ),
                'party_' + choosenParty
              );
            }}
          >
            Save
          </button>

          <button className="btnFancy" onClick={() => {
            onAlert(parties.filter(party=>party.id==choosenParty)[0].name,choosenParty)
          }}>
            Delete
          </button>
        </div>
      )}
      <div className="w-full flex flex-row flex-wrap justify-center items-center">
        <button
          className="btnFancy"
          onClick={() => document.getElementById('inputField2')!.click()}
        >
          Load Party
        </button>
        <input
          type="file"
          id="inputField2"
          hidden
          accept="text/*"
          className="w-full mb-2 rounded-md text-gray-700"
          onChange={handleChange}
        />
        <button
          className="btnFancy"
          onClick={(e) => {
            e.preventDefault();
            setVisibleInput(!visibleInput);
            
          }}
        >
          Create Party
        </button>
         {visibleInput && (
            <div>
            <input type="text" value={partyName} className="w-full p-2 border border-gray-300 rounded" onChange={(e)=>{
                e.preventDefault();
                setPartyName(e.target.value)
            }} />
            <button className="btnFancy" onClick={async(e)=>{
                e.preventDefault();
                setVisibleInput(!visibleInput);
                console.log('submit');
                let resObj= {
                    image: '',
                    name: partyName, 
                    message: '',
                    mode: 'Default',
                    fontSize:10,
                    displayedPictures:[],
                    displayedVideos:[],
                    videoChoice:{link:"",name:""}, 
                    compLogo:{link:"",name:""},
                    titleBarHider:false,
                    showUrgentMessage:false,
                    showSVGAnimation:true,
                    displayedPicturesAuto:[],  
                    seconds:5, 
                    manualPicture:{link:"",name:""},
                    savedMessages:[" ","Argentine Tango","Bachata","Cha Cha","Foxtrot","Happy Birthday, Paul!","Hustle","Jive","Mambo","Merengue","POLKA","Paso Doble","Quickstep","Rumba","Salsa","Samba","Swing","Tango","Two Step","Viennese Waltz","Waltz","West Coast Swing"],
                    textColor:"#000000", 
                    animationSpeed: 3,
                    speedVariation: 0.4,
                    particleCount: 100,
                    maxSize: 20,
                    animationOption:0,
                    rainAngle: 0,
                    originX: 400,
                    originY: 400,
                    particleTypes:[]
                }
                const partyRef = collection(db, "parties");
        
                await addDoc(partyRef, resObj);
                location.reload() 
            }}>Submit</button>
            </div>
         )}
                 

      </div>
    </div>
  );
};

export default ChoosePartyModal;
 