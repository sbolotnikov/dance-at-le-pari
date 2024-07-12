'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AnimateModalLayout from './AnimateModalLayout';
import { useDimensions } from '@/hooks/useDimensions';
import { ContactType } from '@/types/screen-settings';
import ContactEditingForm from './ContactEditingForm';
import AlertMenu from './alertMenu';
import ShowIcon from './svg/showIcon';
import sleep, { csvJSON } from '@/utils/functions';

type Props = {
  visibility: boolean;
  onReturn: () => void;
};

const EditContactsModal = ({ visibility, onReturn }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [one, setOne] = useState(0);
  const [two, setTwo] =useState(0)
  const [users, setUsers] = useState<ContactType[]>([]);
  const [newUsers, setNewUsers] = useState<ContactType[]>([]);
  const dimensions = useDimensions();
  const [revealAlert, setRevealAlert] = useState(false);
  const [newContact, setNewContact] = useState(false);
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
  const [selectedId, setSelectedId] = useState(0);

  if (session?.user.role !== 'Admin') {
    router.push('/');
  }
  const handleDelete = (id: number, name: string) => {
    console.log(id);
    setSelectedId(id);
    setAlertStyle({
      variantHead: 'danger',
      heading: 'Warning!',
      text: `Are you sure about deleting record of ${name}?`,
      color1: 'danger',
      button1: 'Confirm',
      color2: 'secondary',
      button2: 'Cancel',
      inputField: '',
    });
    setRevealAlert(true);
  };

  useEffect(() => {
    // GET request
    fetch('/api/admin/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'Subscribed',
      }),
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
        let dataArray = data.sort((a: ContactType, b: ContactType) =>
          a.name + ' ' + a.lastname > b.name + ' ' + b.lastname
            ? 1
            : b.name + ' ' + b.lastname > a.name + ' ' + a.lastname
            ? -1
            : 0
        );
        setUsers(data);
        console.log(data);
      });
    });
   
  }, []);

  useEffect(() => {
    let secondIndex=0
    if (newUsers.length > 0) { 
        for (let i = 0; i < newUsers.length; i++) {
          if (newUsers.filter(user=>user.email===newUsers[i].email).length>1) {
            secondIndex=newUsers.map(user=>user.email).indexOf(newUsers[i].email,i+1);
            console.log(newUsers[i],newUsers[secondIndex]);
            // console.log(newUsers.filter(user=>user.email===newUsers[i].email));
            setOne(i);
            setTwo(secondIndex)
            setAlertStyle({
              variantHead: 'danger',
              heading: `Email ${newUsers[i].email} already exists`,
              text: `Choose 1: ${newUsers[i].name} ${newUsers[i].lastname} ${newUsers[i].telephone1} ${newUsers[i].telephone2} or 2: ${newUsers[secondIndex].name} ${newUsers[secondIndex].lastname}  ${newUsers[secondIndex].telephone1} ${newUsers[secondIndex].telephone2}`,
              color1: 'danger',
              button1: '1',
              color2: 'secondary',
              button2: '2',
              inputField: '',
            });
            setRevealAlert(true);
            return; 
          }
        }
      
        fetch('/api/admin/contacts_import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify( newUsers),
        }).then((data) => {
          setNewContact(false);
          console.log(data.json());
          setNewUsers([]);
          setAlertStyle({
            variantHead: 'success',
            heading: `Good job!`,
            text: `Email list has been uploaded`,
            color1: 'success',
            button1: 'Ok',
            color2: '',
            button2: '',
            inputField: '',
          });
          sleep(1000).then(()=>setRevealAlert(true))
        }).catch((err) => {
          console.log(err);
          setAlertStyle({
            variantHead: 'danger',
            heading: `Something went wrong`,
            text: ``,
            color1: 'danger',
            button1: 'Ok',
            color2: '',
            button2: '',
            inputField: '',
          });
          sleep(1000).then(()=>setRevealAlert(true))
        })

      }
  }, [newUsers.length]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    let file1 = e.currentTarget.files![0];

    const reader = new FileReader();
    reader.onload = (function (file) {
      return function () {
        let res = this.result?.toString(); 
        setNewUsers(csvJSON(res as string, "'", ','));       
      };
    })(file1);
    reader.readAsText(file1);
  };
  const onReturnAlert = (decision1: string) => {
    setRevealAlert(false);
    sleep(1000).then(()=>{
    if (decision1 == 'Confirm') {
      fetch('/api/admin/contacts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedId,
        }),
      }).then(() => {
        location.reload();
      });
    }else if (decision1 == "1"){
      let arrNew=newUsers.filter((user, index)=>index!==two);
      setNewUsers([...arrNew]);

    }else if (decision1 == "2"){
      let arrNew2=newUsers.filter((user, index)=>index!==one);
      setNewUsers([...arrNew2]);
    } else setSelectedId(0);
  })
  };
  return (
    <div className="absolute inset-0 ">
      <AnimateModalLayout
        visibility={visibility}
        onReturn={() => {
          onReturn();
        }}
      >
        <div
          className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1170px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
        }`}
        >
          <div
            id="wrapperDiv"
            className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
          >
            <div
              id="containedDiv"
              className={`absolute top-0 left-0 flex flex-col w-full p-1 justify-center items-center`}
            >
              <h2
                className="text-center font-semibold md:text-4xl uppercase"
                style={{ letterSpacing: '1px' }}
              >
                Edit Contacts Modal
              </h2>
              <div className="flex flex-row w-full justify-center items-center">
                <div className="group flex  cursor-pointer  flex-col justify-center items-center relative  mb-3">
                  <div className="  h-10 w-10 md:h-20 md:w-20 relative hover:scale-110 group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor">
                    <div
                      className="cursor-pointer h-10 w-10 md:h-14 md:w-14 border-2 rounded-full  bg-editcolor m-auto "
                      onClick={(e) => {
                        e.preventDefault();
                        setNewContact(true);
                      }}
                    >
                      <ShowIcon icon={'Plus'} stroke={'0.1'} />
                    </div>
                  </div>
                  <p className=" tracking-widest transition duration-300 ease-in-out absolute leftt-0 -bottom-2 md:-bottom-1 rounded-md text-center text-editcolor text-[6px] md:text-base md:dark:bg-darkMainBG      group-hover:inline-flex  ">
                    Add New
                  </p>
                </div>
                <div className="group flex  cursor-pointer  flex-col justify-center items-center relative  mb-3">
                  <div className="  h-10 w-10 md:h-20 md:w-20 relative hover:scale-110 group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor">
                    <div
                      className="cursor-pointer h-10 w-10 md:h-14 md:w-14 border-2 rounded-full m-auto "
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('inputField2')!.click()
                      }}
                    >
                      <ShowIcon icon={'ImportData'} stroke={'0.1'} />
                    </div>
                  </div>
                  <p className=" tracking-widest transition duration-300 ease-in-out absolute leftt-0 -bottom-2 md:-bottom-1 rounded-md text-center text-lightMainColor dark:text-darkMainColor text-[6px] md:text-base dark:bg-darkMainBG      group-hover:inline-flex  ">
                    Import
                  </p>
                </div>
                <div className="group flex  cursor-pointer  flex-col justify-center items-center relative  mb-3">
                  <div className="  h-10 w-10 md:h-20 md:w-20 relative hover:scale-110 group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor">
                    <div
                      className="cursor-pointer h-10 w-10 md:h-14 md:w-14 border-2 rounded-full m-auto "
                      onClick={(e) => {
                        e.preventDefault();
                        setNewContact(true);
                      }}
                    >
                      <ShowIcon icon={'ExportCSV'} stroke={'0.1'} />
                    </div>
                  </div>
                  <p className=" tracking-widest transition duration-300 ease-in-out absolute leftt-0 -bottom-2 md:-bottom-1 rounded-md text-center text-lightMainColor dark:text-darkMainColor text-[6px] md:text-base dark:bg-darkMainBG      group-hover:inline-flex  ">
                    Export
                  </p>
                </div>
                <input
                type="file"
                id="inputField2"
                hidden
                accept="*.csv"
                className="w-full mb-2 rounded-md text-gray-700"
                onChange={handleChange}
              />
              </div>
              {dimensions.height && (
                <div
                  id="userContainer"
                  className="w-[95%] border-2 rounded-md overflow-y-scroll"
                  style={{ height: `${dimensions.height - 200}px` }}
                >
                  {users &&
                    users.map((item, index) => {
                      return (
                        <ContactEditingForm
                          key={'userN' + index}
                          editable={selectedId == item.id}
                          contact={item}
                          onDelete={handleDelete}
                          onEdit={(id: number) => setSelectedId(id)}
                          onSubmit={(updatedContact: ContactType) => {
                            let oldContact = users.find(
                              (contact: ContactType) =>
                                contact.id === updatedContact.id
                            ) as ContactType;
                            let updateObj: Partial<ContactType> = {};
                            for (let key in updatedContact) {
                              if (
                                (updatedContact as any)[key] !==
                                (oldContact as any)[key]
                              ) {
                                (updateObj as any)[key] = (
                                  updatedContact as any
                                )[key];
                              }
                            }

                            if (Object.keys(updateObj).length === 0) return;
                            console.log(updateObj);
                            fetch('/api/admin/contacts', {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                id: updatedContact.id,
                                ...updateObj,
                              }),
                            }).then((data) => {
                              console.log(data);
                              setSelectedId(0);
                            });
                          }}
                        />
                      );
                    })}
                  {newContact && (
                    <ContactEditingForm
                      editable={true}
                      contact={{
                        id: 0,
                        name: '',
                        email: '',
                        lastname: '',
                        telephone1: '',
                        telephone2: '',
                        labels: null,
                        createdAt: new Date(),
                        status: 'Subscribed',
                        lastactivity: null,
                        lastcontact: null,
                      }}
                      onDelete={() => setNewContact(false)}
                      onEdit={(id: number) => setSelectedId(0)}
                      onSubmit={(newContact: ContactType) => {
                        console.log(newContact);
                        fetch('/api/admin/contact_create', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({
                            name: newContact.name,
                            lastname: newContact.lastname,
                            email: newContact.email,
                            telephone1: newContact.telephone1,
                            telephone2: newContact.telephone2,
                            source:"manual input"
                          }),
                        }).then((data) => {
                          setNewContact(false);
                          console.log(data.json());
                          setSelectedId(0);
                        }).catch((err) => {
                          console.log(err);
                        })
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </AnimateModalLayout>
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturnAlert}
        styling={alertStyle}
      />
    </div>
  );
};

export default EditContactsModal;
