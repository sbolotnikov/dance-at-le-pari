'use client';
import ImgFromDb from './ImgFromDb';
import ShowIcon from './svg/showIcon';
import { useState, useRef } from 'react';

interface UserType {
  user: {
    name: string;
    email: string;
    role: string;
    image: string;
    color?: string;
    id: number;
    bio?:string;
  };
  delUser: (id: number, name: string) => void;
  updateImg: (id: number, image: string) => void;
  updateName: (id: number, name: string) => void;
  updateBio: (id: number, bio: string) => void;
}
function UserForm(props: UserType) { 
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isBioVisible, setIsBioVisible] = useState(false);
  const [bioLocal, setBioLocal] = useState(props.user.bio);
  const userNameRef = useRef<HTMLInputElement>(null);
  const userBioRef = useRef<HTMLTextAreaElement>(null);
  const changeStatus = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    if (!(e.target instanceof HTMLSelectElement)) {
      return;
    }
    console.log(e.target.value, props.user.id);
    const res = await fetch('/api/admin/status_update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selectedId: props.user.id,
        status: e.target.value,
      }),
    });
    console.log(res);
    location.reload();
  };
  const handleDelete = () => {
    props.delUser(props.user.id, props.user.name);
  };
  return (
    <div className="w-full relative flex flex-row justify-center items-center flex-wrap mb-10 mx-2">
      <div className="flex flex-row justify-between items-center w-80 md:w-[22rem]">
        <div
          className="flex flex-row items-center cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            props.updateImg(props.user.id, props.user.image!);
          }}
        >
          
          <div className="w-20 md:w-24  flex flex-row justify-center items-center">
            {' '}
            {props.user.image ? (
              <ImgFromDb
                url={props.user.image}
                stylings="h-10 w-10 md:h-12 md:w-12"
                alt={`user {$props.user.name} image`}
              />
            ) : (
              <div className=" h-10 w-10 md:h-12 md:w-12 fill-none stroke-lightMainColor dark:stroke-darkMainColor ">
                <ShowIcon icon={'DefaultUser'} stroke={'2'} />
              </div>
            )}
          </div>
        </div>
        {props.user.color && (
          <div className="h-8 w-8 rounded-full overflow-hidden border-none relative">
            <input
              className=" outline-none h-10 w-10  absolute -top-1 -left-1  border-none "
              name="color"
              id="color"
              type="color"
              value={props.user.color}
              onChange={async (e) => {
                console.log(e.target.value);
                const res = await fetch('/api/admin/color_update', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    selectedId: props.user.id,
                    color: e.target.value,
                  }),
                });
                console.log(res);
                location.reload();
              }}
            />
          </div>
        )}

        <div className="w-52 flex flex-row justify-around items-center">
          <select
            className="bg-main-bg m-2 rounded-md bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
            value={props.user.role}
            onChange={changeStatus}
          >
            <option value="User">User</option>
            <option value="Owner">Owner</option>
            <option value="Student">Student</option>
            <option value="OutTeacher">Outside Teacher</option>
            <option value="Teacher">Teacher</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            className=" p-2   flex justify-center  items-center"
            onClick={handleDelete}
          >
            <div className=" h-6 w-6 md:h-8 md:w-8 fill-alertcolor stroke-alertcolor ">
              <ShowIcon icon={'Close'} stroke={'2'} />
            </div>
          </button>
        </div>
      </div>
      {!isEditVisible ? (
        <h3
          className="mx-1 w-80  flex flex-col items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            setIsEditVisible(true);
          }}
        >
          <div className="cursor-pointer w-full text-center">
            {props.user.name}
          </div>
          <div className="w-full text-center">
            {'<'}
            {props.user.email}
            {'>'}
          </div>
        </h3>
      ) : (
        <input
          name="user_name"
          id="user_name"
          className="w-80 outline-none bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor border-none rounded-md p-0.5 mx-1 my-1"
          type="text"
          placeholder="Enter Name"
          defaultValue={props.user.name}
          onBlur={(e) => {
            e.preventDefault();
            setIsEditVisible(false);
            if (
              userNameRef.current!.value !== '' &&
              userNameRef.current!.value !== props.user.name
            )
              props.updateName(props.user.id, userNameRef.current!.value!);
          }}
          ref={userNameRef}
        />
      )}
      {bioLocal ? (!isBioVisible ? (
        <h3
          className="mx-1 w-80 h-24 overflow-y-auto  text-center relative"
          onClick={(e) => {
            e.preventDefault();
            setIsBioVisible(true);
          }}
        ><div className='w-full absolute top-0 left-0 text-center'>{bioLocal}</div>
       </h3>):(
        <textarea
          name="user_bio"
          id="user_bio"
          className="w-80 outline-none bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor border-none rounded-md p-0.5 mx-1 my-1"
          placeholder="Enter Bio"
          rows={4}
          defaultValue={bioLocal}
          onBlur={(e) => {
            e.preventDefault();
            setIsBioVisible(false);
            if (
              userBioRef.current!.value !== '' &&
              userBioRef.current!.value !== bioLocal
            ) 
            props.updateBio(props.user.id, userBioRef.current!.value!);
            setBioLocal(props.user.bio);
          }}
          ref={userBioRef}
        />
      )):(<button className='btnFancySmall' onClick={(e)=>{e.preventDefault();setBioLocal("Enter New Bio here..."); setIsBioVisible(true);}}> Add Bio</button>)}   
    </div>
  );
}

export default UserForm;
