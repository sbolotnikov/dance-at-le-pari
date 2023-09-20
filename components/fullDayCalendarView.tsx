import { useState } from 'react';
import ShowIcon from './svg/showIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { TEventArray } from '@/types/screen-settings';
import Link from 'next/link';
import Image from 'next/image';
type Props = {
  events: TEventArray | undefined;
  onReturn: () => void;
  day: string | undefined;
};

const FullDayCalendarView = ({ events, onReturn, day }: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  let el = document.querySelector('#mainPage');
  console.log(day, events);

  return (
    <AnimatePresence>
      {isVisible && (
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
          className="w-[100vw] h-[100vh] absolute flex flex-col justify-center items-center bg-slate-500/70 left-0 z-[1001] backdrop-blur-md"
          style={{ top: el!.scrollTop }}
        >
            
            <button
              className={` mt-2 md:mt-14 origin-center cursor-pointer z-10 hover:scale-125 `}
              onClick={() => {
                setIsVisible(false);
                onReturn();
              }}
            >
              <div className=" h-8 w-8 md:h-12 md:w-12   fill-darkMainColor stroke-darkMainColor">
                <ShowIcon icon={'Close'} stroke={'2'} />
              </div>
            </button> 

            <div className="font-semibold text-md text-center  text-shadow  dark:text-shadow-light text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG mt-4 p-3 shadow-2xl  rounded-md border-2">
            <span className="font-extrabold text-xl text-left  text-shadow  dark:text-shadow-light text-lightMainColor  dark:text-darkMainColor ">Schedule for:</span>
 {new Date(day!).toLocaleDateString('en-us', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</div>
          <div className="w-full h-full relative  overflow-y-auto ">
          <div className="absolute top-0 left-0 w-full min-h-full pb-10 flex flex-col justify-center items-center md:flex-row">
            {events && events.sort((a, b) => {
                  if (a.date > b.date) return 1
                  else if (a.date < b.date) return -1
                  else return 0
                }) .map((item, index) => {
              return (
                <Link key={'LinksEvent' + index} href={`/events/${item.id}`}>
                  <div className="m-3 p-2  flex flex-col justify-center items-center text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG    shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
                    <h1 className=" text-2xl  h-full text-center   text-shadow  dark:text-shadow-light " style={{color:item.color}}>
                      {new Date(item.date).toLocaleTimeString('en-US',{timeStyle: 'short'})} {item.tag}
                    </h1>
                    <Image
                      className="rounded-md overflow-hidden "
                      src={'/images/calendar.jpg'}
                      width={300}
                      height={300}
                      alt="Logo"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullDayCalendarView;
