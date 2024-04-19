'use client';
import { useContext, useState } from 'react';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import { SettingsContext } from '@/hooks/useSettings';
import MyDropdown from './MyDropdown';
type Props = {
 onDanceClick(dance: string, videolink:string): void;
}
function DanceDetails({onDanceClick}:Props) {
  const { dances } = useContext(SettingsContext) as ScreenSettingsContextType;
  const [danceChoice, setDanceChoice] = useState(dances[0]);

  return (
    <div className="w-full flex flex-col justify-center items-center ">
      
      <MyDropdown
        dances={dances.map((dance) => dance.name)}
        onChoice={(choice: number) => {
          setDanceChoice(dances[choice]);
          console.log('choice:', choice, dances[choice]);
        }}
      />
      <h1 className="relative text-7xl  font-DancingScript text-red-600">
        {danceChoice.name}
      </h1>
      <div className=" md:h-[30vw] md:w-[40vw] h-[60vw] w-[80vw] relative flex justify-center items-center m-2">
        <img
          className="absolute hover:grayscale hover:scale-105 cursor-pointer"
          src={  `https://i3.ytimg.com/vi/${danceChoice.videoLink}/hqdefault.jpg`}
          alt="video thumb nail"
          
          onClick={(e) => { onDanceClick(danceChoice.name, danceChoice.videoLink); }}
        />
      </div>

      <p className="text-lg font-[GoudyBookletter] m-2">{danceChoice.short}</p>
      <p
        className="px-1 py-2 text-sm font-[SegoePrint] text-red-600 border-2 border-solid border-transparent rounded-sm w-full m-1 text-center flex flex-col justify-center items-center overflow-auto PlayenSans]"
        dangerouslySetInnerHTML={{ __html: danceChoice.poem }}
      />
    </div>
  );
}

export default DanceDetails;
