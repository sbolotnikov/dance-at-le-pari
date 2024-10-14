"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react"


type Props = {}

const page = (props: Props) => {
   const router = useRouter();
   useEffect(() => {
      router.push("/about_us/location");
   }, [])  
  return (
    <div>page</div>
  )
}

export default page