'use client';
import { useEffect, useState } from 'react';
import { deleteImage, uploadImage } from '@/utils/picturemanipulation';
import { TImage } from '@/types/screen-settings';
import Image from 'next/image';
import ShowIcon from './svg/showIcon';
import AlertMenu from './alertMenu';

type TAlertType = {
  //   styling:{
  // variantHead: string,
  // heading: string,
  // text: string,
  // color1: string,
  // button1: string,
  // color2: string,
  // button2: string,
  // inputField:string,
  // },
  onReturn: (val: string, val2: string) => void;
};

export default function ChoosePicture(props: TAlertType) {
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
  const [displayPics, setDisplayPics] = useState<TImage[]>([]);
  const [imageID, setImageID] = useState('');

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
    if (decision1 == 'Delete') {
      await deleteImage(imageID);
      refreshPictures();
    }
    if (decision1 == 'Confirm') {
      props.onReturn('Upload', imageID);
    }
  };
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const img = await uploadImage(
      e.currentTarget.files![0],
      400,
      300,
      'Events'
    );
    console.log(img);
    refreshPictures();

    //    if (img!=='Error uploading') props.onReturn("Upload",img!);
  };
  const refreshPictures = () => {
    fetch('/api/admin/get_all_saved_pics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDisplayPics(data);
      });
  };
  useEffect(() => {
    StopScroll();
    refreshPictures();
  }, []);
  return (
    <div
      className="blurFilter w-[100svw] h-[100svh] absolute flex justify-center items-center bg-slate-500/70 left-0 z-[1001]"
      style={{ top: el!.scrollTop }}
    >
        <AlertMenu visibility={revealAlert}  onReturn={onReturnAlert} styling={alertStyle} />
      <div className="m-auto  max-w-[600px] bg-gray-200 border-2 border-solid border-gray-400 rounded-md w-[97%] p-2 flex flex-col content-evenly">
        <label className="px-1 py-2 border-2 border-solid border-transparent rounded-sm w-full m-1 text-center">
          Available images
        </label>
        <h5
          className="px-1 py-2 border-2 border-solid border-transparent text-light rounded-sm w-full m-1 text-center"
          dangerouslySetInnerHTML={{ __html: 'Choose one' }}
        />
        <div className="w-full h-28 relative   overflow-scroll ">
          <div className="absolute top-0 left-0  min-w-full   flex flex-wrap items-start justify-start ">
            {displayPics.length > 0 &&
              displayPics.map((item) =>
                item.file !== null && item.file !== undefined ? (
                  <div key={item.id} className="m-1 mr-4 relative">
                    <Image
                      src={item.file}
                      width={100}
                      height={90}
                      onClick={(e) => {
                        e.preventDefault();
                        setAlertStyle({
                          variantHead: 'info',
                          heading: 'Warning',
                          text: 'Would you like to choose this Image?',
                          color1: 'info',
                          button1: 'Confirm',
                          color2: 'secondary',
                          button2: 'Cancel',
                          inputField: '',
                        });
                        setImageID(item.id);
                        setRevealAlert(!revealAlert);
                        return;
                      }}
                      alt="User Picture"
                    />
                    <button
                      className=" outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor absolute p-1 -top-1 -right-9 w-10 h-10"
                      onClick={(e) => {
                        e.preventDefault();
                        setAlertStyle({
                          variantHead: 'danger',
                          heading: 'Warning',
                          text: 'You are about to Delete Image!',
                          color1: 'danger',
                          button1: 'Delete',
                          color2: 'secondary',
                          button2: 'Cancel',
                          inputField: '',
                        });
                        setImageID(item.id);
                        setRevealAlert(!revealAlert);
                        return;
                      }}
                    >
                      <ShowIcon icon={'Close'} stroke={'2'} />
                    </button>
                  </div>
                ) : (
                  <></>
                )
              )}
          </div>
        </div>
        <input
          type="file"
          hidden
          id="inputField"
          accept="image/*"
          className="w-full mb-2 rounded-md text-gray-700"
          onChange={handleChange}
        />
        <button
          className="btnFancy w-[90%]"
          onClick={() => {
            AllowScroll();
            document.getElementById('inputField')!.click();
          }}
        >
          {'Upload'}
        </button>
        <button
          className="btnFancy w-[90%]"
          onClick={(e) => {
            AllowScroll();
            props.onReturn('Close', '');
          }}
        >
          {'Close'}
        </button>
      </div>
    </div>
  );
}
