"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Settings2,
  Trophy,
  Users,
  Rocket,
  Globe
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface Stat {
  Id: number;
  Label: string;
  Value: string;
  IconName: string;
  OrderIndex: number;
}

const ICON_OPTIONS = [
  'Code', 'Cpu', 'Globe', 'Zap', 'Users', 'Star', 'Award', 'BookOpen', 
  'Briefcase', 'Shield', 'Activity', 'TrendingUp', 'Lightbulb', 
  'MessageSquare', 'Monitor', 'Smartphone', 'LayoutGrid', 'Terminal', 
  'Layers', 'Settings', 'Rocket', 'Heart', 'Flame', 'CheckCircle2'
];

export default function StatsManager() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);

  const [formData, setFormData] = useState<Partial<Stat>>({
    Label: '',
    Value: '',
    IconName: 'Rocket',
    OrderIndex: 0
  });

  const fetchStats = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/stats');
    if (res.ok) {
        const data = await res.json();
        setStats(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleEdit = (stat: Stat) => {
    setEditingStat(stat);
    setFormData(stat);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa chỉ số này?')) return;
    const res = await fetch(`/api/admin/stats?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchStats();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingStat ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/stats', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingStat(null);
      setFormData({ Label: '', Value: '', IconName: 'Rocket', OrderIndex: 0 });
      fetchStats();
    }
  };

  const IconComponent = ({ name, size = 20, className }: any) => {
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon size={size} className={className} /> : <LucideIcons.HelpCircle size={size} className={className} />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-black text-white mb-2">Quản lý <span className="text-lhu-orange">Chỉ số</span></h1>
           <p className="text-slate-400">Cập nhật các thống kê thực tế về dự án, sinh viên và thành tích.</p>
        </div>
        <button 
          onClick={() => { setEditingStat(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-8 py-4 bg-lhu-blue text-white rounded-2xl font-bold shadow-xl shadow-lhu-blue/20 hover:scale-105 transition-all"
        >
          <Plus size={20} /> Thêm chỉ số
        </button>
      </div>

      {/* Stats List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
           <div className="col-span-full text-center py-20 text-slate-500">Đang tải dữ liệu...</div>
        ) : stats.map((stat) => (
          <motion.div 
            key={stat.Id}
            layoutId={`stat-${stat.Id}`}
            className="bg-white/5 border border-white/10 p-8 rounded-[24px] group hover:border-lhu-orange/50 transition-all flex flex-col items-center text-center"
          >
             <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-lhu-orange/10 group-hover:text-lhu-orange group-hover:border-lhu-orange/20 transition-all text-lhu-blue">
                <IconComponent name={stat.IconName} size={40} />
             </div>
             <h3 className="text-4xl font-black text-white mb-2">{stat.Value}</h3>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-6">{stat.Label}</p>
             
             <div className="w-full pt-6 border-t border-white/10 flex justify-center gap-4">
                <button onClick={() => handleEdit(stat)} className="p-3 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(stat.Id)} className="p-3 hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
             </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[2000]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl z-[2001] p-10"
            >
               <h2 className="text-3xl font-black text-white mb-8">{editingStat ? 'Sửa chỉ số' : 'Thêm chỉ số'}</h2>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tên chỉ số</label>
                     <input 
                        type="text" required
                        value={formData.Label} onChange={e => setFormData({...formData, Label: e.target.value})}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        placeholder="Dự án sinh viên"
                     />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Giá trị (Số liệu)</label>
                     <input 
                        type="text" required
                        value={formData.Value} onChange={e => setFormData({...formData, Value: e.target.value})}
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        placeholder="150+"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Icon (Tên Lucide)</label>
                        <select 
                            required
                            value={formData.IconName} onChange={e => setFormData({...formData, IconName: e.target.value})}
                            className="w-full p-4 bg-slate-800 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        >
                            <option value="">Chọn Icon</option>
                            {ICON_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Thứ tự</label>
                        <input 
                            type="number" required
                            value={formData.OrderIndex} onChange={e => setFormData({...formData, OrderIndex: parseInt(e.target.value)})}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                        />
                      </div>
                  </div>

                  <button type="submit" className="w-full py-5 bg-lhu-blue text-white rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all shadow-xl shadow-lhu-blue/20 mt-4">
                     Xác nhận lưu
                  </button>
               </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
