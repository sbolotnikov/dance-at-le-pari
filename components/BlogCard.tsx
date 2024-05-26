import Image from "next/image";
import Link from "next/link";
type Props = {
    key: string;
    item: {img:string; createdAt:string; catSlug:string; slug:string; title:string; desc:string};
  }
const BlogCard = ({ key, item }:Props) => {
  return (
    <div className="">
      {item.img && (
        <div className="">
          <Image src={item.img} alt="" fill className="" />
        </div>
      )}
      <div className="">
        <div className="">
          <span className="">
            {item.createdAt.substring(0, 10)} -{" "}
          </span>
          <span className="">{item.catSlug}</span>
        </div>
        <Link href={`/posts/${item.slug}`}>
          <h1>{item.title}</h1>
        </Link>
        {/* <p className={styles.desc}>{item.desc.substring(0, 60)}</p> */}
        <div className="" dangerouslySetInnerHTML={{ __html: item?.desc.substring(0,60) }}/>
        <Link href={`/posts/${item.slug}`} className="">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;