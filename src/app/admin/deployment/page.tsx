"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, AlertCircle, Terminal, CheckCircle2, Loader2, Info } from 'lucide-react';

export default function DeploymentManager() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'idle', message: string }>({ type: 'idle', message: '' });

  const handleDeploy = async () => {
    if (!confirm('Bạn có chắc chắn muốn kích hoạt quy trình triển khai lên server production?')) return;
    
    setIsDeploying(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch('/api/admin/deploy', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: data.message });
      } else {
        setStatus({ type: 'error', message: data.error });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Lỗi kết nối tới máy chủ.' });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Hệ Thống & Deployment</h1>
          <p className="text-slate-500">Quản lý quy trình đóng gói và triển khai tự động lên Server.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Server: Production</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-10 relative overflow-hidden group">
             <div className="relative z-10">
                <div className="w-16 h-16 bg-lhu-blue/20 rounded-2xl flex items-center justify-center text-lhu-blue mb-8">
                    <Rocket size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Deploy tới Production</h2>
                <p className="text-slate-400 mb-10 max-w-xl leading-relaxed">
                   Kích hoạt GitHub Actions để tự động kéo mã nguồn mới nhất, cài đặt phụ thuộc, xây dựng ứng dụng (Build) và cập nhật dịch vụ trên máy chủ trung tâm.
                </p>

                {status.type !== 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-8 p-6 rounded-2xl flex items-start gap-4 ${
                      status.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}
                  >
                    {status.type === 'success' ? <CheckCircle2 className="mt-1 flex-shrink-0" size={20} /> : <AlertCircle className="mt-1 flex-shrink-0" size={20} />}
                    <div>
                        <p className="font-bold mb-1">{status.type === 'success' ? 'Thành công!' : 'Thất bại'}</p>
                        <p className="text-sm opacity-80">{status.message}</p>
                    </div>
                  </motion.div>
                )}

                <button 
                  disabled={isDeploying}
                  onClick={handleDeploy}
                  className={`px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-4 transition-all ${
                    isDeploying 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-lhu-orange text-white hover:scale-105 hover:shadow-2xl hover:shadow-lhu-orange/20 shadow-xl'
                  }`}
                >
                  {isDeploying ? (
                    <><Loader2 className="animate-spin" size={24} /> Đang xử lý...</>
                  ) : (
                    <><Rocket size={24} /> Kích hoạt Deploy</>
                  )}
                </button>
             </div>

             {/* Decoration */}
             <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-lhu-blue/5 rounded-full blur-[100px] pointer-events-none transition-transform group-hover:scale-110" />
          </div>

          {/* Guidelines */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
             <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <ShieldCheck className="text-lhu-blue" /> Hướng dẫn cấu hình an toàn
             </h3>
             <div className="space-y-6">
                <div className="flex gap-4 p-6 bg-black/20 rounded-2xl border border-white/5">
                   <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-400 text-xs font-bold">1</div>
                   <p className="text-slate-400 text-sm leading-relaxed">
                      Đảm bảo bạn đã thêm <strong>GITHUB_PAT</strong> (Personal Access Token) vào file <code>.env</code> của môi trường Backend.
                   </p>
                </div>
                <div className="flex gap-4 p-6 bg-black/20 rounded-2xl border border-white/5">
                   <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-400 text-xs font-bold">2</div>
                   <p className="text-slate-400 text-sm leading-relaxed">
                      Trên GitHub, hãy cấu hình các <strong>Repository Secrets</strong>: <code>SERVER_HOST</code>, <code>SERVER_USER</code>, và <code>SERVER_SSH_KEY</code>.
                   </p>
                </div>
                <div className="flex gap-4 p-6 bg-black/20 rounded-2xl border border-white/5">
                   <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-400 text-xs font-bold">3</div>
                   <p className="text-slate-400 text-sm leading-relaxed">
                      Kiểm tra file <code>deploy.yml</code> trong thư mục <code>.github/workflows</code> để tùy chỉnh đường dẫn thư mục trên Server.
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="bg-lhu-blue/10 border border-lhu-blue/20 rounded-[32px] p-8">
              <div className="flex items-center gap-3 text-lhu-blue mb-4">
                 <Terminal size={20} />
                 <span className="font-bold uppercase tracking-widest text-xs">Trạng thái CI/CD</span>
              </div>
              <p className="text-slate-300 text-sm mb-6">Hệ thống sử dụng GitHub Actions để đảm bảo quá trình triển khai luôn ổn định và có thể truy vết.</p>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Kịch bản:</span>
                    <span className="text-slate-300 font-mono">deploy.yml</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Phương thức:</span>
                    <span className="text-slate-300">SSH / PM2</span>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 border border-white/10 rounded-[32px] p-8">
              <div className="flex items-center gap-3 text-lhu-orange mb-4">
                 <Info size={20} />
                 <span className="font-bold uppercase tracking-widest text-xs">Lưu ý quan trọng</span>
              </div>
              <ul className="text-slate-500 text-xs space-y-4 leading-relaxed list-disc ml-4">
                 <li>Quá trình Deploy có thể làm gián đoạn website trong khoảng 30-60 giây để Build mã nguồn.</li>
                 <li>Chỉ kích hoạt khi bạn đã đẩy toàn bộ mã nguồn ổn định lên nhánh <strong>main</strong> trên GitHub.</li>
                 <li>Nếu quá trình thất bại, hãy kiểm tra Log tại mục <strong>Actions</strong> trên Github.</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
