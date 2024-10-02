'use client';
import React, { useState } from 'react';
import ShowIcon from './svg/showIcon';
import MessagesBox from './MessagesBox';
import { useDimensions } from '@/hooks/useDimensions';
import { AnimatePresence, motion } from 'framer-motion';
import sleep from '@/utils/functions';

type Props = {
  visibility: boolean;
  onReturn: () => void;
};

const ChatbotModal = ({ visibility, onReturn }: Props) => {
  const [isVisible, setIsVisible] = useState(visibility);
  const windowSize = useDimensions();
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
          className="blurFilter animatePageMainDiv w-[100vw] h-[100svh] absolute flex flex-col justify-center items-center bg-slate-500/70 left-0 z-[1001]"
        >
          <div className=" blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[1050px] max-h-[85%] overflow-y-auto  md:w-full  bg-lightMainBG dark:bg-darkMainBG relative">
          <button
                className={` flex flex-col justify-center items-center origin-center cursor-pointer z-10 hover:scale-125 absolute top-3 right-3`}
                onClick={() => {
                  setIsVisible(false);
                  sleep(1200).then(()=>onReturn())
                  
                }}
              >
                <div className=" h-8 w-8  fill-lightMainColor stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor">
                  <ShowIcon icon={'Close'} stroke={'2'} />
                </div>
              </button>
            <div className="w-full h-[70svh] flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2">             
              <div
                className={`container mx-auto h-[${
                  windowSize.height && windowSize.height > 650 ? '15' : '5'
                }%]`}
              >
                <h2 className="text-lg md:text-2xl font-bold text-center">
                  Chat with AstaireBot
                </h2>
                {windowSize.height && windowSize.height > 650 && (
                  <div className="h-10 w-10 md:h-16 md:w-16 m-auto  fill-lightMainColor dark:fill-darkMainColor   stroke-lightMainColor dark:stroke-darkMainColor">
                    <ShowIcon icon={'Chatbot'} stroke={'0.1'} />
                  </div>
                )}
              </div>
              <div className="w-full h-[70%] border rounded-md border-lightMainColor dark:border-darkMainColor relative overflow-y-auto dark:bg-lightMainBG bg-darkMainBG">
                <MessagesBox
                  messages={[
                    'Hello, How can I help?',
                    'I need a lot of things. I need a lot of things.I need a lot of things.I need a lot of things.I need a lot of things.I need a lot of things. ',
                    'Ooo, let me think about it.. ',
                  ]}
                />
              </div>
              <div className="w-full h-[15%] flex flex-row justify-center items-center mt-2">
                <textarea
                  rows={windowSize.height && windowSize.height > 550 ? 3 : 1}
                  className="w-[80%] rounded-md bg-darkMainBG dark:bg-lightMainBG text-sm text-darkMainColor dark:text-lightMainColor border-lightMainColor dark:border-darkMainColor border-2"
                  placeholder="Type your message here..."
                ></textarea>
                <button className="m-2 p-2  btnFancySmall rounded-md border-2 border-lightMainColor dark:border-darkMainColor">
                  Send
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ChatbotModal;
