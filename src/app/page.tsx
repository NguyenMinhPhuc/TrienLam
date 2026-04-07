import { query, execute } from '@/lib/db';
import Hero from '@/components/Hero';
import ProductGallery from '@/components/ProductGallery';
import { Product } from '@/components/ProductCard';
import CareerQuiz from '@/components/CareerQuiz';
import StatsSection from '@/components/StatsSection';
import ContactSection from '@/components/ContactSection';
import DynamicSection from '@/components/DynamicSection';

async function getProducts(): Promise<Product[]> {
  try {
    const result = await query('SELECT * FROM Products ORDER BY Year DESC, Id DESC');
    return result.recordset;
  } catch (err) {
    console.error('Failed to fetch products:', err);
    return [];
  }
}

async function getContent(): Promise<Record<string, string>> {
  try {
    const result = await query('SELECT SectionKey, Content FROM SiteContent');
    const content: Record<string, string> = {};
    result.recordset.forEach((item: any) => {
      content[item.SectionKey] = item.Content;
    });
    return content;
  } catch (err) {
    console.error('Failed to fetch content:', err);
    return {};
  }
}

async function getCustomSections(): Promise<any[]> {
  try {
    const result = await execute('SELECT * FROM CustomSections WHERE IsActive = 1 AND (PageKey = @pageKey OR PageKey = \'all\' OR PageKey IS NULL OR PageKey = \'\') ORDER BY OrderIndex ASC', { pageKey: 'home' });
    return result.recordset;
  } catch (err) {
    console.error('Failed to fetch custom sections:', err);
    return [];
  }
}

async function getStats(): Promise<any[]> {
  try {
    const result = await query('SELECT * FROM Stats ORDER BY OrderIndex ASC');
    return result.recordset;
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    return [];
  }
}

async function getQuizData() {
  try {
    const [questionsRes, optionsRes, resultsRes] = await Promise.all([
      query('SELECT * FROM QuizQuestions ORDER BY OrderIndex ASC'),
      query('SELECT * FROM QuizOptions ORDER BY OrderIndex ASC'),
      query('SELECT * FROM QuizResults')
    ]);

    const resultsMap: Record<string, any> = {};
    resultsRes.recordset.forEach((r: any) => {
      resultsMap[r.ResultKey] = r;
    });

    const questions = questionsRes.recordset.map((q: any) => ({
      ...q,
      Options: optionsRes.recordset.filter((o: any) => o.QuestionId === q.Id)
    }));

    return { questions, results: resultsMap };
  } catch (err) {
    console.error('Failed to fetch quiz data:', err);
    return { questions: [], results: {} };
  }
}

export default async function Home() {
  const [products, content, customSections, stats, quizData] = await Promise.all([
    getProducts(), 
    getContent(),
    getCustomSections(),
    getStats(),
    getQuizData()
  ]);

  return (
    <main className="overflow-x-hidden bg-background text-foreground transition-colors duration-500">
      {/* Hero Section */}
      <Hero 
        title={content.hero_title || 'Nơi Khởi Đầu <br/><span class="gradient-text tracking-tighter">Đam Mê Công Nghệ</span>'} 
        subtitle={content.hero_subtitle || 'Trải nghiệm hệ sinh thái AI độc quyền từ Đại học Lạc Hồng. Khám phá lộ trình nghề nghiệp IT tương lai.'} 
      />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Faculty Section */}
      <section id="faculty" className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="bg-card-bg backdrop-blur-2xl border border-card-border rounded-[40px] p-12 md:p-24 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                  Về Khoa <br/>
                  <span className="text-lhu-blue">Công Nghệ Thông Tin</span>
                </h2>
                <div 
                  className="text-muted text-lg md:text-xl leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{ __html: content.about_faculty || 'Đang cập nhật nội dung từ Ban Giám Hiệu Khoa CNTT. LHU luôn tiên phong trong đào tạo kỹ năng thực chiến và tư duy sáng tạo.' }}
                />
                
                <div className="mt-12 flex gap-4">
                   <a href="https://cs.lhu.edu.vn" target="_blank" className="text-lhu-orange font-bold hover:underline flex items-center gap-2">
                      Xem trang chủ của Khoa &rarr;
                   </a>
                </div>
              </div>
              
              <div className="relative">
                  <div className="w-full aspect-square rounded-[28px] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl border-4 border-white dark:border-white/10">
                    <img 
                      src={content.about_faculty_image || "https://lhu.edu.vn/Data/News/391/files/LHU%20DH%20Lac%20Hong-1(1).jpg"} 
                      alt="Faculty" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                 <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-lhu-orange/20 rounded-full blur-3xl" />
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-lhu-blue/5 rounded-full blur-3xl -mr-20 -mt-20" />
          </div>
        </div>
      </section>

      {/* Custom Dynamic Sections */}
      {customSections.map((section) => (
        <DynamicSection 
          key={section.Id}
          title={section.Title}
          subtitle={section.Subtitle}
          layoutType={section.LayoutType}
          bgStyle={section.BgStyle}
          contentJson={section.ContentJson}
          products={products}
        />
      ))}

      {/* Career Quiz Section */}
      <CareerQuiz products={products} quizData={quizData} />

      {/* Contact Section */}
      <ContactSection 
        address={content.contact_address}
        phone={content.contact_phone}
        email={content.contact_email}
      />

      {/* IT Industry Section */}
      <section className="py-32 bg-gradient-to-t from-lhu-blue/5 to-transparent relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-10 text-foreground">Sứ Mệnh & Tầm Nhìn</h2>
            <p className="text-muted max-w-4xl mx-auto text-xl italic leading-relaxed">
               "{content.it_industry_info || 'Lạc Hồng University cam kết đào tạo những kỹ sư không chỉ giỏi về kỹ năng mà còn có tư duy giải quyết vấn đề thực tiễn, đóng góp cho sự phát triển của nền kinh tế số Việt Nam.'}"
            </p>
        </div>
      </section>
    </main>
  );
}
