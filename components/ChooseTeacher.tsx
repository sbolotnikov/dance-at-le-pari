'use client';
import { useEffect, useState } from 'react';
import { deleteImage, uploadImage } from '@/utils/picturemanipulation';
import Image from 'next/image';
import AlertMenu from './alertMenu';
import ImgFromDb from './ImgFromDb';
import ShowIcon from './svg/showIcon';
import { TTeacherInfo } from '@/types/screen-settings';

type TAlertType = {
  onReturn: (val: string, val2: TTeacherInfo | null) => void;
};

export default function ChooseTeacher(props: TAlertType) {
  // main popup alert component
  // DO NOT FORGET TO NAME main tag id="mainPage"
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
  const el = document.querySelector('#mainPage');
  const [displayTeachers, setDisplayTeachers] = useState<TTeacherInfo[]>([]);
  const [teacherID, setTeacherID] = useState<TTeacherInfo>();

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
      props.onReturn('Confirm', teacherID!);
    }
  };
  const refreshTeachers = () => {
    fetch('/api/admin/get_all_teachers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDisplayTeachers(data);
      });
  };
  useEffect(() => {
    StopScroll();
    refreshTeachers();
  }, []);
  return (
    <div
      className="w-[100vw] h-[100svh] absolute flex justify-center items-center bg-slate-500/70 left-0 z-[1001] backdrop-blur-md"
      style={{ top: el!.scrollTop }}
    >
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturnAlert}
        styling={alertStyle}
      />
      <div className="m-auto  max-w-[600px] bg-gray-200 border-2 border-solid border-gray-400 rounded-md w-[97%] p-2 flex flex-col content-evenly">
        <label className="px-1 py-2 border-2 border-solid border-transparent rounded-sm w-full m-1 text-center">
          Available teachers
        </label>
        <h5
          className="px-1 py-2 border-2 border-solid border-transparent text-light rounded-sm w-full m-1 text-center"
          dangerouslySetInnerHTML={{ __html: 'Choose one' }}
        />
        <div className="w-full h-28 relative   overflow-scroll ">
          <div className="absolute top-0 left-0  min-w-full   flex flex-wrap items-start justify-start ">
            {displayTeachers.length > 0 &&
              displayTeachers.map((item, index) =>
                item.image !== null && item.image !== undefined ? (
                  <div
                    key={'Teacher' + index}
                    className="m-1 mr-4 relative cursor-pointer flex flex-col justify-center items-center "
                    onClick={(e) => {
                      e.preventDefault();
                      setAlertStyle({
                        variantHead: 'info',
                        heading: 'Warning',
                        text: `Would you like to choose ${item.name} as Instructor?`,
                        color1: 'info',
                        button1: 'Confirm',
                        color2: 'secondary',
                        button2: 'Cancel',
                        inputField: '',
                      });
                      setTeacherID(item);
                      setRevealAlert(!revealAlert);
                      return;
                    }}
                  >
                    {item.image !== null &&
                    item.image !== '' &&
                    item.image !== undefined ? (
                      <div className=" h-12 w-12 md:h-16 md:w-16 rounded-xl overflow-hidden">
                        <ImgFromDb
                          url={item.image}
                          stylings="object-contain h-full w-full overflow-hidden rounded-xl"
                          alt="Event Picture"
                        />
                      </div>
                    ) : (
                      <div className=" h-12 w-12 md:h-16 md:w-16 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                        <ShowIcon icon={'DefaultUser'} stroke={'2'} />
                      </div>
                    )}
                    <h2 className="text-center flex-wrap truncate  w-12 md:w-16">
                      {item.name}
                    </h2>
                  </div>
                ) : (
                  <div key={'Teacher' + index}></div>
                )
              )}
          </div>
        </div>

        <button
          className="btnFancy w-[90%]"
          onClick={(e) => {
            AllowScroll();
            props.onReturn('Close', null);
          }}
        >
          {'Close'}
        </button>
      </div>
    </div>
  );
}
