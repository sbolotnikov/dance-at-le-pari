'use client';
import { useEffect, useState } from 'react';

import AnimateModalLayout from './AnimateModalLayout';
import ImgFromDb from './ImgFromDb';
import { TEventSchedule, TTeacherInfo } from '@/types/screen-settings';
import ShowIcon from './svg/showIcon';
import ChooseUsersQuick from './ChooseUsersQuick';
import AlertMenu from './alertMenu';
import { useDimensions } from '@/hooks/useDimensions';

type Props = {
  visibility: boolean;
  role: string;
  event: TEventSchedule;
  users: {
    id: number;
    name: string;
    image: string | null;
    role: string;
    color: string | null;
  }[];
  onReturn: (
    n: TEventSchedule | null,
    del: { s: string; id: number } | null
  ) => void;
};

export default function EditScheduleModal({
  visibility,
  event,
  role,
  users,
  onReturn,
}: Props) {
  const [isVisible, setIsVisible] = useState(visibility);
  const [eventType, setEventType] = useState('Private');
  const [location, setLocation] = useState('Main ballroom');
  const [confirmed, setConfirmed] = useState(false);
  const [eventDateTime1, setEventDateTime1] = useState('');
  const [eventDateTime2, setEventDateTime2] = useState('');
  const [eventDateTimeEnd, setEventDateTimeEnd] = useState('');
  const [revealCloud1, setRevealCloud1] = useState(false);
  const [revealCloud2, setRevealCloud2] = useState(false);
  const [studentid, setStudentid] = useState<number[]>([]);
  const [length1, setLength] = useState(45);
  const [repeating, setRepeating] = useState(false);
  const [tag, setTag] = useState('');
  const [repeatInterval, setRepeatInterval] = useState<number>(0);
  const [teacher, setTeacher] = useState<TTeacherInfo | null>();
  const [revealAlert, setRevealAlert] = useState(false);
  const [scrolling, setScrolling] = useState(true);
  const windowSize = useDimensions();
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
  const [isFocused, setIsFocused] = useState(false); 
    
    const handleOnFocus = () => {
        if(windowSize.width! <= 768) {setIsFocused(true); document.body.classList.add("keyboard");}
    }; 
  
    const handleBlur = () => { 
      if(windowSize.width! <= 768) {setIsFocused(false); document.body.classList.remove("keyboard");}
    }; 
  useEffect(() => {
    let dt = new Date();
    if (event.id !== undefined) dt = new Date(event.date);

    setEventDateTime1(
      dt.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }) +
        'T' +
        dt.toLocaleString('es-CL').split(' ')[1].slice(0, -3)
    );
    setEventDateTimeEnd(
      dt.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }) +
        'T' +
        dt.toLocaleString('es-CL').split(' ')[1].slice(0, -3)
    );
    dt.setMinutes(dt.getMinutes() + length1); // timestamp
    dt = new Date(dt);
    setEventDateTime2(
      dt.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }) +
        ' ' +
        dt.toLocaleTimeString('en-US', {
          timeStyle: 'short',
        })
    );
    if (event.id !== undefined) {
      console.log(event);
      setEventType(event.eventtype);
      setTag(event.tag);
      setLocation(event.location!);
      setEventDateTime1(event.date);
      setEventDateTimeEnd(event.date);
      setConfirmed(event.confirmed);
      setLength(event.length);
      let dateObj = Date.parse(event.date);
      let newDateOBJ = new Date(dateObj + event.length * 60000);
      setEventDateTime2(
        newDateOBJ.toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }) +
          ' ' +
          newDateOBJ.toLocaleTimeString('en-US', {
            timeStyle: 'short',
          })
      );

      if (event.teachersid.length === 1) {
        let user1 = users.filter((user) => user.id == event.teachersid[0])[0];
        console.log(event);
        setTeacher({ id: user1.id, name: user1.name, image: user1.image! });
      }
      setStudentid(event.studentid);
    }
    console.log(event);
  }, []);
  const onReturnTeacher = (
    decision1: string,
    fileLink: TTeacherInfo | null
  ) => {
    setRevealCloud2(false);
    if (decision1 == 'Close') {
      setTeacher(null);
      console.log(decision1);
    }
    if (decision1 == 'Confirm') {
      console.log('file link', fileLink);
      setTeacher(fileLink!);
    }
  };
  const onReturnStudents = (
    decision1: string,
    fileLink: TTeacherInfo | null
  ) => {
    setRevealCloud1(false);
    if (decision1 == 'Close') {
      setTeacher(null);
      console.log(decision1);
    }
    if (decision1 == 'Confirm') {
      console.log(fileLink!.id);
      if (studentid.indexOf(fileLink!.id) == -1)
        setStudentid([...studentid, fileLink!.id]);
    }
  };
  const onReturnAlert = (decision1: string, inputValue: string | null) => {
    if (decision1 == 'Cancel') {
      setRevealAlert(false);
      return;
    }
    if (decision1 == 'Confirm') {
      setRevealAlert(false);
      setIsVisible(false);
      onReturn(null, { s: 'Delete', id: event.id });
    }
    setRevealAlert(false);
  };
  useEffect(() => {
    document.getElementById('wrapperDiv')?.offsetHeight! -
      document.getElementById('containedDiv')?.offsetHeight! >
    0
      ? setScrolling(true)
      : setScrolling(false);
  }, [windowSize.height]);

  return (
    <AnimateModalLayout
      visibility={isVisible}
      onReturn={() => {
        setIsVisible(false);
        onReturn(null, null);
      }}
    >
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturnAlert}
        styling={alertStyle}
      />

      {revealCloud1 && (
        <ChooseUsersQuick
          title={'student'}
          group={JSON.stringify([{ role: 'Student' }])}
          onReturn={onReturnStudents}
          selectedUsers={users
            .filter((user) => user.role === 'Student')
            .map((user) => {
              return {
                id: user.id,
                name: user.name,
                image: user.image !== null ? user.image : '',
              };
            })}
        />
      )}
      {revealCloud2 && (
        <ChooseUsersQuick
          title={'teacher'}
          group={JSON.stringify([{ role: 'Teacher' }, { role: 'Admin' }])}
          onReturn={onReturnTeacher}
          selectedUsers={users
            .filter((user) => user.role === 'Teacher' || user.role === 'Admin')
            .map((user) => {
              return {
                id: user.id,
                name: user.name,
                image: user.image !== null ? user.image : '',
              };
            })}
        />
      )}
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-md  flex justify-center items-center flex-col   md:w-full bg-lightMainBG dark:bg-darkMainBG ${
          role == 'Student' ? 'max-h-[527px] h-full' : 'h-[70svh] md:h-[85svh]'
        }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`${
              scrolling ? '' : 'absolute top-0 left-0'
            } flex flex-col w-full p-1 justify-center items-center ${(isFocused?"mb-28":"")}`}
          >
            <h2 className="w-full text-center uppercase">
              {role == 'Student' ? 'Your event' : 'Edit/Add Schedule events'}
            </h2>
            <label className="flex flex-col justify-between items-center mb-1">
              {`${role == 'Student' ? 'Your' : 'Choose'} Instructor`}
              <div className="relative flex justify-center items-center outline-none border border-lightMainColor dark:border-darkMainColor rounded-md w-24 my-6 mx-auto">
                {teacher?.image !== null &&
                teacher?.image !== '' &&
                teacher?.image !== undefined ? (
                  <div className="w-[8rem] h-[12rem] flex flex-col justify-between items-center">
                    <ImgFromDb
                      url={teacher?.image!}
                      stylings="object-contain"
                      alt="Event Picture"
                    />
                    <h2 className="text-center">{teacher.name}</h2>
                  </div>
                ) : (
                  <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                    <ShowIcon icon={'DefaultUser'} stroke={'2'} />
                  </div>
                )}

                {role !== 'Student' && (
                  <button
                    className=" outline-none border-none fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor rounded-md  absolute p-1 -top-3 -right-3 w-8 h-8"
                    onClick={(e) => {
                      e.preventDefault();
                      setRevealCloud2(!revealCloud2);
                      return;
                    }}
                  >
                    <ShowIcon icon={'Exchange'} stroke={''} />
                  </button>
                )}
              </div>
            </label>
            <label className="flex flex-row justify-between items-center m-1 w-full">
              Note:
              {role !== 'Student' ? (
                <input
                  className=" outline-none border-none rounded-md w-3/4 text-lg text-lightMainColor p-0.5 mx-1"
                  id="title"
                  name="title"
                  type="text"
                  onFocus={handleOnFocus} 
                  onBlur={handleBlur} 
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value);
                  }}
                />
              ) : (
                <h2 className="text-center  rounded-md w-3/4 p-0.5 mx-1">
                  {event.tag}
                </h2>
              )}
            </label>
            {role !== 'Student' && (
              <label className="w-full flex flex-row justify-between items-center mb-1">
                Length in min.
                <input
                  className=" outline-none border-none rounded-md  w-1/6 text-lg text-lightMainColor p-0.5 mx-1"
                  id="length1"
                  name="length1"
                  type="number"
                  onFocus={handleOnFocus} 
                  onBlur={handleBlur} 
                  value={length1}
                  onChange={(e) => {
                    let dateObj = Date.parse(eventDateTime1);
                    let newDateOBJ = new Date(
                      dateObj + parseInt(e.target.value) * 60000
                    );
                    setEventDateTime2(
                      newDateOBJ.toLocaleDateString('en-us', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      }) +
                        ' ' +
                        newDateOBJ.toLocaleTimeString('en-US', {
                          timeStyle: 'short',
                        })
                    );

                    setLength(parseInt(e.target.value));
                  }}
                  required
                />
              </label>
            )}
            {role !== 'Student' && (
              <div className="flex flex-col justify-between items-center w-full">
                <div className="flex flex-row  w-full">
                  <span>Choose Students</span>
                  <button
                    className=" outline-none border-none fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor rounded-md  ml-2 mb-2  p-1  w-8 h-8"
                    onClick={(e) => {
                      e.preventDefault();
                      setRevealCloud1(!revealCloud1);
                      return;
                    }}
                  >
                    <ShowIcon icon={'Exchange'} stroke={''} />
                  </button>
                </div>
                {/* <div className="relative flex justify-center items-center outline-none border border-lightMainColor dark:border-darkMainColor rounded-md w-24 my-6 mx-auto"> */}

                <div className="w-full h-[6.1rem] relative   overflow-auto border border-lightMainColor dark:border-darkMainColor rounded-md">
                  <div className="absolute top-0 left-0  min-w-full  flex flex-wrap items-start justify-start ">
                    {studentid.length > 0 &&
                      studentid.map((item, i) => (
                        <div
                          key={'students' + i}
                          className="m-1 mr-4 flex flex-col items-center justify-center"
                        >
                          <div className="relative h-8 w-8 md:h-10 md:w-10">
                            <div
                              className=" h-8 w-8 md:h-10 md:w-10 cursor-pointer fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor "
                              onClick={(e) => {
                                e.preventDefault();
                                // setTemplate1(item);
                              }}
                            >
                              {users.filter((user) => user.id == item)[0]
                                .image == null ||
                              users.filter((user) => user.id == item)[0]
                                .image == '' ||
                              users.filter((user) => user.id == item)[0]
                                .image == undefined ? (
                                <ShowIcon icon={'DefaultUser'} stroke={'2'} />
                              ) : (
                                <ImgFromDb
                                  url={
                                    users.filter((user) => user.id == item)[0]
                                      .image!
                                  }
                                  stylings="object-contain h-full w-full overflow-hidden rounded-xl"
                                  alt="Event Picture"
                                />
                              )}
                            </div>
                            <button
                              className=" outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor absolute p-1 -top-1 -right-9 w-10 h-10"
                              onClick={(e) => {
                                e.preventDefault();
                                setStudentid(
                                  studentid.filter((st) => st !== item)
                                );
                              }}
                            >
                              <ShowIcon icon={'Close'} stroke={'2'} />
                            </button>
                          </div>

                          <h2 className="max-w-[100px] text-center">
                            {users.filter((user) => user.id == item)[0].name}
                          </h2>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
            <label className="flex flex-row m-1 w-full justify-between items-center">
              Event type
              <select
                className="bg-main-bg rounded-md bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                value={eventType}
                disabled={role == 'Student'}
                onChange={(e) => {
                  setEventType(e.target.value);
                }}
              >
                <option value="Blocked">Blocked</option>
                <option value="Group">Group session</option>
                <option value="Party">Party</option>
                <option value="Private">Private lesson</option>
              </select>
            </label>
            <label className="flex flex-row m-1 justify-between items-center w-full">
              Location
              <select
                className="bg-main-bg mb-2 rounded-md text-ellipsis bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                value={location}
                disabled={role == 'Student'}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              >
                <option value="Studio A (Front)">Studio A (Front)</option>
                <option value="Studio B (Back)">Studio B (Back)</option>
                <option value="Main ballroom">Main ballroom</option>
              </select>
            </label>
            <label className="flex flex-row justify-between items-center m-1 w-full">
              Start Time
              <input
                className="flex-1 outline-none border-none rounded-md   text-lightMainColor p-0.5 mx-1"
                value={eventDateTime1}
                disabled={role == 'Student'}
                onChange={(e) => {
                  console.log(e.target.value);
                  let dateObj = Date.parse(e.target.value);
                  let newDateOBJ = new Date(dateObj + length1 * 60000);
                  setEventDateTime2(
                    newDateOBJ.toLocaleDateString('en-us', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    }) +
                      ' ' +
                      newDateOBJ.toLocaleTimeString('en-US', {
                        timeStyle: 'short',
                      })
                  );
                  if (eventDateTimeEnd < e.target.value)
                    setEventDateTimeEnd(e.target.value);

                  setEventDateTime1(e.target.value);
                }}
                type="datetime-local"
                required
              />
            </label>
            <label className="flex flex-row justify-between items-center m-1 w-full">
              Finish Time <span>{eventDateTime2}</span>
            </label>
            {role !== 'Student' && (
              <label className="flex flex-row justify-between items-center mb-1">
                Confirmed Event
                <input
                  className=" outline-none border-none rounded-md  text-lightMainColor p-0.5 mx-1"
                  id="confirmedEvent"
                  name="confirmedEvent"
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => {
                    setConfirmed(!confirmed);
                  }}
                />
              </label>
            )}
            {role !== 'Student' && (
              <label className="flex flex-row justify-between items-center mb-1">
                Repeating Event
                <input
                  className=" outline-none border-none rounded-md  text-lightMainColor p-0.5 mx-1"
                  id="reapetingEvent"
                  name="reapetingEvent"
                  type="checkbox"
                  checked={repeating}
                  onChange={(e) => {
                    setRepeating(!repeating);
                  }}
                />
              </label>
            )}

            {repeating && (
              <label className="flex flex-row m-auto justify-between items-center">
                Interval of repeating
                <select
                  className="bg-main-bg m-2 rounded-md bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                  value={repeatInterval}
                  onChange={(e) => {
                    setRepeatInterval(parseInt(e.target.value));
                  }}
                >
                  <option value={0}>None</option>
                  <option value={24 * 3600000}>Every Day</option>
                  <option value={24 * 3600000 * 7}>Every Week</option>
                  <option value={24 * 3600000 * 14}>Every 2 Week</option>
                </select>
              </label>
            )}
            {repeating && (
              <label className="flex flex-row justify-between items-center">
                End of interval date
                <input
                  className="flex-1 outline-none border-none rounded-md   text-lightMainColor p-0.5 mx-1"
                  value={eventDateTimeEnd}
                  onChange={(e) => {
                    if (e.target.value >= eventDateTime1)
                      setEventDateTimeEnd(e.target.value);
                  }}
                  type="datetime-local"
                  required
                />
              </label>
            )}
            {role !== 'Student' && (
              <button
                className={`w-[70%] btnFancy text-base text-center  rounded-md `}
                style={{ padding: '0' }}
                onClick={() => {
                  if (teacher?.id == undefined) {
                    setAlertStyle({
                      variantHead: 'danger',
                      heading: 'Warning',
                      text: 'Please select a instructor before saving the event',
                      color1: '',
                      button1: '',
                      color2: 'secondary',
                      button2: 'Cancel',
                      inputField: '',
                    });
                    setRevealAlert(!revealAlert);

                    return;
                  }
                  setIsVisible(false);
                  onReturn(
                    {
                      eventtype: eventType,
                      tag: tag,
                      location: location,
                      date: eventDateTime1,
                      length: length1,
                      teachersid: teacher?.id == undefined ? [] : [teacher?.id],
                      studentid: studentid,
                      repeating: repeating,
                      interval: repeatInterval,
                      until: eventDateTimeEnd,
                      id: event.id == undefined ? -1 : event.id,
                      confirmed: confirmed,
                    },
                    null
                  );
                }}
              >
                {`${
                  event.id && event.id > -1 ? 'Submit Edited' : 'Create New'
                } Event`}
              </button>
            )}
            {event.id !== undefined && event.id > -1 && role !== 'Student' && (
              <button
                className="w-[70%] btnFancy text-base text-center  rounded-md"
                style={{ padding: '0' }}
                onClick={() => {
                  setAlertStyle({
                    variantHead: 'danger',
                    heading: 'Warning',
                    text: 'Are you sure you want to delete this event?',
                    color1: 'danger',
                    button1: 'Confirm',
                    color2: 'secondary',
                    button2: 'Cancel',
                    inputField: '',
                  });
                  setRevealAlert(!revealAlert);
                }}
              >
                {`Delete Event`}
              </button>
            )}
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
}
