'use client';
import { FC, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import Schedule from '@/components/Schedule';
import FullDayCalendarView from '@/components/fullDayCalendarView';
import sleep from '@/utils/functions';
import { TEventArray } from '@/types/screen-settings';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [revealDayView, setRevealDayView] = useState(false);
  const [clicked, setClicked] = useState<string>();
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
      <div className="border-0 rounded-md p-2 mt-6 shadow-2xl w-[95%] h-[70svh] md:h-[85%] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full relative  p-2 flex  overflow-y-scroll">
          <div className="flex flex-col w-full p-1 justify-center items-center absolute top-0 left-0">
            <Schedule
              eventsSet={eventsSet!}
              onReturn={(day: string) => {
                setClicked(day);
                setRevealDayView(true);
              }}
            />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
