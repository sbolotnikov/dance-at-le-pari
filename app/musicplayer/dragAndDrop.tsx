import ShowIcon from '@/components/svg/showIcon';
import { fileToBase64 } from '@/utils/picturemanipulation';
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';


interface Song {
    url: string;
    name: string;
    dance: string | null;
    id: string | null;
    rate: number | undefined;
    introduction?: string;
  }
const DropPlace1: React.FC<{index:number, onStart: (index:number)=> void; onDrop:(index:number)=> void}> = ({index, onStart, onDrop}) => {
    const [showDrop, setShowDrop] = useState(false);
    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    }; 
    return (
      <div
        
      
        className={`w-full h-8`}
      >
        <p
         onDragOver={handleDrop}
         style={{opacity: showDrop ? "1":"0"}}
         onDragEnter={()=>{setShowDrop(true); onStart(index)}}
         onDragLeave={()=>setShowDrop(false)}
         onDrop={()=>{
          setShowDrop(false)
          onDrop(index) 
        }}
        className={`w-full h-full flex justify-center items-center border border-dashed border-gray-700 dark:border-gray-300 rounded-md text-gray-700 dark:text-gray-300`}
        
        >Drop here</p>
      </div>
    );
  };
const TodoList: React.FC = () => {
    const [playlistName, setPlaylistName] = useState('musicDB.sdb');
    const [songDB, setSongDB] = useState<Song[]>([]);
    const [dance, setDance] = useState('');
    const [rate, setRate] = useState(1);
    const [currentDragIndex, setCurrentDragIndex] = useState(-1);
    const handleFileAdd = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      // name: file.name,
      if (file) {
        const reader = new FileReader();
        reader.onload = (function (file) {
          return async function () {
            let res = this.result?.toString();
            let resObj = JSON.parse(res !== undefined ? res : '');
            setPlaylistName(file.name);
            setSongDB(resObj);
          };
        })(file);
        reader.readAsText(file);
      }
    };
    useEffect(() => {
      if (songDB.length > 0) {
      }
    }, [songDB]);
  
    const handleSongAdd = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        console.log(await fileToBase64(file));
        const newSong: Song = {
          url: await fileToBase64(file),
          name: file.name,
          id: uuidv4(),
          dance: dance,
          rate: rate,
        };
        console.log(newSong);
        setSongDB([...songDB, newSong]);
      }
    };
  
  return (
    <div className="w-full h-[350px] border border-black p-1 rounded-md overflow-x-auto mb-4">
    <div className="flex flex-col flex-wrap items-center justify-start">
      <DropPlace1 index={0} onStart={(n)=>{
        console.log(n);
        if (currentDragIndex===-1) setCurrentDragIndex(n)
      }} onDrop={(n)=>{
        console.log("here", currentDragIndex, n);
        if (currentDragIndex===-1) return;
        let item1=(currentDragIndex<n)?songDB[currentDragIndex-1]:songDB[currentDragIndex];
        let newPlaylist=songDB
        newPlaylist=newPlaylist.toSpliced(n, 0, item1);
        let p1=newPlaylist
        console.log(p1);
        (currentDragIndex<n)?newPlaylist.splice(currentDragIndex-1, 1):newPlaylist.splice(currentDragIndex+1, 1);
        setSongDB(newPlaylist);
        setCurrentDragIndex(-1); 
      }}/>
      {songDB.map((item, i) => (
        <div key={`song${i}`}>
        <div draggable className="relative m-1">
          <p className=" text-center max-w-[300px]">
            <span className=" bg-gray-300 text-sm rounded-sm truncate">
              {item.dance}
            </span>
            {'  '}
            {item.name}
          </p>
          <button
            onClick={() => {
              let newDB = songDB.filter(
                (item2) => item2.id !== item.id
              );
              setSongDB(newDB);
            }}
            className="absolute top-0 -right-8 fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor  w-8 h-8"
          >
            <ShowIcon icon={'Close'} stroke={'2'} />
          </button>
        </div>
        <DropPlace1 index={i+1} 
        onStart={(n)=>{
          console.log(n);
          if (currentDragIndex===-1) setCurrentDragIndex(n)
        }} 
        onDrop={(n)=>{
        console.log("here", currentDragIndex, n);
        if (currentDragIndex===-1) return;
        let item1=(currentDragIndex<n)?songDB[currentDragIndex-1]:songDB[currentDragIndex];
        let newPlaylist=songDB
        newPlaylist=newPlaylist.toSpliced(n, 0, item1);
        let p1=newPlaylist
        console.log(p1);
        (currentDragIndex<n)?newPlaylist.splice(currentDragIndex-1, 1):newPlaylist.splice(currentDragIndex+1, 1);
        setSongDB(newPlaylist);
        setCurrentDragIndex(-1);
      }}
        />
        </div>
      ))}
    </div>
  </div>
  );
};

export default TodoList;