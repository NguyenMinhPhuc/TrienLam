import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import BrandLogo from './BrandLogo';

interface SiteFooterProps {
  title: string;
  address: string;
  copy: string;
  layout: string;
  showMap: boolean;
  mapEmbed: string;
  socialLinks: Record<string, string | undefined>;
  navigationLinks: Array<{ href: string; label: string }>;
  followTitle: string;
  socialEmptyText: string;
  backToTopLabel: string;
}

const socialIconNames: Record<string, string> = {
  facebook: 'Facebook',
  zalo: 'MessageSquare',
  instagram: 'Instagram',
  youtube: 'Youtube',
  linkedin: 'Linkedin',
  tiktok: 'Globe',
};

export default function SiteFooter({
  title,
  address,
  copy,
  layout,
  showMap,
  mapEmbed,
  socialLinks,
  navigationLinks,
  followTitle,
  socialEmptyText,
  backToTopLabel,
}: SiteFooterProps) {
  const activeSocialLinks = Object.entries(socialLinks).filter(([, href]) => Boolean(href));
  const layoutClass = layout === '1-col'
    ? 'grid-cols-1 max-w-3xl mx-auto text-center justify-items-center'
    : layout === '2-col'
      ? 'md:grid-cols-[1.2fr_.8fr]'
      : 'md:grid-cols-[1.25fr_.8fr_.65fr]';
  const navClass = layout === '1-col' ? 'justify-items-center sm:grid-cols-2 sm:gap-x-8' : '';

  return (
    <footer className="public-content site-footer relative overflow-hidden border-t border-card-border dark:border-white/8 bg-[var(--surface-2)] dark:bg-[#050b12] text-foreground dark:text-white">
      <div className="footer-signal" aria-hidden="true" />
      <div className="site-shell relative z-10 py-14 md:py-18">
        {showMap && mapEmbed && (
          <div className="mb-12 overflow-hidden rounded-2xl border border-card-border dark:border-white/10 bg-card-bg dark:bg-[#09131f] p-1 [&_iframe]:min-h-80 [&_iframe]:w-full">
            <div dangerouslySetInnerHTML={{ __html: mapEmbed }} />
          </div>
        )}

        <div className={`grid gap-10 md:gap-12 ${layoutClass}`}>
          <div className="max-w-xl">
            <BrandLogo className="text-2xl" />
            <p className="mt-5 font-display text-lg font-semibold tracking-[-0.012em] text-foreground dark:text-white">{title}</p>
            <p className={`mt-4 flex gap-3 text-sm leading-7 text-muted dark:text-[#a9bacb] ${layout === '1-col' ? 'items-center justify-center' : 'items-start'}`}>
              <MapPin className="mt-1 shrink-0 text-public-orange" size={18} aria-hidden="true" />
              <span>{address}</span>
            </p>
          </div>

          <nav aria-label="Liên kết cuối trang" className={`grid gap-3 text-sm font-semibold ${navClass}`}>
            {navigationLinks.map((item) => (
              <Link key={`${item.href}-${item.label}`} href={item.href} className="footer-link">
                {item.label} <ArrowUpRight size={15} />
              </Link>
            ))}
          </nav>

          <div>
            <p className="mb-5 text-sm font-semibold text-foreground dark:text-white">{followTitle}</p>
            {activeSocialLinks.length > 0 ? (
              <div className={`flex flex-wrap gap-3 ${layout === '1-col' ? 'justify-center' : ''}`}>
                {activeSocialLinks.map(([name, href]) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    className="grid size-11 place-items-center rounded-full border border-card-border dark:border-white/12 text-muted dark:text-[#a9bacb] transition hover:-translate-y-1 hover:border-lhu-orange/70 hover:text-foreground dark:hover:text-white"
                  >
                    <DynamicIcon name={socialIconNames[name]} size={19} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-7 text-muted dark:text-[#a9bacb]">{socialEmptyText}</p>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-card-border dark:border-white/8 pt-6">
          <div className="flex flex-col gap-3 text-xs text-muted dark:text-[#7f93a7] sm:flex-row sm:items-center sm:justify-between">
            <p>{copy}</p>
            <a href="#top" className="w-fit font-semibold text-foreground dark:text-white underline decoration-public-control dark:decoration-white/30 underline-offset-4 hover:decoration-lhu-orange">
              {backToTopLabel}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
