"use client";

import { ArrowUpRight, Calendar, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import CmsImage from './CmsImage';
import ProductModal from './ProductModal';

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

interface ProductCardProps {
  product: Product;
  variant?: 'featured' | 'grid';
  index?: number;
}

export default function ProductCard({ product, variant = 'grid', index = 0 }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tags = product.TechTags.split(',').map((tag) => tag.trim()).filter(Boolean);

  if (variant === 'featured') {
    return (
      <>
        <motion.button
          type="button"
          whileHover={{ y: -3 }}
          onClick={() => setIsModalOpen(true)}
          className="public-content group grid w-full overflow-hidden rounded-2xl border border-card-border dark:border-white/14 bg-card-bg dark:bg-[#0b1825] text-left shadow-[var(--public-shadow)] dark:shadow-[0_28px_80px_-42px_rgba(0,0,0,.95)] md:min-h-[31rem] md:grid-cols-[0.78fr_1.22fr]"
          aria-label={`Xem chi tiết dự án ${product.Name}`}
        >
          <div className="flex flex-col p-6 sm:p-8 md:p-10">
            <div className="flex items-start justify-between gap-5 border-b border-card-border dark:border-white/10 pb-6">
              <span className="font-display text-5xl font-extrabold leading-none tracking-[-0.04em] text-foreground dark:text-[#d9e5ed]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="rounded-full border border-card-border dark:border-white/14 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-muted dark:text-[#a9bdcb]">
                {product.CareerPath}
              </span>
            </div>

            <div className="flex flex-1 flex-col pt-8">
              <p className="flex items-center gap-2 text-xs font-semibold text-muted dark:text-[#8fa6b7]">
                <Calendar size={15} aria-hidden="true" /> {product.Year} · {product.Author || 'Sinh viên Khoa CNTT'}
              </p>
              <h3 className="font-display mt-5 text-3xl font-bold leading-[1.2] tracking-[-0.012em] text-foreground dark:text-white sm:text-4xl">{product.Name}</h3>
              <p className="mt-5 line-clamp-3 text-sm leading-7 text-muted dark:text-[#a9bdcb] sm:text-base">{product.Description}</p>
              <div className="mt-auto flex items-end justify-between gap-5 pt-8">
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs font-semibold text-public-blue dark:text-[#84c2e6]">{tag}</span>
                  ))}
                </div>
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-lhu-orange text-foreground dark:text-white transition-transform group-hover:rotate-45">
                  <ArrowUpRight size={20} aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>

          <div className="relative min-h-72 overflow-hidden bg-public-media md:min-h-full">
            <CmsImage
              src={product.ImageUrl}
              alt={`Ảnh dự án ${product.Name}`}
              fallbackSrc="/image-placeholder.svg"
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.025] sm:p-8"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-card-border dark:ring-white/7" />
          </div>
        </motion.button>
        <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ y: -5 }}
        onClick={() => setIsModalOpen(true)}
        className="public-content group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-card-border bg-card-bg text-left shadow-[var(--public-shadow)] dark:shadow-[0_18px_46px_-34px_rgba(0,0,0,.7)] transition-colors hover:border-lhu-blue/50"
        aria-label={`Xem chi tiết dự án ${product.Name}`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-public-media">
          <CmsImage
            src={product.ImageUrl}
            alt={`Ảnh dự án ${product.Name}`}
            fallbackSrc="/image-placeholder.svg"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.025]"
          />
          <span className="absolute right-4 top-4 rounded-full bg-white/90 dark:bg-[#07111d]/80 px-3 py-1 text-xs font-bold text-foreground dark:text-white backdrop-blur-md">{product.Year}</span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-public-blue">
            <Code2 size={15} aria-hidden="true" /> {product.CareerPath}
          </p>
          <h3 className="font-display mt-4 line-clamp-2 text-2xl font-bold leading-[1.25] tracking-[-0.012em] text-foreground group-hover:text-public-orange">{product.Name}</h3>
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted">{product.Description}</p>
          <div className="mt-auto flex items-center justify-between border-t border-card-border pt-6">
            <span className="text-xs font-semibold text-muted">{product.Author || 'Sinh viên Khoa CNTT'}</span>
            <ArrowUpRight className="text-public-orange transition-transform group-hover:rotate-45" size={20} aria-hidden="true" />
          </div>
        </div>
      </motion.button>
      <ProductModal product={product} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
