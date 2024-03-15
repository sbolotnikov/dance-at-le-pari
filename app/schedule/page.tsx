'use client';
import { FC, useEffect, useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import { PageWrapper } from '../../components/page-wrapper';
import ImgFromDb from '@/components/ImgFromDb';
import { useSession } from 'next-auth/react';
import AlertMenu from '@/components/alertMenu';
import { CalendarHeader } from '@/components/CalendarHeader';
import { TEventSchedule, TEventScheduleArray } from '@/types/screen-settings';
import ShowIcon from '@/components/svg/showIcon';
import { DaySchedule } from '@/components/DaySchedule';
import { useScheduleDate } from '@/hooks/useScheduleDate';
import EditScheduleModal from '@/components/EditScheduleModal';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [revealAlert, setRevealAlert] = useState(false);
  const [revealModal, setRevealModal] = useState(false);
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
  const [events, setEvents] = useState([] as TEventScheduleArray);
  const [selectedEvent, setSelectedEvent] = useState({} as TEventSchedule);
  const [users, setUsers] = useState<
    {
      id: number;
      name: string;
      image: string | null;
      role: string;
      color: string | null;
    }[]
  >([]);
  const { days, dateDisplay } = useScheduleDate(events, nav);
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
  useEffect(() => {
    if (session) {
      setLoading(true);
      fetch('/api/schedule', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setEvents(data);
          fetch('/api/users_info_color', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              setUsers(data);
              setLoading(false);
            });
        });
    }
  }, [session]);

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {loading && <LoadingScreen />}
      {revealAlert && (
        <AlertMenu onReturn={onReturnAlert} styling={alertStyle} />
      )}
      {(revealModal && ((session?.user.role === 'Admin') || session?.user.role === 'Teacher')) && (
        <EditScheduleModal
          visibility={revealModal}
          event={selectedEvent}
          users={users}
          onReturn={async (n, del) => {
            setRevealModal(false);
            let dateArr = [] as string[];
            if (n !== null) {
              setLoading(true);
              let newScheduleArr = [];
              if (n.repeating == true && n.interval! > 0) {
                let dateObj = Date.parse(n.date);
                let newDateOBJ = new Date(dateObj + n.interval!);
                let d =
                  newDateOBJ.toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  }) +
                  'T' +
                  newDateOBJ.toLocaleString('es-CL').split(' ')[1].slice(0, -3);
                let i = 2;
                while (d <= n.until!) {
                  dateArr.push(d);
                  newDateOBJ = new Date(dateObj + i * n.interval!);
                  d =
                    newDateOBJ.toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    }) +
                    'T' +
                    newDateOBJ
                      .toLocaleString('es-CL')
                      .split(' ')[1]
                      .slice(0, -3);
                  i++;
                }
                console.log(dateArr);

                for (let i = 0; i < dateArr.length; i++) {
                  newScheduleArr.push({
                    date: dateArr[i],
                    tag: n.tag,
                    eventtype: n.eventtype,
                    length: n.length,
                    teachersid: n.teachersid,
                    studentid: n.studentid,
                    location: n.location,
                  });
                }
              }
              if (n.id == -1) {
                newScheduleArr.push({
                  date: n.date,
                  tag: n.tag,
                  eventtype: n.eventtype,
                  length: n.length,
                  teachersid: n.teachersid,
                  studentid: n.studentid,
                  location: n.location,
                });
              } else {
                const res = await fetch('/api/teacher/schedule_event/edit', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    id: n.id,
                    data: {
                      date: n.date,
                      tag: n.tag,
                      eventtype: n.eventtype,
                      length: n.length,
                      teachersid: n.teachersid,
                      studentid: n.studentid,
                      location: n.location,
                    },
                  }),
                });
                console.log(res);
              }
              if (newScheduleArr.length > 0) {
                const res1 = await fetch('/api/teacher/schedule_event/create', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify([...newScheduleArr]),
                });
              }
              window.location.reload();
            }
            if (del!==null){
                setLoading(true);
                const res = await fetch('/api/teacher/schedule_event/delete', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({id: del.id})
              });
              window.location.reload();
            }
          }}
        />
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
              <ShowIcon icon={'Schedule'} stroke={'0.1'} />
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
              className="w-full flex text-lightMainBG bg-franceBlue dark:text-franceBlue dark:bg-lightMainBG relative"
            >
              { ((session?.user.role === 'Admin') || session?.user.role === 'Teacher') &&<div
                className="cursor-pointer h-8 w-8 md:h-10 md:w-10 border-2 rounded-md md:-top-12 bg-editcolor m-auto absolute right-1 -top-10"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedEvent({} as TEventSchedule);
                  setRevealModal(true);
                }}
              >
                <ShowIcon icon={'Plus'} stroke={'0.1'} />
              </div>}
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
                  <DaySchedule
                    key={index}
                    day={d}
                    users={users}
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
                    onEventClick={(e) => {
                      setRevealModal(true);
                      setSelectedEvent(
                        events.filter((event) => event.id == e)[0]
                      );
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