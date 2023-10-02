'use client';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import EventTemplateEditingForm from '@/components/EventTemplateEditingForm';
import ShowIcon from '@/components/svg/showIcon';
import Image from 'next/image';
import { TTemplateSmall } from '@/types/screen-settings';
import ImgFromDb from '@/components/ImgFromDb';
import AlertMenu from '@/components/alertMenu';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [revealTemplateEdit, setRevealTemplateEdit] = useState(false);
  const [displayTemplates, setDisplayTemplates] = useState<TTemplateSmall[]>([]);
  const dateTimeRef = useRef<HTMLInputElement>(null);
  const [template1, setTemplate1] = useState<TTemplateSmall>();
  const [delTemplateID, setDelTemplateID] = useState(-1);
  const [revealAlert, setRevealAlert] = useState(false);
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
  const onReturn = async (decision1: string) => {
    setRevealAlert(false);
    if (decision1 == 'Delete') {
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
  console.log(displayTemplates);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />}
      {revealTemplateEdit == true ? (
        <EventTemplateEditingForm onReturn={()=>setRevealTemplateEdit(false)}/>
      ) : (
        <div
          className="   shadow-2xl w-[90%]  max-w-[450px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md border rounded-md border-lightMainColor dark:border-darkMainColor p-1 m-1"
        >
          <div className="border rounded-md border-lightMainColor dark:border-darkMainColor p-1">
            <h2
              className="text-center font-bold uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Event Editing
            </h2>
            <div className="w-full h-28 relative   overflow-scroll border border-lightMainColor dark:border-darkMainColor rounded-md">
              <div className="absolute top-0 left-0  min-w-full  flex flex-wrap items-start justify-start ">
                {displayTemplates.length > 0 &&
                  displayTemplates.map((item) => (
                    <div
                      key={item.templateID}
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
                            setDelTemplateID(item.templateID);
                            setRevealAlert(!revealAlert);
                            return;
                          }}
                        >
                          <ShowIcon icon={'Close'} stroke={'2'} />
                        </button>
                      </div>

                      <h2 className="max-w-[100px] text-center">{item.tag}</h2>
                    </div>
                  ))}
                <div className="m-1 mr-4 flex flex-col items-center justify-center">
                  <div
                    className=" h-8 w-8 md:h-10 md:w-10 cursor-pointer border flex justify-center items-center pt-0.5 pl-0.5 border-lightMainColor dark:border-darkMainColor rounded-md fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor "
                    onClick={(e) => {
                      e.preventDefault();
                      setRevealTemplateEdit(true);
                    }}
                  >
                    <ShowIcon icon={'Plus'} stroke={'2'} />
                  </div>
                  <h2 className="max-w-[100px] text-center">Add Template</h2>
                </div>
              </div>
            </div>
            <h2 className="flex flex-row justify-center items-center   m-1">
              {template1 !== undefined
                ? `${template1?.eventtype} ${template1?.tag}`
                : ''}
            </h2>
            {template1 !== undefined ? (
              <ImgFromDb
                url={template1.image}
                stylings="object-contain m-auto"
                alt="Template Picture"
              />
            ) : (
              <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor m-auto stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                <ShowIcon icon={'Template'} stroke={'2'} />
              </div>
            )}
            <label className="flex flex-row justify-between items-center m-1">
              Day Time
              <input
                className="flex-1 outline-none border-none rounded-md   text-lightMainColor p-0.5 mx-1"
                 ref={dateTimeRef}
                type="datetime-local"
                required
              />
            </label>
            <button
              className="btnFancy w-[90%]"
              disabled={loading}
              onClick={(e)=>{
                e.preventDefault();
                if (template1==undefined) {
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
                if (dateTimeRef.current?.value=='') {
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
                 setLoading (true)
                console.log({date:dateTimeRef.current?.value,templateID:template1.templateID, tag:template1.tag, eventtype:template1.eventtype})
                setLoading(true);
                fetch('/api/admin/create_event', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    date:dateTimeRef.current?.value,templateID:template1.templateID, tag:template1.tag, eventtype:template1.eventtype
                  }), 
                }).then(async (res) => {
                   
                    setLoading(false);
                    setAlertStyle({
                      variantHead: 'info',
                      heading: 'Message',
                      text: 'You successfully  create new Event.',
                      color1: 'secondary',
                      button1: 'Ok',
                      color2: '',
                      button2: '',
                      inputField: '',
                    });
            
                    setRevealAlert(true);
                    console.log(res);
                  
                }).catch(error => {console.log(error);});
              }}
              //   disabled={loading}
            >
              Create Event
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default page;
