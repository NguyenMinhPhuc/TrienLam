"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Product } from './ProductCard';

interface QuizOption {
  Id: number;
  QuestionId: number;
  OptionText: string;
  ResultType: string;
}

interface QuizQuestion {
  Id: number;
  QuestionText: string;
  Options: QuizOption[];
}

interface QuizResult {
  ResultKey: string;
  Title: string;
  Description: string;
  IconName: string;
}

interface CareerQuizProps {
  products: Product[];
  quizData: {
    questions: QuizQuestion[];
    results: Record<string, QuizResult>;
  };
}

export default function CareerQuiz({ products, quizData }: CareerQuizProps) {
  const [step, setStep] = useState<'start' | 'question' | 'result'>('start');
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ AI: 0, Frontend: 0, Backend: 0 });
  const [winner, setWinner] = useState('AI');

  const { questions, results } = quizData;

  const handleAnswer = (type: string) => {
    setScores(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      calculateWinner();
      setStep('result');
    }
  };

  const calculateWinner = () => {
    let maxScore = -1;
    let winningType = 'AI';
    Object.entries(scores).forEach(([type, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winningType = type;
      }
    });
    setWinner(winningType);
  };

  const IconComponent = ({ name, size = 24, className }: { name: string, size?: number, className?: string }) => {
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon className={className} size={size} /> : <LucideIcons.HelpCircle className={className} size={size} />;
  };

  const recommendedProduct = products.find(p => p.CareerPath === winner);

  // If no questions, don't render or show error
  if (!questions || questions.length === 0) return null;

  return (
    <section id="quiz" className="py-32 bg-gradient-to-b from-transparent to-lhu-orange/5 transition-colors duration-500">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card-bg backdrop-blur-2xl border border-card-border rounded-[32px] p-12 text-center overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait" initial={false}>
            {step === 'start' && (
              <motion.div 
                key="start"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground">Bạn thuộc "Team" nào trong ngành IT?</h2>
                <p className="text-muted mb-12 text-lg">Làm {questions.length} câu trắc nghiệm nhanh để tìm lộ trình nghề nghiệp phù hợp nhất!</p>
                <button 
                  onClick={() => setStep('question')}
                  className="px-12 py-5 bg-lhu-blue text-white rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl shadow-lhu-blue/20"
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
                    animate={{ width: `${(currentQ / questions.length) * 100}%` }}
                    className="h-full bg-lhu-orange rounded-full"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-12 text-foreground">
                  Câu {currentQ + 1}: {questions[currentQ].QuestionText}
                </h3>
                <div className="grid gap-4 w-full">
                  {questions[currentQ].Options.map((opt) => (
                    <button 
                      key={opt.Id}
                      onClick={() => handleAnswer(opt.ResultType)}
                      className="w-full p-6 bg-background border border-card-border rounded-2xl text-left hover:bg-lhu-blue hover:text-white hover:translate-x-4 transition-all font-medium text-foreground shadow-sm"
                    >
                      {opt.OptionText}
                    </button>
                  ))}
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
                <h1 className="text-5xl md:text-6xl font-black gradient-text mb-8">
                   {results[winner] ? results[winner].Title : winner}
                </h1>
                <div className="w-24 h-24 bg-lhu-blue rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-lhu-blue/50 text-white">
                  {results[winner] ? (
                    <IconComponent name={results[winner].IconName} size={48} />
                  ) : (
                    <LucideIcons.Monitor size={48} />
                  )}
                </div>
                <p className="text-muted max-w-xl mb-12 text-lg">
                  {results[winner] ? results[winner].Description : "Đang cập nhật..."}
                </p>
                
                {recommendedProduct && (
                  <div className="w-full p-8 border border-card-border bg-background rounded-3xl text-left shadow-inner">
                    <p className="text-xs font-bold text-lhu-blue uppercase tracking-widest mb-4">Dự án sinh viên dành cho bạn:</p>
                    <div className="flex gap-6 items-center">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/10 flex-shrink-0">
                         <img src={recommendedProduct.ImageUrl} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold mb-2 text-foreground">{recommendedProduct.Name}</h4>
                        <a href={recommendedProduct.AppUrl} target="_blank" className="text-lhu-orange font-bold text-sm hover:underline">Trải nghiệm ngay &rarr;</a>
                      </div>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => { setStep('start'); setCurrentQ(0); setScores({ AI: 0, Frontend: 0, Backend: 0 }); }}
                  className="mt-12 text-muted hover:text-foreground transition-colors font-medium border-b border-transparent hover:border-current"
                >
                   Làm lại trắc nghiệm
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
