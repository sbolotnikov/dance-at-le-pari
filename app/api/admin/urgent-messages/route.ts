// app/api/urgent-messages/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const urgentMessages = await prisma.urgentMessage.findMany();
    return NextResponse.json(urgentMessages);
  } catch (error) {
    console.error('Error fetching urgent messages:', error);
    return NextResponse.json({ message: 'Error fetching urgent messages' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { htmlContent, pages, enabled } = await req.json();
    const newUrgentMessage = await prisma.urgentMessage.create({
      data: {
        htmlContent,
        pages,
        enabled: enabled ?? true, // Default to true if not provided
      },
    });
    return NextResponse.json(newUrgentMessage, { status: 201 });
  } catch (error) {
    console.error('Error creating urgent message:', error);
    return NextResponse.json({ message: 'Error creating urgent message' }, { status: 500 });
  }
}
