// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
type Data = {
  name: string
}

export async function GET(request: Request) {

    const session = await getServerSession(authOptions)

    if (!session) {
      return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
        status: 401
      })
    }
  return new NextResponse(JSON.stringify({ message: 'Hello!!!' }), {
    status: 201,
  });
}


