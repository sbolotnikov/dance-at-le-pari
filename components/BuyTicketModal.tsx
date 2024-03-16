'use client';
import { useEffect, useState } from 'react';
import ShowIcon from './svg/showIcon';
import ImgFromDb from './ImgFromDb';
import InputBox from './InputBox';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { TableSeat } from '@/types/screen-settings';
import { useSession } from 'next-auth/react';
import AnimateModalLayout from './AnimateModalLayout';
import { useDimensions } from '@/hooks/useDimensions';

type Props = {
  seatmap: string | null;
  tables: number[] | null;
  tableName: string | null;
  id: number;
  price: number;
  eventImage: string | null;
  onReturn: (seats: TableSeat[]) => void;
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
  const [freeSeatPercent, setFreeSeatPercent] = useState<string[]>([]);
  const [currentSeat, setCurrentSeat] = useState(-1);
  const [isVisible, setIsVisible] = useState(true);
  const [chosenTable, setChosenTable] = useState(0);
  const [tickets, setTickets] = useState(0);
  const [eventSeatMap, setEventSeatMap] = useState<string[]>([]);
  const [scrolling, setScrolling] = useState(true);
  const windowSize = useDimensions();
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
              if (j == 0) arr[i] = 'Open';
              else arr[i] = arr[i] + ',' + 'Open';
            }
          }
        console.log(arr);
        let count = [];
        if (arr.length > 0)
          for (let i = 0; i < data.length; i++) {
            let arr2 = arr[data[i].table].split(',');
            if (session !== null && session.user.role == 'Admin') {
              if (data[i].name != null) arr2[data[i].seat] = data[i].name;
              else arr2[data[i].seat] = 'Unknown buyer';
            } else arr2[data[i].seat] = 'Sold';
            arr[data[i].table] = arr2.toString();
          }
        if (tables != null)
          for (let i = 0; i < tables?.length; i++) {
            count.push(
              (arr[i].toString().match(/Open/g) || []).length.toString()
            );

            console.log(
              (
                ((arr[i].toString().match(/Open/g) || []).length / tables[i]) *
                100
              ).toFixed(2)
            );
          }
        setEventSeatMap(arr);
        setFreeSeatPercent(count);
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
      arr[currentSeat % 1000] = 'Sold';
      let seatMapCopy = eventSeatMap;
      seatMapCopy[chosenTable] = arr.toString();
      setEventSeatMap([...seatMapCopy]);
      console.log(arr);
    }
  }, [currentSeat]);
  useEffect(() => {
    document.getElementById('wrapperDiv')?.offsetHeight! -
      document.getElementById('containedDiv')?.offsetHeight! >
    0
      ? setScrolling(true)
      : setScrolling(false);
  }, [ windowSize.height]);
  return (
    <AnimateModalLayout
      visibility={isVisible}
      onReturn={() => {
        setIsVisible(false);
        onReturn([]);
      }}
    >
      <div className="h-[73%] w-[75%] md:w-[50%] bg-darkMainColor dark:bg-lightMainColor rounded-md  p-1">
        <div id="wrapperDiv" className="w-full h-full border rounded-md border-lightMainColor dark:border-darkMainColor relative overflow-y-auto flex flex-col justify-center items-center">
          <div id="containedDiv"
            className={`${scrolling?"":"absolute top-0 left-0"}  w-full p-1 ${
              tables !== null && tables.length > 0
                ? ' flex flex-col justify-center items-center'
                : 'h-full'
            }`}
          >
            {seatmap !== null ? (
              <div>
                <h2 className="w-full text-center uppercase">Choose your seats</h2>
                <ImgFromDb
                  url={seatmap}
                  stylings="object-contain p-2 rounded-md"
                  alt="Event Picture"
                />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <h2 className="w-full text-center">Enter your ticket amount</h2>
                <InputBox
                  startValue={0}
                  setWidth={8}
                  increment={1}
                  onChange={(n) => {
                    setTickets(n);
                    console.log(n);
                    let array1: TableSeat[] = [];
                    for (let i = 0; i < n; i++) {
                      array1[i] = { table: -1, seat: -1 };
                    }
                    setChosenSeats([...array1]);
                    console.log(array1);
                  }}
                />
                <h3>Total:${price * tickets}</h3>
                <button
                  className="w-[50%] btnFancy my-auto text-base text-center  rounded-md"
                  style={{ padding: '0' }}
                  onClick={() => {
                    setIsVisible(false);
                    onReturn(chosenSeats);
                  }}
                >
                  {'Add to Cart'}
                </button>
              </div>
            )}
            {tables !== null && tables.length > 0 ? (
              <div className="w-[97%] flex flex-col justify-center items-center">
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
                        {' Open '}
                        {freeSeatPercent[index]}
                        {'seats'}
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
                      if (arr[parseInt(e.target.value)] != 'Open') {
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
                                arr[item.seat] = 'Open';
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
                <button
                  className="w-[50%] btnFancy text-base text-center  rounded-md"
                  style={{ padding: '0' }}
                  onClick={() => {
                    setIsVisible(false);
                    onReturn(chosenSeats);
                  }}
                >
                  {'Add to Cart'}
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
}
