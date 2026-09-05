import React, { useState, useMemo } from 'react';
import { Provider, ServiceRequest, Language, DirectoryCategory } from '../types';
import { t } from '../translations';
import { getCategoryIcon } from '../utils/categoryIcons';
import { 
  Search, 
  Star, 
  MapPin, 
  Coins, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  SlidersHorizontal, 
  BookOpen, 
  Sparkles, 
  Calendar, 
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Store,
  Plus
} from 'lucide-react';

interface ClientHomeProps {
  providers: Provider[];
  serviceRequests: ServiceRequest[];
  language: Language;
  onSelectProvider: (provider: Provider) => void;
  onRequestService: (provider: Provider) => void;
  onOpenDirectory: () => void;
  onOpenNewJoinModal: () => void;
  onRateRequest: (request: ServiceRequest) => void;
  activeSubView: 'browse' | 'myRequests';
  setActiveSubView: (view: 'browse' | 'myRequests') => void;
}

export const ClientHome: React.FC<ClientHomeProps> = ({
  providers,
  serviceRequests,
  language,
  onSelectProvider,
  onRequestService,
  onOpenDirectory,
  onOpenNewJoinModal,
  onRateRequest,
  activeSubView,
  setActiveSubView
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rated' | 'price' | 'online' | 'newest'>('rated');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // Available categories list
  const categories = [
    'all',
    'plumber',
    'building_electrician',
    'painter',
    'carpenter',
    'mechanic',
    'cleaner',
    'taxi_driver',
    'tech_repair',
    'used_cars',
    'physiotherapist',
    'mason',
    'tile_setter',
    'welder'
  ];

  // Banners data
  const banners = [
    {
      title: t('banner1_title', language),
      subtitle: t('banner1_subtitle', language),
      bgGradient: 'from-blue-900 via-indigo-900 to-slate-900',
      accentColor: 'text-indigo-300',
      btnText: language === 'ar' ? 'اكتشف الدليل الآن' : 'Découvrir le guide',
      btnAction: onOpenDirectory,
      icon: '📖'
    },
    {
      title: t('banner2_title', language),
      subtitle: t('banner2_subtitle', language),
      bgGradient: 'from-teal-800 via-emerald-800 to-slate-900',
      accentColor: 'text-teal-300',
      btnText: language === 'ar' ? 'تصفح كل المهن' : 'Tous les métiers',
      btnAction: () => setSelectedCategory('all'),
      icon: '🛠️'
    },
    {
      title: language === 'ar' ? 'هل أنت حرفي أو صاحب عيادة بالدروة؟' : 'Vous êtes artisan à Deroua ?',
      subtitle: language === 'ar' ? 'سجل حسابك مجاناً واستقبل طلبات الزبائن مباشرة على هاتفك' : 'Rejoignez gratuitement le réseau local',
      bgGradient: 'from-amber-800 via-amber-900 to-slate-900',
      accentColor: 'text-amber-300',
      btnText: language === 'ar' ? 'سجل كحرفي الآن' : 'Rejoindre',
      btnAction: onOpenNewJoinModal,
      icon: '⭐'
    }
  ];

  // Filter & Sort Logic
  const filteredProviders = useMemo(() => {
    return providers
      .filter((prov) => {
        // Status filter: only active or verified
        if (prov.status === 'rejected' || prov.status === 'pending') return false;

        // Category filter
        if (selectedCategory !== 'all' && prov.category !== selectedCategory) {
          return false;
        }

        // Online filter
        if (onlyOnline && !prov.isOnline) {
          return false;
        }

        // Text search
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          const nameMatch = prov.businessName.toLowerCase().includes(q);
          const catMatch = t(prov.category as any, language).toLowerCase().includes(q);
          const addressMatch = prov.address.toLowerCase().includes(q);
          const quartierMatch = prov.quartier?.toLowerCase().includes(q) || false;
          if (!nameMatch && !catMatch && !addressMatch && !quartierMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rated') return b.rating - a.rating;
        if (sortBy === 'price') return a.basePrice - b.basePrice;
        if (sortBy === 'online') {
          if (a.isOnline === b.isOnline) return b.rating - a.rating;
          return a.isOnline ? -1 : 1;
        }
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [providers, selectedCategory, searchQuery, sortBy, onlyOnline, language]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      
      {/* View Switcher: Browse vs My Requests */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubView('browse')}
            className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${
              activeSubView === 'browse'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('availableServices', language)} ({filteredProviders.length})
          </button>

          <button
            onClick={() => setActiveSubView('myRequests')}
            className={`px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-1.5 transition-all ${
              activeSubView === 'myRequests'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{t('myRequests', language)}</span>
            {serviceRequests.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                {serviceRequests.length}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={onOpenNewJoinModal}
          className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-xl border border-teal-200 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('newJoinRequest', language)}</span>
        </button>
      </div>

      {/* Main Browse View */}
      {activeSubView === 'browse' ? (
        <>
          {/* Hero Banner Carousel */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg border border-slate-200">
            <div 
              className={`bg-gradient-to-r ${banners[activeBannerIndex].bgGradient} text-white p-6 sm:p-8 min-h-[160px] sm:min-h-[190px] flex flex-col justify-between transition-all duration-300 relative`}
            >
              <div className="max-w-xl z-10">
                <span className="inline-block text-xs font-extrabold px-2.5 py-1 rounded-full bg-white/10 text-teal-200 border border-white/15 mb-2">
                  {language === 'ar' ? 'مدينة الدروة - إقليم برشيد' : 'Ville de Deroua'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {banners[activeBannerIndex].title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed">
                  {banners[activeBannerIndex].subtitle}
                </p>
                <div className="mt-4">
                  <button
                    onClick={banners[activeBannerIndex].btnAction}
                    className="px-4 py-2 rounded-xl bg-white text-slate-900 font-extrabold text-xs sm:text-sm shadow-md hover:bg-slate-100 transition-all hover:scale-102 flex items-center gap-1.5"
                  >
                    <span>{banners[activeBannerIndex].btnText}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </div>

              {/* Decorative Giant Emoji */}
              <div className="absolute top-1/2 -translate-y-1/2 right-6 rtl:right-auto rtl:left-6 text-7xl sm:text-8xl opacity-20 pointer-events-none select-none">
                {banners[activeBannerIndex].icon}
              </div>

              {/* Carousel Indicator Dots */}
              <div className="flex items-center gap-1.5 mt-3 z-10 self-center sm:self-start">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveBannerIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      activeBannerIndex === i ? 'w-6 bg-teal-400' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative shadow-sm rounded-2xl overflow-hidden border border-slate-300 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-500/30 transition-all bg-white">
              <Search className="w-5 h-5 text-teal-700 absolute right-4 top-1/2 -translate-y-1/2 rtl:right-4 rtl:left-auto ltr:left-4 ltr:right-auto pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder', language)}
                className="w-full text-sm sm:text-base py-3.5 pr-12 pl-4 rtl:pr-12 rtl:pl-4 ltr:pl-12 ltr:pr-4 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute left-3.5 rtl:left-3.5 rtl:right-auto ltr:right-3.5 ltr:left-auto top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('allCategories', language)}
              </h3>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs font-bold text-teal-700 hover:underline"
                >
                  {language === 'ar' ? 'عرض الكل' : 'Tous'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
              {categories.map((catKey) => {
                const isSelected = selectedCategory === catKey;
                const label = catKey === 'all' 
                  ? t('allCategories', language) 
                  : t(catKey as any, language);

                return (
                  <button
                    key={catKey}
                    onClick={() => setSelectedCategory(catKey)}
                    className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-sm scale-102 ring-2 ring-teal-700/20'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {catKey !== 'all' && (
                      <span className={isSelected ? 'text-teal-200' : 'text-teal-600'}>
                        {getCategoryIcon(catKey, 'w-4 h-4')}
                      </span>
                    )}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sorting & Filter Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-500 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {t('sortBy', language)}
              </span>

              <button
                onClick={() => setSortBy('rated')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  sortBy === 'rated' 
                    ? 'bg-teal-100 text-teal-800' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t('sortHighestRated', language)}
              </button>

              <button
                onClick={() => setSortBy('price')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  sortBy === 'price' 
                    ? 'bg-teal-100 text-teal-800' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t('sortLowestPrice', language)}
              </button>

              <button
                onClick={() => setSortBy('online')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  sortBy === 'online' 
                    ? 'bg-teal-100 text-teal-800' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t('sortOnlineFirst', language)}
              </button>
            </div>

            {/* Quick Online Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyOnline}
                onChange={(e) => setOnlyOnline(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
              />
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {language === 'ar' ? 'المتاحون للعمل الآن فقط' : 'Disponibles uniquement'}
              </span>
            </label>
          </div>

          {/* Craftsmen Providers Grid */}
          {providers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto mb-4">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                {language === 'ar' ? 'التطبيق فارغ وجاهز لتسجيل الحرفيين' : 'Application prête pour les inscriptions'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto mb-6">
                {language === 'ar' 
                  ? 'تم إفراغ البيانات التجريبية بنجاح. يمكن للحرفيين والمهنيين في الدروة التسجيل الآن مجاناً لتظهر خدماتهم وأرقامهم للزبائن.' 
                  : 'Les données démo ont été vidées. Les artisans et professionnels de Deroua peuvent désormais s’inscrire pour proposer leurs services.'}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onOpenNewJoinModal}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {language === 'ar' ? 'تسجيل حرفي / مهني جديد' : 'Inscrire un artisan / professionnel'}
                </button>
                <button
                  onClick={onOpenDirectory}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-teal-700" />
                  {language === 'ar' ? 'تصفح دليل الطوارئ والعيادات' : 'Consulter l’annuaire'}
                </button>
              </div>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
              <AlertCircle className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <h3 className="text-base font-bold text-slate-800">
                {t('noProviders', language)}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {language === 'ar' 
                  ? 'جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً من القائمة العلوية' 
                  : 'Essayez un autre mot-clé ou catégorie.'}
              </p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setOnlyOnline(false); }}
                className="mt-4 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
              >
                {language === 'ar' ? 'إعادة ضبط التصفية' : 'Réinitialiser'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredProviders.map((provider) => {
                const cleanPhone = provider.phone.replace(/\s+/g, '');
                const waNumber = cleanPhone.startsWith('0') ? `212${cleanPhone.substring(1)}` : cleanPhone;
                const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                  language === 'ar' 
                    ? `السلام عليكم، تواصلت معك عبر تطبيق خدمات الدروة بخصوص خدمة ${t(provider.category as any, language)}.` 
                    : `Bonjour, je vous contacte via l'application Deroua Services.`
                )}`;

                return (
                  <div
                    key={provider.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-teal-300"
                  >
                    {/* Top Content */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start gap-3.5">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <img
                            src={provider.avatar}
                            alt={provider.businessName}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs group-hover:scale-102 transition-transform"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                              provider.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                            title={provider.isOnline ? t('statusOnline', language) : t('statusOffline', language)}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${provider.isOnline ? 'bg-white animate-pulse' : 'bg-slate-200'}`} />
                          </span>
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 
                              onClick={() => onSelectProvider(provider)}
                              className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug truncate hover:text-teal-700 cursor-pointer"
                            >
                              {provider.businessName}
                            </h4>
                            {provider.status === 'verified' && (
                              <span title={t('verifiedBadge', language)}>
                                <CheckCircle2 className="w-4 h-4 fill-sky-500 text-white shrink-0" />
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-xs text-teal-700 font-semibold mt-1">
                            {getCategoryIcon(provider.category, 'w-3.5 h-3.5')}
                            <span>{t(provider.category as any, language)}</span>
                          </div>

                          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                            <span className="flex items-center gap-0.5 text-amber-500 font-extrabold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {provider.rating.toFixed(1)}
                            </span>
                            <span>•</span>
                            <span className="text-slate-400">({provider.reviewCount} تقييم)</span>
                          </div>
                        </div>
                      </div>

                      {/* Location & Pricing Badges */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-slate-500 truncate max-w-[60%]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{provider.quartier || provider.address}</span>
                        </span>

                        <span className="font-extrabold text-slate-900 bg-teal-50 text-teal-800 px-2 py-0.5 rounded-md border border-teal-100 shrink-0">
                          {provider.basePrice} {t('currency', language)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="bg-slate-50 p-3 border-t border-slate-100 flex items-center gap-1.5">
                      {/* Call Phone */}
                      <a
                        href={`tel:${provider.phone}`}
                        className="p-2 rounded-xl bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors shadow-2xs"
                        title={t('callNow', language)}
                      >
                        <Phone className="w-4 h-4 text-emerald-600" />
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 hover:border-emerald-200 transition-colors shadow-2xs"
                        title={t('whatsappChat', language)}
                      >
                        <MessageCircle className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                      </a>

                      {/* View details / Request */}
                      <button
                        onClick={() => onSelectProvider(provider)}
                        className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold shadow-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <span>{language === 'ar' ? 'عرض الملف والطلب' : 'Détails & Réserver'}</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* My Requests List View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">
              {t('myRequests', language)} ({serviceRequests.length})
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'ar' ? 'سجل الطلبات وتتبع حالتها وتقييم الحرفيين' : 'Historique de vos commandes'}
            </p>
          </div>

          {serviceRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
              <Clock className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <h4 className="text-sm font-bold text-slate-700">{t('noRequests', language)}</h4>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'ar' ? 'عندما تطلب أي خدمة، ستظهر تفاصيلها وحالتها هنا مباشرة' : 'Vos demandes s\'afficheront ici.'}
              </p>
              <button
                onClick={() => setActiveSubView('browse')}
                className="mt-4 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
              >
                {language === 'ar' ? 'تصفح الحرفيين والطلب الآن' : 'Parcourir les artisans'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {serviceRequests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {req.providerName}
                      </span>
                      <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md font-bold">
                        {t(req.category as any, language)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      <strong>الموقع:</strong> {req.clientLocation} • <span className="dir-ltr">{req.clientPhone}</span>
                    </p>

                    {req.description && (
                      <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {req.description}
                      </p>
                    )}

                    <span className="text-[11px] text-slate-400 inline-block">
                      تاريخ الطلب: {req.createdAt}
                    </span>
                  </div>

                  {/* Status & Action */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        req.status === 'Pending' 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : req.status === 'accepted'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : req.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}
                    >
                      {req.status === 'Pending' && '⏳ ' + t('statusPending', language)}
                      {req.status === 'accepted' && '✅ ' + t('statusAccepted', language)}
                      {req.status === 'completed' && '🎉 ' + t('statusCompleted', language)}
                      {req.status === 'rejected' && '❌ ' + t('statusRejected', language)}
                    </span>

                    {/* Rate provider button if completed and not rated yet */}
                    {req.status === 'completed' && !req.rating && (
                      <button
                        onClick={() => onRateRequest(req)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs flex items-center gap-1 transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>{t('rateProvider', language)}</span>
                      </button>
                    )}

                    {req.rating && (
                      <div className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>تقييمك: {req.rating} / 5</span>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
