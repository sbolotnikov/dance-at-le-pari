'use client';
import { FC, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import ImgFromDb from '@/components/ImgFromDb';
import { useDispatch } from 'react-redux';
import { clearCart, removeItem } from '../../slices/cartSlice';
import ShowIcon from '@/components/svg/showIcon';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import ReceiptModal from '@/components/ReceiptModal';
import { useSession } from 'next-auth/react';
import LoadingScreen from '@/components/LoadingScreen';
import AlertMenu from '@/components/alertMenu';
import { useDimensions } from '@/hooks/useDimensions';
import Link from 'next/link';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { items } = useSelector((state: RootState) => state.cart);
  const [visibleModal, setVisibleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactionID, setTransactionID] = useState('');
  const [revealAlert, setRevealAlert] = useState(false);
  const [scrolling, setScrolling1] = useState(true);
  const windowSize = useDimensions();
  const [alertStyle, setAlertStyle] = useState({
    variantHead: '',
    heading: '',
    text: ``,
    color1: '',
    button1: '',
    color2: '',
    button2: '',
    inputField: '',
  });
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const onReturnAlert = (decision1: string, amount: string | null) => {
    setRevealAlert(false);
  };
  useEffect(() => {
    if (
      document.getElementById('wrapperDiv')?.offsetHeight! -
        document.getElementById('containedDiv')?.offsetHeight! >
      0
    ) {
      setScrolling1(true);
      // console.log(document.getElementById('containedDiv')?.offsetHeight!,)
      // document.getElementById('outerWrapper')!.style.height = (document.getElementById('containedDiv')?.offsetHeight!+200).toString() + 'px';
    } else {
      setScrolling1(false);
    }
  }, [items, windowSize.height]);

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      {loading && <LoadingScreen />}
      {visibleModal && (
        <ReceiptModal
          invoice={transactionID}
          visibility={visibleModal}
          onReturn={(loadStatus, finished, emailSent) => {
            loadStatus ? setLoading(true) : setLoading(false);
            if (finished) {
              setVisibleModal(false);
            }
            if (emailSent !== null) {
              console.log(emailSent);
              setAlertStyle({
                variantHead: 'info',
                heading: 'Message',
                text: `Email to ${emailSent} was sent successfully`,
                color1: 'success',
                button1: 'Return',
                color2: '',
                button2: '',
                inputField: '',
              });
              setRevealAlert(true);
              dispatch(clearCart());
            }
          }}
        />
      )}
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturnAlert}
        styling={alertStyle}
      />
      <div
        id="outerWrapper"
        className="blurFilter border-0 rounded-md p-2  shadow-2xl w-[95svw]  max-w-5xl  flex justify-center items-center flex-col  h-[80svh] md:h-[85svh] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 md:m-3"
      >
        <div
          id="wrapperDiv"
          className="w-full h-full border rounded-md border-lightMainColor dark:border-darkMainColor relative overflow-y-auto flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`${
              scrolling ? '' : 'absolute top-0 left-0'
            } flex flex-col w-full p-1 justify-center items-center`}
          >
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Shopping Cart
            </h2>
            <div className=" h-20 w-20 md:h-28 md:w-28 mb-6 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto">
              <ShowIcon icon={'ShoppingCart'} stroke={'0.1'} />
            </div>
            <div className="w-full mb-2">
              {items.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="w-full flex flex-row justify-around items-center border-b-2 border-lightMainColor dark:border-darkMainColor"
                  >
                    <div className="w-1/2 md:h-20 flex flex-row justify-center items-center">
                      <ImgFromDb
                        url={item.image}
                        stylings="object-contain hidden md:block md:h-20 md:w-20 m-2 rounded-full"
                        alt="Product Picture"
                      />
                      <div className="w-full flex flex-col justify-center items-center">
                        <p className="w-full text-xl font-semibold text-left">
                          {item.tag}
                        </p>
                        {item.seat !== null && item.table !== null && (
                          <p className="w-full text-sm italic text-left">
                            Table:
                            {item.table < 12
                              ? item.table + 1
                              : item.table + 2}{' '}
                            Seat:
                            {item.seat < 12
                              ? item.seat + 1
                              : item.seat + 2}{' '}
                            Date:
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
                        ${(item.price / item.amount).toFixed(2)}*{item.amount} =
                        ${item.price}
                      </p>
                      <div className="w-[50%] flex flex-col justify-around items-center">
                        <button
                          className="w-full btnFancy my-1 text-base text-center  rounded-md"
                          style={{ padding: '0' }}
                          onClick={() => dispatch(removeItem(index))}
                        >
                          {'Remove from Cart'}
                        </button>
                      </div>
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
            {(session && session.user.telephone!>"")?<PaymentForm
              applicationId={process.env.NEXT_PUBLIC_SQUARE_APLICATION_ID!}
              locationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
              //      createPaymentRequest={() => ({
              //       countryCode: "US",
              //       currencyCode: "USD",
              //       lineItems: [
              //         {
              //           amount: "22.15",
              //           label: "Item to be purchased",
              //           id: "SKU-12345",
              //           imageUrl: "https://url-cdn.com/123ABC",
              //           pending: true,
              //           productUrl: "https://my-company.com/product-123ABC"
              //         }
              //       ],
              //       taxLineItems: [
              //         {
              //           label: "State Tax",
              //           amount: "8.95",
              //           pending: true
              //         }
              //       ],
              //       discounts: [
              //         {
              //           label: "Holiday Discount",
              //           amount: "5.00",
              //           pending: true
              //         }
              //       ],
              //       requestBillingContact: false,
              //       requestShippingContact: false,
              //       shippingOptions: [
              //         {
              //           label: "Next Day",
              //           amount: "15.69",
              //           id: "1"
              //         },
              //         {
              //           label: "Three Day",
              //           amount: "2.00",
              //           id: "2"
              //         }
              //       ],
              //       // pending is only required if it's true.
              //       total: {
              //         amount: "41.79",
              //         label: "Total",
              //       },
              //     })}

              //      createVerificationDetails={() => ({
              //       amount: '1.00',
              //       /* collected from the buyer */
              //       billingContact: {
              //         addressLines: ['3040 Edwin Ave', 'Apt #2G'],
              //         familyName: 'Doe',
              //         givenName: 'John',
              //         countryCode: 'US',
              //         city: 'Fort Lee, NJ',
              //       },
              //       currencyCode: 'USD',
              //       intent: 'CHARGE',
              //     })}

              cardTokenizeResponseReceived={async (token, verifiedBuyer) => {
                setLoading(true);
                const response = await fetch('/api/payment', {
                  method: 'POST',
                  headers: {
                    'Content-type': 'application/json',
                  },
                  body: JSON.stringify({
                    sourceId: token.token,
                    currency: 'USD',
                    items: items,
                    userID: session?.user.id,
                    amount: items.reduce(function (acc, item) {
                      return acc + item.price;
                    }, 0),
                  }),
                });
                setLoading(false);
                // eventID Int
                const res = await response.json();
                setTransactionID(res.result.payment?.id);
                setVisibleModal(true);
              }}
            >
              <CreditCard />
            </PaymentForm>:
            <div className="w-full h-full flex flex-col justify-center items-center">
              <h2>To make purchases please {!session?<span><Link href='/signin' className="font-semibold text-franceBlue hover:uppercase">register</Link> or <Link href='/login' className="font-semibold text-franceBlue hover:uppercase">login</Link> and  provide a phone number so we can contact you</span>:session.user.telephone!>""?"":<span> update your phone number in <Link href='/profile' className="font-semibold text-franceBlue hover:uppercase">Profile</Link> so we can contact you</span>}!</h2>
              
            </div>}

            <div className="m-2">{'  '}</div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
