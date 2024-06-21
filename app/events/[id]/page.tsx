'use client';
import BuyTicketModal from '@/components/BuyTicketModal';
import ImgFromDb from '@/components/ImgFromDb';
import AlertMenu from '@/components/alertMenu';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { TFullEvent, TPriceOption } from '@/types/screen-settings';
import sleep from '@/utils/functions';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '@/slices/cartSlice';
import { useDimensions } from '@/hooks/useDimensions';
import SharePostModal from '@/components/SharePostModal';

export default function Page({ params }: { params: { id: string } }) {
  const [eventData, setEventData] = useState<TFullEvent>();
  const [revealBuyTicketModal, setRevealBuyTicketModal] = useState(false);
  const [revealAlert, setRevealAlert] = useState(false);
  const [revealSharingModal, setRevealSharingModal] = useState(false);
  const [priceOptions, setPriceOptions] = useState<TPriceOption[]>([]);
  const [scrolling, setScrolling] = useState(true);
  const windowSize = useDimensions();
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
  const [templateID, setTemplateID] = useState(-1);
  const { data: session } = useSession();
  const dispatch = useDispatch();
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
          id: parseInt(params.id),
        }),
      }).then(() => {
        location.replace('/calendar');
      });
    }
  };

  useEffect(() => {
    fetch('/api/event/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: params.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setEventData(data);
        setTemplateID(data.templateID);
        setPriceOptions(data.priceOptions);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    document.querySelector('#wrapperDiv')?.clientHeight! -
      document.querySelector('#containedDiv')?.clientHeight! >
    0
      ? setScrolling(true)
      : setScrolling(false);
  }, [eventData, windowSize.height]);
console.log("Event Data:",eventData)
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">       
        {eventData &&<SharePostModal
          title={eventData.title!}
          onReturn={() => sleep(1200).then(() => {setRevealSharingModal(false)})}
          visibility={revealSharingModal}
          url={process.env.NEXT_PUBLIC_URL + '/events/' + params.id}
          quote={
            eventData!.eventtype +
            ' event \n Date: ' +
            new Date(eventData.date!).toLocaleDateString('en-us', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }) +
            ' ' +
            new Date(eventData.date!).toLocaleTimeString('en-us', {
              timeStyle: 'short',
            }) +
            `\n Click on the link below. \n`
          }
          hashtag={
            eventData.eventtype == 'Party'
              ? 'SocialDance PartyDance DanceParty'
              : 'GroupClass GroupDance' + 'DanceAtLePari BallroomDanceStudio DanceStudio BallroomDance LePariDanceCenter'
          }
        />}
      
      {revealBuyTicketModal && (
        <BuyTicketModal
          seatmap={eventData!.seatmap}
          tables={eventData!.tables}
          tableName={eventData!.tableName}
          eventImage={eventData!.image}
          priceOptions={priceOptions}
          id={parseInt(params.id)}
          onReturn={async (seatsArray,option1) => {
            console.log(seatsArray);
            if (seatsArray.length > 0) {
              if (eventData!.tables!.length > 0) {
                for (let i = 0; i < seatsArray.length; i++) {
                  console.log(
                    seatsArray[i].seat,
                    seatsArray[i].table,
                    eventData!.date,
                    eventData!.image,
                    eventData!.eventtype,
                    eventData!.tag, 
                    seatsArray.length,
                    -parseInt(params.id)
                  );

                  fetch('/api/purchase_block', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json, text/plain, */*',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      activityID: -parseInt(params.id),
                      image: eventData!.image!,
                      eventtype: eventData!.eventtype,
                      tag: eventData!.tag, 
                      invoice: 'None',
                      purchasedAt: 'None',
                      price: priceOptions[0].price,
                      seat: seatsArray[i].seat,
                      table: seatsArray[i].table,
                      date: eventData!.date,
                      userID: session?.user.id,
                    }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      console.log(data);
                      if (data.status !== 422)
                        dispatch(
                          addItem({
                            id: -parseInt(params.id),
                            image: eventData!.image!,
                            eventtype: eventData!.eventtype,
                            tag: eventData!.tag,
                            price: priceOptions[0].price,
                            amount: 1,
                            seat: seatsArray[i].seat,
                            table: seatsArray[i].table,
                            date: eventData!.date,
                          })
                        );
                    });
                }
              } else {
                dispatch(
                  addItem({
                    id: templateID,
                    image: eventData!.image!,
                    eventtype: eventData!.eventtype,
                    tag: eventData!.tag,
                    price: priceOptions[option1!].price,
                    amount: priceOptions[option1!].amount,
                    seat: null,
                    table: null,
                    date: null,
                  })
                );
              }
            }
            sleep(1200).then(() => {
              setRevealBuyTicketModal(false);
            });
          }}
        />
      )}
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturnAlert}
        styling={alertStyle}
      />
      <div className="blurFilter shadow-2xl w-[90%]  max-w-[450px] md:w-full h-[85svh]  bg-lightMainBG/70 dark:bg-darkMainBG/70 border-0 rounded-md  p-2 md:mb-3">
        <div
          id="wrapperDiv"
          className="w-full h-full border rounded-md border-lightMainColor dark:border-darkMainColor relative overflow-y-auto flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`
            ${scrolling ? '' : 'absolute top-0 left-0'}
             flex flex-col w-full p-1 justify-center items-center `}
          >
            {eventData && (
              <div className="w-full flex flex-col justify-center items-center  p-2">
                <div className="w-full flex flex-row justify-end">
                  <h2
                    className="text-center font-bold uppercase mx-auto"
                    style={{ letterSpacing: '1px' }}
                  >
                    Event:
                  </h2>
                  <button
                    className=" outline-none border-none   rounded-md  mt-2  w-8 h-8"
                    onClick={(e) => {
                      e.preventDefault();
                      setRevealSharingModal(true);
                      
                    }}
                  >
                    <ShowIcon icon={'Share'} stroke={'2'} />
                  </button>
                  {session?.user.role == 'Admin' && (
                    <button
                      className=" outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor mt-2  w-8 h-8"
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
                        setRevealAlert(!revealAlert);
                        return;
                      }}
                    >
                      <ShowIcon icon={'Close'} stroke={'2'} />
                    </button>
                  )}
                  {session?.user.role == 'Admin' && (
                    <button
                      className=" outline-none border-none fill-editcolor  stroke-editcolor  rounded-md border-editcolor p-1 w-8 h-8"
                      onClick={(e) => {
                        e.preventDefault();
                        location.replace('/admin/editevent/' + params.id);
                        return;
                      }}
                    >
                      <ShowIcon icon={'Edit'} stroke={'.5'} />
                    </button>
                  )}
                </div>
                <button
                  className="btnFancy w-[90%] "
                  onClick={() => setRevealBuyTicketModal(true)}
                >
                  Choose tickets
                </button>
                <h2 className="flex flex-row items-center justify-center">
                  {new Date(eventData!.date).toLocaleDateString('en-us', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h2>
                <h2 className="flex flex-row items-center justify-center">
                  {'Starts at:'}
                  <span>
                    &nbsp;
                    {new Date(eventData!.date).toLocaleTimeString('en-US', {
                      timeStyle: 'short',
                    })}
                  </span>{' '}
                </h2>
                <h1>
                  {eventData?.eventtype}
                  {' : '}
                  <span className="text-2xl font-extrabold font-DancingScript">
                    {eventData!.title}
                  </span>
                </h1>
                {eventData.image !== '' ? (
                  <div className=" h-48 w-48 md:h-52 md:w-52 fill-lightMainColor m-auto flex justify-center items-center stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                    <ImgFromDb
                      url={eventData.image!}
                      stylings="object-contain m-auto"
                      alt="Event Picture"
                    />
                  </div>
                ) : (
                  <div className=" h-48 w-48 md:h-52 md:w-52 fill-lightMainColor m-auto flex justify-center items-center stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                    <ShowIcon icon={'Image'} stroke={'0.5'} />
                  </div>
                )}
                <h2 className="w-full text-left">
                  {'Description:'}&nbsp;{eventData!.description}
                </h2>
                <h2 className="w-full text-left ">
                  {`Price: ${eventData!.eventtype=="Group"?"from":" "} $ ${Math.min(...priceOptions.map((option) => option.price))}`}
                </h2>
                <h2 className="w-full text-left">
                  {'Location:'}&nbsp;{eventData!.location}
                </h2>
                <h2 className="w-full text-left mb-1">
                  {'Length: '}
                  {Math.floor(eventData!.length / 60) > 0
                    ? Math.floor(eventData!.length / 60) + ' hour'
                    : ''}
                  {Math.floor(eventData!.length / 60) > 1 ? 's ' : ' '}
                  &nbsp;{(eventData!.length % 60) + ' minutes'}
                </h2>
                <hr
                  className={
                    'w-3/4 border-4 border-double border-lightMainColor dark:border-darkMainColor rounded-full' +
                    (eventData!.teacher == null)
                      ? 'mb-6'
                      : 'mb-2'
                  }
                />
                {eventData!.teacher !== null &&
                  eventData!.teacher.length > 0 && (
                    <div className="w-full  mt-3 mb-6">
                      <div className="w-full mb-2">
                        {eventData!.teacher_img !== null &&
                        eventData!.teacher_img !== undefined ? (
                          <ImgFromDb
                            url={eventData!.teacher_img!}
                            stylings="h-12 w-12 float-left m-2 rounded-md"
                            alt="User Picture"
                          />
                        ) : (
                          <div className=" h-12 w-12 md:h-16 md:w-16 fill-lightMainColor float-left stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                            <ShowIcon icon={'DefaultUser'} stroke={'2'} />
                          </div>
                        )}

                        <h2 className="flex flex-row items-center justify-center ">
                          {'Your instructor:'}
                          <span>&nbsp;{eventData!.teacher}</span>
                        </h2>
                      </div>
                      <h2 className="w-full text-left mb-1 ">
                        {'Short bio:'}
                        <span>&nbsp;{eventData!.bio}</span>
                      </h2>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
