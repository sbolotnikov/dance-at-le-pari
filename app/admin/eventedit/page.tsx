'use client';
import { FC, useEffect, useState } from 'react';
import { useRef } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import EventTemplateEditingForm from '@/components/EventTemplateEditingForm';
import ShowIcon from '@/components/svg/showIcon';
import Image from 'next/image';
import { TTemplateSmall } from '@/types/screen-settings';
import ImgFromDb from '@/components/ImgFromDb';
import AlertMenu from '@/components/alertMenu';
import ChooseTemplates from '@/components/ChooseTemplates';
import ChoosePicture from '@/components/ChoosePicture';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [revealTemplateEdit, setRevealTemplateEdit] = useState(false);
  const [displayTemplates, setDisplayTemplates] = useState<TTemplateSmall[]>(
    []
  );
  const dateTimeRef = useRef<HTMLInputElement>(null);
  const [complexEvent, setComplexEvent] = useState<boolean>(false);
  const [seatsPerTable, setSeatsPerTable] = useState<Number[]>([8, 7]);
  const [template1, setTemplate1] = useState<TTemplateSmall>();
  const [revealCloud, setRevealCloud] = useState(false);
  const [image, setImage] = useState('');
  const [delTemplateID, setDelTemplateID] = useState(-1);
  const [delTable, setDelTable] = useState(-1);
  const [revealAlert, setRevealAlert] = useState(false);
  const [revealFrontTemplates, setRevealFrontTemplates] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const onReturn = async (decision1: string, amount: string | null) => {
    setRevealAlert(false);
    let tableArr = seatsPerTable;
    if (decision1 === 'Eliminate Table') {
      // setSeatsPerTable
      tableArr.splice(delTable, 1);
      setSeatsPerTable([...tableArr]);
      console.log('Table delete');
    }
    if (decision1 === 'Create Table') {
      tableArr[delTable] = parseInt(amount!);
      setSeatsPerTable([...tableArr]);
      console.log(tableArr);
    }
    if (decision1 === 'Delete') {
      fetch('/api/admin/del_event_template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: delTemplateID,
        }),
      }).then(() => {
        window.location.reload();
      });
    }
  };
  const refreshTemplates = () => {
    fetch('/api/admin/get_event_templates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDisplayTemplates(data);
      });
  };

  useEffect(() => {
    refreshTemplates();
  }, []);
  const onReturnPicture = (decision1: string, fileLink: string) => {
    setRevealCloud(false);
    if (decision1 == 'Close') {
      console.log(decision1);
    }
    if (decision1 == 'Upload') {
      console.log('file link', fileLink);
      setImage(fileLink);
    }
  };
  console.log(displayTemplates);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />}
      {revealCloud && <ChoosePicture onReturn={onReturnPicture} />}
      {revealFrontTemplates && (
        <ChooseTemplates onReturn={() => setRevealFrontTemplates(false)} />
      )}
      {revealTemplateEdit == true ? (
        <EventTemplateEditingForm
          onReturn={() => setRevealTemplateEdit(false)}
          template={template1?.id}
        />
      ) : (
        <div className="   shadow-2xl w-[90%]  max-w-[450px] md:w-full h-[70svh] md:h-[90%] bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md border-0 rounded-md  p-2 mt-6">
          <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full relative  p-1 flex  overflow-y-scroll">
            <div className="flex flex-col w-full p-1 justify-center items-center absolute top-0 left-0">
              <h2
                className="text-center font-bold uppercase"
                style={{ letterSpacing: '1px' }}
              >
                Add Events
              </h2>
              <div className="  h-20 w-20 md:h-28 md:w-28 mb-6 m-auto">
              <ShowIcon icon={'Plus'} stroke={'0.1'} />
            </div>
              <div className="w-full h-28 relative   overflow-scroll border border-lightMainColor dark:border-darkMainColor rounded-md">
                <div className="absolute top-0 left-0  min-w-full  flex flex-wrap items-start justify-start ">
                  {displayTemplates.length > 0 &&
                    displayTemplates.map((item) => (
                      <div
                        key={item.id}
                        className="m-1 mr-4 flex flex-col items-center justify-center"
                      >
                        <div className="relative h-8 w-8 md:h-10 md:w-10">
                          <div
                            className=" h-8 w-8 md:h-10 md:w-10 cursor-pointer fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor "
                            onClick={(e) => {
                              e.preventDefault();
                              setTemplate1(item);
                            }}
                          >
                            <ShowIcon icon={'Template'} stroke={'2'} />
                          </div>
                          <button
                            className=" outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor absolute p-1 -top-1 -right-9 w-10 h-10"
                            onClick={(e) => {
                              e.preventDefault();
                              setAlertStyle({
                                variantHead: 'danger',
                                heading: 'Warning',
                                text: 'You are about to Delete this Template!',
                                color1: 'danger',
                                button1: 'Delete',
                                color2: 'secondary',
                                button2: 'Cancel',
                                inputField: '',
                              });
                              setDelTemplateID(item.id);
                              setRevealAlert(!revealAlert);
                              return;
                            }}
                          >
                            <ShowIcon icon={'Close'} stroke={'2'} />
                          </button>
                        </div>

                        <h2 className="max-w-[100px] text-center">
                          {item.tag}
                        </h2>
                      </div>
                    ))}
                  <div className="m-1 mr-4 flex flex-col items-center justify-center">
                    <div
                      className=" h-8 w-8 md:h-10 md:w-10 cursor-pointer relative  fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor "
                      onClick={(e) => {
                        e.preventDefault();
                        setRevealTemplateEdit(true);
                      }}
                    >
                      <ShowIcon icon={'Plus'} stroke={'2'} />
                    </div>
                    <h2 className="max-w-[100px] text-center">Add Service</h2>
                  </div>
                </div>
              </div>
              {template1 !== undefined && (
                <h2 className="flex flex-row justify-center items-center  relative  m-1">
                  {template1?.eventtype + ' ' + template1?.tag}
                  <div
                    className="absolute -top-1 right-5 h-6 w-6 md:h-7 md:w-7 fill-green-600 m-auto stroke-lightMainColor dark:fill-green-600 dark:stroke-darkMainColor cursor-pointer "
                    onClick={(e) => {
                      e.preventDefault();
                      setRevealTemplateEdit(true);
                    }}
                  >
                    <ShowIcon icon={'Edit'} stroke={'0.5'} />
                  </div>
                </h2>
              )}
              <div className="w-full h-20 flex  justify-center items-center">
                <div className="relative flex  justify-center items-center outline-none border border-lightMainColor dark:border-darkMainColor rounded-md w-24 mx-auto">
                  {template1 !== undefined ? (
                    <ImgFromDb
                      url={template1.image}
                      stylings="object-contain m-auto"
                      alt="Template Picture"
                    />
                  ) : (
                    <div className=" h-8 w-8 md:h-10 md:w-10 mt-1 fill-lightMainColor m-auto stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                      <ShowIcon icon={'Image'} stroke={'0.75'} />
                    </div>
                  )}
                </div>
              </div>
              <label className="flex flex-row justify-between items-center">
                Day Time
                <input
                  className="flex-1 outline-none border-none rounded-md   text-lightMainColor p-0.5 mx-1"
                  ref={dateTimeRef}
                  type="datetime-local"
                  required
                />
              </label>
              <div className="flex flex-col justify-center items-center border border-lightMainColor dark:border-darkMainColor rounded-md p-1 m-1">
                <label
                  className="flex flex-row cursor-pointer justify-center text-center items-start"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('click');
                    setComplexEvent(!complexEvent);
                  }}
                >
                  <div className=" h-4 w-4 md:h-5 md:w-5 m-2 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                    {complexEvent ? (
                      <ShowIcon icon={'Checkmark'} stroke={'0.5'} />
                    ) : (
                      <ShowIcon icon={'Close'} stroke={'0.5'} />
                    )}
                  </div>
                  Event with Assigned seats
                </label>
                {complexEvent == true && (
                  <div className="w-full">
                    <div className="w-full h-20 flex  justify-center items-center">
                      <div className="relative flex  justify-center items-center outline-none border border-lightMainColor dark:border-darkMainColor rounded-md w-24 my-2 mx-auto">
                        {image !== null &&
                        image !== '' &&
                        image !== undefined ? (
                          <ImgFromDb
                            url={image}
                            stylings="object-contain"
                            alt="Event Picture"
                          />
                        ) : (
                          <div className=" h-8 w-8 md:h-10 md:w-10 m-2 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                            <ShowIcon icon={'Image'} stroke={'0.75'} />
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
                    </div>

                    <div className="w-full h-28 relative   overflow-scroll border border-lightMainColor dark:border-darkMainColor rounded-md">
                      <div className="absolute top-0 left-0  min-w-full  flex flex-wrap items-start justify-start ">
                        {seatsPerTable.length > 0 &&
                          seatsPerTable.map((item, index) => (
                            <div
                              key={'table_' + index}
                              className="m-1 mr-4 flex flex-col items-center justify-center"
                            >
                              <div className="relative h-8 w-8 md:h-10 md:w-10">
                                <div
                                  className=" h-8 w-8 md:h-10 md:w-10 cursor-pointer fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor "
                                  onClick={(e) => {
                                    e.preventDefault();
                                    console.log(index);
                                    setDelTable(index);
                                    e.preventDefault();
                                    setAlertStyle({
                                      variantHead: 'info',
                                      heading: 'Info',
                                      text: 'Please enter new seats amount fot this Table!',
                                      color1: 'success',
                                      button1: 'Create Table',
                                      color2: 'secondary',
                                      button2: 'Cancel',
                                      inputField: 'true',
                                    });
                                    setRevealAlert(!revealAlert);
                                  }}
                                >
                                  <ShowIcon icon={'Table'} stroke={'0.05'} />
                                </div>
                                <button
                                  className="flex items-center justify-center outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor absolute p-1 -top-1 -right-9 w-10 h-10"
                                  onClick={(e) => {
                                    setDelTable(index);
                                    e.preventDefault();
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
                                    // setDelTemplateID(item.templateID);
                                    setRevealAlert(!revealAlert);
                                    return;
                                  }}
                                >
                                  <ShowIcon icon={'Close'} stroke={'2'} />
                                </button>
                              </div>

                              <h2 className="max-w-[100px] text-center">
                                {item.toString()}
                              </h2>
                            </div>
                          ))}
                        <div className="m-1 mr-4 flex flex-col items-center justify-center">
                          <div
                            className=" h-8 w-8 md:h-10 md:w-10 cursor-pointer relative fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor "
                            onClick={(e) => {
                              e.preventDefault();
                              console.log(seatsPerTable.length);
                              setDelTable(seatsPerTable.length);
                              setAlertStyle({
                                variantHead: 'info',
                                heading: 'Info',
                                text: 'Please enter new seats amount fot new Table!',
                                color1: 'success',
                                button1: 'Create Table',
                                color2: 'secondary',
                                button2: 'Cancel',
                                inputField: 'true',
                              });
                              setRevealAlert(!revealAlert);
                            }}
                          >
                            <ShowIcon icon={'Plus'} stroke={'2'} />
                          </div>
                          <h2 className="max-w-[100px] text-center">
                            Add Table
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                className="btnFancy w-[90%]"
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  if (template1 == undefined) {
                    setAlertStyle({
                      variantHead: 'danger',
                      heading: 'Warning',
                      text: 'Please choose one of templates!',
                      color1: 'info',
                      button1: 'Ok',
                      color2: '',
                      button2: '',
                      inputField: '',
                    });
                    setRevealAlert(!revealAlert);
                    return;
                  }
                  if (dateTimeRef.current?.value == '') {
                    setAlertStyle({
                      variantHead: 'danger',
                      heading: 'Warning',
                      text: 'Please choose event starting Date and Time!',
                      color1: 'info',
                      button1: 'Ok',
                      color2: '',
                      button2: '',
                      inputField: '',
                    });
                    setRevealAlert(!revealAlert);
                    return;
                  }
                  console.log({
                    date: dateTimeRef.current?.value,
                    templateID: template1.id,
                    tag: template1.tag,
                    eventtype: template1.eventtype,
                  });
                  setLoading(true);

                  // complexEvent, tables:seatsPerTable,  seatmap:image

                  fetch('/api/admin/create_event', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json, text/plain, */*',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      date: dateTimeRef.current?.value,
                      templateID: template1.id,
                      image: template1.image,
                      tag: template1.tag,
                      eventtype: template1.eventtype,
                      tables: complexEvent ? seatsPerTable : [],
                      seatmap: complexEvent ? image : null,
                      length: template1.length,
                      price: template1.price,
                      teachersid: template1.teachersid,
                      title: template1.title,
                      location: template1.location,
                      description: template1.description,
                      visible: template1.visible,
                    }),
                  })
                    .then(async (res) => {
                      setLoading(false);
                      console.log(res);
                      setAlertStyle({
                        variantHead: 'info',
                        heading: 'Message',
                        text:
                          'You successfully  create new Event.' + res.status,
                        color1: 'secondary',
                        button1: 'Ok',
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
                }}
                //   disabled={loading}
              >
                Create Event
              </button>
              <button
                className="btnFancy w-[90%]"
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  setRevealFrontTemplates(true);
                }}
              >
                Front Page Events
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default page;
