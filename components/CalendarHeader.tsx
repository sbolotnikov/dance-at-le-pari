import { useEffect, useState } from 'react';
import ShowIcon from './svg/showIcon';
import { useDimensions } from '@/hooks/useDimensions';
type Props = {
  dateDisplay: string;
  defaultView:boolean;
  onNext: () => void;
  onBack: () => void;
  onStyle: (n: boolean) => void;
};
export const CalendarHeader = ({
  onNext,
  onBack,
  onStyle,
  dateDisplay,
  defaultView
}: Props) => {
  const [agendaView, setAgendaView] = useState(true);
  const windowSize = useDimensions();
  useEffect(() => {
    if (defaultView === false){
    let agendaViewGet = JSON.parse(localStorage.getItem('AgendaView')!);
    console.log(agendaViewGet);
    if (agendaViewGet !== null) {
      setAgendaView(agendaViewGet);
      onStyle(agendaViewGet);
    }else{
      onStyle(true)
    }
  }
  }, []);
  useEffect(() => {
    if((windowSize.width!>767)&&(windowSize.height!>767)&&(document.getElementById('textID'))) {
      document.getElementById('textID')!.style.fontFamily='var(--font-DancingScript)';
      document.getElementById('textID')!.style.fontSize= '2.25rem';
       document.getElementById('textID')!.style.lineHeight= '2.5rem';
      
    } else if ((windowSize.width!>0)&&(document.getElementById('textID'))) {
      document.getElementById('textID')!.style.fontFamily='Sans-Serif';
      document.getElementById('textID')!.style.fontSize= '1rem';
      document.getElementById('textID')!.style.lineHeight= '1.5rem';
    }   
  }, [ windowSize.height]);
  return (
    <div className="w-full flex justify-center item-end flex-row">
      {!defaultView &&<button
        className="group flex shadow-lg pointer border-0 relative outline-none rounded cursor-pointer items-center md:group-hover:scale-125 md:m-3 justify-center  md:w-14 flex-col md:items-center "
        onClick={(e) => {
          e.preventDefault();
          setAgendaView(!agendaView);
          localStorage.setItem('AgendaView', JSON.stringify(!agendaView));
          onStyle(!agendaView);
        }}
        style={{ padding: '5px 5px', margin: '10px 10px' }}
      >
        <div className="nav_img  ml-2 h-5 w-5 md:h-8 md:w-8 my-1.5 mr-2 group-hover:animate-bounce  order-none md:mb-1 stroke-darkMainColor md:stroke-lightMainColor md:dark:stroke-darkMainColor ">
          <ShowIcon
            icon={!agendaView ? 'Agenda' : 'Calendar'}
            stroke={'0.25'}
          />
        </div>

        <p className=" tracking-widest  absolute bottom-0 right-0  flex-wrap  rounded-md  text-xs  group-hover:inline-flex bg-transparent dark:text-darkMainColor text-lightMainColor md:group-hover:block z-10 hidden ">
          {!agendaView ? 'Agenda' : 'Classic'}
        </p>
      </button>}

      {(!agendaView || defaultView )&& (
        <div id="textID" className=" font-bold   mt-4  md:mx-3 text-franceBlue dark:text-darkMainColor ">
          {dateDisplay}
        </div>
      )}
       {(agendaView && !defaultView ) && (
        <div className="mx-3 font-bold text-base md:text-4xl flex items-center my-2 md:mb-0 text-franceBlue dark:text-darkMainColor  md:font-DancingScript">
          {"Agenda"}
        </div>
      )}
      {(!agendaView || defaultView ) && (<button
        className="shadow-lg pointer border-0 outline-none rounded"
        onClick={onBack}
        style={{ padding: '5px 5px', margin: '10px 10px' }}
        id="backButton"
      >
        Previous
      </button>
      )}
      {(!agendaView || defaultView ) && (<button
        className="shadow-lg pointer border-0 outline-none rounded"
        onClick={onNext}
        style={{ padding: '5px 5px', margin: '10px 10px' }}
        id="nextButton"
      >
        Next
      </button>
      )}

    </div>
  );
};
