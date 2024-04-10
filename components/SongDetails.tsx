'use client';
import { useContext, useState } from 'react';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import { SettingsContext } from '@/hooks/useSettings';
import MyDropdown from './MyDropdown';
type Props = {
 onDanceClick(dance: string, videolink:string): void;
}
function SongDetails({onDanceClick}:Props) {
    const { dances } = useContext(SettingsContext) as ScreenSettingsContextType;
    const [songChoice, setSongChoice] = useState(dances[0]);

  return (
    <div className="w-full flex flex-col justify-center items-center ">
      <MyDropdown
        dances={dances.map((dance) => dance.name)}
        onChoice={(choice: number) => {
          setSongChoice(dances[choice]);
          console.log('choice:', choice, dances[choice]);
        }}
      />
      <h1 className=' text-7xl font-[Birthstone] text-red-600'>{songChoice.name}</h1>

      {songChoice &&
        songChoice.songs.map((item, index) => {
          return (
            <div
              key={'opt_song_' + index}
              className="w-64 flex flex-row justify-between items-center m-auto"
            >
              <h5 className="w-48 my-auto">{item.title}</h5>
              <div className=" landscape:h-12 landscape:w-12 portrait:h-10 portrait:w-10 relative flex justify-center items-end m-2">
              <img
          className="absolute hover:grayscale hover:scale-105 cursor-pointer"
          src={  `https://i3.ytimg.com/vi/${item.link}/hqdefault.jpg`}
          alt="video thumb nail"
          
          onClick={(e) => { onDanceClick(item.title, item.link); }}
        />
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default SongDetails;
