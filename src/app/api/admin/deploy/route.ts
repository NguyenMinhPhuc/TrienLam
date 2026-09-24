import { isAuthenticated } from '@/lib/auth';

export async function POST() {
  if (!await isAuthenticated()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json({ error: 'Deploy đã chuyển sang GitHub Desktop: Commit và Push origin lên main để triển khai.' }, { status: 410 });
}
