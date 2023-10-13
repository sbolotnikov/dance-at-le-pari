import React from 'react';
type Props = {
    dateDisplay: string;
    onNext: () => void;
    onBack: () => void
}
export const CalendarHeader = ({ onNext, onBack, dateDisplay }:Props) => {
  return(
    <div className="w-full flex justify-start items-end flex-row">
       <div className="md:mt-14 font-bold text-sm md:text-4xl mb-3 md:mb-0 text-franceBlue dark:text-darkMainColor text-center md:font-DancingScript">{dateDisplay}</div>
        <button className="shadow-lg pointer border-0 outline-none rounded" onClick={onBack} style={{padding:'5px 10px', margin: '5px 20px'}} id="backButton">Previous</button>
        <button className="shadow-lg pointer border-0 outline-none rounded" onClick={onNext} style={{padding:'5px 10px', margin: '5px 10px'}} id="nextButton">Next</button>
      {/* <button className="navbar__item shadow-lg pointer border-0 outline-none rounded" onClick={onCopyPaste} style={{padding:'10px 10px',width:'98%', margin: '10px 10px'}} id="nextButton">Copy/Paste/Delete</button> */}
    </div>
  );
};