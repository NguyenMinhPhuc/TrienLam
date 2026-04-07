"use client";
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import Script from 'next/script';
import ProductGallery from './ProductGallery';
import { Product } from './ProductCard';

interface ContentItem {
  title: string;
  body: string;
  icon: string;
  // For script-embed
  src?: string;
  id?: string;
  containerId?: string;
  botId?: string;
}

interface DynamicSectionProps {
  title: string;
  subtitle?: string;
  layoutType: string;
  bgStyle: string;
  contentJson: string;
  products?: Product[];
}

export default function DynamicSection({ 
  title, 
  subtitle, 
  layoutType, 
  bgStyle, 
  contentJson,
  products = []
}: DynamicSectionProps) {
  let items: ContentItem[] = [];
  try {
    const parsed = JSON.parse(contentJson);
    items = Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    console.error("Failed to parse section content JSON", e);
  }

  const getGridClass = () => {
    switch (layoutType) {
      case '1-col': return 'grid-cols-1 max-w-3xl mx-auto';
      case '2-col': return 'grid-cols-1 md:grid-cols-2 gap-10';
      case '3-col': return 'grid-cols-1 md:grid-cols-3 gap-8';
      case '4-col': return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6';
      default: return 'grid-cols-1 md:grid-cols-3 gap-8';
    }
  };

  const getBgClass = () => {
    switch (bgStyle) {
      case 'muted': return 'bg-card-bg/30';
      case 'gradient': return 'bg-gradient-to-b from-lhu-blue/5 to-lhu-orange/5';
      default: return 'bg-transparent';
    }
  };

  // Helper to render icon by name
  const IconComponent = ({ name, size = 24 }: { name: string, size?: number }) => {
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon size={size} /> : <LucideIcons.HelpCircle size={size} />;
  };

  if (layoutType === 'product-showcase') {
    return (
      <section className={`py-32 relative overflow-hidden transition-colors duration-500 ${getBgClass()}`}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground" dangerouslySetInnerHTML={{ __html: title }} />
            {subtitle && <p className="text-muted text-xl max-w-2xl mx-auto mb-10" dangerouslySetInnerHTML={{ __html: subtitle }} />}
            <div className="w-20 h-1.5 bg-lhu-orange mx-auto rounded-full mt-8" />
          </div>
          <ProductGallery products={products} />
        </div>
      </section>
    );
  }

  if (layoutType === 'timeline') {
    return (
      <section className={`py-32 relative overflow-hidden transition-colors duration-500 ${getBgClass()}`}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground" dangerouslySetInnerHTML={{ __html: title }} />
            {subtitle && <p className="text-muted text-xl max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: subtitle }} />}
            <div className="w-20 h-1.5 bg-lhu-orange mx-auto rounded-full mt-8" />
          </div>

          <div className="max-w-4xl mx-auto relative">
             {/* The vertical line */}
             <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />
             
             <div className="space-y-12">
                {items.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    {/* Content */}
                    <div className="flex-1 w-full">
                       <div className={`p-8 bg-card-bg backdrop-blur-2xl border border-card-border rounded-[28px] shadow-xl hover:border-lhu-blue/40 transition-all ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                          <div className={`w-12 h-12 bg-lhu-blue/10 rounded-2xl flex items-center justify-center mb-6 text-lhu-blue ${idx % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                             <IconComponent name={item.icon} size={24} />
                          </div>
                          <h3 className="text-2xl font-bold mb-3 text-foreground">{item.title}</h3>
                          <p className="text-muted leading-relaxed">{item.body}</p>
                       </div>
                    </div>
                    
                    {/* Center Dot */}
                    <div className="w-12 h-12 bg-slate-900 border-4 border-lhu-orange rounded-full z-10 flex items-center justify-center text-lhu-orange shadow-[0_0_20px_rgba(242,103,34,0.3)] hidden md:flex">
                       <div className="w-2 h-2 bg-lhu-orange rounded-full animate-ping" />
                    </div>

                    {/* Spacer for other side */}
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>
    );
  }

  if (layoutType === 'script-embed') {
    // ... (rest of the script-embed logic is fine)
    const scriptData = items[0];
    return (
      <section className={`py-32 relative overflow-hidden transition-colors duration-500 ${getBgClass()}`}>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground" dangerouslySetInnerHTML={{ __html: title }} />
            {subtitle && <p className="text-muted text-xl max-w-2xl mx-auto mb-10" dangerouslySetInnerHTML={{ __html: subtitle }} />}
          </div>
          
          <style dangerouslySetInnerHTML={{ __html: `
            #${scriptData?.containerId || 'script-container'} iframe,
            #${scriptData?.containerId || 'script-container'} div {
              height: 100% !important;
              min-height: 580px !important;
            }
          ` }} />
          
          <div className="max-w-5xl mx-auto bg-card-bg/50 backdrop-blur-xl border border-card-border rounded-[28px] p-2 h-[600px] relative overflow-hidden shadow-2xl grid place-items-stretch">
             {/* Target Container for the Script */}
             <div id={scriptData?.containerId || 'script-container'} className="w-full h-full overflow-hidden">
                {!scriptData?.src && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-500 italic text-center px-10 leading-relaxed text-sm">Chưa cấu hình Script URL. Vui lòng nhập URL script trong trang quản trị để hiển thị sản phẩm nhúng.</p>
                  </div>
                )}
             </div>

             {/* External Script Injection */}
             {scriptData?.src && (
               <Script
                 id={scriptData.id || 'dynamic-script'}
                 src={scriptData.src}
                 data-chatbot-id={scriptData.botId}
                 data-target-id={scriptData.containerId}
                 strategy="afterInteractive"
               />
             )}
          </div>
        </div>
        
        {bgStyle === 'gradient' && (
          <>
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-lhu-blue/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-lhu-orange/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          </>
        )}
      </section>
    );
  }

  return (
    <section className={`py-32 relative overflow-hidden transition-colors duration-500 ${getBgClass()}`}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-6 text-foreground"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted text-xl max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}
          <div className="w-20 h-1.5 bg-lhu-orange mx-auto rounded-full mt-8" />
        </div>

        <div className={`grid ${getGridClass()}`}>
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card-bg backdrop-blur-xl border border-card-border p-10 rounded-[24px] hover:border-lhu-blue/50 transition-all group hover:shadow-2xl"
            >
              <div className="w-14 h-14 bg-lhu-blue/10 rounded-2xl flex items-center justify-center mb-8 text-lhu-blue group-hover:bg-lhu-blue group-hover:text-white transition-all shadow-lg border border-lhu-blue/20">
                <IconComponent name={item.icon} size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{item.title}</h3>
              <p className="text-muted leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative logic */}
      {bgStyle === 'gradient' && (
        <>
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-lhu-blue/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-lhu-orange/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        </>
      )}
    </section>
  );
}
