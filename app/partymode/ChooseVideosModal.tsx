'use client';

import AnimateModalLayout from '@/components/AnimateModalLayout';
import React, { useEffect, useState } from 'react'; 

interface Video {
  name: string;
  image: string;
  link: string;
}

interface ChooseVideosModalProps {
  videosArray: Video[];
  vis: boolean;
  onReturn: (videos: string[]) => void;
  onClose: () => void;
}

const ChooseVideosModal: React.FC<ChooseVideosModalProps> = ({ videosArray, vis, onReturn, onClose }) => {
  const [displayVideos, setDisplayVideos] = useState<Video[]>([]);
  const [videoLink, setVideoLink] = useState('');
  const [videoThumbnailLink, setVideoThumbnailLink] = useState('');
  const [videoLinkType, setVideoLinkType] = useState('Regular link');
  const [videoText, setVideoText] = useState('');

  useEffect(() => {
    setDisplayVideos(videosArray);
  }, [videosArray]);

  const handleSubmit = (e: React.FormEvent, action: 'Save' | 'Close') => {
    e.preventDefault();
    if (action === 'Save') {
      onReturn(displayVideos.map((item)=>JSON.stringify(item)));
    } else {
      onReturn([]);
    }
  };

  const addVideo = () => {
    const newVideo: Video = {
      name: videoText,
      image: videoThumbnailLink,
      link: videoLink,
    };
    setDisplayVideos([...displayVideos, newVideo]);
  };

  const removeVideo = (index: number) => {
    const updatedVideos = [...displayVideos];
    updatedVideos.splice(index, 1);
    setDisplayVideos(updatedVideos);
  };

  if (!vis) return null;

  return (
    <AnimateModalLayout
      visibility={vis}
      onReturn={() => {
        onClose();
      }}
    > 
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1170px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
        }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
          > 
        <h2 className="text-center text-xl font-bold mb-4">Available Videos</h2>

        <div className="border border-black p-2 rounded-md h-32 overflow-y-auto mb-4">
          <div className="flex flex-wrap justify-start">
            {displayVideos.map((item, i) => (
              <div key={`videocasting${i}`} className="m-1 mr-4 flex flex-col items-center">
                <div className="relative">
                  <img src={item.image} alt={item.name} className="h-16 w-16 md:h-20 md:w-20 bg-gray-300 p-2 rounded-sm" />
                  <button
                    onClick={() => removeVideo(i)}
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                  >
                     {'Del'}
                  </button>
                </div>
                <p className="mt-1 text-center max-w-[100px] truncate">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <img src={videoThumbnailLink} alt="Video thumbnail" className="h-16 w-16 bg-gray-300 rounded-sm mx-auto" />
        </div>

        <div className="mb-4">
          <select
            value={videoLinkType}
            onChange={(e) => setVideoLinkType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="YouTube Link">YouTube Link</option>
            <option value="Regular link">Regular link</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="videoLink" className="block font-semibold text-lg mb-1">Enter your video link:</label>
          <input
            id="videoLink"
            type="text"
            placeholder="Enter link"
            value={videoLink}
            onChange={(e) => {
              const text = e.target.value;
              if (videoLinkType === 'YouTube Link') {
                const videoId = text.split('https://youtu.be/')[1]?.split('?')[0];
                if (videoId) {
                  setVideoLink(`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&mute=1&playlist=${videoId}`);
                  setVideoThumbnailLink(`http://img.youtube.com/vi/${videoId}/0.jpg`);
                }
              } else {
                setVideoLink(text);
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="videoThumbnail" className="block font-semibold text-lg mb-1">Enter your video thumbnail:</label>
          <input
            id="videoThumbnail"
            type="text"
            placeholder="Enter link"
            value={videoThumbnailLink}
            onChange={(e) => setVideoThumbnailLink(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="videoText" className="block font-semibold text-lg mb-1">Choose text for video:</label>
          <input
            id="videoText"
            type="text"
            placeholder="Enter text"
            value={videoText}
            onChange={(e) => setVideoText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          onClick={addVideo}
          className="w-full bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 transition-colors duration-300 mb-4"
        >
          Add Video
        </button>

        <button
          onClick={(e) => handleSubmit(e, 'Save')}
          className="w-full bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 transition-colors duration-300 mb-2"
        >
          Save Changes
        </button>

        <button
          onClick={(e) => handleSubmit(e, 'Close')}
          className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors duration-300"
        >
          Close
        </button>
      </div>
    </div>
    </div>
    </AnimateModalLayout>
  );
};

export default ChooseVideosModal;