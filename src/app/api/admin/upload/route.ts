import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { ensureSupabaseMediaBucket } from '@/lib/supabase-storage';

export const runtime = 'nodejs';

const ALLOWED_FILE_TYPES: Record<string, string> = {
  'image/avif': '.avif',
  'image/gif': '.gif',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/svg+xml': '.svg',
  'image/webp': '.webp',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Chưa chọn tệp để tải lên.' }, { status: 400 });
    }

    const extension = ALLOWED_FILE_TYPES[file.type.toLowerCase()];
    if (!extension) {
      return NextResponse.json(
        { error: 'Chỉ hỗ trợ JPG, PNG, WebP, GIF, AVIF, SVG, MP4 và WebM.' },
        { status: 415 },
      );
    }

    const { client, bucket, maxUploadMb } = await ensureSupabaseMediaBucket();
    if (file.size > maxUploadMb * 1024 * 1024) {
      return NextResponse.json(
        { error: `Tệp vượt quá giới hạn ${maxUploadMb} MB.` },
        { status: 413 },
      );
    }

    const objectPath = `uploads/${randomUUID()}${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await client.storage.from(bucket).upload(objectPath, buffer, {
      cacheControl: '31536000',
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const { data } = client.storage.from(bucket).getPublicUrl(objectPath);
    return NextResponse.json({
      url: data.publicUrl,
      path: objectPath,
      storage: 'supabase',
    });
  } catch (err) {
    console.error('Lỗi tải media lên Supabase:', err);
    const message = err instanceof Error && err.message.startsWith('Thiếu SUPABASE_')
      ? err.message
      : 'Không thể tải tệp lên Supabase Storage.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
