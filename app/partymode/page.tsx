'use client';

import React, { useState, useEffect } from 'react';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import useCompetition from '../hooks/useCompetition';

// import { pickImage, deleteOldImage } from '../utils';
import { PageWrapper } from '@/components/page-wrapper';
import ChooseVideosModal from './ChooseVideosModal';
import ShowPlayingModal from './ShowPlayingModal';
import ColorChoiceModal from './ColorChoiceModal';
import ChoosePicturesModal from './ChoosePicturesModal';
import UrgentMessageComponent from './UrgentMessageComponent';
import CountBox from './CountBox';
import usePartySettings from './usePartySettings';

type Props = {
  // Add any props if needed
};

const page: React.FC<Props> = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [modal4Visible, setModal4Visible] = useState(false);
  const [modal5Visible, setModal5Visible] = useState(false);
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
    setModal1Visible(true);
  }, []);

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
  } = usePartySettings();

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

  const videoSearch = async (link: string) => {
    try {
      const data = await fetch(
        'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=' +
          link +
          '&key=' +
          process.env.REACT_APP_FIREBASE_APIKEY,
        {
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const res = await data.json();
      return res.items;
    } catch (error) {
      if (error) {
        return error;
      }
    }
  };
  const handleChange = (text: string | boolean | object, eventName: string) => {
    // updateDoc(doc(db, 'competitions', id), {
    //   [eventName]: text,
    // });
  };

  const onPressPicture = async (e: React.MouseEvent) => {
    e.preventDefault();
    let picURL = '';
    //  picURL = await pickImage('competitions', '', 300);
    // deleteOldImage('competitions', image);
    handleChange(picURL, 'image');
  };

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
        onReturn={(ret) => {
          if (ret && ret.length > 0) {
            console.log(ret);
            handleChange(ret, 'displayedVideos');
          }
          setModal4Visible(false);
        }}
      />
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
        onReturn={() => setModalVisible(false)}
      />
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
        />
      )}
      <div className="w-full h-[85vh] relative overflow-y-scroll">
        <div className="w-full absolute top-0 left-0 flex flex-col justify-start items-center mt-14">
          <div>
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
            <div className="w-full flex flex-row justify-center items-start">
              <div className="flex flex-col justify-center items-center">
                <select
                  value={mode}
                  onChange={(e) => handleChange(e.target.value, 'mode')}
                  className="w-36 h-9 bg-white rounded-lg border border-[#776548] text-[#444] text-left"
                >
                  {['Auto', 'Video', 'Heats', 'Manual', 'Default'].map(
                    (option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    )
                  )}
                </select>
                <p className="text-center w-32">Choose casting mode</p>
              </div>
              <div>
                <CountBox
                  startValue={fontSize || 12}
                  setWidth={4}
                  onChange={(num) => {
                    console.log(num);
                    handleChange(num.toString(), 'fontSize');
                  }}
                />
                <p className="text-center w-24">Choose font size</p>
              </div>
              <div className="flex flex-col justify-center items-center h-16">
                <button
                  onClick={() => setModal5Visible(true)}
                  className="w-17 bg-[#000000] text-center mt-0 ml-1 rounded-md"
                  style={{ backgroundColor: reverseColor(textColor) }}
                >
                  <span
                    className="text-xl font-semibold text-center"
                    style={{ color: textColor }}
                  >
                    Text Color
                  </span>
                </button>
              </div>
              <div>
                <CountBox
                  startValue={seconds || 10}
                  setWidth={4}
                  onChange={(num) => {
                    console.log(num);
                    handleChange(num.toString(), 'seconds');
                  }}
                />
                <p className="text-center w-24">Choose seconds/frame</p>
              </div>
            </div>
            {displayedPictures && (
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
                      <option key={item.name} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                </select>
                <p className="text-center w-48">Choose Picture for Logo</p>
              </div>
            )}
            {displayedVideos.length>0 && (
              <div className="w-full flex flex-col justify-center items-center">
                <select
                  value={videoChoice?.name || ''}
                  onChange={(e) => {
                    const selectedVideo = displayedVideos.find(
                      (video) => video.tag === e.target.value
                    );
                    if (selectedVideo) {
                      handleChange(
                        {
                          name: selectedVideo.tag,
                          link: selectedVideo.link,
                        },
                        'videoChoice'
                      );
                    }
                  }}
                  className="w-60 h-9 bg-white rounded-lg border border-[#776548] text-[#444] text-left"
                >
                  {displayedVideos
                    .sort((a, b) => (a.tag > b.tag ? 1 : -1))
                    .map((item) => (
                      <option key={item.tag} value={item.tag}>
                        {item.tag}
                      </option>
                    ))}
                </select>
                <p className="text-center w-48">Choose Video</p>

                <div className="h-11 w-[92%] rounded-full mt-5 bg-white justify-center items-start">
                  <input
                    className={`mt-0 h-11 pl-3 w-full rounded-full border-2 border-[#C9AB78]`}
                    placeholder="Video search tool"
                    onChange={(e) => setVideoSearchText(e.target.value)}
                    value={videoSearchText}
                  />
                </div>

                {/* <TextBox
                    placeholder="Video search tool"
                    onChange={(e) => setVideoSearchText(e.target.value)}
                    value={videoSearchText}
                  /> */}
                <button
                  className="btnFancy w-[48%] bg-[#3D1152] my-1"
                  onClick={async (e) => {
                    e.preventDefault();
                    const data1 = await videoSearch(videoSearchText);
                    console.log(data1);
                    if (data1 && data1.length > 0) {
                      handleChange(
                        {
                          name: videoSearchText,
                          link: `https://www.youtube.com/embed/${data1[0].id.videoId}?autoplay=1&mute=1&loop=1&playlist=${data1[0].id.videoId}`,
                        },
                        'videoChoice'
                      );
                    }
                  }}
                  title="Search"
                />
              </div>
            )}
            <div className="w-full flex flex-row justify-center items-start">
              <div
                className="flex flex-col justify-center items-center"
                onClick={(e) => {
                  e.preventDefault();
                  setGalleryType('manual');
                  if (displayedPictures) setGalleryArr([...displayedPictures]);
                  setModal3Visible(true);
                }}
              >
                <p className="text-center w-24">Choose pictures for manual</p>
              </div>
              <div
                className="flex flex-col justify-center items-center"
                onClick={(e) => {
                  e.preventDefault();
                  setGalleryType('auto');
                  if (displayedPicturesAuto)
                    setGalleryArr([...displayedPicturesAuto]);
                  setModal3Visible(true);
                }}
              >
                <p className="text-center w-24">Choose pictures for auto</p>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setModal4Visible(true);
                }}
              >
                <p className="text-center italic">Choose videos</p>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setModalVisible(true);
                }}
              >
                <p className="text-center w-12">Start Show</p>
              </div>
            </div>
          </div>
          <UrgentMessageComponent
            savedMessages={savedMessages}
            onChange={(text) => {
              console.log(text);
              handleChange(text, 'message');
            }}
            onMessageArrayChange={(array) => {
              console.log(array);
              handleChange(array, 'savedMessages');
            }}
          />
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
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
