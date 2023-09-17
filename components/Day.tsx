import { TDay } from '@/types/screen-settings';
type Props = {
  day: TDay;
  onClick: () => void;
}
export const Day = ( {day, onClick}:Props) => {
    const className = `day ${day.value === 'padding' ? 'padding' : ''} ${day.isCurrentDay ? 'bg-[#e8f4fa]' : ''}`;
    const classNameDay = `${day.isCurrentDay ? 'text-red-800 font-extrabold' : ''}`;
    return (
      <div onClick={onClick} className={className}
      style={{  width: '13%',  height: '100px',
    cursor: 'pointer',  boxSizing: 'border-box',backgroundColor:'bg-[#0C1118]',
    margin: '.6429%',boxShadow: '0px 0px 3px #CBD4C2',display: 'flex',flexDirection: 'column',
    flexWrap: 'wrap', overflow: 'hidden',justifyContent: 'left'}}
      >
        <span className={classNameDay}>{day.value === 'padding' ? '' : day.value}</span>
        {(day.event!=null)&&(day.event.length>0) && <div className="text-xs" style={{color: day.event[0].color}}>{day.event[0].tag}</div>}
        {(day.event!=null)&&(day.event.length>1) && <div className="text-xs">{`${day.event.length-1} more event${(day.event.length-1>1)?"s":""}`}</div>}
        </div>
    );
  }