import type { CustomSectionData } from './types';

export interface HomeRegion { id: string; visible: boolean }
export const HOME_REGIONS = {
  hero: 'Mở đầu (Hero)', stats: 'Thống kê', faculty: 'Giới thiệu khoa',
  products: 'Sản phẩm', quiz: 'Trắc nghiệm', contact: 'Liên hệ', mission: 'Sứ mệnh & tầm nhìn',
} as const;

export function getHomeLayout(raw: string | undefined, sections: Pick<CustomSectionData, 'Id' | 'OrderIndex'>[]): HomeRegion[] {
  const ids = ['hero', 'stats', 'faculty', 'products',
    ...[...sections].sort((a, b) => a.OrderIndex - b.OrderIndex || a.Id - b.Id).map(s => `section-${s.Id}`),
    'quiz', 'contact', 'mission'];
  let saved: HomeRegion[] = [];
  try { const parsed: unknown = JSON.parse(raw || '[]'); if (Array.isArray(parsed)) saved = parsed; } catch {}
  const seen = new Set<string>();
  const result: HomeRegion[] = [];
  for (const item of saved) {
    if (item && ids.includes(item.id) && !seen.has(item.id)) {
      seen.add(item.id);
      result.push({ id: item.id, visible: item.visible !== false });
    }
  }
  for (const id of ids) {
    if (seen.has(id)) continue;
    const item = { id, visible: true };
    // Newly added custom sections stay in the content area, before the quiz.
    const quizIndex = result.findIndex(region => region.id === 'quiz');
    if (id.startsWith('section-') && quizIndex >= 0) result.splice(quizIndex, 0, item);
    else result.push(item);
  }
  return result;
}
