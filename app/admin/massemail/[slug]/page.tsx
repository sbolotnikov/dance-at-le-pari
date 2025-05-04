'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useSession } from 'next-auth/react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import sleep, { isEmailValid, save_Template } from '@/utils/functions';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import EditContactsModal from '@/components/EditContactsModal';
import { useDimensions } from '@/hooks/useDimensions';
import LoadingScreen from '@/components/LoadingScreen'; 
import ShowSendingEmailResultsModal from '@/components/ShowSendingEmailResultsModal'; 
type Props = {
  params: { slug: string };
};

export default function Page(params: { params: { slug: string } }) {
  const slug = params.params.slug;
  const { data: session, status } = useSession(); 
  const router = useRouter();
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [vis, setVis] = useState(false);
  const [vis2, setVis2] = useState(false);
  const [revealModal, setRevealModal] = useState(false);
  const [revealModal1, setRevealModal1] = useState(false);
  const [sendingStatus, setSendingStatus] = useState<string[]>([]);
  const dimensions = useDimensions();
  useEffect(()=>{
    if (slug=='1') setRevealModal(true);
  },[slug])
  if (status === 'unauthenticated') {
    router.push('/');
  }

  //   const handleSubmit = async () => {
  //     console.log(title, value, session?.user?.id);

  //     console.log(value.replace(/<[^>]*>/g, ''));
  //   };
  const emailEditorRef = useRef<EditorRef>(null);

  const exportHtml = (firstEmail:string) => {
    fetch('/api/admin/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'Subscribed',
      }),
    }).then((res) => {
      res
        .json()
        .then((data) => {
          let contacts = data;
          let name1 = '' as string;
          let emailList = [] as { name: string; email: string }[];
          const unlayer = emailEditorRef.current?.editor;
          setRevealModal1(true);
          unlayer?.exportHtml((data) => {
            const { html } = data;

            for (let i = 0; i < contacts.length; i++) {
              name1 = contacts[i].name != null ? contacts[i].name + ' ' : '';
              name1 += contacts[i].lastname != null ? contacts[i].lastname : '';
              if (name1.trim().length == 0) name1 = 'Sir/Madam';
              emailList.push({ name: name1, email: contacts[i].email });
             
            }
            emailList =emailList.sort((a, b) => (a.email > b.email) ? 1 : ((b.email > a.email) ? -1 : 0))
            if (firstEmail.length > 0) {
             let index = emailList.findIndex(contact => contact.email === firstEmail);
             console.log(index)
             if (index !== -1) {
              emailList=emailList.slice(index);
             }
            }
            console.log(emailList)
            sendConsecativeEmails(emailList,html,[] as string[],1,1);
        
            
          }); 
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  const sendConsecativeEmails = async(emailList:{ name: string; email: string }[],html:any, sentEmails:string[],counter:number,errNumber:number) => {
    if (emailList.length === 0) {
      let el = sentEmails.filter(a =>!a.includes("Sent successfully")).map(a=>a.split(" ")[3]);
            console.log(el)
      setSendingStatus([...sentEmails,'Not Send: '+el]);
      console.log(sentEmails)
      // setRevealModal1(false);
    } else {
    const { name, email } = emailList.shift()!;
    console.log(email, isEmailValid(email));
    if (isEmailValid(email)) {    
     fetch('/api/admin/email_mass_send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        message: html,
        email: email,
        name: name,
      }),
     })
      .then(async (res) => {
        const data = await res.json();
        setSendingStatus([...sentEmails,  (sentEmails.length+1)+'. Sent successfully '+email]); 
        await sleep(3000);
        sendConsecativeEmails(emailList,html,[...sentEmails, (sentEmails.length+1)+'. Sent successfully '+email],1,1)
      })
      .catch(async (err) => {
        
        // console.log("batch size: ",counter,". ",errNumber*60,'seconds wait error, email:', email);
          // await sleep(3000);
          
          // emailList.push({ name, email });
          setSendingStatus([...sentEmails,(sentEmails.length+1)+'. Failed_to_send_email to ' + email,]); 
          sendConsecativeEmails(emailList,html,[...sentEmails, (sentEmails.length+1)+'. Failed_to_send_email to ' + email],1,errNumber+1);
      });
    }
    else{
    setSendingStatus([...sentEmails,  (sentEmails.length+1)+'. Wrong email '+email+' . Skipped']);
    sendConsecativeEmails(emailList,html,[...sentEmails,(sentEmails.length+1)+'. Wrong email ' + email+' . Skipped'],1,1);
    }
    }
  }
  const sendTestEmail = (email: string) => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data) => {
      const { html } = data;
      console.log('exportHtml', html);

      fetch('/api/admin/email_test_send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          message: html,
          email,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          console.log(data);
        })
        .catch(async (err) => {
          console.log(err);
        });
    });
  };
  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
    // const templateJson = { DESIGN JSON GOES HERE };
    // unlayer.loadDesign(templateJson);
  };
  const saveDesign = () => {
    const unlayer = emailEditorRef.current?.editor;
    unlayer?.exportHtml((data) => {
      const { design } = data;
      save_Template(JSON.stringify(design), 'email template');
      console.log('saveDesign', JSON.stringify(design));
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    let file1 = e.currentTarget.files![0];

    const reader = new FileReader();
    reader.onload = (function (file) {
      return function () {
        let res = this.result?.toString();
        const unlayer = emailEditorRef.current?.editor;
        unlayer?.loadDesign(JSON.parse(res !== undefined ? res : ''));
      };
    })(file1);
    reader.readAsText(file1);
  };

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center md:items-end justify-center">
      {revealModal && (
        <EditContactsModal
          visibility={revealModal}
          onReturn={(mode) => {
            if (mode == 0)
              sleep(1200).then(() => {
                setRevealModal(false);
              });
            if (mode == 1) {
              setLoading(true);
            }
            if (mode == 2) setLoading(false);
          }}
        />
      )}
      {revealModal1 && (
        <ShowSendingEmailResultsModal
          visibility={revealModal1}
          status={sendingStatus}
          onReturn={() => {
            sleep(1200).then(() => {
              setRevealModal1(false);
            });
          }}
        />
      )}
      {loading && <LoadingScreen />}
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1124px]  flex justify-center items-center flex-col  bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
        }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1 overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`absolute top-0 left-0 bottom-0 right-0 flex flex-col p-1 justify-center items-center`}
          >
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Email Marketing
            </h2>

            <div className="group flex  cursor-pointer  flex-col justify-center items-center  absolute right-10 top-1">
              <div className="  h-10 w-10 md:h-14 md:w-14 relative hover:scale-110 group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor">
                <div
                  className="cursor-pointer h-10 w-10 md:h-14 md:w-14 border-2 rounded-md m-auto "
                  onClick={(e) => {
                    e.preventDefault();
                    setRevealModal(true);
                  }}
                >
                  <ShowIcon icon={'MailList'} stroke={'0.1'} />
                </div>
              </div>
              <p className=" tracking-widest transition duration-300 ease-in-out absolute leftt-0 -bottom-2 md:-bottom-4  rounded-md text-center text-lightMainColor dark:text-darkMainColor text-[6px] md:text-base dark:bg-darkMainBG      group-hover:inline-flex  ">
                Contacts
              </p>
            </div>
            {dimensions.height! > 600 && (
              <div
                id="icon"
                className=" h-20 w-20 md:h-28 md:w-28 fill-lightMainColor stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto"
              >
                <ShowIcon icon={'MassEmail'} stroke={'0.1'} />
              </div>
            )}
            <label
              className={`flex flex-col items-center w-[95%] ${
                dimensions.height! < 600 ? 'mt-2' : ''
              }`}
            >
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
            <label className="flex flex-col items-center w-[95%]">
              {' '}
              Transform link for sharing{' '}
              <input
                type="text"
                placeholder="Enter link here"
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
            <div className="w-full">
              <button className="btnFancy" onClick={ () => setVis2(true)}>
                Send Emails
              </button>
              <button className="btnFancy" onClick={() => setVis(true)}>
                Send test Email
              </button>
              <button className="btnFancy" onClick={saveDesign}>
                Save Design
              </button>
              <button
                className="btnFancy"
                onClick={() => document.getElementById('inputField1')!.click()}
              >
                Load Design
              </button>
              <input
                type="file"
                id="inputField1"
                hidden
                accept="text/*"
                className="w-full mb-2 rounded-md text-gray-700"
                onChange={handleChange}
              />
            </div>
            {vis && (
              <label className="flex flex-row items-center">
                Email
                <input
                  className="flex-1 outline-none border-none rounded-md   text-lightMainColor p-0.5 mx-1"
                  id="email"
                  type="email"
                  required
                />
                <button
                  className="btnFancy"
                  onClick={() => {
                    setVis(false);
                    let email = (
                      document.getElementById('email') as HTMLInputElement
                    ).value;
                    if (isEmailValid(email)) sendTestEmail(email);
                    else alert('Invalid email');
                  }}
                >
                  Send
                </button>
              </label>
            )}
                        {vis2 && (
              <label className="flex flex-row items-center">
                Start Emailing from:
                <input
                  className="flex-1 outline-none border-none rounded-md   text-lightMainColor p-0.5 mx-1"
                  id="email2"
                  type="email"
                  required
                />
                <button
                  className="btnFancy"
                  onClick={() => {
                    setVis2(false);
                    let email = (
                      document.getElementById('email2') as HTMLInputElement
                    ).value;
                    if (isEmailValid(email)) exportHtml(email);
                    else exportHtml("");
                  }}
                >
                  Send
                </button>
              </label>
            )}
            <div className='w-full h-full flex justify-center items-center'>
            <EmailEditor ref={emailEditorRef} onReady={onReady} />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
