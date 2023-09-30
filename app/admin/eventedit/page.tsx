'use client';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { PageWrapper } from '@/components/page-wrapper';
import EventTemplateEditingForm from '@/components/EventTemplateEditingForm';
interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);

  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
      {/* {revealAlert && <AlertMenu onReturn={onReturn} styling={alertStyle} />} */}
      <EventTemplateEditingForm />

    </PageWrapper>
  );
};



export default page;
