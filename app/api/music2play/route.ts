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

        const fileContent = await response.arrayBuffer();
        const base64Content = Buffer.from(fileContent).toString('base64');
        const base64Uri = `data:audio/mpeg;base64,${base64Content}`;

        headers.set('Content-Type', 'application/json');
        return new NextResponse(JSON.stringify({ fileUrl: base64Uri }), { status: 200, headers });

    } catch (error) {
        headers.set('Content-Type', 'application/json');
        const errorMessage = (error as Error).message; 
        return new NextResponse(JSON.stringify({ message: 'Error fetching file content', error: errorMessage }), { status: 500, headers });
    }
};