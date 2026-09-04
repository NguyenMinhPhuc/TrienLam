"use client";

import { useState } from 'react';
import { CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactSectionProps {
  title: string;
  description: string;
  address?: string;
  phone?: string;
  email?: string;
}

const fieldClass = 'w-full border-0 border-b border-white/16 bg-transparent px-0 py-4 text-base text-white outline-none placeholder:text-[#6f8597] focus:border-lhu-blue focus:ring-0';

export default function ContactSection({ title, description, address, phone, email }: ContactSectionProps) {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSending(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FullName: formData.fullName,
          Email: formData.email,
          Phone: formData.phone,
          Message: formData.message,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Không thể gửi tin nhắn.');
      }

      setIsSent(true);
      setFormData({ fullName: '', email: '', phone: '', message: '' });
      window.setTimeout(() => setIsSent(false), 5000);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Lỗi kết nối. Vui lòng thử lại sau.');
    } finally {
      setIsSending(false);
    }
  };

  const contactItems = [
    { label: 'Địa chỉ', value: address || 'Đang cập nhật...', icon: MapPin },
    { label: 'Hotline', value: phone || 'Đang cập nhật...', icon: Phone },
    { label: 'Email', value: email || 'Đang cập nhật...', icon: Mail },
  ];

  return (
    <section id="contact" className="section-pad relative overflow-hidden bg-[#07111d] text-white">
      <div className="site-shell relative z-10">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="section-title text-white">{title}</h2>
            <p className="prose-copy mt-7 max-w-xl text-base leading-8 text-[#a8bac8]">{description}</p>

            <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
              {contactItems.map((item) => (
                <div key={item.label} className="grid grid-cols-[2.5rem_1fr] gap-4 py-6">
                  <item.icon className="mt-1 text-lhu-orange" size={21} aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7e95a7]">{item.label}</p>
                    <p className="mt-2 break-words font-medium text-[#e4edf3]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="border-t border-white/12 pt-8" aria-label="Gửi thông tin liên hệ">
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}>
                <label htmlFor="contact-full-name" className="text-xs font-bold uppercase tracking-[0.12em] text-[#91a6b7]">Họ và tên</label>
                <input id="contact-full-name" name="fullName" type="text" autoComplete="name" required value={formData.fullName} onChange={(event) => setFormData({ ...formData, fullName: event.target.value })} className={fieldClass} placeholder="Nguyễn Văn A" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-[0.12em] text-[#91a6b7]">Email liên hệ</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className={fieldClass} placeholder="example@gmail.com" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="sm:col-span-2">
                <label htmlFor="contact-phone" className="text-xs font-bold uppercase tracking-[0.12em] text-[#91a6b7]">Số điện thoại</label>
                <input id="contact-phone" name="phone" type="tel" autoComplete="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} className={fieldClass} placeholder="09xx xxx xxx" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="sm:col-span-2">
                <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-[0.12em] text-[#91a6b7]">Bạn quan tâm điều gì?</label>
                <textarea id="contact-message" name="message" rows={4} required value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} className={`${fieldClass} resize-y`} placeholder="Hãy để lại lời nhắn cho chúng tôi..." />
              </motion.div>
            </div>

            <div className="mt-8 min-h-7" aria-live="polite">
              {error && <p role="alert" className="text-sm font-semibold text-[#ff9b80]">{error} Vui lòng kiểm tra thông tin và thử lại.</p>}
              {isSent && <p role="status" className="flex items-center gap-2 text-sm font-semibold text-[#83d8ac]"><CheckCircle2 size={18} aria-hidden="true" /> Tin nhắn đã được gửi thành công.</p>}
            </div>

            <button type="submit" disabled={isSending || isSent} className="button-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto sm:min-w-56">
              {isSent ? <><CheckCircle2 size={19} aria-hidden="true" /> Đã gửi</> : isSending ? 'Đang gửi...' : <><Send size={19} aria-hidden="true" /> Gửi tin nhắn</>}
            </button>
          </form>
        </div>
      </div>
      <div className="absolute -left-40 bottom-0 size-[32rem] rounded-full bg-lhu-blue/8 blur-[110px]" aria-hidden="true" />
    </section>
  );
}
