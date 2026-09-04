"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Check, Monitor, RotateCcw } from 'lucide-react';
import { Product } from './ProductCard';
import CmsImage from './CmsImage';
import DynamicIcon from './DynamicIcon';
import type { QuizData } from '@/lib/types';

interface CareerQuizProps {
  products: Product[];
  quizData: QuizData;
  title: string;
  description: string;
  startTitle: string;
  startDescription: string;
  startButton: string;
  steps: [string, string, string];
}

const RESULT_CAREER_PATHS: Record<string, string[]> = {
  AI: ['Trí tuệ nhân tạo'],
  Frontend: ['Sản phẩm phần mềm'],
  Backend: ['Sản phẩm phần mềm', 'Mạng máy tính'],
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function CareerQuiz({
  products,
  quizData,
  title,
  description,
  startTitle,
  startDescription,
  startButton,
  steps,
}: CareerQuizProps) {
  const [step, setStep] = useState<'start' | 'question' | 'result'>('start');
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [winner, setWinner] = useState<string | null>(null);
  const [industryWinner, setIndustryWinner] = useState<string | null>(null);
  const { questions, results, industries } = quizData;

  const calculateWinner = (finalScores: Record<string, number>) => {
    const winningType = Object.entries(finalScores).reduce<string | null>((best, [type, score]) => {
      if (best === null || score > (finalScores[best] ?? -1)) return type;
      return best;
    }, null);
    setWinner(winningType);

    const industryScores: Record<string, number> = {};
    Object.entries(finalScores).forEach(([resultKey, score]) => {
      const industryKey = results[resultKey]?.IndustryKey || resultKey;
      industryScores[industryKey] = (industryScores[industryKey] || 0) + score;
    });
    const industryKey = Object.entries(industryScores).reduce<string | null>((best, [key, score]) => {
      if (best === null || score > (industryScores[best] ?? -1)) return key;
      return best;
    }, null);
    setIndustryWinner(industryKey);
  };

  const handleAnswer = (type: string) => {
    const nextScores = { ...scores, [type]: (scores[type] || 0) + 1 };
    setScores(nextScores);
    if (currentQ < questions.length - 1) {
      setCurrentQ((value) => value + 1);
      return;
    }
    calculateWinner(nextScores);
    setStep('result');
  };

  const resetQuiz = () => {
    setStep('start');
    setCurrentQ(0);
    setScores({});
    setWinner(null);
    setIndustryWinner(null);
  };

  const winnerResult = winner ? results[winner] : undefined;
  const industry = industries.find((item) => item.IndustryKey === industryWinner);
  const matchingPaths = winner ? RESULT_CAREER_PATHS[winner] || [winner] : [];
  const recommendedProduct = products.find((product) => matchingPaths.includes(product.CareerPath));

  return (
    <section id="quiz" className="section-pad scroll-mt-24 relative overflow-hidden bg-background">
      <div className="site-shell relative z-10">
        <div className="mb-12 grid gap-6 md:grid-cols-[1fr_.7fr] md:items-end">
          <h2 className="section-title">{title}</h2>
          <p className="section-copy md:justify-self-end">{description}</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-[0_28px_90px_-58px_rgba(0,0,0,.85)]">
          {questions.length === 0 ? (
            <div role="status" className="grid min-h-[28rem] place-items-center p-8 text-center">
              <div>
                <AlertCircle className="mx-auto text-lhu-orange" size={34} aria-hidden="true" />
                <h3 className="font-display mt-6 text-3xl font-bold text-foreground">Trắc nghiệm đang được cập nhật</h3>
                <p className="mx-auto mt-4 max-w-xl leading-7 text-muted">{quizData.error || 'Nội dung câu hỏi chưa sẵn sàng. Vui lòng quay lại sau.'}</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              {step === 'start' && (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -36 }}
                  transition={{ duration: 0.4, ease }}
                  className="grid min-h-[34rem] md:grid-cols-[1.16fr_.84fr]"
                >
                  <div className="flex flex-col justify-between p-7 sm:p-10 md:p-14">
                    <div>
                      <p className="font-display text-[clamp(1.9rem,4vw,3.5rem)] font-bold leading-[1.18] tracking-[-0.01em] text-foreground">{startTitle}</p>
                      <p className="mt-7 max-w-xl text-base leading-8 text-muted">{startDescription.replaceAll('{count}', String(questions.length))}</p>
                    </div>
                    <button type="button" onClick={() => setStep('question')} className="button-primary mt-10 w-fit px-7">
                      {startButton} <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="blueprint-surface flex flex-col justify-center border-t border-card-border p-7 md:border-l md:border-t-0 md:p-10">
                    {[
                      ['01', steps[0]],
                      ['02', steps[1]],
                      ['03', steps[2]],
                    ].map(([number, label]) => (
                      <div key={number} className="flex items-center gap-5 border-b border-card-border py-6 last:border-b-0">
                        <span className="font-display text-3xl font-extrabold text-lhu-blue">{number}</span>
                        <span className="font-semibold text-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 'question' && questions[currentQ] && (
                <motion.div
                  key={`question-${currentQ}`}
                  initial={{ opacity: 0, x: 46 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -46 }}
                  transition={{ duration: 0.38, ease }}
                  className="grid min-h-[34rem] md:grid-cols-[.42fr_1.58fr]"
                >
                  <div className="blueprint-surface border-b border-card-border p-7 md:border-b-0 md:border-r md:p-10">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Tiến độ</p>
                    <p className="font-display mt-3 text-5xl font-extrabold tabular-nums text-foreground">{String(currentQ + 1).padStart(2, '0')}<span className="text-2xl text-muted">/{String(questions.length).padStart(2, '0')}</span></p>
                    <div className="mt-7 h-1 overflow-hidden bg-card-border">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                        className="h-full bg-lhu-orange"
                      />
                    </div>
                  </div>

                  <div className="p-7 sm:p-10 md:p-14">
                    <h3 className="font-display max-w-3xl text-2xl font-bold leading-[1.3] tracking-[-0.01em] text-foreground sm:text-3xl">{questions[currentQ].QuestionText}</h3>
                    <div className="mt-9 grid gap-3">
                      {questions[currentQ].Options.length > 0 ? questions[currentQ].Options.map((option) => (
                        <button
                          type="button"
                          key={option.Id}
                          onClick={() => handleAnswer(option.ResultType)}
                          className="group flex min-h-16 w-full items-center gap-4 rounded-xl border border-card-border bg-background px-5 py-4 text-left font-medium text-foreground transition hover:border-lhu-blue/60 hover:bg-lhu-blue/8"
                        >
                          <span className="grid size-7 shrink-0 place-items-center rounded-full border border-card-border text-transparent transition group-hover:border-lhu-blue group-hover:text-lhu-blue"><Check size={15} aria-hidden="true" /></span>
                          <span className="flex-1">{option.OptionText}</span>
                          <ArrowRight className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-lhu-orange" size={18} aria-hidden="true" />
                        </button>
                      )) : (
                        <div role="alert" className="rounded-xl border border-lhu-orange/30 bg-lhu-orange/8 p-6">
                          <p className="font-semibold text-foreground">Câu hỏi này chưa có phương án trả lời.</p>
                          <button type="button" onClick={resetQuiz} className="mt-4 font-semibold text-lhu-orange underline underline-offset-4">Quay lại màn hình bắt đầu</button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'result' && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="grid min-h-[34rem] md:grid-cols-[1.05fr_.95fr]"
                >
                  <div className="p-7 sm:p-10 md:p-14">
                    <div className="grid size-16 place-items-center rounded-2xl bg-lhu-blue text-white">
                      {winnerResult ? <DynamicIcon name={winnerResult.IconName} size={31} /> : <Monitor size={31} aria-hidden="true" />}
                    </div>
                    <p className="mt-8 text-sm font-semibold text-muted">Lĩnh vực phù hợp với bạn</p>
                    <h3 className="font-display mt-3 text-[clamp(2rem,4vw,3.35rem)] font-bold leading-[1.18] tracking-[-0.01em] text-foreground">{winnerResult?.Title || winner || 'Kết quả đang cập nhật'}</h3>
                    {industryWinner && <p className="mt-5 font-semibold text-lhu-blue">Ngành gợi ý: {industry?.Title || industryWinner}</p>}
                    <p className="mt-7 max-w-xl leading-8 text-muted">{winnerResult?.Description || 'Nội dung kết quả đang được cập nhật.'}</p>
                    <button type="button" onClick={resetQuiz} className="mt-10 inline-flex items-center gap-2 font-semibold text-foreground underline decoration-card-border underline-offset-8 hover:decoration-lhu-orange">
                      <RotateCcw size={17} aria-hidden="true" /> Làm lại trắc nghiệm
                    </button>
                  </div>

                  <div className="blueprint-surface flex items-center border-t border-card-border p-7 md:border-l md:border-t-0 md:p-10">
                    {recommendedProduct ? (
                      <div className="w-full overflow-hidden rounded-2xl border border-card-border bg-card-bg">
                        <div className="relative aspect-[16/10] bg-[#050b12]">
                          <CmsImage src={recommendedProduct.ImageUrl} alt={`Ảnh dự án ${recommendedProduct.Name}`} sizes="(min-width: 768px) 40vw, 100vw" className="object-contain p-4" />
                        </div>
                        <div className="p-6">
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-lhu-blue">Dự án nên khám phá</p>
                          <h4 className="font-display mt-3 text-2xl font-bold text-foreground">{recommendedProduct.Name}</h4>
                          {recommendedProduct.AppUrl && <a href={recommendedProduct.AppUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold text-lhu-orange">Trải nghiệm ngay <ArrowRight size={17} aria-hidden="true" /></a>}
                        </div>
                      </div>
                    ) : (
                      <p className="m-auto max-w-sm text-center leading-7 text-muted">Dự án phù hợp với kết quả này đang được cập nhật.</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
      <div className="absolute -right-44 top-1/3 size-[34rem] rounded-full bg-lhu-orange/6 blur-[120px]" aria-hidden="true" />
    </section>
  );
}
