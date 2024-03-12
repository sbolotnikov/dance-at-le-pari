'use client';
import { useEffect, useState } from 'react';


import AnimateModalLayout from './AnimateModalLayout';
import ImgFromDb from './ImgFromDb';
import { useSession } from 'next-auth/react';

type Props = {
  visibility: boolean;
  onReturn: ( ) => void;
};

export default function EditScheduleModal({ visibility, onReturn }: Props) {
  const [isVisible, setIsVisible] = useState(visibility);
  const { data: session } = useSession();
  const [images, setImages] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  useEffect(() => {
    console.log(isVisible);

  }, []);

  
  return (
    <AnimateModalLayout
      visibility={isVisible}
      onReturn={() => {
        setIsVisible(false);
        onReturn();
      }}
    >
      <div className="border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-5xl  flex justify-center items-center flex-col  h-[70svh] md:h-[85svh] md:w-full bg-lightMainBG dark:bg-darkMainBG backdrop-blur-md">
        <div className="w-full h-full relative  p-1 flex  overflow-y-scroll border border-lightMainColor dark:border-darkMainColor rounded-md">
          <div className=" flex flex-col w-full p-1 justify-center items-center absolute top-0 left-0">
            

          <h2 className="w-full text-center">Edit/ Add Schedule</h2>

            

            
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
}
