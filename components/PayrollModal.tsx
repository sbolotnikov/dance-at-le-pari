import { useRef, useState } from 'react';
import AnimateModalLayout from './AnimateModalLayout';
import { TEventScheduleArray, TUser } from '@/types/screen-settings';

type Props = {
  visibility: boolean;
  role: string; 
  events: TEventScheduleArray;
  users: TUser[];
  onReturn: () => void;
};
type TExcelJSON = {
  daysSchedule:{events:{tag:string, amount:number}[],dateString:string, lessonAmount:number, groupsAmount:number}[],
  name:string, 
  totalLessonAmount:number,
  totalGroupsAmount:number
}
const PayrollModal = ({ visibility, role, events, users, onReturn }: Props) => {
  const [isVisible, setIsVisible] = useState(visibility);
  const dateRef1 = useRef<HTMLInputElement>(null);
  const dateRef2 = useRef<HTMLInputElement>(null);
  const [lessonLength, setLessonLength] = useState(45);
  const [teacher, setTeacher] = useState(-1);
  const [excelJSON, setExcelJSON] = useState<TExcelJSON[]>([]); 

  const uniqueValues = (nums: any[]) => Array.from(new Set(nums));

  const prepareJSON = (events: TEventScheduleArray, name:string):TExcelJSON => {
    let dateArr = events.map((event) => event.date.split('T')[0]); 
    dateArr=uniqueValues(dateArr);
    let obj1:{events:{tag:string, amount:number}[],dateString:string, lessonAmount:number, groupsAmount:number}[]=[]
    for (let i=0; i<dateArr.length; i++){
      let date=dateArr[i]
      let events1=events.filter((event) => event.date.split('T')[0]==date)
      let lessonsLength=events1.filter(event=>event.eventtype=="Private").map((event) => event.length).reduce((a,b) => a+b,0)
      let groupsAmount =events1.filter(event=>event.eventtype=="Group").length;
      let finalEvents  = events1.map((event) =>( {tag:event.date.split('T')[1]+" "+event.eventtype+": "+event.tag, amount:(event.eventtype=="Group")?1:event.length/lessonLength}))
      obj1.push({events:finalEvents, dateString:date, lessonAmount:lessonsLength/lessonLength, groupsAmount:groupsAmount})
    }
    let totalLessonAmount = obj1.map((item) => item.lessonAmount).reduce((a,b) => a+b,0)
    let totalGroupsAmount = obj1.map((item) => item.groupsAmount).reduce((a,b) => a+b,0)
    return {name,daysSchedule:obj1,totalLessonAmount,totalGroupsAmount}
  }
  const prepareAllJSON = () =>{
    
    let teachers=users
    .filter(
      (user) => user.role === 'Teacher' || user.role === 'Admin'
      )
      .map((user) => ({ id: user.id, name: user.name }))
    .sort((a: any, b: any) => {
      if (a.name > b.name) return 1;
      else if (a.name < b.name) return -1;
      else return 0;
    });
    let items=[];
    if ((dateRef1.current?.value) && (dateRef2.current?.value) && (dateRef1.current?.value<dateRef2.current?.value))
    for (let i=0;i<teachers.length; i++){
      items = events.filter(
        (event) => event.teachersid[0] == teachers[i].id).filter(
          (event) =>
            new Date(event.date) >= new Date(dateRef1.current?.value!+'T00:00:00') &&
            new Date(event.date) <= new Date(dateRef2.current?.value!+'T23:59:59')
        );
        let temp1=excelJSON;
        temp1.push(prepareJSON(items.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)),teachers[i].name))
      setExcelJSON([...temp1]);
    }

  }
 console.log(excelJSON)

  return (
    <AnimateModalLayout
      visibility={isVisible}
      onReturn={() => {
        setIsVisible(false);
        onReturn();
      }}
    >
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-3xl  flex justify-center items-center flex-col bg-lightMainBG dark:bg-darkMainBG  h-[70svh] md:h-[85svh]`}
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
                    let items = events
                    if (teacher !== -1) {       
                      items = items.filter(
                        (event) => event.teachersid[0] == teacher
                      );
                    
                    items = items.filter(
                      (event) =>
                        new Date(event.date) >= new Date(dateRef1.current?.value!+'T00:00:00') &&
                        new Date(event.date) <= new Date(dateRef2.current?.value!+'T23:59:59')
                    );
                    let temp1=[];
                    temp1.push(prepareJSON(items.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)),users.filter(user=>user.id===teacher)[0].name))
                  setExcelJSON([...temp1]);
                    }
                    else { setExcelJSON([] as TExcelJSON[]); prepareAllJSON();}
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
                    let items = events
                    if (teacher !== -1) {       
                      items = items.filter(
                        (event) => event.teachersid[0] == teacher
                      );
                    items = items.filter(
                      (event) =>
                        new Date(event.date) >= new Date(dateRef1.current?.value!+'T00:00:00') &&
                        new Date(event.date) <= new Date(dateRef2.current?.value!+'T23:59:59')
                    );
                    let temp1=[];
                    temp1.push(prepareJSON(items.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)),users.filter(user=>user.id===teacher)[0].name));
                    setExcelJSON([...temp1]);
                  }else { setExcelJSON([] as TExcelJSON[]); prepareAllJSON();}
                  }}
                />
              </label>
              </div>
              <label className="flex flex-col m-auto justify-between items-center">
              Instructor
              <select
                className=" mb-2 rounded-md text-ellipsis  dark:text-darkMainColor text-menuBGColor "
                style={{
                  backgroundColor:
                    teacher == undefined || teacher == null
                      ? 'white'
                      : users.filter((user) => user.id == teacher)[0]?.color!,
                }}
                value={teacher!}
                onChange={(e) => {
                  setTeacher(parseInt(e.target.value));
                  let items = events
                  if (e.target.value !== '-1') {       
                    items = items.filter(
                      (event) => event.teachersid[0] == parseInt(e.target.value)
                    );
                  items = items.filter(
                    (event) =>
                      new Date(event.date) >= new Date(dateRef1.current?.value!+'T00:00:00') &&
                      new Date(event.date) <= new Date(dateRef2.current?.value!+'T23:59:59')
                  );
                  
                  let temp1=[];
                  temp1.push(prepareJSON(items.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)),users.filter(user=>user.id===parseInt(e.target.value))[0].name));
                  setExcelJSON([...temp1]);
                }else{ setExcelJSON([] as TExcelJSON[]); prepareAllJSON();}
                }}
              >
                <option
                  key={'all teachers'}
                  value={-1}
                  style={{
                    backgroundColor: 'transparent',
                  }}
                >
                  {'All Instructors'}
                </option>
                {users
                  .filter(
                    (user) => user.role === 'Teacher' || user.role === 'Admin'
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
          </div>
        </div>
      </div>
    </AnimateModalLayout>
  );
};

export default PayrollModal;
