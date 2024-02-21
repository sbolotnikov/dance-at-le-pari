'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import ShowIcon from './svg/showIcon';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import AnimateModalLayout from './AnimateModalLayout';
import Image from 'next/image';
import ImgFromDb from './ImgFromDb';

type Props = {
  visibility: boolean;
  invoice: string;
  onReturn: () => void;
};

export default function ReceiptModal({ visibility, invoice, onReturn }: Props) {
  const [isVisible, setIsVisible] = useState(visibility);
  const { items } = useSelector((state: RootState) => state.cart);
  useEffect(() => {
    console.log(isVisible);
  }, []);

  const downloadPDF = () =>{
    const capture = document.querySelector('.actual-receipt')! as HTMLElement;
    // setLoader(true);
    html2canvas(capture).then((canvas)=>{
      const imgData = canvas.toDataURL('img/jpg');
      const doc = new jsPDF({
        orientation: (1.9+0.75*items.length>4)?"portrait":"landscape",
        unit: "in",
        format: [4, 1.9+0.75*items.length]
      });
      const componentWidth = doc.internal.pageSize.getWidth();
      const componentHeight = doc.internal.pageSize.getHeight();
      doc.addImage(imgData, 'JPG', 0, 0, componentWidth, componentHeight);
      // setLoader(false);
      doc.save('receipt.pdf');
    })
  }
  return (
    <AnimateModalLayout
      visibility={isVisible}
      onReturn={() => {
        setIsVisible(false);
        onReturn();
      }}
    >
      <div className="border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-5xl  flex justify-center items-center flex-col  h-[70svh] md:h-[85svh] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
      <button
                  className="w-full btnFancy my-1 text-base text-center  rounded-md" style={{padding:'0'}}
                  onClick={() => downloadPDF()}
                >Download Receipt
            </button>
        <div className="w-full h-full relative  p-1 flex  overflow-y-scroll border border-lightMainColor dark:border-darkMainColor rounded-md">
          <div className="actual-receipt flex flex-col w-full p-1 justify-center items-center absolute top-0 left-0">
          <div className="w-full flex flex-col justify-center items-center h-48">
          
                    <img 
                    src={'/logo.png'}
                    width={80}
                    height={80} 
                    alt="Logo"
                  />
                  
              <h1 className="font-bold text-xl text-franceBlue  text-center font-DancingScript text-shadow  dark:text-shadow-light  ">
        Dance At Le Pari
        </h1>
             </div>
            <h2 className='text-center'>Receipt for Invoice # : {invoice} </h2>

            {items.map((item, index) => {
              return (
                <div
                  key={index}
                  className="w-full h-[250px] flex flex-row justify-around items-center p-2 border-b-2 border-lightMainColor dark:border-darkMainColor"
                >
                  <div className="w-1/2 flex flex-row justify-center items-center">
                    <ImgFromDb
                      url={item.image}
                      stylings="object-contain hidden md:block md:h-20 md:w-20 m-2 rounded-full"
                      alt="Product Picture"
                    />
                    <div className="w-full flex flex-col justify-center items-center">
                      <p className="w-full text-xl font-semibold text-left">
                        {item.tag}
                      </p>
                      {item.seat! > 0 && (
                        <p className="w-full text-sm italic text-left">
                          Table:{item.table} Seat:{item.seat} Date:
                          {new Date(item.date!).toLocaleDateString('en-us', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          {new Date(item.date!).toLocaleTimeString('en-US', {
                            timeStyle: 'short',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-[49%] flex flex-row justify-around items-center">
                    <p className="w-[45%] text-base text-center">
                      ${(item.price / item.amount).toFixed(2)}*{item.amount} = $
                      {item.price}
                    </p>
                    {item.seat! > 0 ? (
                      <div className="w-[50%] flex flex-col justify-around items-center">
                        <div className="h-auto w-full max-w-24 my-1 mx-auto">
                          <QRCode
                            size={256}
                            style={{
                              height: 'auto',
                              maxWidth: '100%',
                              width: '100%',
                            }}
                            value={JSON.stringify({invoice: invoice, seat: item.seat, table: item.table, event: -item.id})}
                            viewBox={`0 0 256 256`}
                          />
                        </div>
                      </div>
                    ):(<p className="w-[250px] h-[250px] flex flex-col justify-around items-center"></p>)}
                  </div>
                </div>
              );
            })}

            <div className="w-full flex flex-row justify-around items-center">
              <p className="w-[45%] text-base text-center">Total</p>
              <div className="w-[50%] flex flex-col justify-around items-center">
                $
                {items.reduce(function (acc, item) {
                  return acc + item.price;
                }, 0)}
              </div>
              </div>
          </div>

        </div>
      </div>
    </AnimateModalLayout>
  );
}
