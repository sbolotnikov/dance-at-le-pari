'use client';
import { FC, useContext, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import Schedule from '@/components/Schedule';
import FullDayCalendarView from '@/components/fullDayCalendarView';
import sleep from '@/utils/functions';
import { ScreenSettingsContextType, TEventArray } from '@/types/screen-settings';
import ShowIcon from '@/components/svg/showIcon';
import { useDimensions } from '@/hooks/useDimensions';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SharePostModal from '@/components/SharePostModal';
import BannerGallery from '@/components/BannerGallery';
import { SettingsContext } from '@/hooks/useSettings';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [revealDayView, setRevealDayView] = useState(false);
  const [revealSharingModal, setRevealSharingModal] = useState(false);
  const [clicked, setClicked] = useState<string>();
  const { data: session } = useSession();
  const windowSize = useDimensions();
  const router = useRouter();
  const { events } = useContext(
    SettingsContext
  ) as ScreenSettingsContextType;
  const [eventsSet, setEventsSet] = useState<TEventArray>([]);
  useEffect(() => {
    // GET request

    fetch('/api/event/allget', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEventsSet(data.eventJSON);
        console.log(data.eventJSON);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    windowSize.width! > 768 && windowSize.height! > 768
      ? (document.getElementById('icon')!.style.display = 'block')
      : (document.getElementById('icon')!.style.display = 'none');
  }, [windowSize.height, eventsSet]);
  // {color:"#e09c6b",date:'2023-09-09T19:00:00',tag:"Party", id:0},{color:"#612326",date:'2023-09-18T19:00:00',tag:"Group", id:1},{color:"#35da9b",date:'2023-09-18T14:00:00',tag:"early Party", id:2}, {color:"#6123f6",date:'2023-09-18T18:00:00',tag:"Cha-Cha", id:3},{color:"#9c15e4",date:'2023-09-18T15:00:00',tag:"Bachata", id:4}
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex flex-col items-center  justify-start">
      
      <SharePostModal
        title={'Page: Calendar | Dance at Le Pari Studio'}
        url={process.env.NEXT_PUBLIC_URL + '/calendar'}
        quote={`Description: Dance Events in New Jersey! Best Dance Studio in NJ with many dance options.  You want to have fun, go out dancing or find smth different to do, come to us! We offer dance events running every week as well as many dance classes to join! Dance Events and Dance Classes Calendar. \n Click on the link below. \n`}
        hashtag={
          ' DanceAtLePariCalendar EventsCalendar DanceCalendar  LePariDanceCenter'
        }
        onReturn={() => setRevealSharingModal(false)}
        visibility={revealSharingModal}
      />
      {revealDayView && (
        <FullDayCalendarView
          events={eventsSet.filter(
            (e) => e.date.split('T')[0] === clicked!.split('T')[0]
          )}
          day={clicked}
          onReturn={() => {
            sleep(1200).then(() => {
              setRevealDayView(false);
            });
          }}
        />
      )}
      <div className="blurFilter border-0 rounded-md p-2 mt-16 shadow-2xl w-[95%] h-[75svh] md:h-[85svh] max-w-[90rem] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 md:mb-3">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full   p-2 flex flex-col relative">
          <h2
            className="text-center font-semibold text-2xl md:text-4xl uppercase"
            style={{ letterSpacing: '1px' }}
          >
            Calendar
          </h2>
          <button
            className=" outline-none border-none absolute right-0 top-0  rounded-md  w-8 h-8"
            onClick={(e) => {
              e.preventDefault();
              setRevealSharingModal(!revealSharingModal);
              return;
            }}
          >
            <ShowIcon icon={'Share'} stroke={'2'} />
          </button>
          {(session?.user.role === 'Admin' ||
            session?.user.role === 'Teacher') && (
            <div className="group flex  cursor-pointer  flex-col items-center justify-center absolute left-16 md:right-16 top-7 md:top-5  md:left-auto">
              <div className="  h-6 w-6 md:h-10 md:w-10 relative hover:scale-110 group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
                <div
                  className="cursor-pointer h-6 w-6 md:h-10 md:w-10 border-2 rounded-full  bg-editcolor m-auto "
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/admin/eventedit');
                  }}
                >
                  <ShowIcon icon={'Plus'} stroke={'0.1'} />
                </div>
              </div>
              <p className="hidden tracking-widest mx-3 transition duration-300 ease-in-out absolute -right-4 -bottom-1.5 md:-bottom-4 rounded-md text-center text-editcolor text-[6px] md:text-base md:dark:bg-lightMainBG    opacity-100 group-hover:inline-flex md:block md:opacity-0 md:group-hover:opacity-100 ">
                Add.Events
              </p>
            </div>
          )}
          <div
            id="icon"
            className=" h-20 w-20 md:h-28 md:w-28 fill-lightMainColor stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto"
          >
            <ShowIcon icon={'Calendar'} stroke={'0.1'} />
          </div>

          <Schedule
            eventsSet={eventsSet!}
            onReturn={(day: string) => {
              setClicked(day);
              setRevealDayView(true);
            }}
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
