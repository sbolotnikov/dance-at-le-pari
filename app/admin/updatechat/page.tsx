'use client';
import { FC, useContext, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';

import ShowIcon from '@/components/svg/showIcon';
import { SettingsContext } from '@/hooks/useSettings';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import { useDimensions } from '@/hooks/useDimensions';
import { updateRAG } from '@/utils/makechain';
import LoadingScreen from '@/components/LoadingScreen';
 

interface pageProps {}
 

const page: FC<pageProps> = ({}) => {
  const { darkMode } = useContext(SettingsContext) as ScreenSettingsContextType; 
  const dimensions = useDimensions();
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => {
    const r = document.querySelector(':root') as HTMLElement;
    const pr = r.style.getPropertyValue('--accent-color');
    console.log('darkMode:', darkMode, pr);
    if (darkMode) r.style.setProperty('--accent-color', '#93c5fd;');
    else r.style.setProperty('--accent-color', '#504deb;');
  }, [darkMode]);

  useEffect(() => {
    // GET request
    
  }, []);
  const handleChange =async (e: React.ChangeEvent<HTMLInputElement>)=> {
    e.preventDefault();
    setLoading(true);
    let file1 = e.currentTarget.files![0];

    const reader = new FileReader();
    reader.onload = (function (file) {
      return async function () {
        let resText = this.result?.toString();
        console.log(resText);
        await updateRAG(resText!);
        setLoading(false);
        setShowMessage(true);
      };
    })(file1);
    reader.readAsText(file1); 
}

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      {loading ? <LoadingScreen /> :
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95%] md:h-[85svh] max-w-[1400px] md:w-full flex justify-center items-center flex-col bg-lightMainBG dark:bg-darkMainBG h-[70svh]
      }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className=" w-full h-full flex flex-col justify-center items-center"
          >
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Update Chatbot
            </h2>
            <div className=" h-20 w-20 md:h-28 md:w-28 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor">
              <ShowIcon icon={'ChatbotSmall'} stroke={'0.05'} />
            </div>
            <input type="file" hidden id="inputField" accept="text/*" className="w-full mb-2 rounded-md text-gray-700" 
        onChange={handleChange}/>
            <button
              className={`btnFancy dark:text-[#93c5fd] dark:border-blue-300 dark:hover:text-white`}
              onClick={async (e) => {
                e.preventDefault();
                document.getElementById("inputField")!.click()
              }}
            >
              Upload RAG file
            </button> 
            {showMessage && <div className="w-full text-green-600 text-center text-2xl">Update completed!</div>}
          </div>
        </div>
      </div>}
    </PageWrapper>
  );
};

export default page;