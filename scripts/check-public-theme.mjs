import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';

// Static palette / generated-CSS regression checks; not a browser visual test.
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const cssPath = fileURLToPath(new URL('../src/app/globals.css', import.meta.url));
const source = await readFile(cssPath, 'utf8');
const ast = postcss.parse(source);

function declarations(selector) {
  const values = {};
  ast.walkRules(selector, (rule) => {
    rule.each((node) => {
      if (node.type === 'decl') values[node.prop] = node.value;
    });
  });
  return values;
}

const light = { ...declarations(':root'), ...declarations('.public-content') };
const dark = { ...declarations('.dark'), ...declarations('.dark .public-content') };

function luminance(hex) {
  const rgb = hex.replace('#', '').match(/.{2}/g).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

const contrastResults = [];
for (const surface of ['--background', '--card-bg', '--surface-1', '--surface-2']) {
  for (const text of ['--foreground', '--muted', '--public-blue', '--public-orange']) {
    const ratio = contrast(light[text], light[surface]);
    assert(ratio >= 4.5, `Light ${text} on ${surface}: ${ratio.toFixed(2)}:1 < 4.5:1`);
    contrastResults.push(ratio);
  }
  assert(contrast(light['--public-control'], light[surface]) >= 3,
    `Light control border on ${surface} must reach 3:1`);
}
for (const status of ['#b13c26', '#1d7048']) {
  assert(contrast(status, light['--card-bg']) >= 4.5, 'Contact status contrast');
}
assert(contrast('#07111d', '#f37021') >= 4.5, 'Primary action contrast');
assert(contrast('#07111d', '#a9d6ef') >= 4.5, 'Selected product filter contrast');

// Pinned dark palette: light-mode work must not remap the existing dark world.
for (const [token, expected] of Object.entries({
  '--background': '#07111d',
  '--foreground': '#f4f8fb',
  '--card-bg': '#0d1b29',
  '--muted': '#9eb1c1',
  '--surface-1': '#091725',
  '--surface-2': '#102335',
  '--public-blue': '#2385c1',
  '--public-orange': '#f37021',
  '--public-media': '#050b12',
})) assert.equal(dark[token], expected, `Preserve dark ${token}`);

// Check emitted Tailwind utilities too, so aliases cannot silently disappear.
const compiled = await postcss([tailwind({ base: projectRoot, optimize: false })])
  .process(source, { from: cssPath });
const rules = new Map();
compiled.root.walkRules((rule) => {
  rules.set(rule.selector, rule);
});
for (const [selector, property, value] of [
  ['.text-public-blue', 'color', 'var(--public-blue)'],
  ['.text-public-orange', 'color', 'var(--public-orange)'],
  ['.bg-public-media', 'background-color', 'var(--public-media)'],
  ['.border-public-control', 'border-color', 'var(--public-control)'],
]) {
  const rule = rules.get(selector);
  assert(rule, `Missing generated utility: ${selector}`);
  assert(rule.nodes.some((node) => node.prop === property && node.value === value),
    `Wrong generated declaration for ${selector}`);
}

for (const component of [
  'StatsSection', 'FacultySection', 'ProductCard', 'ProductGallery', 'ProductModal',
  'DynamicSection', 'CareerQuiz', 'ContactSection', 'MissionSection', 'SiteFooter',
]) {
  const content = await readFile(new URL(`../src/components/${component}.tsx`, import.meta.url), 'utf8');
  assert(content.includes('public-content'), `${component} must carry its scoped palette (including portals)`);
}
for (const component of ['Hero', 'Navbar', 'ThemeToggle', 'BrandLogo']) {
  const content = await readFile(new URL(`../src/components/${component}.tsx`, import.meta.url), 'utf8');
  assert(!content.includes('public-content'), `${component} is outside the recoloring scope`);
}

const mission = await readFile(new URL('../src/components/MissionSection.tsx', import.meta.url), 'utf8');
assert(mission.includes('text-[clamp(1.25rem,1.75vw,1.9rem)]'), 'Keep mission font size');
assert(mission.includes('leading-[1.62]'), 'Keep mission line height');
assert(mission.includes('prose-copy max-w-[64ch]'), 'Keep mission justified reading measure');

console.log(`PASS: 16 light text/surface pairs (minimum ${Math.min(...contrastResults).toFixed(2)}:1).`);
console.log('PASS: control borders, contact feedback, primary action and selected filter contrast.');
console.log('PASS: dark palette, compiled theme utilities, component scope and mission typography.');
console.log('Browser screenshots and interactive behavior still require a connected browser.');
