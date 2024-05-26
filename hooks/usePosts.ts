import  { useEffect, useState } from 'react'; 
export const usePosts = (page:string, cat:string) => {
  const [posts, setPosts] = useState<{img:string; createdAt:string; catSlug:string; slug:string; title:string; desc:string, _id:string}[]>([]); 
 
  useEffect(() => { 
    fetch(
        `/api/posts?page=${page}&cat=${cat || ""}`,
        {
          cache: "no-store",
        }
      ).then((response) => response.json())
      .then((data) => {  
          setPosts(data.posts); 
      })
      .catch((error) => {console.log(error);})
    

  }, [page, cat]);

  return {
     posts, 
  };
};