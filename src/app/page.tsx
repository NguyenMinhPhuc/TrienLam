import { query, execute } from '@/lib/db';
import Hero from '@/components/Hero';
import ProductGallery from '@/components/ProductGallery';
import { Product } from '@/components/ProductCard';
import CareerQuiz from '@/components/CareerQuiz';
import StatsSection from '@/components/StatsSection';
import ContactSection from '@/components/ContactSection';
import DynamicSection from '@/components/DynamicSection';
import FacultySection from '@/components/FacultySection';
import MissionSection from '@/components/MissionSection';
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
import { contentValue } from '@/lib/site-content';

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
        title={contentValue(content, 'hero_title')}
        subtitle={contentValue(content, 'hero_subtitle')}
        productsLabel={contentValue(content, 'hero_products_label')}
        productsUrl={contentValue(content, 'hero_products_url')}
        quizLabel={contentValue(content, 'hero_quiz_label')}
        quizUrl={contentValue(content, 'hero_quiz_url')}
        scrollLabel={contentValue(content, 'hero_scroll_label')}
        scrollUrl={contentValue(content, 'hero_scroll_url')}
        videoSrc={contentValue(content, 'hero_video_src')}
        posterSrc={contentValue(content, 'hero_poster_src')}
      />

      {/* Stats Section */}
      <StatsSection
        stats={stats}
        title={contentValue(content, 'stats_title')}
        description={contentValue(content, 'stats_description')}
      />

      <FacultySection
        title={contentValue(content, 'faculty_title')}
        content={contentValue(content, 'about_faculty')}
        image={contentValue(content, 'about_faculty_image')}
        imageAlt={contentValue(content, 'faculty_image_alt')}
        ctaLabel={contentValue(content, 'faculty_cta_label')}
        ctaUrl={contentValue(content, 'faculty_cta_url')}
        featureOne={contentValue(content, 'faculty_feature_one')}
        featureTwo={contentValue(content, 'faculty_feature_two')}
        mediaCaption={contentValue(content, 'faculty_media_caption')}
        mediaLocation={contentValue(content, 'faculty_media_location')}
      />

      {!hasDynamicProductSection && (
        <section id="products" className="public-content section-pad scroll-mt-24 relative overflow-hidden bg-[var(--surface-2)] text-foreground dark:bg-[#091725] dark:text-white">
          <div className="site-shell">
            <div className="mb-14 grid gap-6 md:grid-cols-[1fr_.75fr] md:items-end">
              <h2 className="section-title text-foreground dark:text-white">
                {contentValue(content, 'products_title')}
              </h2>
              <p className="section-copy-on-dark md:justify-self-end">
                {contentValue(content, 'products_description')}
              </p>
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
      <CareerQuiz
        products={products}
        quizData={quizData}
        title={contentValue(content, 'quiz_title')}
        description={contentValue(content, 'quiz_description')}
        startTitle={contentValue(content, 'quiz_start_title')}
        startDescription={contentValue(content, 'quiz_start_description')}
        startButton={contentValue(content, 'quiz_start_button')}
        steps={[
          contentValue(content, 'quiz_step_one'),
          contentValue(content, 'quiz_step_two'),
          contentValue(content, 'quiz_step_three'),
        ]}
      />

      {/* Contact Section */}
      <ContactSection 
        title={contentValue(content, 'contact_title')}
        description={contentValue(content, 'contact_description')}
        address={contentValue(content, 'contact_address')}
        phone={contentValue(content, 'contact_phone')}
        email={contentValue(content, 'contact_email')}
      />

      <MissionSection
        title={contentValue(content, 'mission_title')}
        content={contentValue(content, 'it_industry_info')}
        ctaLabel={contentValue(content, 'mission_cta_label')}
        ctaUrl={contentValue(content, 'mission_cta_url')}
      />
    </main>
  );
}
