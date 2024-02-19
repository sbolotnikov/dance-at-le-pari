'use client';
import { FC, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import { useSelector } from "react-redux"
import { RootState } from '@/app/store/store';
import ImgFromDb from '@/components/ImgFromDb';
import { useDispatch} from "react-redux"
import { removeItem } from "../../slices/cartSlice";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
    const {items} = useSelector((state:RootState) => state.cart ) ;
    const dispatch = useDispatch();
    console.log(items)
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {/* {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />} */}
      
      <div className="border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-5xl  flex justify-center items-center flex-col  h-[70svh] md:h-[85svh] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
        <div className="w-full h-full relative  p-1 flex  overflow-y-scroll border border-lightMainColor dark:border-darkMainColor rounded-md">
          <div className="flex flex-col w-full p-1 justify-center items-center absolute top-0 left-0">
            <h2
              className="text-center font-bold uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Shopping Cart
            </h2>

            <div className="w-full h-full overflow-y-auto mb-20">
             {items.map((item, index) => {
              return (
              <div key={item.id} className="w-full flex flex-row justify-around items-center border-b-2 border-lightMainColor dark:border-darkMainColor" >
                <div className="w-1/2 flex flex-row justify-center items-center">
                  <ImgFromDb url={item.image} stylings="object-contain hidden md:block md:h-20 md:w-20 m-2 rounded-full" alt="Product Picture"/>
                  <div className="w-full flex flex-col justify-center items-center">
                    <p className="w-full text-xl font-semibold text-left">
                     {item.tag}
                    </p>
                    {(item.seat!>0) &&<p className="w-full text-sm italic text-left">
                    Table:{item.table} Seat:{item.seat} Date:{new Date(item.date!).toLocaleDateString('en-us', { month: 'long', day: 'numeric',year: 'numeric' })} {new Date(item.date!).toLocaleTimeString('en-US', {
                  timeStyle: 'short',
                })}

                    </p>}
                  </div>
                </div>
                <div className="w-[49%] flex flex-row justify-around items-center">
                <p className="w-[45%] text-base text-center">${(item.price/item.amount).toFixed(2)}*{item.amount} = ${item.price}</p>
                  <div className="w-[50%] flex flex-col justify-around items-center">
                    <button  className="w-full btnFancy my-1 text-base text-center  rounded-md" style={{padding:'0'}} onClick={() =>  dispatch(removeItem(index))}>
                      {'Remove from Cart'}
                    </button>
                  </div>
                </div>
              </div>
             )})}

             <div className="w-full flex flex-row justify-around items-center">
                <p className="w-[45%] text-base text-center">Total</p>
                <div className="w-[50%] flex flex-col justify-around items-center">${items.reduce(function (acc, item) { return acc + item.price;} , 0)}</div>
             </div>
            </div>
            </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
