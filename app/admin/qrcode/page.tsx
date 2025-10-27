'use client';
import { FC, useState} from 'react';
import { PageWrapper } from '@/components/page-wrapper';

import ShowIcon from '@/components/svg/showIcon';
import ControlPanel from './components/ControlPanel';

import dynamic from 'next/dynamic';

const QrCodePreview = dynamic(() => import('./components/QrCodePreview'), { ssr: false });
// import QrCodePreview from './components/QrCodePreview';
import { QrOptions } from './types';
 

interface pageProps {}
 

const page: FC<pageProps> = ({}) => {
      const [options, setOptions] = useState<QrOptions>({
    data: 'https://react.dev/',
    dotsColor: '#ffffff',
    backgroundColor: '#1f293700',
    logo: null,
    logoSize: 0.4,
    logoPosition: 'center',
    frameId: 'rounded-rect',
    frameColor: '#a78bfa',
    frameText: 'SCAN ME',
    frameFont: 'sans-serif',
    frameTextSize: 1,
    frameTextColor: '#ffffff',
    frameTextY: 0,
    dotsType: 'square',
  });
      return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95%] md:h-[85svh] max-w-[1400px] md:w-full flex justify-center items-center flex-col bg-lightMainBG dark:bg-darkMainBG h-[70svh]
      }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center  overflow-auto"
        >
          <div
            id="containedDiv"
            className="absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center"
          >
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Fancy QR Code Generator
            </h2>
             <div className=" h-20 w-20 md:h-28 md:w-28 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor">
              <ShowIcon icon={'QRCode'} stroke={'0.05'} />
</div>

              

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full h-full">
          <div className="lg:col-span-1">
            <ControlPanel options={options} setOptions={setOptions} />
          </div>
          <div className="lg:col-span-2">
            <QrCodePreview options={options} />
          </div>
        </div>
            
            </div>
            </div>
            </div>
            </PageWrapper>
      )}
      
export default page;