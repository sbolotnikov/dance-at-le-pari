'use client';
import React, { useState, useEffect, useRef, FC } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import AnimateModalLayout from '@/components/AnimateModalLayout';
import Slider from '@/components/Slider';
import PlayerButtons from './PlayerButtons';
import ShowIcon from '@/components/svg/showIcon';
import { fileToBase64 } from '@/utils/picturemanipulation';
import sleep, { save_File, speaking_Func } from '@/utils/functions';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useDimensions } from '@/hooks/useDimensions';
import { useSession } from 'next-auth/react';
import ListenSaveMp3Modal from './ListenSaveMp3Modal';
import ChooseExternalSongModal from './ChooseExternalSongModal';
import LoadingScreen from '@/components/LoadingScreen';
import ChoosePlaylistsModal from './ChoosePlaylistsModal';
import DraggableList from '@/components/DraggableList';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { generateIntroduction, speak } from './actions';
import { AudioFileWithSettings } from '@/types/screen-settings';
import { processAndStitchAudio } from './LocalActions';

interface MusicPlayerProps {
  rateSet: number;
  rate: number;
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
  'Chinese jitterbug',
  'Country Two Step',
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
  'Taiwan Tango',
  'Tango',
  'Two Step',
  'Viennese Waltz',
  'Waltz',
  'West Coast Swing',
];
const MusicPlayer: React.FC<MusicPlayerProps> = ({
  rateSet,
  rate,
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
      if (rateSet && rateSet > 0) audioRef.current.playbackRate = rate;
      console.log('rate set:', rate);
    }
  }, [rate]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = music;
      if (rateSet && rateSet > 0) audioRef.current.playbackRate = rateSet;
      audioRef.current.load();
      console.log('rateSet set:', rateSet);
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
          onLoadedMetadata={(e) => {
            console.log(e.target);
            setDuration(audioRef.current?.duration || 0);
          }}
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
    console.log(rate);
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
        sleep(1200).then(() => onClose());
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
                <input
                  type="number"
                  className="mt-2 text-sm h-8 w-14 float-right rounded-md text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG border border-lightMainColor dark:border-darkMainColor"
                  min={1}
                  max={600}
                  value={songLength / 1000}
                  onChange={(e) => {
                    setSongLength(e.target.valueAsNumber * 1000);
                  }}
                />
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
                <input
                  type="number"
                  className="mt-2 text-sm h-8 w-14 float-right rounded-md text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG border border-lightMainColor dark:border-darkMainColor"
                  min={1}
                  max={60}
                  value={delayLength / 1000}
                  onChange={(e) => {
                    setDelayLength(e.target.valueAsNumber * 1000);
                  }}
                />
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
                <input
                  type="number"
                  className="mt-2 text-sm h-8 w-14 float-right rounded-md text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG border border-lightMainColor dark:border-darkMainColor"
                  min={1}
                  max={60}
                  value={fadeLength / 1000}
                  onChange={(e) => {
                    setFadeLength(e.target.valueAsNumber * 1000);
                  }}
                />
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
                  onChoice({
                    url: songLink,
                    name: songTag,
                    rate: 1,
                    dance: '',
                    id: '',
                  });
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

function handleOnBeforeUnload(event: BeforeUnloadEvent) {
  event.preventDefault();
  return (event.returnValue = '');
}

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
  const [revealSaveModal, setRevealSaveModal] = useState(false);
  const [songToSave, setSongToSave] = useState('');
  const [songIntroduction, setSongIntroduction] = useState('');
  const [songName, setSongName] = useState('');
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentDance, setCurrentDance] = useState<string | null>(null);
  const [currentRate, setCurrentRate] = useState(1);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 });
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const topMargin = 12;
  const itemHeight = 40;

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
        rate,
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
        window.removeEventListener('beforeunload', handleOnBeforeUnload, {
          capture: true,
        });
        onClose();
      }}
    >
      <ListenSaveMp3Modal
        visibility={revealSaveModal}
        audioBlob={songToSave}
        introduction={songIntroduction}
        fileName={songName}
        rateOrigin={currentRate}
        currentDance={currentDance}
        onRate={(rate) => {
          let songArr = songDB;
          songArr[currentIndex].rate = rate;
          setSongDB(songArr);
        }}
        onSongChange={(songBlob) => {
          let songArr = songDB;
          songArr[currentIndex].url = songBlob;
          setSongDB(songArr);
        }}
        onNameChange={(name) => {
          let songArr = songDB;
          songArr[currentIndex].name = name;
          setSongDB(songArr);
          setSongName(name);
        }}
        onIntroductionChange={(intro) => {
          let songArr = songDB;
          songArr[currentIndex].introduction = intro;
          setSongDB(songArr);
        }}
        onDance={(dance) => {
          let songArr = songDB;
          songArr[currentIndex].dance = dance;
          setSongDB(songArr);
        }}
        onReturn={() => {
          sleep(1200).then(() => {
            setSongToSave('');
            setCurrentDance('');
            setCurrentRate(1);
            setRevealSaveModal(false);
          });
        }}
      />
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1170px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
        }`}
      >
        <div
          id="wrapperDiv"
          className={`w-full h-full relative  p-1  ${
            draggedIndex !== null ? 'overflow-hidden' : 'overflow-y-auto'
          } border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center`}
        >
          <div
            id="containedDiv"
            className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
          >
            <h2 className="text-xl font-bold mb-4">Songs in Local playlist</h2>

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
                        <div className="  h-8 w-8 m-1">
                          <PlayerButtons
                            icon="Play"
                            color="#504deb"
                            color2="#FFFFFF"
                            size={32}
                            onButtonPress={() => {
                              setSongToSave(item.url);
                              if (
                                item.introduction !== undefined &&
                                item.introduction !== ''
                              )
                                setSongIntroduction(item.introduction);
                              setSongName(item.name);
                              setCurrentIndex(i);
                              setCurrentDance(item.dance);
                              setCurrentRate(
                                item.rate !== null ? item.rate : 1
                              );
                              setRevealSaveModal(true);
                            }}
                          />
                        </div>
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
                <input
                  type="text"
                  placeholder="Enter dance"
                  value={dance}
                  onChange={(e) => setDance(e.target.value)}
                  className="w-full p-2 m-1 border border-gray-300 rounded mb-2"
                />
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
                  <input
                    type="number"
                    className="mt-2 text-sm h-8 rounded-md w-14 float-right text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG border border-lightMainColor dark:border-darkMainColor"
                    min={0.5}
                    max={2}
                    value={rate}
                    onChange={(e) => {
                      setRate(e.target.valueAsNumber);
                    }}
                  />
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
  rate: number | null;
  dance: string | null;
  id: string | null;
  introduction?: string;
}

interface PlaylistManagerProps {
  playlist: Song[];
  songLength: number;
  fadeTime: number;
  delayLength: number;
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
  songLength,
  fadeTime,
  delayLength,
  currentSongIndex,
  isVisible,
  onSongChange,
  onAddSong,
  onUpdate,
  onRemoveSong,
  onReturn,
}) => {
  const [dragging, setDragging] = useState(false);
  const [itemsList, setItemsList] = useState([] as string[]);
  useEffect(() => {
    if (playlist.length > 0) {
      setItemsList(
        playlist.map((item, index) => item.name || `Track ${index + 1}`)
      );
    }
  }, [playlist]);

  return (
    <AnimateModalLayout
      visibility={isVisible}
      onReturn={() => {
        window.removeEventListener('beforeunload', handleOnBeforeUnload, {
          capture: true,
        });
        onReturn();
      }}
    >
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[450px] max-h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full max-w-md mx-auto mt-4 relative">
          <div className="flex justify-between items-center w-full">
            <h4 className="text-lg font-semibold mb-2">Playlist</h4>
            <div className=" flex flex-col items-center justify-center m-1.5">
              <PlayerButtons
                icon={'Save'}
                color="#504deb"
                color2="#FFFFFF"
                size={50}
                onButtonPress={() => {
                  if (playlist.length === 0) {
                    alert('Playlist is empty');
                    return;
                  } else if (playlist.length < 47) {
                    save_File(JSON.stringify([...playlist]), 'musicDB.sdb');
                  } else {
                    let newPlaylist = playlist.slice(0, 47);
                    save_File(JSON.stringify([...newPlaylist]), 'musicDB.sdb');
                    save_File(
                      JSON.stringify([...playlist.slice(47)]),
                      'musicDB part 2.sdb'
                    );
                  }
                  console.log(playlist.map((item) => item.introduction));
                }}
              />
              {'Save Playlist'}
            </div>
          </div>

          <DraggableList
            initialItems={itemsList}
            onItemMove={(dragIndex, hoverIndex) => {
              // setItemsList(prev => {
              //   const newItems = [...prev];
              //   const draggedItem = newItems[dragIndex];

              //   // Remove the dragged item
              //   newItems.splice(dragIndex, 1);
              //   // Insert at the new position
              //   newItems.splice(hoverIndex, 0, draggedItem);

              //   return newItems;
              // });
              const newPlaylist = [...playlist];
              const itemToMove = newPlaylist[dragIndex];
              newPlaylist.splice(dragIndex, 1);
              newPlaylist.splice(hoverIndex, 0, itemToMove);
              onUpdate(newPlaylist);
            }}
            onDeleteItem={(index: number) => {
              // const newPlaylist = [...playlist];
              // newPlaylist.splice(index, 1);
              console.log('delete index: ', index);
              onRemoveSong(index);
            }}
            isTouching={(isTouching: boolean) => setDragging(isTouching)}
            currentIndex={currentSongIndex}
            onItemClick={(index: number) => onSongChange(index)}
            containerClassName={
              'h-[350px]  w-full border border-lightMainColor dark:border-darkMainColor p-1 rounded-lg my-1 overflow-hidden'
            }
            itemHeight={56}
            autoScrollSpeed={15}
          />
        </div>
      </div>
    </AnimateModalLayout>
  );
};

const page: React.FC = () => {
  const [musicFile, setMusicFile] = useState({ url: '', name: '' });
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [songLength, setSongLength] = useState(150000);
  const [delayLength, setDelayLength] = useState(1000);
  const [fadeTime, setFadeTime] = useState(5000);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [rate, setRate] = useState(1);
  const [songPosition, setSongPosition] = useState(0);
  const [addToDBSong, setAddToDBSong] = useState<Song | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [commentFrequency, setCommentFrequency] = useState(3);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isChooseMusicOpen, setIsChooseMusicOpen] = useState(false);
  const [isChooseSongWebModal, setIsChooseSongWebModal] = useState(false);
  const [autoPlayMode, setAutoPlayMode] = useState(false);
  const [autoPlayList, setAutoPlayList] = useState(false);
  const [isAddToDBOpen, setIsAddToDBOpen] = useState(false);
  const [autoDJMode, setAutoDJMode] = useState(false);
  const [parties, setParties] = useState<{ name: string; id: string }[]>([]);
  const [choosenParty, setChoosenParty] = useState('');
  const [isChoosePlaylistsModal, setIsChoosePlaylistsModal] = useState(false);
  const [playlists, setPlaylists] = useState<
    { name: string; id: string; listArray: string[] }[]
  >([]);
  const [choosenPlaylist, setChoosenPlaylist] = useState('');
  const [collectionsArray, setCollectionsArray] = useState<string[]>([]);
  const { data: session } = useSession();
  const [autoPlayDances, setAutoPlayDances] = useState<string[]>(['Waltz']);
  const [loading, setLoading] = useState(false);
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);
  const [progress, setProgress] = useState<number>(0);
  

  const loadAudioBufferFromUrl = async (
    url: string,
    audioContext: AudioContext
  ): Promise<AudioBuffer> => {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
  };
 
  const [webSongs, setWebSongs] = useState<
    {
      url: string;
      name: string;
      rate: number | null;
      dance: string | null;
      collectionName: string;
      id: string | null;
    }[]
  >([]);
  const [songsAll, setSongsAll] = useState<
    {
      url: string;
      name: string;
      rate: number | null;
      dance: string | null;
      collectionName: string;
      id: string | null;
    }[]
  >([]);
  const [webSongsAll, setWebSongsAll] = useState<
    {
      url: string;
      name: string;
      rate: number | null;
      dance: string | null;
      collectionName: string;
      id: string | null;
    }[]
  >([]);

  async function getPartyArray() {
    const q = await getDocs(collection(db, 'parties'));
    let arr1 = q.docs.map((doc) => doc.data());
    let arr2 = q.docs.map((doc) => doc.id);
    let arr = arr1.map((x, i) => ({ name: x.name, id: arr2[i] }));
    arr.sort((a, b) => a.name.localeCompare(b.name));
    arr = [{ name: 'None', id: '' }, ...arr];

    setParties(arr);
    setChoosenParty(arr[0].id);
  }
  async function getPlaylistsArray() {
    const q = await getDocs(collection(db, 'playlists'));
    let arr1 = q.docs.map((doc) => doc.data());

    let arr2 = q.docs.map((doc) => doc.id);
    let arr = arr1.map((x, i) => ({
      name: x.name,
      listArray: x.playlist,
      id: arr2[i],
    }));
    arr.sort((a, b) => a.name.localeCompare(b.name));
    arr = [{ name: 'New', id: '', listArray: [] }, ...arr];

    setPlaylists(arr);
    setChoosenPlaylist(arr[0].id);
  }
  async function getWebSongsArray() {
    const songsSnapshot = await getDocs(collection(db, 'songs'));
    const songsList = songsSnapshot.docs.map(
      (doc) =>
        ({ ...doc.data(), id: doc.id } as {
          url: string;
          name: string;
          rate: number | null;
          dance: string | null;
          collectionName: string;
          id: string | null;
        })
    );
    setSongsAll(songsList);
    let collectionArr = songsList.map((item) => item.collectionName);
    collectionArr = collectionArr.filter(
      (item, index) => collectionArr.indexOf(item) === index
    );
    setCollectionsArray(
      collectionArr.sort((a: string, b: string) => a.localeCompare(b))
    );
    console.log(collectionArr);
  }
  useEffect(() => {
    getPartyArray();
    getPlaylistsArray();
    getWebSongsArray();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      const selectElement = document.getElementById(
        'collectionSelect1'
      ) as HTMLSelectElement;
      const selectedValues = Array.from(selectElement.selectedOptions).map(
        (option) => option.value
      );
      const songsChoosenArr = songsAll.filter((item) =>
        selectedValues.includes(item.collectionName)
      );
      setWebSongsAll(songsChoosenArr);

      let songsArr = songsChoosenArr.filter(
        (song) => song.dance == autoPlayDances[autoPlayIndex]
      );
      setAutoPlayIndex(autoPlayIndex + 1);
      let randomIndex = Math.floor(Math.random() * songsArr.length);

      fetch(`/api/music2play?file_id=${songsArr[randomIndex].url}`).then(
        (response) =>
          response.json().then((data) => {
            setPlaylist([
              ...playlist,
              {
                url: data.fileUrl,
                name: songsArr[randomIndex].name,
                rate: songsArr[randomIndex].rate,
                dance: songsArr[randomIndex].dance,
                id: songsArr[randomIndex].id,
              },
            ]);
            setRate(
              songsArr[randomIndex].rate !== null
                ? songsArr[randomIndex].rate
                : 1
            );
            setWebSongs(
              songsChoosenArr.filter(
                (song) => song.id !== songsArr[randomIndex].id
              )
            );
            if (choosenParty != '') {
              console.log(
                `Next Dance: ${
                  autoPlayIndex == autoPlayDances.length - 1
                    ? autoPlayDances[0]
                    : autoPlayDances[autoPlayIndex + 1]
                }`
              );
              updateDoc(doc(db, 'parties', choosenParty), {
                message: autoPlayDances[0],
                message2: `Next Dance: ${autoPlayDances[1]}`,
              }).then((res) => console.log(res));
            }
          })
      );
    };
    if (autoPlayMode) {
      fetchSongs();
    }
  }, [autoPlayMode]);
  useEffect(() => {
    if (autoPlayList) {
      const fetchSongsAll = async () => {
        const selectElement = document.getElementById(
          'collectionSelect1'
        ) as HTMLSelectElement;
        const selectedValues = Array.from(selectElement.selectedOptions).map(
          (option) => option.value
        );
        let songsChoosenArr = songsAll.filter((item) =>
          selectedValues.includes(item.collectionName)
        );
        let playlist1: Song[] = [];

        for (
          let autoPlayIndex1 = 0;
          autoPlayIndex1 < autoPlayDances.length;
          autoPlayIndex1++
        ) {
          let songsArr = songsChoosenArr.filter(
            (song) => song.dance == autoPlayDances[autoPlayIndex1]
          );
          if (songsArr.length === 0) {
            continue;
          }
          let randomIndex = Math.floor(Math.random() * songsArr.length);

          const response = await fetch(
            `/api/music2play?file_id=${songsArr[randomIndex].url}`
          );
          const data = await response.json();

          playlist1 = [
            ...playlist1,
            {
              url: data.fileUrl,
              name: songsArr[randomIndex].name,
              rate: songsArr[randomIndex].rate,
              dance: songsArr[randomIndex].dance,
              id: songsArr[randomIndex].id,
            },
          ];
          songsChoosenArr = songsChoosenArr.filter(
            (song) => song.id !== songsArr[randomIndex].id
          );
          setPlaylist(playlist1);
        }
      };
      fetchSongsAll();
      setAutoPlayList(false);
    }
  }, [autoPlayList, songsAll, autoPlayDances, parties, choosenParty]);

  async function playText(text: string, index?: number) {
    if (text.trim() === '') return;
    const base64Audio = await speak(text);
    const byteCharacters = atob(base64Audio);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const audioBlob = new Blob([byteArray], { type: 'audio/mpeg' });
    const audioUrl = await fileToBase64(audioBlob);

    let playlist1 = [...playlist];
    if (index !== undefined) {
      playlist1[index].introduction = audioUrl;
      setPlaylist(playlist1);
      if (index === playlist.length - 1) {
        // Last introduction
        setLoading(false);
        alert('All introductions added to the playlist');
      }
    }
  }

  const handleSongChange = (index: number) => {
    setCurrentSongIndex(index);
    setRate(playlist[index].rate !== null ? playlist[index].rate : 1);
  };
  useEffect(() => {
    console.log(currentSongIndex, 'in useeffect', playlist);
    if (currentSongIndex >= 0 && playlist.length > 0 && choosenParty != '') {
      console.log(playlist[currentSongIndex].dance);
      setRate(
        playlist[currentSongIndex].rate !== null
          ? playlist[currentSongIndex].rate
          : 1
      );

      updateDoc(doc(db, 'parties', choosenParty), {
        message: playlist[currentSongIndex].dance,
        message2:
          'Next Dance: ' +
          playlist[
            currentSongIndex < playlist.length - 1 ? currentSongIndex + 1 : 0
          ].dance,
      }).then((res) => console.log(res));
    }
  }, [currentSongIndex]);
  const handleSongEnd = () => {
    if (autoPlayMode) {
      let songsArr = webSongs.filter(
        (song) => song.dance == autoPlayDances[autoPlayIndex]
      );
      if (songsArr.length == 0) {
        songsArr = webSongsAll.filter(
          (song) => song.dance == autoPlayDances[autoPlayIndex]
        );
      }
      autoPlayIndex == autoPlayDances.length - 1
        ? setAutoPlayIndex(0)
        : setAutoPlayIndex(autoPlayIndex + 1);
      let randomIndex = Math.floor(Math.random() * songsArr.length);

      fetch(`/api/music2play?file_id=${songsArr[randomIndex].url}`).then(
        (response) =>
          response.json().then((data) => {
            setPlaylist([
              {
                url: data.fileUrl,
                name: songsArr[randomIndex].name,
                rate: songsArr[randomIndex].rate,
                dance: songsArr[randomIndex].dance,
                id: songsArr[randomIndex].id,
              },
            ]);
            setRate(
              songsArr[randomIndex].rate !== null
                ? songsArr[randomIndex].rate
                : 1
            );
            if (
              webSongs.filter(
                (song) => song.dance == autoPlayDances[autoPlayIndex]
              ).length == 0
            ) {
              setWebSongs([
                ...webSongsAll.filter(
                  (song) =>
                    song.dance == autoPlayDances[autoPlayIndex] &&
                    song.id !== songsArr[randomIndex].id
                ),
                ...webSongs,
              ]);
            }
            setWebSongs(
              webSongs.filter((song) => song.id !== songsArr[randomIndex].id)
            );
            if (choosenParty != '') {
              updateDoc(doc(db, 'parties', choosenParty), {
                message: autoPlayDances[autoPlayIndex],
                message2: `Next Dance: ${
                  autoPlayIndex == autoPlayDances.length - 1
                    ? autoPlayDances[0]
                    : autoPlayDances[autoPlayIndex + 1]
                }`,
              }).then((res) => console.log(res));
            }
            sleep(1200).then(() => {
              setRate(
                songsArr[randomIndex].rate !== null
                  ? songsArr[randomIndex].rate + 0.0001
                  : 1
              );
            });
          })
      );
    } else {
      if (currentSongIndex < playlist.length - 1) {
        setRate(playlist[currentSongIndex + 1].rate ?? 1);
        sleep(1200).then(() => {
          setRate(
            playlist[currentSongIndex + 1].rate !== null
              ? playlist[currentSongIndex + 1].rate! + 0.0001
              : 1
          );
        });

        if (
          playlist[currentSongIndex + 1].introduction !== undefined &&
          playlist[currentSongIndex + 1].introduction?.trim() !== '' &&
          autoDJMode
        ) {
          const introMessage = playlist[currentSongIndex + 1].introduction!;
          if (choosenParty != '') {
            updateDoc(doc(db, 'parties', choosenParty), {
              message: 'DJ Lepari Message',
              message2: ``,
            }).then((res) => console.log(res));
          }

          const audio = new Audio(introMessage);
          audio.play();
          audio.onended = () => {
            setCurrentSongIndex(currentSongIndex + 1);
          };
        } else setCurrentSongIndex(currentSongIndex + 1);
      } else {
        setRate(playlist[0].rate ?? 1);
        sleep(1200).then(() => {
          setRate(playlist[0].rate !== null ? playlist[0].rate! + 0.0001 : 1);
        });

        if (
          playlist[0].introduction !== undefined &&
          playlist[0].introduction?.trim() !== ''
        ) {
          const introMessage = playlist[0].introduction!;

          if (choosenParty != '') {
            updateDoc(doc(db, 'parties', choosenParty), {
              message: 'DJ Lepari Message',
              message2: ``,
            }).then((res) => console.log(res));
          }

          const audio = new Audio(introMessage);
          audio.play();
          audio.onended = () => {
            setCurrentSongIndex(0);
          };
        } else setCurrentSongIndex(0);
      }
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
        rate: 1,
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
      {isChoosePlaylistsModal && (
        <ChoosePlaylistsModal
          vis={isChoosePlaylistsModal}
          role={session?.user.role}
          choosenPlaylist={
            playlists.filter((playlist) => playlist.id == choosenPlaylist)[0]
          }
          onClose={() => sleep(1200).then(() => setIsChoosePlaylistsModal(false))}
          onLoad={(a) => setLoading(a)}
        />
      )}
      {isChooseSongWebModal && (
        <ChooseExternalSongModal
          savedDances={dances}
          vis={isChooseSongWebModal}
          role={session?.user.role}
          collectionsArray={collectionsArray}
          songs={songsAll.map(({ rate, ...rest }) => ({
            ...rest,
            rate: rate === null ? undefined : rate,
          }))}
          onClose={() => setIsChooseSongWebModal(false)}
          onPlay={(song) => {
            setPlaylist([
              ...playlist,
              {
                ...song,
                rate: song.rate === undefined ? null : song.rate,
              },
            ]);
          }}
          onReturn={(songs) => {
            console.log(songs);
          }}
          onLoad={(a) => setLoading(a)}
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
          onClose={() => sleep(1200).then(() => setIsAddToDBOpen(false))}
        />
      )}
      {isPlaylistOpen && (
        <PlaylistManager
          playlist={playlist}
          songLength={songLength}
          fadeTime={fadeTime}
          delayLength={delayLength}
          currentSongIndex={currentSongIndex}
          onUpdate={(newPlaylist) => {
            console.log(newPlaylist);
            setPlaylist([...newPlaylist]);
          }}
          isVisible={isPlaylistOpen}
          onSongChange={handleSongChange}
          onAddSong={(song) => setPlaylist([...playlist, song])}
          onRemoveSong={handleRemoveSong}
          onReturn={() => sleep(1200).then(() => setIsPlaylistOpen(false))}
        />
      )}
      {loading && <LoadingScreen />}
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[95%] max-w-[450px] h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2 overflow-x-auto">
          {/* <div className="container mx-auto p-4"> */}
          <div className="   w-full h-fit p-2 flex flex-col justify-center items-center">
            <h3
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
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
                rateSet={
                  playlist[currentSongIndex].rate !== null
                    ? playlist[currentSongIndex].rate
                    : 1
                }
                rate={rate}
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
            <div className="mt-4 flex justify-between">
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
                <span className="text-center">Choose a song</span>
              </div>
              <div className=" flex flex-col items-center justify-center">
                <PlayerButtons
                  icon={'File'}
                  color="#504deb"
                  color2="#FFFFFF"
                  size={50}
                  onButtonPress={() => {
                    setIsChooseSongWebModal(true);
                  }}
                />
                <span className="text-center">Choose webSong</span>
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
                <span className="text-center">Edit Playlists</span>
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
                <span className="text-center">Settings Dashboard</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <PlayerButtons
                  icon={'List'}
                  color="#504deb"
                  color2="#FFFFFF"
                  size={50}
                  onButtonPress={() => setIsPlaylistOpen(true)}
                />
                <span className="text-center">Show Playlist</span>
              </div>
            </div>
            {session?.user.role == 'Admin' && (
              <select
                className="w-full p-2 border border-gray-300 rounded mb-2"
                multiple
                id="collectionSelect1"
                onChange={(e) => {
                  e.preventDefault();
                  const selectElement = document.getElementById(
                    'collectionSelect1'
                  ) as HTMLSelectElement;
                  const selectedValues = Array.from(
                    selectElement.selectedOptions
                  ).map((option) => option.value);
                  setWebSongsAll(
                    songsAll.filter((item) =>
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
            {session?.user.role == 'Admin' && (
              <select
                className="w-1/2 p-2 mx-auto mt-2 bg-lightMainBG dark:bg-darkMainBG text-lightMainColor dark:text-darkMainColor border border-lightMainColor dark:border-darkMainColor rounded-md"
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
            )}
            {session?.user.role == 'Admin' && (
              <div className="flex justify-center items-center">
                <div className="flex flex-col items-center justify-center mx-2">
                  <PlayerButtons
                    icon={'Auto'}
                    color="#504deb"
                    color2="#FFFFFF"
                    size={50}
                    onButtonPress={() => setAutoPlayMode(true)}
                  />
                  <span className="text-center">Autoplay Mode</span>
                </div>
                <div className="flex flex-col items-center justify-center mx-2">
                  <PlayerButtons
                    icon={'CreatePlaylist'}
                    color="#504deb"
                    color2="#FFFFFF"
                    size={50}
                    onButtonPress={() => setAutoPlayList(true)}
                  />
                  <span className="text-center">Make Playlist</span>
                </div>
                  <div className=" flex flex-col items-center justify-center m-1.5">
                    <PlayerButtons
                      icon={'Save'}
                      color="#504deb"
                      color2="#FFFFFF"
                      size={50}
                      onButtonPress={async () => {
                        if (playlist.length === 0) {
                          alert('Playlist is empty');
                          return;
                        } else {
                          const audioContext = new AudioContext();
                          const result: AudioFileWithSettings[] =
                            await Promise.all(
                              playlist.map(async (item, index) => {
                                const buffer = await loadAudioBufferFromUrl(
                                  item.url,
                                  audioContext
                                );
                                return {
                                  id: `track-${index}`,
                                  name: `Track ${index + 1}`,
                                  duration: buffer.duration,
                                  audioBuffer: buffer,
                                  speed: item.rate !== null ? item.rate : 1,
                                };
                              })
                            );

                          processAndStitchAudio(
                            result,
                            songLength / 1000,
                            fadeTime / 1000,
                            delayLength / 1000,
                            (progress) => {
                              setProgress(progress);
                              // console.log(`Progress: ${progress.toFixed(2)}%`);
                            }
                          ).then((downloadUrl) => {
                            setProgress(0);
                            const a = document.createElement('a');
                            a.href = downloadUrl;
                            a.download = 'stitched_playlist.mp3';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          });
                        }
                      }}
                    />
                    {'Save as MP3s'}
                  </div>
                <div className="flex flex-col items-center justify-center mx-2">
                  <PlayerButtons
                    icon={'DigitalDJ'}
                    color="#504deb"
                    color2="#FFFFFF"
                    size={50}
                    onButtonPress={() => {
                      if (playlist.length > 0) {
                        setLoading(true);
                        generateIntroduction(
                          playlist.map((song, index) => ({
                            dance:
                              index % commentFrequency === 0 ||
                              index == playlist.length - 1
                                ? song.dance!
                                : '',
                            name:
                              index % commentFrequency === 0 ||
                              index == playlist.length - 1
                                ? song.name
                                : '',
                          })),
                          parties.find((p) => p.id === choosenParty)?.name ||
                            null
                        )
                          .then(async (res) => {
                            // let playlist1 = [...playlist];
                            for (let i = 0; i < res.length; i++) {
                              await playText(res[i], i);
                            }
                            // res.forEach(async (intro, index) => {
                            //   await playText(intro, index);
                            // });
                            const textIntros = res.map(
                              (intro, index) => `${index + 1}. ${intro}`
                            );

                            console.log('Introductions generated:', textIntros);
                          })
                          .catch((error) => {
                            setLoading(false);
                            console.error(
                              'Error generating introductions:',
                              error
                            );
                          });
                      }
                    }}
                  />
                  <span className="text-center">Add Digital DJ</span>
                </div>
              </div>
            )}
            {session?.user.role == 'Admin' && (
              <div className="w-full flex flex-row justify-between items-center mt-2">
                <div className="flex flex-col items-center justify-center mx-2">
                  <input
                    type="checkbox"
                    className="p-2 border border-lightMainColor dark:border-darkMainColor rounded-md"
                    checked={autoDJMode}
                    onChange={(e) => {
                      setAutoDJMode(!autoDJMode);
                    }}
                  />
                  <span className="text-center w-20">Use DJ comments</span>
                </div>

                <span className="min-w-fit">DJ comment every</span>
                <input
                  type="number"
                  className="w-16 p-1 border border-lightMainColor dark:border-darkMainColor rounded-md text-center"
                  placeholder="5"
                  min={1}
                  max={10}
                  value={commentFrequency}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val) || val < 1) val = 1;
                    if (val > 10) val = 10;
                    setCommentFrequency(val);
                  }}
                />
                <span className="text-center">song</span>
              </div>
            )}
            {session?.user.role == 'Admin' && (
              <div className="w-full flex flex-row justify-start items-center">
                <span className="min-w-fit">Auto Playlist Dances</span>
                <select
                  className="w-1/3 p-2 mx-auto mt-2 bg-lightMainBG dark:bg-darkMainBG text-lightMainColor dark:text-darkMainColor border border-lightMainColor dark:border-darkMainColor rounded-md"
                  onChange={(e) => {
                    setChoosenPlaylist(e.target.value);
                    setAutoPlayDances(
                      playlists.filter((item) => item.id == e.target.value)[0]
                        .listArray
                    );
                  }}
                >
                  {playlists.map((party, index) => {
                    return (
                      <option key={index} value={party.id}>
                        {party.name}
                      </option>
                    );
                  })}
                </select>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('clicked on button');
                    setIsChoosePlaylistsModal(true);
                  }}
                  className=" fill-editcolor  stroke-editcolor  rounded-md border-editcolor  w-8 h-8"
                >
                  <ShowIcon icon={'Edit'} stroke={'0.5'} />
                </button>
              </div>
              // )}
            )}
            {progress > 0 && (
              <div className="mt-6 max-w-md mx-auto">
                <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300 ease-linear"
                    style={{ width: `${progress}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {Math.round(progress)}%
                  </span>
                </div>
                <p className="text-center text-sm text-gray-400 mt-2">
                  Encoding your masterpiece...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
