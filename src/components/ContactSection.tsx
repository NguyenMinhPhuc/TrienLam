"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Share2, Globe, Info } from 'lucide-react';

interface ContactSectionProps {
  address?: string;
  phone?: string;
  email?: string;
}

export default function ContactSection({ address, phone, email }: ContactSectionProps) {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FullName: formData.fullName,
          Email: formData.email,
          Phone: formData.phone,
          Message: formData.message
        })
      });

      if (res.ok) {
        setIsSent(true);
        setFormData({ fullName: '', email: '', phone: '', message: '' });
        setTimeout(() => setIsSent(false), 5000);
      } else {
        const data = await res.json();
        setError(data.error || 'Đã có lỗi xảy ra.');
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại sau.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-background transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Info Side */}
          <div className="w-full lg:w-2/5">
            <h2 className="text-5xl font-black mb-8 leading-tight text-foreground">
              Sẵn Sàng <span className="text-lhu-orange">Kết Nối?</span>
            </h2>
            <p className="text-muted text-lg mb-12">
               Gia nhập cộng đồng công nghệ lớn nhất tại Đồng Nai. Khám phá cơ hội học tập và nghiên cứu thực tế.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-card-bg border border-card-border flex items-center justify-center text-lhu-blue">
                  <MapPin size={24} />
                </div>
                <div>
                   <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Địa chỉ</p>
                   <p className="text-foreground font-medium">{address || "Đang cập nhật..."}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-card-bg border border-card-border flex items-center justify-center text-lhu-blue">
                   <Phone size={24} />
                </div>
                <div>
                   <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Hotline</p>
                   <p className="text-foreground font-medium">{phone || "Đang cập nhật..."}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-card-bg border border-card-border flex items-center justify-center text-lhu-blue">
                   <Mail size={24} />
                </div>
                <div>
                   <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Email</p>
                   <p className="text-foreground font-medium">{email || "Đang cập nhật..."}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-16">
              <a href="#" className="w-12 h-12 rounded-full border border-card-border flex items-center justify-center hover:bg-lhu-blue/10 dark:hover:bg-lhu-blue/20 transition-all text-foreground"><Share2 size={20} /></a>
              <a href="#" className="w-12 h-12 rounded-full border border-card-border flex items-center justify-center hover:bg-lhu-orange/10 dark:hover:bg-lhu-orange/20 transition-all text-foreground"><Globe size={20} /></a>
              <a href="#" className="w-12 h-12 rounded-full border border-card-border flex items-center justify-center hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all text-foreground"><Info size={20} /></a>
            </div>
          </div>

          {/* Form Side */}
          <div className="w-full lg:w-3/5">
            <div className="bg-card-bg backdrop-blur-2xl border border-card-border rounded-[32px] p-10 md:p-14 shadow-2xl">
               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-sm font-bold text-muted ml-2 uppercase">Họ và tên</label>
                        <input 
                           type="text" 
                           required
                           value={formData.fullName}
                           onChange={e => setFormData({...formData, fullName: e.target.value})}
                           className="w-full p-5 bg-background border border-card-border rounded-2xl focus:border-lhu-blue outline-none transition-all text-foreground" 
                           placeholder="Nguyễn Văn A" 
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-sm font-bold text-muted ml-2 uppercase">Email liên hệ</label>
                        <input 
                           type="email" 
                           required
                           value={formData.email}
                           onChange={e => setFormData({...formData, email: e.target.value})}
                           className="w-full p-5 bg-background border border-card-border rounded-2xl focus:border-lhu-blue outline-none transition-all text-foreground" 
                           placeholder="example@gmail.com" 
                        />
                     </div>
                  </div>

                  <div className="space-y-3">
                      <label className="text-sm font-bold text-muted ml-2 uppercase">Số điện thoại</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full p-5 bg-background border border-card-border rounded-2xl focus:border-lhu-blue outline-none transition-all text-foreground" 
                        placeholder="09xx xxx xxx" 
                      />
                  </div>
                  
                  <div className="space-y-3">
                      <label className="text-sm font-bold text-muted ml-2 uppercase">Bạn quan tâm điều gì?</label>
                      <textarea 
                        rows={4}
                        required
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        className="w-full p-5 bg-background border border-card-border rounded-2xl focus:border-lhu-blue outline-none transition-all resize-none text-foreground" 
                        placeholder="Hãy để lại lời nhắn cho chúng tôi..."
                      />
                  </div>

                  {error && <p className="text-red-500 text-sm font-bold ml-2">{error}</p>}

                  <button 
                    disabled={isSending || isSent}
                    className={`w-full py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-4 transition-all ${isSent ? 'bg-green-600 shadow-lg shadow-green-600/30 text-white' : isSending ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-lhu-blue text-white hover:scale-[1.01] hover:shadow-2xl shadow-lhu-blue/30'}`}
                  >
                    {isSent ? 'Đã gửi thành công!' : isSending ? 'Đang gửi...' : <><Send size={24} /> Gửi tin nhắn</>}
                  </button>
               </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Blob */}
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-lhu-orange/5 rounded-full blur-[150px] -z-10" />
    </section>
  );
}
