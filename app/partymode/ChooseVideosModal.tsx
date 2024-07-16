'use client';

import React, { useEffect, useState } from 'react'; 

interface Video {
  tag: string;
  image: string;
  link: string;
}

interface ChooseVideosModalProps {
  videosArray: Video[];
  vis: boolean;
  onReturn: (videos: Video[]) => void;
}

const ChooseVideosModal: React.FC<ChooseVideosModalProps> = ({ videosArray, vis, onReturn }) => {
  const [displayVideos, setDisplayVideos] = useState<Video[]>([]);
  const [videoLink, setVideoLink] = useState('');
  const [videoThumbnailLink, setVideoThumbnailLink] = useState('');
  const [videoLinkType, setVideoLinkType] = useState('Regular link');
  const [videoText, setVideoText] = useState('');

  useEffect(() => {
    setDisplayVideos(videosArray || []);
  }, [videosArray]);

  const handleSubmit = (e: React.FormEvent, action: 'Save' | 'Close') => {
    e.preventDefault();
    if (action === 'Save') {
      onReturn(displayVideos);
    } else {
      onReturn([]);
    }
  };

  const addVideo = () => {
    const newVideo: Video = {
      tag: videoText,
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white w-11/12 h-5/6 max-w-3xl rounded-md shadow-lg overflow-y-auto p-4">
        <h2 className="text-center text-xl font-bold mb-4">Available Videos</h2>

        <div className="border border-black p-2 rounded-md h-32 overflow-y-auto mb-4">
          <div className="flex flex-wrap justify-start">
            {displayVideos.map((item, i) => (
              <div key={`videocasting${i}`} className="m-1 mr-4 flex flex-col items-center">
                <div className="relative">
                  <img src={item.image} alt={item.tag} className="h-16 w-16 md:h-20 md:w-20 bg-gray-300 p-2 rounded-sm" />
                  <button
                    onClick={() => removeVideo(i)}
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                  >
                     {'Del'}
                  </button>
                </div>
                <p className="mt-1 text-center max-w-[100px] truncate">{item.tag}</p>
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
  );
};

export default ChooseVideosModal;