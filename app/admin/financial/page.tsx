'use client';
import { FC, useContext, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { SettingsContext } from '@/hooks/useSettings';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import { useDimensions } from '@/hooks/useDimensions';
import LoadingScreen from '@/components/LoadingScreen';
import FinancialTabs from './components/FinancialTabs';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { darkMode } = useContext(SettingsContext) as ScreenSettingsContextType;
  const windowSize = useDimensions();
  const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const r = document.querySelector(':root') as HTMLElement;
//     if (darkMode) {
//       r.style.setProperty('--accent-color', '#93c5fd');
//     } else {
//       r.style.setProperty('--accent-color', '#504deb');
//     }
//   }, [darkMode]);
 useEffect(() => {
    windowSize.width! > 768 && windowSize.height! > 768
      ? (document.getElementById('icon')!.style.display = 'block')
      : (document.getElementById('icon')!.style.display = 'none');
  }, [windowSize.height]);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95%] md:h-[85svh] max-w-[1400px] md:w-full flex justify-center items-center flex-col bg-lightMainBG dark:bg-darkMainBG h-[70svh]
      }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative p-1 border border-lightMainColor dark:border-darkMainColor rounded-md overflow-y-auto">
          <div
            id="containedDiv"
            className="absolute top-0 left-0 w-full flex flex-col justify-center items-center">
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}>
              Studio Finance Dashboard
            </h2>
            <div id="icon" className="h-20 w-20 md:h-28 md:w-28 fill-lightMainColor stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor">
              <ShowIcon icon={'FinanceLogo'} stroke={'0.05'} />
            </div>
            <FinancialTabs />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;