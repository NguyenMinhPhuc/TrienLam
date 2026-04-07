"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard, { Product } from './ProductCard';
import { LayoutGrid, Globe, Settings, Cpu, Monitor } from 'lucide-react';

interface ProductGalleryProps {
  products: Product[];
}

const categories = [
  { id: 'all', name: 'Tất cả', icon: LayoutGrid },
  { id: 'Sản phẩm phần mềm', name: 'Phần mềm', icon: Monitor },
  { id: 'Mạng máy tính', name: 'Mạng máy tính', icon: Globe },
  { id: 'Hệ thống IoT', name: 'Hệ thống IoT', icon: Settings },
  { id: 'Trí tuệ nhân tạo', name: 'Trí tuệ nhân tạo', icon: Cpu },
];

export default function ProductGallery({ products }: ProductGalleryProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(p => p.CareerPath === activeTab);

  return (
    <div className="space-y-16">
      {/* Tabs Control */}
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all relative
              ${activeTab === cat.id 
                ? 'text-white' 
                : 'text-slate-500 hover:text-lhu-blue bg-white/5 border border-white/5 hover:border-lhu-blue/30'}
            `}
          >
            {activeTab === cat.id && (
              <motion.div 
                layoutId="activeTabBg"
                className="absolute inset-0 bg-lhu-blue rounded-2xl shadow-xl shadow-lhu-blue/20 -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <cat.icon size={18} />
            <span className="whitespace-nowrap">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        <AnimatePresence mode='popLayout'>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.Id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 text-center bg-card-bg rounded-[32px] border border-dashed border-card-border"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                <Cpu size={32} />
              </div>
              <p className="text-muted text-xl font-medium">Hiện chưa có sản phẩm nào trong mục này.</p>
              <p className="text-slate-500 mt-2 text-sm">Chúng tôi đang cập nhật các dự án mới nhất của sinh viên.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
