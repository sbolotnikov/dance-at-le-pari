'use client'
import { useState, useEffect } from 'react';
import UserForm from '@/components/userForm';
import AlertMenu from '@/components/alertMenu';

interface UserType {
    name:string;
    email:string;
    role:string;
    image:string;
    id:number}

function page() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [usersType, setUsersType] = useState("All");
  const [usersDisplay, setUsersDisplay] = useState<UserType[]>([]);
  const [revealAlert, setRevealAlert] = useState(false);
  const [alertStyle, setAlertStyle] = useState({
    variantHead: '',
    heading: '',
    text: ``,
    color1: '',
    button1: '',
    color2: '',
    button2: '',
    inputField:""
  });
  const [selectedId, setSelectedId] = useState(0);
  const [style1, setStyle1] = useState({ display: 'none' });
  var filtersArray = [["All",""],["Users","User"], ["Administarors","Admin"] ]

  useEffect(() => {
    // GET request
     fetch('/api/admin/users', {
    cache:'no-store'
    }).then((res) => {
        res.json().then (data => {
            console.log(data)
            setUsers(data);
            setUsersDisplay(data)
        });     
    })


  }, []);
  const handleDelete=(id:number, name:string)=>{
      console.log(id)
      setSelectedId(id);
      setAlertStyle({
        variantHead: 'danger',
        heading: 'Warning!',
        text: `Are you sure about deleting record of ${name}?`,
        color1: 'danger',
        button1: 'Confirm',
        color2: 'secondary',
        button2: 'Cancel',
        inputField:""
      });
      setRevealAlert(true);
  }
  const onReturn = (decision1:string) => {
    setRevealAlert(false);
    if (decision1 == 'Confirm') {
      fetch('/api/admin/del_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id:selectedId,
        }),
      }).then(()=>{
        window.location.reload()
      })
      ;
    }else setSelectedId(0);
}
  return (
    <div className="w-full flex justify-center items-center">
        {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />}
        
      <div className="w-full max-w-[1000px] flex flex-row justify-center items-center flex-wrap">
        <h3 className="w-full xs:text-md sm:text-xl phone:text-2xl tablet:text-3xl text-center">
          Table of project Users's Roles
          </h3>
          <h5 className="w-full xs:text-md sm:text-lg phone:text-xl tablet:text-2xl text-center"> filter:
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
              className="absolute top-8 right-0 bg-menuBGColor   border rounded-md z-[1000] w-full shadow-inner flex flex-col justify-center items-center flex-wrap "
            >
              <div className="w-auto  p-0.5 m-1">
                { filtersArray.map((item, index) => {
                  return (
                    
                      <h3 key={`usertype__${index}`} data-id={item[1]} onClick={(e: React.SyntheticEvent<EventTarget>)=>{
                        e.preventDefault();
                        if (!(e.target instanceof HTMLElement)) {
                            return;
                          }
                          console.log(e.target.innerHTML)
                        setUsersType(e.target.innerHTML)
                        let groupID=e.target.dataset.id
                          if (groupID=="") setUsersDisplay(users)
                        else setUsersDisplay(users.filter(user=>user.role==groupID)) 
                    }}>
                      {item[0]}
                    </h3> 
                    
                  );
                })}
              </div>
            </div>
          </div>
        </h5>
        {usersDisplay &&
            usersDisplay.map((item, index) => {
              return (
                <UserForm
                  key={'userN' + index}
                  user={item}
                  delUser={handleDelete}
                />
              )
            })
            }

      </div>
    </div>
  );
}
                  
export default page;

