import { useState, useEffect, useContext, FC } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { Day } from './Day';
import { TEventArray } from '@/types/screen-settings';
// import { NewEventModal } from './NewEventModal';
// import { EditEventModal } from './EditEventModal';
import AlertMenu from './alertMenu';
import { useDate } from '@/hooks/useDate';
// import CopyPasteModal from './CopyPasteModal';
type Props = {
  eventsSet: TEventArray;
  onReturn: (day:string) => void
}

const Schedule = ({ eventsSet, onReturn }:Props) =>{

  const [nav, setNav] = useState(0);
  
  const [visCopyPaste, setVisCopyPaste] = useState(false);
  const [events, setEvents] = useState(eventsSet);
  const [revealAlert, setRevealAlert] = useState(false);
  const [alertStyle, setAlertStyle] = useState({});
  const { days, dateDisplay } = useDate(events, nav);
  const weekdayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
  
  return (
    <div className="w-full flex flex-col overflow-y-auto">
          <CalendarHeader
            dateDisplay={dateDisplay}
            onNext={() => setNav(nav + 1)}
            onBack={() => setNav(nav - 1)}
          />
          <div id="weekdays" className="w-full flex text-lightMainBG bg-franceBlue dark:text-franceBlue dark:bg-lightMainBG">
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
                      let dayStr=dt.toISOString().split('-')[0]+'-'+dt.toISOString().split('-')[1]+'-';
                      (parseInt(d.value)<10)?dayStr+="0"+d.value:dayStr+=d.value;
                      onReturn(dayStr);
                    }
                  }}
                />
              ))}
        </div>
    </div>
  );
}

export default Schedule;
