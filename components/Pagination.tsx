"use client";


import { useRouter } from "next/navigation";
type Props = {
    page: number;
    hasPrev: boolean;
    hasNext: boolean;
  }
const Pagination = ({ page, hasPrev, hasNext }:Props) => {
  const router = useRouter();

  return (
    <div className=''>
      <button
        className=""
        disabled={!hasPrev}
        onClick={() => router.push(`?page=${page - 1}`)}
      >
        Previous
      </button>
      <button
        disabled={!hasNext}
        className=""
        onClick={() => router.push(`?page=${page + 1}`)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;