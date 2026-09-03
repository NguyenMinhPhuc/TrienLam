import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { query } from '@/lib/db';
import DynamicIcon from '@/components/DynamicIcon';
import type { SiteContentRow } from '@/lib/types';

const roboto = Roboto({ subsets: ["latin", "vietnamese"], weight: ["300", "400", "500", "700", "900"] });

export const metadata: Metadata = {
  title: "LHU Tech Hub - Khám Phá Tương Lai Công Nghệ",
  description: "Trải nghiệm hệ sinh thái AI từ Đại học Lạc Hồng. Khám phá lộ trình nghề nghiệp IT.",
};

async function getContent(): Promise<Record<string, string>> {
  try {
    const result = await query('SELECT SectionKey, Content FROM SiteContent');
    const content: Record<string, string> = {};
    result.recordset.forEach((item: SiteContentRow) => {
      content[item.SectionKey] = item.Content;
    });
    return content;
  } catch (err) {
    console.error('Failed to fetch site content for layout:', err);
    return {};
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getContent();

  const footerTitle = content.footer_title || 'ĐẠI HỌC LẠC HỒNG';
  const footerAddress = content.footer_address || 'Số 10, Huỳnh Văn Nghệ, P. Bửu Long, TP. Biên Hòa, Đồng Nai.';
  const footerCopy = content.footer_copy || `© ${new Date().getFullYear()} LHU Tech Hub. All rights reserved.`;
  const footerLayout = content.footer_layout || '3-col';
  const footerShowMap = content.footer_show_map === '1' || content.footer_show_map === 'true';
  const footerMapEmbed = content.footer_map_embed || '';

  const socialLinks: Record<string, string | undefined> = {
    facebook: content.footer_social_facebook,
    zalo: content.footer_social_zalo,
    instagram: content.footer_social_instagram,
    youtube: content.footer_social_youtube,
    linkedin: content.footer_social_linkedin,
    tiktok: content.footer_social_tiktok,
  };

  return (
    <html lang="vi" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <footer className="py-20 border-t border-white/10 mt-20 bg-lhu-dark">
            <div className="container mx-auto px-4 text-slate-400">
              {footerShowMap && footerMapEmbed && (
                <div className="mb-8 rounded-lg overflow-hidden border border-white/5">
                  <div dangerouslySetInnerHTML={{ __html: footerMapEmbed }} />
                </div>
              )}

              {footerLayout === '1-col' && (
                <div className="text-center">
                  <p className="font-bold text-white text-xl">{footerTitle}</p>
                  <p className="text-sm mt-2">{footerAddress}</p>
                  <div className="mt-4 flex items-center justify-center gap-4">
                    {socialLinks.facebook && (<a aria-label="Facebook" href={socialLinks.facebook} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Facebook" size={20} /></a>)}
                    {socialLinks.zalo && (<a aria-label="Zalo" href={socialLinks.zalo} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="MessageSquare" size={20} /></a>)}
                    {socialLinks.instagram && (<a aria-label="Instagram" href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Instagram" size={20} /></a>)}
                    {socialLinks.youtube && (<a aria-label="YouTube" href={socialLinks.youtube} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Youtube" size={20} /></a>)}
                    {socialLinks.linkedin && (<a aria-label="LinkedIn" href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Linkedin" size={20} /></a>)}
                    {socialLinks.tiktok && (<a aria-label="TikTok" href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Globe" size={20} /></a>)}
                  </div>
                </div>
              )}

              {footerLayout === '2-col' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div>
                    <p className="font-bold text-white text-lg">{footerTitle}</p>
                    <p className="text-sm mt-2">{footerAddress}</p>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <div className="flex gap-4">
                      {socialLinks.facebook && (<a aria-label="Facebook" href={socialLinks.facebook} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Facebook" size={20} /></a>)}
                      {socialLinks.zalo && (<a aria-label="Zalo" href={socialLinks.zalo} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="MessageSquare" size={20} /></a>)}
                      {socialLinks.instagram && (<a aria-label="Instagram" href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Instagram" size={20} /></a>)}
                      {socialLinks.youtube && (<a aria-label="YouTube" href={socialLinks.youtube} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Youtube" size={20} /></a>)}
                      {socialLinks.linkedin && (<a aria-label="LinkedIn" href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Linkedin" size={20} /></a>)}
                      {socialLinks.tiktok && (<a aria-label="TikTok" href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Globe" size={20} /></a>)}
                    </div>
                  </div>
                </div>
              )}

              {footerLayout === '3-col' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left md:text-left items-start">
                  <div>
                    <p className="font-bold text-white">{footerTitle}</p>
                  </div>
                  <div>
                    <p className="text-sm">{footerAddress}</p>
                  </div>
                  <div className="flex gap-4">
                    {socialLinks.facebook && (<a aria-label="Facebook" href={socialLinks.facebook} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Facebook" size={20} /></a>)}
                    {socialLinks.zalo && (<a aria-label="Zalo" href={socialLinks.zalo} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="MessageSquare" size={20} /></a>)}
                    {socialLinks.instagram && (<a aria-label="Instagram" href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Instagram" size={20} /></a>)}
                    {socialLinks.youtube && (<a aria-label="YouTube" href={socialLinks.youtube} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Youtube" size={20} /></a>)}
                    {socialLinks.linkedin && (<a aria-label="LinkedIn" href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Linkedin" size={20} /></a>)}
                    {socialLinks.tiktok && (<a aria-label="TikTok" href={socialLinks.tiktok} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white"><DynamicIcon name="Globe" size={20} /></a>)}
                  </div>
                </div>
              )}

              <div className="mt-8 text-center text-xs text-slate-400">{footerCopy}</div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
