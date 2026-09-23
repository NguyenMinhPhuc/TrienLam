import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_BUCKET = 'site-media';
const DEFAULT_MAX_UPLOAD_MB = 50;

let cachedClient: SupabaseClient | null = null;
let cachedCredentials = '';

function env(name: string) {
  return process.env[name]?.trim() ?? '';
}

export function getSupabaseStorageConfig() {
  const url = env('SUPABASE_URL');
  const secretKey = env('SUPABASE_SECRET_KEY') || env('SUPABASE_SERVICE_ROLE_KEY');
  const bucket = env('SUPABASE_STORAGE_BUCKET') || DEFAULT_BUCKET;
  const maxUploadMb = Number(env('SUPABASE_STORAGE_MAX_MB') || DEFAULT_MAX_UPLOAD_MB);

  if (!url) throw new Error('Thiếu SUPABASE_URL.');
  if (!secretKey) throw new Error('Thiếu SUPABASE_SECRET_KEY.');
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)) {
    throw new Error('SUPABASE_URL không đúng định dạng dự án Supabase.');
  }
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(bucket)) {
    throw new Error('SUPABASE_STORAGE_BUCKET không hợp lệ.');
  }
  if (!Number.isFinite(maxUploadMb) || maxUploadMb <= 0) {
    throw new Error('SUPABASE_STORAGE_MAX_MB phải là số lớn hơn 0.');
  }

  return {
    url: url.replace(/\/$/, ''),
    secretKey,
    bucket,
    maxUploadMb,
  };
}

export function getSupabaseAdminClient() {
  const config = getSupabaseStorageConfig();
  const credentials = `${config.url}\0${config.secretKey}`;
  if (!cachedClient || cachedCredentials !== credentials) {
    cachedClient = createClient(config.url, config.secretKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });
    cachedCredentials = credentials;
  }
  return cachedClient;
}

export async function ensureSupabaseMediaBucket() {
  const client = getSupabaseAdminClient();
  const config = getSupabaseStorageConfig();
  const { data: buckets, error: listError } = await client.storage.listBuckets();
  if (listError) throw listError;

  const existing = buckets.find((bucket) => bucket.name === config.bucket);
  const bucketOptions = {
    public: true,
    fileSizeLimit: `${config.maxUploadMb}MB`,
    allowedMimeTypes: [
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
      'video/mp4',
      'video/webm',
    ],
  };

  if (!existing) {
    const { error } = await client.storage.createBucket(config.bucket, bucketOptions);
    if (error) throw error;
  } else {
    const { error } = await client.storage.updateBucket(config.bucket, bucketOptions);
    if (error) throw error;
  }

  return { client, ...config };
}

export function getSupabasePublicObjectUrl(objectPath: string) {
  const url = env('SUPABASE_URL').replace(/\/$/, '');
  const bucket = env('SUPABASE_STORAGE_BUCKET') || DEFAULT_BUCKET;
  if (!url) return null;
  const encodedPath = objectPath.split('/').map(encodeURIComponent).join('/');
  return `${url}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`;
}
