'use client';

import AnimateModalLayout from '@/components/AnimateModalLayout';
import ShowIcon from '@/components/svg/showIcon';
import {   addDoc, collection, doc, getDocs,  } from 'firebase/firestore';
import { db } from '@/firebase';
import React, { useState, useEffect } from 'react'; 
import PlayerButtons from './PlayerButtons';
import Slider from '@/components/Slider';

interface Song {
    url: string;
    name: string;
    rate: number | undefined;
    dance: string | null;
    id: string | null;
  }

type Props = { 
  savedDances: string[]; 
  vis: boolean;
  onReturn: (songs: Song[]  ) => void;
  onPlay: (song: Song) => void;
  onClose:()=>void;
}

const ChooseExternalSongModal: React.FC<Props> = ({
  
  savedDances, 
  vis,
  onReturn,
  onClose,
    onPlay
}) => {
  const [displaySngs, setDisplaySngs] = useState<Song[] >([]);
  const [songLink, setSongLink] = useState('');
  const [link1, setLink1] = useState('');   
  const [songName, setSongName] = useState('');
  const [dance, setDance] = useState<string | null>(null);
  const [rate, setRate] = useState(1);
  const songsCollection = collection(db, 'songs');
  useEffect(() =>{
      const fetchSongs = async () => {
        
        const songsSnapshot = await getDocs(songsCollection);
        const songsList = songsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Song));
        setDisplaySngs(songsList);
      };
      fetchSongs();
    },[])
  const handleSubmit = (submitType: 'Save' | 'Close') => {
    if (submitType === 'Save') {
      onReturn(displaySngs);
    } else {
      onReturn([]);
    }
  };

  const handleAddPicture = () => {
    const newSong =   { name: songName, url: songLink, dance, id:null, rate } as Song;
    
    setDisplaySngs([...displaySngs, newSong]);
    setSongLink('');
    setSongName('');
    setDance(null);
  };

  const handleDeletePicture = (index: number) => {
    const newPictures = [...displaySngs];
    newPictures.splice(index, 1);
    setDisplaySngs(newPictures);
  };
  const handleSongAdd = async({ name, url, dance, rate }:{name: string, url: string, dance: string, rate:number} ) => {
    const songsSnapshot = await addDoc(songsCollection, { name, url, dance, rate });
    const newSong = { ...{ name, url, dance, rate }, id: songsSnapshot.id } as Song;
    console.log(newSong);
  }
  const handleSongLinkChange = (text: string) => {
     
      const id = text.split('/file/d/')[1]?.split('/')[0];
      fetch(`/api/music2play?file_id=${id}`).then(response => response.json()
                    .then(data => {
                        console.log(data);
                        setSongLink(data.fileUrl);
                    })); 
     
  };

  if (!vis) return null;

  return (
    <AnimateModalLayout
      visibility={vis}
      onReturn={() => {
        onClose();
      }}
    > 
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1170px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
        }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
          > 
        <h2 className="text-xl font-bold mb-4">Available songs</h2>

        <div className="w-full h-64 border border-black p-1 rounded-md overflow-x-auto mb-4">
          <div className="flex flex-col flex-wrap items-center justify-start">
            {displaySngs .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)).map((item, i) => (
              <div key={`songsavailable${i}`} className="relative m-1 w-full flex justify-start items-center">
                <button  
                    onClick={(e) => {
                        e.preventDefault();
                        fetch(`/api/music2play?file_id=${item.url}`).then(response => response.json()
                    .then(data => {
                        console.log(data);
                        onPlay({ name: item.name, url: data.fileUrl, dance:item.dance, id:item.id, rate:item.rate })
                        setSongLink(data.fileUrl);
                    }));
                        
                    }}>
                    <PlayerButtons
                      icon={'File'}
                      color="#504deb"
                      color2="#FFFFFF"
                      size={50}
                      onButtonPress={() => {
                        console.log("Choosen song", item);
                      }}
                    />  
                </button>
                <button 
                  onClick={() => handleDeletePicture(i)}
                  className="absolute top-0 right-0 fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor  w-8 h-8"
                >
                  <ShowIcon icon={'Close'} stroke={'2'} />
                </button> 
                  <p className="mt-1 text-center truncate">{item.name}</p>
                 
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col items-center mb-4">
          {/* <img 
            src={songLink} 
            alt="Preview" 
            width={64}
            height={64}
            className=" bg-gray-300 rounded-sm mb-2"
          /> */}
          
          

          <input
            type="text"
            placeholder="Enter song link"
             
            onChange={(e) =>{ 
                e.preventDefault();
                setLink1(e.target.value.split('/file/d/')[1]?.split('/')[0])
                handleSongLinkChange(e.target.value)}}
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />

           
            <input
              type="text"
              placeholder="Enter song name"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            /> 
           
                  
                <select
                className="w-full p-2 border border-gray-300 rounded mb-2"
                onChange={(e) => setDance(e.target.value)}
              >
                {savedDances &&
                  savedDances.sort((a, b) => a.localeCompare(b)).map((item, index) => {
                     return (
                      <option key={'opt' + index} value={item}>
                        {item}
                      </option>
                    );
                  })}
              </select>
              <div>
                <label className="block mb-2">Playback Speed</label>
                <Slider
                  min={0.5}
                  max={2}
                  step={0.01}
                  value={rate}
                  onChange={(newValue) => setRate(newValue)}
                  thumbColor="#4a5568"
                />
                <span>{`${(rate * 100).toFixed(0)}%`}</span>
                <input type="number" className="mt-2 text-sm h-8 w-14 float-right rounded-md text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG border border-lightMainColor dark:border-darkMainColor" min={0.5} max={2} value={rate}
                  onChange={(e) =>{ setRate(e.target.valueAsNumber); }}
                  />
              </div>
        </div>
        <button
          onClick={() => handleSongAdd({ name: songName, url: link1, dance:dance?dance:"", rate })}
          className="w-full bg-purple-800 text-white p-2 rounded hover:bg-purple-700 transition-colors mb-2"
        >
          Add Song to Database
        </button>
        <button
          onClick={() => handleSubmit('Save')}
          className="w-full bg-purple-800 text-white p-2 rounded hover:bg-purple-700 transition-colors mb-2"
        >
          Save Changes
        </button>
        <button
          onClick={() => handleSubmit('Close')}
          className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
      </div>
    </div>
    </AnimateModalLayout>
  );
};

export default ChooseExternalSongModal;