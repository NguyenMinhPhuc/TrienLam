"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  BarChart3, 
  HelpCircle, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  Rocket
} from 'lucide-react';

const navItems = [
  { name: 'Tổng quan', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Sản phẩm', icon: Package, path: '/admin/products' },
  { name: 'Khung động', icon: Layers, path: '/admin/sections' },
  { name: 'Thống kê', icon: BarChart3, path: '/admin/stats' },
  { name: 'Trắc nghiệm', icon: HelpCircle, path: '/admin/quiz' },
  { name: 'Nội dung chung', icon: Settings, path: '/admin/content' },
  { name: 'Hệ thống', icon: Rocket, path: '/admin/deployment' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Don't show sidebar on the login page
  if (pathname === '/admin') return <>{children}</>;

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar */}
      <aside 
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-[1001] flex w-72 flex-col overflow-hidden border-r border-white/10 bg-slate-950 transition-all duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 ${isSidebarCollapsed ? 'md:w-20' : 'md:w-72'}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 overflow-hidden ${isSidebarCollapsed ? 'md:hidden' : ''}`}>
             <div className="w-8 h-8 bg-lhu-orange rounded-lg flex items-center justify-center flex-shrink-0">
                <Settings className="text-white" size={18} />
             </div>
             <span className="font-black text-xl tracking-tighter text-white">LHU <span className="text-lhu-orange">ADMIN</span></span>
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label={isSidebarCollapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
            aria-expanded={!isSidebarCollapsed}
            className="hidden p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 md:block"
          >
            {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Đóng thanh điều hướng"
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                aria-current={isActive ? 'page' : undefined}
                aria-label={isSidebarCollapsed ? item.name : undefined}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all relative group ${
                  isActive ? 'bg-lhu-blue text-white shadow-lg shadow-lhu-blue/20' : 'hover:bg-white/5 text-slate-400'
                }`}
              >
                <item.icon size={22} className="flex-shrink-0" />
                <span className={`${isSidebarCollapsed ? 'md:hidden' : ''} font-medium whitespace-nowrap`}>{item.name}</span>
                {isActive && !isSidebarCollapsed && (
                  <motion.div layoutId="activeNav" className="absolute right-4"><ChevronRight size={16} /></motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all group"
          >
            <LogOut size={22} className="flex-shrink-0 group-hover:rotate-12 transition-transform" />
            <span className={`${isSidebarCollapsed ? 'md:hidden' : ''} font-medium`}>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen relative overflow-x-hidden p-6 md:p-12">
         {/* Top Bar (Mobile friendly) */}
         <div className="flex md:hidden items-center justify-between mb-8">
            <button aria-label="Mở thanh điều hướng" aria-controls="admin-sidebar" aria-expanded={isMobileOpen} onClick={() => setIsMobileOpen(true)} className="p-2 bg-white/5 rounded-xl border border-white/10">
               <Menu size={24} />
            </button>
            <span className="font-bold text-lhu-orange">ADMIN</span>
         </div>

         {/* Content Area */}
         <div className="max-w-7xl mx-auto">
            {children}
         </div>

         {/* Background Blobs */}
         <div className="fixed top-0 right-0 w-full h-full pointer-events-none -z-10">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-lhu-blue/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-lhu-orange/5 rounded-full blur-[120px]" />
         </div>
      </main>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Đóng thanh điều hướng"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-[1000] bg-black/60 md:hidden"
        />
      )}
    </div>
  );
}
