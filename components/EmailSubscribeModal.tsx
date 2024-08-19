'use client';

import AnimateModalLayout from '@/components/AnimateModalLayout'; 
import React, { useEffect, useState  } from 'react';

type Props = {
  vis: boolean;
  userEmail: string | undefined;
  onClose: () => void;
};

const EmailSubscribeModal = ({ vis, userEmail, onClose }: Props) => {
  const [email1, setEmail1] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [error1, setError1] = useState(false); 
  const [message, setMessage] = useState(''); 
  const isEmailValid = (st: string) => {
    const emailRegex = new RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'gm'
    );
    return emailRegex.test(st);
  }; 
   useEffect(() => {
    if (userEmail) {
      setEmail1(userEmail);
    }
  }, [userEmail]);
  return (
    <AnimateModalLayout
      visibility={vis}
      onReturn={() => {
        onClose();
      }}
    >
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[800px]  flex justify-center items-center flex-col bg-lightMainBG dark:bg-darkMainBG h-[70svh]
      }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1  overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`absolute inset-0 flex flex-col w-full p-1 justify-center items-center`}
          >
            <h1 className="text-center font-DancingScript text-franceBlue" style={{ fontSize: `45px`, lineHeight: '0.75' }}>Please subscribe to our newsletter</h1>
            <p className={`text-center text-lg text-${error1?"alertcolor":"editcolor"}`}>
              {message}</p> 
              <label className=" w-full m-2 flex justify-center items-center"> Enter First Name</label>
              <input
              type="text"
              value={name}
              onChange={(e) =>{setError1(false);  setMessage(''); setName(e.target.value);}}
              className="w-[90%] "
            /> 
            <label className=" w-full m-2 flex justify-center items-center"> Enter Last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) =>{setError1(false); setMessage(''); setLastname(e.target.value);}}
              className="w-[90%]"
            /> 
            <label className=" w-full m-2 flex justify-center items-center"> Enter Email</label>
            <input
              type="email"
              value={email1}
              onChange={(e) =>{setError1(false);  setMessage(''); setEmail1(e.target.value);}}
              className="w-[90%]"
            />
          
          <div
            className="btnFancy"
            onClick={async () => {
              if (isEmailValid(email1)) {
                const res = await fetch('/api/subscriber_add', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    email: email1,
                    name: name,
                    lastname: lastname,
                  }),
                });
                if (res.status === 200) {
                  setError1(false);
                  const data = await res.json();
                  setMessage(data.message);
                   
                } else {
                  setError1(true);
                  const data = await res.json();
                  setMessage(data.message);
                }
              } else {
                setError1(true);
                setMessage ('Please enter a valid email address')
              }
            }}
          >
            Subscribe
          </div>
          </div>
        </div>
      </div>
    </AnimateModalLayout> 
  );
};

export default EmailSubscribeModal;
