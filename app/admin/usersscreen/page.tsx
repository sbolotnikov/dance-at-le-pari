'use client';
import { useState, useEffect } from 'react';
import UserForm from '@/components/userForm';
import AlertMenu from '@/components/alertMenu';
import { PageWrapper } from '@/components/page-wrapper';
import ChooseAvatar from '@/components/chooseAvatar';
import { deleteImage } from '@/utils/picturemanipulation';
import { useDimensions } from '@/hooks/useDimensions';
import CreateEmailModal from '@/components/EditContactsModal';
import sleep from '@/utils/functions';
import ShowIcon from '@/components/svg/showIcon';
import { useRouter } from 'next/navigation';

interface UserType {
  name: string;
  email: string;
  role: string;
  image: string;
  id: number;
}
interface DimentionsType {
  width: number;
  hight: number;
}
function page() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [usersType, setUsersType] = useState('All');
  const [usersDisplay, setUsersDisplay] = useState<UserType[]>([]);
  const [revealAlert, setRevealAlert] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBio, setNewBio] = useState('');
  const [revealAvatarSelect, setRevealAvatarSelect] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType>({} as UserType);
  const router = useRouter();
  // const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const dimensions = useDimensions();

  console.log(dimensions);
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
  const [style1, setStyle1] = useState({ display: 'none' });
  var filtersArray = [
    ['All', ''],
    ['Users', 'User'],
    ['Students', 'Student'],
    ['Outside Teacher','OutTeacher'],
    ['Teachers', 'Teacher'],
    ['Administarors', 'Admin'],
  ];

  useEffect(() => {
    // GET request
    fetch('/api/admin/users', {
      cache: 'no-store',
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
        let dataArray = data.sort((a: UserType, b: UserType) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
        setUsers(data);
        setUsersDisplay(data);
      });
    }); 
  }, []);
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
  const handleImgUpdate = (id: number, img: string) => {
    console.log(id, img);
    setAlertStyle({
      variantHead: 'danger',
      heading: 'Warning',
      text: 'You are about to Upload New Avatar Image',
      color1: 'info',
      button1: 'Upload',
      color2: 'secondary',
      button2: 'Cancel',
      inputField: '',
    });
    setRevealAvatarSelect(true);
    setSelectedUser(users.filter((user) => user.id === id)[0]);
  };

  const handleNameUpdate =(id: number, name: string) => {
    setSelectedId(id);
    setNewName(name);
    setAlertStyle({
      variantHead: 'danger',
      heading: 'Warning!',
      text: `Are you sure about change user's name to ${name}?`,
      color1: 'danger',
      button1: 'Update',
      color2: 'secondary',
      button2: 'Cancel',
      inputField: '',
    });
    setRevealAlert(true);
  };
  const handleBioUpdate =(id: number, bio: string) => {
    setSelectedId(id);
    setNewBio(bio);
    setAlertStyle({
      variantHead: 'danger',
      heading: 'Warning!',
      text: `Are you sure about changing user's bio?`,
      color1: 'danger',
      button1: 'Update Bio',
      color2: 'secondary',
      button2: 'Cancel',
      inputField: '',
    });
    setRevealAlert(true);
  };  

  const onReturn = (decision1: string) => {
    setRevealAlert(false);
    if (decision1 == 'Confirm') {
      fetch('/api/admin/del_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedId,
        }),
      }).then(() => {
        location.reload();
      });
    }else if (decision1 == 'Update'){
      fetch('/api/admin/upd_user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedId,
          name: newName,
        }),
      }).then(() => {
        location.reload();
      });
    }else if (decision1 == 'Update Bio'){
      fetch('/api/admin/upd_user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedId,
          bio: newBio,
        }),
      }).then(() => {
        location.reload();
      });
    }   else setSelectedId(0);
  };
  const onReturnAvatar = (decision1: string, fileLink: string) => {
    setRevealAvatarSelect(false);
    if (decision1 == 'Close') {
      console.log(decision1);
    }
    if (decision1 == 'Upload') {
      console.log('file link', fileLink);

      fetch('/api/admin/profile_img_update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedId: selectedUser.id,
          image: fileLink,
        }),
      }).then(async (res) => {
        if (
          selectedUser.image != null &&
          !selectedUser.image!.includes('http')
        ) {
          const delObj = await deleteImage(selectedUser.image);
          console.log(delObj);
        }
        if (res.status === 200) {
          setAlertStyle({
            variantHead: 'info',
            heading: 'Message',
            text: 'You successfully updated Record. Please login to continue.',
            color1: 'secondary',
            button1: 'Ok',
            color2: '',
            button2: '',
            inputField: '',
          });

          setRevealAlert(true);
          console.log(res);
        }
      });
    }
  };
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturn}
        styling={alertStyle}
      />
      {revealAvatarSelect && (
        <ChooseAvatar
          onReturn={onReturnAvatar}
          styling={alertStyle}
          extraSize={true}
        />
      )}
      <div className="blurFilter border-0 rounded-md p-2 mt-6 shadow-2xl w-[95%] h-[70svh] md:h-[85svh] max-w-[1400px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 md:mb-3">
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full   p-2 flex flex-col relative">
          <h2
            className="text-center font-semibold text-2xl md:text-4xl uppercase"
            style={{ letterSpacing: '1px' }}
          >
            User's List
          </h2>
          <div className=" h-16 w-16 m-auto hidden md:block">
            <ShowIcon icon={'Users'} stroke={'0.1'} />
          </div>
           
          <h5 className="w-full xs:text-md sm:text-lg phone:text-xl tablet:text-2xl text-center">
            {' '}
            Table of project Users's Roles
            <div
              className="relative cursor-pointer"
              onMouseEnter={(e) => {
                setStyle1({ display: 'block' });
              }}
              onMouseLeave={(e) => {
                setStyle1({ display: 'none' });
              }}
            >
              {usersType}
              <div
                style={style1}
                className="absolute top-8 right-0 bg-menuBGColor   border rounded-md z-[1000] w-[98%] shadow-inner flex flex-col justify-center items-center flex-wrap "
              >
                <div className="w-auto  p-0.5 m-1">
                  {filtersArray.map((item, index) => {
                    return (
                      <h3
                        key={`usertype__${index}`}
                        data-id={item[1]}
                        onClick={(e: React.SyntheticEvent<EventTarget>) => {
                          e.preventDefault();
                          if (!(e.target instanceof HTMLElement)) {
                            return;
                          }
                          console.log(e.target.innerHTML);
                          setUsersType(e.target.innerHTML);
                          let groupID = e.target.dataset.id;
                          if (groupID == '') setUsersDisplay(users);
                          else
                            setUsersDisplay(
                              users.filter((user) => user.role == groupID)
                            );
                        }}
                      >
                        {item[0]}
                      </h3>
                    );
                  })}
                </div>
              </div>
            </div>
          </h5>
          {dimensions.height && (
            <div
              id="userContainer"
              className="w-[95%] border-2 rounded-md overflow-y-scroll"
              style={{ height: `${dimensions.height - 200}px` }}
            >
              {usersDisplay &&
                usersDisplay.map((item, index) => {
                  return (
                    <UserForm
                      key={'userN' + index}
                      user={item}
                      delUser={handleDelete}
                      updateImg={handleImgUpdate}
                      updateName={handleNameUpdate}
                      updateBio={handleBioUpdate}
                    />
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

export default page;
