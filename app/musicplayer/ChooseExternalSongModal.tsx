'use client';

import ShowIcon from '@/components/svg/showIcon';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/firebase';
import React, { useState, useEffect } from 'react';
import PlayerButtons from './PlayerButtons';
import Slider from '@/components/Slider';
import AnimateModalLayoutNew from '@/components/AnimatedModalLayoutNew';

interface Song {
  url: string;
  name: string;
  rate: number | undefined;
  dance: string | null;
  collectionName: string;
  id: string | null;
  introduction?: string;
}

type Props = {
  savedDances: string[];
  vis: boolean;
  role: string | undefined;
  collectionsArray: string[];
  songs: Song[];
  onReturn: (songs: Song[]) => void;
  onPlay: (song: {
    url: string;
    name: string;
    rate: number | undefined;
    dance: string | null;
    id: string | null;
  }) => void;
  onClose: () => void;
  onLoad: (a: boolean) => void;
};

const ChooseExternalSongModal: React.FC<Props> = ({
  savedDances,
  vis,
  role,
  collectionsArray,
  songs,
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
  const [collectionName, setCollectionName] = useState('');
  const [dance, setDance] = useState<string | null>(null);
  const [rate, setRate] = useState(1);
  const [searchPar, setSearchPar] = useState('');
  const [songsFiltered, setSongsFiltered] = useState<Song[]>(songs);
  const songsCollection = collection(db, 'songs');
  // useEffect(() => {
  //   const fetchSongs = async () => {
  //     const songsSnapshot = await getDocs(songsCollection);
  //     const songsList = songsSnapshot.docs.map(
  //       (doc) => ({ ...doc.data(), id: doc.id } as Song)
  //     );
  //     setSongs(songsList);
  //     let collectionArray = songsList.map((item)=>(item.collectionName))
  //     collectionArray = collectionArray.filter((item, index) => collectionArray.indexOf(item) === index);
  //     setCollectionsArray(collectionArray.sort((a: string, b: string) => a.localeCompare(b)));
  //   };
  //   fetchSongs();
  // }, []);
  useEffect(() => {
    if (searchPar === '' || searchPar.trim() === '') {
      setSongsFiltered([...displaySngs]);
      return;
    }
    if (displaySngs.length === 0) return;
    let searchRes = displaySngs.filter(
      (song) =>
        song.name!.toLowerCase().includes(searchPar.toLowerCase()) ||
        song.dance!.toLowerCase().includes(searchPar.toLowerCase())
    );
    setSongsFiltered([...searchRes]);
  }, [searchPar, displaySngs]);
  useEffect(() => {
    if (role !== 'Admin') {
      setDisplaySngs(songs.filter((item) => item.collectionName === 'Default'));
    }
  }, [collectionsArray, role]);

  const handleDeleteSong = async (index: number) => {
    onLoad(true);
    const newSongs = [...displaySngs];
    await deleteDoc(doc(db, 'songs', songsFiltered[index].id!));
    newSongs.splice(index, 1);
    setDisplaySngs(newSongs);
    onLoad(false);
  };

  // const handleUpdateAll= async () => {
  //   onLoad(true);
  //   const playlistSnapshot = await updateAll(db, 'songs', {
  //     collectionName:'Original'
  //   });
  //   onLoad(false);
  // };
  const handleSongAdd = async ({
    name,
    url,
    dance,
    rate,
    collectionName,
  }: {
    name: string;
    url: string;
    dance: string;
    collectionName: string;
    rate: number;
  }) => {
    onLoad(true);

    const songsSnapshot = await addDoc(songsCollection, {
      name,
      url,
      dance,
      collectionName,
      rate,
    });
    const newSong = {
      ...{ name, url, dance, rate, collectionName },
      id: songsSnapshot.id,
    } as Song;
    setDisplaySngs([...displaySngs, newSong]);
    setLink1('');
    setSongName('');
    setCollectionName('');
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
  };
  const handleSongLinkChange = (text: string) => {
    const id = text.split('/file/d/')[1]?.split('/')[0];
    fetch(`/api/music2play?file_id=${id}`).then((response) =>
      response.json().then((data) => {
        setSongLink(data.fileUrl);
      })
    );
  };
 

  return (
    <AnimateModalLayoutNew
      visibility={vis}
      onReturn={() => {
        setIsVisible(false);
        onClose();
      }}
      containerClassName="blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1170px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[73svh] md:h-[85svh]"
    >
      <h2 className="text-xl font-bold">Available songs</h2>
      <div className="flex flex-col justify-center items-center  w-1/2 md:w-1/4">
        {/* <div className=" w-full flex justify-end items-center"> */}
        <input
          type="text"
          id="inputField"
          className="w-full rounded-md   dark:bg-lightMainColor "
          onChange={(e) => {
            e.preventDefault();
            setSearchPar(e.target.value);
          }}
        />
        {/* </div> */}
        <p className=" tracking-widest mt-1  rounded-md text-center text-lightMainColor dark:text-darkMainColor text-[6px] md:text-base dark:bg-darkMainBG   ">
          Search (records: {songsFiltered.length})
        </p>
      </div>
      {role === 'Admin' && (
        <select
          className="w-full p-2 border border-gray-300 rounded mb-2"
          multiple
          id="collectionSelect"
          onChange={(e) => {
            e.preventDefault();
            const selectElement = document.getElementById(
              'collectionSelect'
            ) as HTMLSelectElement;
            const selectedValues = Array.from(
              selectElement.selectedOptions
            ).map((option) => option.value);
            console.log(selectedValues);
            setDisplaySngs(
              songs.filter((item) =>
                selectedValues.includes(item.collectionName)
              )
            );
          }}
        >
          {collectionsArray &&
            collectionsArray.map((item, index) => {
              return (
                <option key={'opt' + index} value={item}>
                  {item}
                </option>
              );
            })}
        </select>
      )}

      <div className="w-full h-64 md:h-[28.5rem] border border-black p-1 rounded-md overflow-x-auto mb-4">
        <div className="flex flex-col flex-wrap items-center justify-start">
          {songsFiltered
            .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
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
                    onClick={() => handleDeleteSong(i)}
                    className="absolute top-0 right-0 fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor  w-8 h-8"
                  >
                    <ShowIcon icon={'Close'} stroke={'2'} />
                  </button>
                )}
                {role == 'Admin' && (
                  <button
                    onClick={() => {
                      console.log(item);
                      const songLinkElement = document.getElementById(
                        'songLink'
                      ) as HTMLInputElement | null;
                      if (songLinkElement) {
                        songLinkElement.value =
                          'https://drive.google.com/file/d/' +
                          item.url +
                          '/view?usp=sharing';
                      }
                      const danceSelectElement = document.getElementById(
                        'danceSelect'
                      ) as HTMLSelectElement | null;
                      if (danceSelectElement) {
                        danceSelectElement.value = item.dance ? item.dance : '';
                      }
                      setSongName(item.name);
                      setDance(item.dance);
                      setLink1(item.url);
                      setCollectionName(item.collectionName);
                      setRate(item.rate !== undefined ? item.rate : 1);
                    }}
                    className="absolute top-0 right-9 fill-editcolor  stroke-editcolor  rounded-md border-editcolor  w-8 h-8"
                  >
                    <ShowIcon icon={'Edit'} stroke={'0.5'} />
                  </button>
                )}
                <p className="mt-1 text-center truncate">{item.name}</p>
              </div>
            ))}
        </div>
      </div>

      {role === 'Admin' && (
        <div className="w-full flex flex-col items-center mb-4">
          <input
            type="text"
            placeholder="Enter song link"
            id="songLink"
            onChange={(e) => {
              e.preventDefault();
              setLink1(e.target.value.split('/file/d/')[1]?.split('/')[0]);
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
          <input
            type="text"
            placeholder="Enter collection name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
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

          <div className="w-full flex flex-row justify-between items-center">
            <div className="m-2">
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
                  collectionName,
                  rate,
                })
              }
              className="w-[70%] bg-purple-800 text-white p-2 rounded hover:bg-purple-700 transition-colors m-2"
            >
              Add Song to Database
            </button>
          </div>
        </div>
      )}
    </AnimateModalLayoutNew>
  );
};

export default ChooseExternalSongModal;
