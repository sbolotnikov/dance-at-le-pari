import {
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TEventSchedule, TUser } from '@/types/screen-settings';
import AlertMenu from './alertMenu';
import AnimateModalLayout from './AnimateModalLayout';
import { ContextMenu } from './ContextMenu';
import { useDimensions } from '@/hooks/useDimensions';
import { useOnOutsideClick } from '@/hooks/useOnOutsideClick';
import { PopupContext, PopupContextType } from '@/hooks/usePopupContext';
import { useRouter } from 'next/navigation';

type Props = {
  events: TEventSchedule[];
  role: string;
  onReturn: () => void;
  onEventClick: (n: number) => void;
  onNewEventClick: (
    dateLine: string,
    teacher: number[],
    location: string
  ) => void;
  day: string | undefined;
  users: TUser[];
};
type DisplayEvent = {
  date: string;
  tag: string;
  id: number;
  eventtype: string;
  interval: number | null;
  length: number;
  location: string | null;
  repeating: boolean;
  studentid: number[];
  teachersid: number[];
  until: string | null;
  crossed: number;
  x_shift: number;
  date2: string;
  confirmed: boolean;
  sequence: number;
};
const FullDayScheduleView = ({
  events,
  role,
  users,
  onReturn,
  day,
  onEventClick,
  onNewEventClick,
}: Props) => {
  const [revealAlert, setRevealAlert] = useState(false);
  const router = useRouter();
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
  const [isVisible, setIsVisible] = useState(true);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const inputDate = useRef<HTMLInputElement>(null);
  const [location, setLocation] = useState('Main ballroom');
  const [slots, setSlots] = useState<string[]>([]);
  const [scale1, setScale] = useState(30);
  const [selectedEvents, setSelectedEvents] = useState<TEventSchedule[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<DisplayEvent[]>([]);
  const [teacher, setTeacher] = useState(-1);
  const [initialTouch, setInitialTouch] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isLongPress, setIsLongPress] = useState(false);

  const { isMoving, setIsMoving, item, setItem } = useContext(
    PopupContext
  ) as PopupContextType;
  const [selectedEventItem, setSelectedEventItem] = useState<
    TEventSchedule | undefined
  >(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const windowSize = useDimensions();
  const getColor = (n: number) => {
    let color = users.filter((user) => user.id == n)[0];
    return color?.color ?? '#000';
  };
  const getName = (n: number) => {
    if (users.length == 0) return '';
    let name = users.filter((user) => user.id == n)[0];

    return name.name ?? '';
  };
  const onReturnAlert = async (decision1: string) => {
    setRevealAlert(false);
    if (decision1 == 'Cancel') {
    }
    if (decision1 == 'Delete') {
      fetch('/api/teacher/schedule_event/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedEventItem?.id,
        }),
      }).then(() => {
        window.location.reload();
      });
    }
  };

  useEffect(() => {
    setSelectedEvents(events);
  }, [events]);
  const [widthDiv, setWidthDiv] = useState(0);
  const [heightDiv, setHeightDiv] = useState(0);

  useEffect(() => {
    setHeightDiv(document.getElementById('displayDiv')!.offsetHeight);
    setWidthDiv(document.getElementById('displayDiv')!.offsetWidth);
    console.log(
      'Div height:' + document.getElementById('displayDiv')!.offsetHeight
    );
    console.log(
      'Div width:' + document.getElementById('displayDiv')!.offsetWidth
    );
  }, [windowSize]);
  useEffect(() => {
    if (selectedEvents.length > 0 && users.length > 0) {
      let evArray = selectedEvents
        .filter((event) => event.location == location)
        .sort((a, b) => {
          if (a.date > b.date) return 1;
          else if (a.date < b.date) return -1;
          else return 0;
        });
      let evArray2 = evArray.map((obj) => ({
        ...obj,
        crossed: 0,
        x_shift: -1,
        date2: '',
      }));
      let evArrayFinal = [...evArray2];
      evArrayFinal = [];

      for (let i = 0; i < evArray2.length; i++) {
        let dt = new Date(evArray2[i].date);
        dt.setMinutes(dt.getMinutes() + evArray2[i].length);
        dt = new Date(dt);
        evArray2[i].date2 =
          dt.toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          }) +
          'T' +
          dt.toLocaleTimeString('it-IT').slice(0, -3);
      }
      let counter = 0;
      // getting first uncrossed sequence, then second till runout of records
      do {
        for (let i = 0; i < evArray2.length; i++) {
          evArray2[i].x_shift = counter;
          for (let j = i + 1; j < evArray2.length; j++) {
            if (evArray2[i].date2 <= evArray2[j].date) {
              evArray2[j].x_shift = counter;
              i = j;
            }
            if (j == evArray2.length - 1) i = evArray2.length;
          }
        }
        evArrayFinal = [
          ...evArrayFinal,
          ...evArray2.filter((event) => event.x_shift === counter),
        ];
        evArray2 = evArray2.filter((event) => event.x_shift !== counter);
        counter++;
      } while (evArray2.length > 0);

      evArrayFinal.sort((a, b) => {
        if (a.date > b.date) return 1;
        else if (a.date < b.date) return -1;
        else return 0;
      });
      for (let i = 0; i < evArrayFinal.length; i++) {
        for (let j = i + 1; j < evArrayFinal.length; j++) {
          if (evArrayFinal[i].date2 > evArrayFinal[j].date) {
            evArrayFinal[i].crossed++;
            evArrayFinal[j].crossed++;
          }
        }
      }
      for (let i = 0; i < evArrayFinal.length; i++) {
        for (let j = i + 1; j < evArrayFinal.length; j++) {
          if (
            evArrayFinal[i].date2 > evArrayFinal[j].date &&
            evArrayFinal[i].crossed < evArrayFinal[j].crossed
          ) {
            evArrayFinal[i].crossed = evArrayFinal[j].crossed;
          }
        }
      }

      for (let i = evArrayFinal.length - 1; i >= 0; i--) {
        for (let j = i - 1; j >= 0; j--) {
          if (
            evArrayFinal[i].date < evArrayFinal[j].date2 &&
            evArrayFinal[i].crossed < evArrayFinal[j].crossed
          ) {
            evArrayFinal[i].crossed = evArrayFinal[j].crossed;
          }
        }
      }
      console.log(counter, evArrayFinal);
      for (let i = 0; i < evArrayFinal.length; i++) {
        evArrayFinal[i].crossed++;
        // if (evArrayFinal[i].crossed > counter)
        //   evArrayFinal[i].crossed = counter;
        // if (evArrayFinal[i].crossed == 0) evArrayFinal[i].crossed = 1;
      }
      setDisplayedEvents(evArrayFinal);
    } else setDisplayedEvents([]);
    var elem = document.getElementById('displayDiv');
    elem!.scrollTop = elem!.scrollHeight / 2;
  }, [selectedEvents, location, users]);
  // let date1 = new Date(day! + ' 07:00:00');
  useEffect(() => {
    let slotsArray: string[] = [];
    let minutesInterval = scale1;
    let timeLocal1 = '';
    let hours = 0;
    let minutes = 0;
    for (let i = 0; i < 60 * 24; i = i + minutesInterval) {
      timeLocal1 = i < 12 * 60 ? 'am' : 'pm';
      timeLocal1 = i == 24 * 60 ? 'am' : timeLocal1;
      hours = i % (12 * 60) == 0 ? 12 : Math.floor(i / 60) % 12;
      minutes = i % 60;
      if (hours == 0) hours = 12;
      slotsArray.push(
        `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${timeLocal1}`
      );
    }
    setSlots(slotsArray);
  }, [scale1]);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    isShown: boolean;
  }>({ x: 0, y: 0, isShown: false });

  const [contextMenuItems, setContextMenuItems] = useState<
    { title: string; icon: string | undefined }[]
  >([]);

  // fixing position of the context menu to make it always visible
  useEffect(() => {
    if (contextMenu.isShown) {
      const contextMenuAttributes =
        contextMenuRef.current?.getBoundingClientRect();
      console.log(contextMenuAttributes?.width, contextMenuAttributes?.height);
      let x =
        contextMenuAttributes?.width! + contextMenuAttributes?.x! >
        windowSize.width!
          ? contextMenuAttributes?.x! - contextMenuAttributes?.width!
          : contextMenuAttributes?.x!;
      let y =
        contextMenuAttributes?.height! + contextMenuAttributes?.y! >
        windowSize.height!
          ? contextMenuAttributes?.y! - contextMenuAttributes?.height!
          : contextMenuAttributes?.y!;
      setContextMenu({ x: x, y: y, isShown: true });
    }
  }, [contextMenu.isShown]);

  // open context menu and setting it up
  const handleContextMenu = (
    clientX: number,
    clientY: number,
    timeFrame: number | undefined,
    item: TEventSchedule | undefined
  ) => {
    console.log(item, timeFrame);
    let str = '';
    if (timeFrame != undefined) {
      let h = Math.floor(timeFrame);
      let m = Math.floor((timeFrame % 1) * 60);
      str = day + `T${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}`;
      console.log(h, m, str);
    }
    if (timeFrame != undefined) setSelectedTime(str);
    if (item !== undefined) setSelectedEventItem(item);
    setContextMenu({ x: clientX, y: clientY, isShown: true });
  };

  // handling results of click on Menu
  const handleContextMenuChoice = async (str: string) => {
    console.log(str);
    setContextMenu({ x: 0, y: 0, isShown: false });
    // isMoving, setIsMoving, item, setItem
    // selectedEventItem
    if (str === 'Copy') {
      setItem(selectedEventItem!);
      setIsMoving(false);
      //copy logic
    } else if (str === 'Paste') {
      if (item != null) {
        //    setLoading(true)
        if (isMoving) {
          if (item.id > 0) {
            const res1 = await fetch('/api/teacher/schedule_event/edit', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: item.id,
                data: {
                  date: selectedTime,
                },
              }),
            });
            window.location.reload();
          }
        } else {
          if (item.id > 0) {
             
            const res1 = await fetch('/api/teacher/schedule_event/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify([{
                tag: item.tag,
                eventtype: item.eventtype,
                length: item.length,
                teachersid: item.teachersid,
                studentid: item.studentid,
                location: item.location,
                date: selectedTime,
              }]),
            });
             
            window.location.reload();
          }
        }
      }
      //paste logic
    } else if (str === 'Move') {
      setItem(selectedEventItem!);
      setIsMoving(true);
      //paste logic
    } else if (str === 'Delete') {
      //delete logic
      setRevealAlert(true);
      setAlertStyle({
        variantHead: 'danger',
        heading: 'Delete Event',
        text: 'Are you sure you want to delete this event?',
        color1: 'alert',
        button1: 'Delete',
        color2: 'secondary',
        button2: 'Cancel',
        inputField: '',
      });
    }
  };
  //   close contextMenu on Click outside div using Hook
  useOnOutsideClick(contextMenuRef, () => {
    setContextMenu({ x: 0, y: 0, isShown: false });
  });

  const regularClickHandler = (index: number) => {
    if (role == 'OutTeacher' || role == 'Student') return;
    let time = Math.floor(index * 60);
    let hours = Math.floor(time / 60);

    let minutes = time % 60;
    console.log(teacher);
    onNewEventClick(
      `${day}T${hours < 10 ? '0' : ''}${hours}:${
        minutes < 10 ? '0' : ''
      }${minutes}`,
      teacher !== -1 ? [teacher] : [],
      location
    );
  };
  const contextMenuClickHandler = (
    index: number,
    clientX: number,
    clientY: number
  ) => {
    if (role == 'OutTeacher' || role == 'Student') return;
    setContextMenuItems([{ title: 'Paste', icon: 'Paste' }]);
    handleContextMenu(clientX, clientY, index, undefined);
  };

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (longPressTimer !== null) {
      setLongPressTimer(null);
    }
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, index: number, item1: TEventSchedule | undefined) => {
      e.preventDefault();
      const { clientX, clientY } = e;
      console.log('time', index);
      if (e.button === 2) {
        // Right click
        // showing context menu
        if (item1 == undefined)
          contextMenuClickHandler(index, clientX, clientY);
        else {
          if (role == 'OutTeacher' || role == 'Student') return;
          setContextMenuItems([
            { title: 'Copy', icon: 'Copy' },
            { title: 'Move', icon: 'Move' },
            { title: 'Paste', icon: 'Paste' },
            { title: 'Delete', icon: 'Close' },
          ]);
          handleContextMenu(clientX, clientY, index, item1);
        }
      } else if (e.button === 0) {
        // Left click
        const timer = setTimeout(() => {
          setIsLongPress(true);
          // showing context menu
          if (item1 == undefined)
            contextMenuClickHandler(index, clientX, clientY);
          else {
            if (role == 'OutTeacher' || role == 'Student') return;
            setContextMenuItems([
              { title: 'Copy', icon: 'Copy' },
              { title: 'Move', icon: 'Move' },
              { title: 'Paste', icon: 'Paste' },
              { title: 'Delete', icon: 'Close' },
            ]);
            handleContextMenu(clientX, clientY, index, item1);
          }
        }, 500);
        setLongPressTimer(timer);
      }
    },
    []
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent, index: number, itemId: number) => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
      if (!isLongPress && e.button === 0) {
        if (itemId < 0) regularClickHandler(index);
        else if (role !== 'OutTeacher') onEventClick(itemId);
        // Regular click
      }
      setIsLongPress(false);
    },
    [longPressTimer, isLongPress]
  );

  const handleTouchStart = useCallback(
    (
      e: React.TouchEvent,
      timeIndex: number,
      item1: TEventSchedule | undefined
    ) => {
      e.preventDefault();
      const { clientX, clientY } = e.touches[0];
      console.log('time', timeIndex);
      setInitialTouch({ x: clientX, y: clientY });

      const timer = setTimeout(() => {
        setIsLongPress(true);
        // showing context menu

        if (item1 == undefined)
          contextMenuClickHandler(timeIndex, clientX, clientY);
        else {
          if (role == 'OutTeacher' || role == 'Student') return;
          setContextMenuItems([
            { title: 'Copy', icon: 'Copy' },
            { title: 'Move', icon: 'Move' },
            { title: 'Paste', icon: 'Paste' },
            { title: 'Delete', icon: 'Close' },
          ]);
          handleContextMenu(clientX, clientY, timeIndex, item1);
        }
      }, 500);
      setLongPressTimer(timer);
    },
    []
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent, index: number, itemId: number) => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
      const touch = e.changedTouches[0];
      if (!isLongPress) {
        if (initialTouch!==null) {
          const deltaX = Math.abs(touch.clientX - initialTouch.x);
          const deltaY = Math.abs(touch.clientY - initialTouch.y);

          if (deltaX < 5 && deltaY < 5) {
            if (itemId < 0) regularClickHandler(index);
            else if (role !== 'OutTeacher') onEventClick(itemId);
            // Regular click
          }
        }
        setInitialTouch(null);
        setIsLongPress(false);
      }


    },
    [longPressTimer, isLongPress]
  );

  return (
    <AnimateModalLayout
      visibility={isVisible}
      onReturn={() => {
        onReturn();
      }}
    >
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturnAlert}
        styling={alertStyle}
      />
      <ContextMenu
        items={contextMenuItems}
        contextMenuRef={contextMenuRef}
        isShown={contextMenu.isShown}
        anchorPoint={{ x: contextMenu.x, y: contextMenu.y }}
        onChoice={(s) => handleContextMenuChoice(s)}
      />

      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-xl  flex justify-center items-center flex-col   md:w-full bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
          >
            {/* <span className="font-extrabold text-xl text-left  text-lightMainColor  dark:text-darkMainColor ">
                Schedule for:{' '}
              </span> */}
            <div className="w-full relative">
              <input
                type="date"
                id='dateInput1'
                className="w-full min-w-[95%] mb-2 p-1  outline-none rounded-md text-center bg-lightMainBG dark:bg-darkMainBG"
                value={new Date(day! + 'T07:00:00').toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                })}
                onChange={(e) => {
                  router.replace('/schedule/' + e.target.value);
                }}
              />
              <div className="font-semibold text-md text-center w-[85%] text-lightMainColor outline-none dark:text-darkMainColor bg-lightMainBG dark:bg-darkMainBG absolute top-0 left-0">
                {new Date(day! + 'T07:00:00').toLocaleDateString('en-us', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
            <div className="w-full flex flex-row justify-between items-center">
              <label className="flex flex-col m-auto justify-between items-center">
                Location
                <select
                  className="bg-main-bg mb-2 rounded-md text-ellipsis bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                  }}
                >
                  <option value="Studio A (Front)">Studio A (Front)</option>
                  <option value="Studio B (Back)">Studio B (Back)</option>
                  <option value="Main ballroom">Main ballroom</option>
                </select>
              </label>
              <label className="flex flex-col m-auto justify-between items-center">
                Scale
                <select
                  className="bg-main-bg mb-2 rounded-md text-ellipsis bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                  value={scale1}
                  onChange={(e) => {
                    setScale(parseInt(e.target.value));
                  }}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1h 30min</option>
                </select>
              </label>
            </div>
            <label className="flex flex-col m-auto justify-between items-center">
              Instructor
              <select
                className=" mb-2 rounded-md text-ellipsis  dark:text-darkMainColor text-menuBGColor "
                disabled={role === 'Student' || role === 'OutTeacher'}
                style={{
                  backgroundColor:
                    teacher == undefined || teacher == null
                      ? 'white'
                      : users.filter((user) => user.id == teacher)[0]?.color!,
                }}
                value={teacher!}
                onChange={(e) => {
                  setTeacher(parseInt(e.target.value));
                  if (e.target.value == '-1') {
                    setSelectedEvents(events);
                  } else {
                    setSelectedEvents(
                      events.filter(
                        (event) =>
                          event.teachersid[0] == parseInt(e.target.value) &&
                          event.location == location
                      )
                    );
                    let item = events.filter(
                      (event) => event.teachersid[0] == parseInt(e.target.value)
                    )[0];
                  }
                }}
              >
                <option
                  key={'all teachers'}
                  value={-1}
                  style={{
                    backgroundColor: 'transparent',
                  }}
                >
                  {'All Instructors'}
                </option>
                {users
                  .filter(
                    (user) => user.role === 'Teacher' || user.role === 'Admin'
                  )
                  .sort((a: any, b: any) => {
                    if (a.name > b.name) return 1;
                    else if (a.name < b.name) return -1;
                    else return 0;
                  })
                  .map((item, index) => {
                    return (
                      <option
                        key={'teacher' + index}
                        value={item.id}
                        style={{
                          backgroundColor: item.color ? item.color : '',
                        }}
                      >
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </label>
            <h2 className="text-center italic">
              {'(for more info click on event)'}
            </h2>

            <div
              id="displayDiv"
              className="w-full h-[50svh] relative  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md"
            >
              <div className="absolute top-0 left-0 w-full  flex  overflow-auto">
                <div
                  id="timeSlots"
                  className={` relative w-full flex flex-col justify-center items-center overflow-auto`}
                >
                  {slots &&
                    widthDiv > 0 &&
                    slots.map((d, index) => (
                      <div
                        className={` w-full h-[50px] cursor-pointer border-b border-dashed border-lightMainColor dark:border-darkMainColor  flex flex-col justify-left flex-wrap overflow-hidden`}
                        key={`timeslot ${index}`}
                        style={{ userSelect: 'none' }}
                        onMouseDown={(e) =>
                          handleMouseDown(
                            e,
                            (index / slots.length) * 24,
                            undefined
                          )
                        }
                        onMouseUp={(e) =>
                          handleMouseUp(e, (index / slots.length) * 24, -1)
                        }
                        onTouchStart={(e) =>
                          handleTouchStart(
                            e,
                            (index / slots.length) * 24,
                            undefined
                          )
                        }
                        onTouchEnd={(e) =>
                          handleTouchEnd(e, (index / slots.length) * 24, -1)
                        }
                        onTouchMove={handleTouchMove}
                      >
                        <span>{`${d}`}</span>
                        {/* {day.event && <div className="text-xs" style={{backgroundColor: day.event.color}}>{day.event.title}</div>} */}
                      </div>
                    ))}
                </div>
                {displayedEvents &&
                  displayedEvents.map((item, index) => {
                    return (
                      <div
                        key={'day' + index}
                        className={`text-xs ${
                          role !== 'OutTeacher' && role !== 'Student'
                            ? 'cursor-pointer'
                            : ''
                        } flex flex-row justify-start items-center m-0.5 rounded-md  truncate absolute left-20`}
                        style={{
                          userSelect: 'none',
                          backgroundColor:
                            role !== 'OutTeacher'
                              ? getColor(item.teachersid[0])
                              : 'gray',

                          height: `${(item.length / scale1) * 50}px`,
                          left: `${
                            65 + (item.x_shift / item.crossed) * widthDiv * 0.85
                          }px`,
                          width: `${(widthDiv * 0.85) / item.crossed}px`,

                          top: `${
                            (((parseInt(item.date.split('T')[1].split(':')[0]) *
                              60 +
                              parseInt(item.date.split('T')[1].split(':')[1])) /
                              1440) *
                              50 *
                              24 *
                              60) /
                            scale1
                          }px`,
                        }}
                        // onClick={(e) => {
                        //   e.preventDefault();
                        //   if (role !== 'OutTeacher') onEventClick(item.id);
                        // }}
                        // onContextMenu={(e) => {
                        //   e.preventDefault();
                        //   const { clientX, clientY } = e;
                        // if (role == 'OutTeacher' || role == 'Student') return;
                        // setContextMenuItems([
                        //   { title: 'Copy', icon: 'Copy' },
                        //   { title: 'Move', icon: 'Move' },
                        //   { title: 'Paste', icon: 'Paste' },
                        //   { title: 'Delete', icon: 'Close' },
                        // ]);
                        // handleContextMenu(
                        //   clientX, clientY,
                        //   (index / slots.length) * 24,
                        //   item
                        // );
                        // }}
                        onMouseDown={(e) =>
                          handleMouseDown(e, (index / slots.length) * 24, item)
                        }
                        onMouseUp={(e) =>
                          handleMouseUp(e, (index / slots.length) * 24, item.id)
                        }
                        onTouchStart={(e) =>
                          handleTouchStart(e, (index / slots.length) * 24, item)
                        }
                        onTouchEnd={(e) =>
                          handleTouchEnd(
                            e,
                            (index / slots.length) * 24,
                            item.id
                          )
                        }
                      >
                        {`${role == 'OutTeacher' ? 'Busy' : item.tag}  ${
                          role == 'OutTeacher'
                            ? ''
                            : item.studentid[0] !== undefined
                            ? role == 'Student'
                              ? getName(item.teachersid[0])
                              : item.studentid.length > 0
                              ? getName(item.studentid[0])
                              : ''
                            : ''
                        }` +
                          ' ' +
                          item.eventtype}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
};

export default FullDayScheduleView;
