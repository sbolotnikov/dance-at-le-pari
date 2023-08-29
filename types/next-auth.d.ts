import type { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

type UserId = string

  
declare module 'next-auth/jwt' {
  interface JWT {
    id: UserId
   
  }
}

declare module 'next-auth' {
    interface User {
        role: string;
        telephone?: string | null;
        image?: string | null;
        email:string,
        name?:string | null,
        id:number,
      }
    
  interface Session {
    user: User & {
      id: UserId
     
    }
  }
}