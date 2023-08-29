'use client'
import React, {FC} from 'react'
import { useRef, useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AlertMenu from '../../components/alertMenu';
import ShowIcon from '@/components/svg/showIcon';
import Loading from '@/components/Loading';
import ChooseAvatar from '@/components/chooseAvatar';
import { deleteImage } from '@/utils/picturemanipulation';
import ImgFromDb from '@/components/ImgFromDb';

  
interface pageProps {
  
}

const page: FC<pageProps> = () => {
    const { data: session } = useSession();
    let user={image:"",name:"",telephone:"", email:""}
  
  const emailRef =  useRef<HTMLInputElement>(null);
  const passwordRef =  useRef<HTMLInputElement>(null);
  const userNameRef =  useRef<HTMLInputElement>(null);

  const passwordConfirmRef =  useRef<HTMLInputElement>(null);
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
  const [loading, setLoading] = useState(false);
  // const [toRoot, setToRoot] = useState(false);
  const [revealCloud, setRevealCloud] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!session) router.replace('/')
    if (session?.user.name) userNameRef.current!.value=session?.user.name;
    if (session?.user.telephone) setPhone(session?.user.telephone);
    if (session?.user.email) emailRef.current!.value=session?.user.email;

  }, [session]);
  const [userURL, setUserURL] = useState(session?.user.image);
  const [phone, setPhone] = useState((session?.user.telephone)?session?.user.telephone:'');
   
  
  const onReturn =  (decision1:string) => {
    setRevealAlert(false);
    if (decision1 == 'Close') {
    }
    if (decision1 == 'Re-enter') {
      setLoading(true);
      signOut();
      setLoading(false);
    }
  };
  const onReturnAvatar =  (decision1:string, fileLink:string) => {
    setRevealCloud(false);
    if (decision1 == 'Close') {
      
      console.log(decision1)
    }
    if (decision1 == 'Upload') {
      console.log("file link", fileLink);
      setUserURL(fileLink);
    }
  };
  const handleSubmit=
  (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target1 = event.target as typeof event.target & {
      user_name: { value: string };
      user_email: { value: string };
      password: { value: string };
      passwordConfirm: { value: string };
      telephone: { value: string };
    }; 
    const name = target1.user_name.value; // typechecks!
    const email = target1.user_email.value;
    const password = target1.password.value;
    const passwordConfirm = target1.passwordConfirm.value;
    const telephone= target1.telephone.value;
   

    let validationError="";
    document.querySelector("#user_name")!.classList.remove("invalid_input");       
    document.querySelector("#user_email")!.classList.remove("invalid_input");
    document.querySelector("#password")!.classList.remove("invalid_input");
    document.querySelector("#passwordConfirm")!.classList.remove("invalid_input");
    document.querySelector("#telephone")!.classList.remove("invalid_input");        
    // submitting profile updated information
    if (name.length<3) {
      validationError ="User Name is too short";
     // make name input red
     document.querySelector("#user_name")!.classList.add("invalid_input");
   }
   else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
     validationError ="Enter a valid email";
    // make email input red
    document.querySelector("#user_email")!.classList.add("invalid_input");
  }
   else if ((password.length < 6)&&(password.length > 0)) {
     validationError ="Password is too short. 6 or more symbols";
    // make message input red
    document.querySelector("#password")!.classList.add("invalid_input");
  } 
  else if (password !== passwordConfirm) {
    validationError ="Password did not match";
   // make message input red
   document.querySelector("#password")!.classList.add("invalid_input");
   document.querySelector("#passwordConfirm")!.classList.add("invalid_input");
 }
if (validationError>""){
   setAlertStyle({
         variantHead: 'danger',
         heading: "Warning",
         text: validationError,
         color1: 'warning',
         button1: "Close",
         color2: '',
         button2: '',
         inputField:""
       });
       setRevealAlert(true); 
       return;
     }

    setLoading(true);
console.log(passwordRef.current?.value)
    fetch('/api/profile_update', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userNameRef.current?.value,
        id: session?.user.id,
        image: userURL,
        email: emailRef.current?.value,
        phone,
        password: passwordRef.current?.value,
      }),
    }).then(async(res) => {
      let dbStoragePath=process.env.NEXT_PUBLIC_SUPABASE_URL!+'/storage/v1/object/public/images/'
      if ((session?.user.image)&&(session?.user.image>"")){
        let oldFilename = session?.user.image.replace(dbStoragePath, "");
      }
      if ((userURL!= session?.user.image)&&(session?.user.image!=null)&&(!session?.user.image!.includes("http"))){
        const delObj= await deleteImage(session?.user.image!)
        console.log(delObj) 
      }
      if (res.status === 200) {
        setLoading(false);
        setAlertStyle({
          variantHead: 'info',
          heading: 'Message',
          text: 'You successfully updated your Profile. Please login to continue.',
          color1: 'secondary',
          button1: 'Re-enter',
          color2: '',
          button2: '',
          inputField:""
        });
        
        setRevealAlert(true);
        console.log(res);
      }
    });
  }
return <div className="w-full flex justify-center items-center">
      {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />}
      {revealCloud && <ChooseAvatar onReturn={onReturnAvatar} styling={alertStyle} />}
      {loading && <Loading />}
      <div
        className="border-0 rounded-md  max-auto p-4 shadow-2xl max-w-[450px] w-full m-3"
        // style={{ boxShadow: '0 0 150px rgb(255 236 0 / 50%)'}}
      >
        <h2
          className="text-center fw-bolder text-uppercase"
          style={{   letterSpacing: '1px' }}
        >
          Your's {session?.user.role} Profile
          <div className="relative flex justify-center items-center outline-none border rounded-md w-24 p-4 my-6 mx-auto">
            {((userURL !== null)&&(userURL !== undefined)) ? (
             
              <ImgFromDb url={userURL} stylings="object-contain"  alt="User Picture" />
            ) : (
              <div className=" h-8 w-8 md:h-10 md:w-10 fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor ">
                      <ShowIcon icon={'DefaultUser'} stroke={'2'}/>
                    </div>
            )}
            <button className=" outline-none border-none fill-lightMainColor  stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor rounded-md  absolute p-1 -top-3 -right-3 w-8 h-8"
            onClick={(e) => {
                e.preventDefault();
                setAlertStyle({
                  variantHead: 'danger',
                  heading: "Warning",
                  text: "You are about to Upload New Avatar Image",
                  color1: 'info',
                  button1: "Upload",
                  color2: 'secondary',
                  button2: 'Cancel',
                  inputField:''
                }); 
                setRevealCloud(!revealCloud);
                return;

                
              }}
            >
              <ShowIcon icon={'Plus'}  stroke={'2'}/>
            </button>
          </div>
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="flex flex-col items-center p-3 rounded-t-md bottom-0">
            Your Name:
            <input
              name="user_name"
              id="user_name"
              className="flex-1 outline-none bg-menuBGColor border-none rounded-md p-0.5 mx-1 my-1"
              type="text"
              placeholder="Enter Name"
              ref={userNameRef}
            />
          </label>

          <label className="flex flex-col items-center p-3  rounded-t-md bottom-0">
            Email Address
            <input
              name="user_email"
              id="user_email"
              className="flex-1 outline-none bg-menuBGColor border-none rounded-md -bg p-0.5 mx-1 my-1"
              type="email"
              ref={emailRef}
              required
            />
                      
          </label>
          <label className="flex flex-col items-center p-3  rounded-t-md bottom-0">
            Password
            <input
              className="flex-1 outline-none bg-menuBGColor border-none rounded-md  p-0.5 mx-1 my-1"
              name="password"
              id="password"
              type="password"
              ref={passwordRef}
              placeholder="leave blank if not needed to change"
              
            />
          </label>
          <label className="flex flex-col items-center p-3  rounded-t-md bottom-0">
            Confirm Password
            <input
              className="flex-1 outline-none bg-menuBGColor border-none rounded-md  p-0.5 mx-1 my-1"
              name="passwordConfirm"
              id="passwordConfirm"
              type="password"
              ref={passwordConfirmRef}
              placeholder="leave blank if not needed to change"
            />
          </label>
          <label className="flex flex-col items-center p-3  rounded-t-md bottom-0">
            Telephone:
            <input
              className="flex-1 outline-none bg-menuBGColor border-none rounded-md bg-main-bg p-0.5 mx-1 my-1"
              name="telephone"
              id="telephone"
              type="tel"
              placeholder="1234567890"
              required
              minLength={13}
              maxLength={13}
              onChange={(e) => {
                setPhone(e.target.value.slice(3));
              }}
              value={'+1 ' + phone}
            />
          </label>
          <button
            disabled={loading}
            className="btnFancy"
            style={{ width: '100%', margin: '2% auto' }}
            type="submit"
          >
            Update
          </button>
        </form>

      
      </div>
</div>

}
export default page