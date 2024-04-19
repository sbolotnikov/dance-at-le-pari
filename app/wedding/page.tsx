'use client';
import { FC, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/page-wrapper';
import BoxClickable from '@/components/BoxClickable';
import DanceDetails from '@/components/DanceDetails';
import InfoPopup from '@/components/InfoPopup';
import sleep from '@/utils/functions';
import SongDetails from '@/components/SongDetails';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const [revealAlert, setRevealAlert] = useState(false);
  const [alertStyle, setAlertStyle] = useState({
    variantHead: '',
    heading: ``,
    text: ``,
    color1: '',
    button1: '',
    color2: '',
    button2: '',
    link: '',
  });
  const onReturn = (decision1:{response:string, link:string}) => {
    console.log(decision1);
    sleep(1200).then(() => {
      setRevealAlert(false);
    });
  };

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {/* {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />} */}
      {revealAlert && <InfoPopup onReturn={onReturn} styling={alertStyle} />}
      <div
        className="border-0 rounded-md p-4  shadow-2xl w-[90%] h-[85svh]  max-w-[850px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md overflow-auto"
        // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
      >
        <h2
          className="text-center font-bold uppercase"
          style={{ letterSpacing: '1px' }}
        >
          Weddings
        </h2>
        <BoxClickable title="Why Take Wedding Dance Lessons?">
          <div className=" w-full  overflow-auto">
            <ol className="list-decimal list-inside">
              <li className="m-2">
                <b>Celebrate Love:</b><br/>
                <span>
                  Wedding dances are more than just steps; they're a celebration
                  of love. Imagine swaying gracefully with your partner,
                  surrounded by twinkling lights, as your hearts beat in sync.
                  💖
                </span>
              </li>
              <li className="m-2">
                <b>Confidence Boost:</b><br/>
                <span>
                  Navigating the dance floor can be nerve-wracking. But fear
                  not! Our expert instructors will transform you from two left
                  feet to a confident dancer.{' '}
                </span>
              </li>
              <li className="m-2">
                <b>Personalized Choreography:</b><br/>
                <span>
                  Your love story is unique, and so should be your dance. We
                  tailor choreography to your personalities, song choice, and
                  comfort level. Whether it's a waltz, salsa, or a quirky
                  mashup, we've got you covered. 🌟
                </span>
              </li>
              <li className="m-2">
                <b>Memorable Moments:</b><br/>
                <span>
                  Picture this: your guests' eyes widen as you twirl, dip, and
                  spin. The applause swells, and your love story unfolds on the
                  dance floor. These moments become cherished memories that
                  last a lifetime. 📸
                </span>
              </li>
            </ol>
          </div>
        </BoxClickable>
        <BoxClickable
        title="Recommended Dances"
      >
        <div className=" w-full  overflow-auto">
          <DanceDetails onDanceClick={(dance, videolink)=> {
            setAlertStyle({
              variantHead: 'info',
              heading: `${dance} example`,
              text: `<iframe width="420" height="315"src="https://www.youtube.com/embed/${videolink}"></iframe>`,
              color1: 'success',
              button1: 'Exit',
              color2: 'secondary',
              button2: '',
              link: '',
            });
            setRevealAlert(true);
          }}/>
        </div>
      </BoxClickable>
        <BoxClickable title="Recommended Songs" >
          <SongDetails onDanceClick={(dance, videolink)=> {
            setAlertStyle({
              variantHead: 'info',
              heading: `Song: ${dance}`,
              text: `<iframe width="420" height="315"src="https://www.youtube.com/embed/${videolink}"></iframe>`,
              color1: 'success',
              button1: 'Exit',
              color2: 'secondary',
              button2: '',
              link: '',
            });
            setRevealAlert(true);
          }}/>
      </BoxClickable>
      </div>
    </PageWrapper>
  );
};

export default page;
