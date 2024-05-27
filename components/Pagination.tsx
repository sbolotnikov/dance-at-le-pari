'use client';

import { useRouter } from 'next/navigation';
type Props = {
  page: number;
  cat: string;
  hasPrev: boolean;
  hasNext: boolean;
  pageCount: number;
};
const Pagination = ({ page, cat, hasPrev, hasNext, pageCount }: Props) => {
  const router = useRouter();
  console.log('page', page, cat, hasPrev, hasNext);
  return (
    <div className="absolute top-7 right-1  ">
      <button
        className="shadow-lg pointer border-0 outline-none rounded"
        style={{ padding: '5px 5px', margin: '5px 5px' }}
        disabled={!hasPrev}
        onClick={(e) => {
          e.preventDefault();
          console.log('clicked');
          router.push(`/blog/${cat}/${page - 1}`);
        }}
      >
        Prev
      </button>
      <button
        disabled={!hasNext}
        className="shadow-lg pointer border-0 outline-none rounded"
        style={{ padding: '5px 5px', margin: '5px 5px' }}
        onClick={(e) => {
          e.preventDefault();
          console.log('clicked');
          router.push(`/blog/${cat}/${page + 1}`);
        }}
      >
        Next
      </button>
      <h4 className="w-full text-center">
        Page {page} of {pageCount}
      </h4>
    </div>
  );
};

export default Pagination;
