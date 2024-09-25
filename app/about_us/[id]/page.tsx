'use client';
import Iframe from 'react-iframe';
import { PageWrapper } from '@/components/page-wrapper';
import { galeryPictures } from '@/utils/galeryPictures';
import Gallery from '@/components/gallery';
import FullScreenGalleryView from '@/components/fullScreenGalleryView';
import sleep from '@/utils/functions';
import { useContext, useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ShowIcon from '@/components/svg/showIcon';
import ImgFromDb from '@/components/ImgFromDb';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import FullScreenTeamView from '@/components/FullScreenTeamView';
import Link from 'next/link';
import { SettingsContext } from '@/hooks/useSettings';
import { useSession } from 'next-auth/react';
import { useDimensions } from '@/hooks/useDimensions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SharePostModal from '@/components/SharePostModal';
import BannerGallery from '@/components/BannerGallery';

export default function Page({ params }: { params: { id: string } }) {
  const tabsArray = [
    'Welcome',
    'Our Team',
    'Studio Tour',
    'Location',
    'Hours ',
  ];
  const imgArray = ['Home', 'Users', 'Home2', 'Location', 'ClockBallroom'];
  const slugArray = ['welcome', 'our-team', 'studio-tour', 'location', 'hours'];
  const pageArray = [
    {
      title: 'Welcome to Studio',
      description:
        'Welcome message to dancers or people who wants to learn how to dance',
      keywords: 'WelcomePage HelloPage WelcomeMessage',
    },
    {
      title: 'Our Professional Team',
      description:
        'Our world-awarded dance instructors specialize in teaching from beginner to advanced levels, adults and kids on all types of dancing: ballroom, latin, argentine tango, hustle, west coast swing, salsa. etc. Specialist of wedding dance instructions. Biography of ballroom, latin, argentine tango, hustle, west coast swing instructors, teachers, manager and owner of dance studio',
      keywords: 'Pro Teachers, Pro Instructor, Pro Ballroom Bio, Teachers',
    },
    {
      title: 'Interior/Exterior tour',
      description:
        'Dance Studio pictures: Inside or Outside tour. Explore our dance studio via pictures & video! Le Pari Dance Center -the place to visit, the place to dance at, the place to learn!',
      keywords: 'StudioInterior, Tour, Interior, Exterior',
    },
    {
      title: 'Our Location',
      description:
        'Close to major roads, free parking. Easy to get to: 34 South Avenue, Fanwood, NJ 07023. Location, directions, address, contact information of the Le Pari Dance Fitness Center',
      keywords: ' Location, Address, Contact',
    },
    {
      title: 'Hours Of Operation',
      description:
        'hours of operation, opening and closing time of the dance center, contact information',
      keywords: 'Hours, Contacts, OpenTime, CloseTime',
    },
  ];
  const selectedTab = slugArray.indexOf(params.id) || null;
  const tabIndex =
    selectedTab !== null && selectedTab >= 0 && selectedTab < 5
      ? selectedTab
      : 0;

  type TTeamMember = {
    id: number;
    name: string;
    image: string | null;
    role: string;
    image2: string | null;
    visible: boolean;
    bio: string;
  };
  const [revealGallery, setRevealGallery] = useState(false);
  const [revealGallery2, setRevealGallery2] = useState(false);
  const { data: session } = useSession();
  const [index, setIndex] = useState(0);
  const picturesArray = [
    '/images/Main ballroom -  side view.webp',
    '/images/Main ballroom - table view.webp',
    '/images/Table arrangements.webp',
    '/images/Front view from road (outside).webp',
    '/images/Parking lot (Back of the Building).webp',
    '/images/Main Ballroom-entrance view.webp',
    '/images/Fitness Room (Studio A).webp',
    '/images/Front Room (Studio B).webp',
    '/images/Kitchen.webp',
  ];

  const windowSize = useDimensions();
  const [alertStyle, setAlertStyle] = useState({
    variantHead: '',
    heading: '',
    text: ``,
    color1: '',
    button1: '',
    color2: '',
    button2: '',
    inputField: '',
  });
  const [users, setUsers] = useState<TTeamMember[]>([]);
  const [team, setTeam] = useState<
    { bio: string; urlData: string; capture: string; role: string }[]
  >([]);
  const [revealAlert, setRevealAlert] = useState(false);

  const router = useRouter();
  const { hours, events } = useContext(
    SettingsContext
  ) as ScreenSettingsContextType;
  const [hoursOfOperation, setHours] = useState<string[] | null>(null);
  const [revealSharingModal, setRevealSharingModal] = useState(false);
  useEffect(() => {
    setHours(hours);
  }, [hours]);
  console.log(hoursOfOperation);
  // const tabsIndexArray = ['Private', 'Group', 'Floor_Fee', 'Party'];

  const onReturn = async (decision1: string, amount: string | null) => {
    setRevealAlert(false);
  };
  useEffect(() => {
    fetch('/api/team_info', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        let arr = data as TTeamMember[];
        let arr2 = [
          ...arr.filter((user) => user.role == 'Owner'),
          ...arr.filter((user) => user.role == 'Admin'),
          ...arr
            .filter((user) => user.role == 'Teacher')
            .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0)),
        ];
        setUsers(arr2);
        console.log(arr2);
        setTeam(
          arr2.map((user) => {
            return {
              bio: user.bio!,
              urlData: user.image!,
              capture: user.name!,
              role: user.role!,
            };
          })
        );
      });
  }, []);

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-start">
      <div className="w-full h-1/5 relative overflow-auto mt-1 md:mt-6  rounded-md">
        {events != undefined && (
          <BannerGallery
            events={[...events]}
            seconds={7}
          />
        )}
      </div>
      {revealGallery && (
        <FullScreenGalleryView
          pictures={picturesArray}
          onReturn={() => {
            sleep(1200).then(() => {
              setRevealGallery(false);
            });
          }}
        />
      )}
      <SharePostModal
        title={pageArray[tabIndex].title + ' | Dance At Le Pari Studio'}
        url={process.env.NEXT_PUBLIC_URL + '/about_us/' + params.id}
        quote={`Description: ${pageArray[tabIndex].description}  \n Click on the link below. \n`}
        hashtag={pageArray[tabIndex].keywords}
        onReturn={() => setRevealSharingModal(false)}
        visibility={revealSharingModal}
      />
      {revealGallery2 && (
        <FullScreenTeamView
          pictures={team}
          index={index}
          onReturn={() => {
            sleep(1200).then(() => {
              setRevealGallery2(false);
            });
          }}
        />
      )}
      <div className="blurFilter border-0 rounded-md p-2  shadow-2xl w-[95%] h-[70svh] md:h-[85svh] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 md:mb-3">
        <Tabs
          selectedIndex={tabIndex}
          className="w-full h-full relative p-1 flex flex-col border rounded-md border-lightMainColor dark:border-darkMainColor"
          onSelect={(index: number) =>
            router.push(`/about_us/${slugArray[index]}`)
          }
        >
          <h2
            className="text-center font-semibold md:text-4xl uppercase mb-5"
            style={{ letterSpacing: '1px' }}
          >
            {pageArray[tabIndex].title}
          </h2>
          <div className=" h-16 w-16 m-auto hidden md:block">
            <ShowIcon icon={imgArray[tabIndex]} stroke={'0.1'} />
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
          <TabList
            className="h-[2.43rem] w-full p-0.5 flex flex-row justify-between items-start flex-wrap rounded-t-md  dark:bg-lightMainBG  bg-darkMainBG"
            style={{
              backgroundImage:
                'linear-gradient(0deg, rgba(63, 62, 211,0.2) 0%, rgba(63, 62, 211,0.2) 16.667%,rgba(73, 92, 210,0.2) 16.667%, rgba(73, 92, 210,0.2) 33.334%,rgba(101, 183, 208,0.2) 33.334%, rgba(101, 183, 208,0.2) 50.001%,rgba(92, 153, 209,0.2) 50.001%, rgba(92, 153, 209,0.2) 66.668%,rgba(82, 122, 209,0.2) 66.668%, rgba(82, 122, 209,0.2) 83.335%,rgba(111, 213, 207,0.2) 83.335%, rgba(111, 213, 207,0.2) 100.002%),linear-gradient(45deg, rgba(63, 62, 211,0.2) 0%, rgba(63, 62, 211,0.2) 16.667%,rgba(73, 92, 210,0.2) 16.667%, rgba(73, 92, 210,0.2) 33.334%,rgba(101, 183, 208,0.2) 33.334%, rgba(101, 183, 208,0.2) 50.001%,rgba(92, 153, 209,0.2) 50.001%, rgba(92, 153, 209,0.2) 66.668%,rgba(82, 122, 209,0.2) 66.668%, rgba(82, 122, 209,0.2) 83.335%,rgba(111, 213, 207,0.2) 83.335%, rgba(111, 213, 207,0.2) 100.002%),linear-gradient(90deg, rgba(63, 62, 211,0.2) 0%, rgba(63, 62, 211,0.2) 16.667%,rgba(73, 92, 210,0.2) 16.667%, rgba(73, 92, 210,0.2) 33.334%,rgba(101, 183, 208,0.2) 33.334%, rgba(101, 183, 208,0.2) 50.001%,rgba(92, 153, 209,0.2) 50.001%, rgba(92, 153, 209,0.2) 66.668%,rgba(82, 122, 209,0.2) 66.668%, rgba(82, 122, 209,0.2) 83.335%,rgba(111, 213, 207,0.2) 83.335%, rgba(111, 213, 207,0.2) 100.002%),linear-gradient(90deg, rgb(118, 34, 211),rgb(55, 13, 228))',
            }}
          >
            {tabsArray.map((item, index) => {
              return (
                <Tab
                  key={item}
                  style={{
                    width:
                      windowSize.width! < 500 && tabIndex != index
                        ? windowSize.width! < 380
                          ? '2.5rem'
                          : '3.5rem'
                        : 'fit-content',
                  }}
                  className={` mt-1 p-1 cursor-pointer outline-0 border ${
                    tabIndex != index
                      ? ` truncate `
                      : 'border-2 md:border-4 border-yellow-600 text-yellow-600 dark:border-yellow-600 dark:text-yellow-600'
                  } rounded-t-lg   text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG`}
                >
                  {item}
                </Tab>
              );
            })}
          </TabList>
          <TabPanel
            className={`w-full h-full relative flex flex-col overflow-auto ${
              tabIndex != 0 ? 'hidden' : ''
            }`}
          >
            <div className="w-full absolute top-0 left-0">
              <div className="w-full rounded-md md:grid md:grid-cols-4 md:gap-2 ">
                <div className="w-full h-[160px] p-2 self-center">
                  <Image
                    src="/images/couple.webp"
                    alt="couple dancing image"
                    width={225}
                    height={150}
                    className=" m-auto drop-shadow-xl border-2 outline-lightMainColor dark:outline-darkMainColor rounded-md "
                  />
                </div>
                <p className="w-full text-left flex justify-start items-center md:col-start-2 md:col-span-3">
                  Dance at Le Pari is located at 34 South Ave. in Fanwood. Dance
                  center is open for community of Fanwood and nearby area
                  residents to explore the beautiful art of ballroom dancing, to
                  meet each other and spend time together within family, friends
                  and community.
                  <br />
                  <br />
                  Name “Le Pari” symbolizes love for ballroom dancing as the
                  city of Paris symbolizes love and romance throughout the
                  world. “Le Pari” is the place uniting everyone who loves to
                  dance.
                  <br />
                  <br />
                  Our beautiful venue has large oak sprung wood floors over
                  4,000 sq. feet with recessed lightning, large sitting area,
                  built-in sound system, separate practice studios, large screen
                  projection television, kitchen area and much more. Dance at Le
                  Pari has qualified experienced instructors much to offer for
                  Fanwood and the surrounding areas!
                  <br />
                  <br />
                </p>
              </div>
              <p className="w-full">
                Dance at Le Pari's goal is to develop friendships and
                relatedness, promote health and fitness, and reach out to a
                diverse group of Fanwood residents by introducing them to the
                possibilities of Ballroom Dancing. “Le Pari” would like to
                present Fanwood community with quality and fun dance
                instruction, entertaining social dance events, and community
                building service projects. Owner, Paul Horvath an amateur dancer
                himself, said, “Ballroom dancing has a way of bringing people
                together.” “Dancing is this art form that involves everyone,
                whether you’re young, old, small or tall,” he said.
                <br />
                <br /> As Paul describes the mission of “Dance at Le Pari” is to
                show love and warmth towards each person that we meet here…He
                said: “We welcome diversity of all kinds! Le Pari is the place
                where everything (status, job, money, nationality, etc.) is put
                aside and people are united by their passion to dance. Le Pari
                is the place to meet new friends and have fun together.” <br />
                <br /> So what can the community of Fanwood can expect from this
                magnificent venue? <br />
                <br />
                Many things such as: <br />
                <br /> <b>Socials:</b> offered to everyone, beginners and/or
                advanced ballroom/latin dancers where people can enjoy DJ hosted
                parties in a welcoming atmosphere. Please check our calendar for
                all social events. <br />
                <br />
                <b>Group and Private classes:</b> for someone to advance or
                start from beginning learning the art of ballroom dancing.{' '}
                <br />
                <br /> <b>Wedding and other special event instructions:</b>
                for couples soon to be married a choreographed routine to their
                song of choice to perform on the most important day of their
                life. First Dance! <br />
                <br />
                <b>Zumba and fitness exercises:</b> offered to provide
                recreational and fitness exercises to community to stay fit.{' '}
                <br />
                <br />
                SO START NOW! DON'T WAIT!{' '}
                <a href="/about_us/hours">CONTACT US!</a>
              </p>
            </div>

            <p className="text-lightMainBG dark:text-darkMainBG text-[0.1rem]">
              {'hello'}
            </p>
          </TabPanel>
          <TabPanel
            className={`w-full  flex flex-col relative overflow-auto ${
              tabIndex != 1 ? 'hidden' : ''
            }`}
          >
            <section
              className="flex flex-col justify-center items-center sm:grid sm:gap-4 mt-2  w-[98%] mx-auto"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              }}
            >
              {users.map((user, i) => {
                return (
                  <div
                    key={'user' + i}
                    className="teamMember m-2 sm:m-0 w-72 grid delay-[800] hover:[transform:rotateY(180deg)] hover:delay-0"
                    style={{
                      aspectRatio: '1 / 1.2',
                      transformStyle: 'preserve-3d',
                      transition: 'all 0.8s ease-in-out',
                    }}
                  >
                    <div
                      className="teamMember overflow-hidden"
                      style={{
                        gridArea: '1/1/2/2',
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      {user.image !== null &&
                      user.image !== '' &&
                      user.image !== undefined ? (
                        <ImgFromDb
                          url={user.image}
                          stylings="w-full h-full object-cover rounded-md"
                          alt="Event Picture"
                        />
                      ) : (
                        <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                          <ShowIcon icon={'Image'} stroke={'2'} />
                        </div>
                      )}
                    </div>
                    <div
                      className="teamMemberBio flex justify-center items-center flex-col outline outline-2 rounded-md border-blue-500 outline-offset-2 bg-[#f1f2f9] color-[#1e1f25]"
                      style={{
                        gridArea: '1/1/2/2',
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      <strong className="font-bold text-4xl text-franceBlue  text-center font-DancingScript text-shadow">
                        {user.name}
                      </strong>
                      <span>
                        {user.role == 'Admin'
                          ? 'Manager'
                          : user.role == 'Teacher'
                          ? 'Dance Instructor'
                          : 'Owner'}
                      </span>
                      <p className="w-72 h-48 text-ellipsis overflow-hidden">
                        {user.bio}
                      </p>
                      <button
                        className="btnFancy font-bold text-xl text-franceBlue font-DancingScript"
                        onClick={() => {
                          setIndex(i);
                          setRevealGallery2(true);
                        }}
                      >
                        {' '}
                        Continue reading...
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>

            <p className="text-lightMainBG dark:text-darkMainBG text-[0.1rem]">
              {'hello'}
            </p>
          </TabPanel>
          <TabPanel
            className={`w-full h-full relative overflow-auto  ${
              tabIndex != 2 ? 'hidden' : ''
            }`}
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="absolute top-0 left-0 w-full flex flex-col justify-center items-center">
              <div className="h-[270px] w-full">
                <Iframe
                  url="https://www.youtube.com/embed/oiF1NnGzUiM?autoplay=1&amp;mute=1&amp;controls=1&amp;loop=0&amp;origin=https%3A%2F%2Fwww.leparidancenter.com&amp;playsinline=1&amp;enablejsapi=1&amp;widgetid=3"
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
              <div
                className="cursor-pointer h-[300px] w-full w-max-[450px] md:h-[450px]  mx-auto md:mt-10 mb-10"
                onClick={() => {
                  setRevealGallery(true);
                }}
              >
                {!revealGallery && windowSize.width != undefined && (
                  <Gallery
                    pictures={galeryPictures}
                    auto={true}
                    seconds={8}
                    width={
                      windowSize.width! < 450
                        ? windowSize.width! + 'px'
                        : '450px'
                    }
                    height={'300px'}
                  />
                )}
              </div>
            </div>
          </TabPanel>

          <TabPanel
            className={`w-full h-full  flex flex-col md:flex-row justify-center items-center relative overflow-y-scroll ${
              tabIndex != 3 ? 'hidden' : ''
            }`}
            style={{ flex: '1 1 100%' }}
          >
            <section className=" absolute top-0 left-0 flex flex-col justify-center items-center  mt-2  w-[98%] mx-auto">
              <div className=" h-52 w-52 m-auto fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                <ShowIcon icon={'Location'} stroke={'0.1'} />
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between w-full h-auto">
                <div
                  className="h-[400px] w-[400px]"
                  style={{ maxWidth: '100%' }}
                >
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
                <div className="p-2 md:p-4">
                  <h2>ADDRESS:</h2>
                  <p>34 South Avenue, Fanwood, NJ 07023</p>

                  <h2>HOURS OF OPERATION:</h2>
                  <a href="/about_us/hours" className="cursor-pointer">
                    click here
                  </a>

                  <h2>PARKING:</h2>
                  <p>ample, free, back of the building (main entrance)</p>
                  <h2>PUBLIC TRANSPORTATION:</h2>
                  <p>
                    Check{' '}
                    <Link href={'https://www.njtransit.com'}>
                      www.njtransit.com
                    </Link>
                  </p>
                  <h2>CONTACT:</h2>
                  <p>
                    <Link href={'/mail_page'}>lepari34@gmail.com</Link> /{' '}
                    <Link href={'tel:1-8482440512'}>848-244-0512</Link>
                  </p>
                </div>
              </div>
              <p>
                Fanwood is a small city in Union County that happens to be close
                to Manhattan, NYC, center of high level dancing. LE PARI's prime
                location allows for easy access via other major freeways like
                the
              </p>
              <ul className="list-disc">
                <li>Garden State Parkway,</li>
                <li>Route 280,</li>
                <li>NJ Turnpike and</li>
                <li>Route 22.</li>
              </ul>
              <p>
                It's located in walking distance (10 min.) from Fanwood train
                station (1/4 mile) which provides service to Penn station in
                Newark, Hoboken Terminal or Penn station in Manhattan.
              </p>
              <p>
                The studio offers a warm and inviting feel with beautiful
                floating dance floor and superior sound system. The main
                ballroom boasts a large open space (75 feet by 40 feet) with
                cozy furniture, a large screen television and recessed lights
                with dimmers, while Studio A & B offers cozy private rooms for
                smaller to medium size groups. When the dancing heats up, the
                studio is ready to push cool air-conditioning backed by
                air-conditioning systems.{' '}
              </p>
              <br />
              <p>
                Please note that LePari Dance Center is located just across the
                street of the kickboxing and pizza locations, next to William
                lift company and Exxon gas station.
              </p>
              ​<br />
              <p>Welcome to Le Pari Dance Center​!</p>
            </section>
          </TabPanel>
          <TabPanel
            className={`w-full  flex  flex-col justify-center items-center relative overflow-y-scroll ${
              tabIndex != 4 ? 'hidden' : ''
            }`}
            style={{ flex: '1 1 100%' }}
          >
            <section className=" absolute top-0 left-0 flex flex-col justify-center items-center  mt-2  w-[98%] mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between w-full h-auto">
                <div className="h-[200px] w-[400px]">
                  <div className=" h-52 w-52 m-auto fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                    <ShowIcon icon={'ClockBallroom'} stroke={'0.05'} />
                  </div>
                </div>
                <p className="text-alertcolor">
                  Our Hours of Operation had been changed. It is updated
                  monthly. So please check on it regularly.{' '}
                </p>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between w-full h-auto">
                <div className="flex flex-col order-2 md:order-none md:w-2/3 justify-start items-center">
                  {' '}
                  Our Hours
                  {hoursOfOperation &&
                    hoursOfOperation.map((hour, i) => {
                      return (
                        <div
                          key={'hours' + i}
                          className="flex justify-between items-center"
                        >
                          {session?.user.role == 'Admin' ? (
                            <input
                              defaultValue={hour}
                              onChange={(e) => {
                                console.log(e.target.value, i);
                                let hoursArr = hoursOfOperation;
                                hoursArr[i] = e.target.value;
                                setHours([...hoursArr]);
                              }}
                            />
                          ) : (
                            <p dangerouslySetInnerHTML={{ __html: hour }} />
                          )}
                          {session?.user.role == 'Admin' && (
                            <button
                              className="h-10 w-10 md:h-12 md:w-12 stroke-alertcolor fill-alertcolor"
                              onClick={(e) => {
                                console.log(i);
                                let hoursArr = hoursOfOperation;
                                hoursArr.splice(i, 1);
                                setHours([...hoursArr]);
                              }}
                            >
                              <ShowIcon icon={'Close'} stroke={'2'} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  {session?.user.role == 'Admin' && (
                    <button
                      className="btnFancy"
                      onClick={() =>
                        setHours([...hoursOfOperation!, 'New Hours'])
                      }
                    >
                      Add
                    </button>
                  )}
                  {session?.user.role == 'Admin' && (
                    <button
                      className="btnFancy"
                      onClick={async () => {
                        const res = await fetch('/api/admin/update_hours', {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            hours: hoursOfOperation!,
                          }),
                        });
                      }}
                    >
                      Save
                    </button>
                  )}
                </div>
                <div className="h-[300px] w-[400px]">
                  <div className=" h-64 w-64 m-auto fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                    <ShowIcon icon={'ClockLatin'} stroke={'0.05'} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between w-full h-auto">
                <div className="h-[200px] w-[400px]">
                  <div className=" h-52 w-52 m-auto fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                    <ShowIcon icon={'CallUs'} stroke={'0.05'} />
                  </div>
                </div>
                <p>
                  Please note that the studio is opened earlier if private
                  lessons are in session. Please give us a call at{' '}
                  <a href="tel:1-8482440512">848-244-0512 (or text)</a> if you
                  would like to come at different time than our hours of
                  operation.
                </p>
              </div>
            </section>
          </TabPanel>
        </Tabs>
      </div>
    </PageWrapper>
  );
}
