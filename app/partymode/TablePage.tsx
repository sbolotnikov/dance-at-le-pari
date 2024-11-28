'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedTextMessage from '@/components/AnimatedTextMessage';
type Props = {
  tablePages: { name: string; tableRows: string[]; rowsChecked: boolean[] }[];
  tableChoice: number;
  fontSize: number;
  fontSize2: number;
  textColor: string;
  fontName: string;
};

const TablePage = ({
  tablePages,
  tableChoice,
  fontSize,
  fontSize2,
  textColor,
  fontName,
}: Props) => {
  const [rowsText, setRowsText] = useState<string[]>(
    tablePages[tableChoice].tableRows
  );
  const [rowsChecked, setRowsChecked] = useState<boolean[]>(
    tablePages[tableChoice].rowsChecked
  );
  const [currentPage, setCurrentPage] = useState<number>(tableChoice);
  const [choosenRow, setChoosenRow] = useState<number>(-1);
  const [delayShow, setDelayShow] = useState<number>(0);
  useEffect(() => {
    if (currentPage !== tableChoice) {
      setDelayShow(0);  
      setRowsText(tablePages[tableChoice].tableRows);
      setRowsChecked(tablePages[tableChoice].rowsChecked);
      setCurrentPage(tableChoice);
    } else{
    setDelayShow(8000);    
    if (tablePages[tableChoice].tableRows !== rowsText) {
      setRowsText(tablePages[tableChoice].tableRows);
    }
    if (tablePages[tableChoice].rowsChecked !== rowsChecked) {
      let i = 0;
      do {
        if (
          tablePages[tableChoice].rowsChecked[i] !== rowsChecked[i] &&
          rowsChecked[i] == false 
        ) {
          setChoosenRow(i);
        }
        i++;
      } while (i < rowsChecked.length);

      setRowsChecked(tablePages[tableChoice].rowsChecked);
    }} 
  }, [tablePages[tableChoice].tableRows, tablePages[tableChoice].rowsChecked,tableChoice]);
  useEffect(() => {
    if (choosenRow !== -1) {
        setTimeout(() => {
            setChoosenRow(-1);
        }, 9000);
    }
  }, [choosenRow]);
  return (
    <AnimatePresence >
    <div className="w-full h-full  inset-0 absolute ">
      <div className="w-full h-full flex flex-col justify-center items-center relative">
        <div
          className={`w-11/12 blurFilter h-1/6 mt-5 flex justify-centeritems-center border-0 shadow-xl`} 
        >
            <AnimatedTextMessage
                  text={tablePages[tableChoice].name}
                  duration={4}
                  delay={0}
                  height={fontSize*1.8 + 'px'}
                  name={fontName}
                  width={'100%'}
                  stroke={1}
                  color={textColor}
                  cutdelay={false}
                  rotate={false}
                />
        </div>
        <div className={`w-full h-5/6 flex flex-wrap flex-col justify-center ${rowsText.length>5?'items-start':'items-center '}`}
        
        >
          {rowsText.map((rowText, index) => {
            return (
              <div
                key={`row${index}`}
                className={`blurFilter p-1 mx-5 my-3 max-w-1/2   rounded-md  border-0 shadow-xl transition duration-[800] ease-in-out opacity-${
                  rowsChecked[index] ? 100 : 0
                }`}
                style={{transitionDelay: `${delayShow}ms`}}
              >
                <p className="text-shadow" style={{ fontSize:rowsText.length>5?fontSize2*0.857:fontSize2, color: textColor }}>
                  {rowText}
                </p>
              </div>
            );
          })}
        </div>
        {choosenRow !== -1 && (
            <div className={`absolute   top-1/2 left-1/2 `} style={{ fontSize: fontSize2*2, color: textColor,
                transform: 'translate(-50%, -50%)'
               }}>
            <motion.div
              initial={{ opacity: 0, x: -600 }}
              transition={{
                ease: 'easeOut',
                duration: 9,
                times: [0,0.1, 0.2,0.3, 0.4,0.5,0.6,0.8,0.9, 1],
              }}
              animate={{
                opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                rotateX: ['90deg', '89deg', '0deg', '0deg', '0deg', '0deg', '0deg', '0deg', '89deg', '90deg'],
                x: ['-100vw', '0vw', '0vw', '0vw', '0vw', '0vw', '0vw', '0vw', '0vw', '-100vw'],
              }}
              exit={{
                opacity: [1, 1, 1, 1, 0],
                rotateX: ['0deg', '0deg', '89deg', '89deg', '90deg'],
                x: ['0vw', '0vw', '0vw', '0vw', '-100vw'],
              }}
               className={`w-[1000px] blurFilter p-1 m-1 rounded-md flex justify-center items-center border border-[${textColor}] `}
            >
                {rowsText[choosenRow] &&<AnimatedTextMessage
                  text={rowsText[choosenRow]}
                  duration={4}
                  delay={1}
                  height={fontSize * 2 + 'px'}
                  name={fontName}
                  width={'100%'}
                  stroke={1}
                  color={textColor}
                  cutdelay={false}
                  rotate={false}
                />} 
            </motion.div> 
            </div>
        )}
      </div>
    </div>
    </AnimatePresence>
  );
};
export default TablePage;
