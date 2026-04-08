"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Upload, 
  ExternalLink,
  Check,
  AlertCircle
} from 'lucide-react';
import { Product } from '@/components/ProductCard';

export default function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    Name: '',
    Description: '',
    ImageUrl: '',
    AppUrl: '',
    TechTags: '',
    CareerPath: 'AI',
    Year: new Date().getFullYear(),
    Author: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/products');
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchProducts();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
        credentials: 'include',
      });

      if (!res.ok) {
        let message = `Tải ảnh thất bại (${res.status})`;
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {}
        alert(message);
        return;
      }

      const data = await res.json();
      if (data.url) setFormData(prev => ({ ...prev, ImageUrl: data.url }));
    } catch (err) {
      alert('Lỗi tải ảnh');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProduct ? 'PUT' : 'POST';
    
    const res = await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({
        Name: '',
        Description: '',
        ImageUrl: '',
        AppUrl: '',
        TechTags: '',
        CareerPath: 'AI',
        Year: new Date().getFullYear(),
        Author: ''
      });
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => 
    p.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.Author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-black text-white mb-2">Quản lý <span className="text-lhu-orange">Sản phẩm</span></h1>
           <p className="text-slate-400">Xem, thêm mới hoặc chỉnh sửa các dự án sinh viên trên website.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-8 py-4 bg-lhu-blue text-white rounded-2xl font-bold shadow-xl shadow-lhu-blue/20 hover:scale-105 transition-all"
        >
          <Plus size={20} /> Thêm dự án mới
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center gap-4">
         <Search className="text-slate-500 ml-2" size={20} />
         <input 
            type="text" 
            placeholder="Tìm kiếm dự án hoặc tác giả..."
            className="bg-transparent border-none outline-none text-white w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      {/* Products Table */}
      <div className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden shadow-xl text-foreground transition-colors duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest bg-white/5">
                <th className="px-8 py-6">Dự án</th>
                <th className="px-8 py-6">Tác giả</th>
                <th className="px-8 py-6">Loại hình</th>
                <th className="px-8 py-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
              ) : filteredProducts.map((p) => (
                <tr key={p.Id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10">
                        <img src={p.ImageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white group-hover:text-lhu-orange transition-colors">{p.Name}</p>
                        <p className="text-xs text-slate-500">Năm {p.Year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-400 font-medium">{p.Author || "N/A"}</td>
                  <td className="px-8 py-6">
                     <span className="px-3 py-1 bg-lhu-blue/10 text-lhu-blue rounded-full text-[10px] font-black uppercase tracking-tighter border border-lhu-blue/20">
                        {p.CareerPath}
                     </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => handleEdit(p)} className="p-3 hover:bg-lhu-blue/10 rounded-xl text-slate-400 hover:text-lhu-blue transition-all"><Edit2 size={18} /></button>
                       <button onClick={() => handleDelete(p.Id)} className="p-3 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                  <h2 className="text-2xl font-black text-white">{editingProduct ? 'Sửa dự án' : 'Thêm dự án mới'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-slate-400"><X size={24} /></button>
               </div>

               <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tên dự án</label>
                        <input 
                          type="text" required
                          value={formData.Name} onChange={e => setFormData({...formData, Name: e.target.value})}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        />
                      </div>

                      {/* Author */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tác giả</label>
                        <input 
                          type="text" required
                          value={formData.Author} onChange={e => setFormData({...formData, Author: e.target.value})}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        />
                      </div>

                      {/* Career Path */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phân loại sản phẩm</label>
                        <select 
                          value={formData.CareerPath} onChange={e => setFormData({...formData, CareerPath: e.target.value})}
                          className="w-full p-4 bg-slate-800 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        >
                          <option value="Sản phẩm phần mềm">Sản phẩm phần mềm</option>
                          <option value="Mạng máy tính">Mạng máy tính</option>
                          <option value="Hệ thống IoT">Hệ thống IoT</option>
                          <option value="Trí tuệ nhân tạo">Trí tuệ nhân tạo</option>
                        </select>
                      </div>

                      {/* Year */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Năm dự án</label>
                        <input 
                          type="number" required
                          value={formData.Year} onChange={e => setFormData({...formData, Year: parseInt(e.target.value)})}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        />
                      </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mô tả dự án</label>
                    <textarea 
                      rows={3} required
                      value={formData.Description} onChange={e => setFormData({...formData, Description: e.target.value})}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all resize-none"
                    />
                  </div>

                  {/* Tech Tags */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Công nghệ (Cách nhau bằng dấu phẩy)</label>
                    <input 
                      type="text" required
                      value={formData.TechTags} onChange={e => setFormData({...formData, TechTags: e.target.value})}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                      placeholder="Next.js, Python, OpenCV..."
                    />
                  </div>

                  {/* App URL */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">URL Ứng dụng / Demo</label>
                    <input 
                      type="url" required
                      value={formData.AppUrl} onChange={e => setFormData({...formData, AppUrl: e.target.value})}
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                      placeholder="https://..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Hình ảnh dự án</label>
                    <div className="flex flex-col md:flex-row gap-6">
                       <div className="w-full md:w-48 h-32 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 overflow-hidden flex items-center justify-center relative group">
                          {formData.ImageUrl ? (
                             <>
                               <img src={formData.ImageUrl} alt="" className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <label className="cursor-pointer p-2 bg-white/20 rounded-full text-white"><Edit2 size={16} /><input type="file" className="hidden" accept="image/*" onChange={handleUpload}/></label>
                               </div>
                             </>
                          ) : (
                             <label className="cursor-pointer flex flex-col items-center gap-2 text-slate-500 hover:text-white transition-colors">
                                <Upload size={24} />
                                <span className="text-[10px] font-bold">TẢI ẢNH LÊN</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleUpload}/>
                             </label>
                          )}
                          {isUploading && <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center"><div className="w-6 h-6 border-2 border-lhu-blue border-t-transparent rounded-full animate-spin"></div></div>}
                       </div>
                       <div className="flex-1 space-y-2">
                          <p className="text-xs text-slate-500 leading-relaxed italic">Khuyên dùng ảnh tỉ lệ 16:10. Ảnh sẽ được lưu trữ trực tiếp trên máy chủ của trường.</p>
                          <input 
                            type="text" required readOnly
                            value={formData.ImageUrl}
                            placeholder="Đường dẫn ảnh sẽ tự động hiện ở đây..."
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] text-slate-500 outline-none"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="pt-8 flex gap-4">
                     <button type="submit" className="flex-1 py-5 bg-lhu-orange text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all shadow-xl shadow-lhu-orange/20">
                        {editingProduct ? 'Cập nhật thay đổi' : 'Tạo mới dự án'}
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
