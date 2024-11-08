import { useState, useEffect } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { Day } from './Day';
import { TEventAgenda, TEventArray } from '@/types/screen-settings';
import { useDate } from '@/hooks/useDate';
import Link from 'next/link';
import ImgFromDb from './ImgFromDb';
import { useDimensions } from '@/hooks/useDimensions';
import AgendaItem from './AgendaItem';
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
          console.log(arrayAgenda);
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
  useEffect(()=>{ 
    setNav(JSON.parse(localStorage.getItem('CurrentCalendarMonth')!))
  },[])
  return (
    <div className="w-full h-full  flex flex-col justify-center items-center ">
      <CalendarHeader
        dateDisplay={dateDisplay}
        defaultView={false}
        onNext={() => {setNav(nav + 1); localStorage.setItem('CurrentCalendarMonth', JSON.stringify(nav+1));}}
        onBack={() => {setNav(nav - 1); localStorage.setItem('CurrentCalendarMonth', JSON.stringify(nav-1));}}
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
                  <AgendaItem  key={'agenda_' + index} item={item} index={index}/>
                    
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
