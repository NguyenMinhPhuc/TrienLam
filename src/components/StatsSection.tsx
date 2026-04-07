"use client";
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface Stat {
  Id: number;
  Label: string;
  Value: string;
  IconName: string;
}

export default function StatsSection({ stats }: { stats: Stat[] }) {
  // Helper to render icon by name
  const IconComponent = ({ name, className }: { name: string, className?: string }) => {
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon className={className} size={32} /> : <LucideIcons.HelpCircle className={className} size={32} />;
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.Id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-card-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-card-border">
                <IconComponent name={stat.IconName} className="text-lhu-blue dark:text-lhu-blue" />
              </div>
              <h3 className="text-4xl font-black mb-2 text-foreground">{stat.Value}</h3>
              <p className="text-muted font-bold uppercase tracking-widest text-xs">{stat.Label}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-lhu-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lhu-orange/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
