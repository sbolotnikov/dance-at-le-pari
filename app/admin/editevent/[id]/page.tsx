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
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { id: string } }) {
  const [eventData, setEventData] = useState<TFullEvent>();
  const [revealCloud, setRevealCloud] = useState(false);
  const [revealAlert, setRevealAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadState, setLoadState] = useState({ front: false, back: false });
  const [tableIndex, setTableIndex] = useState<number>(0);
  const [image, setImage] = useState('');
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
  const fixTables=(tables:number[])=>{
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
            })
          }
          
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
         
        });
  }
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

        eventDataCopy.tables[tableIndex] = parseInt(val2 ? val2 : '0');
        console.log(tableIndex, val2, 'new table size', eventDataCopy?.tables);
      }
      setEventData(eventDataCopy);
    }
    if (decision1 == 'Eliminate Table') {
      let eventDataCopy = eventData;
      eventDataCopy?.tables?.splice(tableIndex, 1);
      setEventData(eventDataCopy);
    }
    if ((decision1 == 'Create Table')&&(val2 != null)&&(parseInt(val2))) {
      let eventDataCopy = eventData;
      eventDataCopy?.tables?.push( parseInt(val2));
      if ((eventDataCopy?.tables!=null)&&(eventDataCopy?.tables!=undefined)) fixTables(eventDataCopy?.tables)
    }
   
  };
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
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {revealAlert && (
        <AlertMenu onReturn={onReturnAlert} styling={alertStyle} />
      )}
      {loading && <LoadingScreen />}
      {revealCloud && <ChoosePicture onReturn={onReturnPicture} />}
      <div className="border-0 rounded-md px-4 pt-4 shadow-2xl w-[90%] max-w-[1350px] max-h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
        <h2
          onClick={(e) => {
            e.preventDefault();
            setLoading(true);
          }}
        >
          Event editing {params.id}
        </h2>
        <EditTablesForEvent
          tables={eventData?.tables}
          image={eventData?.image}
          onReturn={(str1, n) => {
            if (str1 == 'Image') {
              setRevealCloud(!revealCloud);
            }
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
    </PageWrapper>
  );
}
