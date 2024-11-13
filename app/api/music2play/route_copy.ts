import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    headers.set('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return new NextResponse(null, { status: 204, headers });
    }

    const fileId = req.nextUrl.searchParams.get('file_id');
    if (!fileId) {
        return new NextResponse(JSON.stringify({ message: 'Missing file_id parameter' }), { status: 400, headers });
    }

    const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch file content');
        }

        const readableStream = response.body;
        const streamingResponse = new NextResponse(readableStream, {
            headers: {
                ...headers,
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'inline; filename="audiofile.mp3"',
            },
        });

        return streamingResponse;

    } catch (error) {
        headers.set('Content-Type', 'application/json');
        const errorMessage = (error as Error).message; 
        return new NextResponse(JSON.stringify({ message: 'Error fetching file content', error: errorMessage }), { status: 500, headers });
    }
};