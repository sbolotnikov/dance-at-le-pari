'use client';
import { FC, useContext, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';

import ShowIcon from '@/components/svg/showIcon';
import { SettingsContext } from '@/hooks/useSettings';
import { ScreenSettingsContextType } from '@/types/screen-settings';
import { useDimensions } from '@/hooks/useDimensions';
import ImgFromDb from '@/components/ImgFromDb';
import Link from 'next/link';

interface pageProps {}
type TPurchases = {
  amount: number;
  date: string;
  eventtype: string;
  image: string;
  invoice: string;
  personNote: string | null;
  price: number;
  purchasedAt: Date;
  seat: number | null;
  status: string;
  table: number | null;
  tag: string | null;
  email: string | null;
  name: string | null;
  telephone: string | null;
};

const page: FC<pageProps> = ({}) => {
  const { darkMode } = useContext(SettingsContext) as ScreenSettingsContextType;
  const [purchases, setPurchases] = useState<TPurchases[]>([]);
  const dimensions = useDimensions();
  useEffect(() => {
    const r = document.querySelector(':root') as HTMLElement;
    const pr = r.style.getPropertyValue('--accent-color');
    console.log('darkMode:', darkMode, pr);
    if (darkMode) r.style.setProperty('--accent-color', '#93c5fd;');
    else r.style.setProperty('--accent-color', '#504deb;');
  }, [darkMode]);

  useEffect(() => {
    // GET request
    fetch('/api/admin/purchases', {
      cache: 'no-store',
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);

        let tempData = data
          .map((item: any) => ({
            amount: item.amount,
            date: item.date,
            eventtype: item.eventtype,
            image: item.image,
            invoice: item.invoice,
            personNote: item.personNote,
            price: item.price,
            purchasedAt: item.purchasedAt,
            seat: item.seat,
            status: item.status,
            table: item.table,
            tag: item.tag,
            email: item.user!==null && item.user.email!==null ? item.user.email : "",
            name: item.user!==null && item.user.name!==null? item.user.name : "",
            telephone:  item.user!==null && item.user.telephone!==null ? item.user.telephone : null,
          }))
          .sort((a: TPurchases, b: TPurchases) =>
            a.purchasedAt > b.purchasedAt
              ? 1
              : b.purchasedAt > a.purchasedAt
              ? -1
              : 0
          );
        setPurchases(tempData);
      });
    });
  }, []);

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95%] md:h-[85svh] max-w-[1400px] md:w-full flex justify-center items-center flex-col bg-lightMainBG dark:bg-darkMainBG h-[70svh]
      }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className=" w-full h-full flex flex-col justify-center items-center"
          >
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Purchases
            </h2>
            <div className=" h-20 w-20 md:h-28 md:w-28 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor">
              <ShowIcon icon={'Purchases'} stroke={'0.05'} />
            </div>

            {dimensions.height && (
              <div
                id="userContainer"
                className="w-[95%] border-2 rounded-md overflow-y-scroll relative"
                style={{ height: `${dimensions.height - 200}px` }}
              >
                <div className="absolute top-0 left-0 w-full  flex flex-col justify-center items-center">
                  {purchases &&
                    purchases.map((item, index) => {
                      return (
                        <div
                          key={'purchase_' + index}
                          className="w-[95%] m-1 p-1 flex flex-col md:flex-row justify-center md:justify-around items-center border rounded-md border-lightMainColor dark:border-darkMainColor "
                        >
                          <div className="m-1 flex flex-col justify-center items-center">
                          <div className="text-sm md:text-base">
                              Purchased on {' '}
                              {new Date(item.purchasedAt).toLocaleDateString(
                                'en-us',
                                {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'numeric',
                                  day: 'numeric',
                                }
                              ) +
                                ' ' +
                                new Date(item.purchasedAt).toLocaleTimeString(
                                  'en-US',
                                  { timeStyle: 'short', hour12: true }
                                )}
                            </div>
                            {item.image !== null && item.image !== '' ? (
                              <ImgFromDb
                                url={item.image}
                                stylings="  w-20   md:w-28 object-cover rounded-md"
                                alt="Event Picture"
                              />
                            ) : (
                              <div className="  w-20   md:w-28 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                                <ShowIcon icon={'Image'} stroke={'0.5'} />
                              </div>
                            )}
                          </div>
                          <div className="md:w-3/4">
                            <div className='flex flex-col md:flex-row'>
                              <span className="text-base md:text-xl font-bold">
                                Buyer info: {item.name} {'<'}
                                <span className="font-normal italic">
                                  {item.email}
                                </span>
                                {'>'}{' '}
                              </span>
                              <span className="text-base md:text-xl font-bold">
                                Phone:{' '}
                                <Link href={'tel:' + item.telephone}>
                                  {item.telephone}
                                </Link>{' '}
                              </span>
                            </div>
                            <div className="">Item : {item.tag}</div>
                            
                            <div className="">Items bought: {item.amount}</div>
                            <div className="text-xl font-bold">
                              Cost: ${item.price}
                            </div>
                            <div className="">
                              Purchase Status: {item.status}
                            </div>
                            <div className="">
                              Invoice number: {item.invoice}
                            </div>
                            {item.date ? (
                              <div className="">
                                Event date:
                                {new Date(item.date).toLocaleDateString(
                                  'en-us',
                                  {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                  }
                                ) +
                                  ' ' +
                                  new Date(item.date).toLocaleTimeString(
                                    'en-US',
                                    { timeStyle: 'short', hour12: true }
                                  )}
                              </div>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
