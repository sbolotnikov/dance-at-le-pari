'use client';
import ChoosePicture from '@/components/ChoosePicture';
import EditSeatsForEvent from '@/components/EditSeatsForEvent';
import EditTablesForEvent from '@/components/EditTablesForEvent';
import ImgFromDb from '@/components/ImgFromDb';
import LoadingScreen from '@/components/LoadingScreen';
import AlertMenu from '@/components/alertMenu';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { TFullEvent } from '@/types/screen-settings';
import sleep from '@/utils/functions';
import { useEffect, useState } from 'react';
import ChooseTeacher from '@/components/ChooseTeacher';
import { TTeacherInfo } from '@/types/screen-settings';
import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { id: string } }) {
  const [eventData, setEventData] = useState<TFullEvent>();
  const router = useRouter();
  const [revealCloud, setRevealCloud] = useState(false);
  const [revealCloud1, setRevealCloud1] = useState(false);
  const [revealCloud2, setRevealCloud2] = useState(false);
  const [revealAlert, setRevealAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadState, setLoadState] = useState({ front: false, back: false });
  const [tableIndex, setTableIndex] = useState<number>(0);
  const [image, setImage] = useState('');
  const [seatmap, setSeatmap] = useState('');
  const [eventtype, setEventType] = useState('Group');
  const [location, setEventTypeLocation] = useState('Main ballroom');
  const [description, setDescription] = useState('');
  const [teacher, setTeacher] = useState<TTeacherInfo | null>();
  const [length1, setLength] = useState(0);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [specialEvent, setSpecialEvent] = useState(false);
  const [eventDateTime, setEventDateTime] = useState('');
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
  console.log(eventData);
  const fixTables = (tables: number[]) => {
    setLoading(true);
    fetch('/api/admin/change_tables', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: parseInt(params.id),
        tables: tables,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        console.log(data);
        if (data.status == 201) {
          setAlertStyle({
            variantHead: 'warning',
            heading: 'Message',
            text: data.message,
            color1: 'success',
            button1: 'Ok',
            color2: '',
            button2: '',
            inputField: '',
          });
          sleep(1200).then(() => {
            setRevealAlert(true);
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const onReturnAlert = async (decision1: string, val2: string | null) => {
    setRevealAlert(false);
    if (decision1 == 'Cancel') {
    }
    if (decision1 == 'Ok') {
      window.location.reload();
    }
    if (decision1 == 'Update Table') {
      let eventDataCopy = eventData;
      if (eventDataCopy?.tables && eventDataCopy?.tables != undefined) {
        if (eventDataCopy.tables[tableIndex] < parseInt(val2 ? val2 : '0')) {
          eventDataCopy.tables[tableIndex] = parseInt(val2 ? val2 : '0');
          fixTables(eventDataCopy?.tables);
          // console.log(tableIndex, val2, 'new table size', eventDataCopy?.tables);
        } else {
          console.log('update less seats');
          setLoading(true);
          fetch('/api/admin/any_seats_booked_tables', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: parseInt(params.id),
              table: tableIndex,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              setLoading(false);
              if (
                parseInt(data.booked) == 0 ||
                (parseInt(data.booked) > 0 &&
                  parseInt(data.maxSeat) < parseInt(val2 ? val2 : '0'))
              ) {
                if (
                  eventDataCopy?.tables &&
                  eventDataCopy?.tables != undefined
                ) {
                  eventDataCopy.tables[tableIndex] = parseInt(
                    val2 ? val2 : '0'
                  );
                  fixTables(eventDataCopy?.tables);
                }
              } else {
                setAlertStyle({
                  variantHead: 'danger',
                  heading: 'Message',
                  text:
                    'Table is booked.(Seats:' +
                    data.booked +
                    ') Delete or move people before updating table capacity',
                  color1: 'warning',
                  button1: 'Ok',
                  color2: '',
                  button2: '',
                  inputField: '',
                });
                setRevealAlert(true);
                console.log(
                  'table is booked.' +
                    data.maxSeat +
                    'delete before updating table capacity'
                );
              }
            })
            .catch((error) => {
              setLoading(false);
              console.log(error);
            });
        }
      }
      setEventData(eventDataCopy);
    }
    if (decision1 == 'Eliminate Table') {
      let eventDataCopy = eventData;
      setLoading(true);
      fetch('/api/admin/any_seats_booked_tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: parseInt(params.id),
          table: tableIndex,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);

          if (parseInt(data.booked) == 0) {
            if (eventDataCopy?.tables && eventDataCopy?.tables != undefined) {
              eventDataCopy?.tables?.splice(tableIndex, 1);
              setEventData(eventDataCopy);
              fixTables(eventDataCopy?.tables);
            }
          } else {
            setAlertStyle({
              variantHead: 'danger',
              heading: 'Message',
              text:
                'Table is booked.(Seats:' +
                data.booked +
                ') Delete or move people before updating table capacity',
              color1: 'warning',
              button1: 'Ok',
              color2: '',
              button2: '',
              inputField: '',
            });
            setRevealAlert(true);
            console.log(
              'table is booked.' +
                data.maxSeat +
                'delete before updating table capacity'
            );
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
    if (decision1 == 'Create Table' && val2 != null && parseInt(val2)) {
      let eventDataCopy = eventData;
      eventDataCopy?.tables?.push(parseInt(val2));
      if (eventDataCopy?.tables != null && eventDataCopy?.tables != undefined)
        fixTables(eventDataCopy?.tables);
    }
  };
  const onReturnPicture = (decision1: string, fileLink: string) => {
    if (decision1 == 'Close') {
      setRevealCloud1(false);
      setRevealCloud(false);
    }
    if (decision1 == 'Upload') {
      console.log('file link', fileLink);
      if (revealCloud == true) {
        setRevealCloud(false);
        setImage(fileLink);
      } else {
        setRevealCloud1(false);
        setSeatmap(fileLink);
      }
    }
  };
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
  useEffect(() => {
    setLoading(true);
    fetch('/api/event/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: params.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setEventData(data);
        setImage(data.image);
        setSeatmap(data.seatmap);
        setEventType(data.eventtype);
        setEventTypeLocation(data.location);
        setDescription(data.description);
        setTeacher({
          id: data.teachersid[0],
          name: data.teacher,
          image: data.teacher_img,
        });
        setLength(data.length);
        setTitle(data.title);
        setTag(data.tag);
        // setVisible(data.visible);
        setSpecialEvent(data.specialEvent);
        setEventDateTime(data.date);
        console.log(data);
        setLoadState({ front: true, back: loadState.back });
      })
      .catch((error) => {
        console.log(error);
        setLoadState({ front: true, back: loadState.back });
      });
  }, []);
  useEffect(() => {
    if (loadState.front && loadState.back) {
      setLoading(false);
    }
  }, [loadState]);
  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log(length1, title, tag, description);
    let validationError = '';
    document.querySelector('#length1')!.classList.remove('invalid_input');
    document.querySelector('#title')!.classList.remove('invalid_input');
    document.querySelector('#tag')!.classList.remove('invalid_input');
    document.querySelector('#description')!.classList.remove('invalid_input');
    // submitting profile updated information
    if (length1 < 30 || length1 > 360) {
      validationError = 'Enter length in range 30 min to 6 hours';
      // make name input red
      document.querySelector('#length1')!.classList.add('invalid_input');
    } else if (tag.length > 60 || tag.length < 2) {
      validationError = 'Enter tag in range of 3 to 60 symbols';
      // make message input red
      document.querySelector('#tag')!.classList.add('invalid_input');
    }
    if (validationError > '') {
      setAlertStyle({
        variantHead: 'danger',
        heading: 'Warning',
        text: validationError,
        color1: 'warning',
        button1: 'Close',
        color2: '',
        button2: '',
        inputField: '',
      });
      setRevealAlert(true);
      return;
    }

    setLoading(true);
    fetch('/api/admin/update_event', {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventtype,
        length: length1,
        image,
        seatmap,
        tag,
        title,
        location,
        description,
        specialEvent,
        date: eventDateTime,
        // visible,
        teachersid:
          teacher?.id !== null && teacher?.id !== undefined
            ? [teacher?.id]
            : [],
        id: parseInt(params.id),
      }),
    })
      .then(async (res) => {
        setLoading(false);
        setAlertStyle({
          variantHead: 'info',
          heading: 'Message',
          text: 'You successfully  update existing event.',
          color1: 'secondary',
          button1: 'Return',
          color2: '',
          button2: '',
          inputField: '',
        });

        setRevealAlert(true);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturnAlert}
        styling={alertStyle}
      />
      {(revealCloud || revealCloud1) && (
        <ChoosePicture onReturn={onReturnPicture} />
      )}
      {revealCloud2 && <ChooseTeacher onReturn={onReturnTeacher} />}
      {loading && <LoadingScreen />}
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[85%] max-w-[900px] h-[85%]  md:w-full md:mb-3 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full   p-2 flex flex-col justify-start items-center relative overflow-y-auto">
          <div
            className={`  min-w-full   flex flex-col flex-wrap items-center justify-center absolute top-0 right-0 `}
          >
            <h2
              className="text-center w-full font-bold uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Event Editing Form
            </h2>

            <div className="relative flex justify-center items-center outline-none border border-lightMainColor dark:border-darkMainColor rounded-md w-24 my-6 mx-auto">
              {image !== null && image !== '' && image !== undefined ? (
                <ImgFromDb
                  url={image}
                  stylings="object-contain"
                  alt="Event Picture"
                />
              ) : (
                <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                  <ShowIcon icon={'Template'} stroke={'2'} />
                </div>
              )}

              <button
                className=" outline-none border-none fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor rounded-md  absolute p-1 -top-3 -right-3 w-8 h-8"
                onClick={(e) => {
                  e.preventDefault();
                  setRevealCloud(!revealCloud);
                  return;
                }}
              >
                <ShowIcon icon={'Exchange'} stroke={''} />
              </button>
            </div>
            <div className="relative flex justify-center items-center outline-none border border-lightMainColor dark:border-darkMainColor rounded-md w-24 my-6 mx-auto">
              {seatmap !== null && seatmap !== '' && seatmap !== undefined ? (
                <ImgFromDb
                  url={seatmap}
                  stylings="object-contain"
                  alt="Event Picture"
                />
              ) : (
                <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                  <ShowIcon icon={'Template'} stroke={'2'} />
                </div>
              )}

              <button
                className=" outline-none border-none fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor rounded-md  absolute p-1 -top-3 -right-3 w-8 h-8"
                onClick={(e) => {
                  e.preventDefault();
                  setRevealCloud1(!revealCloud1);
                  return;
                }}
              >
                <ShowIcon icon={'Exchange'} stroke={''} />
              </button>
            </div>
            <div className="relative flex justify-center items-center outline-none border border-lightMainColor dark:border-darkMainColor rounded-md w-24 my-6 mx-auto">
              {teacher?.image !== null &&
              teacher?.image !== '' &&
              teacher?.image !== undefined ? (
                <div>
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
            </div>
            <label className="flex flex-row m-auto justify-between items-center">
              Event type
              <select
                className="bg-main-bg m-2 rounded-md bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                value={eventtype}
                onChange={(e) => {
                  setEventType(e.target.value);
                }}
              >
                <option value="Party">Party</option>
                <option value="Group">Group</option>
              </select>
            </label>
            <label className="flex flex-col m-auto justify-between items-center">
              Location
              <select
                className="bg-main-bg mb-2 rounded-md text-ellipsis bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                value={location}
                onChange={(e) => {
                  setEventTypeLocation(e.target.value);
                }}
              >
                <option value="Studio A (Front)">Studio A (Front)</option>
                <option value="Studio B (Back)">Studio B (Back)</option>
                <option value="Main ballroom">Main ballroom</option>
                <option value="Whole studio">Whole studio</option>
              </select>
            </label>
            <label className="flex flex-row justify-between items-center">
              Day Time
              <input
                className="flex-1 outline-none border-none rounded-md   text-lightMainColor p-0.5 mx-1"
                value={eventDateTime}
                onChange={(e) => {
                  setEventDateTime(e.target.value);
                }}
                type="datetime-local"
                required
              />
            </label>
            <form className=" m-auto" onSubmit={handleSubmit}>
              <label className="flex flex-row justify-between items-center mb-1">
                Length in min.
                <input
                  className=" outline-none border-none rounded-md  w-1/2 text-lightMainColor p-0.5 mx-1"
                  id="length1"
                  name="length1"
                  type="number"
                  value={length1}
                  onChange={(e) => {
                    setLength(parseInt(e.target.value));
                  }}
                  required
                />
              </label>

              <label className="flex flex-row justify-between items-center mb-1">
                Title
                <input
                  className=" outline-none border-none rounded-md w-3/4  text-lightMainColor p-0.5 mx-1"
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </label>
              <label className="flex flex-row justify-between items-center mb-1">
                Event Tag
                <input
                  className=" outline-none border-none rounded-md  w-3/4 text-lightMainColor p-0.5 mx-1"
                  id="tag"
                  name="tag"
                  type="text"
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value);
                  }}
                  required
                />
              </label>
              {/* <label className="flex flex-row justify-between items-center mb-1">
              Service Visibility
              <input
                className=" outline-none border-none rounded-md  text-lightMainColor p-0.5 mx-1"
                id="visible"
                name="visible"
                type="checkbox"
                checked={visible}
                onChange={(e) => {
                  setVisible(!visible);
                }}
              />
            </label> */}
              <label className="flex flex-row justify-between items-center mb-1">
                Special Event Status
                <input
                  className=" outline-none border-none rounded-md  text-lightMainColor p-0.5 mx-1"
                  id="visible"
                  name="visible"
                  type="checkbox"
                  checked={specialEvent}
                  onChange={(e) => {
                    setSpecialEvent(!specialEvent);
                  }}
                />
              </label>
              <label className="flex flex-col justify-between items-start mb-1">
                Description
                <textarea
                  name="description"
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  className="w-full rounded text-lightteal"
                  placeholder="Event description"
                  rows={4}
                  minLength={5}
                />
              </label>
              <button
                className="btnFancy w-[90%]"
                type="submit"
                disabled={loading}
              >
                {'Submit'}
              </button>
            </form>

            <EditTablesForEvent
              tables={eventData?.tables}
              onReturn={(str1, n) => {
                if (str1 == 'Edit') {
                  setAlertStyle({
                    variantHead: 'info',
                    heading: 'Info',
                    text: 'Please enter new seats amount fot this Table!',
                    color1: 'success',
                    button1: 'Update Table',
                    color2: 'secondary',
                    button2: 'Cancel',
                    inputField: 'true',
                  });
                  setTableIndex(n);
                  setRevealAlert(!revealAlert);
                  console.log(
                    n,
                    eventData?.tables != null ? eventData?.tables[n] : null
                  );
                }
                if (str1 == 'Delete') {
                  setAlertStyle({
                    variantHead: 'danger',
                    heading: 'Warning',
                    text: 'You are about to Delete this Table!',
                    color1: 'danger',
                    button1: 'Eliminate Table',
                    color2: 'secondary',
                    button2: 'Cancel',
                    inputField: '',
                  });
                  setTableIndex(n);
                  setRevealAlert(!revealAlert);
                }
                if (str1 == 'Add') {
                  setTableIndex(eventData?.tables?.length!);
                  setAlertStyle({
                    variantHead: 'info',
                    heading: 'Info',
                    text: 'Please enter seats amount for a new Table!',
                    color1: 'success',
                    button1: 'Create Table',
                    color2: 'secondary',
                    button2: 'Cancel',
                    inputField: 'true',
                  });
                  setRevealAlert(!revealAlert);
                  console.log('Add');
                }
              }}
            />
            {eventData?.tables != null && eventData?.tables != undefined && (
              <EditSeatsForEvent
                id={parseInt(params.id)}
                image={image}
                eventtype={eventtype}
                tag={tag}
                date={eventDateTime}
                tables={eventData?.tables!}
                onReturn={(style1: string, text1: string) => {
                  if (style1 == 'Loading' && text1 == 'Finish') {
                    setLoadState({ front: loadState.front, back: true });
                  } else if (style1 == 'Request' && text1 == 'Start') {
                    setLoading(true);
                  } else if (style1 == 'Request' && text1 == 'Done') {
                    setLoading(false);
                  } else if (style1 == 'Response') {
                    let responseData = text1.split('|');
                    if (responseData[0] == '201') {
                      setAlertStyle({
                        variantHead: 'warning',
                        heading: 'Message',
                        text: responseData[1],
                        color1: 'success',
                        button1: 'Ok',
                        color2: '',
                        button2: '',
                        inputField: '',
                      });
                      setRevealAlert(!revealAlert);
                    }
                    if (responseData[0] == '301') {
                      setAlertStyle({
                        variantHead: 'danger',
                        heading: 'Warning',
                        text: responseData[1],
                        color1: 'warning',
                        button1: 'Ok',
                        color2: '',
                        button2: '',
                        inputField: '',
                      });
                      setRevealAlert(!revealAlert);
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
