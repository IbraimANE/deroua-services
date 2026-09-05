import React, { useState } from 'react';
import { Provider, ServiceRequest, Language } from '../types';
import { t } from '../translations';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Phone, 
  MessageCircle, 
  Star, 
  Upload, 
  Save, 
  MapPin, 
  Coins, 
  Check, 
  Camera, 
  Plus, 
  Trash2,
  Activity,
  Wrench
} from 'lucide-react';

interface ProviderDashboardProps {
  providers: Provider[];
  activeProviderId: string;
  onSelectActiveProvider: (id: string) => void;
  serviceRequests: ServiceRequest[];
  onUpdateRequestStatus: (requestId: string, newStatus: ServiceRequest['status']) => void;
  onUpdateProviderProfile: (updated: Provider) => void;
  onOpenNewJoinModal?: () => void;
  language: Language;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  providers,
  activeProviderId,
  onSelectActiveProvider,
  serviceRequests,
  onUpdateRequestStatus,
  onUpdateProviderProfile,
  onOpenNewJoinModal,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'profile' | 'portfolio'>('requests');
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  // Find active provider
  const currentProvider = providers.find(p => p.id === activeProviderId) || providers[0];

  // Profile Form States
  const [businessName, setBusinessName] = useState(currentProvider?.businessName || '');
  const [phone, setPhone] = useState(currentProvider?.phone || '');
  const [address, setAddress] = useState(currentProvider?.address || '');
  const [basePrice, setBasePrice] = useState(currentProvider?.basePrice?.toString() || '80');
  const [workHours, setWorkHours] = useState(currentProvider?.workHours || '');
  const [bio, setBio] = useState(currentProvider?.bio || '');
  const [newPortfolioUrl, setNewPortfolioUrl] = useState('');

  // If no providers exist yet
  if (providers.length === 0 || !currentProvider) {
    return (
      <div className="max-w-lg mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 mx-auto mb-4">
          <Wrench className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-slate-900 mb-2">
          {language === 'ar' ? 'لا يوجد أي حساب حرفي مسجل حالياً' : 'Aucun profil d\'artisan inscrit'}
        </h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-md mx-auto">
          {language === 'ar' 
            ? 'التطبيق حالياً فارغ ونظيف وجاهز لإضافة الحرفيين والمهنيين الحقيقيين في مدينة الدروة. انقر على الزر أدناه لتسجيل الحساب الأول!' 
            : 'L\'application est vierge et prête pour les vrais artisans de Deroua. Cliquez sur le bouton ci-dessous pour créer le premier profil.'}
        </p>
        {onOpenNewJoinModal && (
          <button
            onClick={onOpenNewJoinModal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            {language === 'ar' ? 'تسجيل حرفي / مهني جديد الآن' : 'Inscrire un artisan maintenant'}
          </button>
        )}
      </div>
    );
  }

  // When switching provider from dropdown, update local form
  const handleSwitchProvider = (newId: string) => {
    onSelectActiveProvider(newId);
    const p = providers.find(x => x.id === newId);
    if (p) {
      setBusinessName(p.businessName);
      setPhone(p.phone);
      setAddress(p.address);
      setBasePrice(p.basePrice.toString());
      setWorkHours(p.workHours || '');
      setBio(p.bio || '');
    }
  };

  // Requests for this provider
  const myRequests = serviceRequests.filter(r => r.providerId === currentProvider?.id);
  const totalCount = myRequests.length;
  const completedCount = myRequests.filter(r => r.status === 'completed').length;
  const pendingCount = myRequests.filter(r => r.status === 'Pending').length;

  const handleToggleOnline = () => {
    if (!currentProvider) return;
    const updated = { ...currentProvider, isOnline: !currentProvider.isOnline };
    onUpdateProviderProfile(updated);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProvider) return;
    const updated: Provider = {
      ...currentProvider,
      businessName: businessName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      basePrice: parseFloat(basePrice) || 0,
      workHours: workHours.trim(),
      bio: bio.trim()
    };
    onUpdateProviderProfile(updated);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 3000);
  };

  const handleAddPortfolioImage = () => {
    if (!newPortfolioUrl.trim() || !currentProvider) return;
    const updated: Provider = {
      ...currentProvider,
      portfolio: [newPortfolioUrl.trim(), ...currentProvider.portfolio]
    };
    onUpdateProviderProfile(updated);
    setNewPortfolioUrl('');
  };

  const handleRemovePortfolioImage = (indexToRemove: number) => {
    if (!currentProvider) return;
    const updated: Provider = {
      ...currentProvider,
      portfolio: currentProvider.portfolio.filter((_, idx) => idx !== indexToRemove)
    };
    onUpdateProviderProfile(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Provider Selector & Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3.5">
          <img
            src={currentProvider?.avatar}
            alt={currentProvider?.businessName}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {currentProvider?.businessName}
              </h2>
              {currentProvider?.status === 'verified' && (
                <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-bold">
                  🔵 موثوق
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              لوحة تحكم الحرفي • {t(currentProvider?.category as any, language)}
            </p>
          </div>
        </div>

        {/* Switch Account (for testing different craftsmen) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            {language === 'ar' ? 'تبديل حساب الحرفي:' : 'Artisan :'}
          </span>
          <select
            value={currentProvider?.id}
            onChange={(e) => handleSwitchProvider(e.target.value)}
            className="text-xs font-bold p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none"
          >
            {providers.map(p => (
              <option key={p.id} value={p.id}>
                {p.businessName} ({t(p.category as any, language)})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Availability Switch (Online / Offline) Card */}
      <div 
        className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between shadow-xs ${
          currentProvider?.isOnline 
            ? 'bg-emerald-50/70 border-emerald-300' 
            : 'bg-amber-50/70 border-amber-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
            currentProvider?.isOnline ? 'bg-emerald-600' : 'bg-amber-600'
          }`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base text-slate-900">
              {currentProvider?.isOnline 
                ? '🟢 أنت متاح للعمل واستقبال الطلبات (Online)' 
                : '🟡 أنت غير متاح للعمل حالياً (Offline)'}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentProvider?.isOnline 
                ? 'يظهر ملفك لجميع سكان الدروة ويمكنهم الاتصال بك وإرسال طلبات حجز.' 
                : 'حسابك مغلق مؤقتاً ولن تظهر في قائمة المتاحين للعمل.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleOnline}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-xs ${
            currentProvider?.isOnline
              ? 'bg-slate-800 hover:bg-slate-900 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {currentProvider?.isOnline 
            ? (language === 'ar' ? 'التحويل إلى غير متاح' : 'Passer Hors-ligne') 
            : (language === 'ar' ? 'تفعيل التوفر الآن' : 'Passer En Ligne')}
        </button>
      </div>

      {/* KPI Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold">إجمالي الطلبات</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCount}</p>
          <span className="text-[11px] text-teal-700 font-medium">كل الطلبات الواردة</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold">أنجزت بنجاح</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{completedCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">مهام مكتملة</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold">قيد الانتظار</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-amber-600 font-medium">تحتاج تأكيد منك</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-bold">تقييم الزبائن</span>
          <p className="text-2xl font-black text-amber-500 mt-1 flex items-center gap-1">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
            {currentProvider?.rating?.toFixed(1) || '5.0'}
          </p>
          <span className="text-[11px] text-slate-400 font-medium">{currentProvider?.reviewCount} تقييم مسجل</span>
        </div>
      </div>

      {/* Dashboard Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 gap-2 border shadow-xs">
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'requests' 
              ? 'bg-teal-700 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          الطلبات الواردة ({myRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'profile' 
              ? 'bg-teal-700 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          تعديل الملف والأسعار
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-extrabold transition-all ${
            activeTab === 'portfolio' 
              ? 'bg-teal-700 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          معرض الأعمال وبطاقة العمل
        </button>
      </div>

      {/* Saved Notification */}
      {showSavedNotification && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>تم حفظ التعديلات بنجاح! تم تحديث ملفك فوراً.</span>
        </div>
      )}

      {/* Tab 1: Requests Management */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {myRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">لا توجد أي طلبات حالياً</h4>
              <p className="text-xs text-slate-500 mt-1">
                عندما يطلب أي زبون في الدروة خدمتك ستظهر هنا مع إمكانية الاتصال به مباشرة
              </p>
            </div>
          ) : (
            myRequests.map((req) => {
              const cleanPhone = req.clientPhone.replace(/\s+/g, '');
              const waNumber = cleanPhone.startsWith('0') ? `212${cleanPhone.substring(1)}` : cleanPhone;
              const whatsappUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
                `السلام عليكم ${req.clientName}، أنا ${currentProvider?.businessName}، تلقيت طلبكم لخدمة ${t(req.category as any, language)}.`
              )}`;

              return (
                <div 
                  key={req.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-base">
                          {req.clientName}
                        </h4>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                          req.status === 'Pending' 
                            ? 'bg-amber-100 text-amber-800' 
                            : req.status === 'accepted' 
                            ? 'bg-blue-100 text-blue-800' 
                            : req.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {req.status === 'Pending' && '⏳ قيد الانتظار'}
                          {req.status === 'accepted' && '✅ تم القبول'}
                          {req.status === 'completed' && '🎉 منجز ومكتمل'}
                          {req.status === 'rejected' && '❌ معتذر عنه'}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.clientLocation}</span>
                      </p>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {req.createdAt}
                    </span>
                  </div>

                  {req.description && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <strong>تفاصيل المشكل:</strong> {req.description}
                    </div>
                  )}

                  {req.rating && (
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>تقييم الزبون: <strong>{req.rating} / 5 نجوم</strong> {req.reviewText && `("${req.reviewText}")`}</span>
                    </div>
                  )}

                  {/* Actions for this request */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    
                    {/* Communication with Client */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${req.clientPhone}`}
                        className="flex items-center gap-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>اتصال بالعميل ({req.clientPhone})</span>
                      </a>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                        <span>واتساب</span>
                      </a>
                    </div>

                    {/* Status Modifiers */}
                    <div className="flex items-center gap-2">
                      {req.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => onUpdateRequestStatus(req.id, 'accepted')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            قبول الطلب ✅
                          </button>
                          <button
                            onClick={() => onUpdateRequestStatus(req.id, 'rejected')}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition-colors"
                          >
                            اعتذار ❌
                          </button>
                        </>
                      )}

                      {req.status === 'accepted' && (
                        <button
                          onClick={() => onUpdateRequestStatus(req.id, 'completed')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                        >
                          تحديد كـ "تم إنجاز الخدمة بنجاح" 🎉
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Profile & Pricing */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
            المعلومات المهنية والتسعير
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الاسم المهني / اسم الورشة
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الهاتف (للاتصال والواتساب)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none dir-ltr text-right"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                العنوان أو الحي في الدروة
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                السعر المبدئي بالدرهم (Base Price)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none font-bold"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 rtl:left-3 rtl:right-auto text-xs font-bold text-slate-400">
                  {t('currency', language)}
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ساعات العمل والتوفر
              </label>
              <input
                type="text"
                value={workHours}
                onChange={(e) => setWorkHours(e.target.value)}
                placeholder="مثال: 08:30 - 20:00 (طيلة أيام الأسبوع)"
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نبذة تعريفية بالخبرة والخدمات المقدمة
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="اكتب نبذة تشرح فيها خبرتك وتخصصك ومجال تدخلك..."
                className="w-full text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none resize-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{t('saveProfile', language)}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Portfolio & Carte Visite */}
      {activeTab === 'portfolio' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          
          {/* Carte Visite Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {t('carteVisite', language)}
              </h3>
              <span className="text-xs text-slate-500">
                تظهر في أسفل صفحتك للزبائن لتعزيز الثقة
              </span>
            </div>

            {currentProvider?.carteVisite ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-w-md aspect-16/10 bg-slate-100">
                <img
                  src={currentProvider.carteVisite}
                  alt="بطاقة العمل"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...currentProvider, carteVisite: undefined };
                    onUpdateProviderProfile(updated);
                  }}
                  className="absolute top-2 right-2 bg-red-600/80 text-white p-1.5 rounded-lg text-xs font-bold hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-2 bg-slate-50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 font-bold">
                  لم تقم برفع بطاقة العمل بعد
                </p>
                <button
                  type="button"
                  onClick={() => {
                    // Set sample realistic business card
                    const updated = {
                      ...currentProvider,
                      carteVisite: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
                    };
                    onUpdateProviderProfile(updated);
                  }}
                  className="px-3.5 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700"
                >
                  رفع بطاقة العمل الآن 🪪
                </button>
              </div>
            )}
          </div>

          {/* Portfolio Images */}
          <div className="border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                معرض الأعمال السابقة ({currentProvider?.portfolio?.length || 0})
              </h3>
            </div>

            {/* Add new photo input */}
            <div className="flex items-center gap-2 mb-4">
              <input
                type="url"
                value={newPortfolioUrl}
                onChange={(e) => setNewPortfolioUrl(e.target.value)}
                placeholder="أدخل رابط صورة لعمل سابق (Image URL) أو اختر من المعرض..."
                className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddPortfolioImage}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة</span>
              </button>
            </div>

            {/* Existing Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {currentProvider?.portfolio?.map((img, idx) => (
                <div key={idx} className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                  <img
                    src={img}
                    alt={`عمل ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemovePortfolioImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-red-600 text-white rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
