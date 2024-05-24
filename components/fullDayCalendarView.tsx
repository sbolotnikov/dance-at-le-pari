import { useState } from 'react';
import ShowIcon from './svg/showIcon';
import { TEventArray } from '@/types/screen-settings';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import AlertMenu from './alertMenu';
import ImgFromDb from './ImgFromDb';
import AnimateModalLayout from './AnimateModalLayout';
type Props = {
  events: TEventArray | undefined;
  onReturn: () => void;
  day: string | undefined;
};

const FullDayCalendarView = ({ events, onReturn, day }: Props) => {
  const [revealAlert, setRevealAlert] = useState(false);
  const [eventID, setEventID] = useState(-1);
  const [alertStyle, setAlertStyle] = useState({
    variantHead: '',
    heading: '',
    text: ``,
    color1: '',
    button1: '',
    color2: '',
    button2: '',
    inputField: '',
  });
  const [isVisible, setIsVisible] = useState(true);
  const { data: session } = useSession();
  let el = document.querySelector('#mainPage');
  const onReturnAlert = async (decision1: string) => {
    setRevealAlert(false);
    if (decision1 == 'Cancel') {
    }
    if (decision1 == 'Delete') {
      fetch('/api/admin/del_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: eventID,
        }),
      }).then(() => {
        location.reload();
      });
    }
  };
  console.log(day, events);
  let date1 = new Date(day! + ' 07:00:00');
  return (
    <AnimateModalLayout
      visibility={isVisible}
      onReturn={() => {
        onReturn();
      }}
    >
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturnAlert}
        styling={alertStyle}
      />

      <div className="font-semibold text-md text-center  text-shadow  dark:text-shadow-light text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG mt-4 p-3 shadow-2xl  rounded-md border-2">
        <span className="font-extrabold text-xl text-left  text-shadow  dark:text-shadow-light text-lightMainColor  dark:text-darkMainColor ">
          Schedule for:
        </span>
        {new Date(date1).toLocaleDateString('en-us', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        <h2 className="text-center italic">
          {'(for more info click on event)'}
        </h2>
      </div>

      <div className="w-full h-full relative  overflow-y-auto ">
        <div className="absolute top-0 left-0 w-full min-h-full pb-10 flex flex-col justify-center items-center md:flex-row">
          {events &&
            events
              .sort((a, b) => {
                if (a.date > b.date) return 1;
                else if (a.date < b.date) return -1;
                else return 0;
              })
              .map((item, index) => {
                return (
                  <Link key={'LinksEvent' + index} href={`/events/${item.id}`}>
                    <div className="m-3 p-2  flex flex-col justify-center items-center relative  bg-lightMainBG  dark:bg-darkMainBG text-lightMainColor dark:text-darkMainColor  shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md border-2">
                      {session?.user.role == 'Admin' && (
                        <button
                          className=" outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor absolute p-1 -top-1 -right-4 w-10 h-10"
                          onClick={(e) => {
                            e.preventDefault();
                            setAlertStyle({
                              variantHead: 'danger',
                              heading: 'Warning',
                              text: 'You are about to Delete Event!',
                              color1: 'danger',
                              button1: 'Delete',
                              color2: 'secondary',
                              button2: 'Cancel',
                              inputField: '',
                            });
                            setEventID(item.id);
                            setRevealAlert(!revealAlert);
                            return;
                          }}
                        >
                          <ShowIcon icon={'Close'} stroke={'2'} />
                        </button>
                      )}

                      <h1 className=" text-2xl  h-full text-center   text-shadow  dark:text-shadow-light ">
                        {new Date(item.date).toLocaleTimeString('en-US', {
                          timeStyle: 'short',
                        })}{' '}
                        {item.eventtype + ' ' + item.tag}
                      </h1>
                      {item.image !== undefined ? (
                        <ImgFromDb
                          url={item.image}
                          stylings="object-contain m-auto"
                          alt="Template Picture"
                        />
                      ) : (
                        <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor m-auto stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                          <ShowIcon icon={'Calendar'} stroke={'2'} />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
        </div>
      </div>
    </AnimateModalLayout>
  );
};

export default FullDayCalendarView;
