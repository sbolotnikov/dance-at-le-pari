import { TPaymentType  } from '@/types/screen-settings';
import { useEffect, useState } from 'react';
import ImgFromDb from './ImgFromDb';
import Link from 'next/link';
import PriceOptionSelect from './PriceOptionSelect';
type Props = {
  paymentsArray: TPaymentType[];
  role: string;
  specialEvent: boolean
  onReturn: (tempID: number, callbackType: string, option:number | null ) => void;
};

const PaymentPageForm = ({ paymentsArray, role, specialEvent, onReturn }: Props) => {
  const [options, setOptions] = useState<number[]>([]);
  console.log(paymentsArray);
  useEffect(() => {
    let arr=[];
    for (let i = 0; i < paymentsArray.length; i++) {
      arr.push(0);      
    }
    setOptions([...arr]);
  },[paymentsArray] );
  return (
    <div className="w-full absolute top-0 left-0  mb-20">
      {paymentsArray.map((payment,index) => {
        return (
          <div
            key={payment.id}
            className="w-full flex flex-row justify-around items-center border-b-2 border-lightMainColor dark:border-darkMainColor"
          >
            <div className="w-1/2 flex flex-row justify-center items-center">
              <ImgFromDb
                url={payment.image}
                stylings="object-contain hidden md:block md:h-20 md:w-20 m-2 rounded-full"
                alt="Product Picture"
              />
              <div className="w-full flex flex-col justify-center items-center">
                <p className="w-full text-xl font-semibold text-left">
                  {payment.tag}
                </p>
                <p className="w-full text-sm italic text-left">
                  {payment.description}
                </p>
              </div>
            </div>
            <div className="w-[49%] flex flex-row justify-around items-center">
              <p>{payment.options &&<PriceOptionSelect options={payment.options} onChange={(option:number )=>{ 
                console.log(option); 
                let arr = options; 
                arr[index]=option;
                console.log(arr);
                setOptions([...arr]);
                }}/>}</p> 
              <div className="w-[50%] flex flex-col justify-around items-center">
                {specialEvent?(
                  <Link href={`/events/${payment.id}`} >
                    <div
                  className="w-full btnFancy my-1 text-base text-center  rounded-md" style={{padding:'0'}}
                  onClick={() => onReturn(payment.id!, 'Book', 0 )}
                >
                  {"Check Event"}
                </div>
                  </Link>
                ):(<div
                  className="w-full btnFancy my-1 text-base text-center  rounded-md" style={{padding:'0'}}
                  onClick={() => onReturn(payment.id!, 'Book', options[index])}
                >
                  {'Add to Cart'}
                </div>)}
                
                {role == 'Admin' && (
                  <button
                    className="w-full bg-lightMainColor my-1 text-base dark:bg-darkMainColor text-lightMainBG dark:text-darkMainBG rounded-md"
                    onClick={() => onReturn(payment.id!, 'Edit', null)}
                  >
                    Edit
                  </button>
                )}
                {role == 'Admin' && (
                  <button
                    className="w-full bg-lightMainColor text-base dark:bg-darkMainColor text-lightMainBG dark:text-darkMainBG rounded-md"
                    onClick={() => onReturn(payment.id!, 'Delete', null)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {role == 'Admin' && (<button
        className="w-full bg-lightMainColor mt-2 mb-8 text-base dark:bg-darkMainColor text-lightMainBG dark:text-darkMainBG rounded-md"
        onClick={() => onReturn(-1,'Add',null)}
      >
        Add
      </button>)}
    </div>
  );
};
export default PaymentPageForm;
