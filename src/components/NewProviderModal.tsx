import React, { useState } from 'react';
import { Provider, Language } from '../types';
import { t } from '../translations';
import { X, CheckCircle, ShieldCheck, UserPlus } from 'lucide-react';

interface NewProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onRegisterProvider: (provider: Provider) => void;
}

export const NewProviderModal: React.FC<NewProviderModalProps> = ({
  isOpen,
  onClose,
  language,
  onRegisterProvider
}) => {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('plumber');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [basePrice, setBasePrice] = useState('80');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert(language === 'ar' ? 'يجب الموافقة على شروط الاستخدام أولاً' : 'Veuillez accepter les conditions');
      return;
    }

    const newProvider: Provider = {
      id: 'prov-' + Date.now(),
      businessName: businessName.trim(),
      category,
      phone: phone.trim(),
      address: address.trim(),
      quartier: address.trim(),
      basePrice: parseFloat(basePrice) || 50,
      status: 'pending', // Starts as pending for Admin review!
      isOnline: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      portfolio: [],
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    onRegisterProvider(newProvider);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-300" />
            <h2 className="text-base font-bold">
              {t('newJoinRequest', language)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'ar' ? 'تم إرسال طلب انضمامك بنجاح!' : 'Demande d\'inscription envoyée avec succès !'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {language === 'ar' 
                ? 'سيقوم فريق الإدارة بمراجعة حسابك وتفعيله قريباً. شكراً لانضمامك إلى شبكة خدمات الدروة.' 
                : 'L\'administration examinera et activera votre profil sous peu. Merci de rejoindre le réseau.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            <p className="text-xs text-slate-500">
              {t('registerTitle', language)}
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ar' ? 'الاسم المهني أو اسم الورشة / العيادة' : 'Nom professionnel ou enseigne de l\'atelier'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: يوسف النجارة العصرية، صباغة الإتقان...' : 'Ex: Menuiserie Moderne Youssef, Peinture Al Itkan...'}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ar' ? 'التصنيف أو المهنة' : 'Catégorie de métier'} <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none font-bold"
              >
                <option value="plumber">{language === 'ar' ? 'سباك (ترصيص صحي)' : 'Plombier (Sanitaire)'}</option>
                <option value="building_electrician">{language === 'ar' ? 'كهربائي مباني' : 'Électricien Bâtiment'}</option>
                <option value="painter">{language === 'ar' ? 'صباغ مباني وديكور' : 'Peintre en bâtiment'}</option>
                <option value="carpenter">{language === 'ar' ? 'نجار خشب وألمنيوم' : 'Menuisier (Bois & Aluminium)'}</option>
                <option value="mason">{language === 'ar' ? 'بناء وترميم' : 'Maçonnerie & Rénovation'}</option>
                <option value="tile_setter">{language === 'ar' ? 'زلايجي (تركيب السيراميك)' : 'Carreleur (Zellige & Marbre)'}</option>
                <option value="plasterer">{language === 'ar' ? 'جباص وديكور الجبس' : 'Plâtrier & Gypserie'}</option>
                <option value="welder">{language === 'ar' ? 'حداد وفيرونري' : 'Soudeur & Ferronnerie'}</option>
                <option value="mechanic">{language === 'ar' ? 'ميكانيكي سيارات' : 'Mécanicien Automobile'}</option>
                <option value="auto_electrician">{language === 'ar' ? 'كهربائي سيارات' : 'Électricien Automobile'}</option>
                <option value="cleaner">{language === 'ar' ? 'خدمات النظافة' : 'Services de Nettoyage'}</option>
                <option value="taxi_driver">{language === 'ar' ? 'سائق سيارة أجرة' : 'Chauffeur de Taxi'}</option>
                <option value="tech_repair">{language === 'ar' ? 'إصلاح الهواتف والحواسيب' : 'Réparation Téléphones & PC'}</option>
                <option value="used_cars">{language === 'ar' ? 'بيع السيارات المستعملة' : 'Vente Voitures d\'occasion'}</option>
                <option value="physiotherapist">{language === 'ar' ? 'مروض طبي وفيزيائي' : 'Kinésithérapeute'}</option>
                <option value="gardener">{language === 'ar' ? 'بستاني ومساحات خضراء' : 'Jardinier & Espaces Verts'}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ar' ? 'رقم الهاتف (للاتصال والواتساب)' : 'Téléphone (Appel & WhatsApp)'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06XXXXXXXX"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ar' ? 'السعر المبدئي بالدرهم (MAD)' : 'Tarif de départ (MAD)'}
                </label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ar' ? 'الحي أو العنوان في الدروة' : 'Quartier ou adresse à Deroua'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: تجزئة العمران، حي الوفاء، حي النور...' : 'Ex: Lotissement Al Omrane, Al Wafaa, Hay Ennour...'}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs leading-relaxed text-slate-700">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-slate-300 shrink-0"
                />
                <span>{t('agreeTerms', language)}</span>
              </label>
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
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إرسال طلب الانضمام' : 'Envoyer la demande'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
