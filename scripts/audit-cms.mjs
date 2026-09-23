// Read-only inventory: node --env-file=.env scripts/audit-cms.mjs
const base = process.env.CMS_BASE_URL || 'http://localhost:3000';
const login = await fetch(`${base}/api/admin/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: process.env.ADMIN_PASSWORD?.trim() }),
});
if (!login.ok) throw new Error(`Login failed (${login.status})`);
const cookie = login.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
for (const path of ['content', 'sections?pageKey=home', 'sections?pageKey=all', 'products', 'quiz', 'stats']) {
  const response = await fetch(`${base}/api/admin/${path}`, { headers: { cookie } });
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  const rows = await response.json();
  const summary = path === 'content' ? rows.map(row => row.SectionKey)
    : path === 'products' ? rows.map(({ Id, Name, CareerPath, IsVisible }) => ({ Id, Name, CareerPath, IsVisible }))
    : path.startsWith('sections') ? rows.map(({ Id, Title, PageKey, LayoutType, IsActive, OrderIndex }) => ({ Id, Title, PageKey, LayoutType, IsActive, OrderIndex }))
    : path === 'quiz' ? { questions: rows.questions.length, results: rows.results, industries: rows.industries } : rows;
  console.log(path, JSON.stringify(summary));
}
