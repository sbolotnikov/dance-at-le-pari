import { TPaymentType } from '@/types/screen-settings';
import React from 'react';
import ImgFromDb from './ImgFromDb';
type Props = {
  paymentsArray: TPaymentType[];
  role: string;
  onReturn: (val: TPaymentType | null, callbackType: string) => void;
};

const PaymentPageForm = ({ paymentsArray, role, onReturn }: Props) => {
  console.log(paymentsArray);
  return (
    <div className="w-full h-full overflow-y-auto">
      {paymentsArray.map((payment) => {
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
              <p className="w-[45%] text-base text-center">${payment.price}</p>
              <div className="w-[50%] flex flex-col justify-around items-center">
                <button
                  className="w-full btnFancy my-1 text-base  dark:text-lightMainBG text-darkMainBG rounded-md"
                  onClick={() => onReturn(payment, 'Book')}
                >
                  Book
                </button>
                {role == 'Admin' && (
                  <button
                    className="w-full bg-lightMainColor my-1 text-base dark:bg-darkMainColor text-lightMainBG dark:text-darkMainBG rounded-md"
                    onClick={() => onReturn(payment, 'Edit')}
                  >
                    Edit
                  </button>
                )}
                {role == 'Admin' && (
                  <button
                    className="w-full bg-lightMainColor text-base dark:bg-darkMainColor text-lightMainBG dark:text-darkMainBG rounded-md"
                    onClick={() => onReturn(payment, 'Delete')}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <button
        className="w-full bg-lightMainColor mt-2 mb-12 text-base dark:bg-darkMainColor text-lightMainBG dark:text-darkMainBG rounded-md"
        onClick={() => onReturn(null,'Add')}
      >
        Add
      </button>
    </div>
  );
};
export default PaymentPageForm;