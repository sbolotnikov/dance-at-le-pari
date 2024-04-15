'use client';
import ImgFromDb from './ImgFromDb';
import ShowIcon from './svg/showIcon';

interface UserType {
  user: {
    name: string;
    email: string;
    role: string;
    image: string;
    id: number;
  };
  delUser: (id: number, name: string) => void;
  updateImg: (id: number, image: string) => void;
}
function UserForm(props: UserType) {
  console.log(props.user);
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
    <div className="w-full relative flex flex-row justify-between flex-wrap mb-10 mx-2">
      <div className="flex flex-row items-center cursor-pointer" onClick={(e)=>{e.preventDefault(); props.updateImg(props.user.id, props.user.image!)}}>
      {props.user.image ? (
        <ImgFromDb
          url={props.user.image}
          stylings="h-12"
          alt={`user {$props.user.name} image`}
        />
      ) : (
        <div className=" h-10 w-10 md:h-12 md:w-12 fill-none stroke-lightMainColor dark:stroke-darkMainColor ">
          <ShowIcon icon={'DefaultUser'} stroke={'2'} />
        </div>
      )}
      </div>
      <h3 className="mx-1">{props.user.name}</h3>
      <h3>
        {'<'}
        {props.user.email}
        {'>'}
      </h3>
      <select
        className="bg-main-bg m-2 rounded-md bg-menuBGColor text-darkMainColor dark:text-menuBGColor dark:bg-darkMainColor"
        value={props.user.role}
        onChange={changeStatus}
      > 
        <option value="Student">Student</option>
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
  );
}

export default UserForm;
