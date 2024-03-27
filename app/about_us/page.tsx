'use client';
import Iframe from 'react-iframe';
import { PageWrapper } from '@/components/page-wrapper';
import { galeryPictures } from '@/utils/galeryPictures';
import Gallery from '@/components/gallery';
import FullScreenGalleryView from '@/components/fullScreenGalleryView';
import sleep from '@/utils/functions';
import { FC, useContext, useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AlertMenu from '@/components/alertMenu';
import { useDimensions } from '@/hooks/useDimensions';
import ShowIcon from '@/components/svg/showIcon';
import { useRouter, useSearchParams } from 'next/navigation';
import ImgFromDb from '@/components/ImgFromDb';
import { ScreenSettingsContextType, TPictureWithCapture } from '@/types/screen-settings';
import FullScreenTeamView from '@/components/FullScreenTeamView';
import GoogleMapComponent from '@/components/GoogleMapComponent';
import Link from 'next/link';
import { SettingsContext } from '@/hooks/useSettings';
import { useSession } from 'next-auth/react';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const searchParams = useSearchParams()
  const selectedDate = searchParams.get ("tab") || null;
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
  const [tabIndex, setTabIndex] = useState(selectedDate!== null? parseInt(selectedDate) : 0);
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
  const [tabsArray, setTabsArray] = useState([
    'Studio View',
    'Our Team',
    'Location',
    'Hours ',
  ]);
  const { hours } = useContext(
    SettingsContext
  ) as ScreenSettingsContextType;
  const [hoursOfOperation, setHours]= useState<string[] | null>(null);
  useEffect(() => {
    if(hours &&((session?.user.role=="Admin"))){
      setHours(hours);
    } 
  }, [hours]);
  console.log(hoursOfOperation)
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
        //   setTeam(data)
        // })
      });
  }, []);

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
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
      <div className="border-0 rounded-md p-2  shadow-2xl w-[95%] h-[70svh] md:h-[85svh] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md ">
        <Tabs
          selectedIndex={tabIndex}
          className="w-full h-full p-1 flex flex-col border rounded-md border-lightMainColor dark:border-darkMainColor"
          onSelect={(index: number) => setTabIndex(index)}
        >
          <h2
            className="text-center font-bold uppercase"
            style={{ letterSpacing: '1px' }}
          >
            Our Studio
          </h2>
          <div className=" h-16 w-16 m-auto hidden md:block">
            <ShowIcon icon={'Home2'} stroke={'0.1'} />
          </div>

          <TabList
            className="h-[2.43rem] w-full p-0.5 flex flex-row justify-start items-start flex-wrap rounded-t-md  dark:bg-lightMainBG  bg-darkMainBG"
            style={{
              backgroundImage:
                'linear-gradient(0deg, rgba(63, 62, 211,0.2) 0%, rgba(63, 62, 211,0.2) 16.667%,rgba(73, 92, 210,0.2) 16.667%, rgba(73, 92, 210,0.2) 33.334%,rgba(101, 183, 208,0.2) 33.334%, rgba(101, 183, 208,0.2) 50.001%,rgba(92, 153, 209,0.2) 50.001%, rgba(92, 153, 209,0.2) 66.668%,rgba(82, 122, 209,0.2) 66.668%, rgba(82, 122, 209,0.2) 83.335%,rgba(111, 213, 207,0.2) 83.335%, rgba(111, 213, 207,0.2) 100.002%),linear-gradient(45deg, rgba(63, 62, 211,0.2) 0%, rgba(63, 62, 211,0.2) 16.667%,rgba(73, 92, 210,0.2) 16.667%, rgba(73, 92, 210,0.2) 33.334%,rgba(101, 183, 208,0.2) 33.334%, rgba(101, 183, 208,0.2) 50.001%,rgba(92, 153, 209,0.2) 50.001%, rgba(92, 153, 209,0.2) 66.668%,rgba(82, 122, 209,0.2) 66.668%, rgba(82, 122, 209,0.2) 83.335%,rgba(111, 213, 207,0.2) 83.335%, rgba(111, 213, 207,0.2) 100.002%),linear-gradient(90deg, rgba(63, 62, 211,0.2) 0%, rgba(63, 62, 211,0.2) 16.667%,rgba(73, 92, 210,0.2) 16.667%, rgba(73, 92, 210,0.2) 33.334%,rgba(101, 183, 208,0.2) 33.334%, rgba(101, 183, 208,0.2) 50.001%,rgba(92, 153, 209,0.2) 50.001%, rgba(92, 153, 209,0.2) 66.668%,rgba(82, 122, 209,0.2) 66.668%, rgba(82, 122, 209,0.2) 83.335%,rgba(111, 213, 207,0.2) 83.335%, rgba(111, 213, 207,0.2) 100.002%),linear-gradient(90deg, rgb(118, 34, 211),rgb(55, 13, 228))',
            }}
          >
            {tabsArray.map((item, index) => {
              return (
                <Tab
                  key={item}
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
            className={`w-full h-full relative overflow-auto  ${
              tabIndex != 0 ? 'hidden' : ''
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
                className="cursor-pointer h-[300px] w-[300px] md:h-[450px] md:w-[450px] md:mt-10 mb-10"
                onClick={() => {
                  setRevealGallery(true);
                }}
              >
                {!revealGallery && (
                  <Gallery
                    pictures={galeryPictures}
                    auto={true}
                    seconds={8}
                    width={'400px'}
                    height={'300px'}
                  />
                )}
              </div>
            </div>
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
                      
                      transition: 'all 0.8s ease-in-out',
                      
                    }}
                  
                  >
                    <div
                      className="teamMemberFront overflow-hidden"
                      style={{
                        gridArea: '1/1/2/2',
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
                        gridArea: '1/1/2/2'
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
                      <p className="w-72 h-48 flex-wrap overflow-clip">
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
            className={`w-full h-full  flex flex-col md:flex-row justify-center items-center relative overflow-y-scroll ${
              tabIndex != 2 ? 'hidden' : ''
            }`}
            style={{ flex: '1 1 100%' }}
          >
            <div className="h-[400px] w-[400px]">
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
                <p className='cursor-pointer' onClick={(e)=>{e.preventDefault(); window.location.replace("/about_us?tab=3")}}>click here</p>
              
              <h2>PARKING:</h2>
              <p>ample, free, back of the building (main entrance)</p>
              <h2>PUBLIC TRANSPORTATION:</h2>
              <p>
                Check <Link href={'https://www.njtransit.com'}>www.njtransit.com</Link>
              </p>
              <h2>CONTACT:</h2>
              <p>
                <Link href={'/mail_page'}>lepari34@gmail.com</Link> /{' '}
                <Link href={"tel:1-8482440512"}>848-244-0512</Link>
              </p>
            </div>
          </TabPanel>
          <TabPanel
            className={`w-full  flex relative overflow-y-scroll ${
              tabIndex != 3 ? 'hidden' : ''
            }`}
            style={{ flex: '1 1 100%' }}
          >
            <h1 className="flex flex-col justify-start items-center"> Our Hours
            {hoursOfOperation && hoursOfOperation.map((hour, i) => {
              return (
                <div key={"hours"+i} className="flex justify-between items-center my-4">  
                  {(session?.user.role=="Admin")?(
                    <input defaultValue={hour} onChange={(e)=>console.log(e.target.value,i)}/>
                    ):(
                      <p dangerouslySetInnerHTML={{__html:hour}}/>
                      )}
                    {(session?.user.role=="Admin") &&<button className="h-10 w-10 md:h-12 md:w-12 stroke-alertcolor fill-alertcolor" onClick={(e)=>console.log(i)}>
                        <ShowIcon icon={'Close'} stroke={'2'} />
                      </button>}  
                 </div> 
            )})}
            <button className="btnFancy" onClick={()=>setHours([...hoursOfOperation!,"New Hour"])}>Add</button>
            </h1>
          </TabPanel>
        </Tabs>
      </div>
    </PageWrapper>
  );
};

export default page;
