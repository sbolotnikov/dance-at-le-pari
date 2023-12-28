'use client';
import { useEffect, useState } from 'react';
import ShowIcon from './svg/showIcon';
import { AnimatePresence, motion } from 'framer-motion';
import ImgFromDb from './ImgFromDb';
import InputBox from './InputBox';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { TableSeat } from '@/types/screen-settings';
import { useSession } from 'next-auth/react';
import { table } from 'console';

type Props = {
  seatmap: string | null;
  tables: number[] | null;
  tableName: string | null;
  id: number;
  price: number;
  eventImage: string | null;
  onReturn: () => void;
};

export default function BuyTicketModal({
  seatmap,
  tables,
  eventImage,
  tableName,
  id,
  price,
  onReturn,
}: Props) {
  const { data: session } = useSession();
  const [chosenSeats, setChosenSeats] = useState<TableSeat[]>([]);
  const [busySeats, setBusySeats] = useState([]);
  const [currentSeat, setCurrentSeat] = useState(-1);
  const [isVisible, setIsVisible] = useState(true);
  const [chosenTable, setChosenTable] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [eventSeatMap, setEventSeatMap] = useState<string[]>([]);
  let el = document.querySelector('#mainPage');

  // Function to check if two objects are equal based on all fields
  function areObjectsEqual(obj1: any, obj2: any) {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    // Check if both objects have the same number of fields
    if (obj1Keys.length !== obj2Keys.length) {
      return false;
    }

    // Check if all fields have the same values
    for (const key of obj1Keys) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  // function filterUniqueObjects(objectsArray:any[]) {
  //   return objectsArray.filter((obj, index, array) =>
  //     array.findIndex(item => areObjectsEqual(item, obj)) === index
  //   );
  // }
  function isObjectInArray(objectToCheck: any, arrayOfObjects: any[]) {
    return arrayOfObjects.some((existingObject) =>
      areObjectsEqual(existingObject, objectToCheck)
    );
  }

  useEffect(() => {
    let arr: string[] = [];
    console.log(id);
    fetch('/api/event_tickets/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (tables != null)
          for (let i = 0; i < tables.length; i++) {
            for (let j = 0; j < tables[i]; j++) {
              if (j == 0) arr[i] = 'Free';
              else arr[i] = arr[i] + ',' + 'Free';
            }
          }
        console.log(arr);
        if (arr.length>0) 
        for (let i = 0; i < data.length; i++) {
          let arr2 = arr[data[i].table].split(',');
          ((session!==null )&&(session.user.role == 'Admin')) ? arr2[data[i].seat] = data[i].name:arr2[data[i].seat] = 'Taken';
          arr[data[i].table] = arr2.toString();
        }
        setEventSeatMap(arr);
        setBusySeats(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    if (currentSeat > -1) {
      console.log('in effect of seat choice' + currentSeat);
      let arr = eventSeatMap[chosenTable].split(',');
      arr[currentSeat % 1000] = 'Taken';
      let seatMapCopy = eventSeatMap;
      seatMapCopy[chosenTable] = arr.toString();
      setEventSeatMap([...seatMapCopy]);
      console.log(arr);
    }
  }, [currentSeat]);
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -600 }}
          transition={{
            ease: 'easeOut',
            duration: 1,
            times: [0, 0.2, 0.5, 0.8, 1],
          }}
          animate={{
            opacity: [0, 1, 1, 1, 1],
            rotateX: ['90deg', '89deg', '89deg', '0deg', '0deg'],
            x: ['-100vw', '0vw', '0vw', '0vw', '0vw'],
          }}
          exit={{
            opacity: [1, 1, 1, 1, 0],
            rotateX: ['0deg', '0deg', '89deg', '89deg', '90deg'],
            x: ['0vw', '0vw', '0vw', '0vw', '-100vw'],
          }}
          className="w-[100vw] h-[100vh] absolute flex flex-col justify-center items-center bg-slate-500/70 left-0 z-[1001] backdrop-blur-md"
          style={{ top: el!.scrollTop }}
        >
          <button
            className={`  md:mt-14 origin-center cursor-pointer z-10 hover:scale-125 `}
            onClick={() => {
              setIsVisible(false);
              onReturn();
            }}
          >
            <div className=" h-8 w-8 md:h-12 md:w-12   fill-darkMainColor stroke-darkMainColor">
              <ShowIcon icon={'Close'} stroke={'2'} />
            </div>
          </button>
          <div className="h-[82%] w-[85%] bg-darkMainColor flex flex-col justify-center items-center">
            <h2 className="w-full text-center">Enter your information</h2>
            {seatmap !== null ? (
              <ImgFromDb
                url={seatmap}
                stylings="object-contain p-2 rounded-md"
                alt="Event Picture"
              />
            ) : (
              <div>
                <InputBox
                  startValue={0}
                  setWidth={8}
                  increment={1}
                  onChange={(n) => {
                    setTickets(n);
                    console.log(n);
                    let array1: TableSeat[] = [];
                    for (let i = 0; i < n; i++){
                      array1[i]={table:-1,seat:-1};
                    }
                    setChosenSeats([...array1])
                    console.log(array1)
                  }}
                />
                <h3>Total:${price * tickets}</h3>
              </div>
            )}
            {tables !== null && tables.length > 0 ? (
              <div className="w-[97%]">
                <label className="flex flex-row m-auto justify-between items-center">
                  {'Choose ' + tableName}
                  <select
                    className="bg-main-bg m-2 rounded-md bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                    value={chosenTable}
                    onChange={(e) => {
                      setChosenTable(parseInt(e.target.value));
                      console.log(chosenTable);
                    }}
                  >
                    {tables.map((i, index) => (
                      <option key={'Table' + index} value={index}>
                        {tableName} {index < 12 ? index + 1 : index + 2}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-row m-auto justify-between items-center">
                  Choose seat
                  <select
                    className="bg-main-bg m-2 rounded-md bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                    // value={chosenTable}
                    onChange={(e) => {
                      // setChosenTable(parseInt(e.target.value));
                      let arr = eventSeatMap[chosenTable].split(',');
                      if (arr[parseInt(e.target.value)] != 'Free') {
                        console.log('seat already chosen');
                        setCurrentSeat(-1);
                        return;
                      }
                      setCurrentSeat(
                        (chosenTable + 1) * 1000 + parseInt(e.target.value)
                      );

                      let addSeat: TableSeat[] = [
                        ...chosenSeats,
                        { table: chosenTable, seat: parseInt(e.target.value) },
                      ];
                      console.log('new array ', addSeat);

                      if (
                        isObjectInArray(
                          {
                            table: chosenTable,
                            seat: parseInt(e.target.value),
                          },
                          chosenSeats
                        ) == false
                      ) {
                        setChosenSeats([...addSeat]);
                        setTickets(addSeat.length);
                      }
                    }}
                  >
                    {eventSeatMap.length &&
                      eventSeatMap[chosenTable].split(',').map((i, index) => (
                        <option key={'Seat' + index} value={index}>
                          {'Seat'} {index < 12 ? index + 1 : index + 2}{' '}
                          {`[${i}]`}
                        </option>
                      ))}
                  </select>
                </label>
                <div className="w-full h-24 relative   overflow-scroll border border-lightMainColor dark:border-darkMainColor rounded-md">
                  <div className="absolute top-0 left-0  min-w-full  flex flex-wrap items-start justify-start ">
                    {chosenSeats.length > 0 &&
                      chosenSeats.map((item, i) => (
                        <div
                          key={'ticket' + item.table + ' ' + item.seat}
                          className="m-1 mr-4 flex flex-col items-center justify-center"
                        >
                          <div className="relative h-8 w-8 md:h-10 md:w-10">
                            <div
                              className=" h-8 w-8 md:h-10 md:w-10 cursor-pointer fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor "
                              onClick={(e) => {
                                e.preventDefault();
                                // setTemplate1(item);
                              }}
                            >
                              <ShowIcon icon={'Chair'} stroke={'2'} />
                            </div>
                            <button
                              className=" outline-none border-none fill-alertcolor  stroke-alertcolor  rounded-md border-alertcolor absolute p-1 -top-1 -right-9 w-10 h-10"
                              onClick={(e) => {
                                e.preventDefault();
                                let delArr = chosenSeats.filter(
                                  (e) =>
                                    e.table != item.table || e.seat != item.seat
                                );
                                console.log(delArr);
                                setChosenSeats([...delArr]);
                                console.log('item' + i);
                                let arr = eventSeatMap[item.table].split(',');
                                arr[item.seat] = 'Free';
                                let seatMapCopy = eventSeatMap;
                                seatMapCopy[item.table] = arr.toString();
                                setEventSeatMap([...seatMapCopy]);
                                setTickets(delArr.length);
                                setCurrentSeat(-1);
                              }}
                            >
                              <ShowIcon icon={'Close'} stroke={'2'} />
                            </button>
                          </div>

                          <h2 className="max-w-[100px] text-center">
                            {' '}
                            {tableName + ' '}
                            {item.table < 12 ? item.table + 1 : item.table + 2}
                            <br />
                            {`Seat `}
                            {item.seat < 12 ? item.seat + 1 : item.seat + 2}
                          </h2>
                        </div>
                      ))}
                  </div>
                </div>
                <h3>
                  Total: ${price}*{tickets}
                  {chosenSeats.length == 1 ? ' ticket = ' : ' tickets = '}$
                  {price * tickets}
                </h3>
              </div>
            ) : (
              <></>
            )}
            {session ? (
              <PaymentForm
                applicationId={process.env.NEXT_PUBLIC_SQUARE_APLICATION_ID!}
                locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
                //  createPaymentRequest={() => ({
                //   countryCode: "US",
                //   currencyCode: "USD",
                //   lineItems: [
                //     {
                //       amount: "22.15",
                //       label: "Item to be purchased",
                //       id: "SKU-12345",
                //       imageUrl: "https://url-cdn.com/123ABC",
                //       pending: true,
                //       productUrl: "https://my-company.com/product-123ABC"
                //     }
                //   ],
                //   taxLineItems: [
                //     {
                //       label: "State Tax",
                //       amount: "8.95",
                //       pending: true
                //     }
                //   ],
                //   discounts: [
                //     {
                //       label: "Holiday Discount",
                //       amount: "5.00",
                //       pending: true
                //     }
                //   ],
                //   requestBillingContact: false,
                //   requestShippingContact: false,
                //   shippingOptions: [
                //     {
                //       label: "Next Day",
                //       amount: "15.69",
                //       id: "1"
                //     },
                //     {
                //       label: "Three Day",
                //       amount: "2.00",
                //       id: "2"
                //     }
                //   ],
                //   // pending is only required if it's true.
                //   total: {
                //     amount: "41.79",
                //     label: "Total",
                //   },
                // })}

                //  createVerificationDetails={() => ({
                //   amount: '1.00',
                //   /* collected from the buyer */
                //   billingContact: {
                //     addressLines: ['3040 Edwin Ave', 'Apt #2G'],
                //     familyName: 'Doe',
                //     givenName: 'John',
                //     countryCode: 'US',
                //     city: 'Fort Lee, NJ',
                //   },
                //   currencyCode: 'USD',
                //   intent: 'CHARGE',
                // })}
                cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                  const response = await fetch('/api/payment', {
                    method: 'POST',
                    headers: {
                      'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                      sourceId: token.token,
                      currency: 'USD',
                      amount: price * tickets,
                      seats: chosenSeats,
                      userID: session.user.id,
                      eventID: id,
                    }),
                  });

                  // eventID Int

                  console.log(await response.json());
                }}
              >
                <CreditCard />
              </PaymentForm>
            ) : (
              <h2>To buy tickets please login or register!</h2>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
