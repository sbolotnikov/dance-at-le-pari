"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react"


type Props = {}

const page = (props: Props) => {
   const router = useRouter();
   useEffect(() => {
      router.push("/calendar");
   }, [])  
  return (
    <div></div>
  )
}

export default page