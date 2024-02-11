'use client';
import { FC, useEffect, useState } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useSession } from 'next-auth/react';
import PaymentPageForm from '@/components/PaymentPageForm';
import { TPaymentType } from '@/types/screen-settings';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { data: session } = useSession();
  const [tabIndex, setTabIndex] = useState(0);
  const [products, setProducts] = useState<TPaymentType[]>([]);
  const tabsArray = ["Private Lessons","Group Classes","Floor Fees"]
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
        setProducts(data.products)  
      }).catch((error) => {console.log(error);})
  }, []);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {/* {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />} */}
      <div
        className="border-0 rounded-md p-4  shadow-2xl w-[95%] h-[85vh] max-w-5xl md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md"
        // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
      >
        <Tabs
          selectedIndex={tabIndex}
          className="w-full h-full border rounded-lg"
          onSelect={(index: number) => setTabIndex(index)}
        >
          <TabList className="flex flex-row justify-start items-start flex-wrap rounded-t-lg  dark:bg-lightMainBG  bg-darkMainBG">
            {tabsArray.map((item, index) => {
              return (
                <Tab
                  key={item}
                  className={`mx-0.5 mt-1 p-2 outline-0 ${
                    tabIndex != index ? '' : 'border-2 md:border-4 border-yellow-600 text-yellow-600 dark:border-yellow-600 dark:text-yellow-600'
                  } rounded-t-lg   text-lightMainColor bg-lightMainBG dark:text-darkMainColor dark:bg-darkMainBG`}
                >
                  {item}
                </Tab>
              );
            })}
          </TabList>
          <TabPanel
            className={`w-full h-[95%] flex flex-col justify-center items-center ${tabIndex != 0 ? 'hidden' : ''}`}
          >
            {(products.length>0) &&<PaymentPageForm  paymentsArray={products.filter((product) =>product.eventtype=="Private")} role={session?.user.role!}  onReturn={(item, action1 )=>{
              console.log(action1, item)
            }}/>}
           
          </TabPanel>
          <TabPanel
            className={`w-full h-[95%] flex justify-center items-center  ${tabIndex != 1 ? 'hidden' : ''}`}
          >
            {(products.length>0) &&<PaymentPageForm  paymentsArray={products.filter((product) =>product.eventtype=="Group")} role={session?.user.role!}  onReturn={(item, action1 )=>{
              console.log(action1, item)
            }}/>}

          </TabPanel>
          <TabPanel
            className={`w-full h-[95%] flex justify-center items-center  ${tabIndex != 2 ? 'hidden' : ''}`}
          >
            {(products.length>0) &&<PaymentPageForm  paymentsArray={products.filter((product) =>product.eventtype=="Floor_Fee")} role={session?.user.role!}  onReturn={(item, action1 )=>{
              console.log(action1, item)
            }}/>}
          </TabPanel>
        </Tabs>
      </div>
    </PageWrapper>
  );
};

export default page;
