'use client';
import { FC, useEffect, useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import { PageWrapper } from '../../components/page-wrapper';
import ImgFromDb from '@/components/ImgFromDb';
import { useSession } from 'next-auth/react';
import AlertMenu from '@/components/alertMenu';
import { CalendarHeader } from '@/components/CalendarHeader';
import { Day } from '@/components/Day';
import { TEventArray } from '@/types/screen-settings';
import { useDate } from '@/hooks/useDate';
import ShowIcon from '@/components/svg/showIcon';
// import CopyPasteModal from './CopyPasteModal';
// type Props = {
//   eventsSet: TEventArray;
//   onReturn: (day: string) => void;
// };

// const Schedule = ({ eventsSet, onReturn }: Props) => {

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [revealAlert, setRevealAlert] = useState(false);
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
  const [nav, setNav] = useState(0);
  const [events, setEvents] = useState([] as TEventArray);
  const { days, dateDisplay } = useDate(events, nav);
  const weekdayName = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const monthSet = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  //   useEffect(() => {
  //     setEvents(eventsSet);
  //   }, [eventsSet]);
  const onReturnAlert = (decision1: string, inputValue: string | null) => {
    setRevealAlert(false);
    console.log(decision1, inputValue);
    window.location.reload();
  };
  const { data: session } = useSession();
  useEffect(() => {}, []);

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {loading && <LoadingScreen />}
      {revealAlert && (
        <AlertMenu onReturn={onReturnAlert} styling={alertStyle} />
      )}
      <div className="   shadow-2xl w-[90%]  max-w-[1000px] md:w-full h-[70svh] md:h-[90%] bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md border-0 rounded-md  p-2 mt-6">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full relative  p-1 flex  overflow-y-scroll">
          <div className="flex flex-col w-full p-1 justify-center items-center absolute top-0 left-0">
          <h2
              className="text-center font-bold uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Scheduling Tool
            </h2>
            <div className=" h-20 w-20 md:h-28 md:w-28 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto">
              <ShowIcon icon={'Calendar'} stroke={'0.1'} />
            </div>
            <CalendarHeader
              dateDisplay={dateDisplay}
              defaultView={true}
              onNext={() => setNav(nav + 1)}
              onBack={() => setNav(nav - 1)}
              onStyle={(n) => {}}
            />
            <div
              id="weekdays"
              className="w-full flex text-lightMainBG bg-franceBlue dark:text-franceBlue dark:bg-lightMainBG"
            >
              {weekdayName.map((item, i) => {
                return (
                  <div
                    key={`dayOfWeek${i}`}
                    className="w-[14.2857%] m-0 text-center truncate"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </div>
                );
              })}
            </div>
            <div id="calendar" className="w-full m-auto flex flex-wrap">
              {days &&
                days.map((d, index) => (
                  <Day
                    key={index}
                    day={d}
                    onClick={() => {
                      if (d.value !== 'padding') {
                        let dt = new Date();
                        dt.setMonth(new Date().getMonth() + nav);
                        let dayStr =
                          dt.toISOString().split('-')[0] +
                          '-' +
                          dt.toISOString().split('-')[1] +
                          '-';
                        parseInt(d.value) < 10
                          ? (dayStr += '0' + d.value)
                          : (dayStr += d.value);
                        console.log(dayStr);
                      }
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
