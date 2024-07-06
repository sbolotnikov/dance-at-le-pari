'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AnimateModalLayout from './AnimateModalLayout';
import { useDimensions } from '@/hooks/useDimensions';
import { ContactType } from '@/types/screen-settings';
import ContactEditingForm from './ContactEditingForm';
import AlertMenu from './alertMenu';

type Props = {
  visibility: boolean;
  onReturn: () => void;
};

const EditContactsModal = ({ visibility, onReturn }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [users, setUsers] = useState<ContactType[]>([]);
  const dimensions = useDimensions();
  const [revealAlert, setRevealAlert] = useState(false);
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
    // setDimensions({ height: window.innerHeight, width: window.innerWidth });
    // document.getElementById('userContainer')?.style({height:`[${window.innerHeight-100}px]`});
  }, []);
  const onReturnAlert = (decision1: string) => {
    setRevealAlert(false);
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
    } else setSelectedId(0);
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
              <label className="flex flex-col items-center w-full">
                {' '}
                Email Title{' '}
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor w-full p-1 rounded-md"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label className="flex flex-col items-center w-full">
                {' '}
                Transform link for sharing{' '}
                <input
                  type="text"
                  placeholder="Title"
                  value={value}
                  className="dark:bg-lightMainBG bg-darkMainBG dark:text-lightMainColor text-darkMainColor w-full p-1 rounded-md"
                  onChange={(e) =>
                    setValue(
                      `https://drive.google.com/thumbnail?id=${
                        e.target.value.split('/file/d/')[1].split('/')[0]
                      }&sz=w1000`
                    )
                  }
                />
                <div className=" w-full">{value}</div>
              </label>
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
                          onEdit={(id:number) => setSelectedId(id)}
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
                          />)})}
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
