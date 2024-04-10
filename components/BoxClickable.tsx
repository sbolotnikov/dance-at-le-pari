import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

type Props = {
    title: string;
    children?: React.ReactNode;
}

export default function BoxClickable({title, children}: Props) {


        const [activeBox, setActiveBox]=useState(false);
    
      return ( 
        <>
          <div className="w-full flex" onClick={e => setActiveBox(!activeBox)}>
            <img
              className= {`w-5 h-5 my-auto transition duration-500 ease-in-out ${activeBox?'':'rotate-180'}`}
              src={'/icons/caret.svg'}
              alt="caret"
            />
            <h2 className="cursor-pointer text-left ml-4">{title}</h2>
          </div>
          <div className={`transition duration-500 ease-in-out w-full ${activeBox?'':'h-0'}`} >
          <AnimatePresence >
            {activeBox && 
          <motion.div style={{ originX: 0.5,originY: 0 }}
            initial={{ opacity: 0, scaleY:0}}
                transition={{
                  ease: 'easeOut',
                  duration: .5,
                }} 
                animate={{
                  opacity: 1,
                  scaleY:1
                }}
                exit={{
                  opacity: 0,
                  scaleY:0
                }}
          >
            {children}
          </motion.div>
            }
            </AnimatePresence>
            </div>
            </>
      );
    };
