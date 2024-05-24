'use client';
import { FC, useEffect, useState } from 'react';
import LoadingScreen from '../../../components/LoadingScreen';
import { PageWrapper } from '../../../components/page-wrapper';
import { useSession } from 'next-auth/react';
import AlertMenu from '@/components/alertMenu';
import { CalendarHeader } from '@/components/CalendarHeader';
import { TEventSchedule, TEventScheduleArray } from '@/types/screen-settings';
import ShowIcon from '@/components/svg/showIcon';
import { DaySchedule } from '@/components/DaySchedule';
import { useScheduleDate } from '@/hooks/useScheduleDate';
import EditScheduleModal from '@/components/EditScheduleModal';
import { useDimensions } from '@/hooks/useDimensions';
import sleep from '@/utils/functions';
import FullDayScheduleView from '@/components/FullDayScheduleView';

export default function Page({ params }: { params: { id: string } }) {
  let selectedDate = null;
  if (params.id !== '0') {
    selectedDate = params.id;
  }
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
  const [revealDayView, setRevealDayView] = useState(
    selectedDate !== null ? true : false
  );
  const [clicked, setClicked] = useState<string>(
    selectedDate !== null ? selectedDate : ''
  );
  const windowSize = useDimensions();
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

          // date:"2024-05-23T18:15", eventtype:"Group",id:137,length:45,location:"Main ballroom",studentid:[],tag:"Waltz",teachersid:[2]
          fetch('/api/event/all_get_schedule', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((data2) => {
              console.log([...data2.eventJSON, ...data]);
              setEvents([...data2.eventJSON, ...data]);
            })
            .catch((error) => {
              console.log(error);
            });

          // setEvents(data);
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
  useEffect(() => {
    windowSize.width! > 768 && windowSize.height! > 768
      ? (document.getElementById('icon')!.style.display = 'block')
      : (document.getElementById('icon')!.style.display = 'none');
  }, [windowSize.height]);
  useEffect(() => {
    if (windowSize.width! < 960)
      document.getElementById('container1')!.style.minWidth = '960px';
    else document.getElementById('container1')!.style.width = '100%';
  }, [windowSize.width]);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {loading && <LoadingScreen />}
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturnAlert}
        styling={alertStyle}
      />

      {revealDayView && (
        <FullDayScheduleView
          events={events.filter(
            (e) => e.date.split('T')[0] === clicked!.split('T')[0]
          )}
          users={users}
          day={clicked}
          onReturn={() => {
            sleep(1200).then(() => {
              setRevealDayView(false);
            });
          }}
          onEventClick={(e) => {
            setRevealModal(true);
            setSelectedEvent(events.filter((event) => event.id == e)[0]);
          }}
          onNewEventClick={(dateLine, teachersid, location) => {
            setRevealModal(true);
            setSelectedEvent({
              id: -1,
              date: dateLine,
              tag: '',
              eventtype: 'Private',
              length: 45,
              teachersid,
              studentid: [],
              location,
              interval: null,
              repeating: false,
              until: null,
            });
          }}
        />
      )}
      {revealModal && (
        <EditScheduleModal
          visibility={revealModal}
          event={selectedEvent}
          role={session?.user.role!}
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
            if (del !== null) {
              setLoading(true);
              const res = await fetch('/api/teacher/schedule_event/delete', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: del.id }),
              });
              window.location.reload();
            }
          }}
        />
      )}

      <div className="border-0 rounded-md p-2 mt-6 shadow-2xl w-[95%] h-[70svh] md:h-[85svh] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full   p-2 flex flex-col">
          <h2
            className="text-center font-semibold md:text-4xl uppercase"
            style={{ letterSpacing: '1px' }}
          >
            Personal Schedule Tool
          </h2>
          <div
            id="icon"
            className=" h-20 w-20 md:h-24 md:w-24 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto"
          >
            <ShowIcon icon={'Schedule'} stroke={'0.5'} />
          </div>

          <div className="w-full h-full  flex flex-col relative">
            {(session?.user.role === 'Admin' ||
              session?.user.role === 'Teacher') && (
              <div className="group flex  cursor-pointer  flex-col items-center absolute right-0 -top-8 md:-top-8">
                <div className="  h-6 w-6 md:h-10 md:w-10 relative hover:scale-110 group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
                  <div
                    className="cursor-pointer h-6 w-6 md:h-10 md:w-10 border-2 rounded-md  bg-editcolor m-auto "
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedEvent({} as TEventSchedule);
                      setRevealModal(true);
                    }}
                  >
                    <ShowIcon icon={'Plus'} stroke={'0.1'} />
                  </div>
                </div>
                <p className="hidden tracking-widest mx-3 transition duration-300 ease-in-out absolute -right-4 -bottom-1.5 md:-bottom-4 rounded-md text-center text-editcolor text-[6px] md:text-base md:dark:bg-lightMainBG    opacity-100 group-hover:inline-flex md:block md:opacity-0 md:group-hover:opacity-100 ">
                  Add_Event
                </p>
              </div>
            )}
            <CalendarHeader
              dateDisplay={dateDisplay}
              defaultView={true}
              onNext={() => setNav(nav + 1)}
              onBack={() => setNav(nav - 1)}
              onStyle={(n) => {}}
            />
            <div className="w-full h-full relative overflow-auto border rounded-md border-lightMainColor dark:border-darkMainColor">
              <div id="container1" className={` absolute top-0 left-0`}>
                <div
                  id="weekdays"
                  className="w-full flex text-lightMainBG bg-franceBlue dark:text-franceBlue dark:bg-lightMainBG relative"
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
                <div id="calendar" className="w-full m-auto flex flex-wrap">
                  {days &&
                    days.map((d, index) => (
                      <DaySchedule
                        key={index}
                        day={d}
                        users={users}
                        role={session?.user.role!}
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
                            if (dayStr.length > 3) {
                              setClicked(dayStr);
                              setRevealDayView(true);
                            }
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
        </div>
      </div>
    </PageWrapper>
  );
}
