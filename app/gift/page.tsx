'use client';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { useSession } from 'next-auth/react';
import {
  ScreenSettingsContextType,
  TPriceOption,
} from '@/types/screen-settings';
import PriceOptions from '@/components/PriceOptions';
import { SettingsContext } from '@/hooks/useSettings';
import PriceOptionSelect from '@/components/PriceOptionSelect';
import { addItem } from '@/slices/cartSlice';
import { useDispatch } from 'react-redux';
import ChoosePicture from '@/components/ChoosePicture';
import ImgFromDb from '@/components/ImgFromDb';
import SharePostModal from '@/components/SharePostModal'; 
import BannerGallery from '@/components/BannerGallery';
type Props = {};

const page = (props: Props) => {
  const { data: session } = useSession();
  const { giftCertificates, gsImage, events } = useContext(
    SettingsContext
  ) as ScreenSettingsContextType;
  const [img, setImg] = useState<string>('');
  const [revealCloud, setRevealCloud] = useState(false);
  const [priceOptions, setPriceOptions] = useState<TPriceOption[] | null>(null);
  const [choosenOption, setChoosenOption] = useState<number>(0);
  const [revealSharingModal, setRevealSharingModal] = useState(false);
  const dispatch = useDispatch(); 
  useEffect(() => {
    setPriceOptions(giftCertificates);
    setImg(gsImage);
  }, [giftCertificates]);

  const onReturnPicture = (decision1: string, fileLink: string) => {
    if (decision1 == 'Close') {
      // setRevealCloud1(false);
      setRevealCloud(false);
    }
    if (decision1 == 'Upload') {
      console.log('file link', fileLink);
      if (revealCloud == true) {
        setRevealCloud(false);
        setImg(fileLink);
      } else {
        setRevealCloud(false);
        console.log('file link', fileLink);
        setImg(fileLink);
      }
    }
  };
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex flex-col items-center  justify-start">
      <div className="w-full h-1/5 relative overflow-auto mt-1 md:mt-6  rounded-md">
        {events != undefined && (
          <BannerGallery
            events={[...events]}
            seconds={7}
          />
        )}
      </div> 
       <SharePostModal
        title={
          'Page: Gift Certificates | Dance at Le Pari Studio'
        }
        url={process.env.NEXT_PUBLIC_URL + '/gift'}
        quote={`Description: Gift certificates for ballroom dance classes at Dance at le Pari. Perfect for all occasions and skill levels. Choose from group classes, private lessons, or workshops in waltz, tango, foxtrot, and more. \n Click on the link below. \n`}
        hashtag={' giftCertificate    DanceLePariDanceCenter'}
        onReturn={() => setRevealSharingModal(false)}
        visibility={revealSharingModal}
      />
      {revealCloud && <ChoosePicture onReturn={onReturnPicture} />}
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[850px] h-full max-h-[73%]  md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2 overflow-y-auto">
          <div className=" absolute top-0 left-0 w-full h-fit p-2">
            <div className="w-full uppercase font-semibold  xs:text-md sm:text-xl md:text-4xl text-center">
              Gift Certificates
              {/* <svg viewBox="0 0 500 50" xmlns="http://www.w3.org/2000/svg">
      <g width="100%" transform="translate(0, 31)">
        <path d="M65.62 2.78L65.62 2.78L65.14 2.78Q64.51 6.14 62.33 7.99Q60.14 9.84 56.69 9.84L56.69 9.84Q53.04 9.84 48.10 6.82L48.10 6.82Q37.63 0.43 34.18-1.10L34.18-1.10Q35.28-2.21 37.01-3.12L37.01-3.12Q39.65-4.46 42.19-4.46L42.19-4.46L42.10-4.94Q37.39-4.94 33.74-1.30L33.74-1.30L32.64-1.92Q33.74-4.08 35.90-7.68Q38.06-11.28 41.23-16.46L41.23-16.46L40.75-16.66L39.31-14.64Q37.73-15.31 37.15-15.31L37.15-15.31Q34.99-15.31 30.24-2.64L30.24-2.64Q26.83-3.31 25.25-3.36L25.25-3.36Q23.42-3.46 21.17-3.22L21.17-3.22Q21.26-5.95 21.65-7.49L21.65-7.49Q22.08-9.12 23.33-11.47L23.33-11.47Q26.69-17.81 32.02-21.84L32.02-21.84Q32.74-21.74 33.34-21.70Q33.94-21.65 34.46-21.65L34.46-21.65Q35.14-21.65 35.95-21.72Q36.77-21.79 37.78-21.89L37.78-21.89Q39.55-22.13 41.38-22.51Q43.20-22.90 45.02-23.52L45.02-23.52Q50.50-25.30 50.50-27.55L50.50-27.55Q50.50-28.99 48.67-29.81L48.67-29.81Q47.38-30.43 45.65-30.43L45.65-30.43Q37.25-30.43 27.26-23.09L27.26-23.09Q21.98-24.10 19.06-24.10L19.06-24.10Q10.75-24.10 5.38-18.62L5.38-18.62Q0-13.25 0-4.94L0-4.94Q0 3.74 6.05 8.83L6.05 8.83Q6 9.02 6 9.74L6 9.74Q6 13.20 8.26 15.46L8.26 15.46Q10.46 17.76 13.97 17.76L13.97 17.76Q20.83 17.76 26.26 10.70L26.26 10.70Q28.56 7.68 30.24 3.65L30.24 3.65L33.74-0.67Q36.91 0.72 42.10 3.94L42.10 3.94Q44.93 5.71 46.97 6.89Q49.01 8.06 50.26 8.69L50.26 8.69Q53.52 10.32 56.69 10.32L56.69 10.32Q63.84 10.32 65.62 2.78ZM49.82-27.55L49.82-27.55Q49.82-25.73 44.64-24.10L44.64-24.10Q40.51-22.75 37.82-22.56L37.82-22.56Q36.14-22.42 32.40-22.42L32.40-22.42Q41.42-29.42 46.80-29.42L46.80-29.42Q47.86-29.42 48.72-28.99L48.72-28.99Q49.82-28.46 49.82-27.55ZM32.40-1.34L33.31-0.86L30.77 2.30L32.40-1.34ZM29.52-2.06L29.52-2.06Q26.26 0.24 24.24 0.24L24.24 0.24Q21.94 0.24 21.31-2.54L21.31-2.54Q22.37-2.64 23.35-2.71Q24.34-2.78 25.25-2.78L25.25-2.78Q28.22-2.40 29.52-2.06ZM26.64-22.56L26.64-22.56Q24.38-20.11 22.90-18.36Q21.41-16.61 20.64-15.41L20.64-15.41Q17.90-11.23 17.90-6.72L17.90-6.72Q17.90-5.66 18.72-2.64L18.72-2.64Q10.85-0.24 7.34 5.57L7.34 5.57Q6.53 6.91 6.14 8.26L6.14 8.26Q4.22 6.62 2.74 3.94L2.74 3.94Q0.43-0.10 0.43-4.94L0.43-4.94Q0.43-12.91 5.71-18.29L5.71-18.29Q11.04-23.66 19.06-23.66L19.06-23.66Q20.30-23.66 22.18-23.38Q24.05-23.09 26.64-22.56ZM30.24-1.78L30.24-1.78Q29.38 2.78 28.66 4.51L28.66 4.51Q28.13 5.18 27.05 6.07Q25.97 6.96 24.29 8.02L24.29 8.02Q19.54 11.04 15.12 11.04L15.12 11.04Q11.18 11.04 6.62 8.64L6.62 8.64Q7.73 4.46 11.95 1.10L11.95 1.10Q14.93-1.20 18.91-2.21L18.91-2.21Q21.46 0.77 24.29 0.77L24.29 0.77Q26.11 0.77 30.24-1.78ZM28.70 5.23L28.70 5.23Q28.70 6.05 27.07 8.69L27.07 8.69Q21.74 17.33 13.97 17.33L13.97 17.33Q10.51 17.33 8.45 14.98L8.45 14.98Q6.53 12.77 6.53 9.26L6.53 9.26Q7.01 9.79 9.41 10.56L9.41 10.56Q12.43 11.52 15.12 11.52L15.12 11.52Q21.41 11.52 28.70 5.23Z"
         startOffset="584.0718994140625" style={{animation: '0.3s ease-in-out 1s 1 normal forwards running dash', strokeDasharray: 584.072, strokeDashoffset: 584.072, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/> 
        <path d="M54.50-19.97L54.50-19.97Q54.50-20.69 54-21.14Q53.50-21.60 52.78-21.60L52.78-21.60Q51.77-21.60 51.05-20.86Q50.33-20.11 50.33-19.10L50.33-19.10Q50.33-18.34 50.86-17.78Q51.38-17.23 52.15-17.23L52.15-17.23Q53.11-17.23 53.81-18.10Q54.50-18.96 54.50-19.97ZM57.38-10.46L57.38-10.46L57-10.80Q55.13-8.54 51.67-5.04L51.67-5.04Q46.97-0.29 45.86-0.29L45.86-0.29Q44.81-0.29 44.81-1.54L44.81-1.54Q44.81-2.50 45.19-3.36L45.19-3.36L51.29-14.98Q51-14.88 50.33-14.21Q49.66-13.54 49.46-13.54L49.46-13.54Q49.42-13.54 48.84-13.75Q48.26-13.97 47.83-13.97L47.83-13.97Q47.11-13.97 46.54-12.96L46.54-12.96Q45.48-11.04 44.74-9.72Q43.99-8.40 43.61-7.63L43.61-7.63Q41.83-4.42 41.83-2.16L41.83-2.16Q41.83 0.62 44.81 0.62L44.81 0.62Q47.93 0.62 57.38-10.46Z" 
         startOffset="85.54638671875" style={{animation: '0.3s ease-in-out 1.25s 1 normal forwards running dash', strokeDasharray: 85.5464, strokeDashoffset: 85.5464,  stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M78.81-27.17L78.81-27.17Q78.81-27.84 78.21-28.39Q77.61-28.94 76.94-28.94L76.94-28.94Q73.91-28.94 68.82-22.32L68.82-22.32Q67.24-20.26 65.63-17.86Q64.02-15.46 62.39-12.67L62.39-12.67L59.56-12.67L59.08-11.81L61.86-11.81Q60.62-9.50 58.91-6.05Q57.21-2.59 54.95 2.21L54.95 2.21Q51.35 9.89 49.72 12.24L49.72 12.24Q47.03 16.08 44.30 16.08L44.30 16.08Q42.76 16.08 41.56 15.17L41.56 15.17Q40.22 14.26 40.22 12.72L40.22 12.72Q40.22 11.66 40.94 10.27L40.94 10.27Q41.70 8.69 42.71 8.69L42.71 8.69Q43.72 8.69 43.72 9.94L43.72 9.94Q43.72 10.51 42.23 10.70L42.23 10.70Q42.95 11.95 43.82 11.95L43.82 11.95Q44.82 11.95 45.64 11.33Q46.46 10.70 46.46 9.70L46.46 9.70Q46.46 8.74 45.76 7.99Q45.06 7.25 44.10 7.25L44.10 7.25Q42.28 7.25 40.89 8.78L40.89 8.78Q39.54 10.32 39.54 12.29L39.54 12.29Q39.54 14.21 40.91 15.41Q42.28 16.61 44.30 16.61L44.30 16.61Q48.04 16.61 51.59 12.77L51.59 12.77Q54.86 9.22 59.13 1.01L59.13 1.01L65.61-11.81L69.02-11.81L69.50-12.67L66.86-12.67Q70.89-14.74 74.49-18.72L74.49-18.72Q78.81-23.38 78.81-27.17ZM76.94-26.78L76.94-26.78Q76.94-24.53 74.63-21.17L74.63-21.17Q71.66-16.75 66.14-12.67L66.14-12.67Q66.95-14.50 68.18-16.73Q69.40-18.96 71.03-21.70L71.03-21.70Q74.97-28.18 76.12-28.18L76.12-28.18Q76.94-28.18 76.94-26.78Z" 
         startOffset="206.70755004882812" style={{animation: '0.3s ease-in-out 1.5s 1 normal forwards running dash', strokeDasharray: 206.708, strokeDashoffset: 206.708, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M89.38-10.46L89.38-10.46L89-10.80Q87.61-8.98 86.46-7.46Q85.30-5.95 84.39-4.80L84.39-4.80Q83.10-3.22 81.51-1.97L81.51-1.97Q79.30-0.29 77.96-0.29L77.96-0.29Q77.48-0.29 77.12-0.94Q76.76-1.58 76.76-2.11L76.76-2.11Q76.76-2.83 77.77-4.66L77.77-4.66L82.76-13.39L86.36-13.39L86.65-14.11L83.05-14.11L87.90-22.61L87.37-22.61Q86.31-20.98 85.50-19.80Q84.68-18.62 84.06-17.90L84.06-17.90Q82.09-15.60 79.78-14.11L79.78-14.11L75.99-14.11L75.22-13.39L78.68-13.39L74.98-5.76Q73.98-3.65 73.98-2.45L73.98-2.45Q73.98-1.25 74.67-0.31Q75.37 0.62 76.52 0.62L76.52 0.62Q80.17 0.62 83.96-3.31L83.96-3.31Q85.06-4.51 86.43-6.26Q87.80-8.02 89.38-10.46Z" 
         startOffset="103.40815734863281" style={{animation: '0.3s ease-in-out 1.75s 1 normal forwards running dash', strokeDasharray: 103.408, strokeDashoffset: 103.408, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="" startOffset="0" style={{animation: '0.3s ease-in-out 2s 1 normal forwards running dash', strokeDasharray: 0, strokeDashoffset: 0, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M193.34 12.10L193.34 12.10Q193.34 8.21 188.35 6.10L188.35 6.10Q184.61 4.46 180.05 4.46L180.05 4.46Q175.68 4.46 170.78 6.38L170.78 6.38Q167.57 7.63 165.36 8.52Q163.15 9.41 161.90 9.94L161.90 9.94Q157.15 11.86 153.55 11.86L153.55 11.86Q146.83 11.86 142.66 7.10L142.66 7.10Q138.67 2.54 138.67-4.18L138.67-4.18Q138.67-12.67 144.96-18.86L144.96-18.86Q151.30-25.06 159.79-25.06L159.79-25.06Q160.75-25.06 162-25.01Q163.25-24.96 164.78-24.86L164.78-24.86Q168.62-24.62 168.62-24.24L168.62-24.24Q167.14-23.42 165.65-22.13Q164.16-20.83 162.62-19.10L162.62-19.10Q157.63-13.44 157.63-7.82L157.63-7.82Q157.63-1.68 162.19 0.58L162.19 0.58Q164.16 3.26 166.85 3.26L166.85 3.26Q171.89 3.26 177.02-3.60L177.02-3.60L176.64-4.03Q171.36 2.59 166.85 2.59L166.85 2.59Q165.02 2.59 163.82 1.10L163.82 1.10Q164.11 1.15 164.33 1.18Q164.54 1.20 164.74 1.20L164.74 1.20Q169.44 1.20 173.71-3.36L173.71-3.36Q177.94-7.87 177.94-12.72L177.94-12.72Q177.94-17.14 174.14-17.14L174.14-17.14Q168.67-17.14 164.74-11.62L164.74-11.62Q161.38-6.96 161.38-2.50L161.38-2.50Q161.38-1.82 161.42-1.68L161.42-1.68Q160.32-2.78 160.37-4.56L160.37-4.56Q160.42-7.15 162.10-10.61L162.10-10.61Q164.02-14.59 166.56-17.42L166.56-17.42Q169.92-21.07 172.75-23.47L172.75-23.47Q176.06-22.99 178.34-22.78Q180.62-22.56 181.97-22.56L181.97-22.56Q184.70-22.56 186.82-23.42L186.82-23.42Q189.70-24.62 189.70-26.93L189.70-26.93Q189.70-29.71 184.85-29.71L184.85-29.71Q178.03-29.71 169.25-24.82L169.25-24.82Q168.91-24.86 168.14-24.94Q167.38-25.01 166.13-25.15L166.13-25.15Q162.43-25.58 159.79-25.58L159.79-25.58Q150.96-25.58 144.53-19.30L144.53-19.30Q138.14-13.06 138.14-4.18L138.14-4.18Q138.14 2.98 142.22 7.54L142.22 7.54Q146.50 12.38 153.55 12.38L153.55 12.38Q157.58 12.38 162.19 10.46L162.19 10.46Q165.36 9.22 167.50 8.33Q169.63 7.44 170.83 6.91L170.83 6.91Q175.58 4.99 180.05 4.99L180.05 4.99Q184.03 4.99 187.87 6.62L187.87 6.62Q192.77 8.74 192.77 12.10L192.77 12.10Q192.77 13.06 192.05 14.40L192.05 14.40Q192.10 14.45 192.14 14.52Q192.19 14.59 192.29 14.69L192.29 14.69Q193.34 13.20 193.34 12.10ZM189.17-26.93L189.17-26.93Q189.17-23.09 181.97-23.09L181.97-23.09Q179.57-23.09 173.76-23.95L173.76-23.95Q180.72-29.18 184.85-29.18L184.85-29.18Q189.17-29.18 189.17-26.93ZM176.30-13.06L176.30-13.06Q176.30-9.12 172.51-4.46L172.51-4.46Q168.53 0.29 164.69 0.29L164.69 0.29Q163.63 0.29 162.72-0.29L162.72-0.29Q162.19-1.78 162.19-2.78L162.19-2.78Q162.19-6.91 165.55-11.42L165.55-11.42Q169.15-16.27 173.14-16.27L173.14-16.27Q176.30-16.27 176.30-13.06Z" 
         startOffset="495.81170654296875" style={{animation: '0.3s ease-in-out 2.25s 1 normal forwards running dash', strokeDasharray: 495.812, strokeDashoffset: 495.812, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M198.84-10.46L198.84-10.46L198.46-10.80Q196.63-7.78 192.74-4.37L192.74-4.37Q187.85-0.05 184.68-0.05L184.68-0.05Q183.38-0.05 183.38-1.82L183.38-1.82Q183.38-3.31 184.25-5.18L184.25-5.18Q186.46-5.18 189.82-6.72L189.82-6.72Q194.18-8.74 194.18-11.76L194.18-11.76Q194.18-12.86 193.37-13.63Q192.55-14.40 191.45-14.40L191.45-14.40Q188.09-14.40 184.58-11.52L184.58-11.52Q180.55-8.21 180.55-3.60L180.55-3.60Q180.55-1.78 181.73-0.58Q182.90 0.62 184.68 0.62L184.68 0.62Q188.18 0.62 193.22-3.98L193.22-3.98Q197.11-7.58 198.84-10.46ZM191.78-12.67L191.78-12.67Q191.78-10.99 189.14-8.64L189.14-8.64Q186.46-6.34 184.73-6.34L184.73-6.34Q188.47-13.78 190.78-13.78L190.78-13.78Q191.78-13.78 191.78-12.67Z" 
         startOffset="105.0895767211914" style={{animation: '0.3s ease-in-out 2.5s 1 normal forwards running dash', strokeDasharray: 105.09, strokeDashoffset: 105.09, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M214.22-10.46L214.22-10.46L213.83-10.80Q206.63-0.43 202.84-0.43L202.84-0.43Q201.59-0.43 201.59-1.73L201.59-1.73Q201.59-2.21 202.50-3.70L202.50-3.70L206.30-10.18Q207.30-11.90 207.30-12.53L207.30-12.53Q207.30-13.30 206.82-13.85Q206.34-14.40 205.62-14.40L205.62-14.40Q204.52-14.40 200.58-11.09L200.58-11.09Q202.26-13.06 202.26-14.40L202.26-14.40Q202.26-15.50 201.11-15.50L201.11-15.50Q200.01-15.50 199.24-14.21L199.24-14.21Q198.42-12.96 198.42-11.86L198.42-11.86Q198.42-10.03 199.53-10.03L199.53-10.03Q200.34-10.03 201.30-10.75L201.30-10.75Q202.26-11.52 202.55-11.52L202.55-11.52Q202.74-11.52 202.74-11.18L202.74-11.18Q202.74-10.75 200.78-7.34Q198.81-3.94 198.81-2.83L198.81-2.83Q198.86 0.62 201.30 0.62L201.30 0.62Q205 0.62 208.89-3.36L208.89-3.36Q211.05-5.57 214.22-10.46ZM201.54-14.35L201.54-14.35Q201.54-13.39 199.67-11.04L199.67-11.04Q199.14-11.04 199.14-11.86L199.14-11.86Q199.14-12.67 199.77-13.73Q200.39-14.78 201.11-14.78L201.11-14.78Q201.54-14.78 201.54-14.35Z" 
         startOffset="97.25171661376953" style={{animation: '0.3s ease-in-out 2.75s 1 normal forwards running dash', strokeDasharray: 97.2517, strokeDashoffset: 97.2517, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M227.38-10.46L227.38-10.46L227-10.80Q225.61-8.98 224.46-7.46Q223.30-5.95 222.39-4.80L222.39-4.80Q221.10-3.22 219.51-1.97L219.51-1.97Q217.30-0.29 215.96-0.29L215.96-0.29Q215.48-0.29 215.12-0.94Q214.76-1.58 214.76-2.11L214.76-2.11Q214.76-2.83 215.77-4.66L215.77-4.66L220.76-13.39L224.36-13.39L224.65-14.11L221.05-14.11L225.90-22.61L225.37-22.61Q224.31-20.98 223.50-19.80Q222.68-18.62 222.06-17.90L222.06-17.90Q220.09-15.60 217.78-14.11L217.78-14.11L213.99-14.11L213.22-13.39L216.68-13.39L212.98-5.76Q211.98-3.65 211.98-2.45L211.98-2.45Q211.98-1.25 212.67-0.31Q213.37 0.62 214.52 0.62L214.52 0.62Q218.17 0.62 221.96-3.31L221.96-3.31Q223.06-4.51 224.43-6.26Q225.80-8.02 227.38-10.46Z" 
         startOffset="103.4082260131836" style={{animation: '0.3s ease-in-out 3s 1 normal forwards running dash', strokeDasharray: 103.408, strokeDashoffset: 103.408, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M240.50-19.97L240.50-19.97Q240.50-20.69 240-21.14Q239.50-21.60 238.78-21.60L238.78-21.60Q237.77-21.60 237.05-20.86Q236.33-20.11 236.33-19.10L236.33-19.10Q236.33-18.34 236.86-17.78Q237.38-17.23 238.15-17.23L238.15-17.23Q239.11-17.23 239.81-18.10Q240.50-18.96 240.50-19.97ZM243.38-10.46L243.38-10.46L243-10.80Q241.13-8.54 237.67-5.04L237.67-5.04Q232.97-0.29 231.86-0.29L231.86-0.29Q230.81-0.29 230.81-1.54L230.81-1.54Q230.81-2.50 231.19-3.36L231.19-3.36L237.29-14.98Q237-14.88 236.33-14.21Q235.66-13.54 235.46-13.54L235.46-13.54Q235.42-13.54 234.84-13.75Q234.26-13.97 233.83-13.97L233.83-13.97Q233.11-13.97 232.54-12.96L232.54-12.96Q231.48-11.04 230.74-9.72Q229.99-8.40 229.61-7.63L229.61-7.63Q227.83-4.42 227.83-2.16L227.83-2.16Q227.83 0.62 230.81 0.62L230.81 0.62Q233.93 0.62 243.38-10.46Z" 
         startOffset="85.54655456542969" style={{animation: '0.3s ease-in-out 3.25s 1 normal forwards running dash', strokeDasharray: 85.5466, strokeDashoffset: 85.5466, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M264.81-27.17L264.81-27.17Q264.81-27.84 264.21-28.39Q263.61-28.94 262.94-28.94L262.94-28.94Q259.91-28.94 254.82-22.32L254.82-22.32Q253.24-20.26 251.63-17.86Q250.02-15.46 248.39-12.67L248.39-12.67L245.56-12.67L245.08-11.81L247.86-11.81Q246.62-9.50 244.91-6.05Q243.21-2.59 240.95 2.21L240.95 2.21Q237.35 9.89 235.72 12.24L235.72 12.24Q233.03 16.08 230.30 16.08L230.30 16.08Q228.76 16.08 227.56 15.17L227.56 15.17Q226.22 14.26 226.22 12.72L226.22 12.72Q226.22 11.66 226.94 10.27L226.94 10.27Q227.70 8.69 228.71 8.69L228.71 8.69Q229.72 8.69 229.72 9.94L229.72 9.94Q229.72 10.51 228.23 10.70L228.23 10.70Q228.95 11.95 229.82 11.95L229.82 11.95Q230.82 11.95 231.64 11.33Q232.46 10.70 232.46 9.70L232.46 9.70Q232.46 8.74 231.76 7.99Q231.06 7.25 230.10 7.25L230.10 7.25Q228.28 7.25 226.89 8.78L226.89 8.78Q225.54 10.32 225.54 12.29L225.54 12.29Q225.54 14.21 226.91 15.41Q228.28 16.61 230.30 16.61L230.30 16.61Q234.04 16.61 237.59 12.77L237.59 12.77Q240.86 9.22 245.13 1.01L245.13 1.01L251.61-11.81L255.02-11.81L255.50-12.67L252.86-12.67Q256.89-14.74 260.49-18.72L260.49-18.72Q264.81-23.38 264.81-27.17ZM262.94-26.78L262.94-26.78Q262.94-24.53 260.63-21.17L260.63-21.17Q257.66-16.75 252.14-12.67L252.14-12.67Q252.95-14.50 254.18-16.73Q255.40-18.96 257.03-21.70L257.03-21.70Q260.97-28.18 262.12-28.18L262.12-28.18Q262.94-28.18 262.94-26.78Z" 
         startOffset="206.70782470703125" style={{animation: '0.3s ease-in-out 3.5s 1 normal forwards running dash', strokeDasharray: 206.708, strokeDashoffset: 206.708, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M272.50-19.97L272.50-19.97Q272.50-20.69 272-21.14Q271.50-21.60 270.78-21.60L270.78-21.60Q269.77-21.60 269.05-20.86Q268.33-20.11 268.33-19.10L268.33-19.10Q268.33-18.34 268.86-17.78Q269.38-17.23 270.15-17.23L270.15-17.23Q271.11-17.23 271.81-18.10Q272.50-18.96 272.50-19.97ZM275.38-10.46L275.38-10.46L275-10.80Q273.13-8.54 269.67-5.04L269.67-5.04Q264.97-0.29 263.86-0.29L263.86-0.29Q262.81-0.29 262.81-1.54L262.81-1.54Q262.81-2.50 263.19-3.36L263.19-3.36L269.29-14.98Q269-14.88 268.33-14.21Q267.66-13.54 267.46-13.54L267.46-13.54Q267.42-13.54 266.84-13.75Q266.26-13.97 265.83-13.97L265.83-13.97Q265.11-13.97 264.54-12.96L264.54-12.96Q263.48-11.04 262.74-9.72Q261.99-8.40 261.61-7.63L261.61-7.63Q259.83-4.42 259.83-2.16L259.83-2.16Q259.83 0.62 262.81 0.62L262.81 0.62Q265.93 0.62 275.38-10.46Z" 
         startOffset="85.54658508300781" style={{animation: '0.3s ease-in-out 3.75s 1 normal forwards running dash', strokeDasharray: 85.5466, strokeDashoffset: 85.5466, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M298.73-10.46L298.73-10.46L298.34-10.80Q295.13-6.34 290.95-3.41L290.95-3.41Q285.96 0.05 281.30 0.05L281.30 0.05Q279.14 0.05 279.14-1.68L279.14-1.68Q279.14-4.37 282.07-9.02L282.07-9.02Q285.14-13.92 287.30-13.92L287.30-13.92Q288.94-13.92 288.94-12.91L288.94-12.91Q288.94-12.48 288.41-11.90Q287.88-11.33 287.45-11.33L287.45-11.33Q286.82-11.33 286.06-11.95L286.06-11.95Q285.58-11.33 285.58-10.32L285.58-10.32Q285.58-9.07 287.30-9.07L287.30-9.07Q288.41-9.07 289.30-9.94Q290.18-10.80 290.18-11.90L290.18-11.90Q290.18-13.01 289.30-13.70Q288.41-14.40 287.30-14.40L287.30-14.40Q282.74-14.40 279.67-11.23L279.67-11.23Q276.55-8.11 276.55-3.60L276.55-3.60Q276.55 0.62 281.30 0.62L281.30 0.62Q286.25 0.62 291.24-2.83L291.24-2.83Q295.32-5.71 298.73-10.46Z" 
         startOffset="104.56378173828125" style={{animation: '0.3s ease-in-out 4s 1 normal forwards running dash', strokeDasharray: 104.564, strokeDashoffset: 104.564, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M316.55-10.46L316.55-10.46L316.17-10.80Q315.02-9.41 313.60-7.87Q312.18-6.34 310.50-4.66L310.50-4.66Q305.85 0 304.22 0L304.22 0Q303.16 0 303.16-0.96L303.16-0.96Q303.16-1.63 303.98-3.17L303.98-3.17L310.26-14.98Q310.02-14.88 309.45-14.30L309.45-14.30Q308.87-13.68 308.68-13.68L308.68-13.68Q308.34-13.68 307.67-13.82Q307-13.97 306.66-13.97L306.66-13.97Q306.23-13.97 305.66-13.25L305.66-13.25Q304.84-14.40 303.21-14.40L303.21-14.40Q299.13-14.40 295.82-11.23L295.82-11.23Q292.55-8.11 292.55-4.03L292.55-4.03Q292.55 0.62 295.72 0.62L295.72 0.62Q298.17 0.62 300.28-2.11L300.28-2.11Q301.58 0.62 303.93 0.62L303.93 0.62Q307.38 0.62 316.55-10.46ZM304.94-12.38L304.94-12.38Q304.94-11.52 300.04-3.17L300.04-3.17Q298.17 0 296.25 0L296.25 0Q295.29 0 295.29-1.58L295.29-1.58Q295.29-4.18 298.02-8.59L298.02-8.59Q301.10-13.54 303.93-13.54L303.93-13.54Q304.94-13.54 304.94-12.38Z" 
         startOffset="127.67552185058594" style={{animation: '0.3s ease-in-out 4.25s 1 normal forwards running dash', strokeDasharray: 127.676, strokeDashoffset: 127.676, stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M323.38-10.46L323.38-10.46L323-10.80Q321.61-8.98 320.46-7.46Q319.30-5.95 318.39-4.80L318.39-4.80Q317.10-3.22 315.51-1.97L315.51-1.97Q313.30-0.29 311.96-0.29L311.96-0.29Q311.48-0.29 311.12-0.94Q310.76-1.58 310.76-2.11L310.76-2.11Q310.76-2.83 311.77-4.66L311.77-4.66L316.76-13.39L320.36-13.39L320.65-14.11L317.05-14.11L321.90-22.61L321.37-22.61Q320.31-20.98 319.50-19.80Q318.68-18.62 318.06-17.90L318.06-17.90Q316.09-15.60 313.78-14.11L313.78-14.11L309.99-14.11L309.22-13.39L312.68-13.39L308.98-5.76Q307.98-3.65 307.98-2.45L307.98-2.45Q307.98-1.25 308.67-0.31Q309.37 0.62 310.52 0.62L310.52 0.62Q314.17 0.62 317.96-3.31L317.96-3.31Q319.06-4.51 320.43-6.26Q321.80-8.02 323.38-10.46Z" 
         startOffset="103.40824127197266" style={{animation: '0.3s ease-in-out 4.5s 1 normal forwards running dash', strokeDasharray: 103.408, strokeDashoffset: 103.408,  stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
         <path d="M342.84-10.46L342.84-10.46L342.46-10.80Q340.63-7.78 336.74-4.37L336.74-4.37Q331.85-0.05 328.68-0.05L328.68-0.05Q327.38-0.05 327.38-1.82L327.38-1.82Q327.38-3.31 328.25-5.18L328.25-5.18Q330.46-5.18 333.82-6.72L333.82-6.72Q338.18-8.74 338.18-11.76L338.18-11.76Q338.18-12.86 337.37-13.63Q336.55-14.40 335.45-14.40L335.45-14.40Q332.09-14.40 328.58-11.52L328.58-11.52Q324.55-8.21 324.55-3.60L324.55-3.60Q324.55-1.78 325.73-0.58Q326.90 0.62 328.68 0.62L328.68 0.62Q332.18 0.62 337.22-3.98L337.22-3.98Q341.11-7.58 342.84-10.46ZM335.78-12.67L335.78-12.67Q335.78-10.99 333.14-8.64L333.14-8.64Q330.46-6.34 328.73-6.34L328.73-6.34Q332.47-13.78 334.78-13.78L334.78-13.78Q335.78-13.78 335.78-12.67Z" 
         startOffset="105.0897216796875" style={{animation: '0.3s ease-in-out 4.75s 1 normal forwards running dash', strokeDasharray: 105.09,strokeDashoffset: 105.09,  stroke: 'rgb(250, 11, 11)', fill: 'none'}}/> 
         <path d="M355.96-10.46L355.96-10.46L355.58-10.80Q352.79-6.19 350.34-4.37L350.34-4.37Q348.66-3.12 345.83-2.50L345.83-2.50Q346.70-3.84 346.70-6.86L346.70-6.86Q346.70-8.78 345.26-12.10L345.26-12.10Q346.74-14.74 346.74-15.79L346.74-15.79Q346.74-16.66 345.54-16.66L345.54-16.66Q344.15-16.66 343.53-14.93L343.53-14.93Q343-13.58 343-12.05L343-12.05Q343-11.23 343.43-9.65L343.43-9.65Q343.91-8.21 343.91-7.39L343.91-7.39Q343.91-6.34 343.43-5.04Q342.95-3.74 342.18-3.17L342.18-3.17Q341.94-3.26 340.55-4.42L340.55-4.42Q339.54-5.28 338.78-5.28L338.78-5.28Q337.72-5.28 337.10-4.49Q336.47-3.70 336.47-2.59L336.47-2.59Q336.47 0.72 340.26 0.72L340.26 0.72Q343.29 0.72 345.54-1.82L345.54-1.82Q348.28-2.26 350.20-3.50L350.20-3.50Q352.94-5.38 355.96-10.46ZM346.17-15.70L346.17-15.70Q346.17-14.30 344.97-12.67L344.97-12.67Q344.68-13.15 344.68-14.21L344.68-14.21Q344.68-14.64 344.92-15.36L344.92-15.36Q345.21-16.22 345.59-16.22L345.59-16.22Q346.17-16.22 346.17-15.70ZM341.70-2.69L341.70-2.69Q341.32-2.11 339.78-2.11L339.78-2.11Q338.25-2.40 338.25-3.46L338.25-3.46Q338.25-4.42 339.11-4.42L339.11-4.42Q339.45-4.42 340.50-3.60L340.50-3.60Q341.51-2.74 341.70-2.69Z" 
         startOffset="95.68061828613281" style={{animation: '0.3s ease-in-out 5s 1 normal forwards running dash', strokeDasharray: 95.6806, strokeDashoffset: 95.6806,  stroke: 'rgb(250, 11, 11)', fill: 'none'}}/>
      </g>
    </svg> */}
            </div>
            <div className=" h-20 w-20 md:h-24 md:w-24 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto">
              <ShowIcon icon={'Gift'} stroke={'0.1'} />
            </div>
            <button
              className=" outline-none border-none absolute right-0 top-0  rounded-md  mt-2  w-8 h-8"
              aria-label='Share this page'
              onClick={(e) => {
                e.preventDefault();
                setRevealSharingModal(!revealSharingModal);
                return;
              }}
            >
              <ShowIcon icon={'Share'} stroke={'2'} />
            </button>
            <div className="flex flex-col md:flex-row items-center justify-between w-full h-auto">
              <div className="w-full md:w-1/2  flex flex-col justify-center items-center">
                <div
                  id="icon"
                  className=" h-52 w-52 m-auto fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor "
                >
                  <ShowIcon icon={'Gift2'} stroke={'0.05'} />
                  {/* */}
                </div>
                <PriceOptionSelect
                  options={priceOptions}
                  id={0}
                  onChange={(option: number) => {
                    console.log(option);
                    setChoosenOption(option);
                  }}
                />
                {priceOptions !== null && (
                  <button
                    className=" btnFancy"
                    onClick={() => {
                      const p1 = {
                        id: choosenOption,
                        image: img,
                        eventtype: 'Gift Certificate',
                        price: priceOptions
                          ? priceOptions[choosenOption].price
                          : 0,
                        tag: priceOptions
                          ? priceOptions[choosenOption].tag
                          : '',
                        amount: 1,
                        seat: null,
                        table: null,
                        date: null,
                      };
                      dispatch(addItem(p1));
                    }}
                  >
                    Add To Cart
                  </button>
                )}
                {session && session.user.role == 'Admin' && (
                  <div className="w-24">
                    <div
                      onClick={() => {
                        setRevealCloud(true);
                      }}
                    >
                      {img !== null && img !== '' && img !== undefined ? (
                        <ImgFromDb
                          url={img}
                          stylings="object-contain"
                          alt="Event Picture"
                        />
                      ) : (
                        <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                          <ShowIcon icon={'Template'} stroke={'2'} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {session && session.user.role == 'Admin' && (
                  <div className="flex flex-col justify-between items-center w-full">
                    <PriceOptions
                      options={priceOptions}
                      onChange={(options: TPriceOption[] | null) => {
                        options !== null
                          ? setPriceOptions([...options])
                          : setPriceOptions(null);
                      }}
                    />
                  </div>
                )}
                {session && session.user.role == 'Admin' && (
                  <button
                    className=" btnFancy"
                    onClick={() => {
                      if (priceOptions !== null) {
                        console.log({
                          giftCertificates: JSON.stringify(priceOptions),
                        });

                        fetch('/api/admin/update_gift_certificates', {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            giftCertificates: JSON.stringify({
                              priceOptions,
                              img,
                            }),
                          }),
                        })
                          .then((res) => res)
                          .then((res) => {
                            console.log(res.json());
                            alert('Gift certificates updated!');
                          })
                          .catch((err) => {
                            console.error(err);
                            alert('Internal server error');
                          });
                      }
                    }}
                  >
                    Update Options
                  </button>
                )}
              </div>
              <p className="m-1 w-full md:w-1/2 text-justify">
                Give the gift of dance with a Dance at le Pari gift certificate!
                Perfect for any occasion, our gift certificates allow your loved
                ones to experience the joy and elegance of ballroom dancing.
                Whether they're complete beginners or experienced dancers
                looking to refine their skills, recipients can choose from our
                wide range of classes, including waltz, tango, foxtrot, and
                more. <br />
                <br />
                Gift certificates are available in various denominations and can
                be applied to group classes, private lessons, or dance parties.
                Surprise someone special with the opportunity to learn new
                moves, boost their confidence, and have fun in our welcoming
                studio environment. <br />
                <br />A Dance at le Pari gift certificate is more than just a
                present – it's an invitation to a world of rhythm, grace, and
                unforgettable memories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
