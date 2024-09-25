 
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    visibility: boolean;
    audioBlob:string,
    fileName:string,
    onReturn: () => void;
}

const ListenSaveMp3Modal = ({visibility, audioBlob,fileName, onReturn}: Props) => {
    const audioRef = useRef<HTMLAudioElement>(null);  
    useEffect(() => {
        if (audioRef.current) {
          audioRef.current.src = audioBlob;
          audioRef.current.playbackRate = 1;
          audioRef.current.load();
          audioRef.current.play();
        }
      }, [audioBlob]);  
  return (
    <AnimatePresence>
    {visibility && 
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
      <div className="m-auto  max-w-[600px] bg-gray-200 border-2 border-solid border-gray-400 rounded-md w-[97%] p-2 flex flex-col content-evenly">
        <div id="wrapperDiv" className="w-full h-full border rounded-md border-lightMainColor dark:border-darkMainColor relative overflow-y-auto flex flex-col justify-center items-center">
          <div id="containedDiv"
            className={` w-full p-1 flex flex-col justify-center items-center`}
          >
           <h2> Listen/Download Song</h2>
           <p>Song Name: {fileName}</p>
           <audio ref={audioRef} controls title={fileName}/>
           <div className='flex justify-center items-center w-full h-16'>
           <button
                  className=" h-10 m-1 text-center text-gray-700 hover:scale-110 transition-all duration-150 ease-in-out"
                  onClick={(e) => {
                    onReturn();
                  }}
                >
                 Close
                </button>
                </div>
          </div>  
        </div>    
      </div>      
      </motion.div>}
     </AnimatePresence>       
  )
}

export default ListenSaveMp3Modal