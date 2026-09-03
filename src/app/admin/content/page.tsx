"use client";
import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Type, 
  MapPin, 
  CheckCircle2,
  ImagePlus
} from 'lucide-react';
import DynamicIcon from '@/components/DynamicIcon';

interface ContentItem {
  SectionKey: string;
  Content: string;
}

export default function ContentManager() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/admin/content')
      .then(async (res) => res.ok ? res.json() as Promise<ContentItem[]> : [])
      .then((data) => {
        if (cancelled) return;
        const map: Record<string, string> = {};
        data.forEach((item) => {
          map[item.SectionKey] = item.Content;
        });
        setContent(map);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleUpdate = async (key: string) => {
    setSaving(key);
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ SectionKey: key, Content: content[key] })
    });

    if (res.ok) {
      setSuccess(key);
      setTimeout(() => setSuccess(null), 3000);
    }
    setSaving(null);
  };

  const handleFileUpload = async (key: string, file: File) => {
    setUploading(key);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
         body: formData,
         credentials: 'include',
    });

      if (!res.ok) {
         let message = `Tải ảnh thất bại (${res.status})`;
         try {
            const data = await res.json();
            if (data?.error) message = data.error;
         } catch {}
         alert(message);
         setUploading(null);
         return;
      }

      const { url } = await res.json();
      setContent(prev => ({ ...prev, [key]: url }));
      setSuccess(key);
      setTimeout(() => setSuccess(null), 3000);
    setUploading(null);
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-black text-white mb-2">Thông tin <span className="text-lhu-orange">Chung</span></h1>
           <p className="text-slate-400">Chỉnh sửa các văn bản cố định như Tiêu đề, Giới thiệu và Liên hệ.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Hero & About Section */}
         <div className="space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-3 px-4"><Type className="text-lhu-blue" /> Trang chủ & Giới thiệu</h2>
            
            <ContentCard 
               label="Tiêu đề Hero (Hỗ trợ HTML)"
               value={content.hero_title || ''}
               onChange={(val: string) => setContent({...content, hero_title: val})}
               onSave={() => handleUpdate('hero_title')}
               isSaving={saving === 'hero_title'}
               isSuccess={success === 'hero_title'}
            />

            <ContentCard 
               label="Phụ đề Hero"
               value={content.hero_subtitle || ''}
               onChange={(val: string) => setContent({...content, hero_subtitle: val})}
               onSave={() => handleUpdate('hero_subtitle')}
               isSaving={saving === 'hero_subtitle'}
               isSuccess={success === 'hero_subtitle'}
               textarea
            />

            <ContentCard 
               label="Giới thiệu Khoa CNTT (Hỗ trợ HTML)"
               value={content.about_faculty || ''}
               onChange={(val: string) => setContent({...content, about_faculty: val})}
               onSave={() => handleUpdate('about_faculty')}
               isSaving={saving === 'about_faculty'}
               isSuccess={success === 'about_faculty'}
               textarea
               rows={6}
            />

            <ContentCard 
               label="Hình ảnh về Khoa (Tải lên hoặc URL)"
               value={content.about_faculty_image || ''}
               onChange={(val: string) => setContent({...content, about_faculty_image: val})}
               onSave={() => handleUpdate('about_faculty_image')}
               onUpload={(file: File) => handleFileUpload('about_faculty_image', file)}
               isSaving={saving === 'about_faculty_image'}
               isUploading={uploading === 'about_faculty_image'}
               isSuccess={success === 'about_faculty_image'}
            />
         </div>

         {/* Contact & Footer Section */}
         <div className="space-y-8">
            <h2 className="text-xl font-bold flex items-center gap-3 px-4"><MapPin className="text-lhu-orange" /> Thông tin liên hệ</h2>

            <ContentCard 
               label="Địa chỉ trụ sở"
               value={content.contact_address || ''}
               onChange={(val: string) => setContent({...content, contact_address: val})}
               onSave={() => handleUpdate('contact_address')}
               isSaving={saving === 'contact_address'}
               isSuccess={success === 'contact_address'}
            />

            <ContentCard 
               label="Số điện thoại / Hotline"
               value={content.contact_phone || ''}
               onChange={(val: string) => setContent({...content, contact_phone: val})}
               onSave={() => handleUpdate('contact_phone')}
               isSaving={saving === 'contact_phone'}
               isSuccess={success === 'contact_phone'}
            />

            <ContentCard 
               label="Email chính thức"
               value={content.contact_email || ''}
               onChange={(val: string) => setContent({...content, contact_email: val})}
               onSave={() => handleUpdate('contact_email')}
               isSaving={saving === 'contact_email'}
               isSuccess={success === 'contact_email'}
            />

            <ContentCard 
               label="Sứ mệnh & Tầm nhìn (Footer)"
               value={content.it_industry_info || ''}
               onChange={(val: string) => setContent({...content, it_industry_info: val})}
               onSave={() => handleUpdate('it_industry_info')}
               isSaving={saving === 'it_industry_info'}
               isSuccess={success === 'it_industry_info'}
               textarea
            />

               <h2 className="text-xl font-bold flex items-center gap-3 px-4 mt-6"><Type className="text-lhu-blue" /> Footer</h2>

               <ContentCard 
                  label="Tiêu đề Footer"
                  value={content.footer_title || ''}
                  onChange={(val: string) => setContent({...content, footer_title: val})}
                  onSave={() => handleUpdate('footer_title')}
                  isSaving={saving === 'footer_title'}
                  isSuccess={success === 'footer_title'}
               />

               <ContentCard 
                  label="Địa chỉ Footer"
                  value={content.footer_address || ''}
                  onChange={(val: string) => setContent({...content, footer_address: val})}
                  onSave={() => handleUpdate('footer_address')}
                  isSaving={saving === 'footer_address'}
                  isSuccess={success === 'footer_address'}
                  textarea
               />

               <ContentCard 
                  label="Dòng bản quyền Footer"
                  value={content.footer_copy || ''}
                  onChange={(val: string) => setContent({...content, footer_copy: val})}
                  onSave={() => handleUpdate('footer_copy')}
                  isSaving={saving === 'footer_copy'}
                  isSuccess={success === 'footer_copy'}
               />

                      {/* Footer configuration controls */}
                      <div className="space-y-6">
                           <label htmlFor="footer-layout" className="text-sm font-bold">Bố cục Footer</label>
                           <div className="flex items-center gap-3">
                              <select id="footer-layout" value={content.footer_layout || '3-col'} onChange={e => setContent({...content, footer_layout: e.target.value})} className="p-3 bg-slate-800 border border-white/10 rounded-2xl text-white outline-none">
                                 <option value="1-col">1 cột (Center)</option>
                                 <option value="2-col">2 cột</option>
                                 <option value="3-col">3 cột</option>
                              </select>
                              <button onClick={() => handleUpdate('footer_layout')} className="px-4 py-3 bg-lhu-blue text-white rounded-2xl">Lưu bố cục</button>
                           </div>

                           <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2">
                                  <input type="checkbox" checked={content.footer_show_map === '1' || content.footer_show_map === 'true'} onChange={e => setContent({...content, footer_show_map: e.target.checked ? '1' : '0'})} className="w-5 h-5" />
                                 <span className="text-sm">Hiển thị bản đồ</span>
                              </label>
                              <button onClick={() => handleUpdate('footer_show_map')} className="px-4 py-3 bg-lhu-blue text-white rounded-2xl">Lưu</button>
                           </div>

                           <div>
                              <label htmlFor="footer-map-embed" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Embed bản đồ (iframe)</label>
                              <textarea id="footer-map-embed" rows={3} value={content.footer_map_embed || ''} onChange={e => setContent({...content, footer_map_embed: e.target.value})} className="w-full p-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-sm outline-none" />
                              <div className="mt-2">
                                 <button onClick={() => handleUpdate('footer_map_embed')} className="px-4 py-3 bg-lhu-blue text-white rounded-2xl">Lưu embed</button>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                 <label htmlFor="footer-facebook" className="text-sm font-bold">Liên kết Facebook</label>
                                 <input id="footer-facebook" type="url" value={content.footer_social_facebook || ''} onChange={e => setContent({...content, footer_social_facebook: e.target.value})} className="w-full p-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-sm outline-none" />
                              </div>
                              <div>
                                 <label htmlFor="footer-zalo" className="text-sm font-bold">Liên kết Zalo</label>
                                 <input id="footer-zalo" type="url" value={content.footer_social_zalo || ''} onChange={e => setContent({...content, footer_social_zalo: e.target.value})} className="w-full p-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-sm outline-none" />
                              </div>
                              <div>
                                 <label htmlFor="footer-instagram" className="text-sm font-bold">Liên kết Instagram</label>
                                 <input id="footer-instagram" type="url" value={content.footer_social_instagram || ''} onChange={e => setContent({...content, footer_social_instagram: e.target.value})} className="w-full p-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-sm outline-none" />
                              </div>
                              <div>
                                 <label htmlFor="footer-youtube" className="text-sm font-bold">Liên kết YouTube</label>
                                 <input id="footer-youtube" type="url" value={content.footer_social_youtube || ''} onChange={e => setContent({...content, footer_social_youtube: e.target.value})} className="w-full p-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-sm outline-none" />
                              </div>
                              <div>
                                 <label htmlFor="footer-linkedin" className="text-sm font-bold">Liên kết LinkedIn</label>
                                 <input id="footer-linkedin" type="url" value={content.footer_social_linkedin || ''} onChange={e => setContent({...content, footer_social_linkedin: e.target.value})} className="w-full p-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-sm outline-none" />
                              </div>
                              <div>
                                 <label htmlFor="footer-tiktok" className="text-sm font-bold">Liên kết TikTok</label>
                                 <input id="footer-tiktok" type="url" value={content.footer_social_tiktok || ''} onChange={e => setContent({...content, footer_social_tiktok: e.target.value})} className="w-full p-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-sm outline-none" />
                              </div>
                           </div>

                           <div className="mt-3">
                              <button onClick={() => { ['footer_social_facebook','footer_social_zalo','footer_social_instagram','footer_social_youtube','footer_social_linkedin','footer_social_tiktok'].forEach(k => handleUpdate(k)); }} className="px-6 py-3 bg-green-600 text-white rounded-2xl">Lưu liên kết xã hội</button>
                           </div>
                      </div>

                      {/* Live preview */}
                      <FooterPreview content={content} />
         </div>
      </div>
    </div>
  );
}

interface ContentCardProps {
   label: string;
   value: string;
   onChange: (value: string) => void;
   onSave: () => void;
   onUpload?: (file: File) => void;
   isSaving: boolean;
   isUploading?: boolean;
   isSuccess: boolean;
   textarea?: boolean;
   rows?: number;
}

function ContentCard({ label, value, onChange, onSave, onUpload, isSaving, isUploading, isSuccess, textarea, rows = 3 }: ContentCardProps) {
   const fileInputRef = React.useRef<HTMLInputElement>(null);
   const fieldId = React.useId();

   return (
      <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[20px] space-y-4 hover:border-white/20 transition-all font-medium text-foreground">
         <div className="flex justify-between items-center">
            <label htmlFor={fieldId} className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
            {isSuccess && <span role="status" className="text-green-500 text-[10px] font-bold flex items-center gap-1"><CheckCircle2 size={12} /> Đã lưu</span>}
         </div>
         
         <div className="relative group/input">
            {textarea ? (
               <textarea 
                  id={fieldId}
                  rows={rows}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all resize-none text-sm leading-relaxed"
               />
            ) : (
               <div className="relative">
                  <input 
                     id={fieldId}
                     type="text"
                     value={value}
                     onChange={(e) => onChange(e.target.value)}
                     className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all text-sm pr-12"
                  />
                  {onUpload && (
                     <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <button 
                           type="button"
                            disabled={isUploading}
                            aria-label={`Tải ảnh cho ${label}`}
                           onClick={() => fileInputRef.current?.click()}
                           className="p-2 bg-slate-800 hover:bg-lhu-blue text-slate-400 hover:text-white rounded-xl transition-all"
                           title="Tải ảnh từ máy tính"
                        >
                           {isUploading ? (
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                           ) : (
                              <ImagePlus size={18} />
                           )}
                        </button>
                        <input 
                           type="file"
                           ref={fileInputRef}
                           onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) onUpload(file);
                           }}
                           className="hidden"
                           accept="image/*"
                        />
                     </div>
                  )}
               </div>
            )}
         </div>

         <button 
            disabled={isSaving}
            onClick={onSave}
            className={`w-full py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${isSuccess ? 'bg-green-600/20 text-green-500' : 'bg-lhu-blue/10 text-lhu-blue hover:bg-lhu-blue hover:text-white'}`}
         >
            {isSaving ? 'Đang lưu...' : isSuccess ? 'Thành công' : <><Save size={14} /> Lưu thay đổi</>}
         </button>
      </div>
   );
}

function FooterPreview({ content }: { content: Record<string, string> }) {
   const layout = content.footer_layout || '3-col';
   const showMap = content.footer_show_map === '1' || content.footer_show_map === 'true';
   const mapEmbed = content.footer_map_embed || '';

   const socials = {
      facebook: content.footer_social_facebook,
      zalo: content.footer_social_zalo,
      instagram: content.footer_social_instagram,
      youtube: content.footer_social_youtube,
      linkedin: content.footer_social_linkedin,
      tiktok: content.footer_social_tiktok,
   };

   return (
      <div className="mt-6 p-4 bg-white/5 border border-white/5 rounded-2xl">
         {showMap && mapEmbed && (
            <div className="mb-4 rounded overflow-hidden" dangerouslySetInnerHTML={{ __html: mapEmbed }} />
         )}

         {layout === '1-col' && (
            <div className="text-center">
               <div className="font-bold text-white">{content.footer_title || 'Tiêu đề Footer'}</div>
               <div className="text-sm text-slate-400">{content.footer_address || 'Địa chỉ...'}</div>
               <div className="mt-3 flex items-center justify-center gap-3 text-slate-300">
                  {socials.facebook && <a aria-label="Facebook" href={socials.facebook}><DynamicIcon name="Facebook" size={18} /></a>}
                  {socials.zalo && <a aria-label="Zalo" href={socials.zalo}><DynamicIcon name="MessageSquare" size={18} /></a>}
                  {socials.instagram && <a aria-label="Instagram" href={socials.instagram}><DynamicIcon name="Instagram" size={18} /></a>}
               </div>
            </div>
         )}

         {layout === '2-col' && (
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <div className="font-bold text-white">{content.footer_title || 'Tiêu đề Footer'}</div>
                  <div className="text-sm text-slate-400">{content.footer_address || 'Địa chỉ...'}</div>
               </div>
               <div className="flex items-center justify-end gap-3 text-slate-300">
                  {socials.facebook && <a aria-label="Facebook" href={socials.facebook}><DynamicIcon name="Facebook" size={18} /></a>}
                  {socials.zalo && <a aria-label="Zalo" href={socials.zalo}><DynamicIcon name="MessageSquare" size={18} /></a>}
                  {socials.instagram && <a aria-label="Instagram" href={socials.instagram}><DynamicIcon name="Instagram" size={18} /></a>}
               </div>
            </div>
         )}

         {layout === '3-col' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="font-bold text-white">{content.footer_title || 'Tiêu đề Footer'}</div>
               <div className="text-sm text-slate-400">{content.footer_address || 'Địa chỉ...'}</div>
               <div className="flex gap-3 text-slate-300">
                  {socials.facebook && <a aria-label="Facebook" href={socials.facebook}><DynamicIcon name="Facebook" size={18} /></a>}
                  {socials.zalo && <a aria-label="Zalo" href={socials.zalo}><DynamicIcon name="MessageSquare" size={18} /></a>}
                  {socials.instagram && <a aria-label="Instagram" href={socials.instagram}><DynamicIcon name="Instagram" size={18} /></a>}
               </div>
            </div>
         )}

         <div className="mt-4 text-xs text-slate-500">{content.footer_copy || `© ${new Date().getFullYear()} LHU Tech Hub`}</div>
      </div>
   );
}
