import React, { useState } from 'react';
import { ServiceRequest, Language } from '../types';
import { t } from '../translations';
import { Star, X, Check } from 'lucide-react';

interface RateProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ServiceRequest | null;
  language: Language;
  onSubmitRating: (requestId: string, rating: number, reviewText: string) => void;
}

export const RateProviderModal: React.FC<RateProviderModalProps> = ({
  isOpen,
  onClose,
  request,
  language,
  onSubmitRating
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  if (!isOpen || !request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRating(request.id, rating, reviewText.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-white text-white" />
            <h2 className="text-base font-bold">
              {t('rateProvider', language)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">
              {request.providerName}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {t(request.category as any, language)}
            </p>

            {/* Interactive Stars */}
            <div className="flex items-center justify-center gap-1.5 my-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-115 focus:outline-none"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {rating === 5 ? 'ممتاز جدًا ⭐⭐⭐⭐⭐' : rating === 4 ? 'جيد جدًا ⭐⭐⭐⭐' : rating === 3 ? 'متوسط ⭐⭐⭐' : 'يحتاج تحسين ⭐'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ar' ? 'تعليقك حول جودة الخدمة والمعاملة' : 'Votre avis (Optionnel)'}
            </label>
            <textarea
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={language === 'ar' ? 'اكتب رأيك لمساعدة باقي سكان الدروة في اختيار الحرفي المناسب...' : 'Partagez votre expérience...'}
              className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all resize-none"
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
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>إرسال التقييم</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
