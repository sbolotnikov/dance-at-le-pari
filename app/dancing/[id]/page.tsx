'use client';
import { useContext, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useSession } from 'next-auth/react';
import PaymentPageForm from '@/components/PaymentPageForm';
import { ScreenSettingsContextType, TPaymentType } from '@/types/screen-settings';
import EventTemplateEditingForm from '@/components/EventTemplateEditingForm';
import AlertMenu from '@/components/alertMenu'; 
import  PDFDisplay  from "@/components/PDFDIsplay" ;
import { useDispatch } from 'react-redux';
import { addItem } from '../../../slices/cartSlice';
import { useDimensions } from '@/hooks/useDimensions';
import sleep from '@/utils/functions';
import ShowIcon from '@/components/svg/showIcon';
import { useRouter } from 'next/navigation';
import SharePostModal from '@/components/SharePostModal';
import BannerGallery from '@/components/BannerGallery';
import { SettingsContext } from '@/hooks/useSettings';
interface pageProps {}

export default function Page({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [templateID, setTemplateID] = useState(-1);
  const [revealTemplateEdit, setRevealTemplateEdit] = useState(false);
  const [revealSharingModal, setRevealSharingModal] = useState(false);
  const [products, setProducts] = useState<TPaymentType[]>([]);
  const [specialEvents, setSpecialEvents] = useState<TPaymentType[]>([]);
  const { events } = useContext(
    SettingsContext
  ) as ScreenSettingsContextType;
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
  const [revealAlert, setRevealAlert] = useState(false);
  const [revealPDF, setRevealPDF] = useState(false);
  const [tabsArray, setTabsArray] = useState([
    'Private Lessons',
    'Group Classes',
    'Floor Fees',
    'Dance Parties',
  ]);
  const dispatch = useDispatch();
  const router = useRouter();

  const tabsIndexArray = ['Private', 'Group', 'Floor_Fee', 'Party'];
  const slugArray = [
    'private-lessons',
    'group_classes',
    'floor_fees',
    'parties',
    // 'special_events',
  ];
  const pageArray = [{title:'Page: Private Lessons Packages | Activities | Dance at Le Pari Studio',description:'Private Dance Instructions Packages. All studio activities may be paid online. Dance at Le Pari Privacy policy may be found in the link below. ', keywords: 'private lessons, lessons packages, dance lessons packages, wedding dance packages'},
    { title: 'Page: Group Classes| Activities | Dance at Le Pari Studio', description: 'Group classes and group packages. All studio activities may be paid online. Dance at Le Pari Privacy policy may be found in the link below.',keywords: 'group dance lessons, group classes packages, group lessons packages, group classes lessons'},
    { title: 'Page: Floor Fees | Activities | Dance at Le Pari Studio', description:'Floor fees for outside dance instructors. All studio activities may be paid online. Dance at Le Pari Privacy policy may be found in the link below. ', keywords:'floor fees, rent dance space, teach dance lessons, outside dance teachers'},
    { title: 'Page: Parties or Socials | Activities | Dance at Le Pari Studio', description: 'Social Dancing Parties. All studio activities may be paid online. Dance at Le Pari Privacy policy may be found in the link below.', keywords: 'dance party, socials, dance social events, ballroom social'},
    // { title: 'Page: Special Dance Socials | Activities | Dance at Le Pari Studio', description: 'Special Dance Events at Dance at Le Pari. All studio activities may be paid online. Dance at Le Pari Privacy policy may be found in the link below.', keywords:'special dance events, dance parties, dance events, ballroom social'}
  ];
  console.log(params.id) 
  const selectedTab = slugArray.indexOf(params.id);
  const tabIndex =
    (selectedTab !== null && selectedTab >= 0 && selectedTab < 5)
      ? selectedTab
      : 0;
  const actionTemplateChoice = (
    action1: string,
    item: number,
    option: number | null
  ) => {
    if (action1 == 'Edit') {
      setTemplateID(item);
      setRevealTemplateEdit(true);
    }
    if (action1 == 'Add') {
      setTemplateID(item);
      setRevealTemplateEdit(true);
    }
    if (action1 == 'Book') {
      console.log(item, products);
      const productToCart = products.find((product) => product.id === item);
      console.log('choice', productToCart, option);
      const p1 = {
        id: item,
        image: productToCart?.image ? productToCart?.image : '',
        eventtype: productToCart?.eventtype ? productToCart?.eventtype : '',
        tag: productToCart?.tag ? productToCart?.tag : '',
        price: productToCart?.options
          ? productToCart?.options[option!].price
          : 0,
        amount: productToCart?.options
          ? productToCart?.options[option!].amount
          : 0,
        seat: null,
        table: null,
        date: null,
      };
      dispatch(addItem(p1));
    }
    if (action1 == 'Delete') {
      setTemplateID(item);
      setAlertStyle({
        variantHead: 'danger',
        heading: 'Warning',
        text: 'You are about to Delete this Service!',
        color1: 'danger',
        button1: 'Delete',
        color2: 'secondary',
        button2: 'Cancel',
        inputField: '',
      });
      setRevealAlert(true);
    }
  };

  const onReturn = async (decision1: string, amount: string | null) => {
    setRevealAlert(false);
    if (decision1 === 'Delete') {
      fetch('/api/admin/del_event_template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: templateID,
        }),
      }).then(() => {
        location.reload();
      });
    }
  };
  useEffect(() => {
    fetch('/api/get_special_events', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.length > 0 && tabsArray.indexOf('Special Events') == -1) {
          setTabsArray((prev) => [...prev, 'Special Events']);
          setSpecialEvents(
            data.sort((a: any, b: any) => {
              if (a.price > b.price) return 1;
              else if (a.price < b.price) return -1;
              else return 0;
            })
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const windowSize = useDimensions();
  useEffect(() => {
    fetch('/api/get_products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let prodArr = [];
        if (session?.user.role !== 'Admin') {
          prodArr = data.products.filter(
            (product: any) => product.visible == true
          );
        } else prodArr = data.products;
        prodArr.sort((a: any, b: any) => {
          if (a.id > b.id) return 1;
          else if (a.id < b.id) return -1;
          else return 0;
        });
        setProducts(prodArr);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [session?.user.role!]);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex flex-col items-center  justify-start">
      <div className="w-full h-1/5 relative overflow-auto mt-1 md:mt-6  rounded-md">
        {events != undefined && (
          <BannerGallery
            events={[
              ...events,
              {
                date: '',
                tag: 'Give a Gift of Dance!',
                id: '/gift',
                image: '/images/couple.webp',
                eventtype: '',
              },
              {
                date: '',
                tag: 'Subscribe to our Newsletter!',
                id: '/subscribeemaillist',
                image: '/images/gotmail.jpg',
                eventtype: '',
              },
            ]}
            seconds={10}
          />
        )}
      </div>
      <SharePostModal
        title={pageArray[tabIndex].title}
        url={process.env.NEXT_PUBLIC_URL + '/dancing/'+params.id}
        quote={pageArray[tabIndex].description}
        hashtag={pageArray[tabIndex].keywords}
        onReturn={() => setRevealSharingModal(false)}
        visibility={revealSharingModal}
      />    
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturn}
        styling={alertStyle}
      />
      {revealPDF && (
        <PDFDisplay
        onReturn={() => {
          sleep(1200).then(() => {
            setRevealPDF(false);
          });
        }} 
        />
      )}
      {revealTemplateEdit == true ? (
        <EventTemplateEditingForm
          onReturn={() => {
            sleep(1200).then(() => {
              setRevealTemplateEdit(false);
            });
          }}
          template={templateID}
        />
      ) : (
        <div className="blurFilter border-0 rounded-md p-2  shadow-2xl w-[95%] h-[70svh] md:h-[85svh] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 md:mb-3">
          <Tabs
            selectedIndex={tabIndex}
            className="w-full h-full flex flex-col border rounded-md relative border-lightMainColor dark:border-darkMainColor"
            onSelect={(index: number) => router.push(`/dancing/${slugArray[index]}`)}
          >
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Activities
            </h2>
            <div className=" h-16 w-16 m-auto">
              <ShowIcon icon={'Activities'} stroke={'0.1'} />
            </div>
            <div className="w-full  flex justify-center items-center">
              <h2 className="text-center font-semibold md:text-sm italic">
                All prices include credit card fees
              </h2>
              <button
                className=" btnFancy mx-auto text-base text-center w-28 rounded-md absolute top-0 left-0"
                style={{ padding: '0', margin: '5px 5px' }}
                onClick={() => setRevealPDF(true)}
              >
                Terms & Conditions
              </button>
              <button
                className=" outline-none border-none absolute right-0 top-0  rounded-md  mt-2  w-8 h-8"
                onClick={(e) => {
                  e.preventDefault();
                  setRevealSharingModal(!revealSharingModal);
                  return;
                }}
              >
                <ShowIcon icon={'Share'} stroke={'2'} />
              </button>
            </div>
            <TabList
              className="h-[2.43rem] w-full  flex flex-row justify-between items-start flex-wrap rounded-t-md  dark:bg-lightMainBG  bg-darkMainBG"
              style={{
                backgroundImage:
                  'linear-gradient(0deg, rgba(63, 62, 211,0.2) 0%, rgba(63, 62, 211,0.2) 16.667%,rgba(73, 92, 210,0.2) 16.667%, rgba(73, 92, 210,0.2) 33.334%,rgba(101, 183, 208,0.2) 33.334%, rgba(101, 183, 208,0.2) 50.001%,rgba(92, 153, 209,0.2) 50.001%, rgba(92, 153, 209,0.2) 66.668%,rgba(82, 122, 209,0.2) 66.668%, rgba(82, 122, 209,0.2) 83.335%,rgba(111, 213, 207,0.2) 83.335%, rgba(111, 213, 207,0.2) 100.002%),linear-gradient(45deg, rgba(63, 62, 211,0.2) 0%, rgba(63, 62, 211,0.2) 16.667%,rgba(73, 92, 210,0.2) 16.667%, rgba(73, 92, 210,0.2) 33.334%,rgba(101, 183, 208,0.2) 33.334%, rgba(101, 183, 208,0.2) 50.001%,rgba(92, 153, 209,0.2) 50.001%, rgba(92, 153, 209,0.2) 66.668%,rgba(82, 122, 209,0.2) 66.668%, rgba(82, 122, 209,0.2) 83.335%,rgba(111, 213, 207,0.2) 83.335%, rgba(111, 213, 207,0.2) 100.002%),linear-gradient(90deg, rgba(63, 62, 211,0.2) 0%, rgba(63, 62, 211,0.2) 16.667%,rgba(73, 92, 210,0.2) 16.667%, rgba(73, 92, 210,0.2) 33.334%,rgba(101, 183, 208,0.2) 33.334%, rgba(101, 183, 208,0.2) 50.001%,rgba(92, 153, 209,0.2) 50.001%, rgba(92, 153, 209,0.2) 66.668%,rgba(82, 122, 209,0.2) 66.668%, rgba(82, 122, 209,0.2) 83.335%,rgba(111, 213, 207,0.2) 83.335%, rgba(111, 213, 207,0.2) 100.002%),linear-gradient(90deg, rgb(118, 34, 211),rgb(55, 13, 228))',
              }}
            >
              {tabsArray.map((item, index) => {
                return (
                  <Tab
                    key={item}
                    style={{
                      width:
                        windowSize.width! < 640 && tabIndex != index
                          ? windowSize.width! < 434
                            ? windowSize.width! < 350
                              ? '1.7rem'
                              : '2.8rem'
                            : '4rem'
                          : 'fit-content',
                    }}
                    className={` mt-1 p-1 cursor-pointer outline-0 border ${
                      tabIndex != index
                        ? ` truncate `
                        : 'border-2 md:border-4 border-yellow-600 text-yellow-600 dark:border-yellow-600 dark:text-yellow-600'
                    } rounded-t-lg   text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG`}
                  >
                    {item}
                  </Tab>
                );
              })}
            </TabList>
            {tabsIndexArray.map((item, index) => {
              return (
                <TabPanel
                  key={item + index}
                  className={`w-full  flex relative overflow-y-scroll ${
                    tabIndex != index ? 'hidden' : ''
                  }`}
                  style={{ flex: '1 1 100%' }}
                >
                  {products.length > 0 && (
                    <PaymentPageForm
                      paymentsArray={products.filter(
                        (product) => product.eventtype == item
                      )}
                      role={session?.user.role!}
                      specialEvent={false}
                      onReturn={(item1, action1, option) => {
                        actionTemplateChoice(action1, item1, option);
                      }}
                    />
                  )}
                </TabPanel>
              );
            })}
            {tabsArray.indexOf('Special Events') != -1 && (
              <TabPanel
                className={`w-full  flex relative overflow-y-scroll ${
                  tabIndex != 4 ? 'hidden' : ''
                }`}
                style={{ flex: '1 1 100%' }}
              >
                {specialEvents.length > 0 && (
                  <PaymentPageForm
                    paymentsArray={specialEvents}
                    role={'None'}
                    specialEvent={true}
                    onReturn={(item1, action1) => {
                      router.replace('/events/' + item1);
                    }}
                  />
                )}
              </TabPanel>
            )}
          </Tabs>
        </div>
      )}
    </PageWrapper>
  );
}
