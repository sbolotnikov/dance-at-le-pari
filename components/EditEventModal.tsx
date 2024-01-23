'use client';
import { useEffect, useState } from 'react';
import ShowIcon from './svg/showIcon';

import AnimateModalLayout from './AnimateModalLayout';

type Props = {
  visibility: boolean;
  onReturn: () => void;
};

export default function EditEventModal({
  visibility,
  onReturn,
}: Props) {
    // const [isVisible, setIsVisible] = useState(visibility);
    // useEffect(()=>{
    //  console.log(isVisible)
    // }, [])
    return (
      <AnimateModalLayout visibility={visibility} onReturn={()=>{onReturn(); }} >
       <div className="h-[82%] w-[85%] bg-darkMainColor flex flex-col justify-center items-center">
        <h2>Editing Event Modal </h2>
       </div> 
      </AnimateModalLayout>  
  );

}