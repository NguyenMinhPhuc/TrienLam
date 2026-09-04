"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  items: Array<{ href: string; label: string }>;
  admissionsLabel: string;
  admissionsUrl: string;
}

export default function Navbar({ items, admissionsLabel, admissionsUrl }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (typeof pathname === 'string' && pathname.startsWith('/admin')) return null;

  return (
    <header className={`fixed inset-x-0 top-0 z-[1000] transition-all duration-300 ${isScrolled ? 'border-b border-white/8 bg-[#07111d]/92 py-3 shadow-[0_16px_40px_-28px_rgba(0,0,0,.9)] backdrop-blur-xl' : 'bg-transparent py-5'}`}>
      <div className="site-shell flex items-center justify-between">
        <Link href="/" aria-label="LHU Tech Hub - Trang chủ" className="inline-flex min-h-11 items-center rounded-lg px-1">
          <BrandLogo />
        </Link>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#bfd0dc] transition hover:bg-white/7 hover:text-white">
              {item.label}
            </Link>
          ))}
          <span className="mx-2 h-6 w-px bg-white/12" aria-hidden="true" />
          <ThemeToggle />
          <Link href={admissionsUrl} target="_blank" rel="noreferrer" className="button-primary ml-2 min-h-11 px-5 py-2 text-sm">
            {admissionsLabel}
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl border border-white/12 bg-[#0d1b29]/85 text-white"
            onClick={() => setIsOpen((value) => !value)}
            aria-label={isOpen ? 'Đóng trình đơn' : 'Mở trình đơn'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Điều hướng trên thiết bị di động"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full border-y border-white/8 bg-[#07111d]/98 px-3 py-4 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <div className="site-shell flex flex-col">
              {items.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="border-b border-white/8 py-4 font-display text-xl font-semibold text-white">
                  {item.label}
                </Link>
              ))}
              <Link href={admissionsUrl} target="_blank" rel="noreferrer" className="button-primary mt-5">
                {admissionsLabel}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
