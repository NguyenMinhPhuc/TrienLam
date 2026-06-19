import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const fileExt = path.extname(file.name);
    const fileName = `${randomUUID()}${fileExt}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    console.log('Working dir:', process.cwd()); 
    console.log('Upload dir:', uploadDir);    

    await mkdir(uploadDir, { recursive: true });

    const uploadPath = path.join(uploadDir, fileName);

    await writeFile(uploadPath, buffer);

    // Return the URL using out new dynamic route
    const fileUrl = `/api/uploads/${fileName}`;
    return NextResponse.json({ url: fileUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
