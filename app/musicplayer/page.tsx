'use client';
import React, { useState, useEffect, useRef } from 'react';

import {
  PlayCircle,
  PauseCircle,
  StopCircle,
  SkipBack,
  SkipForward,
  Settings,
  FileAudio,
} from 'lucide-react';
import { PageWrapper } from '@/components/page-wrapper';
import AnimateModalLayout from '@/components/AnimateModalLayout';
import Slider from '@/components/Slider';
import PlayerButtons from './PlayerButtons';

interface MusicPlayerProps {
  rateSet: number;
  songDuration: number;
  startPos: number;
  music: string;
  onSongEnd: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  rateSet,
  songDuration,
  startPos,
  music,
  onSongEnd,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(songDuration);
  const [value, setValue] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = music;
      audioRef.current.playbackRate = rateSet;
      audioRef.current.load();
      console.log('rate set:', rateSet);
      setLoaded(true);
    }
  }, [music]);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rateSet;
      console.log('rate set:', rateSet);
    }
  }, [rateSet]);

  useEffect(() => {
    console.log(timeRef.current!.innerText, formatTime(songDuration / 1000));
    if (timeRef.current!.innerText >= formatTime(songDuration / 1000)) {
      stopAudio();
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
      <h2 className="text-2xl font-bold text-center">Music Player</h2>
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
            size={50}
            onButtonPress={() => {}}
          />
          <PlayerButtons
            icon={'Backward'}
            color="#504deb"
            color2="#FFFFFF"
            size={50}
            onButtonPress={() => seekUpdate(Math.max(0, value - 10))}
          />
          <PlayerButtons
            icon={'Stop'}
            color="#504deb"
            color2="#FFFFFF"
            size={50}
            onButtonPress={() => {
              stopAudio();
            }}
          />

          <PlayerButtons
            icon={playing ? 'Pause' : 'Play'}
            color="#504deb"
            color2="#FFFFFF"
            size={50}
            onButtonPress={() => {
              if (playing) pauseAudio();
              else playAudio();
            }}
          />
 
          <PlayerButtons
            icon={'Forward'}
            color="#504deb"
            color2="#FFFFFF"
            size={50}
            onButtonPress={() => seekUpdate(Math.min(100, value + 10))}
          />
          <PlayerButtons
            icon={'Skip'}
            color="#504deb"
            color2="#FFFFFF"
            size={50}
            onButtonPress={() => {}}
          />
        </div>
        <Slider
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={setValue}
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
  speed: number;
  onClose: () => void;
  onChangeRate: (rate: number) => void;
  onChangeDuration: (duration: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  duration,
  speed,
  isOpen,
  onClose,
  onChangeRate,
  onChangeDuration,
}) => {
  const [songLength, setSongLength] = useState(duration);
  const [rate, setRate] = useState(speed);

  useEffect(() => {
    onChangeRate(rate);
  }, [rate]);

  useEffect(() => {
    onChangeDuration(songLength);
  }, [songLength]);

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
            </div>
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
};

type Props = {};

const page = (props: Props) => {
  const [musicFile, setMusicFile] = useState({ url: '', name: '' });
  const [songLength, setSongLength] = useState(180000);
  const [rate, setRate] = useState(1);
  const [songPosition, setSongPosition] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMusicFile({
        url: URL.createObjectURL(file),
        name: file.name,
      });
    }
  };
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {isSettingsOpen && (
        <SettingsModal
          duration={songLength}
          speed={rate}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onChangeRate={(rate) => {
            setRate(rate);
            console.log(`New rate: ${rate}`);
          }}
          onChangeDuration={(duration) => setSongLength(duration)}
        />
      )}
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[450px] max-h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2">
          <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">
              Music Player
            </h1>
            <p className="text-center mb-4">Song Title: {musicFile.name}</p>
            <MusicPlayer
              rateSet={rate}
              songDuration={songLength}
              startPos={songPosition}
              music={musicFile.url}
              onSongEnd={() => console.log('End of song')}
            />
            <div className="mt-4 flex justify-center space-x-4">
            <div className=" flex flex-col items-center justify-center"> 
              <PlayerButtons
            icon={'File'}
            color="#504deb"
            color2="#FFFFFF"
            size={50}
            onButtonPress={() => document.getElementById('file-input')?.click()}
          />
          {'Choose a song'}
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
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
