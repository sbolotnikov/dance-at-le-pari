'use client';

import ShowIcon from '@/components/svg/showIcon';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { db } from '@/firebase';
import React, { useState, useEffect, useRef } from 'react';
import PlayerButtons from './PlayerButtons';
import Slider from '@/components/Slider';
import { AnimatePresence, motion } from 'framer-motion';
import sleep from '@/utils/functions';

interface Playlist {
  name: string; 
  playlist: string[] | null;
  id: string | null;
}

type Props = {
  // savedDances: string[];
  vis: boolean;
  role: string | undefined;
  // onReturn: (songs: Playlist[]) => void;
  // onPlay: (song: Playlist) => void;
  onClose: () => void;
  onLoad: (a: boolean) => void;
}; 
const ChoosePlaylistsModal: React.FC<Props> = ({
  // savedDances,
  vis,
  role,
  // onReturn,
  onClose,
  // onPlay,
  onLoad,
}) => {
  const [displayPlaylists, setDisplayPlaylists] = useState<Playlist[]>([]);
  const [isVisible, setIsVisible] = useState(vis);
  const [songLink, setSongLink] = useState('');
  const [link1, setLink1] = useState('');
  const [songName, setSongName] = useState('');
  const [dance, setDance] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const topMargin = 12;
  const itemHeight = 40;
  const playlistsCollection = collection(db, 'playlists');
  const getClientPos = (
    e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent
  ) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const onDragStart = (
    e: React.TouchEvent | React.MouseEvent,
    index: number
  ) => {
    setDragging(true);
    setDraggedIndex(index);
    setPlaceholderIndex(index);

    const { x, y } = getClientPos(e);
    setGhostPosition({ x, y });

    if (ghostRef.current) {
      ghostRef.current.innerText = songDB[index].name;
    }
  };

  const onDragMove = (
    e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent
  ) => {
    if (!dragging || draggedIndex === null || !listRef.current) return;

    const { x, y } = getClientPos(e);
    setGhostPosition({ x, y });

    const listRect = listRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const relativeY = y + scrollTop - listRect.top;
    console.log('coordinateY =', relativeY);

    let newIndex = Math.floor((relativeY - topMargin) / itemHeight);
    newIndex = Math.max(0, Math.min(newIndex, songDB.length - 1));
    setPlaceholderIndex(newIndex);
  };

  const onDragEnd = () => {
    if (
      draggedIndex !== null &&
      placeholderIndex !== null &&
      draggedIndex !== placeholderIndex
    ) {
      const newItems = [...songDB];
      const [removed] = newItems.splice(draggedIndex, 1);
      newItems.splice(placeholderIndex, 0, removed);
      setSongDB(newItems);
    }
    setDragging(false);
    setDraggedIndex(null);
    setPlaceholderIndex(null);
  };
  useEffect(() => {
    window.addEventListener('beforeunload', handleOnBeforeUnload, {
      capture: true,
    });
  }, []);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => onDragMove(e);
    const handleTouchMove = (e: TouchEvent) => onDragMove(e);

    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', onDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', onDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', onDragEnd);
    };
  }, [dragging, draggedIndex, placeholderIndex, songDB]);
  useEffect(() => {
    const fetchPlaylists = async () => {
      const playlistsSnapshot = await getDocs(playlistsCollection);
      const playlistsList = playlistsSnapshot.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as Playlist)
      );
      setDisplayPlaylists(playlistsList);
    };
    fetchPlaylists();
  }, []);
 

  // const handleDeletePicture = async (index: number) => {
  //   onLoad(true);
  //   const newSongs = [...displaySngs];
  //   await deleteDoc(doc(db, 'songs', displaySngs[index].id!));
  //   newSongs.splice(index, 1);
  //   setDisplaySngs(newSongs);
  //   onLoad(false);
  // };
  const handlePlaylistAdd = async ({
    name,
    playlist 
  }: {
    name: string;
    playlist: string[]; 
  }) => {
    onLoad(true);
    const songsSnapshot = await addDoc(playlistsCollection, {
      name,
      playlist,
    });
    const newPlaylist = {
      ...{ name, playlist },
      id: songsSnapshot.id,
    } as Playlist;
    setDisplayPlaylists([...displayPlaylists, newPlaylist]);
    setLink1('');
    setSongName('');
    setSongLink('');
    const songLinkElement = document.getElementById(
      'songLink'
    ) as HTMLInputElement | null;
    if (songLinkElement) {
      songLinkElement.value = '';
    }
    const danceSelectElement = document.getElementById(
      'danceSelect'
    ) as HTMLSelectElement | null;
    if (danceSelectElement) {
      danceSelectElement.value = '';
    }
    setDance(null);
    onLoad(false);
    console.log(newPlaylist);
  };
  const handleSongLinkChange = (text: string) => {
    const id = text.split('/file/d/')[1]?.split('/')[0];
    fetch(`/api/music2play?file_id=${id}`).then((response) =>
      response.json().then((data) => {
        console.log(data);
        setSongLink(data.fileUrl);
      })
    );
  };

  if (!vis) return null;

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
              className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
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
                <h2 className="text-xl font-bold mb-4">Available Playlists</h2>
                <div
              className={`w-full h-[350px] border border-black p-1 rounded-md ${
                draggedIndex !== null ? 'overflow-hidden' : 'overflow-x-auto'
              } mb-4 `}
            >
              <div className="flex flex-col flex-wrap items-center justify-start relative">
                <ul
                  ref={listRef}
                  className="w-full mx-auto mt-8 bg-lightMainBG dark:bg-darkMainBG rounded-lg shadow-md  relative"
                >
                  {songDB.map((item, i) => (
                    <React.Fragment key={item.name}>
                      {i === placeholderIndex &&
                        draggedIndex !== null &&
                        draggedIndex !== i && (
                          <li className="h-12 bg-blue-100 border-2 border-blue-300 border-dashed"></li>
                        )}
                      <li
                        className={`px-4 flex items-center justify-between relative h-fit min-h-[2.5rem] border-b last:border-b-0 cursor-move hover:bg-gray-50 transition-colors duration-150 ease-in-out 
                          ${i === draggedIndex ? 'hidden' : ''}`}
                        style={{ userSelect: 'none' }}
                      >
                        <p
                          className=" text-left w-full "
                          style={{ userSelect: 'none' }}
                          onMouseDown={(e) => onDragStart(e, i)}
                          onTouchStart={(e) => onDragStart(e, i)}
                        >
                          <span>{i + 1}. </span>
                          <span className=" bg-gray-300 text-sm rounded-sm truncate">
                            {item.dance}
                          </span>
                          {'  '}
                          {item.name}
                        </p>
                         
                        <button
                          onClick={() => {
                            let newDB = songDB.filter(
                              (item2) => item2.id !== item.id
                            );
                            setSongDB(newDB);
                          }}
                          className="  fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor  w-8 h-8 mt-2 hover:scale-110 transition-all duration-150 ease-in-out"
                        >
                          <ShowIcon icon={'Close'} stroke={'2'} />
                        </button>
                      </li>
                    </React.Fragment>
                  ))}
                  {placeholderIndex === songDB.length && (
                    <li className="h-12 bg-blue-100 border-2 border-blue-300 border-dashed"></li>
                  )}
                </ul>
                {dragging && draggedIndex !== null && (
                  <div
                    ref={ghostRef}
                    className="fixed px-4 py-2 bg-white shadow-lg rounded opacity-80 pointer-events-none"
                    style={{
                      left: `${5}px`,
                      top: `${
                        topMargin + (placeholderIndex! + 1) * itemHeight
                      }px`,
                      width: listRef.current
                        ? `${listRef.current.offsetWidth - 32}px`
                        : 'auto',
                    }}
                  >
                    <p className=" text-center max-w-[300px]">
                      <span>{draggedIndex + 1}. </span>
                      <span className=" bg-gray-300 text-sm rounded-sm truncate">
                        {songDB[draggedIndex].dance}
                      </span>
                      {'  '}
                      {songDB[draggedIndex].name}
                    </p>
                  </div>
                )}
              </div>
            </div>
                {/* <div className="w-full h-64 md:h-[28.5rem] border border-black p-1 rounded-md overflow-x-auto mb-4">
                  <div className="flex flex-col flex-wrap items-center justify-start">
                    {displayPlaylists
                      .sort((a, b) =>
                        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
                      )
                      .map((item, i) => (
                        <div
                          key={`songsavailable${i}`}
                          className="relative m-1 w-full flex justify-start items-center"
                        >
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                               
                            }}
                          >
                            <PlayerButtons
                              icon={'File'}
                              color="#504deb"
                              color2="#FFFFFF"
                              size={50}
                              onButtonPress={() => {
                                console.log('Choosen song', item);
                              }}
                            />
                          </div>
                          {role == 'Admin' && (
                            <button
                              onClick={() =>  {}}
                              className="absolute top-0 right-0 fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor  w-8 h-8"
                            >
                              <ShowIcon icon={'Close'} stroke={'2'} />
                            </button>
                          )}
                          {role == 'Admin' && (
                            <button
                              onClick={() => {
                                console.log(displayPlaylists[i]);
                                
                              }}
                              className="absolute top-0 right-9 fill-editcolor  stroke-editcolor  rounded-md border-editcolor  w-8 h-8"
                            >
                              <ShowIcon icon={'Edit'} stroke={'0.5'} />
                            </button>
                          )}
                          <p className="mt-1 text-center truncate">
                            {item.name}
                          </p>
                        </div>
                      ))}
                  </div>
                </div> */}

                <div className="w-full flex flex-col items-center mb-4">
 

                  <input
                    type="text"
                    placeholder="Enter song link"
                    id="songLink"
                    onChange={(e) => {
                      e.preventDefault();
                      setLink1(
                        e.target.value.split('/file/d/')[1]?.split('/')[0]
                      );
                      handleSongLinkChange(e.target.value);
                    }}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />

                  <input
                    type="text"
                    placeholder="Enter playlist name"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />

                  {/* {dance !== undefined && (
                    <select
                      className="w-full p-2 border border-gray-300 rounded mb-2"
                      id="danceSelect"
                      onChange={(e) => setDance(e.target.value)}
                    >
                      {savedDances &&
                        savedDances
                          .sort((a, b) => a.localeCompare(b))
                          .map((item, index) => {
                            return (
                              <option key={'opt' + index} value={item}>
                                {item}
                              </option>
                            );
                          })}
                    </select>
                  )} */} 
                   
                  <button
                  onClick={() =>
                    handlePlaylistAdd({
                      name: songName,
                      playlist: [songLink],  
                    })
                  }
                  className="w-[90%] bg-purple-800 text-white p-2 rounded hover:bg-purple-700 transition-colors m-2"
                >
                  Add Playlist to Database
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

 

export default ChoosePlaylistsModal