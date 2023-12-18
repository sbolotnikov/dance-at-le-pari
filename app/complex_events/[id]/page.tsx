'use client';

import { PageWrapper } from '@/components/page-wrapper';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { id: string } }) {
  useEffect(() => {



  }, []);
  return (
    <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
        <div className="border-0 rounded-md p-4  shadow-2xl w-[90%]  max-w-[850px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70 backdrop-blur-md">
          <p>page {params.id}</p>
        </div>
    </PageWrapper>
  );
}
