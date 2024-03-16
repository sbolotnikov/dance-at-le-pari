import { TDay } from '@/types/screen-settings';
import Link from 'next/link';
type Props = {
  day: TDay;
  onClick: () => void;
}
export const Day = ( {day, onClick}:Props) => {
    const className = `day ${day.value === 'padding' ? 'padding' : ''} ${day.isCurrentDay ? ' border-red-800 border-2 rounded-md' : ''}`;
    const classNameDay = `cursor-pointer ${day.isCurrentDay ? 'text-red-800 font-extrabold' : ''}`;
    return (
      <div  className={className}
      style={{  width: '13%',  height: '100px',  boxSizing: 'border-box',
    margin: '.6429%',boxShadow: '0px 0px 3px #CBD4C2',display: 'flex',flexDirection: 'column',
    flexWrap: 'wrap', overflow: 'hidden',justifyContent: 'left'}}
      >
        <span onClick={onClick} className={classNameDay}>{day.value === 'padding' ? '' : day.value}</span>
        {(day.event!=null)&&(day.event.length>0) && <Link href={`/events/${day.event[0].id}`}><div className="text-xs cursor-pointer flex flex-row"
        //  style={{color: day.event[0].color}}
         ><span className="text-xs mr-1">{new Date(day.event[0].date).toLocaleTimeString('en-US',{timeStyle: 'short'})}</span> {day.event[0].tag}</div></Link>}
        {(day.event!=null)&&(day.event.length>1) && <div className="text-xs cursor-pointer " onClick={onClick}>{`${day.event.length-1} more event${(day.event.length-1>1)?"s":""}`}</div>}
        </div>
    );
  }