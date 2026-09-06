"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import DynamicIcon from './DynamicIcon';
import type { StatData } from '@/lib/types';

function AnimatedValue({ value }: { value: string }) {
  const match = value.match(/^(.*?)([\d,.]+)(.*)$/);
  const numericValue = match ? Number(match[2].replace(/,/g, '')) : Number.NaN;
  const prefix = match?.[1] ?? '';
  const suffix = match?.[3] ?? '';
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${prefix}${Math.round(latest).toLocaleString('vi-VN')}${suffix}`);

  useEffect(() => {
    if (!isInView || !Number.isFinite(numericValue)) return;
    if (reduceMotion) {
      count.set(numericValue);
      return;
    }
    const controls = animate(count, numericValue, { duration: 1.4, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [count, isInView, numericValue, reduceMotion]);

  if (!Number.isFinite(numericValue)) return <span>{value}</span>;
  return <motion.span ref={ref}>{rounded}</motion.span>;
}

interface StatsSectionProps {
  stats: StatData[];
  title: string;
  description: string;
}

export default function StatsSection({ stats, title, description }: StatsSectionProps) {
  return (
    <section id="stats" className="public-content section-pad blueprint-surface relative overflow-hidden border-y border-card-border">
      <div className="site-shell relative z-10 grid items-center gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="section-title">{title}</h2>
          <p className="section-copy mt-7">
            {description}
          </p>
          <div className="signal-line mt-9" aria-hidden="true" />

          <div className="relative mt-12 hidden aspect-[5/3] max-w-lg overflow-hidden rounded-2xl border border-card-border bg-[var(--surface-2)] dark:bg-[#07111d] lg:block" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_35%,rgba(35,133,193,.34),transparent_32%),radial-gradient(circle_at_72%_68%,rgba(243,112,33,.2),transparent_25%)]" />
            <svg viewBox="0 0 560 330" className="absolute inset-0 size-full opacity-80">
              <path d="M35 220 C130 80 205 270 300 125 S455 95 530 42" fill="none" stroke="var(--public-signal-blue)" strokeWidth="1.5" />
              <path d="M20 270 C120 240 160 100 270 175 S420 285 540 215" fill="none" stroke="var(--public-signal-orange)" strokeWidth="1.5" />
              {[80, 180, 280, 390, 495].map((x, index) => (
                <g key={x}>
                  <circle cx={x} cy={[190, 112, 184, 126, 72][index]} r="8" fill={index % 2 ? '#f37021' : '#2385c1'} />
                  <circle cx={x} cy={[190, 112, 184, 126, 72][index]} r="18" fill="none" stroke="var(--public-signal-ring)" />
                </g>
              ))}
            </svg>
            <p className="absolute bottom-5 left-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted dark:text-[#91a8ba]">Learning signal / LHU</p>
          </div>
        </motion.div>

        {stats.length > 0 ? (
          <div className="grid grid-cols-2 border-l border-t border-card-border">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.Id || index}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="min-h-48 border-b border-r border-card-border p-5 sm:min-h-56 sm:p-8"
              >
                <DynamicIcon name={stat.IconName} size={24} className="text-public-blue" />
                <p className="font-display mt-8 text-[clamp(2.2rem,5vw,4.6rem)] font-extrabold leading-none tracking-[-0.04em] text-foreground tabular-nums">
                  <AnimatedValue value={stat.Value} />
                </p>
                <p className="mt-4 max-w-[18ch] text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-muted sm:text-sm">
                  {stat.Label}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-card-border p-10 text-muted">Số liệu đang được cập nhật.</div>
        )}
      </div>
    </section>
  );
}
