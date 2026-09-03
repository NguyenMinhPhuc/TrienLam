import { query, execute } from '@/lib/db';
import Hero from '@/components/Hero';
import ProductGallery from '@/components/ProductGallery';
import { Product } from '@/components/ProductCard';
import CareerQuiz from '@/components/CareerQuiz';
import StatsSection from '@/components/StatsSection';
import ContactSection from '@/components/ContactSection';
import DynamicSection from '@/components/DynamicSection';
import CmsImage from '@/components/CmsImage';
import type {
  CustomSectionData,
  Industry,
  QuizData,
  QuizOption,
  QuizQuestionRow,
  QuizResult,
  SiteContentRow,
  StatData,
} from '@/lib/types';

export const dynamic = 'force-dynamic';

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
    result.recordset.forEach((item: SiteContentRow) => {
      content[item.SectionKey] = item.Content;
    });
    return content;
  } catch (err) {
    console.error('Failed to fetch content:', err);
    return {};
  }
}

async function getCustomSections(): Promise<CustomSectionData[]> {
  try {
    const result = await execute('SELECT * FROM CustomSections WHERE IsActive = 1 AND (PageKey = @pageKey OR PageKey = \'all\' OR PageKey IS NULL OR PageKey = \'\') ORDER BY OrderIndex ASC', { pageKey: 'home' });
    return result.recordset;
  } catch (err) {
    console.error('Failed to fetch custom sections:', err);
    return [];
  }
}

async function getStats(): Promise<StatData[]> {
  try {
    const result = await query('SELECT * FROM Stats ORDER BY OrderIndex ASC');
    return result.recordset;
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    return [];
  }
}

async function getQuizData(): Promise<QuizData> {
  try {
    const [questionsRes, optionsRes, resultsRes] = await Promise.all([
      query('SELECT * FROM QuizQuestions ORDER BY OrderIndex ASC'),
      query('SELECT * FROM QuizOptions ORDER BY QuestionId ASC, OrderIndex ASC'),
      query('SELECT * FROM QuizResults'),
    ]);

    let industries: Industry[] = [];
    try {
      const industriesRes = await query('SELECT * FROM Industries ORDER BY Id ASC');
      industries = industriesRes.recordset as Industry[];
    } catch (error) {
      console.warn('Industries are unavailable; continuing with the core quiz.', error);
    }

    const resultsMap: Record<string, QuizResult> = {};
    (resultsRes.recordset as QuizResult[]).forEach((result) => {
      resultsMap[result.ResultKey] = result;
    });

    const options = optionsRes.recordset as QuizOption[];
    const questions = (questionsRes.recordset as QuizQuestionRow[]).map((question) => ({
      ...question,
      Options: options.filter((option) => option.QuestionId === question.Id),
    }));

    return { questions, results: resultsMap, industries };
  } catch (err) {
    console.error('Failed to fetch quiz data:', err);
    return {
      questions: [],
      results: {},
      industries: [],
      error: 'Dữ liệu trắc nghiệm hiện chưa sẵn sàng.',
    };
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
  const hasDynamicProductSection = customSections.some(
    (section) => section.LayoutType === 'product-showcase',
  );

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
                   <a href="https://cs.lhu.edu.vn" target="_blank" rel="noopener noreferrer" className="text-lhu-orange font-bold hover:underline flex items-center gap-2">
                      Xem trang chủ của Khoa &rarr;
                   </a>
                </div>
              </div>
              
              <div className="relative">
                  <div className="relative w-full aspect-square rounded-[28px] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl border-4 border-white dark:border-white/10">
                    <CmsImage
                      src={content.about_faculty_image || "https://lhu.edu.vn/Data/News/391/files/LHU%20DH%20Lac%20Hong-1(1).jpg"} 
                      alt="Khoa Công nghệ Thông tin, Đại học Lạc Hồng"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
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

      {!hasDynamicProductSection && (
        <section id="products" className="scroll-mt-24 py-32 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground">
                Sản phẩm công nghệ nổi bật
              </h2>
              <p className="text-muted text-xl max-w-2xl mx-auto">
                Khám phá các dự án thực tế được phát triển bởi sinh viên Khoa Công nghệ Thông tin.
              </p>
              <div className="w-20 h-1.5 bg-lhu-orange mx-auto rounded-full mt-8" />
            </div>
            <ProductGallery products={products} />
          </div>
        </section>
      )}

      {/* Custom Dynamic Sections */}
      {customSections.map((section) => (
        <DynamicSection 
          key={section.Id}
          anchorId={section.LayoutType === 'product-showcase' ? 'products' : undefined}
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
            <blockquote className="text-muted max-w-4xl mx-auto text-xl italic leading-relaxed">
              {content.it_industry_info || 'Lạc Hồng University cam kết đào tạo những kỹ sư không chỉ giỏi về kỹ năng mà còn có tư duy giải quyết vấn đề thực tiễn, đóng góp cho sự phát triển của nền kinh tế số Việt Nam.'}
            </blockquote>
        </div>
      </section>
    </main>
  );
}
