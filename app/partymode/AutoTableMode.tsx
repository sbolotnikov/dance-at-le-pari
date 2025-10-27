'use client';
import React, { useEffect, useState } from 'react';
import ManualImage from './ManualImage';
import AnimatedTextMessage from '@/components/AnimatedTextMessage';

type Props = {
    message:string;
    tablePages:{ name: string; tableRows: string[];rowsPictures: string[] | undefined; rowsChecked: boolean[] }[];
    showBackdrop:boolean;
    fontSize:number;
    compLogo:string;
    fontName:string;
    textColor:string; 
}
 
    const AutoTableMode = ({ message,tablePages,showBackdrop, fontSize,compLogo,fontName,textColor }:Props) => {
      //This regime will only work if the message is in the form X.Y where X is the table number and Y the row number
      //For example 1.3 means table 1 row 3
      //Table and row numbers start at 1
      //If the message is not in this form, nothing will be displayed create playlist with dances name as x.y
      // prime purpose is to display the picture and text associated with the current song 
      const [image, setImage] = useState("");
        const [text1, setText] = useState("");
    
      useEffect(() => {
        console.log("message",message);
            if (message === '') return;
         let activeTable=parseInt(message.split('.')[0])-1;
         let activeRow=parseInt(message.split('.')[1])-1;
            setImage(((tablePages[activeTable].rowsPictures!==undefined)&&(tablePages[activeTable].rowsPictures[activeRow]!==undefined))?tablePages[activeTable].rowsPictures[activeRow]:compLogo);
            setText(((tablePages[activeTable].tableRows!==undefined)&&(tablePages[activeTable].tableRows[activeRow]!==undefined))?tablePages[activeTable].tableRows[activeRow]:'');
            console.log("image",((tablePages[activeTable].rowsPictures!==undefined)&&(tablePages[activeTable].rowsPictures[activeRow]!==undefined))?tablePages[activeTable].rowsPictures[activeRow]:compLogo);
            console.log("text",((tablePages[activeTable].tableRows!==undefined)&&(tablePages[activeTable].tableRows[activeRow]!==undefined))?tablePages[activeTable].tableRows[activeRow]:'');
      }, [message]);
      return (
        <div
              className="absolute inset-0 flex flex-col justify-center items-center cursor-pointer "
              
            >
          <ManualImage image1={image} seconds={0} fontSizeTime={0} showBackdrop={showBackdrop} text1={ ""} compLogo={""} videoBG={""} titleBarHider={true}/>
          {text1 > '' && (
                          <AnimatedTextMessage
                            text={text1}
                            duration={5}
                            delay={0}
                            height={fontSize * 2 + 'px'}
                            name={fontName}
                            width={'90%'}
                            stroke={1}
                            color={textColor}
                            cutdelay={false}
                            rotate={false}
                          />
                        )}
                        </div>
    
      );
    };
    
    export default AutoTableMode;