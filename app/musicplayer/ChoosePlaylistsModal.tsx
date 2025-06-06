'use client';

import ShowIcon from '@/components/svg/showIcon';
import {
  addDoc,
  collection,
  deleteDoc,
  doc, 
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/firebase';
import React, { useState, useEffect, useRef, use } from 'react';
import PlayerButtons from './PlayerButtons'; 
import { AnimatePresence, motion } from 'framer-motion';
import sleep from '@/utils/functions';
import DraggableList from '@/components/DraggableList';


interface Playlist {
  name: string;
  playlist: string[];
  id: string | null;
}

type Props = { 
  vis: boolean;
  role: string | undefined;
  choosenPlaylist: {
    name: string;
    id: string;
    listArray: string[];
  }; 
  onClose: () => void;
  onLoad: (a: boolean) => void;
};
const ChoosePlaylistsModal: React.FC<Props> = ({
  vis,
  choosenPlaylist,
  role, 
  onClose, 
  onLoad,
}) => {
  const danceArrayDefault=['','Argentine Tango',
        'Bachata',
        'Bolero',
        'Cha Cha',
        'Foxtrot',
        'Hustle',
        'Jive',
        'Mambo',
        'Merengue',
        'POLKA',
        'Paso Doble',
        'Quickstep',
        'Rumba',
        'Salsa',
        'Samba',
        'Swing',
        'Tango',
        'Two Step',
        'Viennese Waltz',
        'Waltz',
        'West Coast Swing'] 
  const [playlist, setPlaylist] = useState<string[]>(choosenPlaylist.listArray);
  const [isVisible, setIsVisible] = useState(vis); 
  const [dancesList, setDancesList] = useState<string[]>(danceArrayDefault); 
  const [playlistName, setPlaylistName] = useState(choosenPlaylist.name); 
 
  const [currentEditItem, setCurrentEditItem] = useState<number | null>(null);
  const [playlistItem, setPlaylistItem] = useState<string>('');
  const [dragging, setDragging] = useState(false);

  const playlistsCollection = collection(db, 'playlists');
  
  
  const handleDeletePlaylist = async () => {
    onLoad(true); 
    await deleteDoc(doc(db, 'playlists', choosenPlaylist.id));
    location.reload();
  };
  const handlePlaylistAdd = async ({
    name,
    playlist,
  }: {
    name: string;
    playlist: string[];
  }) => {
    onLoad(true);
    const playlistSnapshot = await addDoc(playlistsCollection, {
      name,
      playlist,
    });
    location.reload();
  };

  const handlePlaylistEdit = async ({
    name,
    playlist,
    id
  }: {
    name: string;
    playlist: string[];
    id: string;
  }) => {
    const playlistSnapshot = await updateDoc(doc(db, 'playlists', id), { 
      name,
      playlist,
    });
    location.reload();
  };
 

  if (!vis) return null;
useEffect(() => {
  if (currentEditItem !== null) document.getElementById('playlistItem')?.focus();
}, [currentEditItem]);
useEffect(() => {
   let newPlaylist=[...playlist,...danceArrayDefault];
   //eleminate duplicates
    newPlaylist = newPlaylist.filter((item, index) => newPlaylist.indexOf(item) === index);
    setDancesList(newPlaylist.sort((a: string, b: string) => a.localeCompare(b)));
}, [playlist]);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -600 }}
          transition={{
            ease: 'easeOut',
            duration: 1,
            times: [0, 0.2, 0.5, 0.8, 1],
          }}
          animate={{
            opacity: [0, 1, 1, 1, 1],
            rotateX: ['90deg', '89deg', '89deg', '0deg', '0deg'],
            x: ['-100vw', '0vw', '0vw', '0vw', '0vw'],
          }}
          exit={{
            opacity: [1, 1, 1, 1, 0],
            rotateX: ['0deg', '0deg', '89deg', '89deg', '90deg'],
            x: ['0vw', '0vw', '0vw', '0vw', '-100vw'],
          }}
          className="blurFilter animatePageMainDiv w-[100vw] h-[100svh] absolute flex flex-col justify-center items-center bg-slate-500/70 left-0 z-[1001]"
        >
          <div
            className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1170px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[73svh] md:h-[85svh]
        }`}
          >
            <div
              id="wrapperDiv"
              className={`w-full h-full relative  p-1  ${dragging?"overflow-hidden":"overflow-y-auto"} border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center`}
            >
              <button
                className={` flex flex-col justify-center items-center origin-center cursor-pointer z-10 hover:scale-125 absolute top-3 right-3`}
                onClick={() => {
                  setIsVisible(false);
                  sleep(1200).then(() => onClose());
                }}
              >
                <div className=" h-8 w-8  fill-lightMainColor stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor">
                  <ShowIcon icon={'Close'} stroke={'2'} />
                </div>
              </button>
              <div
                id="containedDiv"
                className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
              >
                <div className="w-full flex flex-col md:flex-row items-start">
                  <h2 className="w-full md:w-1/4 p-2 text-xl font-bold">
                    Playlist Name
                  </h2>
                  <input
                    type="text"
                    placeholder="Enter playlist name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="w-full md:w-[70%] p-2 bg-lightMainBG dark:bg-darkMainBG text-lightMainColor dark:text-darkMainColor border border-lightMainColor dark:border-darkMainColor rounded-md mb-2"
                  />
                </div>
                <h2 className="text-xl font-bold mb-4">Playlist dances</h2>


                <DraggableList
            initialItems={playlist.map((item) => item)}
            addItems={playlist.map((item) => item)}
            onListChange={(newItems: string[]) => {
              console.log('newItems', newItems);
              setPlaylist(newItems)        
            }}
            isTouching={(isTouching:boolean) => setDragging(isTouching)}
            containerClassName={'h-[350px]  w-full border border-lightMainColor dark:border-darkMainColor p-1 rounded-lg my-1 overflow-hidden'}
            itemHeight={48}
            autoScrollSpeed={15}
          /> 

                <div className="w-full flex flex-col items-center mb-2">
                <div className="w-full flex flex-col md:flex-row items-start">
                      <h2 className="w-full md:w-1/4 p-2 text-xl font-bold">
                        Add to Playlist from List
                      </h2>
                      <select
                        className="w-full md:w-[70%] p-2 border bg-lightMainBG dark:bg-darkMainBG text-lightMainColor dark:text-darkMainColor border-lightMainColor dark:border-darkMainColor rounded-md mb-2"
                        id="playlistSelect"
                        onChange={(e) => {
                          e.preventDefault();
                          let newList = [...playlist];
                          console.log('e.target.value', e.target.value);
                          newList.push(e.target.value);
                          setPlaylist(newList);
                        }}>
                          {dancesList.map((item, ind) => (
                            <option key={item+ind} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                    </div>
                  {currentEditItem !== null && (
                    <div className="w-full flex flex-col md:flex-row items-start">
                      <h2 className="w-full md:w-1/4 p-2 text-xl font-bold">
                        Add to Playlist
                      </h2>
                      <input
                        type="text"
                        id="playlistItem"
                        placeholder="Enter playlist dance"
                        value={playlistItem}
                        onChange={(e) => setPlaylistItem(e.target.value)}
                        className="w-full md:w-[70%] p-2 bg-lightMainBG dark:bg-darkMainBG text-lightMainColor dark:text-darkMainColor border border-lightMainColor dark:border-darkMainColor rounded-md mb-2"
                        onBlur={(e) => {
                          e.preventDefault();
                          let newList = [...playlist];
                          newList[currentEditItem] = playlistItem;
                          setPlaylist(newList);
                          setCurrentEditItem(null);
                        }}
                      />
                    </div>
                  )}
                   
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentEditItem(playlist.length);
                      setPlaylistItem(''); 
                    }}
                    className=" rounded btnFancySmall"
                  >
                    Add New Playlist Item
                  </button>

                  <div className="w-full flex flex-row items-start flex-wrap">
                    {playlist !== undefined && (
                    Array.from(new Set(playlist)).map((item, i) => (
                      <div key={i} className="w-fit m-1">{item}-{playlist.filter(i2=>i2===item).length}{'. '}</div>
                    ))
                    )}
                    <div className="w-fit m-1">Total:{playlist.length}</div>
                    </div>
                  {(playlistName!==choosenPlaylist.name || playlist!==choosenPlaylist.listArray)&&(choosenPlaylist.id.length!==0)&&<button
                    onClick={() =>
                      handlePlaylistEdit({
                        name: playlistName,
                        playlist: playlist,
                        id: choosenPlaylist.id,
                      })
                    }
                    className="w-[90%] bg-yellow-600 p-2 rounded hover:bg-yellow-400 transition-colors m-2"
                  >
                    Save Edited Playlist to Database
                  </button>}
                  <button
                    onClick={() =>
                      handlePlaylistAdd({
                        name: playlistName,
                        playlist: playlist,
                      })
                    }
                    className="w-[90%] bg-editcolor p-2 rounded hover:bg-editcolor/60 transition-colors m-2"
                  >
                    Add Playlist to Database as New
                  </button>
                  <button
                    onClick={() =>
                      handleDeletePlaylist()
                    }
                    className="w-[90%] bg-alertcolor p-2 rounded hover:bg-alertcolor/60 transition-colors m-2"
                  >
                    Delete Playlist from Database
                  </button> 
                  
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChoosePlaylistsModal;
