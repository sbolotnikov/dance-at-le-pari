'use client';
import { useEffect, useState } from 'react';
import AlertMenu from './alertMenu';
import ImgFromDb from './ImgFromDb';
import ShowIcon from './svg/showIcon';
import { TTemplateSmall } from '@/types/screen-settings';

type TAlertType = {
  onReturn: (val2: number[] ) => void;
};

export default function ChooseTemplates(props: TAlertType) {
  // main popup alert component
  // DO NOT FORGET TO NAME main tag id="mainPage"
  const [displayTemplates, setDisplayTemplates] = useState<TTemplateSmall[]>(
    []
  );
  const [revealAlert, setRevealAlert] = useState(false);
  const [eventsArray, setEventsArray] = useState<number[]>([]);
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
  const el = document.querySelector('#mainPage');

  function StopScroll() {
    // prevent scrolling
    var x = 0;
    var y = el!.scrollTop;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };
  }
  function AllowScroll() {
    // when done release scroll
    window.onscroll = function () {};
  }
  const onReturnAlert = async (decision1: string) => {
    setRevealAlert(false);
    if (decision1 == 'Cancel') {
    }
    if (decision1 == 'Confirm') {
      //   props.onReturn( [teacherID!]);
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
      })
      .catch((error) => {
        console.log(error);
      });
  };
 
  useEffect(() => {
    console.log('inside ChooseTemplate')
    refreshTemplates();
    console.log(displayTemplates)
  }, []);
  return (
    <div className="w-[100vw] h-[100svh] absolute flex justify-center items-center bg-slate-500/70 left-0 z-[1001] backdrop-blur-md" style={{ top: el!.scrollTop }} >
      {revealAlert && (
        <AlertMenu onReturn={onReturnAlert} styling={alertStyle} />
      )}
      <div className="m-auto  max-w-[600px] bg-gray-200 border-2 border-solid border-gray-400 rounded-md w-[97%] p-2 flex flex-col content-evenly">
        <label className="px-1 py-2 border-2 border-solid border-transparent rounded-sm w-full m-1 text-center">
          Available templates
        </label>
        <h5
          className="px-1 py-2 border-2 border-solid border-transparent text-light rounded-sm w-full m-1 text-center"
          dangerouslySetInnerHTML={{ __html: 'Choose few' }}
        />
        <div className="w-full h-28 relative overflow-scroll border border-lightMainColor dark:border-darkMainColor rounded-md">
          <div className="absolute top-0 left-0  min-w-full h-full flex flex-wrap items-center justify-between ">
            {displayTemplates.length > 0 && (displayTemplates>=[]) &&
              displayTemplates.map((item, i) => (
                <div
                  key={item.id}
                  className="m-1 mr-4 flex flex-col items-start justify-around"
                >
                  <div className="relative">
                    <div
                      className=" h-16 w-16 md:h-20 md:w-20 cursor-pointer fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor "
                      onClick={(e) => {
                        e.preventDefault();
                        let arr=[...eventsArray]
                        if (arr.indexOf(item.id)>=0){
                          arr.splice(arr.indexOf(item.id), 1)
                        } else arr.push(item.id);
                        console.log(arr)
                        setEventsArray(arr); 

                      }}
                    >
                      {item.image !== null && item.image !== '' && item.image !== undefined ? (
                        <div>
                          <ImgFromDb
                            url={item.image}
                            stylings="object-contain rounded-md"
                            alt="Template Picture"
                          />
                        </div>
                      ) : (
                        <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                          <ShowIcon icon={'Template'} stroke={'2'} />
                        </div>
                      )}
                    </div>
                    <h2 className="max-w-[100px] text-center">{item.tag}</h2>
                     {/* {item.visibility && */}
                     {(eventsArray.indexOf(item.id)>=0) &&
                     <button
                      className=' outline-none border-none  fill-green-500  stroke-green-500  rounded-md border-green-500 absolute p-1 -top-1 -right-9 w-10 h-10' 
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <ShowIcon icon={'Checkmark'} stroke={'0.5'} />
                    </button>
                     }
                  </div>

                  
                </div>
              ))}
          </div>
        </div>

        <button
          className="btnFancy w-[90%]"
          onClick={async(e) => {
            AllowScroll();
            const res = await fetch('/api/admin/update_front_events', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                events: eventsArray,
              }),
            });
            console.log(res);
            props.onReturn([]);
          }}
        >
          {'Close'}
        </button>
      </div>
    </div>
  );
}
