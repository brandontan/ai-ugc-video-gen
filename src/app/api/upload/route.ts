import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

async function handler(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // For MVP, we'll just return a mock URL
    // In production, you'd want to upload to a storage service
    const mockUrl = `https://storage.example.com/${file.name}`;
    
    return NextResponse.json({ url: mockUrl });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(handler); 