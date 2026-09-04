"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Monitor, RotateCcw } from 'lucide-react';
import { Product } from './ProductCard';
import CmsImage from './CmsImage';
import DynamicIcon from './DynamicIcon';
import type { QuizData } from '@/lib/types';

interface CareerQuizProps {
  products: Product[];
  quizData: QuizData;
}

const RESULT_CAREER_PATHS: Record<string, string[]> = {
  AI: ['Trí tuệ nhân tạo'],
  Frontend: ['Sản phẩm phần mềm'],
  Backend: ['Sản phẩm phần mềm', 'Mạng máy tính'],
};

export default function CareerQuiz({ products, quizData }: CareerQuizProps) {
  const [step, setStep] = useState<'start' | 'question' | 'result'>('start');
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [winner, setWinner] = useState<string | null>(null);
  const [industryWinner, setIndustryWinner] = useState<string | null>(null);

  const { questions, results } = quizData;
  const industries = quizData.industries;

  const handleAnswer = (type: string) => {
    // update scores synchronously using new object
    const newScores = { ...scores };
    newScores[type] = (newScores[type] || 0) + 1;
    setScores(newScores);

    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      calculateWinner(newScores);
      setStep('result');
    }
  };

  const calculateWinner = (finalScores: Record<string, number>) => {
    // find top ResultKey
    let maxScore = -1;
    let winningType: string | null = null;
    Object.entries(finalScores).forEach(([type, score]) => {
      if (score > maxScore || winningType === null) {
        maxScore = score;
        winningType = type;
      }
    });
    setWinner(winningType);

    // aggregate by industry
    const industryScores: Record<string, number> = {};
    Object.entries(finalScores).forEach(([resultKey, score]) => {
      const res = results[resultKey];
      const industryKey = res?.IndustryKey || resultKey;
      industryScores[industryKey] = (industryScores[industryKey] || 0) + (score || 0);
    });

    let maxInd = -1;
    let winInd: string | null = null;
    Object.entries(industryScores).forEach(([ind, sc]) => {
      if (sc > maxInd || winInd === null) {
        maxInd = sc;
        winInd = ind;
      }
    });
    setIndustryWinner(winInd);
  };

  const winnerResult = winner ? results[winner] : undefined;
  const industry = industries.find((item) => item.IndustryKey === industryWinner);
  const matchingPaths = winner ? RESULT_CAREER_PATHS[winner] || [winner] : [];
  const recommendedProduct = products.find((product) => matchingPaths.includes(product.CareerPath));

  const resetQuiz = () => {
    setStep('start');
    setCurrentQ(0);
    setScores({});
    setWinner(null);
    setIndustryWinner(null);
  };

  return (
    <section id="quiz" className="scroll-mt-24 py-32 bg-gradient-to-b from-transparent to-lhu-orange/5 transition-colors duration-500">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card-bg backdrop-blur-2xl border border-card-border rounded-[32px] p-6 md:p-12 text-center overflow-hidden shadow-2xl">
          {questions.length === 0 ? (
            <div role="status" className="py-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-lhu-orange/10 text-lhu-orange flex items-center justify-center mb-6">
                <AlertCircle aria-hidden="true" size={30} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">
                Trắc nghiệm đang được cập nhật
              </h2>
              <p className="text-muted max-w-xl text-lg">
                {quizData.error || 'Nội dung câu hỏi chưa sẵn sàng. Vui lòng quay lại sau.'}
              </p>
            </div>
          ) : (
          <AnimatePresence mode="wait" initial={false}>
            {step === 'start' && (
              <motion.div 
                key="start"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground">Bạn thuộc &ldquo;Team&rdquo; nào trong ngành IT?</h2>
                <p className="text-muted mb-12 text-lg">Làm {questions.length} câu trắc nghiệm nhanh để tìm lộ trình nghề nghiệp phù hợp nhất!</p>
                <button 
                  onClick={() => setStep('question')}
                  className="px-12 py-5 bg-lhu-blue text-white rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl shadow-lhu-blue/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lhu-orange/50"
                >
                  Bắt đầu ngay
                </button>
              </motion.div>
            )}

            {step === 'question' && (
              <motion.div 
                key={`q-${currentQ}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="w-full"
              >
                <div className="w-full h-2 bg-black/5 dark:bg-white/5 rounded-full mb-12">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                    className="h-full bg-lhu-orange rounded-full"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-12 text-foreground">
                  Câu {currentQ + 1}: {questions[currentQ].QuestionText}
                </h3>
                <div className="grid gap-4 w-full">
                  {questions[currentQ].Options.length > 0 ? questions[currentQ].Options.map((opt) => (
                    <button 
                      key={opt.Id}
                      onClick={() => handleAnswer(opt.ResultType)}
                      className="w-full p-6 bg-background border border-card-border rounded-2xl text-left hover:bg-lhu-blue hover:text-white hover:translate-x-2 transition-all font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lhu-orange/50"
                    >
                      {opt.OptionText}
                    </button>
                  )) : (
                    <div role="alert" className="rounded-2xl border border-lhu-orange/30 bg-lhu-orange/10 p-6 text-left">
                      <p className="font-bold text-foreground">Câu hỏi này chưa có phương án trả lời.</p>
                      <button type="button" onClick={resetQuiz} className="mt-4 text-lhu-orange font-bold hover:underline">
                        Quay lại màn hình bắt đầu
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'result' && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                <h2 className="text-3xl font-bold mb-4 text-muted">Chúc mừng! Bạn là:</h2>
                <h3 className="text-5xl md:text-6xl font-black text-lhu-blue mb-8">
                   {winnerResult?.Title || winner || 'Kết quả chưa rõ'}
                </h3>
                 {industryWinner && (
                  <p className="text-muted mb-4">Ngành phù hợp: <span className="font-bold">{industry?.Title || industryWinner}</span></p>
                 )}
                <div className="w-24 h-24 bg-lhu-blue rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-lhu-blue/50 text-white">
                  {winnerResult ? (
                    <DynamicIcon name={winnerResult.IconName} size={48} />
                  ) : (
                    <Monitor aria-hidden="true" size={48} />
                  )}
                </div>
                <p className="text-muted max-w-xl mb-12 text-lg">
                  {winnerResult?.Description || 'Đang cập nhật...'}
                </p>
                
                {recommendedProduct && (
                  <div className="w-full p-8 border border-card-border bg-background rounded-3xl text-left shadow-inner">
                    <p className="text-xs font-bold text-lhu-blue uppercase tracking-widest mb-4">Dự án sinh viên dành cho bạn:</p>
                    <div className="flex gap-6 items-center">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/10 flex-shrink-0">
                         <CmsImage src={recommendedProduct.ImageUrl} alt={`Ảnh dự án ${recommendedProduct.Name}`} sizes="96px" className="object-contain p-2" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold mb-2 text-foreground">{recommendedProduct.Name}</h4>
                         <a href={recommendedProduct.AppUrl} target="_blank" rel="noreferrer" className="text-lhu-orange font-bold text-sm hover:underline">Trải nghiệm ngay &rarr;</a>
                      </div>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={resetQuiz}
                  className="mt-12 text-muted hover:text-foreground transition-colors font-medium border-b border-transparent hover:border-current inline-flex items-center gap-2"
                >
                   <RotateCcw aria-hidden="true" size={18} /> Làm lại trắc nghiệm
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
