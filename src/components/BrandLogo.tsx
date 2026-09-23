'use client';

import { useSiteText } from './SiteContentContext';

interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className = '' }: BrandLogoProps) {
  const text = useSiteText();
  if (text('brand_logo_src')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={text('brand_logo_src')} alt={text('brand_logo_alt')} className={`h-9 max-w-48 object-contain ${className}`} />;
  }
  return (
    <span className={`font-display inline-flex items-center gap-1.5 text-xl font-bold tracking-[-0.025em] ${className}`} aria-hidden="true">
      <span className="text-lhu-orange">{text('brand_first')}</span>
      <span className="text-[#4aa6dc]">{text('brand_second')}</span>
    </span>
  );
}
