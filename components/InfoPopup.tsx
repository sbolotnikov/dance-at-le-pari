import { useEffect, useState } from 'react';
// import PopupSign from './PopupSign';
import { AnimatePresence, motion } from 'framer-motion';
import PopupBG from './svg/PopupBG';
type Props = {
  styling: {
    variantHead: string;
    heading: string;
    text: string;
    color1: string;
    button1: string;
    color2: string;
    button2: string;
    link: string;
  };
  onReturn: (res: { response: string; link: string }) => void;
};
export default function InfoPopup({ styling, onReturn }: Props) {
  // main popup alert component
  const [isVisible, setIsVisible] = useState(true);
  const el = document.querySelector('#mainPage');
  function StopScroll() {
    // prevent scrolling
    var x = 0;
    var y = el!.scrollTop;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };
  }
  function AllowScroll() {
    // when done release scroll
    window.onscroll = function () {};
  }
  useEffect(() => {
    // setup buttons style on load
    StopScroll();
  }, []);
  return (
    <div
      className="absolute left-0 h-[100svh] w-[100svw] flex justify-center items-center z-[1001] backdrop-blur-sm"
      style={{ top: el!.scrollTop }}
    >
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
            className="m-auto  max-w-[600px] max-h-[600px]  border-2 border-brightAccent overflow-hidden  rounded-lg w-[97%] h-full flex flex-col justify-center items-center relative bg-lightMainColor dark:bg-darkMainColor dark:text-lightMainColor text-darkMainColor"
          >
            <div className="absolute w-3/4 h-3/4 flex flex-col justify-around items-center xs:text-sm xs:leading-4">
              <div
                className="px-1 py-2 border-2 border-solid border-transparent rounded-sm w-full m-1 text-center flex flex-col justify-center items-center overflow-auto"
                dangerouslySetInnerHTML={{ __html: styling.text }}
              />
              <label className="px-1 py-2 border-2 border-solid border-transparent rounded-sm w-[80%] m-1 text-center font-[GoudyBookletter]   ">
                {styling.heading}
              </label>
              <div className="w-full flex flex-row justify-evenly">
                <button
                  className="px-1 py-2 border-2 border-solid border-transparent rounded-sm w-[48%] m-1 text-center font-[GoudyBookletter] "
                  onClick={(e) => {
                    AllowScroll();
                    setIsVisible(false);
                    onReturn({
                      response: styling.button1,
                      link: styling.link,
                    });
                  }}
                >
                  {styling.button1}
                </button>
                {styling.button2 && (
                  <button
                    className="px-1 py-2 border-2 border-solid border-transparent rounded-sm w-[48%] m-1 text-center font-[GoudyBookletter] "
                    onClick={(e) => {
                      AllowScroll();
                      setIsVisible(false);
                      onReturn({
                        response: styling.button2,
                        link: '',
                      });
                    }}
                  >
                    {styling.button2}
                  </button>
                )}
              </div>
            </div>
            <PopupBG />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
