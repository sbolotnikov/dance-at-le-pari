'use client';
import BuyTicketModal from '@/components/BuyTicketModal';
import ImgFromDb from '@/components/ImgFromDb';
import AlertMenu from '@/components/alertMenu';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { TFullEvent } from '@/types/screen-settings';
import sleep from '@/utils/functions';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { id: string } }) {
  const [eventData, setEventData] = useState<TFullEvent>();
  const [revealBuyTicketModal, setRevealBuyTicketModal] = useState(false);
  const [revealAlert, setRevealAlert] = useState(false);
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
        window.location.replace('/calendar');
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
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {revealBuyTicketModal && (
        <BuyTicketModal
          seatmap={eventData!.seatmap}
          tables={eventData!.tables}
          tableName={eventData!.tableName}
          eventImage={eventData!.image}
          price={eventData!.price}
          id={parseInt(params.id)}
          onReturn={() => {
            sleep(1200).then(() => {
              setRevealBuyTicketModal(false);
            });
          }}
        />
      )}
      {revealAlert && (
        <AlertMenu onReturn={onReturnAlert} styling={alertStyle} />
      )}

      <div className="border-0 rounded-md px-4 pt-4 shadow-2xl w-[90%] max-w-[450px] max-h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
        {eventData && (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="w-full flex flex-row justify-end">
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
                    window.location.replace('/admin/editevent/' + params.id);
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
              Buy tickets
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
              <ImgFromDb
                url={eventData.image!}
                stylings="object-contain m-auto"
                alt="Event Picture"
              />
            ) : (
              <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor m-auto stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                <ShowIcon icon={'Template'} stroke={'2'} />
              </div>
            )}



{/* <div className="relative flex justify-center items-center outline-none border border-lightMainColor dark:border-darkMainColor rounded-md w-24 my-6 mx-auto">
              {teacher?.image !== null &&
              teacher?.image !== '' &&
              teacher?.image !== undefined ? (
                <div>
                  <ImgFromDb
                    url={teacher?.image!}
                    stylings="object-contain"
                    alt="Event Picture"
                  />
                  <h2 className="text-center">{teacher.name}</h2>
                </div>
              ) : (
                <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                  <ShowIcon icon={'DefaultUser'} stroke={'2'} />
                </div>
              )}

              <button
                className=" outline-none border-none fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor rounded-md  absolute p-1 -top-3 -right-3 w-8 h-8"
                onClick={(e) => {
                  e.preventDefault();
                  setRevealCloud2(!revealCloud2);
                  return;
                }}
              >
                <ShowIcon icon={'Exchange'} stroke={''} />
              </button>
            </div>
            <label className="flex flex-row m-auto justify-between items-center">
              Event type
              <select
                className="bg-main-bg m-2 rounded-md bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                value={eventtype}
                onChange={(e) => {
                  setEventType(e.target.value);
                }}
              >
                <option value="Party">Party</option>
                <option value="Group">Group</option>
                <option value="Private">Coaching</option>
              </select>
            </label>
            <label className="flex flex-col m-auto justify-between items-center">
              Location
              <select
                className="bg-main-bg mb-2 rounded-md text-ellipsis bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                value={location}
                onChange={(e) => {
                  setEventTypeLocation(e.target.value);
                }}
              >
                <option value="Studio A (Front)">
                  Studio A (Front)
                </option>
                <option value="Studio B (Back)">
                Studio B (Back)
                </option>
                <option value="Main ballroom">Main ballroom</option>
                <option value="Whole studio">Whole studio</option>
              </select>
            </label>

            <form className=" m-auto" onSubmit={handleSubmit}>
              <label className="flex flex-row justify-between items-center mb-1">
                Length in min.
                <input
                  className=" outline-none border-none rounded-md  w-1/2 text-lightMainColor p-0.5 mx-1"
                  id="length1"
                  name="length1"
                  type="number"
                  value={length1}
                  onChange={(e) => {
                    setLength(parseInt(e.target.value));
                  }}
                  required
                />
              </label>
              <label className="flex flex-row justify-between items-center mb-1">
                Price
                <input
                  className=" outline-none border-none rounded-md w-1/2  text-lightMainColor p-0.5 mx-1"
                  id="price"
                  name="price"
                  type="number"
                  value={price}
                  onChange={(e) => {
                    setPrice(parseFloat(e.target.value));
                  }}
                  required
                />
              </label>
              <label className="flex flex-row justify-between items-center mb-1">
                Title
                <input
                  className=" outline-none border-none rounded-md w-3/4  text-lightMainColor p-0.5 mx-1"
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </label>
              <label className="flex flex-row justify-between items-center mb-1">
                Event Tag
                <input
                  className=" outline-none border-none rounded-md  w-3/4 text-lightMainColor p-0.5 mx-1"
                  id="tag"
                  name="tag"
                  type="text"
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value);
                  }}
                  required
                />
              </label>
              <label className="flex flex-col justify-between items-start mb-1">
                Description
                <textarea
                  name="description"
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  className="w-full rounded text-lightteal"
                  placeholder="Event description"
                  rows={4}
                  minLength={5}
                />
              </label>
              <button
                className="btnFancy w-[90%]"
                type="submit"
                disabled={loading}
              >
                {'Submit'}
              </button>
            </form> */}


            <h2 className="w-full text-left">
              {'Description:'}&nbsp;{eventData!.description}
            </h2>
            <h2 className="w-full text-left ">
              {'Price: $'}
              {eventData!.price}
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
            <hr className="w-3/4  border-2 border-double border-lightMainColor dark:border-darkMainColor rounded-full" />
            {eventData!.teacher !== null && eventData!.teacher.length > 0 && (
              <div className="w-full  mt-3">
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
    </PageWrapper>
  );
}
