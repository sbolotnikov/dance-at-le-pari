import { useState, useEffect } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { Day } from './Day';
import { TEventAgenda, TEventArray } from '@/types/screen-settings';
import { useDate } from '@/hooks/useDate';
import Link from 'next/link';
import ImgFromDb from './ImgFromDb';
import { useDimensions } from '@/hooks/useDimensions';
// import CopyPasteModal from './CopyPasteModal';
type Props = {
  eventsSet: TEventArray;
  onReturn: (day: string) => void;
};

const Schedule = ({ eventsSet, onReturn }: Props) => {
  const [nav, setNav] = useState(0);
  const [agendaEvents, setAgendaEvents] = useState<TEventAgenda[]>([]);
  const [events, setEvents] = useState(eventsSet);
  const [revealAlert, setRevealAlert] = useState(false);
  const [agendaView, setAgendaView] = useState(false);
  const [alertStyle, setAlertStyle] = useState({});
  const { days, dateDisplay } = useDate(events, nav);
  const windowSize = useDimensions();
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
  useEffect(() => {
    setEvents(eventsSet);
  }, [eventsSet]);

  useEffect(() => {
    if (agendaView) {
      fetch('/api/event/allagenda', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let arrayAgenda = data.eventJSON;
          arrayAgenda.sort((a: any, b: any) =>
            a.date > b.date ? 1 : b.date > a.date ? -1 : 0
          );
          setAgendaEvents(arrayAgenda);
        })
        .catch((error) => {
          console.log(error);
        });
      console.log('Agenda view needs data');
    }
  }, [agendaView]);
  useEffect(() => {
    if ((windowSize.width! < 960)&&(!agendaView))   
     document.getElementById('container1')!.style.minWidth='960px'
    else document.getElementById('container1')!.style.minWidth='0px'

  }, [windowSize.width, agendaView]);
  return (
    <div className="w-full h-full  flex flex-col justify-center items-center ">
      <CalendarHeader
        dateDisplay={dateDisplay}
        defaultView={false}
        onNext={() => setNav(nav + 1)}
        onBack={() => setNav(nav - 1)}
        onStyle={(n) => setAgendaView(n)}
      />
      <div className="w-full h-full relative overflow-auto border rounded-md border-lightMainColor dark:border-darkMainColor">
        <div id="container1" className={`w-full absolute top-0 left-0`}>
          {!agendaView && (
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
          )}

          {!agendaView ? (
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
                        onReturn(dayStr);
                      }
                    }}
                  />
                ))}
            </div>
          ) : (
              <div className="w-full h-full absolute top-0 right-0">
                {agendaEvents.map((item, index) => (
                  <div
                    key={'agenda_' + index}
                    className=" w-full  grid grid-cols-6 "
                  >
                    <div className="col-span-2 border-y border-l dark:border-darkMainColor border-lightMainColor">
                      <div className="flex flex-col justify-start items-start ml-1">
                        <h3 className="text-left text-2xl font-bold ">
                          {new Date(item.date).toLocaleDateString('en-us', {
                            day: 'numeric',
                          })}
                        </h3>
                        <h4 className="text-left text-lg ">
                          {new Date(item.date).toLocaleDateString('en-us', {
                            month: 'long',
                          })}
                        </h4>
                        <h4 className="text-left text-lg ">
                          {new Date(item.date).toLocaleDateString('en-us', {
                            weekday: 'long',
                          })}
                        </h4>
                      </div>
                    </div>
                    <Link
                      href={'/events/' + item.id}
                      className="col-span-4 grid grid-cols-4 cursor-pointer border dark:border-darkMainColor border-lightMainColor"
                    >
                      <div className="  md:order-1 md:col-span-1 hidden md:block  ml-1">
                        {new Date(item.date).toLocaleTimeString('en-us', {
                          timeStyle: 'short',
                        })}
                        -{' '}
                        {new Date(
                          new Date(item.date).getTime() + item.length * 60000
                        ).toLocaleTimeString('en-us', {
                          timeStyle: 'short',
                        })}
                      </div>
                      <div className="col-span-4 order-1 md:order-2 md:col-span-3 md:border-l dark:border-darkMainColor border-lightMainColor flex flex-col p-1">
                        <h3 className="text-left font-bold">
                          {item.eventtype +
                            ' ' +
                            item.tag +
                            (item.teacher != null && item.teacher.length > 0
                              ? ` by ${item.teacher}`
                              : ' ')}
                        </h3>
                        <h3 className=" text-left  ml-1 md:hidden">
                          {new Date(item.date).toLocaleTimeString('en-us', {
                            timeStyle: 'short',
                          })}
                          -{' '}
                          {new Date(
                            new Date(item.date).getTime() + item.length * 60000
                          ).toLocaleTimeString('en-us', {
                            timeStyle: 'short',
                          })}
                        </h3>
                        <h3 className="text-left">{item.description}</h3>
                        <h3 className="text-left">{`Price: ${item.eventtype=="Group"?"from":" "} $ ${item.minprice}` }</h3>
                        <ImgFromDb
                          url={item.image!}
                          stylings="object-contain m-auto"
                          alt="Event Picture"
                        />
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
