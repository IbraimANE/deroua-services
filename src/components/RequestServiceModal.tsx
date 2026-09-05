import React, { useState } from 'react';
import { Provider, Language } from '../types';
import { t } from '../translations';
import { 
  X, 
  MapPin, 
  Phone, 
  Send, 
  Navigation, 
  FileText, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  language: Language;
  onSubmitRequest: (details: {
    clientName: string;
    clientPhone: string;
    clientLocation: string;
    description: string;
  }) => void;
}

export const RequestServiceModal: React.FC<RequestServiceModalProps> = ({
  isOpen,
  onClose,
  provider,
  language,
  onSubmitRequest
}) => {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientLocation, setClientLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !provider) return null;

  const handleGetLocation = () => {
    setIsLocating(true);
    setErrorMsg('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(5);
          const lng = position.coords.longitude.toFixed(5);
          setClientLocation(`موقعي الجغرافي: (${lat}, ${lng}) - الدروة`);
          setIsLocating(false);
          setLocationSuccess(true);
        },
        (error) => {
          setIsLocating(false);
          // Fallback to convenient quartier in Deroua
          setClientLocation('حي النور، الدروة');
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
      setClientLocation('وسط الدروة');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPhone.trim() || !clientLocation.trim()) {
      setErrorMsg(language === 'ar' ? 'يرجى إدخال رقم الهاتف والعنوان أولاً' : 'Veuillez saisir votre numéro et adresse');
      return;
    }
    onSubmitRequest({
      clientName: clientName.trim() || (language === 'ar' ? 'عميل الدروة' : 'Client Deroua'),
      clientPhone: clientPhone.trim(),
      clientLocation: clientLocation.trim(),
      description: description.trim()
    });
    // Reset form
    setClientName('');
    setClientPhone('');
    setClientLocation('');
    setDescription('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white p-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {t('confirmRequest', language)}
            </h2>
            <p className="text-xs text-teal-100 mt-0.5">
              {provider.businessName} ({t(provider.category as any, language)})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {errorMsg && (
            <div className="p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200 font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Client Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ar' ? 'اسمك الكريم (اختياري)' : 'Votre Nom (Optionnel)'}
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: يوسف، فاطمة...' : 'Ex: Karim, Sara...'}
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Client Phone (Required) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('phoneContact', language)} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="06XXXXXXXX / 07XXXXXXXX"
                className="w-full text-sm px-3.5 pr-10 rtl:pr-10 rtl:pl-3.5 ltr:pl-10 ltr:pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all dir-ltr text-right rtl:text-right"
              />
            </div>
          </div>

          {/* Client Location & GPS */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                {t('addressLocation', language)} <span className="text-red-500">*</span>
              </label>
              
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2 py-1 rounded-lg border border-teal-200 transition-colors"
                title={t('currentLocationTooltip', language)}
              >
                {isLocating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Navigation className="w-3.5 h-3.5 text-teal-600" />
                )}
                <span>{t('currentLocationTooltip', language)}</span>
              </button>
            </div>

            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
              <input
                type="text"
                required
                value={clientLocation}
                onChange={(e) => {
                  setClientLocation(e.target.value);
                  setLocationSuccess(false);
                }}
                placeholder={language === 'ar' ? 'مثال: تجزئة العمران، زنقة 5، عمارة 12...' : 'Ex: Lotissement Al Omrane, Deroua'}
                className="w-full text-sm px-3.5 pr-10 rtl:pr-10 rtl:pl-3.5 ltr:pl-10 ltr:pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all"
              />
            </div>

            {locationSuccess && (
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('locationDetected', language)}
              </p>
            )}
          </div>

          {/* Issue or details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {language === 'ar' ? 'تفاصيل الخدمة أو المشكل (اختياري)' : 'Détails du travail (Optionnel)'}
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language === 'ar' ? 'اشرح باختصار ما تحتاجه من الحرفي ليحضر المعدات المناسبة...' : 'Décrivez brièvement le problème...'}
                className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:bg-white outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Pricing indicator */}
          <div className="p-3 bg-slate-100/80 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <span>{t('basePrice', language)}:</span>
            <span className="font-extrabold text-teal-800 text-sm">
              ابتداءً من {provider.basePrice} {t('currency', language)}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-bold transition-colors"
            >
              {t('cancel', language)}
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{t('requestService', language)}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
