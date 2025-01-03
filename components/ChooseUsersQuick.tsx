'use client';
import { useEffect } from 'react';
import ImgFromDb from './ImgFromDb';
import ShowIcon from './svg/showIcon';
import { TTeacherInfo } from '@/types/screen-settings';

type TAlertType = {
  onReturn: (val: string, val2: TTeacherInfo | null) => void;
  
  title:string;
  selectedUsers:TTeacherInfo[];
};

export default function ChooseUsersQuick(props: TAlertType) {
  // DO NOT FORGET TO NAME main tag id="mainPage"
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
  useEffect(() => {
    StopScroll();
  }, []);
  return (
    <div
      className="blurFilter w-[100vw] h-[100svh] absolute flex justify-center items-center bg-slate-500/70 left-0 z-[1001] "
      style={{ top: el!.scrollTop }}
    >
      
      <div className="m-auto  max-w-[600px] bg-lightMainBG dark:bg-darkMainBG border-2 border-solid border-gray-400 rounded-md w-[97%] p-2 flex flex-col content-evenly">
        <label className="px-1 py-2 border-2 border-solid uppercase border-transparent rounded-sm w-full m-1 text-center">
          {"Choose "+props.title}
        </label>
        <h5
          className="px-1 py-2 border-2 border-solid border-transparent text-light rounded-sm w-full m-1 text-center"
          dangerouslySetInnerHTML={{ __html: 'Choose one' }}
        />
        <div className="w-full h-28 relative   overflow-y-auto ">
          <div className="absolute top-0 left-0  min-w-full   flex flex-wrap items-center justify-center ">
            {props.selectedUsers.length > 0 &&
              props.selectedUsers.map((item, index) =>
                
                  <div
                    key={'Teacher' + index}
                    className="m-1 mr-4 relative cursor-pointer flex flex-col justify-center items-center "
                    onClick={(e) => {
                      e.preventDefault();
                      props.onReturn('Confirm', item);
                    }}
                  >
                    {(
                      item.image == null ||
                      item.image == '' ||
                      item.image == undefined
                    ) ? (
                      <div className=" h-12 w-12 md:h-16 md:w-16 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                        <ShowIcon icon={'DefaultUser'} stroke={'2'} />
                      </div>
                    ) : (
                      <div className=" h-12 w-12 md:h-16 md:w-16 rounded-xl overflow-hidden">
                        <ImgFromDb
                          url={item.image}
                          stylings="object-contain h-full w-full overflow-hidden rounded-xl"
                          alt="Event Picture"
                        />
                      </div>
                    )}
                    <h2 className="text-center flex-wrap truncate  w-12 md:w-16">
                      {item.name}
                    </h2>
                  </div>
               
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
