import React, { useState } from 'react';
import { Provider, Language } from '../types';
import { t } from '../translations';
import { getCategoryIcon } from '../utils/categoryIcons';
import { 
  X, 
  Phone, 
  MessageCircle, 
  Star, 
  MapPin, 
  Clock, 
  Coins, 
  CheckCircle2, 
  ShieldCheck, 
  Image as ImageIcon,
  Send,
  CreditCard
} from 'lucide-react';

interface ProviderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  language: Language;
  onRequestService: () => void;
}

export const ProviderDetailsModal: React.FC<ProviderDetailsModalProps> = ({
  isOpen,
  onClose,
  provider,
  language,
  onRequestService
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen || !provider) return null;

  // Format Morocco phone for WhatsApp (remove leading 0 and prepend +212)
  const cleanPhone = provider.phone.replace(/\s+/g, '');
  const waNumber = cleanPhone.startsWith('0') 
    ? `212${cleanPhone.substring(1)}` 
    : cleanPhone.replace('+', '');
  
  const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    language === 'ar' 
      ? `السلام عليكم، تواصلت معك عبر تطبيق خدمات الدروة بخصوص خدمة ${t(provider.category as any, language)}.` 
      : `Bonjour, je vous contacte via l'application Deroua Services concernant vos services.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header with Hero Cover */}
        <div className="relative bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 text-white p-6 pb-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-2">
            {/* Avatar & Online status badge */}
            <div className="relative shrink-0">
              <img
                src={provider.avatar}
                alt={provider.businessName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-white/80 shadow-md"
              />
              <span 
                className={`absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 px-2 py-0.5 rounded-full text-[10px] font-bold border border-white shadow-xs flex items-center gap-1 ${
                  provider.isOnline 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-400 text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${provider.isOnline ? 'bg-white animate-pulse' : 'bg-slate-200'}`} />
                {provider.isOnline ? t('statusOnline', language) : t('statusOffline', language)}
              </span>
            </div>

            {/* Provider titles & info */}
            <div className="text-center sm:text-start rtl:sm:text-right flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start rtl:sm:justify-start gap-1.5 mb-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {provider.businessName}
                </h2>
                {provider.status === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-400/30" title={t('verifiedBadge', language)}>
                    <CheckCircle2 className="w-3.5 h-3.5 fill-sky-500 text-slate-900" />
                    <span>{t('verifiedBadge', language)}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-300 mt-1">
                <span className="bg-white/10 px-2 py-0.5 rounded-md flex items-center gap-1 text-teal-200">
                  {getCategoryIcon(provider.category, 'w-3.5 h-3.5')}
                  {t(provider.category as any, language)}
                </span>

                <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {provider.rating.toFixed(1)} ({provider.reviewCount} {t('ratings', language)})
                </span>
              </div>

              <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1 mt-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{provider.address}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar (Direct WhatsApp & Phone Call & Request Service) */}
        <div className="bg-slate-100 p-3 sm:p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-1">
            {/* Direct Call */}
            <a
              href={`tel:${provider.phone}`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>{t('callNow', language)}</span>
            </a>

            {/* Direct WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{t('whatsappChat', language)}</span>
            </a>
          </div>

          {/* Book / Request Service */}
          <button
            onClick={() => {
              onClose();
              onRequestService();
            }}
            disabled={!provider.isOnline}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              provider.isOnline 
                ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-700/20 hover:scale-102' 
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{t('requestService', language)}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          
          {/* Quick Details Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-teal-600" />
                {t('basePrice', language)}
              </span>
              <p className="text-base font-extrabold text-slate-900 mt-1">
                {provider.basePrice} {t('currency', language)}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                {t('workHours', language)}
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">
                {provider.workHours || '08:30 - 20:00'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                {language === 'ar' ? 'حالة التوثيق' : 'Statut'}
              </span>
              <p className="text-xs font-bold text-emerald-700 mt-1">
                {provider.status === 'verified' ? 'معتمد ومسجل بالدروة' : 'حرفي نشط'}
              </p>
            </div>
          </div>

          {/* Bio / Description */}
          {provider.bio && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {language === 'ar' ? 'نبذة عن الحرفي والخدمات المقدمة' : 'Description & Services'}
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {provider.bio}
              </p>
            </div>
          )}

          {/* Portfolio Section */}
          {provider.portfolio && provider.portfolio.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-teal-600" />
                  <span>{t('portfolio', language)} ({provider.portfolio.length})</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">
                  {language === 'ar' ? 'انقر للتكبير' : 'Cliquer pour agrandir'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {provider.portfolio.map((imgUrl, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(imgUrl)}
                    className="relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer border border-slate-200 group bg-slate-100"
                  >
                    <img
                      src={imgUrl}
                      alt={`عمل ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-md transition-opacity">
                        🔍 عرض
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Carte Visite (Business Card) Section */}
          {provider.carteVisite && (
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 mb-2">
                <CreditCard className="w-4 h-4 text-teal-600" />
                <span>{t('carteVisite', language)}</span>
              </h3>
              <div 
                onClick={() => setSelectedImage(provider.carteVisite!)}
                className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer group bg-slate-100 max-w-md mx-auto aspect-16/10"
              >
                <img
                  src={provider.carteVisite}
                  alt="بطاقة العمل"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                />
                <div className="absolute bottom-2 right-2 rtl:right-auto rtl:left-2 bg-black/60 text-white text-[11px] px-2 py-1 rounded-md font-bold">
                  🔍 تكبير البطاقة
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {language === 'ar' ? 'رقم الهاتف:' : 'Téléphone :'} <strong className="text-slate-800 dir-ltr">{provider.phone}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
          >
            {t('close', language)}
          </button>
        </div>

      </div>

      {/* Image Zoom Lightbox */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[85vh]">
            <img
              src={selectedImage}
              alt="صورة مكبرة"
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 p-1.5 bg-white text-slate-900 rounded-full shadow-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
