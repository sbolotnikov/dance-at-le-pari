'use client';
import { FC, useState, useRef, useEffect, useContext } from 'react';
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
import {
  ScreenSettingsContextType,
  TPriceOption,
  TTemplateNew,
} from '@/types/screen-settings';
import Image from 'next/image';
import SharePostModal from '@/components/SharePostModal';
import ShowIcon from '@/components/svg/showIcon';
import { SettingsContext } from '@/hooks/useSettings';
import BannerGallery from '@/components/BannerGallery';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const emailRef = useRef<HTMLInputElement>(null);
  const [revealAlert, setRevealAlert] = useState(false);
  const [revealSharingModal, setRevealSharingModal] = useState(false);
  const { events } = useContext(SettingsContext) as ScreenSettingsContextType;
  const [packages, setPackages] = useState<
    {
      tag: string;
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
    }[]
  >([]);
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
      id: 48,
      name: 'Intro package',
      tag: '$110',
      description:
        '<ul><li>Consultation on a dance style to chosen song</li>  <li>Learn the proper basic 2-3 dance steps to your chosen song</li></ul>',
    },
    {
      id: 78,
      name: 'Plus package',
      tag: '$525',
      description:
        '<ul><li>Learn the proper 5-7 basic steps to your chosen song</li><li>Our most budget friendly package</li></ul>',
    },
    {
      id: 79,
      name: 'Premium package',
      tag: '$1000',
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
        let array1 = [];
        let pack1;
        for (let i = 0; i < info.template.length; i++) {
          pack1 = packageArray.find((item) => item.id === info.template[i].id);
          array1.push({
            ...info.template[i],
            name: pack1!.name,
            description2: pack1!.description,
            price1: pack1!.tag,
          });
        }
        setPackages(array1);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex flex-col items-center  justify-start">
      <div className="w-full h-1/5 relative overflow-auto mt-1 md:mt-6  rounded-md">
        {events != undefined && (
          <BannerGallery events={[...events]} seconds={7} />
        )}
      </div>
      <SharePostModal
        title={
          'Page: Offer to new Students FAQ | Dance at Le Pari Studio'
        }
        url={process.env.NEXT_PUBLIC_URL + '/new_students'}
        quote={`Description:  We recognize that it might be confusing to determine how to start Ballroom and Latin social dancing and if you like it overall. Our expert instructors will help you!  \n Click on the link below. \n`}
        hashtag={' NewstudentsOffer FAQ DanceLePariDanceCenter'}
        onReturn={() => setRevealSharingModal(false)}
        visibility={revealSharingModal}
      />
      {revealAlert && <InfoPopup onReturn={onReturn} styling={alertStyle} />}
      <div
        className="blurFilter border-0 rounded-md p-2  shadow-2xl w-[90%] h-[73svh]  max-w-[850px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70  md:m-3"
        // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
      >
        <div className="w-full h-full border relative rounded-md border-lightMainColor dark:border-darkMainColor flex flex-col justify-center items-center overflow-y-auto">
          <div id="containedDiv" className="absolute top-0 left-0 w-full">
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              New students
            </h2>
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              FAQ
            </h2>
            <div className=" h-32 w-32 m-auto">
              <ShowIcon icon={'Puzzled'} stroke={'0.05'} />
            </div>
            <button
              className=" outline-none border-none absolute right-0 top-0  rounded-md  mt-2  w-8 h-8"
              onClick={(e) => {
                e.preventDefault();
                setRevealSharingModal(!revealSharingModal);
                return;
              }}
            >
              <ShowIcon icon={'Share'} stroke={'2'} />
            </button>
            <div className="w-full   rounded-md md:grid md:grid-cols-4 md:gap-2">
              <div className="md:col-start-1 md:col-span-2">
                <Iframe
                  url="https://www.youtube.com/embed/bs9a-2pH8X8?si=peyvsX3q1lE7htXQ?&amp;&amp;controls=1&amp;loop=0&amp;origin=https%3A%2F%2Fwww.leparidancenter.com&amp;playsinline=1&amp;enablejsapi=1&amp;widgetid=3"
                  width="100%"
                  height="100%"
                  className=""
                  title="Best Dance Studio in New Jersey. Wedding event/ Special events rental.  Dance events in New Jersey."
                  allowFullScreen
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  display="block"
                  position="relative"
                />
              </div>
              <p className="text-center flex flex-col justify-start items-center md:col-start-3 md:col-span-2">
                <span>
                  We recognize that it might be confusing to determine how to
                  start Ballroom and Latin dancing and if you like it overall.
                  Our expert instructors will help you! We recognize that all
                  students have different abilities, goals, learning skills, and
                  interests. Our instructors will introduce you to 2-4 dances
                  within thirty (30) minutes and will make sure that your lesson
                  is stress free and fun! We will help you to determine what is
                  best for you: private dance program or group classes or both
                  after lesson (no obligation).
                </span>
                <br />
                <span>Contact us now to schedule an appointment!</span>
                <br />
                <span> *New Students Only </span>
                <span> *Not applicable to wedding/special events</span>
                <span>
                  {' '}
                  *Need to receive payment 24 hours before appointment time.
                </span>
              </p>
            </div>
            <br />
            <div className="w-full m-2  rounded-md md:grid md:grid-cols-3 md:gap-1">
              <p className="text-left flex flex-col justify-start items-center md:col-start-1 md:col-span-2">
                <span>
                  Dance at Le Pari located in Fanwood NJ is a ballroom dance
                  studio that specializes in ballroom and dance instruction.
                </span>
                <br />
                <span>
                  Whether you're completely new to dancing or have some
                  experience, we're excited to help you learn and grow. Our
                  friendly instructors will guide you through the basics, from
                  simple steps to more complex moves. Dancing is a great way to
                  have fun, stay active, and meet new people. Don't worry if you
                  feel unsure at first - everyone starts somewhere! We create a
                  supportive environment where you can learn at your own pace.
                  Ready to give it a try? Come join us and discover the joy of
                  dance! No partner required - just bring your enthusiasm and
                  willingness to learn. 💃🕺
                </span>
              </p>
              <div className="h-[240px] w-[240px] m-auto md:col-start-3 md:col-span-1">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1513.8719849763888!2d-74.39239667245666!3d40.63552797140525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3b097b4d07caf%3A0x3c77409024a4ea95!2sDance%20at%20Le%20Pari%20Dance%20Studio!5e0!3m2!1sen!2sus!4v1711426211014!5m2!1sen!2sus"
                  width="400"
                  height="400"
                  className="h-full w-full"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy={'no-referrer-when-downgrade'}
                />
              </div>
            </div>
            <br />
            <div className="w-full  m-4 rounded-md md:grid md:grid-cols-3 md:gap-2">
              <Image
                src="/images/start learning.webp"
                alt="start learning image"
                width={400}
                height={300}
                className="m-auto drop-shadow-xl border-2 outline-lightMainColor dark:outline-darkMainColor rounded-md md:col-start-1 md:col-span-1"
              />
              <p className="text-left flex flex-col justify-start items-center md:col-start-2 md:col-span-2">
                <span>
                  Join our dance program and begin your dance jorney today!
                </span>
                <br />
                <span>
                  QUESTIONS? CALL, TEXT OR EMAIL{' '}
                  <a href="/mail_page">lepari34@gmail.com</a>
                </span>
                <span>
                  / <a href="tel:1-8482440512">848-244-0512</a>
                </span>
              </p>
            </div>
            <BoxClickable title="What are the special new students packages?">
              <div className="w-full h-[600px] relative  mb-12 overflow-y-auto ">
                <div className="absolute top-0 left-0 w-full min-h-full  flex flex-col justify-center items-end md:flex-row ">
                  {packages.length > 0 &&
                    packages.map((item, index) => {
                      return (
                        <div
                          key={'package' + index}
                          className={`m-3 p-2  flex flex-col justify-center items-center text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md  border-2`}
                        >
                          {item.id == bestPackage && (
                            <p
                              className={`text-red-600  font-DancingScript text-2xl rotate-12 animate-pulse`}
                            >
                              Most popular!!!
                            </p>
                          )}
                          <h1
                            className={`text-2xl  text-center   text-shadow  dark:text-shadow-light`}
                          >
                            {item.name}
                          </h1>

                          <p
                            className="  text-center"
                            dangerouslySetInnerHTML={{
                              __html: `${item.price1} ($${item.options[0].price} credit card) includes: <br/> ${item.options[0].amount} (45 minute) private lessons for new students`,
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
                            stylings="object-contain w-[250px] h-[250px] aspect-square"
                            alt={'Package Image' + index}
                          />
                          <div
                            className="w-full btnFancy my-1 text-base text-center  rounded-md "
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

            <BoxClickable title="Why Take Dance Dance Lessons? Benefits of Dance Lessons">
              <div className=" w-full  overflow-auto">
                <ol className="list-decimal list-inside">
                  <li className="m-2">
                    <b>Celebrate Love:</b>
                    <br />
                    <span>
                      Wedding dances are more than just steps; they're a
                      celebration of love. Imagine swaying gracefully with your
                      partner, surrounded by twinkling lights, as your hearts
                      beat in sync. 💖
                    </span>
                  </li>
                  <li className="m-2">
                    <b>Confidence Boost:</b>
                    <br />
                    <span>
                      Navigating the dance floor can be nerve-wracking. But fear
                      not! Our expert instructors will transform you from two
                      left feet to a confident dancer.{' '}
                    </span>
                  </li>
                  <li className="m-2">
                    <b>Personalized Choreography:</b>
                    <br />
                    <span>
                      Your love story is unique, and so should be your dance. We
                      tailor choreography to your personalities, song choice,
                      and comfort level. Whether it's a waltz, salsa, or a
                      quirky mashup, we've got you covered. 🌟
                    </span>
                  </li>
                  <li className="m-2">
                    <b>Memorable Moments:</b>
                    <br />
                    <span>
                      Picture this: your guests' eyes widen as you twirl, dip,
                      and spin. The applause swells, and your love story unfolds
                      on the dance floor. These moments become cherished
                      memories that last a lifetime. 📸
                    </span>
                  </li>
                </ol>
              </div>
            </BoxClickable>
            <BoxClickable title="What are the requirements in-studio according COVID -19 information?">
              <p className=" w-full  overflow-auto m-2">
                As of December 2022: masks are optional to wear inside of the
                studio during lessons, practice or dance events. Hand sanitizers
                are distributed throughout the studio. Cleaning is being done
                regularly. Sign in is required at front desk to monitor the
                attendance. Thank you for understanding and trying to keep you
                safe.
              </p>
            </BoxClickable>
            <BoxClickable title="What should I wear to class?">
              <p className=" w-full  overflow-auto m-2">
                People will be coming from work or school so you will see a
                variety of outfits ranging from jeans to semiformal. You do want
                to wear nonrestrictive clothing. Something comfortable that will
                not distract your movement.
              </p>
            </BoxClickable>
            <BoxClickable title="What type of shoes should I wear to class?">
              <p className=" w-full  overflow-auto m-2">
                As far as shoes both men and ladies should wear leather or
                smooth bottom shoes. Tennis shoes are not permitted. Rubber
                soled shoes stick to the floor and will not allow you to turn,
                twist, or spin. Ladies: no mules, slip-ons, platforms, or
                flip-flops. Your shoe should have a closed back or straps to
                hold your foot in place. You want a flexible shoe that will stay
                on your foot. Once you become addicted to dancing, we will
                advise you on where to find good dance shoes.
              </p>
            </BoxClickable>
            <BoxClickable title="Do I need to bring a partner?">
              <p className=" w-full  overflow-auto m-2">
                No, you do not have to bring a partner. We try to keep the class
                balanced by monitoring the enrollment to have equal men and
                women in our classes. We also rotate partners so that you learn
                to dance with absolutely anyone.
              </p>
            </BoxClickable>
            <BoxClickable title="What’s a ‘lead’ or a ‘follow’?">
              <p className=" w-full  overflow-auto m-2">
                In partner dancing, one of the partners (the lead) will be the
                one initiating the dance moves and the other partner will follow
                (hence, the name ‘follow’) the move. Traditionally the man is
                the lead and the woman is the follow. That said, if you are a
                man who would like to learn how to follow, or a woman who would
                like to lead, we are happy to accommodate– just let your
                instructor know at the start of class.
              </p>
            </BoxClickable>
            <BoxClickable title="Do you offer gift certificates?">
              <p className=" w-full  overflow-auto m-2">
                Yes! Gift certificates can be purchased in person, over the
                phone, or online.
              </p>
            </BoxClickable>
            <BoxClickable title="What are the benefits of partner dancing?">
              <p className=" w-full  overflow-auto m-2">
                Our students enjoy partner dancing for all kinds of reasons–
                entertainment, meeting new people, relaxation, year-round
                exercise, improving coordination and rhythm, or simply having a
                creative outlet. Mostly it’s just plain fun! All of us here at
                Le Pari Dance Center can attest to the positive mental and
                physical benefits of ballroom dancing. It can literally
                transform your life.
              </p>
            </BoxClickable>
            <BoxClickable title="Dances we teach">
              <p className=" w-full  overflow-auto m-2">
                <span>
                Try as we may to describe these dances in writing, the best way
                to find out what they’re like is to dance them! Try out our
                Introductory Private Evaluation Session, or stop by for one of
                our Saturday dance parties and witness firsthand what all the
                different styles are like. You can also visit our YouTube
                channel to see some of these dance styles. 
                </span>
                <ol className="list-disc list-inside">
                  <li className="m-2">
                    <b>Bachata</b>
                  </li>
                  <li className="m-2">
                    <b>Bolero</b>
                  </li>
                  <li className="m-2">
                    <b>Cha Cha</b>
                  </li>
                  <li className="m-2">
                    <b>Country Two-Step</b>
                  </li>
                  <li className="m-2">
                    <b>East Coast Swing</b>
                  </li>
                  <li className="m-2">
                    <b>Foxtrot</b>
                  </li>
                  <li className="m-2">
                    <b>Hustle</b>
                  </li>
                  <li className="m-2">
                    <b>Merengue</b>
                  </li>
                  <li className="m-2">
                    <b>Milonga</b>
                  </li>
                  <li className="m-2">
                    <b>Night Club Two-Step</b>
                  </li>
                  <li className="m-2">
                    <b>Rumba</b>
                  </li>
                  <li className="m-2">
                    <b>Salsa</b>
                  </li>
                  <li className="m-2">
                    <b>Swing</b>
                  </li>
                  <li className="m-2">
                    <b>Samba</b>
                  </li>
                  <li className="m-2">
                    <b>Tango – Ballroom</b>
                  </li>
                  <li className="m-2">
                    <b>Tango – Argentine</b>
                  </li>
                  <li className="m-2">
                    <b>Viennese Waltz</b>
                  </li>
                  <li className="m-2">
                    <b>Waltz</b>
                  </li>
                  <li className="m-2">
                    <b>West Coast Swing</b>
                  </li> 
                 </ol>   
                 <p className=" w-full  overflow-auto m-2">   
                <p>Descriptions</p>
                <ol className="list-none list-inside">
                  <li className="m-2">
                    <b>Bachata</b>
                    <p>Bachata is a flirtatious Latin dance that
                originated in the Dominican Republic, is widely popular
                throughout the US, Latin America, and is steadily developing
                fans throughout the world. In the Seattle area you will find a
                more contemporary version of this dance being enjoyed. Rather
                than emphasizing footwork as in its more original form, some
                dancers have gravitated to a closer embrace while swirling and
                flowing with their partners. It’s a very ‘hot’ dance with loads
                of hip, rib, and body action and not for the faint of heart.
                When dancing Bachata be prepared for some serious body
                connection well beyond what you’ll find in other dances in the
                Salsa clubs. </p>
                  </li>
                  <li className="m-2">
                    <b>Bolero</b>
                    <p>The Bolero is often called the Cuban Dance
                of Love, although it was originally a Spanish dance with
                Moroccan roots. Contemporary Bolero is generally paired with
                smoother, dreamy music with Spanish vocals and soft percussion.
                This dance successfully blends elements of Waltz, Tango, and
                Rumba. It has similar footwork and timing as the Rumba, but
                incorporates a characteristic rise and fall similar to Waltz.
                It’s slow, graceful, and very romantic.</p>
                  </li>
                  <li className="m-2">
                    <b>Cha Cha</b>
                    <p>The Cha Cha is a
                playful and energetic cousin of the Rumba and Salsa. It evolved
                from a version of Cuban Mambo known as Triple Mambo. To make the
                dance properly fit the music, the triple steps were added
                between the forward/back breaks to fill the slower tempo. There
                is both a club and ballroom version of this dance. The club
                version is one of four popular dances you’ll experience in the
                Salsa scene.</p>
                  </li>
                  <li className="m-2">
                    <b>Country Two-Step</b>
                    <p>Country Two Step is also known as
                the ‘Texas Two Step’ or simply the ‘Two Step’. It is a
                progressive dance that travels around the floor following a
                Quick-Quick-Slow-Slow rhythm. The music is traditionally of a
                country-western variety and is always in 4/4 time. Various open
                and closed positions are used throughout this lively dance.</p>
                  </li>
                  <li className="m-2">
                    <b>East Coast Swing</b>
                    <p>The origins of East Coast Swing (ECS) can be traced
                back to the ‘original swing dance’, the Lindy Hop. In the early
                1940s, the Lindy Hop was simplified by dance schools to become
                the ballroom dance eventually termed East Coast Swing. It is a
                very upbeat dance and is distinguished by its bounce, back break
                (rock step) and swinging hip action. It can be danced to big
                band standards as well as today’s Top 40 hits. Timing of steps
                can single, double, or triple-time to fit the tempo of the
                music. </p>
                  </li>
                  <li className="m-2">
                    <b>Foxtrot</b>
                    <p>It is commonly accepted that Foxtrot took its
                name from its inventor, the vaudeville actor Harry Fox who
                performed various versions of it on stage. Seeing this exciting
                new dance, audience members began to take what they had seen
                onstage and put it to use in the clubs and dance halls of the
                day. The formal hold is rather wide in the elbows and the dance
                is designed to have lots of progression around the dance floor.
                The Foxtrot can be danced to all kinds of music (though most
                commonly to big band styles) and is characterized by smooth,
                laid-back steps. Over time, the Foxtrot split into slow
                (Foxtrot) and quick (Quickstep) versions. </p>
                  </li>
                  <li className="m-2">
                    <b>Hustle</b>
                    <p>Based on older
                dances such as the Mambo, the Hustle originated in Hispanic
                communities in New York City and Florida in the 1970s. This was
                originally a line dance with a Salsa-like foot rhythm, that
                after some fusion with Swing and eventual shortening of the
                count to ‘and 1 2 3′, became the present New York Hustle. It is
                a high energy dance where the couple dances within a ‘spot’ on
                the dance floor. This dance works well with a lot of modern club
                music, not just the great vintage disco music that started it
                all.</p>
                  </li>
                  <li className="m-2">
                    <b>Merengue</b>
                    <p>Merengue is a Latin dance with a two count beat,
                that you’ll often see danced wherever Salsa is danced.
                Merengue’s simplicity paired with the sensual body motion of the
                dance makes it a popular dance with beginners, but allows
                flexibility for more advanced dancers. </p>
                  </li>
                  <li className="m-2">
                    <b>Milonga</b>
                    <p>Originating in
                Buenos Aires, the Milonga is a fast paced dance that preceded
                modern day Argentine Tango. The Milonga places more emphasis on
                feeling the rhythm of the music and keeping the body relaxed.</p>
                  </li>
                  <li className="m-2">
                    <b>Night Club Two-Step</b>
                    <p>Night Club Two Step was developed by Buddy
                Schwimmer in the mid-1960s and quickly became one of the most in
                demand social dances. Night Club is danced to mid-tempo ballads
                and is structured by a Quick-Quick-Slow rhythm. The frame for
                Night Club is more relaxed than the closed position found in the
                ballroom dances, though tone is always essential. Night Club Two
                Step is designed to be danced to songs that don’t fall
                comfortably into the category of Waltz or Rumba.</p>
                  </li>
                  <li className="m-2">
                    <b>Rumba</b>
                    <p>Rumba derives its movements and music from the ‘Son’, a Cuban
                style of music with Spanish guitar, African rhythms and
                percussion instruments. Rumba was introduced to the US in the
                1920s, increased in popularity during the ’30s and ’40s and was
                finally standardized in the mid 1950s. All Latin dances have a
                characteristic hip sway, however it is most pronounced in the
                slow ballroom Rumba. Rumba is the classic romantic Latin dance.</p>
                  </li>
                  <li className="m-2">
                    <b>Salsa</b>
                    <p>Brought to the US in the 1960s, Salsa literally means
                “sauce”—hot, spicy, and full of Latin flavor! Though many get
                caught up in the age old debate as to who ‘invented’ salsa
                (Cubans or Puerto Ricans), the truth of the matter is that Salsa
                is a distillation of many Latin and Afro-Caribbean dances. Two
                of the main styles today are L.A. and N.Y. Salsa. Although each
                emphasizes a different beat, both are a melting pot of Son,
                Cumbia, Guaracha,Merengue and modern beats. New patterns and
                expressions are constantly being added to the menu of options,
                while always keeping the original fiery, spicy attitude of Salsa
                alive. This is one of the most popular social dances in the
                world. </p>
                  </li>
                  <li className="m-2">
                    <b>Samba</b>
                    <p>Samba is believed to have originated on Brazilian
                plantations where European music was mixed with African rhythms.
                This served as a kind of oral history and was danced solo with
                rapid hip movements and quick transfers of weight. Samba came to
                the US in the late 1920s via Carnival and was popularized
                through various films. In the US, Samba evolved into a couple’s
                dance that was standardized as a ballroom dance in 1956, however
                it still remains a solo dance in Brazil. While ballroom Samba is
                different than the Samba danced in the streets in Rio during
                Carnival, they both have the same Afro-Brazilian origins, and
                ballroom Samba is often danced to the same lively Brazilian
                music.</p>
                  </li>
                  <li className="m-2">
                    <b>Swing</b>
                    <p>Please see East Coast Swing or West Coast Swing.</p>
                  </li>
                  <li className="m-2">
                    <b>Tango – Ballroom</b>
                    <p>Ballroom Tango comes from Argentine Tango but
                as it was adopted in Europe and North America in the early 1900s
                it evolved into a dance of its own (eventually with sub-styles:
                ‘International’ and ‘American’). The dance was simplified,
                adapted to the preferences of conventional ballroom dancers, and
                incorporated into the repertoire used in International Ballroom
                dance competitions. Ballroom Tangos use different music and
                styling from Argentine tangos, with more staccato movements and
                the characteristic ‘head snaps’. Ballroom Tangos are passionate,
                dramatic, and performed with a sharp quality of movement. 
                   </p>
                  </li>
                  <li className="m-2">
                    <b>Tango – Argentine</b>
                    <p>Argentine Tango was born in the cultural melting pot
                of Argentina in the late 1800s. Since the dance is almost
                entirely improvisational, there needs to be clear communication
                between partners. It is danced in an embrace that can vary from
                very open to very closed. Closed embrace is often associated
                with the more traditional styles, while open embrace leaves room
                for many of the embellishments and figures that are associated
                with ‘Tango Nuevo’. While there are patterns or sequences of
                steps that are used by instructors to teach the dance, even in a
                sequence every movement is led not only in direction but also
                speed and quality (a step can be smooth, pulsing, sharp, etc.).
                Argentine Tango’s improvisational aspects can make it sometimes
                smooth, and sometimes sharp, but always passionate! It is an
                incredibly expressive form of social dance. </p>
                  </li>
                  <li className="m-2">
                    <b>Viennese Waltz</b>
                    <p>The Viennese Waltz is a rotary dance where the dancers are
                constantly turning either toward their right (natural) or toward
                their left (reverse), interspersed with non-rotating change
                steps to switch the direction of rotation. It is a very rapid,
                traveling form of Waltz. Because of its speed, we recommend you
                get thorough exposure in other ballroom dances before taking on
                this high power, energetic dance. </p>
                  </li>
                  <li className="m-2">
                    <b>Waltz</b>
                    <p>Many attribute the origin of the Waltz to Vienna, where it spread throughout Europe
                in the late eighteenth century. Until that time, court dances
                were usually comprised of elaborate bows and curtsies, with
                little physical contact and proper form was essential. The Waltz
                developed from an Austro-German country dance called the Ländler
                and was the first popular dance to feature the closed position.
                This closer embrace was originally deemed scandalous and
                immoral. Thinking Waltz as ‘scandalous’ today really puts
                history in perspective, especially when you’ve witnessed today’s
                modern Bachata! By the early 1900s the Waltz became a tradition
                of ‘sophisticated gatherings’, and that’s probably when it
                started to become the traditional first dance for wedding
                couples. Danced to music in 3/4 timing, the Waltz is a
                beautiful, graceful, flowing dance with characteristic rise and
                fall that incorporates a wide variety of musical genres. This is
                a great dance for beginners to start out their ballroom
                training. </p>
                  </li>
                  <li className="m-2">
                    <b>West Coast Swing</b>
                    <p>West Coast Swing (WCS) is a partner
                dance derived from Lindy Hop. It is characterized by a
                distinctive elastic look that results from its basic
                extension-compression technique of partner connection, and is
                danced primarily in a ‘slot’ on the dance floor. WCS is arguably
                the most diverse and flexible choice for social dancers due to
                its dance-ability with virtually any genre of music. The
                stylization of WCS will change based on whether the music is
                smooth blues, dynamic hip hop or anything in between. Though the
                initial learning curve is very steep, great rewards lay ahead
                for those who put the time and effort into this very popular and
                expressive social dance. back to top</p>
                  </li>
                 </ol>  
                                     
                </p>
              </p>
            </BoxClickable>
            <BoxClickable title="Famous Songs in each dance">
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
            <BoxClickable title="Testimonials">
              <div className="h-[270px] w-full">
                <Iframe
                  url="https://www.youtube.com/embed/n2YmcaVc2BE?si=UDHNc3iSf2p63tre?autoplay=1&amp;&amp;controls=1&amp;loop=0&amp;origin=https%3A%2F%2Fwww.leparidancenter.com&amp;playsinline=1&amp;enablejsapi=1&amp;widgetid=3"
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
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
