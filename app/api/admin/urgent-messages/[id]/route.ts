// app/api/urgent-messages/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { htmlContent, pages, enabled } = await req.json();

    const updatedUrgentMessage = await prisma.urgentMessage.update({
      where: { id: parseInt(id) },
      data: {
        htmlContent,
        pages,
        enabled,
      },
    });
    return NextResponse.json(updatedUrgentMessage);
  } catch (error) {
    console.error(`Error updating urgent message ${params.id}:`, error);
    return NextResponse.json({ message: `Error updating urgent message ${params.id}` }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.urgentMessage.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: `Urgent message ${id} deleted` }, { status: 204 });
  } catch (error) {
    console.error(`Error deleting urgent message ${params.id}:`, error);
    return NextResponse.json({ message: `Error deleting urgent message ${params.id}` }, { status: 500 });
  }
}
