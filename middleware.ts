import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req:NextRequest) {
  const session = await getToken({ req })
 
  if (req.nextUrl.pathname.includes("/admin")) {
    if ((!session)||((session.role=='User')||(session.role=='Student')||(session.role=='Teacher'))) return NextResponse.redirect(process.env.NEXTAUTH_URL!);

    
  }
  if (req.nextUrl.pathname.includes("/teacher")) {
    if ((!session)||((session.role=='User')||(session.role=='Student'))) return NextResponse.redirect(process.env.NEXTAUTH_URL!);

    
  }
}
