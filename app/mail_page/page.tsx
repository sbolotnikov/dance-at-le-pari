'use client';
import { useState, useRef, FC } from 'react';
import AlertMenu from '@/components/alertMenu';
import { PageWrapper } from '@/components/page-wrapper';

interface pageProps {}

const page: FC<pageProps> = () => {
  const form = useRef();
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
  const onReturn = (decision1: string, inputValue: string | null) => {
    setRevealAlert(false);
    console.log(decision1, inputValue);
  };
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target1 = event.target as typeof event.target & {
      user_name: { value: string };
      user_email: { value: string };
      message: { value: string };
    };
    const name = target1.user_name.value; // typechecks!
    const email = target1.user_email.value;
    const message = target1.message.value;
    let validationError = '';
    document.querySelector('#user_name')!.classList.remove('invalid_input');
    document.querySelector('#user_email')!.classList.remove('invalid_input');
    document.querySelector('#message')!.classList.remove('invalid_input');
    if (name.length < 3) {
      validationError = 'Name is too Short';
      // make name input red
      document.querySelector('#user_name')!.classList.add('invalid_input');
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      validationError = 'Please enter a valid Email';
      // make email input red
      document.querySelector('#user_email')!.classList.add('invalid_input');
    } else if (message.length < 5) {
      validationError = 'Message too Short';
      // make message input red
      document.querySelector('#message')!.classList.add('invalid_input');
    }

    if (validationError > '') {
      setAlertStyle({
        variantHead: 'danger',
        heading: 'Warning',
        text: validationError,
        color1: 'warning',
        button1: 'Return',
        color2: '',
        button2: '',
        inputField: '',
      });
      setRevealAlert(true);
      return;
    }
    console.log(name, email, message);
    fetch('/api/email_send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        message,
        name,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        console.log(data);
        if (data.accepted.length > 0) {
          setAlertStyle({
            variantHead: 'info',
            heading: 'Message',
            text: 'Email sent successfully',
            color1: 'success',
            button1: 'Return',
            color2: '',
            button2: '',
            inputField: '',
          });
          document
            .querySelector('#user_name')!
            .classList.remove('invalid_input');
          document
            .querySelector('#user_email')!
            .classList.remove('invalid_input');
          document.querySelector('#message')!.classList.remove('invalid_input');
          target1.user_name.value = '';
          target1.user_email.value = '';
          target1.message.value = '';
          setRevealAlert(true);
        } else {
          setAlertStyle({
            variantHead: 'danger',
            heading: 'Warning',
            text: 'Email delivery fails ',
            color1: 'warning',
            button1: 'Return',
            color2: '',
            button2: '',
            inputField: '',
          });
          setRevealAlert(true);
        }
      })
      .catch(async (err) => {
        console.log(err);
      });
  };
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      <AlertMenu
        visibility={revealAlert}
        onReturn={onReturn}
        styling={alertStyle}
      />
      <div className="blurFilter border-0 rounded-md p-2 shadow-2xl w-[90%] max-w-[450px] max-h-[85%] overflow-y-auto md:w-full md:mt-8 bg-lightMainBG/70 dark:bg-darkMainBG/70">
        <div className="w-full h-full flex flex-col justify-center items-center border rounded-md border-lightMainColor dark:border-darkMainColor relative p-2">
          <form
            onSubmit={handleSubmit}
            className="w-full h-full rounded-md flex flex-col justify-between  items-center   "
          >
            <h2
              className="text-center font-semibold md:text-4xl uppercase"
              style={{ letterSpacing: '1px' }}
            >
              Send us an Email
            </h2>
            <p className="w-full ">
              {'We would be glad to answer'}{' '}
              <strong>{process.env.NEXT_PUBLIC_TELEPHONE}</strong>.
            </p>

            <input
              name="user_name"
              id="user_name"
              className="w-full rounded outline-none m-2 text-lightteal"
              type="text"
              placeholder="Your name"
            />

            <input
              name="user_email"
              id="user_email"
              className="w-full rounded m-2 outline-none text-lightteal"
              type="text"
              placeholder="Email"
            />
            <textarea
              name="message"
              id="message"
              className="w-full rounded m-2 outline-none text-lightteal"
              placeholder="Your question"
              rows={4}
              minLength={5}
            />
            <div className="error alert alert-error"></div>
            <button type="submit" value="Send" className="btnFancy">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;
