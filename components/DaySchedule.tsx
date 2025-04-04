import { TDaySchedule } from '@/types/screen-settings';
type Props = {
  day: TDaySchedule;
  users: { id: number; name: string; color: string | null }[];
  role: string;
  onClick: () => void; 
  onEventClick: (n:number) => void;
};
export const DaySchedule = ({ day, users,role, onClick, onEventClick }: Props) => {
  const className = `day ${day.value === 'padding' ? 'padding' : ''} ${
    day.isCurrentDay ? ' border-red-800 border-2 rounded-md bgFancy' : ''
  }`;
  const classNameDay = `cursor-pointer ${
    day.isCurrentDay ? 'text-red-800 font-extrabold ' : ''
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
                className={`text-xs ${(role!=='OutTeacher')?'cursor-pointer':''} flex flex-row justify-start items-center m-0.5 rounded-md truncate`}
                style={{ backgroundColor: (role!=='OutTeacher')?getColor(event.teachersid[0]):'gray' }}
                onClick={(e)=>{e.preventDefault(); if (role!=='OutTeacher') onEventClick(event.id)}}
              >
                
                  {new Date(event.date).toLocaleTimeString('en-US', {
                    timeStyle: 'short',
                  })}
                {event.tag.length > 0
                  ? ` ${(role=='OutTeacher')?'Busy':event.tag}`
                  : ' ' + ((role=='OutTeacher')?'Busy':(role=='Student')? getName(event.teachersid[0]) : (event.studentid.length>0)?getName(event.studentid[0]):"")}
              </div>
            ))}
            <span className='h-2 w-2'> </span>
        </div>
      </div>
      {/* {(day.event!=null)&&(day.event.length>1) && <div className="text-xs cursor-pointer " onClick={onClick}>{`${day.event.length-1} more event${(day.event.length-1>1)?"s":""}`}</div>} */}
    </div>
  );
};
