'use client';
import { FC, useEffect, useState } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import { PageWrapper } from '../../components/page-wrapper';
import ImgFromDb from '@/components/ImgFromDb';
import { useSession } from 'next-auth/react';
import AlertMenu from '@/components/alertMenu';
import { useDimensions } from '@/hooks/useDimensions';
interface pageProps {}
type Purchase = {
  activityID: number;
  amount: number;
  createdAt: string;
  date: string | null;
  eventtype: string;
  id: number;
  image: string;
  invoice: string;
  personNote: string | null;
  price: number;
  purchasedAt: string;
  seat: number | null;
  status: string;
  table: number | null;
  tag: string | null;
  userID: number | null;
};
const page: FC<pageProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [allPurchases, setAllPurchases] = useState<Purchase[]>([]);
  const [choosenUser, setChoosenUser] = useState<number>(0);
  const [revalUsersList, setRevalUsersList] = useState<boolean>(false);
  const [users, setUsers] = useState<
    {
      id: number | null;
      name: string | null;
      image: string | null;
      role: string;
      email: string;
    }[]
  >([]);
  const [revealAlert, setRevealAlert] = useState(false);
  const [scrolling, setScrolling] = useState(true);
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
  const onReturnAlert = (decision1: string, inputValue: string | null) => {
    setRevealAlert(false);
    console.log(decision1, inputValue);
    window.location.reload();
  };
  const statuses = ['Purchased', 'Used', 'Pending'];
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      // GET request
      fetch('/api/purchases', {
        cache: 'no-store',
        method: 'GET',
      }).then((res) => {
        res.json().then((data) => {
          console.log(data);
          if (data.purchases && session?.user.role !== 'Admin') {
            setPurchases(data.purchases);
          } else {
            if (session?.user.role == 'Admin') {
              console.log('Admin user');
              setAllPurchases(data.purchases);
              let users: number[] = [];
              let records: number[] = [];
              let usersArray: {
                id: number | null;
                name: string | null;
                image: string | null;
                role: string;
                email: string;
              }[] = [];

              for (let i = 0; i < data.purchases.length; i++) {
                if (data.purchases[i].userID !== null) {
                  if (!users.includes(data.purchases[i].userID)) {
                    users.push(data.purchases[i].userID);
                    records.push(i);
                  }
                }
              }
              for (let i = 0; i < records.length; i++) {
                usersArray.push(data.purchases[records[i]].user);
              }
              usersArray.push({
                id: null,
                name: 'Undefined User',
                image: null,
                role: 'None',
                email: 'none@a.com',
              });
              usersArray.sort((a: any, b: any) => {
                if (a.name > b.name) return 1;
                else if (a.name < b.name) return -1;
                else return 0;
              });
              setUsers([...usersArray]);
              console.log(usersArray);
            }
          }
        });
      });
    }
  }, [session]);
  useEffect(() => {
    let lastID = JSON.parse(localStorage.getItem('last_UserID')!);
    if ((lastID || lastID == null) && users.length > 0) {
      let lastID_Position = users.findIndex((user: any) => user.id == lastID);
      console.log(lastID_Position, users, lastID);
      setChoosenUser(lastID_Position);
      filterByUser(lastID);
      console.log('lastID', lastID);
    }
  }, [users]);
  const filterByUser = (id: number | null) => {
    let filteredPurchases: Purchase[] = [];
    for (let i = 0; i < allPurchases.length; i++) {
      if (allPurchases[i].userID == id) {
        filteredPurchases.push(allPurchases[i]);
      }
    }
    setPurchases(filteredPurchases);
  };
  useEffect(() => {
    document.getElementById('wrapperDiv')?.offsetHeight! -
      document.getElementById('containedDiv')?.offsetHeight! >
    0
      ? setScrolling(true)
      : setScrolling(false);
  }, [purchases, windowSize.height]);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {loading && <LoadingScreen />}
      {revealAlert && (
        <AlertMenu onReturn={onReturnAlert} styling={alertStyle} />
      )}
      <div className="   shadow-2xl w-[90%]  max-w-[1000px] md:w-full h-[70svh] md:h-[85svh] bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md border-0 rounded-md  p-2 mt-6">
        <div className="w-full h-full border rounded-md border-lightMainColor dark:border-darkMainColor flex flex-col justify-center items-center">
          <div className=" flex flex-col w-full h-full  p-1 justify-center items-center ">
            <h3 className="w-full uppercase xs:text-md sm:text-xl phone:text-2xl tablet:text-3xl text-center">
              Purchases
            </h3>
            {session?.user.role == 'Admin' && (
              <div className="w-full flex flex-col justify-start items-start p-1 relative">
                {users.length > 0 && (
                  <button
                    onClick={() => {
                      setRevalUsersList(true);
                    }}
                    className="bg-lightMainBG dark:bg-darkMainBG/70 text-lightMainColor dark:text-darkMainColor border border-lightMainColor dark:border-darkMainColor rounded-md min-w-fit flex flex-row justify-center items-center m-1 p-1"
                  >
                    <ImgFromDb
                      url={
                        users[choosenUser].image !== null
                          ? users[choosenUser].image!
                          : 'https://dance-at-le-pari.vercel.app/icon-72x72.png'
                      }
                      stylings="object-contain h-[80px] w-auto  rounded-md"
                      alt="Event Picture"
                    />
                    <h3 className="text-center min-w-fit m-1">
                      {users[choosenUser].name}{' '}
                    </h3>
                  </button>
                )}
                <div
                  className={`w-64 h-96 bg-lightMainBG z-20 dark:bg-darkMainBG border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-start items-start absolute left-0 top-28 ${
                    revalUsersList ? '' : 'hidden'
                  }`}
                >
                  <div className="w-full h-full relative flex overflow-y-auto">
                    <div className=" w-full flex flex-col absolute top-0 left-0">
                      {users.map((user, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            filterByUser(user.id);
                            setRevalUsersList(false);
                            setChoosenUser(index);
                          }}
                          className="bg-lightMainBG dark:bg-darkMainBG/70 text-lightMainColor dark:text-darkMainColor border border-lightMainColor dark:border-darkMainColor rounded-md min-w-fit flex flex-row justify-center items-center m-1 p-1"
                        >
                          <ImgFromDb
                            url={
                              user.image !== null
                                ? user.image
                                : 'https://dance-at-le-pari.vercel.app/icon-72x72.png'
                            }
                            stylings="object-contain h-[80px] w-auto  rounded-md"
                            alt="Event Picture"
                          />
                          <h3 className="text-center min-w-fit m-1">
                            {user.name}{' '}
                          </h3>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              id="wrapperDiv"
              className="w-full h-full border rounded-md border-lightMainColor dark:border-darkMainColor relative overflow-auto flex flex-col justify-center items-center"
            >
              <div
                id="containedDiv"
                className="absolute top-0 left-0 flex flex-col w-[900px] p-1 justify-center items-center "
              >
                {purchases
                  ? purchases.map((purchase, index) => (
                      <div
                        key={'purchase_' + index}
                        className="w-full flex flex-row justify-between items-center border-b border-lightMainColor dark:border-darkMainColor p-1"
                      >
                        <div className="flex flex-row items-center h-[150px] w-full">
                          <ImgFromDb
                            url={purchase.image}
                            stylings="object-contain h-[145px] w-auto max-w-[200px] rounded-md"
                            alt="Event Picture"
                          />
                          <div className="flex w-[50%] flex-col ml-2">
                            <h3 className="text-center font-bold uppercase">
                              {purchase.eventtype == 'Party'
                                ? 'Social Dancing Party'
                                : purchase.eventtype == 'Private'
                                ? 'Private Dance Lessons'
                                : purchase.eventtype == 'Group'
                                ? 'Group Classes'
                                : purchase.eventtype == 'Floor_Fee'
                                ? 'Floor Fees'
                                : ''}
                            </h3>
                            <p className="text-center">
                              Date:{' '}
                              {purchase.date
                                ? new Date(purchase.date!).toLocaleDateString(
                                    'en-us',
                                    {
                                      month: 'long',
                                      day: 'numeric',
                                      year: 'numeric',
                                    }
                                  ) +
                                  ' ' +
                                  new Date(purchase.date!).toLocaleTimeString(
                                    'en-US',
                                    {
                                      timeStyle: 'short',
                                    }
                                  )
                                : 'No Set Date'}
                            </p>
                            <p className="text-center">{purchase.tag}</p>
                            {purchase.personNote !== null &&
                              session?.user.role == 'Admin' && (
                                <p className="text-center">
                                  Special Note: {purchase.personNote}
                                </p>
                              )}
                            {purchase.table !== null &&
                              purchase.seat !== null && (
                                <p className="text-center">
                                  Table:{' '}
                                  {purchase.table < 12
                                    ? purchase.table + 1
                                    : purchase.table + 2}{' '}
                                  Seat:{' '}
                                  {purchase.seat < 12
                                    ? purchase.seat + 1
                                    : purchase.seat + 2}
                                </p>
                              )}
                          </div>
                        </div>
                        <div className="flex flex-col w-[33%] items-center">
                          <p className="text-center text-sm font-semibold">
                            Invoice: {purchase.invoice}{' '}
                          </p>
                          <p className="text-center">
                            Price & Quantity: {purchase.amount} x $
                            {purchase.eventtype == 'Party'
                              ? purchase.price
                              : (purchase.price / purchase.amount).toFixed(
                                  2
                                )}{' '}
                            = $
                            {purchase.eventtype == 'Party'
                              ? purchase.amount * purchase.price
                              : purchase.price}
                          </p>
                          {session?.user.role == 'Admin' ? (
                            <div>
                              <select
                                className="bg-main-bg m-2 rounded-md bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
                                value={purchase.status}
                                onChange={(e) => {
                                  e.preventDefault();
                                  console.log(
                                    statuses[parseInt(e.target.value)]
                                  );
                                  console.log(purchase);
                                  localStorage.setItem(
                                    'last_UserID',
                                    JSON.stringify(purchase.userID)
                                  );
                                  console.log(purchase.id);
                                  fetch('/api/admin/update_purchase_status', {
                                    method: 'PUT',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      id: purchase.id,
                                      status: e.target.value,
                                    }),
                                  })
                                    .then((response) => response.json())
                                    .then((data) => {
                                      console.log(data);
                                      setAlertStyle({
                                        variantHead: 'info',
                                        heading: 'Information',
                                        text: 'Successfully update the purchase status!',
                                        color1: 'success',
                                        button1: 'Return',
                                        color2: '',
                                        button2: '',
                                        inputField: '',
                                      });
                                      setRevealAlert(true);
                                      // if (data.status == 201) {
                                      //   let purchases1=purchases
                                      //   purchases1.filter(p => p.id == purchase.id)[0].status = e.target.value
                                      //   setPurchases(purchases1)

                                      // }
                                    });
                                }}
                              >
                                {statuses.map((option, index) => (
                                  <option key={'Status' + index} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <p className="text-center">
                              Status: {purchase.status}{' '}
                            </p>
                          )}
                          <p className="text-center">
                            Purchased at:{' '}
                            {purchase.purchasedAt
                              ? new Date(
                                  purchase.purchasedAt
                                ).toLocaleDateString('en-us', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                }) +
                                ' ' +
                                new Date(
                                  purchase.purchasedAt
                                ).toLocaleTimeString('en-US', {
                                  timeStyle: 'short',
                                })
                              : ''}{' '}
                          </p>
                        </div>
                      </div>
                    ))
                  : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
