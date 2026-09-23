import { createSupabaseStorageClient, ensureStorageBucket } from './supabase-storage-config.mjs';

try {
  const { client, url, bucket, maxUploadMb } = createSupabaseStorageClient();
  const created = await ensureStorageBucket(client, bucket, maxUploadMb);
  console.log(`Supabase Storage OK: ${url}`);
  console.log(`Bucket công khai: ${bucket}${created ? ' (vừa được tạo)' : ' (đã tồn tại)'}`);
  console.log(`Giới hạn mỗi tệp: ${maxUploadMb} MB`);
} catch (error) {
  console.error(`Kiểm tra Supabase Storage thất bại: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
