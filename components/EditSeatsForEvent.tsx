import { useEffect, useState } from 'react';
import ShowIcon from './svg/showIcon';
import ImgFromDb from './ImgFromDb';
import { useSession } from 'next-auth/react';

type Props = {
  id: number;
  tables: number[];
  image: string;
  eventtype: string;
  tag: string;
  price:number;
  date:string;
  onReturn: (style: string, text: string) => void;
};

const EditSeatsForEvent = ({ id,image,  eventtype, tag,price,date, tables, onReturn }: Props) => {
  const [eventSeatMap, setEventSeatMap] = useState<string[]>([]);
  const [name, setName] = useState<string | undefined>('');
  const [editedInput, setEditedInput] = useState<string>('');
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [editSeat, setEditSeat] = useState<{
    table: number;
    seat: number;
  } | null>(null);
  const { data: session } = useSession();
  const [seatChoosen, setSeatChoosen] = useState<{
    seat: number;
    table: number;
  } | null>(null);
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
        onReturn('Loading', 'Finish');
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
            data[i].personNote != null && data[i].personNote != ''
              ? (arr2[data[i].seat] = data[i].personNote)
              : (arr2[data[i].seat] = data[i].name);
            if (((data[i].personNote == null)||(data[i].personNote == "")) && data[i].name == null) (arr2[data[i].seat] = 'Unknown purcahser');
            arr[data[i].table] = arr2.toString();
          }

        console.log(arr);
        setEventSeatMap(arr);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="w-full h-full p-1">
      {tables?.length != undefined && tables?.length > 0 && (
        <div className="w-full h-64 relative   overflow-scroll border border-lightMainColor dark:border-darkMainColor rounded-md">
          <div className="absolute top-0 left-0  min-w-full  flex flex-wrap items-start justify-start ">
            {tables != null &&
              tables.length > 0 &&
              tables.map((item, index) => (
                <div
                  key={'table_' + index}
                  className="m-1 mr-4 flex flex-col items-center justify-center"
                >
                  <div className="bg-lightMainColor text-darkMainColor dark:bg-darkMainColor dark:text-lightMainColor text-center p-2 rounded-lg w-64">
                    <h1>Table {index < 12 ? index + 1 : index + 2}</h1>
                    <div className="dark:bg-lightMainColor dark:text-darkMainColor bg-darkMainColor text-lightMainColor w-full rounded-md">
                      {eventSeatMap[index] != undefined &&
                        eventSeatMap[index].split(',').map((item2, index2) => (
                          <div
                            key={'seat_' + index2}
                            className="flex flex-row justify-center items-center"
                          >
                            {((seatChoosen == null && item2 != 'Open') ||
                              (seatChoosen != null && item2 == 'Open')) && (
                              <div
                                className=" h-6 w-6 md:h-7 md:w-7 fill-editcolor m-auto  cursor-pointer "
                                data-item={item2}
                                onClick={(
                                  e: React.MouseEvent<HTMLDivElement>
                                ) => {
                                  e.preventDefault();
                                  if (seatChoosen == null) {
                                    setSeatChoosen({
                                      seat: index2,
                                      table: index,
                                    });
                                    setName(e.currentTarget.dataset.item);
                                  } else {
                                    console.log(
                                      'table',
                                      index,
                                      'seat',
                                      index2,
                                      seatChoosen
                                    );
                                    let arr = eventSeatMap;
                                    let arr2 =
                                      arr[seatChoosen.table].split(',');
                                    arr2[seatChoosen.seat] = 'Open';
                                    arr[seatChoosen.table] = arr2.toString();
                                    arr2 = arr[index].split(',');
                                    arr2[index2] = name!;
                                    arr[index] = arr2.toString();
                                    setEventSeatMap(arr);
                                    onReturn('Request', 'Start');

                                    fetch('/api/admin/change_seat', {
                                      method: 'PUT',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                        id: id,
                                        oldPlace: {
                                          seat: seatChoosen.seat,
                                          table: seatChoosen.table,
                                        },
                                        newSeat: index2,
                                        newTable: index,
                                      }),
                                    })
                                      .then((response) => response.json())
                                      .then((data) => {
                                        console.log(data);
                                        onReturn('Request', 'Done');
                                        onReturn(
                                          'Response',
                                          data.status + '|' + data.message
                                        );
                                      })
                                      .catch((error) => {
                                        onReturn('Request', 'Done');
                                        console.log(error);
                                        onReturn(
                                          'Response',
                                          error.status + ',' + error.message
                                        );
                                      });
                                    setSeatChoosen(null);
                                  }
                                }}
                              >
                                <ShowIcon icon={'Exchange'} stroke={'0.1'} />
                              </div>
                            )}
                            {editVisible == true &&
                            editSeat?.seat == index2 &&
                            editSeat?.table == index ? (
                              <form
                                className="w-full"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  let arr = eventSeatMap;
                                  console.log('changed', editedInput);
                                  let arr2 = arr[index].split(',');
                                  let isOpenStatus = arr2[index2];
                                  arr2[index2] = editedInput;
                                  arr[index] = arr2.toString();
                                  setEventSeatMap(arr);
                                  setEditVisible(!editVisible);
                                  if (isOpenStatus != 'Open') {
                                    onReturn('Request', 'Start');
                                    fetch('/api/admin/change_seat_person', {
                                      method: 'PUT',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                        id: id,
                                        oldPlace: {
                                          seat: index2,
                                          table: index,
                                        },
                                        note: editedInput,
                                      }),
                                    })
                                      .then((response) => response.json())
                                      .then((data) => {
                                        console.log(data);
                                        onReturn('Request', 'Done');
                                        onReturn(
                                          'Response',
                                          data.status + '|' + data.message
                                        );
                                      })
                                      .catch((error) => {
                                        console.log(error);
                                        onReturn('Request', 'Done');
                                        onReturn(
                                          'Response',
                                          error.status + '|' + error.message
                                        );
                                      });
                                  } else {
                                    onReturn('Request', 'Start');
                                    fetch('/api/admin/block_seat', {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                        id: id,
                                        oldPlace: {
                                          seat: index2,
                                          table: index,
                                        },
                                        userID: session?.user.id,
                                        note: editedInput,
                                        image,
                                        eventtype,
                                        tag,
                                        price, 
                                        date
                                      }),
                                    })
                                      .then((response) => response.json())
                                      .then((data) => {
                                        onReturn('Request', 'Done');
                                        onReturn(
                                          'Response',
                                          data.status + '|' + data.message
                                        );
                                        console.log(data);
                                      })
                                      .catch((error) => {
                                        console.log(error);
                                        onReturn('Request', 'Done');
                                        onReturn(
                                          'Response',
                                          error.status + '|' + error.message
                                        );
                                      });
                                  }
                                }}
                              >
                                <input
                                  className="w-4/5 text-left "
                                  defaultValue={item2 != 'Open' ? item2 : ''}
                                  onChange={(e) => {
                                    e.preventDefault();
                                    setEditedInput(e.currentTarget.value);
                                  }}
                                />
                                <button
                                  className="w-1/5 bg-lightMainColor text-darkMainColor dark:bg-darkMainColor dark:text-lightMainColor"
                                  type="submit"
                                >
                                  enter
                                </button>
                              </form>
                            ) : (
                              <span
                                className="w-full text-left truncate cursor-pointer p-1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setEditVisible(!editVisible);
                                  setEditSeat({
                                    table: index,
                                    seat: index2,
                                  });
                                }}
                              >
                                {index2 < 12 ? index2 + 1 : index2 + 2} {item2}
                              </span>
                            )}
                            {((seatChoosen == null && item2 != 'Open') ||
                              (seatChoosen != null && item2 == 'Open')) && (
                              <div
                                className=" h-8 w-8 md:h-7 md:w-7 fill-alertcolor pt-2 pl-1 cursor-pointer "
                                data-item={item2}
                                onClick={(
                                  e: React.MouseEvent<HTMLDivElement>
                                ) => {
                                  e.preventDefault();

                                  console.log(
                                    'table',
                                    index,
                                    'seat',
                                    index2,
                                    'id',
                                    id
                                  );
                                  onReturn('Request', 'Start');
                                  fetch('/api/admin/del_seat_block', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      id: id,
                                      oldPlace: {
                                        seat: index2,
                                        table: index,
                                      },
                                    }),
                                  })
                                    .then((response) => response.json())
                                    .then((data) => {
                                      onReturn('Request', 'Done');
                                      onReturn(
                                        'Response',
                                        data.status + '|' + data.message
                                      );
                                      console.log(data);
                                    })
                                    .catch((error) => {
                                      console.log(error);
                                      onReturn('Request', 'Done');
                                      onReturn(
                                        'Response',
                                        error.status + '|' + error.message
                                      );
                                    });
                                  setSeatChoosen(null);
                                }}
                              >
                                <ShowIcon icon={'Close'} stroke={'0.5'} />
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default EditSeatsForEvent;
