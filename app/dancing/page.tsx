'use client';
import { FC, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useSession } from 'next-auth/react';
import PaymentPageForm from '@/components/PaymentPageForm';
import { TPaymentType } from '@/types/screen-settings';
import EventTemplateEditingForm from '@/components/EventTemplateEditingForm';
import AlertMenu from '@/components/alertMenu';
import PDFDisplay from '@/components/PDFDIsplay';
import { useDispatch} from "react-redux"
import { addItem } from "../../slices/cartSlice";
import sleep from '@/utils/functions';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { data: session } = useSession();
  const [tabIndex, setTabIndex] = useState(0);
  const [templateID, setTemplateID] = useState(-1);
  const [revealTemplateEdit, setRevealTemplateEdit] = useState(false);
  const [products, setProducts] = useState<TPaymentType[]>([]);
  const [specialEvents, setSpecialEvents] = useState<TPaymentType[]>([]);
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
  const tabsIndexArray = ['Private', 'Group', 'Floor_Fee', 'Party'];
  const actionTemplateChoice = (action1: string, item: number) => {
    if (action1 == 'Edit') {
      setTemplateID(item);
      setRevealTemplateEdit(true);
    }
    if (action1 == 'Add') {
      setTemplateID(item);
      setRevealTemplateEdit(true);
    }
    if (action1 == 'Book') {
      console.log(item, products)
      const productToCart= products.find((product)=>product.id === item)
        const p1 = {
          id:item,
          image:productToCart?.image?productToCart?.image:'',
          eventtype:productToCart?.eventtype?productToCart?.eventtype:'',
          tag:productToCart?.tag?productToCart?.tag:'',
          price:productToCart?.price?productToCart?.price:0,
          amount:productToCart?.amount?productToCart?.amount:0,
        }
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
        window.location.reload();
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
        if ((data.length > 0)&&(tabsArray.indexOf('Special Events')==-1)) {
          setTabsArray((prev) => [...prev, 'Special Events']);
          setSpecialEvents(data);
                    }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);  
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
        if (session?.user.role !== 'Admin') {
          setProducts(
            data.products.filter((product: any) => product.visible == true)
          );
        } else setProducts(data.products);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [session?.user.role!]);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />}
      {revealPDF && <PDFDisplay onReturn={()=>{setRevealPDF(false)}} />}
      {revealTemplateEdit == true ? (
        <EventTemplateEditingForm
        
          onReturn={() =>{
            sleep(1200).then(() => {
              setRevealTemplateEdit(false)
            }); 
            
          }}
          template={templateID}
        />
      ) : (
        <div
          className="border-0 rounded-md p-2  shadow-2xl w-[95%] h-[70svh] md:h-[85%] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md"
          // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
        >
          <Tabs
            selectedIndex={tabIndex}
            className="w-full h-full border rounded-md border-lightMainColor dark:border-darkMainColor"
            onSelect={(index: number) => setTabIndex(index)}
          >
            <TabList className="flex flex-row justify-start items-start flex-wrap rounded-t-md  dark:bg-lightMainBG  bg-darkMainBG">
              {tabsArray.map((item, index) => {
                return (
                  <Tab
                    key={item}
                    className={` mt-1 p-1 cursor-pointer outline-0 ${
                      tabIndex != index
                        ? 'w-12 truncate'
                        : 'border-2 md:border-4 border-yellow-600 text-yellow-600 dark:border-yellow-600 dark:text-yellow-600'
                    } rounded-t-lg   text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG`}
                  >
                    {item}
                  </Tab>
                );
              })}
            </TabList>
            <div className="w-full flex justify-center items-center">
              <button
                className=" btnFancy mx-auto text-base text-center  rounded-md"
                style={{ padding: '0' }}
                onClick={() => setRevealPDF(true)}
              >
                Terms & Conditions here:
              </button>
            </div>
            {tabsIndexArray.map((item, index) => {
              return (
                <TabPanel
                key={item+index}
                  className={`w-full h-[95%] flex flex-col justify-center items-center ${
                    tabIndex != index ? 'hidden' : ''
                  }`}
                >
                  {products.length > 0 && (
                    <PaymentPageForm
                      paymentsArray={products.filter(
                        (product) => product.eventtype == item
                      )}
                      role={session?.user.role!}
                      specialEvent={false}
                      onReturn={(item1, action1) => {
                        actionTemplateChoice(action1, item1);
                      }}
                    />
                  )}
                </TabPanel>
              );
            })}
            {(tabsArray.indexOf('Special Events')!=-1)&&
            <TabPanel className={`w-full h-[95%] flex flex-col justify-center items-center ${
                    tabIndex != 4 ? 'hidden' : ''
                  }`}>
 {specialEvents.length > 0 && (
                    <PaymentPageForm
                      paymentsArray={specialEvents}
                      role={"None"}
                      specialEvent={true}
                      onReturn={(item1, action1) => {
                        window.location.replace('/events/'+item1);
                      }}
                    />
                  )}






            </TabPanel>
}
          </Tabs>
        </div>
      )}
    </PageWrapper>
  );
};

export default page;
