const required = ['DB_USER', 'DB_PWD', 'DB_SERVER', 'DB_NAME', 'ADMIN_PASSWORD',
  'SUPABASE_URL', 'SUPABASE_SECRET_KEY', 'SUPABASE_STORAGE_BUCKET'];
const missing = required.filter(key => !process.env[key]?.trim());
if (missing.length) {
  console.error(`Missing server environment variables: ${missing.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('Required deployment environment variables are present (values hidden).');
}
