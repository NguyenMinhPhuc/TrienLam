"use client";

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Calendar, Code2, Target, User, X } from 'lucide-react';
import { Product } from './ProductCard';
import CmsImage from './CmsImage';

const subscribeToClient = () => () => undefined;

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const mounted = useSyncExternalStore(subscribeToClient, () => true, () => false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Đóng cửa sổ chi tiết dự án"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[99998] cursor-default bg-[#08131f]/45 dark:bg-[#030810]/88 backdrop-blur-md"
          />

          <div className="pointer-events-none fixed inset-0 z-[99999] grid place-items-center p-2 sm:p-5">
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`product-title-${product.Id}`}
              initial={{ opacity: 0, y: 34, scale: 0.975 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.985 }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
              className="public-content pointer-events-auto relative grid max-h-[94svh] w-full max-w-6xl overflow-hidden rounded-2xl border border-card-border dark:border-white/12 bg-card-bg dark:bg-[#07111d] text-foreground dark:text-white shadow-[0_32px_100px_-30px_rgba(8,31,50,.28)] dark:shadow-[0_32px_120px_-30px_rgba(0,0,0,.95)] md:grid-cols-[1.08fr_.92fr]"
            >
              <motion.div
                layoutId={`product-image-${product.Id}`}
                transition={{ layout: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } }}
                className="relative min-h-64 overflow-hidden bg-public-media dark:bg-[#020711] sm:min-h-80 md:min-h-[42rem]"
              >
                <CmsImage
                  src={product.ImageUrl}
                  alt={`Ảnh dự án ${product.Name}`}
                  fallbackSrc="/image-placeholder.svg"
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-contain p-5 sm:p-9"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-card-border dark:ring-white/6" />
              </motion.div>

              <div className="max-h-[58svh] overflow-y-auto p-6 sm:p-9 md:max-h-[94svh] md:p-12">
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Đóng cửa sổ chi tiết dự án"
                  className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full border border-card-border dark:border-white/12 bg-white/95 dark:bg-[#0c1824]/90 text-foreground dark:text-white transition hover:rotate-90 hover:bg-[var(--surface-2)] dark:hover:bg-white/10 sm:right-6 sm:top-6"
                >
                  <X size={21} />
                </button>

                <div className="flex flex-wrap items-center gap-3 pr-12">
                  <span className="rounded-full bg-lhu-blue/16 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-public-blue dark:text-[#84c7ed]">{product.CareerPath}</span>
                  <span className="flex items-center gap-1.5 text-sm text-muted dark:text-[#91a7b8]"><Calendar size={14} aria-hidden="true" /> {product.Year}</span>
                </div>

                <h2 id={`product-title-${product.Id}`} className="font-display mt-7 text-3xl font-bold leading-[1.22] tracking-[-0.01em] sm:text-4xl">{product.Name}</h2>

                <dl className="mt-10 divide-y divide-card-border dark:divide-white/9 border-y border-card-border dark:border-white/9">
                  <div className="grid grid-cols-[2.5rem_1fr] gap-4 py-6">
                    <User className="mt-1 text-public-orange" size={21} aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted dark:text-[#8197a9]">Tác giả</dt>
                      <dd className="mt-2 font-semibold text-foreground dark:text-white">{product.Author || 'Sinh viên Khoa CNTT'}</dd>
                    </div>
                  </div>
                  <div className="grid grid-cols-[2.5rem_1fr] gap-4 py-6">
                    <Target className="mt-1 text-public-blue" size={21} aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted dark:text-[#8197a9]">Chi tiết dự án</dt>
                      <dd className="prose-copy mt-3 whitespace-pre-line text-sm leading-7 text-muted dark:text-[#afc0cd]">{product.Description}</dd>
                    </div>
                  </div>
                  <div className="grid grid-cols-[2.5rem_1fr] gap-4 py-6">
                    <Code2 className="mt-1 text-public-orange" size={21} aria-hidden="true" />
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-muted dark:text-[#8197a9]">Công nghệ sử dụng</dt>
                      <dd className="mt-3 flex flex-wrap gap-2">
                        {product.TechTags.split(',').map((tag) => (
                          <span key={tag} className="rounded-full border border-card-border dark:border-white/12 px-3 py-1.5 text-xs font-semibold text-foreground dark:text-[#c7d4dd]">{tag.trim()}</span>
                        ))}
                      </dd>
                    </div>
                  </div>
                </dl>

                {product.AppUrl && (
                  <a href={product.AppUrl} target="_blank" rel="noopener noreferrer" className="button-primary mt-9 w-full">
                    Trải nghiệm ứng dụng <ArrowUpRight size={19} aria-hidden="true" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
