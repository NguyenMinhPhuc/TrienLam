"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save, 
  Type, 
  AlignLeft, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle2,
  AlertCircle,
  ImagePlus
} from 'lucide-react';

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

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/content');
    if (res.ok) {
        const data: ContentItem[] = await res.json();
        const map: Record<string, string> = {};
        data.forEach(item => {
            map[item.SectionKey] = item.Content;
        });
        setContent(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
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
      body: formData
    });

    if (res.ok) {
      const { url } = await res.json();
      setContent(prev => ({ ...prev, [key]: url }));
      setSuccess(key);
      setTimeout(() => setSuccess(null), 3000);
    }
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
         </div>
      </div>
    </div>
  );
}

function ContentCard({ label, value, onChange, onSave, onUpload, isSaving, isUploading, isSuccess, textarea, rows = 3 }: any) {
   const fileInputRef = React.useRef<HTMLInputElement>(null);

   return (
      <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[20px] space-y-4 hover:border-white/20 transition-all font-medium text-foreground">
         <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
            {isSuccess && <span className="text-green-500 text-[10px] font-bold flex items-center gap-1 animate-bounce"><CheckCircle2 size={12} /> Đã lưu</span>}
         </div>
         
         <div className="relative group/input">
            {textarea ? (
               <textarea 
                  rows={rows}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all resize-none text-sm leading-relaxed"
               />
            ) : (
               <div className="relative">
                  <input 
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
