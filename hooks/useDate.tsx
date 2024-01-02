import React, { useEffect, useState } from 'react';
import { TDay, TEventArray } from '@/types/screen-settings';
export const useDate = (events: TEventArray, nav:number) => {
  const [dateDisplay, setDateDisplay] = useState('');
  const [days, setDays] = useState<Array<TDay>>();

  // const eventsForDate = (date:string) =>{let date1= new Date(date); return events.filter(e => ((new Date(e.date)> date1)&&(new Date(e.date)< new Date(date1.setDate(date1.getDate() + 1)))));}
  const eventsForDate = (date:string) =>{
    let arr=events.filter(e => e.date.split('T')[0] === date);
    return arr.sort((a, b) => {
      if (a.date > b.date) return 1;
      else if (a.date < b.date) return -1;
      else return 0;
    })

};
  useEffect(() => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dt = new Date();
    const day = dt.getDate();
    const monthCur = dt.getMonth();
    var year = dt.getFullYear();
    dt= new Date(year, monthCur, 1)
    if (nav !== 0) {
      dt.setMonth(new Date().getMonth() + nav);
    }
    const month=dt.getMonth();
    const firstDayOfMonth = new Date(dt.getFullYear(), month, 1);
    const daysInMonth = new Date(dt.getFullYear(), month + 1, 0).getDate();
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });

    setDateDisplay(`${dt.toLocaleDateString('en-us', {month: 'long'})} ${dt.getFullYear()}`);
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
    let daysArr : Array<TDay> = [];
    year=parseInt(firstDayOfMonth.toLocaleDateString('en-us', {year: 'numeric' }))
    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
      const dayString = `${year}-${(month+1<10)?'0':''}${month + 1}-${(i-paddingDays<10)?'0':''}${i - paddingDays}`;
      if (i > paddingDays) {
        daysArr.push({
          value: (i - paddingDays).toString(),
          event: eventsForDate(dayString),
          isCurrentDay: i - paddingDays === day && nav === 0,
          date: dayString,
        });
      } else {
        daysArr.push({
          value: 'padding',
          event: null,
          isCurrentDay: false,
          date: '',
        });
      }
    }
    if (daysArr.length>35){
      for (let i=35; i<=daysArr.length-1; i++){
        daysArr[i-35]=daysArr[i]
    }
      daysArr.splice(35, daysArr.length-34 )
    
    }
    setDays(daysArr);
  }, [events, nav]);

  return {
    days,
    dateDisplay,
  };
};