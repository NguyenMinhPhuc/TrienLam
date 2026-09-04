"use client";

import { ArrowDown, ArrowUpRight, PanelsTopLeft } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

interface HeroProps {
  title: string;
  subtitle: string;
  productsLabel: string;
  productsUrl: string;
  quizLabel: string;
  quizUrl: string;
  scrollLabel: string;
  scrollUrl: string;
  videoSrc: string;
  posterSrc: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({
  title,
  subtitle,
  productsLabel,
  productsUrl,
  quizLabel,
  quizUrl,
  scrollLabel,
  scrollUrl,
  videoSrc,
  posterSrc,
}: HeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="top" className="relative min-h-svh overflow-hidden bg-[#07111d] text-white">
      <div className="absolute inset-0" aria-hidden="true">
        <video
          className="hero-video size-full object-cover opacity-60"
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="hero-vignette absolute inset-0" />
        <div className="hero-grid absolute inset-0 opacity-70" />
      </div>

      <div className="site-shell relative z-10 flex min-h-svh items-end pb-14 pt-32 md:items-center md:pb-24 md:pt-40">
        <div className="grid w-full items-end gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,.65fr)]">
          <div className="max-w-5xl">
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 32, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.72, ease }}
              className="font-display max-w-[17ch] text-[clamp(2.3rem,6.2vw,4.5rem)] font-[650] leading-[1.14] tracking-[-0.012em] [&_.gradient-text]:block [&_br]:hidden"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16, ease }}
              className="mt-7 max-w-2xl text-base leading-8 text-[#c0cfdb] md:mt-9 md:text-xl md:leading-9"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <a href={productsUrl} className="button-secondary border-white/20 bg-white/7 text-white hover:bg-white/12">
                <PanelsTopLeft size={17} aria-hidden="true" />
                {productsLabel}
              </a>
              <a href={quizUrl} className="button-primary">
                {quizLabel}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="hidden lg:block"
          >
            <div className="relative ml-auto aspect-square w-full max-w-[21rem]">
              <div className="hero-radar absolute inset-0 rounded-full border border-white/14" />
              <div className="absolute inset-[13%] rounded-full border border-dashed border-lhu-blue/45" />
              <div className="absolute inset-[28%] grid place-items-center rounded-full bg-[#0a1724]/82 shadow-[0_24px_70px_-26px_rgba(0,0,0,.9)] backdrop-blur-md">
                <div className="text-center">
                  <span className="font-display text-4xl font-extrabold tracking-[-0.04em] text-lhu-orange">LHU</span>
                  <span className="mt-1 block text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#b9c9d6]">Tech Hub</span>
                </div>
              </div>
              {['AI', 'SOFTWARE', 'NETWORK', 'IoT'].map((label, index) => (
                <span
                  key={label}
                  className={`absolute rounded-full border border-white/12 bg-[#08131f]/88 px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.14em] text-[#d7e2ea] backdrop-blur-md ${[
                    'left-[2%] top-[24%]',
                    'right-[-4%] top-[18%]',
                    'bottom-[18%] left-[4%]',
                    'bottom-[10%] right-[11%]',
                  ][index]}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href={scrollUrl}
        aria-label="Xem phần thống kê"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-5 right-5 z-20 hidden items-center gap-3 text-xs font-semibold text-[#aebfcd] md:flex"
      >
        {scrollLabel}
        <span className="grid size-9 place-items-center rounded-full border border-white/15">
          <ArrowDown size={16} aria-hidden="true" />
        </span>
      </motion.a>
    </section>
  );
}
