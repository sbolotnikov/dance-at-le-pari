import { MouseEvent, useEffect, useRef, useState } from 'react';
import { TEventSchedule } from '@/types/screen-settings';
import AlertMenu from './alertMenu';
import AnimateModalLayout from './AnimateModalLayout';
import { ContextMenu } from './ContextMenu';
import { useDimensions } from '@/hooks/useDimensions';
import { useOnOutsideClick } from '@/hooks/useOnOutsideClick';
type User = {
  id: number;
  name: string;
  image: string | null;
  role: string;
  color: string | null;
};
type Props = {
  events: TEventSchedule[];
  onReturn: () => void;
  onEventClick: (n: number) => void;
  onNewEventClick: (
    dateLine: string,
    teacher: number[],
    location: string
  ) => void;
  day: string | undefined;
  users: User[];
};

const FullDayScheduleView = ({
  events,
  users,
  onReturn,
  day,
  onEventClick,
  onNewEventClick,
}: Props) => {
  const [revealAlert, setRevealAlert] = useState(false);
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
  const [location, setLocation] = useState('Main ballroom');
  const [slots, setSlots] = useState<string[]>([]);
  const [scale1, setScale] = useState(30);
  const [selectedEvents, setSelectedEvents] = useState<TEventSchedule[]>([]);
  const [teacher, setTeacher] = useState<number | undefined>(undefined);
  const [selectedEventItem, setSelectedEventItem] = useState<TEventSchedule | undefined>(undefined);

  const windowSize = useDimensions();
  let el = document.querySelector('#mainPage');
  const getColor = (n: number) => {
    let color = users.filter((user) => user.id == n)[0];
    return color?.color ?? '#000';
  };
  const onReturnAlert = async (decision1: string) => {
    setRevealAlert(false);
    if (decision1 == 'Cancel') {
    }
    if (decision1 == 'Delete') {
      //   fetch('/api/admin/del_event', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       id: eventID,
      //     }),
      //   }).then(() => {
      //     window.location.reload();
      //   });
    }
  };
  console.log(day, events);
  let date1 = new Date(day! + ' 07:00:00');
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

      slotsArray.push(
        `${hours}:${minutes < 10 ? ('0' + minutes) : minutes} ${timeLocal1}`
      );
    }
    setSlots(slotsArray);
  }, [scale1]);


  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    isShown: boolean;
  }>({ x: 0, y: 0, isShown: false });

  const [contextMenuItems, setContextMenuItems] = useState<{title:string, icon:string|undefined}[]>([])

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
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    timeFrame: number | undefined, item:TEventSchedule | undefined
  ) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    console.log(item, timeFrame);
    if (item!== undefined) setSelectedEventItem(item);
    setContextMenu({ x: clientX, y: clientY, isShown: true });
  };

// handling results of click on Menu
  const handleContextMenuChoice = (str: string) => {
    console.log(str);
    setContextMenu({ x: 0, y: 0, isShown: false });

    if (str === 'Copy') {
      //copy logic
    } else if (str === 'Paste') {
      //paste logic
    }else if (str === 'Move') {
        //paste logic
      } else if (str === 'Delete') {
      //delete logic
      setRevealAlert(true);
      setAlertStyle({
        variantHead: 'danger',
        heading: 'Delete Event',
        text: 'Are you sure you want to delete this event?',
        color1: 'red',
        button1: 'Delete',
        color2: 'gray',
        button2: 'Cancel',
        inputField: '',
      });
    }
  };
//   close contextMenu on Click outside div using Hook 
  useOnOutsideClick(contextMenuRef, () => {
    setContextMenu({ x: 0, y: 0, isShown: false });
  });
  return (
    <AnimateModalLayout
      visibility={isVisible}
      onReturn={() => {
        onReturn();
      }}
    >
      {revealAlert && (
        <AlertMenu onReturn={onReturnAlert} styling={alertStyle} />
      )}
      <ContextMenu
        items={contextMenuItems}
        contextMenuRef={contextMenuRef}
        isShown={contextMenu.isShown}
        anchorPoint={{ x: contextMenu.x, y: contextMenu.y }}
        onChoice={(s) => handleContextMenuChoice(s)}
      />

      <div
        className={`border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-md  flex justify-center items-center flex-col   md:w-full bg-lightMainBG dark:bg-darkMainBG backdrop-blur-md h-[70svh] md:h-[85svh]`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
          >
            <div className="font-semibold text-md text-center  text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG mt-4 p-3">
              <span className="font-extrabold text-xl text-left  text-lightMainColor  dark:text-darkMainColor ">
                Schedule for:{' '}
              </span>
              {new Date(date1).toLocaleDateString('en-us', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
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
              </select>
            </label>
            <label className="flex flex-col m-auto justify-between items-center">
              Instructor
              <select
                className=" mb-2 rounded-md text-ellipsis  dark:text-darkMainColor text-menuBGColor "
                style={{
                  backgroundColor:
                    teacher == undefined || teacher == null
                      ? 'transparent'
                      : users.filter((user) => user.id == teacher)[0]?.color!,
                }}
                value={teacher!}
                onChange={(e) => {
                  setTeacher(parseInt(e.target.value));
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
                }}
              >
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

            <div className="w-full h-[50svh] relative  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md">
              <div className="absolute top-0 left-0 w-full  flex  ">
                <div
                  id="timeSlots"
                  className=" relative w-full  flex flex-col justify-center items-center "
                >
                  {slots &&
                    slots.map((d, index) => (
                      <div
                        className=" w-full h-[50px] cursor-pointer border-b border-dashed border-lightMainColor dark:border-darkMainColor  flex flex-col justify-left flex-wrap overflow-hidden"
                        key={`timeslot ${index}`}
                        onClick={(e) => {
                          e.preventDefault();
                          let time = Math.floor(
                            (index / slots.length) * 24 * 60
                          );
                          let hours = Math.floor(time / 60);
                          let minutes = time % 60;
                          onNewEventClick(
                            `${day}T${hours < 10 ? '0' : ''}${hours}:${
                              minutes < 10 ? '0' : ''
                            }${
                              minutes 
                            }`,
                            teacher !== undefined ? [teacher] : [],
                            location
                          );
                        }}
                        onContextMenu={(e) =>{
                            setContextMenuItems([{title:"Paste", icon:undefined}])
                            handleContextMenu(e, (index / slots.length) * 24, undefined)
                        }}
                      >
                        <span>{`${d}`}</span>
                        {/* {day.event && <div className="text-xs" style={{backgroundColor: day.event.color}}>{day.event.title}</div>} */}
                      </div>
                    ))}
                </div>
                {selectedEvents &&
                  selectedEvents
                    .sort((a, b) => {
                      if (a.date > b.date) return 1;
                      else if (a.date < b.date) return -1;
                      else return 0;
                    })
                    .map((item, index) => {
                      return (
                        <div
                          key={'day' + index}
                          className="text-xs cursor-pointer flex flex-row justify-start items-center m-0.5 rounded-md w-[70%] truncate absolute left-20"
                          style={{
                            backgroundColor: getColor(item.teachersid[0]),

                            height: `${(item.length / scale1) * 50}px`,

                            top: `${
                              (((parseInt(
                                item.date.split('T')[1].split(':')[0]
                              ) *
                                60 +
                                parseInt(
                                  item.date.split('T')[1].split(':')[1]
                                )) /
                                1440) *
                                50 *
                                24 *
                                60) /
                              scale1
                            }px`,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            onEventClick(item.id);
                          }}
                          onContextMenu={(e) =>{
                            setContextMenuItems([{title:"Copy", icon:undefined},{title:"Move", icon:undefined},{title:"Paste", icon:undefined}, {title:"Delete", icon:undefined},])
                            handleContextMenu(e,undefined, item)
                        }}
                        >
                          {item.tag +
                            ' ' +
                            (item.studentid[0] !== undefined
                              ? users.filter(
                                  (user) => user.id == item.studentid[0]
                                )[0].name
                              : '') +
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
