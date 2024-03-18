'use client';
import { FC, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import Schedule from '@/components/Schedule';
import FullDayCalendarView from '@/components/fullDayCalendarView';
import sleep from '@/utils/functions';
import { TEventArray } from '@/types/screen-settings';
import ShowIcon from '@/components/svg/showIcon';
import { useDimensions } from '@/hooks/useDimensions';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [revealDayView, setRevealDayView] = useState(false);
  const [clicked, setClicked] = useState<string>();
  const windowSize = useDimensions();

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
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center ">
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
      <div className="border-0 rounded-md p-2 mt-6 shadow-2xl w-[95%] h-[70svh] md:h-[85svh] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full   p-2 flex flex-col">
          <h2
            className="text-center font-bold uppercase"
            style={{ letterSpacing: '1px' }}
          >
            Calendar
          </h2>
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
