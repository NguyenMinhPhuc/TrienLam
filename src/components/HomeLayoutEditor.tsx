'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { adminRequest } from '@/lib/admin-request';
import { getHomeLayout, HOME_REGIONS, type HomeRegion } from '@/lib/home-layout';
import type { CustomSectionData } from '@/lib/types';

export default function HomeLayoutEditor() {
  const [sections, setSections] = useState<CustomSectionData[]>([]);
  const [regions, setRegions] = useState<HomeRegion[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  useEffect(() => {
    let cancelled = false;
    void Promise.all([adminRequest('/api/admin/content'), adminRequest('/api/admin/sections?pageKey=home')])
      .then(async ([c, s]) => {
        if (!c.ok || !s.ok) return;
        const [rows, data] = await Promise.all([c.json(), s.json()]);
        if (cancelled) return;
        setSections(data);
        setRegions(getHomeLayout(rows.find((r: { SectionKey: string }) => r.SectionKey === 'home_layout')?.Content, data));
      });
    return () => { cancelled = true; };
  }, []);

  const save = async () => {
    setSaving(true);
    const response = await adminRequest('/api/admin/content', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ SectionKey: 'home_layout', Content: JSON.stringify(regions) }),
    });
    setSaving(false);
    if (response.ok) setStatus('Đã lưu bố cục trang chủ.');
  };
  return (
    <section id="home-layout" className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
      <h2 className="text-xl font-bold text-white">Vị trí & hiển thị các phân khu</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">Di chuyển lên/xuống để đổi vị trí; bỏ chọn để ẩn. Khung động thêm/xóa tại mục Khung động. Sau khi lưu bố cục này, thứ tự ở đây được ưu tiên hơn số thứ tự của khung động.</p>
      <div className="mt-6 divide-y divide-white/10">
        {regions.map((region, index) => {
          const section = sections.find(s => `section-${s.Id}` === region.id);
          const label = section ? section.Title.replace(/<[^>]*>/g, '') : HOME_REGIONS[region.id as keyof typeof HOME_REGIONS];
          const move = (offset: number) => {
            setRegions(current => { const next = [...current]; [next[index], next[index + offset]] = [next[index + offset], next[index]]; return next; });
            setStatus('Chưa lưu bố cục.');
          };
          return (
            <div key={region.id} className="flex items-center gap-3 py-3">
              <label className="flex min-w-0 flex-1 items-center gap-3 text-sm text-white">
                <input type="checkbox" disabled={saving} checked={region.visible} onChange={e => { setRegions(current => current.map(r => r.id === region.id ? { ...r, visible: e.target.checked } : r)); setStatus('Chưa lưu bố cục.'); }} className="size-5 accent-lhu-blue" />
                <span>{label}{section && !section.IsActive ? ' (đang tắt trong Khung động)' : ''}</span>
              </label>
              <button type="button" aria-label={`Đưa ${label} lên`} disabled={index === 0 || saving} onClick={() => move(-1)} className="rounded-lg p-3 text-white hover:bg-white/10 disabled:opacity-30"><ArrowUp size={18} /></button>
              <button type="button" aria-label={`Đưa ${label} xuống`} disabled={index === regions.length - 1 || saving} onClick={() => move(1)} className="rounded-lg p-3 text-white hover:bg-white/10 disabled:opacity-30"><ArrowDown size={18} /></button>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="button" disabled={saving || !regions.length} onClick={() => void save()} className="rounded-xl bg-lhu-blue px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Đang lưu...' : 'Lưu bố cục'}</button>
        <button type="button" disabled={saving || !regions.length} onClick={() => { setRegions(getHomeLayout(undefined, sections)); setStatus('Đã chọn bố cục mặc định. Bấm Lưu bố cục để áp dụng.'); }} className="px-3 py-3 text-sm text-slate-300">Khôi phục thứ tự mặc định</button>
        <p role="status" className="text-sm text-slate-300">{status}</p>
      </div>
    </section>
  );
}
