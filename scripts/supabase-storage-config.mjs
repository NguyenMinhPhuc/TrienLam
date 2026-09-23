import { createClient } from '@supabase/supabase-js';

const allowedMimeTypes = [
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'video/mp4',
  'video/webm',
];

function env(name) {
  return process.env[name]?.trim() ?? '';
}

export function createSupabaseStorageClient() {
  const url = env('SUPABASE_URL').replace(/\/$/, '');
  const secretKey = env('SUPABASE_SECRET_KEY') || env('SUPABASE_SERVICE_ROLE_KEY');
  const bucket = env('SUPABASE_STORAGE_BUCKET') || 'site-media';
  const maxUploadMb = Number(env('SUPABASE_STORAGE_MAX_MB') || 50);

  if (!url) throw new Error('Thiếu SUPABASE_URL.');
  if (!secretKey) throw new Error('Thiếu SUPABASE_SECRET_KEY.');
  if (!Number.isFinite(maxUploadMb) || maxUploadMb <= 0) {
    throw new Error('SUPABASE_STORAGE_MAX_MB phải là số lớn hơn 0.');
  }

  return {
    client: createClient(url, secretKey, {
      auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
    }),
    url,
    bucket,
    maxUploadMb,
  };
}

export async function ensureStorageBucket(client, bucket, maxUploadMb) {
  const { data: buckets, error: listError } = await client.storage.listBuckets();
  if (listError) throw listError;

  const options = {
    public: true,
    fileSizeLimit: `${maxUploadMb}MB`,
    allowedMimeTypes,
  };
  const existing = buckets.find((item) => item.name === bucket);

  if (existing) {
    const { error } = await client.storage.updateBucket(bucket, options);
    if (error) throw error;
    return false;
  }

  const { error } = await client.storage.createBucket(bucket, options);
  if (error) throw error;
  return true;
}
