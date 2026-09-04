"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import { useState } from 'react';
import ProductGallery from './ProductGallery';
import { Product } from './ProductCard';
import DynamicIcon from './DynamicIcon';
import CmsImage from './CmsImage';

interface ContentItem {
  title: string;
  body: string;
  icon: string;
  src?: string;
  id?: string;
  containerId?: string;
  botId?: string;
  image?: string;
  imageAlt?: string;
  linkLabel?: string;
  linkUrl?: string;
}

interface DynamicSectionProps {
  anchorId?: string;
  title: string;
  subtitle?: string;
  layoutType: string;
  bgStyle: string;
  contentJson: string;
  products?: Product[];
}

const ease = [0.22, 1, 0.36, 1] as const;

function ItemMedia({ item, light = false }: { item: ContentItem; light?: boolean }) {
  const isExternal = item.linkUrl?.startsWith('http');

  if (!item.image && !item.linkUrl) return null;

  return (
    <div className="mt-6">
      {item.image && (
        <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-xl bg-[#050b12]">
          <CmsImage
            src={item.image}
            alt={item.imageAlt || item.title || 'Ảnh minh họa nội dung'}
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      {item.linkUrl && (
        <a
          href={item.linkUrl}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
          className={`inline-flex items-center gap-2 text-sm font-semibold underline decoration-lhu-orange/60 underline-offset-4 ${light ? 'text-white' : 'text-foreground'}`}
        >
          {item.linkLabel || 'Tìm hiểu thêm'}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

function SectionIntro({ title, subtitle, light = false }: { title: string; subtitle?: string; light?: boolean }) {
  return (
    <div className="mb-14 grid gap-6 md:grid-cols-[1fr_.72fr] md:items-end">
      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.62, ease }}
        className={`section-title ${light ? 'text-white' : 'text-foreground'}`}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.58, delay: 0.08, ease }}
          className={`${light ? 'section-copy-on-dark' : 'section-copy'} md:justify-self-end`}
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
      )}
    </div>
  );
}

export default function DynamicSection({
  anchorId,
  title,
  subtitle,
  layoutType,
  bgStyle,
  contentJson,
  products = [],
}: DynamicSectionProps) {
  const [openIndex, setOpenIndex] = useState(0);
  let items: ContentItem[] = [];

  try {
    const parsed = JSON.parse(contentJson);
    items = Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error('Failed to parse section content JSON', error);
  }

  const sectionSurface = bgStyle === 'muted'
    ? 'bg-[var(--surface-1)] border-y border-card-border'
    : bgStyle === 'gradient'
      ? 'blueprint-surface border-y border-card-border'
      : 'bg-background';

  if (layoutType === 'product-showcase') {
    return (
      <section id={anchorId} className="section-pad scroll-mt-24 overflow-hidden bg-[#091725] text-white">
        <div className="site-shell">
          <SectionIntro title={title} subtitle={subtitle} light />
          <ProductGallery products={products} />
        </div>
      </section>
    );
  }

  if (layoutType === 'timeline') {
    return (
      <section id={anchorId} className={`section-pad scroll-mt-24 relative overflow-hidden ${sectionSurface}`}>
        <div className="site-shell relative z-10">
          <SectionIntro title={title} subtitle={subtitle} />
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute bottom-0 left-5 top-0 w-px bg-card-border md:left-1/2" aria-hidden="true">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: '-120px' }}
                transition={{ duration: 1.1, ease }}
                className="h-full origin-top bg-gradient-to-b from-lhu-blue via-lhu-orange to-transparent"
              />
            </div>

            <div className="space-y-10 md:space-y-14">
              {items.map((item, index) => (
                <motion.article
                  key={`${item.title}-${index}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-90px' }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease }}
                  className={`relative grid pl-14 md:grid-cols-2 md:pl-0 ${index % 2 === 0 ? '' : 'md:[&>div]:col-start-2'}`}
                >
                  <span className="absolute left-2 top-7 grid size-7 place-items-center rounded-full border border-lhu-orange/60 bg-background md:left-1/2 md:-translate-x-1/2" aria-hidden="true">
                    <span className="size-2 rounded-full bg-lhu-orange" />
                  </span>
                  <div className={`${index % 2 === 0 ? 'md:pr-14' : 'md:pl-14'} py-5`}>
                    <DynamicIcon name={item.icon} size={25} className="text-lhu-blue" />
                    <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.012em] text-foreground">{item.title}</h3>
                    <p className="prose-copy mt-4 text-sm leading-7 text-muted sm:text-base">{item.body}</p>
                    <ItemMedia item={item} />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (layoutType === 'script-embed') {
    const scriptData = items[0];
    return (
      <section id={anchorId} className={`section-pad scroll-mt-24 ${sectionSurface}`}>
        <div className="site-shell">
          <SectionIntro title={title} subtitle={subtitle} />
          <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-card-border bg-[#050b12] p-2 shadow-[0_24px_70px_-40px_rgba(0,0,0,.9)]">
            <div className="flex items-center gap-2 border-b border-white/9 px-4 py-3" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-lhu-orange" />
              <span className="size-2.5 rounded-full bg-lhu-blue" />
              <span className="size-2.5 rounded-full bg-white/20" />
            </div>
            <div id={scriptData?.containerId || 'script-container'} className="grid min-h-[34rem] w-full place-items-stretch overflow-hidden">
              {!scriptData?.src && <p className="m-auto max-w-md px-6 text-center text-sm leading-7 text-[#8da3b5]">Chưa cấu hình Script URL. Vui lòng nhập URL trong trang quản trị để hiển thị sản phẩm nhúng.</p>}
            </div>
            {scriptData?.src && (
              <Script
                id={scriptData.id || 'dynamic-script'}
                src={scriptData.src}
                data-chatbot-id={scriptData.botId}
                data-target-id={scriptData.containerId}
                strategy="afterInteractive"
              />
            )}
          </div>
        </div>
      </section>
    );
  }

  if (layoutType === '1-col') {
    return (
      <section id={anchorId} className={`section-pad scroll-mt-24 ${sectionSurface}`}>
        <div className="site-shell">
          <SectionIntro title={title} subtitle={subtitle} />
          <div
            className="accordion-spotlight mx-auto max-w-5xl overflow-hidden rounded-2xl border border-card-border bg-card-bg"
            onPointerMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
              event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
            }}
          >
            {items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={`${item.title}-${index}`} className="relative border-b border-card-border last:border-b-0">
                  <button
                    type="button"
                    className="relative z-10 flex w-full items-center gap-5 px-5 py-6 text-left sm:px-8 sm:py-8"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <DynamicIcon name={item.icon} size={23} className="shrink-0 text-lhu-blue" />
                    <span className="font-display flex-1 text-lg font-bold tracking-[-0.012em] text-foreground sm:text-xl">{item.title}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="grid size-9 shrink-0 place-items-center rounded-full border border-card-border">
                      <ChevronDown size={17} aria-hidden="true" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease }}
                        className="relative z-10 overflow-hidden"
                      >
                        {item.image || item.linkUrl ? (
                          <div className="max-w-3xl px-5 pb-7 pl-[4.75rem] sm:px-8 sm:pb-9 sm:pl-[5.25rem]">
                            <p className="prose-copy text-sm leading-7 text-muted sm:text-base">{item.body}</p>
                            <ItemMedia item={item} />
                          </div>
                        ) : (
                          <p className="prose-copy max-w-3xl px-5 pb-7 pl-[4.75rem] text-sm leading-7 text-muted sm:px-8 sm:pb-9 sm:pl-[5.25rem] sm:text-base">{item.body}</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (layoutType === '2-col') {
    return (
      <section id={anchorId} className={`section-pad scroll-mt-24 ${sectionSurface}`}>
        <div className="site-shell">
          <SectionIntro title={title} subtitle={subtitle} />
          <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
            {items.map((item, index) => (
              <motion.article
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -22 : 22 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.58, delay: index * 0.08, ease }}
                className="border-t border-card-border pt-7"
              >
                <div className="flex items-center gap-4">
                  <DynamicIcon name={item.icon} size={25} className="text-lhu-blue" />
                  <h3 className="font-display text-2xl font-bold tracking-[-0.012em] text-foreground">{item.title}</h3>
                </div>
                <p className="prose-copy mt-6 max-w-[62ch] text-base leading-8 text-muted">{item.body}</p>
                <ItemMedia item={item} />
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (layoutType === '4-col') {
    return (
      <section id={anchorId} className={`section-pad scroll-mt-24 ${sectionSurface}`}>
        <div className="site-shell">
          <SectionIntro title={title} subtitle={subtitle} />
          <div className="divide-y divide-card-border border-y border-card-border">
            {items.map((item, index) => (
              <motion.article
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-70px' }}
                transition={{ duration: 0.5, delay: index * 0.06, ease }}
                className="grid gap-5 py-6 sm:grid-cols-[3rem_1fr] md:grid-cols-[3rem_3rem_.8fr_1.2fr] md:items-center md:gap-7 md:py-8"
              >
                <span className="font-display text-sm font-bold tabular-nums text-lhu-orange">{String(index + 1).padStart(2, '0')}</span>
                <DynamicIcon name={item.icon} size={24} className="hidden text-lhu-blue sm:block" />
                <h3 className="font-display text-xl font-bold tracking-[-0.012em] text-foreground sm:col-start-2 md:col-start-auto">{item.title}</h3>
                <p className="prose-copy text-sm leading-7 text-muted sm:col-start-2 md:col-start-auto sm:text-base">{item.body}</p>
                {(item.image || item.linkUrl) && (
                  <div className="sm:col-start-2 md:col-start-4">
                    <ItemMedia item={item} />
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={anchorId} className={`section-pad scroll-mt-24 ${sectionSurface}`}>
      <div className="site-shell">
        <SectionIntro title={title} subtitle={subtitle} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <motion.article
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: index * 0.08, ease }}
              className={`group p-7 sm:p-9 ${index === 0 ? 'rounded-2xl bg-[#091725] text-white md:col-span-2 lg:grid lg:grid-cols-[.45fr_1fr] lg:gap-12 lg:col-span-2' : 'border-t border-card-border bg-transparent'}`}
            >
              <div className="flex items-start justify-between">
                <DynamicIcon name={item.icon} size={28} className={`${index === 0 ? 'text-lhu-orange' : 'text-lhu-blue'} transition-transform duration-300 group-hover:-translate-y-1`} />
                <span className={`font-display text-xs font-bold tabular-nums ${index === 0 ? 'text-[#8fa6b7]' : 'text-muted'}`}>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <h3 className={`font-display mt-10 text-2xl font-bold tracking-[-0.012em] ${index === 0 ? 'text-white lg:mt-0 lg:text-3xl' : 'text-foreground'}`}>{item.title}</h3>
                <p className={`prose-copy mt-5 text-sm leading-7 sm:text-base ${index === 0 ? 'text-[#aec0cd]' : 'text-muted'}`}>{item.body}</p>
                <ItemMedia item={item} light={index === 0} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
