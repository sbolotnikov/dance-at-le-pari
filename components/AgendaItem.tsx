import { useState } from 'react'
import ImgFromDb from './ImgFromDb';
import Link from 'next/link';
import { TEventAgenda } from '@/types/screen-settings';

type Props = {
    item:TEventAgenda;
    index:number;
}

const AgendaItem = ({item, index}: Props) => {
    const [agendaItemView, setAgendaItemView] = useState(false);
  return (
    <div 
                    className=" w-full  grid grid-cols-6 relative"
                  >
                    <div className="col-span-2 border-y border-l dark:border-darkMainColor border-lightMainColor">
                      <div className="flex flex-col justify-start items-start ml-1">
                        <h3 className="text-left text-2xl font-bold ">
                          {new Date(item.date).toLocaleDateString('en-us', {
                            day: 'numeric',
                          })}
                        </h3>
                        <h4 className="text-left text-lg ">
                          {new Date(item.date).toLocaleDateString('en-us', {
                            month: 'long',
                          })}
                        </h4>
                        <h4 className="text-left text-lg ">
                          {new Date(item.date).toLocaleDateString('en-us', {
                            weekday: 'long',
                          })}
                        </h4>
                      </div>
                    </div>
                    <Link
                      href={'/events/' + item.id}
                      className="col-span-4 grid grid-cols-4 cursor-pointer border dark:border-darkMainColor border-lightMainColor"
                    >
                      <div className="  md:order-1 md:col-span-1 hidden md:block  ml-1">
                        {new Date(item.date).toLocaleTimeString('en-us', {
                          timeStyle: 'short',
                        })}
                        -{' '}
                        {new Date(
                          new Date(item.date).getTime() + item.length * 60000
                        ).toLocaleTimeString('en-us', {
                          timeStyle: 'short',
                        })}
                      </div>
                      <div className="col-span-4 order-1 md:order-2 md:col-span-3 md:border-l dark:border-darkMainColor border-lightMainColor flex flex-col p-1">
                        <h3 className="text-left font-bold pr-5">
                          {item.eventtype +
                            ' ' +
                            item.tag +
                            (item.teacher != null && item.teacher.length > 0
                              ? ` by ${item.teacher}`
                              : ' ')}
                        </h3>
                        <h3 className=" text-left  ml-1 md:hidden">
                          {new Date(item.date).toLocaleTimeString('en-us', {
                            timeStyle: 'short',
                          })}
                          -{' '}
                          {new Date(
                            new Date(item.date).getTime() + item.length * 60000
                          ).toLocaleTimeString('en-us', {
                            timeStyle: 'short',
                          })}
                        </h3>
                        <h3 className={`text-left transition duration-600 ease-in-out ${!agendaItemView?'h-[4.5rem] text-ellipsis overflow-hidden':''} md:min-h-fit`}>{item.description}</h3>
                        <h3 className="text-left">{`Price: ${item.eventtype=="Group"?"from":" "} $ ${item.minprice}` }</h3>
                        <ImgFromDb
                          url={item.image!}
                          stylings={`object-contain m-auto transition duration-600 ease-in-out ${!agendaItemView?"h-0 md:h-full":""}`}
                          alt="Event Picture"
                        />
                      </div>
                    </Link>
                    <img className="w-5 h-5 transition duration-300 ease-in-out absolute top-2 right-2 md:hidden" src={"/icons/caret.svg"} id={'img.'+index} alt="chevron" 
                    onClick={()=>{
                      let btn = document.getElementById("img."+index);
                      setAgendaItemView(!agendaItemView);
                      if(btn?.classList.contains("rotate-180")){
                        btn.classList.remove("rotate-180");
                      }else{
                        btn?.classList.add("rotate-180");                        
                      }
                    }} />

                  </div>
  )
}

export default AgendaItem