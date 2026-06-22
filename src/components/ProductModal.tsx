"use client";
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Code2, User, Calendar, Target } from 'lucide-react';
import { Product } from './ProductCard';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[99998]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[99999] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-background border border-card-border w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] shadow-2xl pointer-events-auto flex flex-col md:flex-row relative transition-colors duration-500"
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-500">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full h-full relative"
                >
                  <img 
                    src={product.ImageUrl} 
                    alt={product.Name} 
                    className="w-full h-full object-contain drop-shadow-2xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x800?text=LHU+Tech+Hub';
                    }}
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden pointer-events-none" />
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-background">
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 bg-card-bg hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-foreground"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-lhu-blue/10 dark:bg-lhu-blue/20 text-lhu-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    {product.CareerPath}
                  </span>
                  <span className="text-muted text-sm flex items-center gap-1">
                    <Calendar size={14} /> {product.Year}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight text-foreground">{product.Name}</h2>

                <div className="space-y-8">
                   {/* Author */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-card-bg flex items-center justify-center flex-shrink-0 border border-card-border">
                      <User size={20} className="text-lhu-orange" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Tác giả</h4>
                      <p className="text-lg font-medium text-foreground">{product.Author || 'Sinh viên Khoa CNTT'}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-card-bg flex items-center justify-center flex-shrink-0 border border-card-border">
                      <Target size={20} className="text-lhu-blue" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-muted uppercase tracking-wider mb-1">Chi tiết dự án</h4>
                      <p className="text-muted leading-relaxed">{product.Description}</p>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-card-bg flex items-center justify-center flex-shrink-0 border border-card-border">
                      <Code2 size={20} className="text-lhu-orange" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-muted uppercase tracking-wider mb-2">Công nghệ sử dụng</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.TechTags.split(',').map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-card-bg border border-card-border rounded-lg text-xs font-medium text-foreground">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <a 
                    href={product.AppUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-lhu-orange hover:bg-lhu-orange/90 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02]"
                  >
                    <ExternalLink size={20} />
                    Trải nghiệm ứng dụng
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
