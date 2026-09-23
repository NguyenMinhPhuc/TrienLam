'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { contentValue, type SiteContentKey } from '@/lib/site-content';

const Context = createContext<Record<string, string>>({});
export function SiteContentProvider({ content, children }: { content: Record<string, string>; children: ReactNode }) {
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
export function useSiteText() {
  const content = useContext(Context);
  return (key: SiteContentKey) => contentValue(content, key);
}
