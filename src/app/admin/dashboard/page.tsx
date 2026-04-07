"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Layers, 
  Users, 
  ArrowUpRight, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalProducts: number;
  totalSections: number;
  totalStats: number;
  recentProducts: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/summary');
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="animate-pulse flex flex-col gap-8">
    <div className="h-48 bg-white/5 rounded-[28px]" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-32 bg-white/5 rounded-3xl" />
      <div className="h-32 bg-white/5 rounded-3xl" />
      <div className="h-32 bg-white/5 rounded-3xl" />
    </div>
  </div>;

  return (
    <div className="space-y-12 pb-20">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-lhu-blue p-10 md:p-14 rounded-[32px] relative overflow-hidden shadow-2xl shadow-lhu-blue/30 text-white"
      >
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Chào mừng trở lại!</h1>
          <p className="text-white/80 text-xl max-w-xl">Hệ thống đang vận hành ổn định. Bạn có {data?.totalProducts} dự án sinh viên đang được hiển thị.</p>
        </div>
        <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-20 hidden md:block">
           <Package size={200} className="text-white" />
        </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          label="Dự án sinh viên" 
          value={data?.totalProducts || 0} 
          icon={Package} 
          color="bg-orange-500" 
          link="/admin/products"
        />
        <StatCard 
          label="Khung động" 
          value={data?.totalSections || 0} 
          icon={Layers} 
          color="bg-blue-500" 
          link="/admin/sections"
        />
        <StatCard 
          label="Chỉ số thống kê" 
          value={data?.totalStats || 0} 
          icon={ArrowUpRight} 
          color="bg-green-500" 
          link="/admin/stats"
        />
      </div>

      {/* Recent Projects Table */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[28px] overflow-hidden shadow-xl"
      >
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h2 className="text-2xl font-bold flex items-center gap-3">
             <Clock className="text-lhu-orange" /> Dự án mới nhất
          </h2>
          <Link href="/admin/products" className="text-sm font-bold text-lhu-blue hover:text-lhu-orange transition-colors">
            Xem tất cả &rarr;
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-6">Dự án</th>
                <th className="px-8 py-6">Tác giả</th>
                <th className="px-8 py-6">Năm</th>
                <th className="px-8 py-6">Trạng thái</th>
                <th className="px-8 py-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data?.recentProducts.map((p) => (
                <tr key={p.Id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden flex-shrink-0 border border-white/10">
                         <img src={p.ImageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-lg text-white group-hover:text-lhu-orange transition-colors">{p.Name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-400">{p.Author || "N/A"}</td>
                  <td className="px-8 py-6">
                     <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold border border-white/10">{p.Year}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="flex items-center gap-2 text-green-500 text-sm font-bold">
                       <CheckCircle2 size={16} /> Hiển thị
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <a href={p.AppUrl} target="_blank" className="p-2 hover:bg-white/10 rounded-lg inline-flex text-slate-400 hover:text-white transition-all">
                       <ExternalLink size={20} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, link }: any) {
  return (
    <Link href={link} className="bg-white/5 border border-white/10 p-8 rounded-[20px] group hover:bg-white/10 transition-all shadow-lg hover:shadow-2xl">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
          <Icon size={28} />
        </div>
        <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" size={24} />
      </div>
      <h3 className="text-4xl font-black text-white group-hover:scale-110 transition-transform origin-left">{value}</h3>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">{label}</p>
    </Link>
  );
}
