'use client';
import { FC, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/page-wrapper';
import BoxClickable from '@/components/BoxClickable';
import DanceDetails from '@/components/DanceDetails';
import InfoPopup from '@/components/InfoPopup';
import sleep, { get_package } from '@/utils/functions';
import SongDetails from '@/components/SongDetails';
import Image from 'next/image';
import { addItem } from '@/slices/cartSlice';
import Iframe from 'react-iframe';
import { useDispatch} from "react-redux"

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const dispatch = useDispatch();
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
  const onReturn = (decision1: { response: string; link: string }) => {
    console.log(decision1);
    sleep(1200).then(() => {
      setRevealAlert(false);
    });
  };
  const packageArray = [{id:37, name:"Intro package",tag:"$100 ($103 credit card) includes: <br/>  1 (45 minute) private dance lesson for the bride & groom ",amount:1, price:103, image:'/images/weddingcouple.jpg',description:"<ul><li>Consultation on a dance style to chosen song</li>  <li>Learn the proper basic 2-3 dance steps to your chosen song</li></ul>"},
  {id:78, name:"Bronze package",tag:"$475 ($489 credit card) includes: <br/> 5 (45 minute) private lessons for the bride & groom",amount:5, price:489, image:'/images/weddingcouple.jpg',description:"<ul><li>Learn the proper 5-7 basic steps to your chosen song/li>  <li>Our most budget friendly package</li></ul>"},
  {id:79, name:"Silver package",tag:"$925 ($953 credit card) includes: <br/> 10 (45 minute) private lessons for the bride & groom",amount:10, price:953, image:'/images/weddingcouple.jpg',description:"<ul><li>Learn 10-15 basic steps to your chosen song</li><li>Complimentary choreography to your chosen song</li><li>Learn tricks to bring your first dance to an even higher level</li></ul>"}
  ] as {id:number, name:string, tag:string, amount:number, price:number, image:string, description:string}[];

  // const p1 = {
  //   id:packageArray[0]!.id,
  //   image:packageArray[0]!.image,
  //   eventtype:'Private',
  //   tag:packageArray[0]!.tag,
  //   price:packageArray[0]!.price,
  //   amount:packageArray[0]!.amount,
  //   seat: null,
  //   table: null,
  //   date: null
  // }
  // dispatch(addItem(p1));
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
        <BoxClickable title="What are the special wedding packages?">
        <div className="w-full h-[600px] relative  mb-12 overflow-y-auto ">
        <div className="absolute top-0 left-0 w-full min-h-full  flex flex-col justify-center items-center md:flex-row ">
          {packageArray.map((item, index) => {
            return (
                <div key={"package"+index} className="m-3 p-2  flex flex-col justify-center items-center text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG    shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
                  <h1 className=" text-2xl  text-center   text-shadow  dark:text-shadow-light ">
                    {item.name}
                  </h1>
                  <p className="  text-center" dangerouslySetInnerHTML={{__html:item.tag}}/>
                  <div className='list-disc' dangerouslySetInnerHTML={{__html: item.description}}></div>
                  <Image 
                    className="rounded-md overflow-hidden "
                    src={item.image}
                    width={250}
                    height={250} 
                    alt="Package Image"
                  />
                  <div
                  className="w-full btnFancy my-1 text-base text-center  rounded-md" style={{padding:'0'}}
                  onClick={async() => {
                    let info = await get_package(item.id);
                    // dispatch(addItem({
                    //   id:item.id,
                    //   image:info.image,
                    //   eventtype:'Private',
                    //   tag:info.tag,
                    //   price:info.price,
                    //   amount:info.amount,
                    //   seat: null,
                    //   table: null,
                    //   date: null
                    // }))
                    console.log(info.template)
                    dispatch(addItem({
                    id:packageArray[index]!.id,
                    image:packageArray[index]!.image,
                    eventtype:'Private',
                    tag:packageArray[index]!.tag,
                    price:packageArray[index]!.price,
                    amount:packageArray[index]!.amount,
                    seat: null,
                    table: null,
                    date: null
                  }))}}
                >
                  {'Add to Cart'}
                </div>
                </div>
            );
          })}
        </div>
      </div>
        </BoxClickable>
        <BoxClickable title="Why Take Wedding Dance Lessons?">
          <div className=" w-full  overflow-auto">
            <ol className="list-decimal list-inside">
              <li className="m-2">
                <b>Celebrate Love:</b>
                <br />
                <span>
                  Wedding dances are more than just steps; they're a celebration
                  of love. Imagine swaying gracefully with your partner,
                  surrounded by twinkling lights, as your hearts beat in sync.
                  💖
                </span>
              </li>
              <li className="m-2">
                <b>Confidence Boost:</b>
                <br />
                <span>
                  Navigating the dance floor can be nerve-wracking. But fear
                  not! Our expert instructors will transform you from two left
                  feet to a confident dancer.{' '}
                </span>
              </li>
              <li className="m-2">
                <b>Personalized Choreography:</b>
                <br />
                <span>
                  Your love story is unique, and so should be your dance. We
                  tailor choreography to your personalities, song choice, and
                  comfort level. Whether it's a waltz, salsa, or a quirky
                  mashup, we've got you covered. 🌟
                </span>
              </li>
              <li className="m-2">
                <b>Memorable Moments:</b>
                <br />
                <span>
                  Picture this: your guests' eyes widen as you twirl, dip, and
                  spin. The applause swells, and your love story unfolds on the
                  dance floor. These moments become cherished memories that last
                  a lifetime. 📸
                </span>
              </li>
            </ol>
          </div>
        </BoxClickable>
        <BoxClickable title="Recommended Dances">
          <div className=" w-full  overflow-auto">
            <DanceDetails
              onDanceClick={(dance, videolink) => {
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
              }}
            />
          </div>
        </BoxClickable>
        <BoxClickable title="Recommended Songs">
          <SongDetails
            onDanceClick={(dance, videolink) => {
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
            }}
          />
        </BoxClickable>
        <BoxClickable title="Testimonials from our wedding couples">
        <div className="h-[270px] w-full">
                <Iframe
                  url="https://www.youtube.com/embed/plOgNjCEubo?autoplay=1&amp;&amp;controls=1&amp;loop=0&amp;origin=https%3A%2F%2Fwww.leparidancenter.com&amp;playsinline=1&amp;enablejsapi=1&amp;widgetid=3"
                  width="100%"
                  height="100%"
                  title="Best Dance Studio in New Jersey. Wedding event/ Special events rental.  Dance events in New Jersey."
                  allowFullScreen
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className=""
                  display="block"
                  position="relative"
                />
              </div>
        </BoxClickable>
      </div>
    </PageWrapper>
  );
};

export default page;
