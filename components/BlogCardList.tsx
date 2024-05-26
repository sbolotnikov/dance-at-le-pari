
import Image from "next/image";
import BlogCard from "./BlogCard";
import Pagination from "./Pagination";
import { usePosts } from "@/hooks/usePosts";

 
type Props = {
  page: string;
  cat: string;
}
const BlogCardList =  ({ page, cat }:Props) => {
  
  const { posts } =  usePosts(page, cat);
  
  const POST_PER_PAGE = 2;

  const hasPrev = POST_PER_PAGE * (parseInt(page) - 1) > 0;
  const hasNext = POST_PER_PAGE * (parseInt(page) - 1) + POST_PER_PAGE < posts?.length;
  console.log(posts)
  return (
    <div className=''>
      <h1 className=''>Recent Posts</h1>
      <div className=''>
        {posts.length>0 && posts?.map((item:{img:string; createdAt:string; catSlug:string; slug:string; title:string; desc:string, _id:string}) => (
          <BlogCard item={item} key={item._id} />
        ))}
      </div>
      <Pagination page={parseInt(page)} hasPrev={hasPrev} hasNext={hasNext} />
    </div>
  );
};

export default BlogCardList;