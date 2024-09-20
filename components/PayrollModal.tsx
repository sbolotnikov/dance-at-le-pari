import { useRef, useState } from 'react';
import AnimateModalLayout from './AnimateModalLayout';
import {
  TEventScheduleArray,
  TTableData,
  TUser,
} from '@/types/screen-settings';
import * as XLSX from 'xlsx';
import ShowIcon from './svg/showIcon';
import { prisma } from '@/lib/prisma';

type Props = {
  visibility: boolean;
  role: string;
  userID: number;
  events: TEventScheduleArray;
  users: TUser[];
  onReturn: () => void;
};
type TExcelJSON = {
  daysSchedule: {
    events: { tag: string; amount: number; confirmed: boolean; id: number }[];
    dateString: string;
    lessonAmount: number;
    groupsAmount: number;
  }[];
  name: string;
  totalLessonAmount: number;
  totalGroupsAmount: number;
};
const PayrollModal = ({
  visibility,
  role,
  userID,
  events,
  users,
  onReturn,
}: Props) => {
  const [isVisible, setIsVisible] = useState(visibility);
  const dateRef1 = useRef<HTMLInputElement>(null);
  const dateRef2 = useRef<HTMLInputElement>(null);
  const [tableData, setTableData] = useState<TTableData[]>([]);
  const [lessonLength, setLessonLength] = useState(45);
  const [teacher, setTeacher] = useState(role === 'Teacher' ? userID : -1);
  const [excelJSON, setExcelJSON] = useState<TExcelJSON[]>([]);
  const [changesMade, setChangesMade] = useState<{id:number, confirmed:boolean}[]>([])

  const uniqueValues = (nums: any[]) => Array.from(new Set(nums));

  const handleOnExport = () => {
    let wb = XLSX.utils.book_new();
    let totalsTable: {
      name: string;
      lessonAmount: number;
      groupsAmount: number;
    }[] = [];
    for (let i = 0; i < excelJSON.length; i++) {
      let name = excelJSON[i].name;
      let lessonAmount = excelJSON[i].totalLessonAmount;
      let groupsAmount = excelJSON[i].totalGroupsAmount;
      let obj = {
        name: name,
        lessonAmount: lessonAmount,
        groupsAmount: groupsAmount,
      };
      totalsTable.push(obj);
    }
    totalsTable.push({
      name: 'Total: ',
      lessonAmount: totalsTable
        .map((item) => item.lessonAmount)
        .reduce((a, b) => a + b, 0),
      groupsAmount: totalsTable
        .map((item) => item.groupsAmount)
        .reduce((a, b) => a + b, 0),
    });
    if (teacher === -1) {
      let ws = XLSX.utils.json_to_sheet(totalsTable);
      XLSX.utils.book_append_sheet(wb, ws, 'Totals');
      ws = XLSX.utils.json_to_sheet(tableData);
      XLSX.utils.book_append_sheet(wb, ws, 'Details');
      XLSX.writeFile(
        wb,
        `Time Sheet ${dateRef1.current?.value} to ${dateRef2.current?.value}.xlsx`
      );
    } else {
      let ws = XLSX.utils.json_to_sheet(tableData);
      XLSX.utils.book_append_sheet(wb, ws, 'Details');
      XLSX.writeFile(
        wb,
        `Time Sheet ${totalsTable[0].name} ${dateRef1.current?.value} to ${dateRef2.current?.value}.xlsx`
      );
    }
  };

  const prepareJSON = (
    events: TEventScheduleArray,
    name: string
  ): TExcelJSON => {
    let dateArr = events.map((event) => event.date.split('T')[0]);
    dateArr = uniqueValues(dateArr);
    let obj1: {
      events: { tag: string; amount: number; confirmed: boolean; id: number }[];
      dateString: string;
      lessonAmount: number;
      groupsAmount: number;
    }[] = [];
    for (let i = 0; i < dateArr.length; i++) {
      let date = dateArr[i];
      let events1 = events.filter((event) => event.date.split('T')[0] == date);
      let lessonsLength = events1
        .filter((event) => event.eventtype == 'Private')
        .map((event) => event.length)
        .reduce((a, b) => a + b, 0);
      let groupsAmount = events1.filter(
        (event) => event.eventtype == 'Group'
      ).length;
      let finalEvents = events1.map((event) => ({
        tag:
          event.eventtype !== 'Group' &&
          event.studentid[0] !== undefined &&
          users.filter((user) => user.id === event.studentid[0])[0]
            ? event.date.split('T')[1] +
              ' ' +
              event.eventtype +
              ': ' +
              event.tag +
              ' ' +
              users.filter((user) => user.id === event.studentid[0])[0].name
            : event.date.split('T')[1] +
              ' ' +
              event.eventtype +
              ': ' +
              event.tag,
        amount: event.eventtype == 'Group' ? 1 : event.length / lessonLength,
        confirmed: event.confirmed,
        id: event.id,
      }));
      obj1.push({
        events: finalEvents,
        dateString: date,
        lessonAmount: lessonsLength / lessonLength,
        groupsAmount: groupsAmount,
      });
    }
    let totalLessonAmount = obj1
      .map((item) => item.lessonAmount)
      .reduce((a, b) => a + b, 0);
    let totalGroupsAmount = obj1
      .map((item) => item.groupsAmount)
      .reduce((a, b) => a + b, 0);

    return { name, daysSchedule: obj1, totalLessonAmount, totalGroupsAmount };
  };

  const prepareAllJSON = () => {
    let teachers = users
      .filter((user) => user.role === 'Teacher' || user.role === 'Admin')
      .map((user) => ({ id: user.id, name: user.name }))
      .sort((a: any, b: any) => {
        if (a.name > b.name) return 1;
        else if (a.name < b.name) return -1;
        else return 0;
      });
    let items = [];
    if (
      dateRef1.current?.value &&
      dateRef2.current?.value &&
      dateRef1.current?.value < dateRef2.current?.value
    )
      for (let i = 0; i < teachers.length; i++) {
        items = events
          .filter((event) => event.teachersid[0] == teachers[i].id)
          .filter(
            (event) =>
              new Date(event.date) >=
                new Date(dateRef1.current?.value! + 'T00:00:00') &&
              new Date(event.date) <=
                new Date(dateRef2.current?.value! + 'T23:59:59')
          );
        let temp1 = excelJSON;
        let teacherDataObj = prepareJSON(
          items.sort((a, b) =>
            a.date > b.date ? 1 : b.date > a.date ? -1 : 0
          ),
          teachers[i].name
        );
        if (
          teacherDataObj.totalGroupsAmount > 0 ||
          teacherDataObj.totalLessonAmount > 0
        ) {
          if (temp1.map((item) => item.name).indexOf(teachers[i].name) === -1) {
            prepareTableView(teacherDataObj, true);

            temp1.push(teacherDataObj);
            setExcelJSON([...temp1]);
          }
        }
      }
  };

  const prepareTableView = (
    teacherDataObj: TExcelJSON,
    multipleUsers: boolean
  ) => {
    let tableDataTemp: TTableData[];
    multipleUsers ? (tableDataTemp = tableData) : (tableDataTemp = []);
    tableDataTemp.push({
      date: '.',
      note: ' ',
      lessons: null,
      groups: null,
      confirmed: undefined,
      id: undefined,
    });
    tableDataTemp.push({
      date: '.',
      note: ' ',
      lessons: null,
      groups: null,
      confirmed: undefined,
      id: undefined,
    });
    tableDataTemp.push({
      date: '',
      note: teacherDataObj.name,
      lessons: Math.round(teacherDataObj.totalLessonAmount * 100) / 100,
      groups: teacherDataObj.totalGroupsAmount,
      confirmed: undefined,
      id: undefined,
    });
    for (let i = 0; i < teacherDataObj.daysSchedule.length; i++) {
      tableDataTemp.push({
        date: new Date(
          teacherDataObj.daysSchedule[i].dateString + ' 5:00:00.1'
        ).toLocaleDateString('en-us', {
          weekday: 'short',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }),
        note: '',
        lessons:
          Math.round(teacherDataObj.daysSchedule[i].lessonAmount * 100) / 100,
        groups: teacherDataObj.daysSchedule[i].groupsAmount,
        confirmed: undefined,
        id: undefined,
      });
      for (let j = 0; j < teacherDataObj.daysSchedule[i].events.length; j++) {
        tableDataTemp.push({
          date: '',
          note: teacherDataObj.daysSchedule[i].events[j].tag,
          lessons: teacherDataObj.daysSchedule[i].events[j].tag.includes(
            'Private'
          )
            ? Math.round(
                teacherDataObj.daysSchedule[i].events[j].amount * 100
              ) / 100
            : 0,
          groups: teacherDataObj.daysSchedule[i].events[j].tag.includes('Group')
            ? teacherDataObj.daysSchedule[i].events[j].amount
            : 0,
          confirmed: teacherDataObj.daysSchedule[i].events[j].confirmed,
          id: teacherDataObj.daysSchedule[i].events[j].id,
        });
      }
    }

    setTableData([...tableDataTemp]);
    console.log(tableDataTemp);
  };
  console.log(excelJSON);

  return (
    <AnimateModalLayout
      visibility={isVisible}
      onReturn={() => {
        setIsVisible(false);
        onReturn();
      }}
    >
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-3xl  flex justify-center items-center flex-col bg-lightMainBG dark:bg-darkMainBG  h-[75svh] md:h-[85svh]`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={` absolute top-0 left-0  flex flex-col w-full p-1 justify-center items-center`}
          >
            <h2 className="w-full text-center uppercase">
              {'Lessons Taught Excel Export'}
            </h2>
            <div className="w-full flex flex-row justify-center items-center flex-wrap">
              <label className="flex flex-row justify-between items-center m-2">
                Start Day
                <input
                  className="flex-1 outline-none border-none rounded-md   text-lightMainColor p-0.5 mx-1"
                  ref={dateRef1}
                  type="date"
                  onChange={(e) => {
                    e.preventDefault();
                    setTableData([] as TTableData[]);
                    let items = events;
                    if (teacher !== -1) {
                      items = items.filter(
                        (event) => event.teachersid[0] == teacher
                      );

                      items = items.filter(
                        (event) =>
                          new Date(event.date) >=
                            new Date(dateRef1.current?.value! + 'T00:00:00') &&
                          new Date(event.date) <=
                            new Date(dateRef2.current?.value! + 'T23:59:59')
                      );
                      let temp1 = [];
                      temp1.push(
                        prepareJSON(
                          items.sort((a, b) =>
                            a.date > b.date ? 1 : b.date > a.date ? -1 : 0
                          ),
                          users.filter((user) => user.id === teacher)[0].name
                        )
                      );

                      prepareTableView(temp1[0], false);
                      setExcelJSON([...temp1]);
                    } else {
                      setExcelJSON([] as TExcelJSON[]);
                      prepareAllJSON();
                    }
                  }}
                />
              </label>
              <label className="flex flex-row justify-between items-center m-2">
                Finish Day
                <input
                  className="flex-1 outline-none border-none rounded-md   text-lightMainColor p-0.5 mx-1"
                  ref={dateRef2}
                  type="date"
                  onChange={(e) => {
                    e.preventDefault();
                    setTableData([] as TTableData[]);
                    let items = events;
                    if (teacher !== -1) {
                      items = items.filter(
                        (event) => event.teachersid[0] == teacher
                      );
                      items = items.filter(
                        (event) =>
                          new Date(event.date) >=
                            new Date(dateRef1.current?.value! + 'T00:00:00') &&
                          new Date(event.date) <=
                            new Date(dateRef2.current?.value! + 'T23:59:59')
                      );
                      let temp1 = [];
                      temp1.push(
                        prepareJSON(
                          items.sort((a, b) =>
                            a.date > b.date ? 1 : b.date > a.date ? -1 : 0
                          ),
                          users.filter((user) => user.id === teacher)[0].name
                        )
                      );
                      prepareTableView(temp1[0], false);
                      setExcelJSON([...temp1]);
                    } else {
                      setExcelJSON([] as TExcelJSON[]);
                      prepareAllJSON();
                    }
                  }}
                />
              </label>
            </div>
            <label className="flex flex-col m-auto justify-between items-center">
              Instructor
              <select
                className=" mb-2 rounded-md text-ellipsis  dark:text-darkMainColor text-menuBGColor dark:bg-menuBGColor"
                style={{
                  backgroundColor:
                    teacher == undefined || teacher == null
                      ? 'white'
                      : users.filter((user) => user.id == teacher)[0]?.color!,
                }}
                value={teacher!}
                onChange={(e) => {
                  setTeacher(parseInt(e.target.value));
                  let t1: TTableData[] = [];
                  setTableData([...t1]);
                  let items = events;
                  if (e.target.value !== '-1') {
                    items = items.filter(
                      (event) => event.teachersid[0] == parseInt(e.target.value)
                    );
                    items = items.filter(
                      (event) =>
                        new Date(event.date) >=
                          new Date(dateRef1.current?.value! + 'T00:00:00') &&
                        new Date(event.date) <=
                          new Date(dateRef2.current?.value! + 'T23:59:59')
                    );

                    let temp1 = [];
                    temp1.push(
                      prepareJSON(
                        items.sort((a, b) =>
                          a.date > b.date ? 1 : b.date > a.date ? -1 : 0
                        ),
                        users.filter(
                          (user) => user.id === parseInt(e.target.value)
                        )[0].name
                      )
                    );
                    prepareTableView(temp1[0], false);
                    setExcelJSON([...temp1]);
                  } else {
                    setExcelJSON([] as TExcelJSON[]);
                    prepareAllJSON();
                  }
                }}
              >
                {role !== 'Teacher' && (
                  <option
                    key={'all teachers'}
                    value={-1}
                    style={{
                      backgroundColor: 'transparent',
                    }}
                  >
                    {'All Instructors'}
                  </option>
                )}
                {users
                  .filter((user) =>
                    role !== 'Teacher'
                      ? user.role === 'Teacher' || user.role === 'Admin'
                      : user.id == userID
                  )
                  .sort((a: any, b: any) => {
                    if (a.name > b.name) return 1;
                    else if (a.name < b.name) return -1;
                    else return 0;
                  })
                  .map((item, index) => {
                    return (
                      <option
                        key={'teacher' + index}
                        value={item.id}
                        style={{
                          backgroundColor: item.color ? item.color : '',
                        }}
                      >
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </label>
            <button
              className="btnFancy m-2 p-2   bg-darkMainColor text-lightMainBG rounded-md"
              onClick={handleOnExport}
            >
              Export
            </button>
            {changesMade.length>0 &&<button
              className="btnFancy m-2 p-2   bg-darkMainColor text-lightMainBG rounded-md"
              onClick={async () => {
                const res = await fetch('/api/schedule_confirm', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                     changesmade: changesMade,
                  }),
                });
                console.log(res);
                setChangesMade([]);
                 

              }}
            >
              Save Changes
            </button>}
            <div className="flex flex-col w-full">
              <div className="w-full flex flex-row justify-between border rounded-t-md border-lightMainColor dark:border-darkMainColor">
                <div className="w-1/4 flex justify-center items-center">
                  Date
                </div>
                <div className="w-[38%] flex justify-center items-center">
                  Note
                </div>
                <div className="w-[12.5%] flex justify-center items-center">
                  Lessons
                </div>
                <div className="w-[12.5%] flex justify-center items-center ">
                  Groups
                </div>
                <div className="w-[12.5%] flex justify-center items-center">
                  Confirmed
                </div>
              </div>
              {tableData &&
                teacher &&
                tableData.map((row, index) => (
                  <div key={'row_' + index} className="flex w-full flex-row">
                    <div className="w-1/4 flex justify-center items-center flex-wrap">
                      {row.date}
                    </div>
                    <div className="w-[38%] flex justify-center items-center flex-wrap border-l border-lightMainColor dark:border-darkMainColor">
                      {row.note}
                    </div>
                    <div className="w-[12.5%] flex justify-center items-center flex-wrap border-l text-center border-lightMainColor dark:border-darkMainColor">
                      {row.lessons}
                    </div>
                    <div className="w-[12.5%] flex justify-center items-center flex-wrap border-l text-center border-lightMainColor dark:border-darkMainColor">
                      {row.groups}
                    </div>
                    {row.confirmed !== undefined && (
                      <div className="w-[12.5%] flex justify-center items-center flex-wrap border-l text-center border-lightMainColor dark:border-darkMainColor">
                        <div className={` h-8 w-8 md:h-10 md:w-10 fill-${row.confirmed?"editcolor":"alertcolor"}  stroke-${row.confirmed?"editcolor":"alertcolor"}`}
                           onClick={() =>{ 
                            let temp = [...tableData];
                            let newValue = !temp[index].confirmed
                            temp[index].confirmed =  newValue;
                            console.log(row.id);
                            setTableData(temp);
                            let originalEvent=events.filter((event) => event.id === row.id)[0];
                            console.log(originalEvent);
                            let tempChanges=changesMade;
                            if (tempChanges.filter((event) => event.id === row.id).length===0){
                               tempChanges.push({id:row.id!,confirmed:newValue});
                            }else{
                               tempChanges=tempChanges.filter((event) => {
                                if (event.id !== row.id) 
                                return event;
                              });
                              setChangesMade(tempChanges);
                            }
                              console.log(tempChanges);
                        
                           }}
                        >
                          <ShowIcon icon={row.confirmed?'Checkmark':"Close"} stroke={'0.5'} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
};

export default PayrollModal;
