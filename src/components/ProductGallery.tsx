"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Cpu, Globe, LayoutGrid, Monitor, Settings } from 'lucide-react';
import { useRef, useState } from 'react';
import ProductCard, { Product } from './ProductCard';

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

function FeaturedProject({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 25%', 'end 25%'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 0.965]);
  const opacity = useTransform(scrollYProgress, [0, 0.86, 1], [1, 1, reduceMotion ? 1 : 0.86]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, top: 96 + index * 10 }}
      className="relative mb-6 origin-top md:sticky md:mb-14"
    >
      <ProductCard product={product} variant="featured" index={index} />
    </motion.div>
  );
}

export default function ProductGallery({ products }: ProductGalleryProps) {
  const [activeTab, setActiveTab] = useState('all');
  const filteredProducts = activeTab === 'all' ? products : products.filter((product) => product.CareerPath === activeTab);
  const featured = filteredProducts.slice(0, 3);
  const remaining = filteredProducts.slice(3);

  return (
    <div className="public-content">
      <div aria-label="Lọc sản phẩm theo lĩnh vực" className="mb-12 flex gap-2 overflow-x-auto pb-3 md:flex-wrap">
        {categories.map((category) => {
          const active = activeTab === category.id;
          return (
            <button
              type="button"
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              aria-pressed={active}
              className={`relative flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'text-[#07111d]' : 'border border-public-control dark:border-white/12 text-muted dark:text-[#b7c8d5] hover:border-public-blue dark:hover:border-lhu-blue/70 hover:text-foreground dark:hover:text-white'}`}
            >
              {active && <motion.span layoutId="active-product-filter" className="absolute inset-0 rounded-full bg-[#a9d6ef]" transition={{ type: 'spring', bounce: 0.16, duration: 0.5 }} />}
              <category.icon className="relative z-10" size={16} aria-hidden="true" />
              <span className="relative z-10">{category.name}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          aria-live="polite"
        >
          {filteredProducts.length > 0 ? (
            <>
              <div>
                {featured.map((product, index) => <FeaturedProject key={product.Id} product={product} index={index} />)}
              </div>

              {remaining.length > 0 && (
                <div className="mt-8 border-t border-card-border dark:border-white/10 pt-16">
                  <h3 className="font-display mb-9 text-2xl font-bold tracking-[-0.012em] text-foreground dark:text-white">Khám phá thêm dự án</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {remaining.map((product) => <ProductCard key={product.Id} product={product} />)}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-card-border dark:border-white/16 bg-card-bg dark:bg-white/4 px-6 py-20 text-center">
              <Cpu className="mx-auto text-public-blue" size={36} aria-hidden="true" />
              <p className="font-display mt-6 text-2xl font-semibold text-foreground dark:text-white">Danh mục này đang được cập nhật.</p>
              <p className="mt-3 text-sm text-muted dark:text-[#9eb1c1]">Hãy thử một lĩnh vực khác hoặc quay lại sau.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
