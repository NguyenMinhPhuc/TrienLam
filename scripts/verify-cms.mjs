// Integration test against a LOCAL development server. Creates its own records,
// restores edited content in finally, and removes only the generated test data.
// Run: node --env-file=.env scripts/verify-cms.mjs
import assert from 'node:assert/strict';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { execute, closeDatabase } from './db.mjs';
import { SITE_CONTENT_DEFAULTS, contentValue } from '../src/lib/site-content.ts';
import { getHomeLayout } from '../src/lib/home-layout.ts';

const base = process.env.CMS_BASE_URL || 'http://localhost:3000';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Use a local test server.');
const marker = `CMSQA_${Date.now()}`;
const cleanup = [];
let uploadPath;
let cookie;
let originalContent = [];
const changedKeys = new Set();
let checks = 0;
function check(condition, message) { assert.ok(condition, message); checks++; console.log(`PASS ${message}`); }
async function request(route, method = 'GET', data, expected = 200) {
  const response = await fetch(base + route, {
    method, headers: { ...(cookie ? { cookie } : {}), ...(data ? { 'Content-Type': 'application/json' } : {}) },
    body: data ? JSON.stringify(data) : undefined,
  });
  const result = await response.json();
  assert.equal(response.status, expected, `${method} ${route}: ${JSON.stringify(result)}`);
  return result;
}
async function html(route = '/') {
  const response = await fetch(base + route);
  assert.equal(response.status, 200);
  return (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
}
async function content(values) {
  Object.keys(values).forEach(key => changedKeys.add(key));
  return request('/api/admin/content', 'PUT', { items: Object.entries(values).map(([SectionKey, Content]) => ({ SectionKey, Content })) });
}
async function create(resource, data, key, value, type) {
  await request(`/api/admin/${resource}`, 'POST', data);
  const rows = await request(`/api/admin/${resource}`);
  const list = type ? rows[{ question: 'questions', option: 'options', result: 'results', industry: 'industries' }[type]] : rows;
  const row = list.find(item => item[key] === value);
  assert.ok(row, `Created ${resource}/${type || key}`);
  cleanup.push(`/api/admin/${resource}?id=${row.Id}${type ? `&type=${type}` : ''}`);
  return row;
}
try {
  const login = await fetch(`${base}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: process.env.ADMIN_PASSWORD?.trim() }) });
  assert.equal(login.status, 200);
  cookie = login.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
  originalContent = await request('/api/admin/content');
  check(contentValue({ mission_title: '' }, 'mission_title') === '', 'Cleared content stays empty');
  check(getHomeLayout(undefined, []).map(item => item.id).join(',') === 'hero,stats,faculty,products,quiz,contact,mission', 'Default section order is unchanged');
  const values = {
    hero_title: `${marker}_hero`, stats_title: `${marker}_stats`, faculty_title: `${marker}_faculty`,
    products_title: `${marker}_products`, products_more_title: `${marker}_more`, quiz_title: `${marker}_quiz`,
    contact_title: `${marker}_contact`, mission_title: `${marker}_mission`, footer_title: `${marker}_footer`,
    nav_faculty_label: `${marker}_nav`, brand_first: `${marker}_brand`, hero_orbit_title: `${marker}_orbit`,
    academic_title: `${marker}_academic`, academic_cta_title: `${marker}_admissions`,
    hero_products_url: '#contact', faculty_cta_url: '/academic', footer_nav_quiz_url: '/#contact',
  };
  await content(values);
  let page = await html();
  for (const [key, value] of Object.entries(values)) {
    if (!key.startsWith('academic_') && !key.endsWith('_url')) check(page.includes(value), `Admin content renders: ${key}`);
  }
  const academic = await html('/academic');
  check(academic.includes(values.academic_title) && academic.includes(values.academic_cta_title), 'Academic title and admission copy are editable');
  check(page.includes('href="#contact"') && page.includes('href="/#contact"'), 'Updated CTA and footer links render');
  await content({ mission_title: '' });
  page = await html();
  check(!page.includes(values.mission_title) && !page.includes(SITE_CONTENT_DEFAULTS.mission_title), 'Clearing saved title does not restore default text');
  await content({ home_layout: JSON.stringify([{ id: 'mission', visible: true }, { id: 'hero', visible: false }]), mission_title: values.mission_title });
  page = await html();
  check(!page.includes(values.hero_title), 'Home visibility hides hero');
  check(page.indexOf(values.mission_title) < page.indexOf(values.stats_title), 'Home layout changes section order');
  await content({ home_layout: '[]' });

  const form = new FormData();
  form.append('file', new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l7sAAAAASUVORK5CYII=', 'base64')], { type: 'image/png' }), `${marker}.png`);
  const upload = await fetch(`${base}/api/admin/upload`, { method: 'POST', headers: { cookie }, body: form });
  assert.equal(upload.status, 200);
  const media = await upload.json();
  const filename = path.basename(media.url);
  assert.match(filename, /^[a-f0-9-]+\.png$/i);
  uploadPath = null;
  check(media.storage === 'supabase' && media.url.includes('/storage/v1/object/public/'), 'Uploads use Supabase Storage');
  check((await fetch(base + media.url)).status === 200, 'Newly uploaded image is accessible');
  await content({ about_faculty_image: media.url });
  check((await html()).includes(media.url), 'Faculty image follows admin upload');

  const product = await create('products', { Name: `${marker}_project_record`, Description: 'CMS test', ImageUrl: media.url, AppUrl: '/academic', TechTags: 'CMS', CareerPath: 'Sản phẩm phần mềm', Year: 2099, Author: marker, IsVisible: false }, 'Name', `${marker}_project_record`);
  check(!(await html()).includes(product.Name), 'Create product as hidden');
  await request('/api/admin/products', 'PATCH', { Id: product.Id, IsVisible: true });
  check((await html()).includes(product.Name), 'Show product on public page');
  product.Name += '_edited'; product.IsVisible = true;
  await request('/api/admin/products', 'PUT', product);
  check((await html()).includes(product.Name), 'Edit product updates public page');
  await request(`/api/admin/products?id=${product.Id}`, 'DELETE'); cleanup.pop();
  check(!(await html()).includes(product.Name), 'Delete product removes public card');

  const stat = await create('stats', { Label: `${marker}_metric_record`, Value: '77+', IconName: 'Rocket', OrderIndex: 99 }, 'Label', `${marker}_metric_record`);
  check((await html()).includes(stat.Label), 'Create statistic appears publicly');
  stat.Label += '_edited'; await request('/api/admin/stats', 'PUT', stat);
  check((await html()).includes(stat.Label), 'Edit statistic appears publicly');
  await request(`/api/admin/stats?id=${stat.Id}`, 'DELETE'); cleanup.pop();
  check(!(await html()).includes(stat.Label), 'Delete statistic removes it');

  const section = await create('sections', { Title: `${marker}_section`, Subtitle: 'CMS test', LayoutType: '2-col', ContentJson: JSON.stringify([{ title: `${marker}_item`, body: 'CMS test body', image: media.url, linkUrl: '/academic', linkLabel: 'CMS link' }]), BgStyle: 'default', OrderIndex: 999, IsActive: true, PageKey: 'all' }, 'Title', `${marker}_section`);
  check((await html()).includes(section.Title) && (await html('/academic')).includes(section.Title), 'Global section appears on both pages');
  check((await request('/api/admin/sections?pageKey=home')).some(row => row.Id === section.Id), 'Global section is editable from home list');
  section.Title += '_edited'; await request('/api/admin/sections', 'PUT', section);
  check((await html()).includes(section.Title), 'Edit section updates public page');
  section.IsActive = false; await request('/api/admin/sections', 'PUT', section);
  check(!(await html()).includes(section.Title), 'Deactivate section hides it');
  await request('/api/admin/sections', 'PUT', { ...section, ContentJson: '[null]' }, 400);
  check(true, 'Invalid section JSON is rejected');
  await request(`/api/admin/sections?id=${section.Id}`, 'DELETE'); cleanup.pop();
  check(!(await request('/api/admin/sections?pageKey=all')).some(row => row.Id === section.Id), 'Delete section removes admin record');

  const industry = await create('quiz', { type: 'industry', IndustryKey: marker, Title: `${marker}_industry`, Description: 'Test industry' }, 'IndustryKey', marker, 'industry');
  const result = await create('quiz', { type: 'result', ResultKey: marker, Title: `${marker}_result`, Description: 'Test result', IconName: 'Rocket', IndustryKey: marker }, 'ResultKey', marker, 'result');
  const question = await create('quiz', { type: 'question', QuestionText: `${marker}_question`, OrderIndex: 999 }, 'QuestionText', `${marker}_question`, 'question');
  const option = await create('quiz', { type: 'option', QuestionId: question.Id, OptionText: `${marker}_option`, ResultType: marker, OrderIndex: 0 }, 'OptionText', `${marker}_option`, 'option');
  check(true, 'Create industry, result, question and linked option');
  for (const [type, row, field] of [['industry', industry, 'Title'], ['result', result, 'Title'], ['question', question, 'QuestionText'], ['option', option, 'OptionText']]) {
    row[field] += '_edited'; await request('/api/admin/quiz', 'PUT', { type, ...row });
  }
  const quiz = await request('/api/admin/quiz');
  check(quiz.results.some(r => r.Title === result.Title) && quiz.options.some(o => o.OptionText === option.OptionText), 'Quiz edits persist');
  const quizHtml = await (await fetch(base + '/')).text();
  check(quizHtml.includes(question.QuestionText) && quizHtml.includes(result.Title), 'Public quiz receives edited question and result');
  await request(`/api/admin/quiz?type=result&id=${result.Id}`, 'DELETE', undefined, 409);
  await request(`/api/admin/quiz?type=industry&id=${industry.Id}`, 'DELETE', undefined, 409);
  check(true, 'Referenced results and industries cannot be deleted');
  await request(`/api/admin/quiz?type=question&id=${question.Id}`, 'DELETE');
  cleanup.pop(); cleanup.pop();
  const afterDelete = await request('/api/admin/quiz');
  check(!afterDelete.options.some(o => o.QuestionId === question.Id), 'Delete question also removes its options');
  await request(`/api/admin/quiz?type=result&id=${result.Id}`, 'DELETE'); cleanup.pop();
  await request(`/api/admin/quiz?type=industry&id=${industry.Id}`, 'DELETE'); cleanup.pop();
  await request('/api/admin/quiz', 'POST', { type: 'invalid' }, 400);
  check(true, 'Unsupported quiz operation returns an error');
} finally {
  const failures = [];
  for (const route of cleanup.reverse()) {
    try { await request(route, 'DELETE'); } catch (error) { failures.push(error); }
  }
  if (changedKeys.size) {
    try {
      const rows = [...changedKeys].map(SectionKey => ({ SectionKey, Content: originalContent.find(row => row.SectionKey === SectionKey)?.Content ?? (SectionKey === 'home_layout' ? '[]' : SITE_CONTENT_DEFAULTS[SectionKey] ?? '') }));
      await request('/api/admin/content', 'PUT', { items: rows });
      for (const key of changedKeys) {
        const original = originalContent.find(row => row.SectionKey === key);
        if (!original) await execute('DELETE FROM SiteContent WHERE SectionKey=@key', { key });
        else if (original.LastUpdated) await execute('UPDATE SiteContent SET LastUpdated=@updated WHERE SectionKey=@key', { key, updated: new Date(original.LastUpdated) });
      }
      const restored = await request('/api/admin/content');
      const canonical = rows => rows.map(({ SectionKey, Content }) => ({ SectionKey, Content })).sort((a, b) => a.SectionKey.localeCompare(b.SectionKey));
      assert.deepEqual(canonical(restored), canonical(originalContent));
      console.log('PASS Original CMS content restored exactly');
    } catch (error) { failures.push(error); }
  }
  if (uploadPath) {
    try {
      assert.equal(path.dirname(uploadPath), path.resolve('public/uploads'));
      await unlink(uploadPath);
      console.log('PASS Generated test image removed');
    } catch (error) { failures.push(error); }
  }
  await closeDatabase();
  if (failures.length) throw new AggregateError(failures, 'Test cleanup failed');
}
console.log(`PASS ${checks} CMS checks; no test records retained.`);
