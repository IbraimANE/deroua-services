import React, { useState } from 'react';
import { Language } from '../types';
import { t } from '../translations';
import { X, Mail, Send, CheckCircle2 } from 'lucide-react';
import { pb } from '../lib/pb';

interface ComplaintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ComplaintsModal: React.FC<ComplaintsModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await pb.collection('complaints').create({
        subject,
        details,
        senderContact
      });
    } catch (err) {
      // Fallback to mailto if PocketBase is not connected
      const email = 'derouaservices@gmail.com';
      const emailSubject = encodeURIComponent(`شكاية / اقتراح من تطبيق Deroua Services: ${subject}`);
      const emailBody = encodeURIComponent(
        `من: ${senderContact}\n\nالموضوع: ${subject}\n\nالتفاصيل:\n${details}\n\n--\nمرسل عبر منصة خدمات الدروة الويب`
      );
      window.open(`mailto:${email}?subject=${emailSubject}&body=${emailBody}`, '_blank');
    }
    
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-slate-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-teal-300" />
            <h2 className="text-base font-bold">
              {t('sendComplaint', language)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'ar' ? 'تم فتح تطبيق البريد الإلكتروني بنجاح' : 'Email ouvert avec succès'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar' ? 'شكراً لمساهمتك في تحسين خدمات الدروة' : 'Merci pour votre contribution !'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            <p className="text-xs text-slate-500">
              {language === 'ar' 
                ? 'نرحب بجميع اقتراحاتكم وشكاياتكم لتحسين المنصة أو الإبلاغ عن مشكل مع حرفي. يتم إرسال الرسالة إلى إدارة الموقع: derouaservices@gmail.com'
                : 'Faites-nous part de vos réclamations ou suggestions directement par e-mail.'}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ar' ? 'رقم هاتفك أو بريدك للتواصل' : 'Votre contact'}
              </label>
              <input
                type="text"
                required
                value={senderContact}
                onChange={(e) => setSenderContact(e.target.value)}
                placeholder="06XXXXXXXX / email@..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ar' ? 'موضوع الشكاية أو الاقتراح' : 'Objet'}
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: اقتراح إضافة مهنة جديدة، بلاغ...' : 'Ex: Suggestion de métier...'}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ar' ? 'نص الرسالة بالتفصيل' : 'Message'}
              </label>
              <textarea
                rows={4}
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب رسالتك بكل وضوح...' : 'Écrivez votre message...'}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                {t('cancel', language)}
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إرسال الشكاية' : 'Envoyer'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
