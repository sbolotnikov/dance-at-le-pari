'use client';

import { useState, useEffect, use } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import ChooseVideosModal from './ChooseVideosModal';
import ShowPlayingModal from './ShowPlayingModal';
import ColorChoiceModal from './ColorChoiceModal';
import ChoosePicturesModal from './ChoosePicturesModal';
import CountBox from './CountBox';
import usePartySettings from './usePartySettings';
import ChooseMessageModal from './ChooseMessageModal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useSession } from 'next-auth/react';

type Props = {
  // Add any props if needed
};

const page: React.FC<Props> = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [modal4Visible, setModal4Visible] = useState(false);
  const [modal5Visible, setModal5Visible] = useState(false);
  const [refreshVar, setRefreshVar] = useState(false);
  const [refreshVar2, setRefreshVar2] = useState(false);
  const { data: session } = useSession();
  const [galleryType, setGalleryType] = useState<'auto' | 'manual' | null>(
    null
  );
  const [galleryArr, setGalleryArr] = useState<
    {
      link: string;
      name: string;
    }[]
  >([]);
  const [videoSearchText, setVideoSearchText] = useState('');

  useEffect(() => {
    let timerInterval: any;
    if (modalVisible) {
      timerInterval = setInterval(function () {
        setRefreshVar((prev) => !prev);
      }, 1000);
    } else {
      clearInterval(timerInterval);
    }
  }, [modalVisible, refreshVar2]);
  
  const {
    image,
    name,
    message,
    mode,
    fontSize,
    displayedPictures,
    displayedPicturesAuto,
    seconds,
    manualPicture,
    displayedVideos,
    videoChoice,
    compLogo,
    titleBarHider,
    showUrgentMessage,
    savedMessages,
    textColor,
    animationSpeed,
    speedVariation,
    particleCount,
    maxSize,
    animationOption,
    rainAngle,
    originX,
    originY,
    showSVGAnimation,
    particleTypes,
    setCompID,
  } = usePartySettings();
  const typesSet = ["star",'snowflake', 'heart', 'home',"maple",'rose','diamond','clover','streamer','lightning','hydrangea'];
  const reverseColor = (str: string) => {
    console.log(str);
    let n = parseInt(str.slice(1), 16);
    console.log(n);
    let retString = '#';
    let rev = 0;

    // traversing bits of 'n'
    // from the right
    while (n > 0) {
      // bitwise left shift
      // 'rev' by 1
      rev <<= 1;

      // if current bit is '1'
      if ((n & 1) == 1) rev ^= 1;

      // bitwise right shift
      //'n' by 1
      n >>= 1;
    }
    return '#' + rev.toString(16);
  };
   
  // const videoSearch = async (link: string) => {
  //   try {
  //     const data = await fetch(
  //       'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=' +
  //         link +
  //         '&key=' +
  //         process.env.REACT_APP_FIREBASE_APIKEY,
  //       {
  //         cache: 'no-cache',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
  //     const res = await data.json();
  //     return res.items;
  //   } catch (error) {
  //     if (error) {
  //       return error;
  //     }
  //   }
  // };

  const handleChange = (
    text: number | string | boolean | object,
    eventName: string
  ) => {
    if (session?.user.role == 'Admin')
      updateDoc(doc(db, 'parties', 'A9UgRuKLaxvLPiSOwO1E'), {
        [eventName]: text,
      });
  };

  const onPressPicture = async (e: React.MouseEvent) => {
    e.preventDefault();
    let picURL = '';
    // handleChange(picURL, 'image');
  };
  const toggleParticleType = (type:string) => {
    handleChange( 
      particleTypes.includes(type) ? particleTypes.filter(t => t !== type) : [...particleTypes, type],'particleTypes'
    );
  };
  useEffect(() => {
    if (session?.user.role !== 'Admin') {
      window.location.href = '/competition';
    }
  }, []);

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      <ColorChoiceModal
        onSelectColor={(ret) => {
          console.log(ret);
          handleChange(ret, 'textColor');
          setModal5Visible(false);
        }}
        onClose={() => setModal5Visible(false)}
        vis={modal5Visible}
      />
      <ChooseVideosModal
        videosArray={displayedVideos}
        vis={modal4Visible}
        onClose={() => setModal4Visible(false)}
        onReturn={(ret) => {
          if (ret && ret.length > 0) {
            console.log(ret);
            handleChange(ret, 'displayedVideos');
          }
          setModal4Visible(false);
        }}
      />
      {modalVisible && (
        <ShowPlayingModal
          videoUri={videoChoice}
          manualPicture={manualPicture}
          displayedPicturesAuto={displayedPicturesAuto}
          button1="Ok"
          compName={name}
          heatNum={''}
          vis={modalVisible}
          mode={mode}
          fontSize={fontSize}
          seconds={seconds}
          message={message}
          compLogo={compLogo}
          titleBarHider={titleBarHider}
          showUrgentMessage={showUrgentMessage}
          textColor={textColor}
          animationSpeed={animationSpeed}
          speedVariation={speedVariation}
          particleCount={particleCount}
          maxSize={maxSize}
          animationOption={animationOption}
          rainAngle={rainAngle}
          originX={originX}
          originY={originY}
          showSVGAnimation={showSVGAnimation}
          particleTypes={particleTypes}
          onReturn={() => setModalVisible(false)}
          onRenewInterval={() => setRefreshVar2(!refreshVar2)}
        />
      )}
      {galleryType && (
        <ChoosePicturesModal
          displayPics={galleryArr}
          galleryType={galleryType}
          vis={modal3Visible}
          onReturn={(ret) => {
            if (ret && ret.length > 0) {
              galleryType === 'auto'
                ? handleChange(ret, 'displayedPicturesAuto')
                : handleChange(ret, 'displayedPictures');
            }
            setModal3Visible(false);
          }}
          onClose={() => setModal3Visible(false)}
        />
      )}
      <ChooseMessageModal
        savedMessages={savedMessages}
        message={message}
        onChange={(text) => {
          console.log(text);
          handleChange(text, 'message');
          setModal1Visible(false);
        }}
        onMessageArrayChange={(array) => {
          console.log(array);
          handleChange(array, 'savedMessages');
        }}
        vis={modal1Visible}
        onClose={() => setModal1Visible(false)}
      />
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[95%] max-w-[650px] max-h-[85%] h-[85%]  md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2 overflow-auto">
          {session?.user.role == 'Admin' && (
            <div className="absolute top-0 left-0 w-full p-2 flex flex-col justify-center items-center">
              <button
                className="w-[92%] h-48 m-1"
                onClick={(e) => onPressPicture(e)}
              >
                {image ? (
                  <div
                    className="h-full w-full rounded-md bg-center bg-no-repeat bg-contain"
                    style={{ backgroundImage: `url(${image})` }}
                  />
                ) : (
                  <div className="h-full w-full flex justify-center items-center">
                    <p>Please click to choose image</p>
                  </div>
                )}
              </button>
              <div className="w-full flex flex-row justify-center items-center">
                <div className="flex flex-col justify-center items-center">
                  {mode && (
                    <select
                      value={mode}
                      onChange={(e) => handleChange(e.target.value, 'mode')}
                      className="w-20 h-9 bg-white rounded-lg border border-[#776548] text-[#444] text-left"
                    >
                      {['Auto', 'Video', 'Manual', 'Default'].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-center w-20">Choose mode</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  {fontSize && (
                    <CountBox
                      startValue={fontSize}
                      setWidth={10}
                      name={'fontSize'}
                      onChange={(num) => {
                        console.log(num);
                        handleChange(num, 'fontSize');
                      }}
                    />
                  )}
                  <p className="text-center w-24">Choose font size</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <div className="h-8 w-8 rounded-full overflow-hidden border-none relative">
                    {textColor && (
                      <input
                        className=" outline-none h-10 w-10  absolute -top-1 -left-1  border-none "
                        name="color"
                        id="color"
                        type="color"
                        value={textColor}
                        onChange={async (e) => {
                          console.log(e.target.value);

                          handleChange(e.target.value, 'textColor');
                        }}
                      />
                    )}
                  </div>
                  <p className="text-center w-8">Text Color</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  {seconds && (
                    <CountBox
                      startValue={seconds}
                      setWidth={10}
                      name={'secondsLength'}
                      onChange={(num) => {
                        console.log(num);
                        handleChange(num, 'seconds');
                      }}
                    />
                  )}
                  <p className="text-center w-24">Choose seconds/frame</p>
                </div>
              </div>
              {displayedPictures && manualPicture && (
                <div className="w-full flex flex-col justify-center items-center">
                  <select
                    value={manualPicture?.name || ''}
                    onChange={(e) => {
                      const selectedPicture = displayedPictures.find(
                        (pic) => pic.name === e.target.value
                      );
                      if (selectedPicture) {
                        handleChange(
                          {
                            name: selectedPicture.name,
                            link: selectedPicture.link,
                          },
                          'manualPicture'
                        );
                      }
                    }}
                    className="w-60 h-9 bg-white rounded-lg border border-[#776548] text-[#444] text-left"
                  >
                    {displayedPictures
                      .sort((a, b) => (a.name! > b.name! ? 1 : -1))
                      .map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  <p className="text-center w-48">Choose Picture for manual</p>
                </div>
              )}
              <div className="w-full flex flex-col justify-center items-center">
                <div className="flex flex-row mb-5">
                  <input
                    type="checkbox"
                    checked={titleBarHider}
                    onChange={(e) =>
                      handleChange(e.target.checked, 'titleBarHider')
                    }
                    className="self-center"
                  />
                  <p className="ml-2">Hide Title Bar</p>
                </div>
              </div>
              {displayedPictures && (
                <div className="w-full flex flex-col justify-center items-center">
                  <select
                    value={compLogo?.name || ''}
                    onChange={(e) => {
                      const selectedLogo = displayedPictures.find(
                        (pic) => pic.name === e.target.value
                      );
                      if (selectedLogo) {
                        handleChange(
                          {
                            name: selectedLogo.name,
                            link: selectedLogo.link,
                          },
                          'compLogo'
                        );
                      }
                    }}
                    className="w-60 h-9 bg-white rounded-lg border border-[#776548] text-[#444] text-left"
                  >
                    {displayedPictures
                      .sort((a, b) => (a.name! > b.name! ? 1 : -1))
                      .map((item) => (
                        <option
                          key={item.name}
                          value={item.name}
                          className="w-full h-14 flex flex-row justify-between items-center"
                        >
                          {item.name}
                        </option>
                      ))}
                  </select>
                  <p className="text-center w-48">Choose Picture for Logo</p>
                </div>
              )}
              {displayedVideos.length > 0 && (
                <div className="w-full flex flex-col justify-center items-center">
                  <select
                    value={videoChoice.name}
                    onChange={(e) => {
                      const selectedVideo = displayedVideos.find(
                        (video) => video.name === e.target.value
                      );
                      if (selectedVideo) {
                        handleChange(
                          {
                            name: selectedVideo.name,
                            link: selectedVideo.link,
                          },
                          'videoChoice'
                        );
                      }
                    }}
                    className="w-60 h-9 bg-white rounded-lg border border-[#776548] text-[#444] text-left"
                  >
                    {displayedVideos
                      .sort((a, b) => (a.name > b.name ? 1 : -1))
                      .map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  <p className="text-center w-48">Choose Video</p>
                </div>
              )}
              <div className="w-full flex flex-row justify-between items-center">
                <button
                  className="btnFancy w-20 min-h-[5rem] "
                  style={{ padding: 0, margin: 0 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setGalleryType('manual');
                    if (displayedPictures)
                      setGalleryArr([...displayedPictures]);
                    setModal3Visible(true);
                  }}
                >
                  <p className="text-center text-sm italic">
                    Choose pictures for manual
                  </p>
                </button>
                <button
                  className="btnFancy w-20 min-h-[5rem]"
                  style={{ padding: 0, margin: 0 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setGalleryType('auto');
                    if (displayedPicturesAuto)
                      setGalleryArr([...displayedPicturesAuto]);
                    setModal3Visible(true);
                  }}
                >
                  <p className="text-center text-sm italic">
                    Choose pictures for auto
                  </p>
                </button>
                <button
                  className="btnFancy w-20 min-h-[5rem]"
                  style={{ padding: 0, margin: 0 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setModal4Visible(true);
                  }}
                >
                  <p className="text-center text-sm italic">Choose videos</p>
                </button>
                <button
                  className="btnFancy w-20 min-h-[5rem]"
                  style={{ padding: 0, margin: 0 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setModalVisible(true);
                  }}
                >
                  <p className="text-center text-sm italic">Start Show</p>
                </button>
              </div>
              <div className="w-full flex flex-col justify-center items-center">
                <p className="w-full text-center">{message}</p>
                <button
                  className="btnFancy cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setModal1Visible(true);
                  }}
                >
                  <p className="text-center italic">Choose message</p>
                </button>
              </div>
              <div className="w-full flex flex-col justify-center items-center">
                <div className="flex flex-row mb-2.5 mt-2.5">
                  <input
                    type="checkbox"
                    checked={showUrgentMessage}
                    onChange={(e) =>
                      handleChange(e.target.checked, 'showUrgentMessage')
                    }
                    className="self-center"
                  />
                  <p className="ml-2">Show Urgent Message</p>
                </div>
                <div className="flex flex-row mb-2.5 mt-2.5">
                  <input
                    type="checkbox"
                    checked={showSVGAnimation}
                    onChange={(e) =>
                      handleChange(e.target.checked, 'showSVGAnimation')
                    }
                    className="self-center"
                  />
                  <p className="ml-2">Show SVG Animation</p>
                </div>
                {showSVGAnimation &&<div className="w-full flex flex-row flex-wrap mb-2.5"
                >
                  <div className="w-1/2 flex flex-col justify-center items-center p-1">
                    <label>Animation Speed: {animationSpeed}</label>
                    <input
                      className="w-full"
                      type="range"
                      min="1"
                      max="10"
                      value={animationSpeed}
                      onChange={(e) =>
                        handleChange(Number(e.target.value), 'animationSpeed')
                      }
                    />
                  </div>
                  <div className="w-1/2 flex flex-col justify-center items-center p-1">
                    <label>Speed Variation: {speedVariation}</label>
                    <input
                     className="w-full"
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={speedVariation}
                      onChange={(e) =>
                        handleChange(Number(e.target.value), 'speedVariation')
                      }
                    />
                  </div>
                   
                    <div className="w-1/2 flex flex-col justify-center items-center p-1">
                      <label>Particle Count: {particleCount}</label>
                      <input
                        className="w-full"
                        type="range"
                        min="1"
                        max="1000"
                        value={particleCount}
                        onChange={(e) =>
                          handleChange(Number(e.target.value), 'particleCount')
                        }
                      />
                    </div>
                    <div className="w-1/2 flex flex-col justify-center items-center p-1">
                      <label>Max Size: {maxSize}</label>
                      <input
                        className="w-full"
                        type="range"
                        min="1"
                        max="100"
                        value={maxSize}
                        onChange={(e) =>
                          handleChange(Number(e.target.value), 'maxSize')
                        }
                      />
                    </div>
                    <div className="w-full flex flex-col justify-center items-center p-1">
                      <label>Animation Option:</label>
                      <select
                        value={animationOption}
                        onChange={(e) =>
                          handleChange(
                            Number(e.target.value),
                            'animationOption'
                          )
                        }
                      >
                        <option value={1}>Towards Viewer</option>
                        <option value={2}>Away from Viewer</option>
                        <option value={3}>Rain</option>
                      </select>
                    </div> 
                    {animationOption === 3 && (
                      <div className="w-full flex flex-col justify-center items-center p-1">
                        <label>Rain Angle: {rainAngle}°</label>
                        <input
                          className="w-full"
                          type="range"
                          min="0"
                          max="360"
                          value={rainAngle}
                          onChange={(e) =>
                            handleChange(Number(e.target.value), 'rainAngle')
                          }
                        />
                      </div>
                    )}
                    {(animationOption === 1 || animationOption === 2) && (
                      <>
                        <div className="w-1/2 flex flex-col justify-center items-center p-1">
                          <label>Origin X: {originX}</label>
                          <input
                            className="w-full"
                            type="range"
                            min="0"
                            max="1600"
                            value={originX}
                            onChange={(e) =>
                              handleChange(Number(e.target.value), 'originX')
                            }
                          />
                        </div>
                        <div className="w-1/2 flex flex-col justify-center items-center p-1">
                          <label>Origin Y: {originY}</label>
                          <input
                            className="w-full"
                            type="range"
                            min="0"
                            max="1200"
                            value={originY}
                            onChange={(e) =>
                              handleChange(Number(e.target.value), 'originY')
                            }
                          />
                        </div>
                      </>
                    )} 
                  <div style={{ marginTop: '20px' }}>
                    <label>Particle Types:</label>
                    {typesSet.map((type) => (
                      <button
                        key={type}
                        onClick={() => toggleParticleType(type)}
                        style={{
                          margin: '0 5px',
                          padding: '5px 10px',
                          backgroundColor: particleTypes.includes(type)
                            ? 'lightblue'
                            : 'white',
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;