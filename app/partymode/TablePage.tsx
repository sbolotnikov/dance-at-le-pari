'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [choosenRow, setChoosenRow] = useState<number>(-1);
  useEffect(() => {
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
    }
  }, [tablePages[tableChoice].tableRows, tablePages[tableChoice].rowsChecked]);
  useEffect(() => {
    if (choosenRow !== -1) {
        setTimeout(() => {
            setChoosenRow(-1);
        }, 5000);
    }
  }, [choosenRow]);
  return (
    <AnimatePresence >
    <div className="w-full h-full  inset-0 absolute ">
      <div className="w-full h-full flex flex-col justify-center items-start relative">
        <h2
          className={`w-full blurFilter h-1/6 text-center mt-5 font-${fontName}`}
          style={{ fontSize: fontSize, color: textColor }}
        >
          {tablePages[tableChoice].name}
        </h2>
        <div className="w-full h-5/6 flex flex-wrap flex-col justify-center items-start p-10">
          {rowsText.map((rowText, index) => {
            return (
              <div
                key={`row${index}`}
                className={`blurFilter p-1 m-1 max-w-1/2   rounded-md  border border-[${textColor}] transition duration-[600] delay-[3500ms] ease-in-out opacity-${
                  rowsChecked[index] ? 100 : 0
                }`}
              >
                <p style={{ fontSize: fontSize2, color: textColor }}>
                  {index + 1 + '. '}
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
                duration: 4,
                times: [0, 0.2, 0.5, 0.8, 1],
              }}
              animate={{
                opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                rotateX: ['90deg', '89deg', '89deg', '0deg', '0deg', '0deg', '0deg', '89deg', '89deg', '90deg'],
                x: ['-100vw', '0vw', '0vw', '0vw', '0vw', '0vw', '0vw', '0vw', '0vw', '-100vw'],
              }}
              exit={{
                opacity: [1, 1, 1, 1, 0],
                rotateX: ['0deg', '0deg', '89deg', '89deg', '90deg'],
                x: ['0vw', '0vw', '0vw', '0vw', '-100vw'],
              }}
               className={`w-fit blurFilter p-1 m-1 rounded-md  border border-[${textColor}] text-center`}
            >
              {choosenRow + 1 + '. '}
              {rowsText[choosenRow]}
            </motion.div> 
            </div>
        )}
      </div>
    </div>
    </AnimatePresence>
  );
};
export default TablePage;
