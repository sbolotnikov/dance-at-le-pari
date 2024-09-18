import { SettingsContext } from '@/hooks/useSettings';
import { ScreenSettingsContextType, TDay } from '@/types/screen-settings';
import Link from 'next/link';
import { useContext } from 'react';
type Props = {
  day: TDay;
  onClick: () => void;
};
export const Day = ({ day, onClick }: Props) => {
  const { darkMode } = useContext(
    SettingsContext
  ) as ScreenSettingsContextType;
  const className = `day ${day.value === 'padding' ? 'padding' : ''} ${
    day.isCurrentDay ? ' border-red-800 border-2 rounded-md' : ''
  }`;
  const classNameDay = `cursor-pointer ${
    day.isCurrentDay ? 'text-red-800 font-extrabold' : ''
  }`;
  console.log(day)
  return (
    <div
      className={className}
      style={{
        flexDirection: 'column',
        width: '13%',
        height: '100px',
        boxSizing: 'border-box',
        margin: '.6429%',
        boxShadow: '0px 0px 3px #CBD4C2',
        display: 'flex',
        flexFlow: 'row',
        alignItems: 'start',
        flexWrap: 'wrap',
        overflow: 'hidden',
        justifyContent: 'left',
      }}
    >
      <span onClick={onClick} className={classNameDay}>
        {day.value === 'padding' ? '' : day.value}
      </span>

      <div className="h-[80px] w-full flex flex-col relative overflow-y-auto">
        <div className=" w-full  flex flex-col absolute top-0 left-0 ">
          {day.event != null &&
            day.event.length > 0 &&
            day.event.map((event, index) => (
              <div key={day.value+'_event_'+index}>
              <Link href={`/events/${event.id}`}>
              <div
                className={`text-xs cursor-pointer flex flex-row justify-start items-center m-0.5 rounded-md ${ event.eventtype == 'Group' ? darkMode?'text-blue-300':'text-blue-700': 'text-red-500'} `}
                //  style={{color: day.event[0].color}}
              >
                <span className={`text-xs mr-1 `}>
                  {new Date(event.date).toLocaleTimeString('en-US', {
                    timeStyle: 'short',
                  })}
                </span>{' '}
                {event.tag}
              </div>
            </Link>
            {index<day.event!.length-1 &&<hr className='border-dotted border-t-1 w-full border-t-lightMainColor dark:border-t-darkMainColor' />}
            </div>
            ))}
            <span className='h-2 w-2'> </span>
        </div>
      </div>

    </div>
  );
};
