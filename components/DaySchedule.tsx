import { TDaySchedule } from '@/types/screen-settings';
import Link from 'next/link';
type Props = {
  day: TDaySchedule;
  users: { id: number; name: string; color: string | null }[];
  onClick: () => void;
};
export const DaySchedule = ({ day, users, onClick }: Props) => {
  const className = `day ${day.value === 'padding' ? 'padding' : ''} ${
    day.isCurrentDay ? ' border-red-800 border-2 rounded-md' : ''
  }`;
  const classNameDay = `cursor-pointer ${
    day.isCurrentDay ? 'text-red-800 font-extrabold' : ''
  }`;
  const getColor = (n: number) => {
    let color = users.filter((user) => user.id == n)[0];
    return color?.color ?? '#000';
  };
  const getName = (n: number) => {
    if (users.length == 0) return '';
    let name = users.filter((user) => user.id == n)[0];
    
    return name.name ?? '';
  };
  return (
    <div
      className={className}
      style={{
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
              <div
                key={day.value + 'day' + index}
                className="text-xs cursor-pointer flex flex-row justify-start items-center m-0.5 rounded-md truncate"
                style={{ backgroundColor: getColor(event.teachersid[0]) }}
                onClick={(e)=>{e.preventDefault(); console.log("EventID:"+event.id)}}
              >
                <span className="text-xs hidden md:block md:m-1">
                  {new Date(event.date).toLocaleTimeString('en-US', {
                    timeStyle: 'short',
                  })}
                </span>
                {event.tag.length > 0
                  ? ' ' + event.tag
                  : ' ' + getName(event.studentid[0])}
              </div>
            ))}
            <span className='h-2 w-2'> </span>
        </div>
      </div>
      {/* {(day.event!=null)&&(day.event.length>1) && <div className="text-xs cursor-pointer " onClick={onClick}>{`${day.event.length-1} more event${(day.event.length-1>1)?"s":""}`}</div>} */}
    </div>
  );
};
