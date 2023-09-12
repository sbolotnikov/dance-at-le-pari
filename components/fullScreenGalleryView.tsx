import { useState } from 'react'
import Gallery from './gallery';
import ShowIcon from './svg/showIcon';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
    pictures: string[];
    onReturn: () => void
}

const FullScreenGalleryView = ({pictures, onReturn}: Props) => {
    const [isVisible, setIsVisible] = useState(true);
    let el = document.querySelector('#mainPage');
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
             className="w-[100vw] h-[100vh] absolute flex justify-center items-center bg-slate-500/70 left-0 z-[1001] backdrop-blur-md"
            style={{ top: el!.scrollTop }}
          >
            <div  className="relative h-full w-full"
          >
      <button
        className={`absolute top-0 right-0 m-4 origin-center cursor-pointer z-10 hover:scale-125 `}
        onClick={() => {
            setIsVisible(false);
          onReturn();
        }}
      >
        <div className=" h-10 w-10 md:h-14 md:w-14  fill-darkMainColor stroke-darkMainColor">
          <ShowIcon icon={'Close'} stroke={'2'} />
        </div>
      </button>
      <Gallery
        pictures={pictures}
        auto={false}
        seconds={5}
        width={'100vw'}
        height={'100vh'}
      />
      </div>
     </motion.div>
        )}
      </AnimatePresence>
  
  )
}

export default FullScreenGalleryView