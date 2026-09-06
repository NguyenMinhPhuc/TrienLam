import { execute } from '@/lib/db';
import DynamicSection from '@/components/DynamicSection';
import type { Product } from '@/components/ProductCard';
import type { CustomSectionData } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getAcademicSections(): Promise<CustomSectionData[]> {
  try {
    const result = await execute('SELECT * FROM CustomSections WHERE IsActive = 1 AND (PageKey = @pageKey OR PageKey = \'all\') ORDER BY OrderIndex ASC', { pageKey: 'academic' });
    return result.recordset;
  } catch (error) {
    console.error('Failed to fetch academic sections:', error);
    return [];
  }
}

async function getProducts(): Promise<Product[]> {
  try {
    const result = await execute('SELECT * FROM Products ORDER BY Year DESC, Id DESC', {});
    return result.recordset;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function AcademicPage() {
  const [sections, products] = await Promise.all([getAcademicSections(), getProducts()]);

  return (
    <main className="overflow-x-hidden bg-background text-foreground">
      <section className="blueprint-surface relative overflow-hidden border-b border-card-border bg-[#07111d] pb-20 pt-40 text-white md:pb-28 md:pt-52">
        <div className="site-shell relative z-10">
          <h1 className="font-display max-w-[17ch] text-[clamp(2.3rem,6.2vw,4.5rem)] font-[650] leading-[1.14] tracking-[-0.012em] text-white">
            Ngành Công nghệ <span className="text-lhu-orange">Thông tin</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#b5c6d3] md:text-xl md:leading-9">
            Kiến tạo tương lai, làm chủ công nghệ và dẫn đầu thời đại số cùng Đại học Lạc Hồng.
          </p>
          <div className="signal-line mt-10" aria-hidden="true" />
        </div>
        <div className="absolute -right-32 top-16 size-[30rem] rounded-full bg-lhu-blue/12 blur-[100px]" aria-hidden="true" />
      </section>

      {sections.length === 0 ? (
        <div className="site-shell section-pad text-center text-muted">
          Nội dung đang được cập nhật từ Ban Giám Hiệu. Vui lòng quay lại sau!
        </div>
      ) : (
        sections.map((section) => (
          <DynamicSection
            key={section.Id}
            title={section.Title}
            subtitle={section.Subtitle}
            layoutType={section.LayoutType}
            bgStyle={section.BgStyle}
            contentJson={section.ContentJson}
            products={products}
          />
        ))
      )}

      <section className="public-content section-pad relative overflow-hidden bg-[var(--surface-2)] dark:bg-[#091725] text-foreground dark:text-white">
        <div className="site-shell relative z-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="section-title max-w-[16ch] text-foreground dark:text-white">Sẵn sàng trở thành kỹ sư CNTT thế hệ mới?</h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted dark:text-[#a9bac8]">Đăng ký xét tuyển để tìm hiểu chương trình đào tạo và môi trường học tập thực chiến tại Đại học Lạc Hồng.</p>
          </div>
          <a href="https://tuyensinh.lhu.edu.vn" target="_blank" rel="noreferrer" className="button-primary px-8">Đăng ký xét tuyển →</a>
        </div>
      </section>
    </main>
  );
}
