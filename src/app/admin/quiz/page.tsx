"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  MessageSquare, 
  Languages, 
  ShoppingCart,
  CheckCircle2,
  ListFilter,
  Trophy
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface QuizOption {
  Id: number;
  QuestionId: number;
  OptionText: string;
  ResultType: string;
  OrderIndex: number;
}

interface QuizQuestion {
  Id: number;
  QuestionText: string;
  OrderIndex: number;
}

interface QuizResult {
  Id: number;
  ResultKey: string;
  Title: string;
  Description: string;
  IconName: string;
}

const ICON_OPTIONS = [
  'Code', 'Cpu', 'Globe', 'Zap', 'Users', 'Star', 'Award', 'BookOpen', 
  'Briefcase', 'Shield', 'Activity', 'TrendingUp', 'Lightbulb', 
  'MessageSquare', 'Monitor', 'Smartphone', 'LayoutGrid', 'Terminal', 
  'Layers', 'Settings', 'Rocket', 'Heart', 'Flame', 'CheckCircle2'
];

export default function QuizManager() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [options, setOptions] = useState<QuizOption[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modals
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Editing States
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [editingOption, setEditingOption] = useState<QuizOption | null>(null);
  const [editingResult, setEditingResult] = useState<QuizResult | null>(null);

  // Form Datas
  const [qFormData, setQFormData] = useState<Partial<QuizQuestion>>({ QuestionText: '', OrderIndex: 0 });
  const [oFormData, setOFormData] = useState<Partial<QuizOption>>({ QuestionId: 0, OptionText: '', ResultType: 'AI', OrderIndex: 0 });
  const [rFormData, setRFormData] = useState<Partial<QuizResult>>({ ResultKey: '', Title: '', Description: '', IconName: 'MessageSquare' });

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/quiz');
    if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
        setOptions(data.options);
        setResults(data.results);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (type: 'question' | 'option' | 'result', data: any, isEdit: boolean) => {
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/quiz', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...data })
    });

    if (res.ok) {
      if (type === 'question') setIsQuestionModalOpen(false);
      if (type === 'option') setIsOptionModalOpen(false);
      if (type === 'result') setIsResultModalOpen(false);
      fetchData();
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa mục này?')) return;
    const res = await fetch(`/api/admin/quiz?type=${type}&id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const IconComponent = ({ name, size = 20, className }: any) => {
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon size={size} className={className} /> : <LucideIcons.HelpCircle size={size} className={className} />;
  };

  return (
    <div className="space-y-12 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-black text-white mb-2">Quản lý <span className="text-lhu-orange">Trắc nghiệm</span></h1>
           <p className="text-slate-400">Thiết lập bộ câu hỏi, các lựa chọn và kết quả của trắc nghiệm hướng nghiệp.</p>
        </div>
      </div>

      {/* Results Section */}
      <section className="space-y-6">
         <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-3"><Trophy className="text-lhu-orange" /> Kết quả trắc nghiệm</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-black">AI • Frontend • Backend</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.map((r) => (
               <div key={r.Id} className="bg-white/5 border border-white/10 p-8 rounded-[24px] hover:border-white/20 transition-all font-medium text-foreground">
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-14 h-14 bg-lhu-blue/10 rounded-2xl flex items-center justify-center text-lhu-blue">
                        <IconComponent name={r.IconName} size={28} />
                     </div>
                     <button onClick={() => { setEditingResult(r); setRFormData(r); setIsResultModalOpen(true); }} className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white"><Edit2 size={18} /></button>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{r.Title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{r.Description}</p>
               </div>
            ))}
         </div>
      </section>

      {/* Questions Section */}
      <section className="space-y-6">
         <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-3"><ListFilter className="text-lhu-blue" /> Bộ câu hỏi</h2>
            <button onClick={() => { setEditingQuestion(null); setQFormData({ QuestionText: '', OrderIndex: 0 }); setIsQuestionModalOpen(true); }} className="px-4 py-2 bg-lhu-blue text-white rounded-xl text-xs font-bold hover:scale-105 transition-all">
               + Thêm câu hỏi
            </button>
         </div>

         <div className="space-y-6">
            {questions.map((q, idx) => (
               <div key={q.Id} className="bg-white/5 border border-white/10 rounded-[24px] overflow-hidden">
                  <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                     <div className="flex items-center gap-4">
                        <span className="w-8 h-8 bg-lhu-orange/20 text-lhu-orange rounded-lg flex items-center justify-center text-xs font-bold">#{idx + 1}</span>
                        <h3 className="text-lg font-bold text-white">{q.QuestionText}</h3>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => { setEditingQuestion(q); setQFormData(q); setIsQuestionModalOpen(true); }} className="p-3 hover:bg-white/10 rounded-xl text-slate-500 hover:text-white"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete('question', q.Id)} className="p-3 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-500"><Trash2 size={18} /></button>
                     </div>
                  </div>
                  <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                     {options.filter(o => o.QuestionId === q.Id).map(opt => (
                        <div key={opt.Id} className="bg-background border border-white/10 p-4 rounded-2xl flex justify-between items-center group">
                           <div>
                              <p className="text-sm font-medium text-white mb-1">{opt.OptionText}</p>
                              <span className="px-2 py-0.5 bg-lhu-blue/10 text-lhu-blue text-[8px] font-black uppercase rounded border border-lhu-blue/20">{opt.ResultType}</span>
                           </div>
                           <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingOption(opt); setOFormData(opt); setIsOptionModalOpen(true); }} className="p-2 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white"><Edit2 size={14} /></button>
                              <button onClick={() => handleDelete('option', opt.Id)} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500"><Trash2 size={14} /></button>
                           </div>
                        </div>
                     ))}
                     <button onClick={() => { setEditingOption(null); setOFormData({ QuestionId: q.Id, OptionText: '', ResultType: 'AI', OrderIndex: 0 }); setIsOptionModalOpen(true); }} className="border border-dashed border-white/20 p-4 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-white hover:border-white/40 transition-all text-xs font-bold">
                        <Plus size={16} /> Thêm lựa chọn
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Modals are handled below for brevity... adding Question modal as example */}
      {/* Question Modal */}
      <AnimatePresence>
        {isQuestionModalOpen && (
          <ModalWrapper title={editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi'} onClose={() => setIsQuestionModalOpen(false)}>
             <form onSubmit={(e) => { e.preventDefault(); handleSubmit('question', qFormData, !!editingQuestion); }} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nội dung câu hỏi</label>
                   <textarea required rows={3} value={qFormData.QuestionText} onChange={e => setQFormData({...qFormData, QuestionText: e.target.value})} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Thứ tự hiển thị</label>
                   <input type="number" required value={qFormData.OrderIndex} onChange={e => setQFormData({...qFormData, OrderIndex: parseInt(e.target.value)})} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all" />
                </div>
                <button type="submit" className="w-full py-5 bg-lhu-blue text-white rounded-2xl font-bold">Xác nhận</button>
             </form>
          </ModalWrapper>
        )}

        {isOptionModalOpen && (
          <ModalWrapper title={editingOption ? 'Sửa lựa chọn' : 'Thêm lựa chọn'} onClose={() => setIsOptionModalOpen(false)}>
             <form onSubmit={(e) => { e.preventDefault(); handleSubmit('option', oFormData, !!editingOption); }} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nội dung lựa chọn</label>
                   <input required type="text" value={oFormData.OptionText} onChange={e => setOFormData({...oFormData, OptionText: e.target.value})} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Loại nghề nghiệp</label>
                    <select value={oFormData.ResultType} onChange={e => setOFormData({...oFormData, ResultType: e.target.value})} className="w-full p-4 bg-slate-800 border border-white/10 rounded-2xl text-white">
                        <option value="AI">AI Specialist</option>
                        <option value="Frontend">Frontend Developer</option>
                        <option value="Backend">Backend/Data Scientist</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Thứ tự</label>
                    <input type="number" required value={oFormData.OrderIndex} onChange={e => setOFormData({...oFormData, OrderIndex: parseInt(e.target.value)})} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white" />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-lhu-orange text-white rounded-2xl font-bold">Lưu lựa chọn</button>
             </form>
          </ModalWrapper>
        )}

        {isResultModalOpen && (
          <ModalWrapper title="Sửa kết quả trắc nghiệm" onClose={() => setIsResultModalOpen(false)}>
             <form onSubmit={(e) => { e.preventDefault(); handleSubmit('result', rFormData, true); }} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tên nghề nghiệp</label>
                   <input required type="text" value={rFormData.Title} onChange={e => setRFormData({...rFormData, Title: e.target.value})} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mô tả ngắn</label>
                   <textarea rows={3} value={rFormData.Description} onChange={e => setRFormData({...rFormData, Description: e.target.value})} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white transition-all resize-none" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Icon (Chọn biểu tượng)</label>
                   <select 
                      value={rFormData.IconName} onChange={e => setRFormData({...rFormData, IconName: e.target.value})}
                      className="w-full p-4 bg-slate-800 border border-white/10 rounded-2xl text-white outline-none focus:border-lhu-blue transition-all"
                   >
                      <option value="">Chọn Icon</option>
                      {ICON_OPTIONS.map(opt => (
                         <option key={opt} value={opt}>{opt}</option>
                      ))}
                   </select>
                </div>
                <button type="submit" className="w-full py-5 bg-lhu-blue text-white rounded-2xl font-bold tracking-widest">CẬP NHẬT KẾT QUẢ</button>
             </form>
          </ModalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalWrapper({ children, title, onClose }: any) {
    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[20002]" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl z-[2003] p-10 overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-2xl font-black text-white">{title}</h2>
                   <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-500"><X size={24} /></button>
                </div>
                {children}
            </motion.div>
        </>
    );
}
