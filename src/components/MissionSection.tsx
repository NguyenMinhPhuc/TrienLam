"use client";

import { ArrowUpRight, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface MissionSectionProps {
  title: string;
  content: string;
  ctaLabel: string;
  ctaUrl: string;
}

export default function MissionSection({ title, content, ctaLabel, ctaUrl }: MissionSectionProps) {
  return (
    <section id="mission" className="public-content relative scroll-mt-24 overflow-hidden border-t border-card-border bg-[var(--surface-1)] dark:bg-[#091725] py-20 text-foreground dark:text-white md:py-28">
      <div className="site-shell relative z-10 grid gap-12 lg:grid-cols-[minmax(12rem,.4fr)_minmax(0,1.6fr)] lg:gap-20">
        <div className="lg:pt-1">
          <Quote className="text-public-orange" size={26} strokeWidth={1.7} aria-hidden="true" />
          <h2 className="font-display mt-6 max-w-[12ch] text-xl font-bold leading-[1.3] tracking-[-0.012em] sm:text-2xl">{title}</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <blockquote className="prose-copy max-w-[64ch] text-pretty text-[clamp(1.25rem,1.75vw,1.9rem)] font-medium leading-[1.62] tracking-[0.002em] text-foreground dark:text-[#eef5f9]">
            “{content}”
          </blockquote>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noreferrer"
            className="group mt-10 inline-flex items-center gap-3 border-b border-lhu-orange/60 pb-2 text-sm font-semibold text-foreground dark:text-white"
          >
            {ctaLabel}
            <ArrowUpRight className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={18} aria-hidden="true" />
          </a>
        </motion.div>
      </div>
      <div className="absolute -right-32 -top-40 size-[34rem] rounded-full bg-lhu-blue/10 blur-[110px]" aria-hidden="true" />
    </section>
  );
}
