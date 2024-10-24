import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
  //   FacebookMessengerShareButton,
  //   FacebookMessengerIcon
} from 'react-share';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BouncingButton } from './BouncingButton';
type Props = {
  url: string;
  title: string;
  quote: string;
  hashtag: string;
  visibility: boolean;
  onReturn: () => void;
};

function SharePostModal({
  url,
  title,
  quote,
  hashtag,
  visibility,
  onReturn,
}: Props) {
  // sets buttons to share test information on networks
  var socialMediaButton = {
    '&:hover > svg': {
      height: '50px !important',
      width: '50px !important',
    },
  }; 
  return (
   
    <AnimatePresence>
      {visibility && (
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
          className=" animatePageMainDiv w-[100vw] h-[100svh] absolute flex flex-col justify-center items-center bg-slate-500/70 left-0 z-[1001]"
        >
          <div className="blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-xl  flex justify-start items-center flex-col  h-[30svh] md:h-[30svh] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70">
            <h2 className="w-full text-center uppercase m-4">
              {'Share on Media'}
            </h2>
            <div className="w-full h-full flex justify-between items-center p-6 ">
              <BouncingButton title={'Facebook'}>
                <FacebookShareButton
                  url={url}
                  hashtag={hashtag}
                  onClick={() => onReturn()}
                >
                  <FacebookIcon size={36} round={true} />
                </FacebookShareButton>
              </BouncingButton>
              
              <BouncingButton title={'Twitter'}>
                <TwitterShareButton
                  url={url}
                  title={title + '\n' + quote}
                  hashtags={hashtag.split(' ')}
                  onClick={() => onReturn()}
                >
                  <TwitterIcon size={36} round={true} />
                </TwitterShareButton>
              </BouncingButton>
              <BouncingButton title={'Whatsapp'}>
                <WhatsappShareButton
                  url={url}
                  title={title + '\n' + quote}
                  separator=":: " // text to separate title from quote
                  onClick={() => onReturn()}
                >
                  <WhatsappIcon size={36} round={true} />
                </WhatsappShareButton>
              </BouncingButton>
              <BouncingButton title={'Email'}>
                <EmailShareButton
                  url={url}
                  subject={title}
                  body={quote + '\n'}
                  onClick={() => onReturn()}
                >
                  <EmailIcon size={36} round={true} />
                </EmailShareButton>
              </BouncingButton>
            </div> 
            <button
              className="w-full btnFancy my-1 text-base text-center  rounded-md"
              style={{ padding: '0' }}
              onClick={() => {
                onReturn();
              }}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SharePostModal;
