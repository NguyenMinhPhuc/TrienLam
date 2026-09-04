import type { Metadata } from "next";
import { Be_Vietnam_Pro, Lexend } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { query } from '@/lib/db';
import SiteFooter from '@/components/SiteFooter';
import type { SiteContentRow } from '@/lib/types';
import { contentValue } from '@/lib/site-content';

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  display: "swap",
});

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

  const footerTitle = contentValue(content, 'footer_title');
  const footerAddress = contentValue(content, 'footer_address');
  const footerCopy = content.footer_copy || `© ${new Date().getFullYear()} LHU Tech Hub. All rights reserved.`;
  const footerLayout = contentValue(content, 'footer_layout');
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
    <html lang="vi" className={`${beVietnam.variable} ${lexend.variable} scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar
            items={[
              { href: contentValue(content, 'nav_faculty_url'), label: contentValue(content, 'nav_faculty_label') },
              { href: contentValue(content, 'nav_academic_url'), label: contentValue(content, 'nav_academic_label') },
              { href: contentValue(content, 'nav_products_url'), label: contentValue(content, 'nav_products_label') },
              { href: contentValue(content, 'nav_quiz_url'), label: contentValue(content, 'nav_quiz_label') },
            ]}
            admissionsLabel={contentValue(content, 'nav_admissions_label')}
            admissionsUrl={contentValue(content, 'nav_admissions_url')}
          />
          {children}
          <SiteFooter
            title={footerTitle}
            address={footerAddress}
            copy={footerCopy}
            layout={footerLayout}
            showMap={footerShowMap}
            mapEmbed={footerMapEmbed}
            socialLinks={socialLinks}
            navigationLinks={[
              { href: contentValue(content, 'footer_nav_faculty_url'), label: contentValue(content, 'footer_nav_faculty_label') },
              { href: contentValue(content, 'footer_nav_academic_url'), label: contentValue(content, 'footer_nav_academic_label') },
              { href: contentValue(content, 'footer_nav_products_url'), label: contentValue(content, 'footer_nav_products_label') },
              { href: contentValue(content, 'footer_nav_quiz_url'), label: contentValue(content, 'footer_nav_quiz_label') },
            ]}
            followTitle={contentValue(content, 'footer_follow_title')}
            socialEmptyText={contentValue(content, 'footer_social_empty')}
            backToTopLabel={contentValue(content, 'footer_back_to_top_label')}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
