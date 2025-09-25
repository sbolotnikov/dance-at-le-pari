import Slider from '@/components/Slider';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import PlayerButtons from './PlayerButtons';
import { fileToBase64 } from '@/utils/picturemanipulation';

type Props = {
  visibility: boolean;
  audioBlob: string;
  introduction: string;
  fileName: string;
  currentDance: string | null;
  rateOrigin: number;
  onDance: (dance: string) => void;
  onSongChange: (songBlob: string) => void;
  onIntroductionChange: (introduction: string) => void;
  onNameChange: (name: string) => void;
  onRate: (rate: number) => void;
  onReturn: () => void;
};

const ListenSaveMp3Modal = ({
  visibility,
  audioBlob,
  introduction,
  fileName,
  currentDance,
  rateOrigin,
  onIntroductionChange,
  onDance,
  onSongChange,
  onNameChange,
  onRate,
  onReturn,
}: Props) => {
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioRef2 = useRef<HTMLAudioElement>(null);
  const [dance, setDance] = useState<string | null>(currentDance);
  const [rate, setRate] = useState(rateOrigin ? rateOrigin : 1);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioBlob;
      audioRef.current.playbackRate = 1;
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [audioBlob]);
  useEffect(() => {
    if (audioRef2.current) {
      audioRef2.current.src = introduction;
      audioRef2.current.load();
      audioRef2.current.play();
    }
  }, [introduction]);
  useEffect(() => {
    if (audioRef.current && rate !== undefined && rate !== null) {
      audioRef.current.playbackRate = rate;
    }
  }, [rate]);
  useEffect(() => {
    setDance(currentDance);
  }, [currentDance]);
  useEffect(() => {
    setRate(rateOrigin);
  }, [rateOrigin]);

  const handleFileSubmit = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const resText = await fileToBase64(file);
      console.log(resText);
      if (audioRef2.current) {
        audioRef2.current.src = resText;
        audioRef2.current.load();
        audioRef2.current.play();
      }
      onIntroductionChange(resText!);
    }
  };
  const handleFileSubmit0 = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    const fileName = event.target.files?.[0].name.split('.mp3')[0];
    onNameChange(fileName!);
    if (file) {
      const resText = await fileToBase64(file);
      if (audioRef.current) {
        audioRef.current.src = resText;
        audioRef.current.load();
        audioRef.current.play();
      }
      onSongChange(resText!);
    }
  };
  return (
    <AnimatePresence>
      {visibility && (
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
          <div className="m-auto  max-w-[600px] bg-lightMainBG dark:bg-darkMainBG border-2 border-solid border-gray-400 rounded-md w-[97%] p-2 flex flex-col content-evenly">
            <div
              id="wrapperDiv"
              className="w-full h-full border rounded-md border-lightMainColor dark:border-darkMainColor relative overflow-y-auto flex flex-col justify-center items-center"
            >
              <div
                id="containedDiv"
                className={` w-full p-1 flex flex-col justify-center items-center`}
              >
                <h2> Listen/Download Song</h2>
                <p>Song Name: {fileName}</p>
                <audio ref={audioRef} controls title={fileName} />

               <input
                  type="file"
                  hidden
                  id="inputField21"
                  accept="audio/*"
                  className="w-full mb-2 rounded-md text-gray-700"
                  onChange={handleFileSubmit0}
                />
                <PlayerButtons
                  icon="File"
                  color="#504deb"
                  color2="#FFFFFF"
                  size={32}
                  onButtonPress={() => {
                    document.getElementById('inputField21')!.click();
                  }}
                />


                <div className="flex flex-col justify-center items-center">
                  <label className="block mb-2">What dance is it?</label>
                  <select
                    value={dance!}
                    onChange={(e) => {
                      setDance(e.target.value);
                      onDance(e.target.value);
                    }}
                    className="w-20 h-9 bg-white rounded-lg border border-[#776548] text-[#444] text-left"
                  >
                    {dances.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Playback Speed</label>
                  <Slider
                    min={0.5}
                    max={2}
                    step={0.01}
                    value={rate}
                    onChange={(newValue) => {
                      setRate(newValue);
                      onRate(newValue);
                    }}
                    thumbColor="#4a5568"
                  />
                  <span>{`${(rate * 100).toFixed(0)}%`}</span>
                  <input
                    type="number"
                    className="mt-2 text-sm h-8 float-right rounded-md w-14 text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG border border-lightMainColor dark:border-darkMainColor"
                    min={0.5}
                    max={2}
                    value={rate}
                    onChange={(e) => {
                      setRate(e.target.valueAsNumber);
                      onRate(e.target.valueAsNumber);
                    }}
                  />
                </div>
                <audio
                  ref={audioRef2}
                  controls
                  title={'Intro for ' + fileName}
                />
                <input
                  type="file"
                  hidden
                  id="inputField22"
                  accept="audio/*"
                  className="w-full mb-2 rounded-md text-gray-700"
                  onChange={handleFileSubmit}
                />
                <PlayerButtons
                  icon="File"
                  color="#504deb"
                  color2="#FFFFFF"
                  size={32}
                  onButtonPress={() => {
                    document.getElementById('inputField22')!.click();
                  }}
                />
                <div className="flex justify-center items-center w-full h-16">
                  <button
                    className=" h-10 m-1 text-center  hover:scale-110 transition-all duration-150 ease-in-out"
                    onClick={(e) => {
                      onReturn();
                    }}
                  >
                    Close
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

export default ListenSaveMp3Modal;
