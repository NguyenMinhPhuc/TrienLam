import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

const roboto = Roboto({ subsets: ["latin", "vietnamese"], weight: ["300", "400", "500", "700", "900"] });

export const metadata: Metadata = {
  title: "LHU Tech Hub - Khám Phá Tương Lai Công Nghệ",
  description: "Trải nghiệm hệ sinh thái AI từ Đại học Lạc Hồng. Khám phá lộ trình nghề nghiệp IT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <footer className="py-20 border-t border-white/10 mt-20 dark:bg-lhu-dark">
            <div className="container mx-auto px-4 text-center text-slate-400">
              <p className="font-bold">ĐẠI HỌC LẠC HỒNG</p>
              <p className="text-sm">Số 10, Huỳnh Văn Nghệ, P. Bửu Long, TP. Biên Hòa, Đồng Nai.</p>
              <p className="mt-8 text-xs">&copy; 2026 LHU Tech Hub. All rights reserved.</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
