'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function PublicContentRefresh() {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    let pending = false;
    const refresh = () => {
      if (document.hidden) { pending = true; return; }
      pending = false;
      router.refresh();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'lhu-content-updated') refresh();
    };
    const onVisible = () => { if (pending && !document.hidden) refresh(); };
    window.addEventListener('storage', onStorage);
    window.addEventListener('lhu-content-updated', refresh);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('lhu-content-updated', refresh);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [pathname, router]);
  return null;
}
