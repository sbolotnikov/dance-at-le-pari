import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req:NextRequest) {
  const session = await getToken({ req })
 
  if (req.nextUrl.pathname.includes("/admin")) {
    if ((!session)||((session.role=='User'))) return NextResponse.redirect(process.env.NEXTAUTH_URL!);

    
  }
 
}
