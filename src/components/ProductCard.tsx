"use client";
import { Monitor, MessageSquare, Globe, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Product {
  Id: number;
  Name: string;
  Description: string;
  ImageUrl: string;
  AppUrl: string;
  TechTags: string;
  CareerPath: string;
  Year: number;
  Author?: string;
}

import { useState } from 'react';
import ProductModal from './ProductModal';

export default function ProductCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getIcon = (path: string) => {
    switch (path) {
      case 'Trí tuệ nhân tạo': return <MessageSquare size={32} />;
      case 'Mạng máy tính': return <Globe size={32} />;
      case 'Hệ thống IoT': return <Settings size={32} />;
      case 'Sản phẩm phần mềm': return <Monitor size={32} />;
      default: return <Monitor size={32} />;
    }
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -10 }}
        onClick={() => setIsModalOpen(true)}
        className="bg-card-bg backdrop-blur-xl border border-card-border rounded-[20px] overflow-hidden flex flex-col group transition-all hover:border-lhu-orange/50 cursor-pointer shadow-lg hover:shadow-2xl"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center">
          <img 
            src={product.ImageUrl} 
            alt={product.Name} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=LHU+Tech+Hub';
            }}
          />
          <div className="absolute top-4 right-4 bg-lhu-blue/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white z-10">
            {product.Year}
          </div>
        </div>
        
        <div className="p-8 flex flex-col flex-1">
          <div className="w-14 h-14 bg-lhu-blue rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-lhu-blue/20 text-white">
            {getIcon(product.CareerPath)}
          </div>
          
          <h3 className="text-2xl font-bold mb-2 group-hover:text-lhu-orange transition-colors text-foreground line-clamp-1">{product.Name}</h3>
          <p className="text-muted text-xs font-bold mb-4 uppercase tracking-widest">{product.Author || 'Sinh viên Khoa CNTT'}</p>
          <p className="text-muted text-sm mb-6 flex-1 line-clamp-1">{product.Description}</p>
          
          <div className="flex flex-wrap gap-2 mb-8 h-8 overflow-hidden">
            {product.TechTags.split(',').map((tag, i) => (
              <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 rounded-full text-lhu-blue shrink-0">
                {tag.trim()}
              </span>
            ))}
          </div>
          
          <button 
            className="w-full py-4 rounded-2xl border border-card-border bg-card-bg text-foreground group-hover:bg-lhu-blue group-hover:text-white group-hover:border-lhu-blue transition-all text-center font-bold"
          >
            Xem chi tiết
          </button>
        </div>
      </motion.div>

      <ProductModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
