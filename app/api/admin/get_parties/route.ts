
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma';

export async function GET() {

    const parties = await prisma.party.findMany();
    await prisma.$disconnect()
 
  return new NextResponse(JSON.stringify(parties), {
    status: 201,
  });
}
export const dynamic = 'force-dynamic'