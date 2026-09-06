"use client";

import { ArrowUpRight, Code2, UsersRound } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import CmsImage from './CmsImage';

interface FacultySectionProps {
  title: string;
  content: string;
  image?: string;
  imageAlt: string;
  ctaLabel: string;
  ctaUrl: string;
  featureOne: string;
  featureTwo: string;
  mediaCaption: string;
  mediaLocation: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function FacultySection({
  title,
  content,
  image,
  imageAlt,
  ctaLabel,
  ctaUrl,
  featureOne,
  featureTwo,
  mediaCaption,
  mediaLocation,
}: FacultySectionProps) {
  const reduceMotion = useReducedMotion();
  return (
    <section id="faculty" className="public-content section-pad relative overflow-hidden bg-background">
      <div className="site-shell">
        <motion.h2
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease }}
          className="section-title max-w-[22ch]"
        >
          {title}
        </motion.h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.65, delay: 0.08, ease }}
            className="lg:col-span-5 lg:pb-3"
          >
            <div className="section-copy prose-copy [&_p+p]:mt-4" dangerouslySetInnerHTML={{ __html: content }} />
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-9 inline-flex items-center gap-3 font-semibold text-foreground underline decoration-lhu-orange/60 underline-offset-8"
            >
              {ctaLabel}
              <span className="grid size-9 place-items-center rounded-full bg-lhu-orange text-[#07111d] dark:text-white transition-transform group-hover:rotate-45">
                <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </a>

            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-card-border bg-card-border">
              <div className="bg-card-bg p-5">
                <Code2 className="text-public-blue" size={24} aria-hidden="true" />
                <p className="mt-7 text-sm font-semibold leading-6 text-foreground">{featureOne}</p>
              </div>
              <div className="bg-card-bg p-5">
                <UsersRound className="text-public-orange" size={24} aria-hidden="true" />
                <p className="mt-7 text-sm font-semibold leading-6 text-foreground">{featureTwo}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { clipPath: 'inset(0 100% 0 0)', opacity: 0.6 }}
            whileInView={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.05, ease }}
            className="relative min-h-[23rem] overflow-hidden rounded-2xl bg-public-media dark:bg-[#0a1724] sm:min-h-[31rem] lg:col-span-7"
          >
            <CmsImage
              src={image || '/uploads/Faculty.jpg'}
              alt={imageAlt}
              fallbackSrc="/uploads/Faculty.jpg"
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
            <motion.span
              aria-hidden="true"
              initial={reduceMotion ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              whileInView={{ opacity: 0, scaleX: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: reduceMotion ? 0 : 0.72, delay: reduceMotion ? 0 : 0.2, ease }}
              className="faculty-reveal-block pointer-events-none absolute inset-0 z-20 origin-left opacity-0"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#07111d]/95 via-[#07111d]/45 to-transparent p-6 pt-28 sm:p-8">
              <p className="max-w-sm font-display text-xl font-semibold text-white sm:text-2xl">{mediaCaption}</p>
              <span className="hidden rounded-full border border-white/20 bg-[#07111d]/55 px-4 py-2 text-xs font-semibold text-[#cfdae3] backdrop-blur-md sm:block">{mediaLocation}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
