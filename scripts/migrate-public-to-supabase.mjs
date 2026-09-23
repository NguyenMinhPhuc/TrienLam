import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { createSupabaseStorageClient, ensureStorageBucket } from './supabase-storage-config.mjs';

const publicRoot = path.resolve(process.cwd(), 'public');
const dryRun = process.argv.includes('--dry-run');

const contentTypes = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
};

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(absolutePath) : [absolutePath];
  }));
  return nested.flat();
}

try {
  const files = await listFiles(publicRoot);
  const fileStats = await Promise.all(files.map((file) => stat(file)));
  const totalBytes = fileStats.reduce((total, item) => total + item.size, 0);
  console.log(`Đã tìm thấy ${files.length} tệp trong public (${(totalBytes / 1024 / 1024).toFixed(2)} MB).`);

  if (dryRun) {
    for (const file of files) console.log(path.relative(publicRoot, file).split(path.sep).join('/'));
    console.log('Dry run hoàn tất, chưa tải tệp nào lên Supabase.');
    process.exit(0);
  }

  const { client, url, bucket, maxUploadMb } = createSupabaseStorageClient();
  const created = await ensureStorageBucket(client, bucket, maxUploadMb);
  console.log(`Đích: ${url}/storage/v1/object/public/${bucket}${created ? ' (bucket mới)' : ''}`);

  let uploadedBytes = 0;
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const objectPath = path.relative(publicRoot, file).split(path.sep).join('/');
    const contentType = contentTypes[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const body = await readFile(file);
    const { error } = await client.storage.from(bucket).upload(objectPath, body, {
      cacheControl: '3600',
      contentType,
      upsert: true,
    });
    if (error) throw new Error(`${objectPath}: ${error.message}`);
    uploadedBytes += fileStats[index].size;
    console.log(`[${index + 1}/${files.length}] ${objectPath}`);
  }

  console.log(`Hoàn tất: ${files.length} tệp, ${(uploadedBytes / 1024 / 1024).toFixed(2)} MB.`);
} catch (error) {
  console.error(`Di chuyển media thất bại: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
