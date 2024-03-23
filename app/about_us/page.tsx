'use client';
import Iframe from 'react-iframe';
import { PageWrapper } from '@/components/page-wrapper';
import { galeryPictures } from '@/utils/galeryPictures';
import Gallery from '@/components/gallery';
import FullScreenGalleryView from '@/components/fullScreenGalleryView';
import sleep from '@/utils/functions';
import { FC, useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AlertMenu from '@/components/alertMenu';
import { useDimensions } from '@/hooks/useDimensions';
import ShowIcon from '@/components/svg/showIcon';
import { useRouter } from 'next/navigation';
import ImgFromDb from '@/components/ImgFromDb';
import { getTeamImages } from '@/utils/picturemanipulation';
import { TPictureWithCapture } from '@/types/screen-settings';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  // const router = useRouter();
  type TTeamMember = {
    
      id: number;
      name: string;
      image: string | null;
      role: string;
      image2: string | null;
      visible:boolean;
      bio:string;
    
  }
  const [revealGallery, setRevealGallery] = useState(false);
  const [revealGallery2, setRevealGallery2] = useState(false);
  const [index, setIndex] = useState(0)
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
  const [tabIndex, setTabIndex] = useState(0);
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
  const [team, setTeam] = useState<TPictureWithCapture[]>([]);
  const [revealAlert, setRevealAlert] = useState(false);
  const [tabsArray, setTabsArray] = useState([
    'Studio View',
    'Our Team',
    'Location',
    'Hours '
  ]);
  const router = useRouter();
  const windowSize = useDimensions();
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
        let arr =data as TTeamMember[]
        let arr2=[...arr.filter(user =>user.role=="Owner"),...arr.filter(user =>user.role=="Admin"),...arr.filter(user =>user.role=="Teacher").sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))]
        setUsers(arr2);
        
        // getTeamImages(arr2.map((user) => {return{bio: user.bio!, urlData: user.image!, name: user.name!, role: user.role!}})).then((data) =>{
        //   setTeam(data)
        // })
      })
      
      
  },[])
  // useEffect(() => {
  //   document.querySelectorAll('.team-member').forEach((member, index) => {
  //     console.log( member.firstChild!)
  //      });
  // },[document.querySelectorAll('.team-member')])
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {revealGallery && (
        <FullScreenGalleryView
          pictures={null}
          
          onReturn={() => {
            sleep(1200).then(() => {
              setRevealGallery(false);
            });
          }}
        />
      )}
      {/* {revealGallery2 && (
        <FullScreenGalleryView
          pictures={team}
          index={index}
          onReturn={() => {
            sleep(1200).then(() => {
              setRevealGallery2(false);
            });
          }}
        />
      )} */}
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

          <TabList className="h-[2.43rem] w-full p-0.5 flex flex-row justify-start items-start flex-wrap rounded-t-md  dark:bg-lightMainBG  bg-darkMainBG"
          style={{ backgroundImage:'linear-gradient(0deg, rgba(63, 62, 211,0.2) 0%, rgba(63, 62, 211,0.2) 16.667%,rgba(73, 92, 210,0.2) 16.667%, rgba(73, 92, 210,0.2) 33.334%,rgba(101, 183, 208,0.2) 33.334%, rgba(101, 183, 208,0.2) 50.001%,rgba(92, 153, 209,0.2) 50.001%, rgba(92, 153, 209,0.2) 66.668%,rgba(82, 122, 209,0.2) 66.668%, rgba(82, 122, 209,0.2) 83.335%,rgba(111, 213, 207,0.2) 83.335%, rgba(111, 213, 207,0.2) 100.002%),linear-gradient(45deg, rgba(63, 62, 211,0.2) 0%, rgba(63, 62, 211,0.2) 16.667%,rgba(73, 92, 210,0.2) 16.667%, rgba(73, 92, 210,0.2) 33.334%,rgba(101, 183, 208,0.2) 33.334%, rgba(101, 183, 208,0.2) 50.001%,rgba(92, 153, 209,0.2) 50.001%, rgba(92, 153, 209,0.2) 66.668%,rgba(82, 122, 209,0.2) 66.668%, rgba(82, 122, 209,0.2) 83.335%,rgba(111, 213, 207,0.2) 83.335%, rgba(111, 213, 207,0.2) 100.002%),linear-gradient(90deg, rgba(63, 62, 211,0.2) 0%, rgba(63, 62, 211,0.2) 16.667%,rgba(73, 92, 210,0.2) 16.667%, rgba(73, 92, 210,0.2) 33.334%,rgba(101, 183, 208,0.2) 33.334%, rgba(101, 183, 208,0.2) 50.001%,rgba(92, 153, 209,0.2) 50.001%, rgba(92, 153, 209,0.2) 66.668%,rgba(82, 122, 209,0.2) 66.668%, rgba(82, 122, 209,0.2) 83.335%,rgba(111, 213, 207,0.2) 83.335%, rgba(111, 213, 207,0.2) 100.002%),linear-gradient(90deg, rgb(118, 34, 211),rgb(55, 13, 228))' }}
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
            className={`w-full h-full relative overflow-auto ${
              tabIndex != 0 ? 'hidden' : ''
            }`}
            style={{ flex: '1 1 100%',  scrollbarWidth: "none" }}
          >
            <div className="absolute top-0 left-0 w-full">
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
                className="cursor-pointer  w-full h-[400px] flex justify-center items-center m-2 "
                onClick={() => {
                  setRevealGallery(true);
                }}
              >
                {!revealGallery && (
                  <Gallery
                    pictures={galeryPictures}
                    auto={true}
                    seconds={8}
                    width={'500px'}
                    height={'550px'}
                  />
                )}
              </div>
            </div>
          </TabPanel>
          <TabPanel
            className={`w-full  flex relative overflow-y-scroll ${
              tabIndex != 1 ? 'hidden' : ''
            }`}
            style={{ flex: '1 1 100%', }}
          >

<section className="grid gap-4 mb-4 w-full m-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
  {users.map((user, i) => {
    return(
  <div key={"user"+i} className=" w-72 grid cursor-pointer delay-[800] hover:[transform:rotateY(180deg)] hover:delay-0" style={{  aspectRatio: '1 / 1.2', transformStyle: 'preserve-3d' , transition: 'all 0.8s ease-in-out',}}
  onClick={()=>{setIndex(i);setRevealGallery2(true)}}
  >
    <div className="teammember overflow-hidden" style={{gridArea: '1/1/2/2', backfaceVisibility: 'hidden'}}>
     
     {user.image !== null && user.image !== '' && user.image !== undefined ? (
              <ImgFromDb
                url={user.image}
                stylings="w-full h-full object-cover"
                alt="Event Picture"
              />
            ) : (
              <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                <ShowIcon icon={'Image'} stroke={'2'} />
              </div>
            )}
    </div>
    <div className="team-member-bio flex justify-center items-center flex-col outline outline-2 border-blue-500 outline-offset-2 bg-[#f1f2f9] color-[#1e1f25]" style={{gridArea: '1/1/2/2', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden'}}>
 
      <strong className="font-bold text-4xl text-franceBlue  text-center font-DancingScript text-shadow">{user.name}</strong>
      <span>{user.role=="Admin"?"Manager":(user.role=="Teacher")?"Dance Instructor":"Owner"}</span>
      <p className="w-72 h-48 flex-wrap overflow-clip">{user.bio}</p>
    </div>
  </div>
  )})}
 </section>
           





          </TabPanel>
          <TabPanel
            className={`w-full  flex relative overflow-y-scroll ${
              tabIndex != 2 ? 'hidden' : ''
            }`}
            style={{ flex: '1 1 100%' }}
          >
            <h1> Tab 3</h1>
          </TabPanel>
          <TabPanel
            className={`w-full  flex relative overflow-y-scroll ${
              tabIndex != 3 ? 'hidden' : ''
            }`}
            style={{ flex: '1 1 100%' }}
          >
            <h1> Tab 4</h1>
          </TabPanel>
        </Tabs>
      </div>
    </PageWrapper>
  );
};

export default page;
