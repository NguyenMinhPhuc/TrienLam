"use client";
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-[1000] py-4 bg-background/80 backdrop-blur-xl border-b border-card-border">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter">
          <span className="text-lhu-orange">LHU</span>
          <span className="text-lhu-blue dark:text-lhu-blue ml-2">TECH HUB</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center font-bold">
          <Link href="/#faculty" className="hover:text-lhu-orange dark:hover:text-lhu-blue transition-colors">Khoa CNTT</Link>
          <Link href="/academic" className="hover:text-lhu-orange dark:hover:text-lhu-blue transition-colors">Ngành đào tạo</Link>
          <Link href="/#products" className="hover:text-lhu-orange dark:hover:text-lhu-blue transition-colors">Sản phẩm</Link>
          <Link href="/#quiz" className="hover:text-lhu-orange dark:hover:text-lhu-blue transition-colors">Hướng nghiệp</Link>
          <Link href="https://tuyensinh.lhu.edu.vn" className="bg-lhu-blue dark:bg-lhu-blue text-white px-6 py-2 rounded-xl hover:bg-lhu-blue/80 transition-colors">Tuyển sinh 2026</Link>
          <ThemeToggle />
        </nav>

        {/* Mobile Toggle & Theme Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button 
            className="p-2 text-lhu-orange"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-card-border overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-6 font-bold text-center">
              <Link href="/#faculty" onClick={() => setIsOpen(false)} className="hover:text-lhu-orange transition-colors">Khoa CNTT</Link>
              <Link href="/academic" onClick={() => setIsOpen(false)} className="hover:text-lhu-orange transition-colors">Ngành đào tạo</Link>
              <Link href="/#products" onClick={() => setIsOpen(false)} className="hover:text-lhu-orange transition-colors">Sản phẩm</Link>
              <Link href="/#quiz" onClick={() => setIsOpen(false)} className="hover:text-lhu-orange transition-colors">Hướng nghiệp</Link>
              <Link href="https://tuyensinh.lhu.edu.vn" className="bg-lhu-blue px-6 py-4 rounded-2xl w-full text-white">Tuyển sinh 2026</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
