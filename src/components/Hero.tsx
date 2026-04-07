"use client";
import { motion } from 'framer-motion';

interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-background transition-colors duration-500">
      <div className="container mx-auto px-4 z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black leading-tight mb-8 text-foreground"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted max-w-2xl mb-12"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <a href="#products" className="px-8 py-4 border-2 border-lhu-blue/20 dark:border-white/20 rounded-2xl font-bold hover:bg-lhu-blue/10 dark:hover:bg-white/10 transition-all text-center text-foreground">Khám phá sản phẩm</a>
          <a href="#quiz" className="px-8 py-4 bg-lhu-orange text-white rounded-2xl font-bold shadow-lg shadow-lhu-orange/30 hover:scale-105 transition-all text-center">Bắt đầu Quiz ngay</a>
        </motion.div>
      </div>
      
      {/* Background visual asset */}
      <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-lhu-blue to-lhu-orange rounded-full blur-[120px] opacity-10 dark:opacity-20 pointer-events-none animate-pulse" />
    </section>
  );
}
