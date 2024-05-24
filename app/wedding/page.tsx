'use client';
import { FC, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/page-wrapper';
import BoxClickable from '@/components/BoxClickable';
import DanceDetails from '@/components/DanceDetails';
import InfoPopup from '@/components/InfoPopup';
import sleep, { get_package } from '@/utils/functions';
import SongDetails from '@/components/SongDetails';
import ImgFromDb from '@/components/ImgFromDb';
import { addItem } from '@/slices/cartSlice';
import Iframe from 'react-iframe';
import { useDispatch } from 'react-redux';
import { TPriceOption, TTemplateNew } from '@/types/screen-settings';
import Image from 'next/image';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const emailRef = useRef<HTMLInputElement>(null);
  const [revealAlert, setRevealAlert] = useState(false);
  const [packages, setPackages] = useState<{tag: string;
    eventtype: string;
    id: number;
    image: string;
    length: number;
    options: TPriceOption[];
    teachersid: number[];
    title: string | null;
    location: string | null;
    description: string | null;
    visible: boolean;
    name: string;
            description2: string;
            price1: string;
  }[]>([]);
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
  const packageArray = [
    {
      id: 37,
      name: 'Intro package',
      tag: '$100',
      description:
        '<ul><li>Consultation on a dance style to chosen song</li>  <li>Learn the proper basic 2-3 dance steps to your chosen song</li></ul>',
    },
    {
      id: 78,
      name: 'Bronze package',
      tag: '$475',
      description:
        '<ul><li>Learn the proper 5-7 basic steps to your chosen song</li><li>Our most budget friendly package</li></ul>',
    },
    {
      id: 79,
      name: 'Silver package',
      tag: '$925',
      description:
        '<ul><li>Learn 10-15 basic steps to your chosen song</li><li>Complimentary choreography to your chosen song</li><li>Learn tricks to bring your first dance to an even higher level</li></ul>',
    },
  ] as {
    id: number;
    name: string;
    tag: string;
    description: string;
  }[];
  const bestPackage = 78;
  useEffect(() => {
    console.log(packageArray.map((item) => item.id));
    get_package(packageArray.map((item) => item.id))
      .then((info) => {
        let array1 =[];
        let pack1;
        for (let i=0; i<info.template.length; i++) {
          pack1= packageArray.find((item) => item.id === info.template[i].id);
          array1.push({
            ...info.template[i],
            name: pack1!.name,
            description2: pack1!.description,
            price1:pack1!.tag
          });

        }
        setPackages(array1);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {revealAlert && <InfoPopup onReturn={onReturn} styling={alertStyle} />}
      <div
        className="border-0 rounded-md p-4  shadow-2xl w-[90%] h-[85svh]  max-w-[850px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md overflow-auto"
        // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
      >
        <h2
            className="text-center font-semibold md:text-4xl uppercase"
            style={{ letterSpacing: '1px' }}
          >
             WEDDING / SPECIAL EVENT
          </h2>
          <h2
            className="text-center font-semibold md:text-4xl uppercase"
            style={{ letterSpacing: '1px' }}
          >
            DANCE LESSONS
          </h2>
        <div className="w-full   rounded-md md:grid md:grid-cols-4 md:gap-2">
          <Image
            src="/images/vendorBadge_AsSeenOnWeb.png"
            alt="The Knot Vendor's Badge"
            width={150}
            height={150}
            className="m-auto"
          />
          <p className="text-center flex justify-start items-center md:col-start-2 md:col-span-3">
            AS A MARRIED COUPLE, YOUR FIRST DANCE SYMBOLIZES THE ETERNAL LOVE,
            UNWAVERING DEVOTION, AND LASTING COMMITMENT THAT WILL ENDURE
            FOREVER!
          </p>
        </div>
        <div className="w-full m-2  rounded-md md:grid md:grid-cols-3 md:gap-1">
          <div className="h-[250px] w-[250px] m-auto">
            <Iframe
              url="https://www.youtube.com/embed/O_y1uix4GkA?autoplay=1&amp;&amp;controls=1&amp;loop=0&amp;origin=https%3A%2F%2Fwww.leparidancenter.com&amp;playsinline=1&amp;enablejsapi=1&amp;widgetid=3"
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
          <p className="text-left flex flex-col justify-start items-center md:col-start-2 md:col-span-2">
            <span>
              Dance at Le Pari located in Fanwood NJ is a ballroom dance studio
              that specializes in wedding dance instruction.
            </span>
            <br />
            <span>
              Our professional dance instructors will help you create the
              perfect dance to the song of your choice for your momentous day!
            </span>
            <br />
            <span>
              Whether you're gliding across the floor in a graceful waltz or
              twirling in the arms of your beloved, our studio is where magic
              happens. Imagine the soft strains of music, the warmth of each
              other's touch, and the promise of forever woven into every step.
              Here, we don't just teach dance; we choreograph your love story.
              So, let's sway, spin, and create memories that will last a
              lifetime. Are you ready to dance your way into forever? 💃🕺
            </span>
          </p>
        </div>
        <div className="w-full  m-4 rounded-md md:grid md:grid-cols-3 md:gap-2">
          <p className="text-left flex flex-col justify-start items-center md:col-start-1 md:col-span-2">
            <span>
              Our skilled instructors will also choreograph dances for parents,
              bridesmaids, groomsmen, father-daughter or mother-son dances! Join
              our dance program and begin your happily ever after today!
            </span>
            <br />
            <span>
              QUESTIONS? CALL, TEXT OR EMAIL <a href="/mail_page">lepari34@gmail.com</a> 
            </span>
            <span>/ <a href="tel:1-8482440512">848-244-0512</a></span>
          </p>
          <Image
            src="/images/Wedding Kiss.webp"
            alt="wedding kiss image"
            width={225}
            height={150}
            className="m-auto drop-shadow-xl border-2 outline-lightMainColor dark:outline-darkMainColor rounded-md"
          />
        </div>
        <BoxClickable title="What are the special wedding packages?">
          <div className="w-full h-[600px] relative  mb-12 overflow-y-auto ">
            <div className="absolute top-0 left-0 w-full min-h-full  flex flex-col justify-center items-end md:flex-row ">
              {packages.length > 0 &&
                packages.map((item, index) => {
                  return (
                    <div
                      key={'package' + index}
                      className={`m-3 p-2  flex flex-col justify-center items-center text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md ${
                        item.id == bestPackage ? 'border-red-600' : ''
                      } border-2`}
                    >
                      {item.id == bestPackage && (
                        <p
                          className={`text-red-600  font-DancingScript text-2xl rotate-12 animate-pulse`}
                        >
                          Most popular!!!
                        </p>
                      )}
                      <h1
                        className={`text-2xl  text-center   text-shadow  dark:text-shadow-light ${
                          item.id == bestPackage ? 'text-red-600' : ''
                        }`}
                      >
                        {item.name}
                      </h1>

                      <p
                        className="  text-center"
                        dangerouslySetInnerHTML={{
                          __html: `${item.price1} ($${item.options[0].price} credit card) includes: <br/> ${item.options[0].amount} (45 minute) private lessons for the bride & groom`,
                        }}
                      />
                      <div
                        className="list-disc"
                        dangerouslySetInnerHTML={{
                          __html: item.description2,
                        }}
                      ></div>
                      <ImgFromDb
                        url={item.image}
                        stylings="object-contain w-[250px] h-[250px]"
                        alt={'Package Image' + index}
                      />
                      <div
                        className="w-full btnFancy my-1 text-base text-center  rounded-md"
                        style={{ padding: '0' }}
                        onClick={async () => {
                          // let info = await get_package(item.id);
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
                          // console.log(info.template)
                          dispatch(
                            addItem({
                              id: item.id,
                              image: item.image,
                              eventtype: 'Private',
                              tag: item.tag,
                              price: item.options[0].price,
                              amount: item.options[0].amount,
                              seat: null,
                              table: null,
                              date: null,
                            })
                          );
                        }}
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
