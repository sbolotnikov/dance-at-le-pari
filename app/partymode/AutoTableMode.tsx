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
      const [activeTable, setActiveTable] = useState(0);
      const [activeRow, setActiveRow] = useState(0);
    
      useEffect(() => {
            if (message === '') return;
         setActiveTable(parseInt(message.split('_')[0]))
         setActiveRow(parseInt(message.split('_')[0]))
      }, [message]);
      return (
        <>
          <ManualImage image1={((tablePages[activeTable].rowsPictures!==undefined)&&(tablePages[activeTable].rowsPictures[activeRow]!==undefined))?tablePages[activeTable].rowsPictures[activeRow]:compLogo} seconds={0} fontSizeTime={0} showBackdrop={showBackdrop} text1={ ""} compLogo={""} videoBG={""} titleBarHider={true}/>
          {message > '' && (
                          <AnimatedTextMessage
                            text={((tablePages[activeTable].tableRows!==undefined)&&(tablePages[activeTable].tableRows[activeRow]!==undefined))?tablePages[activeTable].tableRows[activeRow]:''}
                            duration={5}
                            delay={0}
                            height={fontSize * 2 + 'px'}
                            name={fontName}
                            width={'90%'}
                            stroke={1}
                            color={textColor}
                            cutdelay={false}
                            rotate={true}
                          />
                        )}
                        </>
    
      );
    };
    
    export default AutoTableMode;