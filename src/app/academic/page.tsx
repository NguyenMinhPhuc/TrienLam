import { query, execute } from '@/lib/db';
import DynamicSection from '@/components/DynamicSection';

export const dynamic = 'force-dynamic';

async function getAcademicSections(): Promise<any[]> {
  try {
    const result = await execute('SELECT * FROM CustomSections WHERE IsActive = 1 AND (PageKey = @pageKey OR PageKey = \'all\') ORDER BY OrderIndex ASC', { pageKey: 'academic' });
    return result.recordset;
  } catch (err) {
    console.error('Failed to fetch academic sections:', err);
    return [];
  }
}

async function getProducts(): Promise<any[]> {
  try {
    const result = await execute('SELECT * FROM Products ORDER BY Year DESC, Id DESC', {});
    return result.recordset;
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return [];
  }
}

export default async function AcademicPage() {
  const [sections, products] = await Promise.all([
    getAcademicSections(),
    getProducts()
  ]);

  return (
    <main className="overflow-x-hidden bg-background text-foreground transition-colors duration-500 pt-32 pb-32">
      {/* Page Header */}
      <section className="py-20 bg-gradient-to-b from-lhu-blue/10 to-transparent">
        <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-8 text-foreground">
               Ngành <span className="gradient-text">Công Nghệ Thông Tin</span>
            </h1>
            <p className="text-muted text-xl max-w-3xl mx-auto leading-relaxed">
               Kiến tạo tương lai, làm chủ công nghệ và dẫn đầu thời đại số cùng Đại học Lạc Hồng.
            </p>
            <div className="w-24 h-2 bg-lhu-orange mx-auto rounded-full mt-10 shadow-xl shadow-lhu-orange/20" />
        </div>
      </section>

      {/* Dynamic Sections */}
      {sections.length === 0 ? (
          <div className="container mx-auto px-4 py-32 text-center text-slate-500 italic">
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

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
         <div className="container mx-auto px-4 text-center relative z-10">
            <div className="bg-lhu-blue text-white p-16 md:p-24 rounded-[40px] shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Sẵn sàng để trở thành <br/> kỹ sư CNTT thế hệ mới?</h2>
                  <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-12">Đăng ký xét tuyển ngay hôm nay để nhận học bổng công nghệ và trải nghiệm môi trường đào tạo thực chiến.</p>
                  <a href="https://tuyensinh.lhu.edu.vn" target="_blank" className="inline-block px-12 py-5 bg-lhu-orange hover:bg-white hover:text-lhu-orange text-white rounded-2xl font-black text-xl transition-all shadow-2xl hover:scale-105 active:scale-95">
                     ĐĂNG KÝ XÉT TUYỂN &rarr;
                  </a>
               </div>
               {/* Background elements */}
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48 transition-transform group-hover:scale-110" />
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-48 -mb-48 transition-transform group-hover:scale-110" />
            </div>
         </div>
      </section>
    </main>
  );
}
