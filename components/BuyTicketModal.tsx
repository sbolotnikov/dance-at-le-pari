import { useEffect, useState } from 'react';
import ShowIcon from './svg/showIcon';
import { AnimatePresence, motion } from 'framer-motion';
import ImgFromDb from './ImgFromDb';
import InputBox from './InputBox';
import {PaymentForm, CreditCard} from 'react-square-web-payments-sdk';

type Props = {
  seatmap: string | null;
  tables: number[] | null;
  tableName: string | null;
  id: number;
  eventImage: string | null;
  onReturn: () => void;
};

export default function BuyTicketModal({
  seatmap,
  tables,
  eventImage,
  tableName,
  id,
  onReturn,
}: Props) {
  const [isVisible, setIsVisible] = useState(true);
  const [chosenTable, setChosenTable] = useState(0);
  const [eventSeatMap, setEventSeatMap] = useState<string[]>([]);
  let el = document.querySelector('#mainPage');
  useEffect(() => {
    let arr: string[] = [];
    if (tables != null)
      for (let i = 0; i < tables.length; i++) {
        for (let j = 0; j < tables[i]; j++) {
          if (j == 0) arr[i] = 'Empty';
          else arr[i] = arr[i] + ' ' + 'Empty';
        }
      }
    setEventSeatMap(arr);
  }, []);
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
                <InputBox startValue={1} setWidth={8} onChange={(n)=>{console.log(n)}}/>
              </div>
            )}
            {(tables !== null)&&(tables.length > 0) ? (
              <div>
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
                      <option key={'Table'+index} value={index}>
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
                    multiple
                    onChange={(e) => {
                      // setChosenTable(parseInt(e.target.value));
                      console.log(e.target);
                    }}
                  >
                    {eventSeatMap.length &&
                      eventSeatMap[chosenTable].split(' ').map((i, index) => (
                        <option key={'Seat'+index} value={index}>
                          {'Seat'} {index < 12 ? index + 1 : index + 2} {`[${i}]`}
                        </option>
                      ))}
                  </select>
                </label>
                <button
                    onClick={() => {
                      var el = document.getElementsByTagName('select')[1];
                      var result = [];
                      var options = el && el.options;
                      var opt;

                      for (var i = 0, iLen = options.length; i < iLen; i++) {
                        opt = options[i];

                        if (opt.selected) {
                          result.push(opt.value || opt.text);
                        }
                      }
                      console.log(result);
                    }}
                  >
                    Show selected values
                  </button>
              </div>
            ) : (
              <></>
            )}
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
               cardTokenizeResponseReceived={async(token, verifiedBuyer) => {
                
                const response = await fetch("/api/payment", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              sourceId: token.token,
              currency:'USD',
              amount:25
            }),
          });
          console.log(await response.json());
        }
              }
            >
              <CreditCard/>
            </PaymentForm>




          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
