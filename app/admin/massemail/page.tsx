'use client';

import { useEffect, useRef, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useSession } from 'next-auth/react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import sleep, { save_Template } from '@/utils/functions';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import EditContactsModal from '@/components/EditContactsModal';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [revealModal, setRevealModal] = useState(false);

  if (status === 'unauthenticated') {
    router.push('/');
  }

  //   const handleSubmit = async () => {
  //     console.log(title, value, session?.user?.id);

  //     console.log(value.replace(/<[^>]*>/g, ''));
  //   };
  const emailEditorRef = useRef<EditorRef>(null);

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;

    unlayer?.exportHtml((data) => {
      const { html } = data;
      console.log('exportHtml', html);

      fetch('/api/admin/email_mass_send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          message: html,
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
          onReturn={() => {
            sleep(1200).then(() => {
              setRevealModal(false);
            });
          }}
        />
      )}
      <div
        className={`blurFilter border-0 rounded-md p-2 mt-2  shadow-2xl w-[95svw]  max-w-[1024px]  flex justify-center items-center flex-col   md:w-[80svw] bg-lightMainBG dark:bg-darkMainBG h-[70svh] md:h-[85svh]
        }`}
      >
        <div
          id="wrapperDiv"
          className="w-full h-full relative  p-1 overflow-y-auto border border-lightMainColor dark:border-darkMainColor rounded-md flex flex-col justify-center items-center"
        >
          <div
            id="containedDiv"
            className={`absolute top-0 left-0 flex flex-col w-fit p-1 justify-center items-center`}
          >
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Email Marketing
            </h2>
            <div className="group flex  cursor-pointer  flex-col justify-center items-center absolute right-10 top-1">
              <div className="  h-10 w-10 md:h-14 md:w-14 relative hover:scale-110 group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
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
              <div className="  h-10 w-10 md:h-14 md:w-14 relative hover:scale-110 group-hover:animate-bounce stroke-lightMainColor dark:stroke-darkMainColor ">
                <p className="hidden tracking-widest mx-3 transition duration-300 ease-in-out absolute -right-4 -bottom-1.5 md:-bottom-4 rounded-md text-center text-lightMainColor dark:text-darkMainColor text-[6px] md:text-base md:dark:bg-darkMainBG opacity-100 group-hover:inline-flex md:block md:opacity-0 md:group-hover:opacity-100 ">
                  Contacts
                </p>
              </div>
              </div>
              <div
                id="icon"
                className=" h-20 w-20 md:h-28 md:w-28 fill-lightMainColor stroke-lightMainColor dark:fill-darkMainColor dark:stroke-darkMainColor m-auto"
              >
                <ShowIcon icon={'MassEmail'} stroke={'0.1'} />
              </div>
              <label className="flex flex-col items-center w-[95%]">
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
              <div>
                <button className="btnFancy" onClick={exportHtml}>
                  Send Emails
                </button>
                <button className="btnFancy" onClick={saveDesign}>
                  Save Design
                </button>
                <button
                  className="btnFancy"
                  onClick={() =>
                    document.getElementById('inputField1')!.click()
                  }
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
              <EmailEditor ref={emailEditorRef} onReady={onReady} />
            </div>
          </div>
         
      </div>
    </PageWrapper>
  );
};

export default page;
