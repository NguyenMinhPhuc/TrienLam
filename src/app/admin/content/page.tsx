"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  CheckCircle2,
  FileText,
  HelpCircle,
  ImagePlus,
  Layers,
  Package,
  Save,
} from 'lucide-react';
import CmsImage from '@/components/CmsImage';
import {
  SITE_CONTENT_DEFAULTS,
  SITE_CONTENT_GROUPS,
  type SiteContentFieldDefinition,
  type SiteContentKey,
} from '@/lib/site-content';

interface ContentItem {
  SectionKey: string;
  Content: string;
}

const specialistLinks = [
  { href: '/admin/products', label: 'Sản phẩm & ảnh dự án', description: 'Tên, mô tả, tác giả, hình ảnh và đường dẫn dự án', icon: Package },
  { href: '/admin/stats', label: 'Các con số thống kê', description: 'Giá trị, nhãn, biểu tượng và thứ tự hiển thị', icon: BarChart3 },
  { href: '/admin/quiz', label: 'Câu hỏi trắc nghiệm', description: 'Câu hỏi, phương án, kết quả và ngành gợi ý', icon: HelpCircle },
  { href: '/admin/sections', label: 'Khung nội dung động', description: 'Bố cục, nội dung, ảnh và liên kết của từng khung', icon: Layers },
];

export default function ContentManager() {
  const [content, setContent] = useState<Record<string, string>>({ ...SITE_CONTENT_DEFAULTS });
  const [dirtyKeys, setDirtyKeys] = useState<Set<SiteContentKey>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingKeys, setSavingKeys] = useState<Set<SiteContentKey>>(new Set());
  const [uploadingKey, setUploadingKey] = useState<SiteContentKey | null>(null);
  const [savedKey, setSavedKey] = useState<SiteContentKey | 'all' | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        const response = await fetch('/api/admin/content');
        if (!response.ok) throw new Error('Không thể tải nội dung từ máy chủ.');
        const rows = await response.json() as ContentItem[];
        if (cancelled) return;
        const stored = Object.fromEntries(rows.map((item) => [item.SectionKey, item.Content]));
        setContent({ ...SITE_CONTENT_DEFAULTS, ...stored });
      } catch (error) {
        if (!cancelled) setMessage(error instanceof Error ? error.message : 'Không thể tải nội dung.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadContent();
    return () => { cancelled = true; };
  }, []);

  const allFieldKeys = useMemo(
    () => SITE_CONTENT_GROUPS.flatMap((group) => group.fields.map((field) => field.key)),
    [],
  );

  const changeContent = (key: SiteContentKey, value: string) => {
    setContent((current) => ({ ...current, [key]: value }));
    setDirtyKeys((current) => new Set(current).add(key));
    setSavedKey(null);
  };

  const saveKeys = async (keys: SiteContentKey[], successMarker: SiteContentKey | 'all') => {
    if (keys.length === 0) return;
    setSavingKeys((current) => new Set([...current, ...keys]));
    setMessage('');

    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: keys.map((key) => ({ SectionKey: key, Content: content[key] ?? '' })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Không thể lưu nội dung.');

      setDirtyKeys((current) => {
        const next = new Set(current);
        keys.forEach((key) => next.delete(key));
        return next;
      });
      setSavedKey(successMarker);
      window.setTimeout(() => setSavedKey(null), 3000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể lưu nội dung.');
    } finally {
      setSavingKeys((current) => {
        const next = new Set(current);
        keys.forEach((key) => next.delete(key));
        return next;
      });
    }
  };

  const uploadImage = async (key: SiteContentKey, file: File) => {
    setUploadingKey(key);
    setMessage('');
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || 'Không thể tải ảnh lên.');
      changeContent(key, result.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể tải ảnh lên.');
    } finally {
      setUploadingKey(null);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-slate-400" role="status">Đang tải nội dung trang web...</div>;
  }

  return (
    <div className="space-y-10 pb-32">
      <header className="flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-black text-white md:text-4xl">Nội dung <span className="text-lhu-orange">trang web</span></h1>
          <p className="mt-3 leading-7 text-slate-400">Mỗi trường bên dưới được nối trực tiếp với vùng tương ứng trên trang hiển thị. Việc sửa nội dung không làm thay đổi bố cục hoặc hiệu ứng hiện tại.</p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Link href="/" target="_blank" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-5 text-sm font-bold text-slate-200 hover:bg-white/5">
            Xem trang chủ
          </Link>
          <button
            type="button"
            disabled={dirtyKeys.size === 0 || savingKeys.size > 0}
            onClick={() => void saveKeys(Array.from(dirtyKeys), 'all')}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-lhu-blue px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            {savingKeys.size > 0 ? 'Đang lưu...' : savedKey === 'all' ? <><CheckCircle2 size={17} /> Đã lưu tất cả</> : <><Save size={17} /> Lưu tất cả thay đổi</>}
          </button>
        </div>
      </header>

      {message && (
        <div role="alert" className="rounded-xl border border-red-400/25 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-200">
          {message} Vui lòng thử lại.
        </div>
      )}

      <section aria-labelledby="specialist-heading">
        <div className="mb-5 flex items-center gap-3">
          <FileText className="text-lhu-blue" size={22} aria-hidden="true" />
          <div>
            <h2 id="specialist-heading" className="text-xl font-bold text-white">Nội dung có màn quản lý riêng</h2>
            <p className="mt-1 text-sm text-slate-500">Chọn đúng mục để sửa dữ liệu dạng danh sách.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {specialistLinks.map((item) => (
            <Link key={item.href} href={item.href} className="group min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-5 hover:border-lhu-blue/50 hover:bg-white/[0.06]">
              <item.icon className="text-lhu-orange" size={23} aria-hidden="true" />
              <h3 className="mt-5 font-bold text-white group-hover:text-lhu-blue">{item.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <nav aria-label="Đi nhanh đến phân khu" className="flex gap-2 overflow-x-auto border-y border-white/10 py-4">
        {SITE_CONTENT_GROUPS.map((group) => (
          <a key={group.id} href={`#${group.id}`} className="shrink-0 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:border-lhu-blue/60 hover:text-white">
            {group.title}
          </a>
        ))}
      </nav>

      <div className="space-y-8">
        {SITE_CONTENT_GROUPS.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
            <div className="border-b border-white/10 px-6 py-6 md:px-8">
              <h2 className="text-xl font-bold text-white">{group.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{group.description}</p>
            </div>
            <div className="grid gap-x-7 gap-y-6 p-6 md:grid-cols-2 md:p-8">
              {group.fields.map((field) => (
                <ContentField
                  key={field.key}
                  field={field}
                  value={content[field.key] ?? ''}
                  dirty={dirtyKeys.has(field.key)}
                  saving={savingKeys.has(field.key)}
                  saved={savedKey === field.key}
                  uploading={uploadingKey === field.key}
                  onChange={(value) => changeContent(field.key, value)}
                  onSave={() => void saveKeys([field.key], field.key)}
                  onUpload={(file) => void uploadImage(field.key, file)}
                />
              ))}

              {group.id === 'footer' && (
                <FooterOptions
                  content={content}
                  dirtyKeys={dirtyKeys}
                  savingKeys={savingKeys}
                  savedKey={savedKey}
                  onChange={changeContent}
                  onSave={(key) => void saveKeys([key], key)}
                />
              )}
            </div>
          </section>
        ))}
      </div>

      <p className="text-center text-sm text-slate-500">Đang quản lý {allFieldKeys.length + 2} trường nội dung trực tiếp từ trang admin.</p>
    </div>
  );
}

interface ContentFieldProps {
  field: SiteContentFieldDefinition;
  value: string;
  dirty: boolean;
  saving: boolean;
  saved: boolean;
  uploading: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  onUpload: (file: File) => void;
}

function ContentField({ field, value, dirty, saving, saved, uploading, onChange, onSave, onUpload }: ContentFieldProps) {
  const fieldId = `content-${field.key}`;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiline = field.type === 'textarea' || field.type === 'html';

  return (
    <div className={`min-w-0 space-y-3 ${multiline || field.type === 'image' ? 'md:col-span-2' : ''}`}>
      <div className="flex min-h-5 items-start justify-between gap-4">
        <div>
          <label htmlFor={fieldId} className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{field.label}</label>
          {field.description && <p className="mt-1 text-xs leading-5 text-slate-600">{field.description}</p>}
        </div>
        {dirty && <span className="shrink-0 text-[11px] font-bold text-lhu-orange">Chưa lưu</span>}
        {saved && <span role="status" className="shrink-0 text-[11px] font-bold text-green-400">Đã lưu</span>}
      </div>

      {field.type === 'image' && value && (
        <div className="relative aspect-[16/6] max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-slate-950">
          <CmsImage src={value} alt={`Xem trước: ${field.label}`} sizes="640px" className="object-contain" />
        </div>
      )}

      <div className="flex items-start gap-2">
        {multiline ? (
          <textarea
            id={fieldId}
            rows={field.rows || 4}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="min-w-0 flex-1 resize-y rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-base leading-7 text-white outline-none placeholder:text-slate-600 focus:border-lhu-blue"
          />
        ) : (
          <input
            id={fieldId}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/70 px-4 text-base text-white outline-none placeholder:text-slate-600 focus:border-lhu-blue"
          />
        )}

        {field.type === 'image' && (
          <button
            type="button"
            disabled={uploading}
            aria-label={`Tải ảnh cho ${field.label}`}
            onClick={() => fileInputRef.current?.click()}
            className="grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-slate-800 text-slate-300 hover:border-lhu-blue hover:text-white disabled:opacity-50"
          >
            {uploading ? <span className="size-4 animate-spin rounded-full border-2 border-white/20 border-t-white" /> : <ImagePlus size={19} aria-hidden="true" />}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            event.target.value = '';
          }}
        />
      </div>

      <button
        type="button"
        disabled={!dirty || saving}
        onClick={onSave}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-lhu-blue/15 px-4 text-xs font-bold text-lhu-blue hover:bg-lhu-blue hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Save size={14} aria-hidden="true" /> {saving ? 'Đang lưu...' : 'Lưu trường này'}
      </button>
    </div>
  );
}

interface FooterOptionsProps {
  content: Record<string, string>;
  dirtyKeys: Set<SiteContentKey>;
  savingKeys: Set<SiteContentKey>;
  savedKey: SiteContentKey | 'all' | null;
  onChange: (key: SiteContentKey, value: string) => void;
  onSave: (key: SiteContentKey) => void;
}

function FooterOptions({ content, dirtyKeys, savingKeys, savedKey, onChange, onSave }: FooterOptionsProps) {
  const showMap = content.footer_show_map === '1' || content.footer_show_map === 'true';
  return (
    <>
      <div className="space-y-3">
        <label htmlFor="footer-layout" className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Bố cục chân trang</label>
        <select id="footer-layout" value={content.footer_layout} onChange={(event) => onChange('footer_layout', event.target.value)} className="min-h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-base text-white outline-none focus:border-lhu-blue">
          <option value="1-col">1 cột (Căn giữa)</option>
          <option value="2-col">2 cột</option>
          <option value="3-col">3 cột</option>
        </select>
        <SmallSaveButton fieldKey="footer_layout" dirtyKeys={dirtyKeys} savingKeys={savingKeys} savedKey={savedKey} onSave={onSave} />
      </div>
      <div className="space-y-3">
        <span className="block text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Hiển thị bản đồ</span>
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-slate-950/70 px-4 text-sm font-semibold text-white">
          <input type="checkbox" checked={showMap} onChange={(event) => onChange('footer_show_map', event.target.checked ? '1' : '0')} className="size-5 accent-lhu-blue" />
          Hiển thị bản đồ ở chân trang
        </label>
        <SmallSaveButton fieldKey="footer_show_map" dirtyKeys={dirtyKeys} savingKeys={savingKeys} savedKey={savedKey} onSave={onSave} />
      </div>
    </>
  );
}

function SmallSaveButton({ fieldKey, dirtyKeys, savingKeys, savedKey, onSave }: {
  fieldKey: SiteContentKey;
  dirtyKeys: Set<SiteContentKey>;
  savingKeys: Set<SiteContentKey>;
  savedKey: SiteContentKey | 'all' | null;
  onSave: (key: SiteContentKey) => void;
}) {
  return (
    <button type="button" disabled={!dirtyKeys.has(fieldKey) || savingKeys.has(fieldKey)} onClick={() => onSave(fieldKey)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-lhu-blue/15 px-4 text-xs font-bold text-lhu-blue hover:bg-lhu-blue hover:text-white disabled:cursor-not-allowed disabled:opacity-40">
      <Save size={14} aria-hidden="true" /> {savingKeys.has(fieldKey) ? 'Đang lưu...' : savedKey === fieldKey ? 'Đã lưu' : 'Lưu trường này'}
    </button>
  );
}
