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
import React, { useState, useEffect } from 'react';
import PlayerButtons from './PlayerButtons';
import Slider from '@/components/Slider';
import { AnimatePresence, motion } from 'framer-motion';
import sleep from '@/utils/functions';

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
  role: string | undefined;
  onReturn: (songs: Song[]) => void;
  onPlay: (song: Song) => void;
  onClose: () => void;
  onLoad: (a: boolean) => void;
};

const ChooseExternalSongModal: React.FC<Props> = ({
  savedDances,
  vis,
  role,
  onReturn,
  onClose,
  onPlay,
  onLoad,
}) => {
  const [displaySngs, setDisplaySngs] = useState<Song[]>([]);
  const [isVisible, setIsVisible] = useState(vis);
  const [songLink, setSongLink] = useState('');
  const [link1, setLink1] = useState('');
  const [songName, setSongName] = useState('');
  const [dance, setDance] = useState<string | null>(null);
  const [rate, setRate] = useState(1);
  const songsCollection = collection(db, 'songs');
  useEffect(() => {
    const fetchSongs = async () => {
      const songsSnapshot = await getDocs(songsCollection);
      const songsList = songsSnapshot.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as Song)
      );
      setDisplaySngs(songsList);
    };
    fetchSongs();
  }, []);
  // const handleSubmit = (submitType: 'Save' | 'Close') => {
  //   if (submitType === 'Save') {
  //     onReturn(displaySngs);
  //   } else {
  //     onReturn([]);
  //   }
  // };

  // const handleAddPicture = () => {
  //   const newSong = {
  //     name: songName,
  //     url: songLink,
  //     dance,
  //     id: null,
  //     rate,
  //   } as Song;

  //   setDisplaySngs([...displaySngs, newSong]);
  //   setSongLink('');
  //   setSongName('');
  //   setDance(null);
  // };

  const handleDeletePicture = async (index: number) => {
    onLoad(true);
    const newSongs = [...displaySngs];
    await deleteDoc(doc(db, 'songs', displaySngs[index].id!));
    newSongs.splice(index, 1);
    setDisplaySngs(newSongs);
    onLoad(false);
  };
  const handleSongAdd = async ({
    name,
    url,
    dance,
    rate,
  }: {
    name: string;
    url: string;
    dance: string;
    rate: number;
  }) => {
    onLoad(true);
    const songsSnapshot = await addDoc(songsCollection, {
      name,
      url,
      dance,
      rate,
    });
    const newSong = {
      ...{ name, url, dance, rate },
      id: songsSnapshot.id,
    } as Song;
    setDisplaySngs([...displaySngs, newSong]);
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
    console.log(newSong);
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
                <h2 className="text-xl font-bold mb-4">Available songs</h2>

                <div className="w-full h-64 md:h-[28.5rem] border border-black p-1 rounded-md overflow-x-auto mb-4">
                  <div className="flex flex-col flex-wrap items-center justify-start">
                    {displaySngs
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
                              fetch(`/api/music2play?file_id=${item.url}`).then(
                                (response) =>
                                  response.json().then((data) => {
                                    console.log(data);
                                    onPlay({
                                      name: item.name,
                                      url: data.fileUrl,
                                      dance: item.dance,
                                      id: item.id,
                                      rate: item.rate,
                                    });
                                    setSongLink(data.fileUrl);
                                  })
                              );
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
                              onClick={() => handleDeletePicture(i)}
                              className="absolute top-0 right-0 fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor  w-8 h-8"
                            >
                              <ShowIcon icon={'Close'} stroke={'2'} />
                            </button>
                          )}
                          {role == 'Admin' && (
                            <button
                              onClick={() => {
                                console.log(displaySngs[i]);
                                const songLinkElement = document.getElementById(
                                  'songLink'
                                ) as HTMLInputElement | null;
                                if (songLinkElement) {
                                  songLinkElement.value =
                                    'https://drive.google.com/file/d/' +
                                    displaySngs[i].url +
                                    '/view?usp=sharing';
                                }
                                const danceSelectElement =
                                  document.getElementById(
                                    'danceSelect'
                                  ) as HTMLSelectElement | null;
                                if (danceSelectElement) {
                                  danceSelectElement.value = displaySngs[i]
                                    .dance
                                    ? displaySngs[i].dance
                                    : '';
                                }
                                setSongName(displaySngs[i].name);
                                setDance(displaySngs[i].dance);
                                setLink1(displaySngs[i].url);
                                setRate(
                                  displaySngs[i].rate !== undefined
                                    ? displaySngs[i].rate
                                    : 1
                                );
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
                </div>

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
                    placeholder="Enter song name"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-2"
                  />

                  {dance !== undefined && (
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
                  )}
                  <div className='w-full flex flex-row justify-between items-center'>
                  <div className='m-2'>
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
                    <input
                      type="number"
                      className="mt-2 text-sm h-8 w-14 float-right rounded-md text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG border border-lightMainColor dark:border-darkMainColor"
                      min={0.5}
                      max={2}
                      value={rate}
                      onChange={(e) => {
                        setRate(e.target.valueAsNumber);
                      }}
                    />
                    
                  </div>
                  <button
                  onClick={() =>
                    handleSongAdd({
                      name: songName,
                      url: link1,
                      dance: dance ? dance : '',
                      rate,
                    })
                  }
                  className="w-[70%] bg-purple-800 text-white p-2 rounded hover:bg-purple-700 transition-colors m-2"
                >
                  Add Song to Database
                </button>
                </div>
                </div>
                
                {/* <button
                  onClick={() => handleSubmit('Save')}
                  className="w-full bg-purple-800 text-white p-2 rounded hover:bg-purple-700 transition-colors mb-2"
                >
                  Save Changes
                </button> */}
                {/* <button
                  onClick={() => handleSubmit('Close')}
                  className="w-full bg-blue-800 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Close
                </button> */}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChooseExternalSongModal;
