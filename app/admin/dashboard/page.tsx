'use client';
import { FC} from 'react';
import { useRouter } from 'next/navigation';
import { PageWrapper } from '@/components/page-wrapper';
import ShowIcon from '@/components/svg/showIcon';
import { useSession } from 'next-auth/react';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const { data: session } = useSession();
   
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center  justify-center">
      <div
        className="blurFilter border-0 rounded-md p-2  shadow-2xl w-[90%] h-[50svh]   max-w-[450px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 md:mb-3"
        // style={{ boxShadow: '0 0 150px rgb(113, 113, 109 / 50%),inset 0 0 20px #242422' }}
      >
        <div className="border rounded-md border-lightMainColor dark:border-darkMainColor w-full h-full   p-2 flex flex-col relative">
        <h2
            className="text-center font-semibold text-2xl md:text-4xl uppercase"
            style={{ letterSpacing: '1px' }}
          >
            Admin Dashboard
          </h2>
          <div className=" h-16 w-16 m-auto hidden md:block">
            <ShowIcon icon={'Dashboard'} stroke={'0.1'} />
          </div>
          <div className="flex flex-wrap justify-between items-center h-full w-full">
          <button
            className="flex flex-col justify-center items-center h-28 w-28 p-1 m-1 border  shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md"
            onClick={() => router.replace('/admin/purchases')}
          >
            <div className=" h-full w-full  border border-lightMainColor dark:border-darkMainColor/70 rounded-md">
               
            <div className=" h-16 w-16 m-auto">
              <ShowIcon icon={'Purchases'} stroke={'0.1'} />
            </div>
            <p className="text-center">Purchases</p>
            </div>
          </button>
          <button
            className="flex flex-col justify-center items-center h-28 w-28 p-1 m-1 border  shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md"
            onClick={() => router.replace('/admin/massemail/0')}
          >
            <div className=" h-full w-full  border border-lightMainColor dark:border-darkMainColor/70 rounded-md">
               
            <div className=" h-16 w-16 m-auto">
              <ShowIcon icon={'MassEmail'} stroke={'0.1'} />
            </div>
            <p className="text-center">Emailing</p>
            </div>
          </button>
          <button
            className="flex flex-col justify-center items-center h-28 w-28 p-1 m-1 border  shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md"
            onClick={() => router.replace('/admin/usersscreen')}
          >
            <div className=" h-full w-full  border border-lightMainColor dark:border-darkMainColor/70 rounded-md">
               
            <div className=" h-16 w-16 m-auto">
              <ShowIcon icon={'Users'} stroke={'0.1'} />
            </div>
            <p className="text-center">User's List</p>
            </div>
          </button>
          <button
            className="flex flex-col justify-center items-center h-28 w-28 p-1 m-1 border  shadow-2xl shadow-lightMainColor dark:shadow-darkMainColor rounded-md"
            onClick={() => router.replace('/admin/massemail/1')}
          >
            <div className=" h-full w-full  border border-lightMainColor dark:border-darkMainColor/70 rounded-md">
               
            <div className=" h-16 w-16 m-auto">
              <ShowIcon icon={'MailList'} stroke={'0.1'} />
            </div>
            <p className="text-center">Mailing List</p>
            </div>
          </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default page;