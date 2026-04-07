"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown,
  Layout,
  Code
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Section {
  Id: number;
  Title: string;
  Subtitle?: string;
  LayoutType: string;
  ContentJson: string;
  BgStyle: string;
  OrderIndex: number;
  IsActive: boolean;
  PageKey: string;
}

const ICON_OPTIONS = [
  'Code', 'Cpu', 'Globe', 'Zap', 'Users', 'Star', 'Award', 'BookOpen', 
  'Briefcase', 'Shield', 'Activity', 'TrendingUp', 'Lightbulb', 
  'MessageSquare', 'Monitor', 'Smartphone', 'LayoutGrid', 'Terminal', 
  'Layers', 'Settings', 'Rocket', 'Heart', 'Flame', 'CheckCircle2'
];

export default function SectionsManager() {
  const [sections, setSections] = useState<Section[]>([]);
  const [activePage, setActivePage] = useState<'home' | 'academic' | 'all'>('home');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Section>>({
    Title: '',
    Subtitle: '',
    LayoutType: '3-col',
    ContentJson: '[]',
    BgStyle: 'default',
    OrderIndex: 0,
    IsActive: true,
    PageKey: 'home'
  });

  const [editorMode, setEditorMode] = useState<'visual' | 'raw'>('visual');
  const [contentItems, setContentItems] = useState<any[]>([]);

  // Helpers for visual editor
  const syncJson = (items: any[]) => {
    setFormData(prev => ({ ...prev, ContentJson: JSON.stringify(items) }));
  };

  const addItem = () => {
    const newItems = [...contentItems, { title: '', body: '', icon: 'Rocket' }];
    setContentItems(newItems);
    syncJson(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = contentItems.filter((_, i) => i !== index);
    setContentItems(newItems);
    syncJson(newItems);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = contentItems.map((item, i) => i === index ? { ...item, [field]: value } : item);
    setContentItems(newItems);
    syncJson(newItems);
  };

  const moveItem = (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= contentItems.length) return;
    const newItems = [...contentItems];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    setContentItems(newItems);
    syncJson(newItems);
  };

  const fetchSections = async (page: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/sections?pageKey=${page}`);
    if (res.ok) {
      const data = await res.json();
      setSections(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSections(activePage);
  }, [activePage]);

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setFormData({ ...section, PageKey: section.PageKey || 'home' });
    try {
        const items = JSON.parse(section.ContentJson || '[]');
        setContentItems(Array.isArray(items) ? items : []);
    } catch (e) {
        setContentItems([]);
    }
    setEditorMode('visual');
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingSection(null);
    setFormData({
        Title: '',
        Subtitle: '',
        LayoutType: '3-col',
        ContentJson: '[]',
        BgStyle: 'default',
        OrderIndex: 0,
        IsActive: true,
        PageKey: activePage
      });
      setContentItems([]);
      setEditorMode('visual');
      setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa section này?')) return;
    const res = await fetch(`/api/admin/sections?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchSections(activePage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingSection ? 'PUT' : 'POST';
    
    // Validate JSON
    try {
        JSON.parse(formData.ContentJson || '[]');
    } catch (err) {
        alert('Định dạng JSON không hợp lệ!');
        return;
    }

    const res = await fetch('/api/admin/sections', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingSection(null);
      fetchSections(activePage);
    }
  };

  const IconComponent = ({ name, size = 20, className }: any) => {
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon size={size} className={className} /> : <LucideIcons.HelpCircle size={size} className={className} />;
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-black text-white mb-2">Quản lý <span className="text-lhu-orange">Khung động</span></h1>
           <p className="text-slate-400">Tự thiết kế bố cục và nội dung linh hoạt cho các trang.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-8 py-4 bg-lhu-blue text-white rounded-2xl font-bold shadow-xl shadow-lhu-blue/20 hover:scale-105 transition-all"
        >
          <Plus size={20} /> Tạo khung mới
        </button>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-4 p-2 bg-white/5 rounded-3xl border border-white/10 w-fit">
         <button 
            onClick={() => setActivePage('home')}
            className={`px-8 py-3 rounded-2xl font-bold transition-all ${activePage === 'home' ? 'bg-lhu-blue text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
         >
            Trang chủ
         </button>
         <button 
            onClick={() => setActivePage('academic')}
            className={`px-8 py-3 rounded-2xl font-bold transition-all ${activePage === 'academic' ? 'bg-lhu-orange text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
         >
            Ngành đào tạo
         </button>
         <button 
            onClick={() => setActivePage('all')}
            className={`px-8 py-3 rounded-2xl font-bold transition-all ${activePage === 'all' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
         >
            Tất cả (Global)
         </button>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
           <div className="md:col-span-2 py-32 text-center text-slate-500">Đang tải dữ liệu...</div>
        ) : sections.length === 0 ? (
            <div className="md:col-span-2 py-32 text-center text-slate-500 bg-white/5 rounded-[32px] border border-dashed border-white/10">
               {activePage === 'all' 
                 ? 'Chưa có khung dùng chung (Global) nào. Các khung ở đây sẽ hiển thị trên mọi trang.' 
                 : 'Chưa có khung nào cho trang này. Nhấn "Tạo khung mới" để bắt đầu.'}
            </div>
        ) : sections.map((s) => (
          <motion.div 
            key={s.Id}
            layoutId={`section-${s.Id}`}
            className={`bg-white/5 border border-white/10 rounded-[28px] p-8 flex flex-col gap-6 relative group hover:border-lhu-orange/50 transition-all ${!s.IsActive && 'opacity-50 grayscale'}`}
          >
             <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-lhu-orange/20 flex items-center justify-center text-lhu-orange">
                      <Layout size={20} />
                   </div>
                   <div>
                      <h3 className="text-xl font-bold text-white line-clamp-1" dangerouslySetInnerHTML={{ __html: s.Title }} />
                      <p className="text-xs text-slate-500 uppercase font-black tracking-widest">{s.LayoutType} • Order: {s.OrderIndex}</p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => handleEdit(s)} className="p-3 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white"><Edit2 size={18} /></button>
                   <button onClick={() => handleDelete(s.Id)} className="p-3 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
             </div>

             <div className="flex-1 bg-black/20 rounded-2xl p-4 border border-white/5 font-mono text-[10px] text-slate-500 overflow-hidden line-clamp-3 text-ellipsis">
                {s.ContentJson}
             </div>

             <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                <span className={`flex items-center gap-2 text-xs font-bold ${s.IsActive ? 'text-green-500' : 'text-slate-500'}`}>
                   {s.IsActive ? <><Eye size={16} /> Hiển thị</> : <><EyeOff size={16} /> Đã tắt</>}
                </span>
                <span className="text-[10px] font-black uppercase text-slate-600 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                   {s.BgStyle}
                </span>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[2000]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl max-h-[90vh] bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl z-[2001] flex flex-col overflow-hidden"
            >
               <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h2 className="text-2xl font-black text-white">{editingSection ? 'Sửa khung động' : 'Tạo khung mới'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400"><X size={24} /></button>
               </div>

               <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Page Selection */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Thuộc trang</label>
                        <select 
                          value={formData.PageKey} onChange={e => setFormData({...formData, PageKey: e.target.value})}
                          className="w-full p-4 bg-slate-800 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        >
                          <option value="home">Trang chủ</option>
                          <option value="academic">Ngành đào tạo</option>
                          <option value="all">Tất cả các trang (Global)</option>
                        </select>
                      </div>

                      {/* Layout Type */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Bố cục cột</label>
                        <select 
                          value={formData.LayoutType} onChange={e => setFormData({...formData, LayoutType: e.target.value})}
                          className="w-full p-4 bg-slate-800 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        >
                          <option value="1-col">1 Cột (Full width)</option>
                          <option value="2-col">2 Cột (Split)</option>
                          <option value="3-col">3 Cột (Grid)</option>
                          <option value="4-col">4 Cột (Dense Grid)</option>
                          <option value="timeline">Lộ trình Timeline (Dọc)</option>
                          <option value="product-showcase">Danh sách sản phẩm động</option>
                          <option value="script-embed">Nhúng Script (Chatbot/Widget)</option>
                        </select>
                      </div>

                      {/* Title */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tiêu đề (Hỗ trợ HTML)</label>
                        <input 
                          type="text" required
                          value={formData.Title} onChange={e => setFormData({...formData, Title: e.target.value})}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        />
                      </div>

                      {/* Subtitle */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phụ đề</label>
                        <input 
                          type="text"
                          value={formData.Subtitle} onChange={e => setFormData({...formData, Subtitle: e.target.value})}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        />
                      </div>

                      {/* Background Style */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phong cách nền</label>
                        <select 
                          value={formData.BgStyle} onChange={e => setFormData({...formData, BgStyle: e.target.value})}
                          className="w-full p-4 bg-slate-800 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        >
                          <option value="default">Trong suốt (Mặc định)</option>
                          <option value="muted">Xám nhẹ (Muted)</option>
                          <option value="gradient">Gradient (Chuyển sắc cao cấp)</option>
                        </select>
                      </div>

                      {/* Order */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Thứ tự hiển thị (Nhỏ đứng trước)</label>
                        <input 
                          type="number" required
                          value={formData.OrderIndex} onChange={e => setFormData({...formData, OrderIndex: parseInt(e.target.value)})}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        />
                      </div>

                      {/* Active Toggle */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Trạng thái hiển thị</label>
                        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                           <input 
                              type="checkbox" 
                              checked={formData.IsActive} 
                              onChange={e => setFormData({...formData, IsActive: e.target.checked})}
                              className="w-6 h-6 rounded-lg accent-lhu-blue"
                           />
                           <span className="text-white font-medium">Kích hoạt phần này</span>
                        </div>
                      </div>
                  </div>

                  {/* Content Item Editor */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                       <div className="flex items-center gap-3">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none">Thành phần nội dung</label>
                       </div>
                       <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                          <button 
                            type="button"
                            onClick={() => {
                               try {
                                   const items = JSON.parse(formData.ContentJson || '[]');
                                   if (Array.isArray(items)) setContentItems(items);
                               } catch (e) {}
                               setEditorMode('visual');
                            }}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${editorMode === 'visual' ? 'bg-lhu-blue text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                          >Trực quan</button>
                          <button 
                            type="button"
                            onClick={() => setEditorMode('raw')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${editorMode === 'raw' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                          >Mã JSON</button>
                       </div>
                    </div>

                    <AnimatePresence mode="wait">
                       {editorMode === 'visual' ? (
                          <motion.div 
                            key={`visual-editor-${formData.LayoutType}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                          >
                             {formData.LayoutType === 'script-embed' ? (
                                <div className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-3xl">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-2">
                                         <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">Đường dẫn Script (Src)</label>
                                         <input 
                                            type="text" 
                                            value={contentItems[0]?.src || ''}
                                            onChange={(e) => {
                                               const newItems = [{ ...contentItems[0], src: e.target.value }];
                                               setContentItems(newItems);
                                               syncJson(newItems);
                                            }}
                                            className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue"
                                            placeholder="https://example.com/embed.js"
                                         />
                                      </div>
                                      <div className="space-y-2">
                                         <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">ID thẻ Script</label>
                                         <input 
                                            type="text" 
                                            value={contentItems[0]?.id || ''}
                                            onChange={(e) => {
                                               const newItems = [{ ...contentItems[0], id: e.target.value }];
                                               setContentItems(newItems);
                                               syncJson(newItems);
                                            }}
                                            className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue"
                                         />
                                      </div>
                                      <div className="space-y-2">
                                         <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">ID Vùng chứa (Container ID)</label>
                                         <input 
                                            type="text" 
                                            value={contentItems[0]?.containerId || ''}
                                            onChange={(e) => {
                                               const newItems = [{ ...contentItems[0], containerId: e.target.value }];
                                               setContentItems(newItems);
                                               syncJson(newItems);
                                            }}
                                            className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue"
                                         />
                                      </div>
                                      <div className="space-y-2">
                                         <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">ID Bot / Token</label>
                                         <input 
                                            type="text" 
                                            value={contentItems[0]?.botId || ''}
                                            onChange={(e) => {
                                               const newItems = [{ ...contentItems[0], botId: e.target.value }];
                                               setContentItems(newItems);
                                               syncJson(newItems);
                                            }}
                                            className="w-full p-4 bg-slate-950/50 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue"
                                         />
                                      </div>
                                   </div>
                                </div>
                             ) : (
                                <>
                                   {contentItems.map((item, index) => (
                                      <motion.div 
                                        key={index}
                                        layout
                                        className="bg-white/5 border border-white/10 p-6 rounded-3xl relative group hover:border-white/20 transition-all"
                                      >
                                         <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                                            <div className="md:col-span-2 space-y-2">
                                               <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">Icon</label>
                                               <select 
                                                  value={item.icon || ''}
                                                  onChange={(e) => updateItem(index, 'icon', e.target.value)}
                                                  className="w-full p-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-lhu-blue transition-all"
                                               >
                                                  <option value="">Chọn Icon</option>
                                                  {ICON_OPTIONS.map(opt => (
                                                     <option key={opt} value={opt}>{opt}</option>
                                                  ))}
                                               </select>
                                            </div>
                                            <div className="md:col-span-4 space-y-2">
                                               <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">Tiêu đề</label>
                                               <input 
                                                  type="text" 
                                                  value={item.title || ''}
                                                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                                                  className="w-full p-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-lhu-blue"
                                               />
                                            </div>
                                            <div className="md:col-span-5 space-y-2">
                                               <label className="text-[10px] font-bold text-slate-600 uppercase ml-1">Nội dung chi tiết</label>
                                               <textarea 
                                                  rows={2}
                                                  value={item.body || ''}
                                                  onChange={(e) => updateItem(index, 'body', e.target.value)}
                                                  className="w-full p-3 bg-slate-950/50 border border-white/10 rounded-xl text-white text-xs outline-none focus:border-lhu-blue resize-none"
                                               />
                                            </div>
                                            <div className="md:col-span-1 pt-6 flex justify-end">
                                               <button 
                                                  type="button"
                                                  onClick={() => removeItem(index)}
                                                  className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                               >
                                                  <Trash2 size={18} />
                                               </button>
                                            </div>
                                         </div>

                                         <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button type="button" onClick={() => moveItem(index, -1)} className="p-1 bg-slate-800 border border-white/10 rounded-md text-slate-400 hover:text-white"><ChevronUp size={14} /></button>
                                            <button type="button" onClick={() => moveItem(index, 1)} className="p-1 bg-slate-800 border border-white/10 rounded-md text-slate-400 hover:text-white"><ChevronDown size={14} /></button>
                                         </div>
                                      </motion.div>
                                   ))}

                                   <button 
                                      type="button"
                                      onClick={addItem}
                                      className="w-full py-4 border-2 border-dashed border-white/10 rounded-3xl text-slate-500 font-bold text-sm hover:border-lhu-blue/50 hover:text-lhu-blue hover:bg-lhu-blue/5 transition-all flex items-center justify-center gap-2"
                                   >
                                      <Plus size={18} /> Thêm thành phần nội dung mới
                                   </button>
                                </>
                             )}
                          </motion.div>
                       ) : (
                          <motion.div 
                            key="raw-editor"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                          >
                             <textarea 
                                rows={10} required
                                value={formData.ContentJson} 
                                onChange={e => setFormData({...formData, ContentJson: e.target.value})}
                                className="w-full p-6 bg-slate-950/50 border border-white/10 rounded-3xl text-sm font-mono text-green-400 outline-none focus:border-lhu-blue transition-all resize-none shadow-inner"
                             />
                          </motion.div>
                       )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-8 flex gap-4">
                     <button type="submit" className="flex-1 py-5 bg-lhu-blue text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all shadow-xl shadow-lhu-blue/20">
                        {editingSection ? 'Lưu thay đổi' : 'Xác nhận tạo khung'}
                     </button>
                  </div>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
