'use client';
import React, { useState, useEffect, useRef, FC } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import AnimateModalLayout from '@/components/AnimateModalLayout';
import Slider from '@/components/Slider';
import PlayerButtons from './PlayerButtons';
import ShowIcon from '@/components/svg/showIcon';
import { fileToBase64 } from '@/utils/picturemanipulation';
import { save_File } from '@/utils/functions';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useDimensions } from '@/hooks/useDimensions';

interface MusicPlayerProps {
  rateSet: number;
  songDuration: number;
  fadeTime: number;
  delayLength: number;
  startPos: number;
  music: string;
  onSongEnd: () => void;
  onSongPrev: () => void;
}
const dances = [
  ' ',
  'Argentine Tango',
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
  'West Coast Swing',
];
const MusicPlayer: React.FC<MusicPlayerProps> = ({
  rateSet,
  songDuration,
  fadeTime,
  delayLength,
  startPos,
  music,
  onSongEnd,
  onSongPrev,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(songDuration);
  const [value, setValue] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const windowSize = useDimensions();
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = music;
      audioRef.current.playbackRate = rateSet;
      audioRef.current.load();
      console.log('rate set:', rateSet);
      setLoaded(true);

      let timerInterval: any;
      timerInterval = setInterval(function () {
        playAudio();
        clearInterval(timerInterval);
        console.log('cleared timer');
      }, delayLength);
    }
  }, [music]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rateSet;
      console.log('rate set:', rateSet);
    }
  }, [rateSet]);

  useEffect(() => {
    if (
      timeRef.current!.innerText >= formatTime((songDuration - fadeTime) / 1000)
    ) {
      if (
        audioRef.current &&
        audioRef.current.volume - (1 / fadeTime) * 250 >= 0
      ) {
        audioRef.current.volume =
          audioRef.current.volume - (1 / fadeTime) * 250;
      }
      // console.log('Fade Time',timeRef.current!.innerText, audioRef.current!.volume- 1/fadeTime*250)
    }
    if (timeRef.current!.innerText >= formatTime(songDuration / 1000)) {
      stopAudio();
      if (audioRef.current) {
        audioRef.current.volume = 1;
      }
      onSongEnd();
    }
  }, [value]);
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
      setValue(0);
    }
  };

  const seekUpdate = (newValue: number) => {
    if (audioRef.current) {
      const seekTime = (newValue / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setValue(newValue);
    }
  };

  const updateTime = () => {
    if (audioRef.current) {
      const newValue = (audioRef.current.currentTime / duration) * 100;

      setValue(newValue);
    }
  };

  const handleEnded = () => {
    stopAudio();
    onSongEnd();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div>
        <audio
          ref={audioRef}
          onTimeUpdate={updateTime}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          onEnded={handleEnded}
        />
        <div className="flex justify-center space-x-4 mb-4">
          <PlayerButtons
            icon={'Previous'}
            color="#504deb"
            color2="#FFFFFF"
            size={windowSize.width! > 400 ? 50 : 45}
            onButtonPress={() => {
              onSongPrev();
              seekUpdate(0);
            }}
          />
          <PlayerButtons
            icon={'Backward'}
            color="#504deb"
            color2="#FFFFFF"
            size={windowSize.width! > 400 ? 50 : 45}
            onButtonPress={() => seekUpdate(Math.max(0, value - 10))}
          />
          <PlayerButtons
            icon={'Stop'}
            color="#504deb"
            color2="#FFFFFF"
            size={windowSize.width! > 400 ? 50 : 45}
            onButtonPress={() => {
              stopAudio();
            }}
          />

          <PlayerButtons
            icon={playing ? 'Pause' : 'Play'}
            color="#504deb"
            color2="#FFFFFF"
            size={windowSize.width! > 400 ? 50 : 45}
            onButtonPress={() => {
              if (playing) pauseAudio();
              else playAudio();
            }}
          />

          <PlayerButtons
            icon={'Forward'}
            color="#504deb"
            color2="#FFFFFF"
            size={windowSize.width! > 400 ? 50 : 45}
            onButtonPress={() => seekUpdate(Math.min(100, value + 10))}
          />
          <PlayerButtons
            icon={'Skip'}
            color="#504deb"
            color2="#FFFFFF"
            size={windowSize.width! > 400 ? 50 : 45}
            onButtonPress={() => {
              seekUpdate(100);
            }}
          />
        </div>
        <Slider
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(val) => {
            seekUpdate(val);
          }}
          thumbColor="#504deb"
        />

        <div className="flex justify-between mt-2">
          <div ref={timeRef}>{formatTime((value / 100) * duration)}</div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  duration: number;
  fadeTime: number;
  speed: number;
  delay1: number;
  onClose: () => void;
  onChangeRate: (rate: number) => void;
  onChangeDuration: (duration: number) => void;
  onChangeFade: (duration: number) => void;
  onChangeDelay: (duration: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  duration,
  fadeTime,
  speed,
  delay1,
  isOpen,
  onClose,
  onChangeRate,
  onChangeDuration,
  onChangeFade,
  onChangeDelay,
}) => {
  const [songLength, setSongLength] = useState(duration);
  const [rate, setRate] = useState(speed);
  const [delayLength, setDelayLength] = useState(delay1);
  const [fadeLength, setFadeLength] = useState(fadeTime);

  useEffect(() => {
    onChangeRate(rate);
  }, [rate]);

  useEffect(() => {
    onChangeDuration(songLength);
  }, [songLength]);
  useEffect(() => {
    onChangeDelay(delayLength);
  }, [delayLength]);
  useEffect(() => {
    onChangeFade(fadeLength);
  }, [fadeLength]);
  return (
    <AnimateModalLayout
      visibility={isOpen}
      onReturn={() => {
        onClose();
      }}
    >
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[450px] max-h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2">
          <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Song Length</label>
                <Slider
                  min={1000}
                  max={600000}
                  step={1000}
                  value={songLength}
                  onChange={(newValue) => setSongLength(newValue)}
                  thumbColor="#4a5568"
                />
                <span>{`${Math.floor(songLength / 60000)}m ${Math.floor(
                  (songLength % 60000) / 1000
                )}s`}</span>
              </div>
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
              </div>
              <div>
                <label className="block mb-2">Delay in seconds</label>
                <Slider
                  min={1000}
                  max={60000}
                  step={1000}
                  value={delayLength}
                  onChange={(newValue) => setDelayLength(newValue)}
                  thumbColor="#4a5568"
                />
                <span>{`${Math.floor(delayLength / 60000)}m ${Math.floor(
                  (delayLength % 60000) / 1000
                )}s`}</span>
              </div>
              <div>
                <label className="block mb-2">Fade out in seconds</label>
                <Slider
                  min={0}
                  max={60000}
                  step={1000}
                  value={fadeLength}
                  onChange={(newValue) => setFadeLength(newValue)}
                  thumbColor="#4a5568"
                />
                <span>{`${Math.floor(fadeLength / 60000)}m ${Math.floor(
                  (fadeLength % 60000) / 1000
                )}s`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
};
interface ChooseMusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChoice: (song: Song) => void;
}

const ChooseMusicModal: React.FC<ChooseMusicModalProps> = ({
  isOpen,
  onChoice,
  onClose,
}) => {
  const [songLink, setSongLink] = useState('');
  const [songTag, setSongTag] = useState('');

  return (
    <AnimateModalLayout
      visibility={isOpen}
      onReturn={() => {
        onClose();
      }}
    >
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[450px] max-h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2">
          <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold">Choose music from link or </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Link</label>
                <input
                  type="text"
                  value={songLink}
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={(e) => setSongLink(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2">Song name or tag</label>
                <input
                  type="text"
                  value={songTag}
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={(e) => setSongTag(e.target.value)}
                />
              </div>
              <button
                className="btnFancy"
                onClick={() => {
                  onChoice({ url: songLink, name: songTag, dance: '', id: '' });
                  onClose();
                }}
              >
                Choose
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
};
interface AddToDbModalProps {
  isOpen: boolean;
  song: Song | null;
  onClose: () => void;
  onChoice: (songs: Song[]) => void;
}
const DropPlace1: React.FC<{
  index: number;
  onStart: (index: number) => void;
  onDrop: (index: number) => void;
}> = ({ index, onStart, onDrop }) => {
  const [showDrop, setShowDrop] = useState(false);
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <div className={`w-full h-8`}>
      <p
        onDragOver={handleDrop}
        style={{ opacity: showDrop ? '1' : '0' }}
        onDragEnter={() => {
          setShowDrop(true);
          onStart(index);
        }}
        onDragLeave={() => setShowDrop(false)}
        onDrop={() => {
          setShowDrop(false);
          onDrop(index);
        }}
        className={`w-full h-full flex justify-center items-center border border-dashed border-gray-700 dark:border-gray-300 rounded-md text-gray-700 dark:text-gray-300`}
      >
        Drop here
      </p>
    </div>
  );
};
const AddToDbModal: React.FC<AddToDbModalProps> = ({
  isOpen,
  song,
  onChoice,
  onClose,
}) => {
  const [playlistName, setPlaylistName] = useState('musicDB.sdb');
  const [songDB, setSongDB] = useState<Song[]>([]);
  const [dance, setDance] = useState('');
  const [rate, setRate] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);

  const getClientY = (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent) => {
    return 'touches' in e ? e.touches[0].clientY : e.clientY;
  };

  const onDragStart = (e: React.TouchEvent | React.MouseEvent, index: number) => {
    setDragging(true);
    setDraggedIndex(index);
    setPlaceholderIndex(index);

    const clientY = getClientY(e);
    const listRect = listRef.current!.getBoundingClientRect();
    setGhostPosition({ x: listRect.left, y: clientY - 20 });

    if (ghostRef.current) {
      ghostRef.current.innerText = songDB[index].name;
    }
  };

  const onDragMove = (e: React.TouchEvent | React.MouseEvent | TouchEvent | MouseEvent) => {
    if (!dragging || draggedIndex === null || !listRef.current) return;

    const clientY = getClientY(e);
    const listRect = listRef.current.getBoundingClientRect();
    const y = clientY - listRect.top;
    const newIndex = Math.max(0, Math.min(Math.floor(y / 48), songDB.length - 1));

    setGhostPosition({ x: listRect.left, y: clientY - 20 });
    setPlaceholderIndex(newIndex);
  };

  const onDragEnd = () => {
    if (draggedIndex !== null && placeholderIndex !== null && draggedIndex !== placeholderIndex) {
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
  const handleFileAdd = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // name: file.name,
    if (file) {
      const reader = new FileReader();
      reader.onload = (function (file) {
        return async function () {
          let res = this.result?.toString();
          let resObj = JSON.parse(res !== undefined ? res : '');
          setPlaylistName(file.name);
          setSongDB(resObj);
        };
      })(file);
      reader.readAsText(file);
    }
  };
  useEffect(() => {
    if (songDB.length > 0) {
    }
  }, [songDB]);

  const handleSongAdd = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(await fileToBase64(file));
      const newSong: Song = {
        url: await fileToBase64(file),
        name: file.name,
        id: uuidv4(),
        dance: dance,
      };
      console.log(newSong);
      setSongDB([...songDB, newSong]);
    }
  };

  return (
    <AnimateModalLayout
      visibility={isOpen}
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
          className={`w-full h-full relative  p-1  ${draggedIndex!== null?'overflow-hidden':"overflow-y-auto"} border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center`}
        >
          <div
            id="containedDiv"
            className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
          >
            <h2 className="text-xl font-bold mb-4">Songs in Local playlist</h2>

            <div className={`w-full h-[350px] border border-black p-1 rounded-md ${draggedIndex!== null?'overflow-hidden':"overflow-x-auto"} mb-4 `}>
              <div className="flex flex-col flex-wrap items-center justify-start">
                <ul
                  ref={listRef}
                  className="w-full max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md  relative"
                >
                  {songDB.map((item, i) => (
                    <React.Fragment key={item.name}>
                      {i === placeholderIndex &&
                        draggedIndex !== null &&
                        draggedIndex !== i && (
                          <li className="h-12 bg-blue-100 border-2 border-blue-300 border-dashed"></li>
                        )}
                      <li
                        onMouseDown={(e) => onDragStart(e, i)}
                        onTouchStart={(e) => onDragStart(e, i)}
                        className={`px-4 flex items-center justify-between relative h-fit min-h-[2.5rem] border-b last:border-b-0 cursor-move hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
                          i === draggedIndex ? 'hidden' : ''
                        }`}
                      >
                        <p className=" text-center w-full">
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
                          className="absolute top-0 right-2 fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor  w-8 h-8"
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
                      left: `${ghostPosition.x}px`,
                      top: `${ghostPosition.y-50}px`,
                      width: listRef.current
                        ? `${listRef.current.offsetWidth - 32}px`
                        : 'auto',
                    }}
                  > 
                    <p className=" text-center max-w-[300px]">
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
            <div className="space-y-4 flex flex-row flex-wrap justify-center items-center w-full">
              <div className="flex flex-col justify-center items-center">
                <label className="block mb-2">What dance is it?</label>
                <select
                  value={dance}
                  onChange={(e) => setDance(e.target.value)}
                  className="w-20 h-9 bg-white rounded-lg border border-[#776548] text-[#444] text-left"
                >
                  {dances.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
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
                </div>
                <input
                  id="file-input3"
                  type="file"
                  accept="*.mdb"
                  onChange={handleFileAdd}
                  className="hidden"
                />
                <input
                  id="file-input2"
                  type="file"
                  accept="audio/*"
                  onChange={handleSongAdd}
                  className="hidden"
                />
              </div>

              <button
                className="btnFancy"
                onClick={() => {
                  document.getElementById('file-input3')?.click();
                }}
              >
                Use Existing Playlist
              </button>
              <button
                className="btnFancy"
                onClick={() => {
                  document.getElementById('file-input2')?.click();
                }}
              >
                Add song to Local Playlist
              </button>
              <div className=" flex flex-col items-center justify-center m-1.5">
                <PlayerButtons
                  icon={'Save'}
                  color="#504deb"
                  color2="#FFFFFF"
                  size={50}
                  onButtonPress={() => {
                    save_File(JSON.stringify([...songDB]), playlistName);
                  }}
                />
                {'Save Playlist'}
              </div>
              <div className=" flex flex-col items-center justify-center m-1">
                <PlayerButtons
                  icon={'AddPlayList'}
                  color="#504deb"
                  color2="#FFFFFF"
                  size={50}
                  onButtonPress={() => {
                    onChoice(songDB);
                  }}
                />
                {'Add to Current Playlist'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
};

interface Song {
  url: string;
  name: string;
  dance: string | null;
  id: string | null;
}

interface PlaylistManagerProps {
  playlist: Song[];
  currentSongIndex: number;
  isVisible: boolean;
  onSongChange: (index: number) => void;
  onAddSong: (song: Song) => void;
  onRemoveSong: (index: number) => void;
  onUpdate: (playlist: Song[]) => void;
  onReturn: () => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({
  playlist,
  currentSongIndex,
  isVisible,
  onSongChange,
  onAddSong,
  onUpdate,
  onRemoveSong,
  onReturn,
}) => {
  const [currentDragIndex, setCurrentDragIndex] = useState(-1);
  const DropPlace: React.FC<{ index: number }> = ({ index }) => {
    const [showDrop, setShowDrop] = useState(false);
    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <div className={`w-full h-8`}>
        <p
          onDragOver={handleDrop}
          style={{ opacity: showDrop ? '1' : '0' }}
          onDragEnter={() => setShowDrop(true)}
          onDragLeave={() => setShowDrop(false)}
          onDrop={() => {
            setShowDrop(false);
            console.log(
              'index start',
              currentDragIndex,
              'index dropped',
              index
            );
            let item1 = playlist[currentDragIndex];
            let newPlaylist = playlist;
            newPlaylist = newPlaylist.toSpliced(index, 0, item1);
            currentDragIndex < index
              ? newPlaylist.splice(currentDragIndex, 1)
              : newPlaylist.splice(currentDragIndex + 1, 1);
            onUpdate(newPlaylist);
          }}
          className={`w-full h-full flex justify-center items-center border border-dashed border-gray-700 dark:border-gray-300 rounded-md text-gray-700 dark:text-gray-300`}
        >
          Drop here
        </p>
      </div>
    );
  };
  return (
    <AnimateModalLayout visibility={isVisible} onReturn={() => onReturn()}>
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[450px] max-h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full max-w-md mx-auto mt-4">
          <h4 className="text-lg font-semibold mb-2">Playlist</h4>
          <ul className="space-y-2">
            <li className={`flex justify-between items-center p-2 rounded`}>
              <DropPlace index={0} />
            </li>
            {playlist.map((song, index) => (
              <li
                key={index}
                className={`flex flex-col justify-between items-center p-2 rounded `}
              >
                <div
                  draggable={true}
                  className={`flex flex-grow justify-between cursor-pointer  w-full  ${
                    index === currentSongIndex
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : ''
                  }`}
                  onDrag={() => {
                    setCurrentDragIndex(index);
                  }}
                >
                  <span onClick={() => onSongChange(index)}>
                    <span className="rounded-md text-white bg-[#504deb] m-1 p-1">
                      {song.dance}
                    </span>
                    {' ' + song.name}
                  </span>
                  <PlayerButtons
                    icon="Remove"
                    color="#504deb"
                    color2="#FFFFFF"
                    size={24}
                    onButtonPress={() => onRemoveSong(index)}
                  />
                </div>
                <DropPlace index={index + 1} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AnimateModalLayout>
  );
};

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [musicFile, setMusicFile] = useState({ url: '', name: '' });
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songLength, setSongLength] = useState(150000);
  const [delayLength, setDelayLength] = useState(0);
  const [fadeTime, setFadeTime] = useState(5000);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [rate, setRate] = useState(1);
  const [songPosition, setSongPosition] = useState(0);
  const [addToDBSong, setAddToDBSong] = useState<Song | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isChooseMusicOpen, setIsChooseMusicOpen] = useState(false);
  const [isAddToDBOpen, setIsAddToDBOpen] = useState(false);
  const [parties, setParties] = useState<{ name: string; id: string }[]>([]);
  const [choosenParty, setChoosenParty] = useState('');

  async function getPartyArray() {
    const q = await getDocs(collection(db, 'parties'));
    let arr1 = q.docs.map((doc) => doc.data());
    let arr2 = q.docs.map((doc) => doc.id);
    let arr = arr1.map((x, i) => ({ name: x.name, id: arr2[i] }));
    console.log(arr);
    setParties(arr);
    setChoosenParty(arr[0].id);
  }

  useEffect(() => {
    getPartyArray();
  }, []);

  const handleSongChange = (index: number) => {
    setCurrentSongIndex(index);
  };
  useEffect(() => {
    console.log(currentSongIndex, 'in useeffect');
    if (currentSongIndex >= 0 && playlist.length > 0) {
      console.log(playlist[currentSongIndex].dance);

      updateDoc(doc(db, 'parties', choosenParty), {
        message: playlist[currentSongIndex].dance,
      }).then((res) => console.log(res));
      updateDoc(doc(db, 'parties', choosenParty), {
        message2:
          'Next Dance: ' +
          playlist[
            currentSongIndex < playlist.length - 1 ? currentSongIndex + 1 : 0
          ].dance,
      }).then((res) => console.log(res));
    }
  }, [currentSongIndex]);
  const handleSongEnd = () => {
    if (currentSongIndex < playlist.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(0);
    }
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(await fileToBase64(file));

      const newSong: Song = {
        url: await fileToBase64(file),
        name: file.name,
        id: '',
        dance: '',
      };
      console.log(newSong);
      setPlaylist([...playlist, newSong]);
      if (playlist.length === 0) {
        setCurrentSongIndex(0);
      }
    }
  };

  const handleRemoveSong = (index: number) => {
    const newPlaylist = playlist.filter((_, i) => i !== index);
    setPlaylist(newPlaylist);
    if (index === currentSongIndex) {
      setCurrentSongIndex(0);
    } else if (index < currentSongIndex) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {isSettingsOpen && (
        <SettingsModal
          duration={songLength}
          speed={rate}
          delay1={delayLength}
          fadeTime={fadeTime}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onChangeRate={(rate) => {
            setRate(rate);
            console.log(`New rate: ${rate}`);
          }}
          onChangeDuration={(duration) => setSongLength(duration)}
          onChangeDelay={(duration) => setDelayLength(duration)}
          onChangeFade={(duration) => setFadeTime(duration)}
        />
      )}
      {isChooseMusicOpen && (
        <ChooseMusicModal
          isOpen={isChooseMusicOpen}
          onChoice={(song) => setPlaylist([...playlist, song])}
          onClose={() => setIsChooseMusicOpen(false)}
        />
      )}
      {isAddToDBOpen && (
        <AddToDbModal
          isOpen={isAddToDBOpen}
          song={addToDBSong}
          onChoice={(songs) => {
            setIsAddToDBOpen(false);
            setPlaylist([...playlist, ...songs]);
            if (playlist.length === 0) {
              setCurrentSongIndex(0);
            }
          }}
          onClose={() => setIsAddToDBOpen(false)}
        />
      )}
      {isPlaylistOpen && (
        <PlaylistManager
          playlist={playlist}
          currentSongIndex={currentSongIndex}
          onUpdate={(newPlaylist) => setPlaylist(newPlaylist)}
          isVisible={isPlaylistOpen}
          onSongChange={handleSongChange}
          onAddSong={(song) => setPlaylist([...playlist, song])}
          onRemoveSong={handleRemoveSong}
          onReturn={() => setIsPlaylistOpen(false)}
        />
      )}
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[450px] h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2 overflow-x-auto">
          {/* <div className="container mx-auto p-4"> */}
          <div className="   w-full h-fit p-2 flex flex-col justify-center items-center">
            <h3 className="w-full uppercase xs:text-md sm:text-xl phone:text-2xl tablet:text-3xl text-center">
              Music Player
            </h3>
            <div
              id="icon"
              className=" h-20 w-20 md:h-24 md:w-24 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto"
            >
              <ShowIcon icon={'Music'} stroke={'0.1'} />
            </div>
            {playlist.length > 0 && (
              <p className="text-center mb-4">
                Song Title: {playlist[currentSongIndex].name}
              </p>
            )}
            {playlist.length > 0 && currentSongIndex > -1 && (
              <MusicPlayer
                rateSet={rate}
                songDuration={songLength}
                fadeTime={fadeTime}
                delayLength={delayLength}
                startPos={songPosition}
                music={playlist[currentSongIndex].url}
                onSongEnd={handleSongEnd}
                onSongPrev={() => {
                  console.log('prev song', currentSongIndex - 1);
                  currentSongIndex - 1 > -1
                    ? setCurrentSongIndex(currentSongIndex - 1)
                    : 0;
                }}
              />
            )}
            <div className="mt-4 flex justify-start space-x-4">
              <div className=" flex flex-col items-center justify-center">
                <PlayerButtons
                  icon={'File'}
                  color="#504deb"
                  color2="#FFFFFF"
                  size={50}
                  onButtonPress={() => {
                    document.getElementById('file-input')?.click();
                  }}
                />
                {'Choose a song'}
              </div>
              <div className=" flex flex-col items-center justify-center">
                <PlayerButtons
                  icon={'AddToDb'}
                  color="#504deb"
                  color2="#FFFFFF"
                  size={50}
                  onButtonPress={() => {
                    setIsAddToDBOpen(true);
                  }}
                />
                {'Edit Playlists'}
              </div>
              <input
                id="file-input"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className=" flex flex-col items-center justify-center">
                <PlayerButtons
                  icon={'Settings'}
                  color="#504deb"
                  color2="#FFFFFF"
                  size={50}
                  onButtonPress={() => setIsSettingsOpen(true)}
                />
                {'Settings'}
              </div>
              <div className="flex flex-col items-center justify-center">
                <PlayerButtons
                  icon={'List'}
                  color="#504deb"
                  color2="#FFFFFF"
                  size={50}
                  onButtonPress={() => setIsPlaylistOpen(true)}
                />
                {'Playlist'}
              </div>
            </div>
            <select
              className="w-1/2 p-2 m-auto"
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
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
