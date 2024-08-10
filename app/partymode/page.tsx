'use client';

import { useState, useEffect, use } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import ChooseVideosModal from './ChooseVideosModal';
import ShowPlayingModal from './ShowPlayingModal';
import ColorChoiceModal from './ColorChoiceModal';
import ChoosePicturesModal from './ChoosePicturesModal';
import CountBox from './CountBox';
import usePartySettings from './usePartySettings';
import useComp from './useComp';
import ChooseMessageModal from './ChooseMessageModal';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db, db2 } from '@/firebase';
import { useSession } from 'next-auth/react';
import ChoosePartyModal from '@/components/ChoosePartyModal';
import AlertMenu from '@/components/alertMenu';
import ChoosePicture from '@/components/ChoosePicture';
import ImgFromDb from '@/components/ImgFromDb'; 

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
  const [revealAlert, setRevealAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const [galleryType, setGalleryType] = useState<'auto' | 'manual' | null>(
    null
  );
  const [galleryArr, setGalleryArr] = useState<
    {
      link: string;
      name: string;
      dances: string[] | null;
    }[]
  >([]);
  const [videoSearchText, setVideoSearchText] = useState('');
  const [startPage, setStartPage] = useState(true);
  const [revealCloud, setRevealCloud] = useState(false);
  const [compsArr, setCompsArr] = useState<{name:string, id:string}[]>([]);

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
    fontSizeTime,
    frameStyle,
    displayedPictures,
    displayedPicturesAuto,
    seconds,
    manualPicture,
    displayedVideos,
    videoChoice,
    compLogo,
    titleBarHider,
    showUrgentMessage,
    showHeatNumber,
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
    id, 
    compChoice,
    showBackdrop,
    setCompID,
  } = usePartySettings();
  console.log('compChoice', compChoice);
  const [competition, setCompetition] = useState('T9FLgtEDmxQFYFTnfrvO'); 
  const {heat} = useComp(competition);
  useEffect(() => {
    if (compChoice) setCompetition(compChoice);
  }, [compChoice]);
  const typesSet = [
    'star',
    'kiss',
    'snowflake',
    'heart',
    'tower',
    'LP',
    'maple',
    'rose',
    'diamond',
    'clover',
    'streamer',
    'lightning',
    'hydrangea',
    'fred',
  ];
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
      updateDoc(doc(db, 'parties', id), {
        [eventName]: text,
      });
  };

  const onPressPicture = async (e: React.MouseEvent) => {
    e.preventDefault();
    let picURL = '';
    // handleChange(picURL, 'image');
  };
  const toggleParticleType = (type: string) => {
    handleChange(
      particleTypes.includes(type)
        ? particleTypes.filter((t) => t !== type)
        : [...particleTypes, type],
      'particleTypes'
    );
  };
  useEffect(() => {
    // if (session?.user.role !== 'Admin') {
    //   window.location.href = '/competition';
    // }
    getCompsArray();
  }, []);
  const onReturnAlert = async (decision1: string) => {
    setRevealAlert(false);
    if (decision1 == 'Cancel') {
    }
    if (decision1 == 'Delete Party') {
      await deleteDoc(doc(db, 'parties', idToDelete));
      window.location.reload();
    }
  };

  const onReturnPicture = (decision1: string, fileLink: string) => {
    if (decision1 == 'Close') {
      setRevealCloud(false);
    }
    if (decision1 == 'Upload') {
      console.log('file link', fileLink);
      handleChange(fileLink, 'image');
      if (revealCloud == true) {
        setRevealCloud(false);
        // setFile(fileLink);
      }
    }
  };
  async function getCompsArray() {
    const q = await getDocs(collection(db2, 'competitions'));
    let arr1 = q.docs.map((doc) => doc.data());
    let arr2 = q.docs.map((doc) => doc.id);
    let arr = arr1.map((x, i) => ({ name:x.name, id: arr2[i] })) as {name:string, id:string}[];
    setCompsArr(arr);
  }
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturnAlert}
        styling={alertStyle}
      />
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
        savedMessages={savedMessages}
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
          displayedVideos={displayedVideos}
          displayedPictures={displayedPictures}
          image={image}
          button1="Ok"
          compName={name}
          heatNum={''}
          vis={modalVisible}
          mode={mode}
          fontSize={fontSize}
          fontSizeTime={fontSizeTime}
          frameStyle={frameStyle}
          seconds={seconds}
          message={message}
          compLogo={compLogo}
          titleBarHider={titleBarHider}
          showUrgentMessage={showUrgentMessage}
          showBackdrop={showBackdrop}
          showHeatNumber={showHeatNumber}
          textColor={textColor}
          animationSpeed={animationSpeed}
          speedVariation={speedVariation}
          heat={heat}
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
          savedMessages={savedMessages}
          vis={modal3Visible}
          onReturn={(ret) => {
            if (ret && ret.length > 0) {
              galleryType === 'auto'
                ? handleChange(
                    ret.map((pic) => ({ link: pic.link, name: pic.name })),
                    'displayedPicturesAuto'
                  )
                : handleChange(ret, 'displayedPictures');
            }
            setModal3Visible(false);
          }}
          onClose={() => setModal3Visible(false)}
        />
      )}
      {modal1Visible && (
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
      )}
      {revealCloud && <ChoosePicture onReturn={onReturnPicture} />}
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[95%] max-w-[650px] max-h-[85%] h-[85%]  md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2 overflow-auto">
          {session?.user.role == 'Admin' && (
            <div className="absolute top-0 left-0 w-full p-2 flex flex-col justify-center items-center">
              {startPage ? (
                <ChoosePartyModal
                  onReturn={(id) => {
                    setStartPage(false);
                    setCompID(id);
                  }}
                  onAlert={(name, id) => {
                    setIdToDelete(id);
                    setRevealAlert(true);
                    setAlertStyle({
                      variantHead: 'danger',
                      heading: 'Warning',
                      text: `You are about to delete party: ${name}!`,
                      color1: 'danger',
                      button1: 'Delete Party',
                      color2: 'secondary',
                      button2: 'Cancel',
                      inputField: '',
                    });
                  }}
                />
              ) : (
                <div>
                  <button
                    className="w-[92%] h-48 m-1"
                    onClick={(e) => setRevealCloud(!revealCloud)}
                  >
                    {image && image.length > 0 ? (
                      <div className="h-full w-full rounded-md flex justify-center items-center mt-2">
                        <ImgFromDb
                          url={image}
                          stylings="object-contain"
                          alt="Event Picture"
                        />
                      </div>
                    ) : (
                      <div className="h-full w-full flex justify-center items-center">
                        <p>Please click to choose image</p>
                      </div>
                    )}
                  </button>
                  <h2 className="w-full text-center text-2xl">{name}</h2>
                  <div className="w-full flex flex-row justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                      {mode && (
                        <select
                          value={mode}
                          onChange={(e) => handleChange(e.target.value, 'mode')}
                          className="w-20 h-9 bg-white rounded-lg border border-[#776548] text-[#444] text-left"
                        >
                          {[
                            'Auto',
                            'Auto Full',
                            'Video',
                            'Manual',
                            'Default',
                          ].map((option) => (
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
                            if (num < 1) num = 1;
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
                            if (num < 1) num = 1;
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
                      <p className="text-center w-48">
                        Choose Picture for manual
                      </p>
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
                      <p className="text-center w-48">
                        Choose Picture for Logo
                      </p>
                    </div>
                  )}
                  {displayedVideos && displayedVideos.length > 0 && (
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
                          setGalleryArr(
                            displayedPicturesAuto.map((pic) => ({
                              ...pic,
                              dances: null,
                            }))
                          );
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
                      <p className="text-center text-sm italic">
                        Choose videos
                      </p>
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
                        checked={showBackdrop}
                        onChange={(e) =>
                          handleChange(e.target.checked, 'showBackdrop')
                        }
                        className="self-center"
                      />
                      <p className="ml-2">Show backdrop</p>
                    </div>
                    <div className="flex flex-row mb-2.5 mt-2.5">
                      <input
                        type="checkbox"
                        checked={showHeatNumber}
                        onChange={(e) =>
                          handleChange(e.target.checked, 'showHeatNumber')
                        }
                        className="self-center"
                      />
                      <p className="ml-2">Show heat number</p>
                    </div>

                    <div className="flex flex-row justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                        {compsArr && (
                          <select
                            value={compChoice}
                            onChange={(e) =>
                              handleChange(e.target.value, 'compChoice')
                            }
                            className="w-28 h-9 bg-white rounded-lg border border-[#776548] text-[#444] text-left"
                          >
                            {compsArr.map(
                              (option) => (
                                <option key={option.id} value={option.id}>
                                  {option.name}
                                </option>
                              )
                            )}
                          </select>
                        )}
                        <p className="text-center w-20">Choose comp</p>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        {fontSizeTime && (
                          <CountBox
                            startValue={fontSizeTime}
                            setWidth={10}
                            name={'fontSizeTime'}
                            onChange={(num) => {
                              console.log(num);
                              if (num < 1) num = 1;
                              handleChange(num, 'fontSizeTime');
                            }}
                          />
                        )}
                        <p className="text-center w-24">Font size time</p>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        {frameStyle && (
                          <select
                            value={frameStyle}
                            onChange={(e) =>
                              handleChange(e.target.value, 'frameStyle')
                            }
                            className="w-28 h-9 bg-white rounded-lg border border-[#776548] text-[#444] text-left"
                          >
                            {['No frame', 'Fire frame', 'Running frame'].map(
                              (option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              )
                            )}
                          </select>
                        )}
                        <p className="text-center w-20">Choose frame</p>
                      </div>
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
                    {showSVGAnimation && (
                      <div className="w-full flex flex-row flex-wrap mb-2.5">
                        <div className="w-1/2 flex flex-col justify-center items-center p-1">
                          <label>Animation Speed: {animationSpeed}</label>
                          <input
                            className="w-full"
                            type="range"
                            min="1"
                            max="10"
                            value={animationSpeed}
                            onChange={(e) =>
                              handleChange(
                                Number(e.target.value),
                                'animationSpeed'
                              )
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
                              handleChange(
                                Number(e.target.value),
                                'speedVariation'
                              )
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
                              handleChange(
                                Number(e.target.value),
                                'particleCount'
                              )
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
                            <option value={4}>Storm vortex</option>
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
                                handleChange(
                                  Number(e.target.value),
                                  'rainAngle'
                                )
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
                                  handleChange(
                                    Number(e.target.value),
                                    'originX'
                                  )
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
                                  handleChange(
                                    Number(e.target.value),
                                    'originY'
                                  )
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
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
