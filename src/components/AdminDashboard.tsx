import React, { useState } from 'react';
import { Provider, ServiceRequest, DirectoryItem, Language, DirectoryCategory } from '../types';
import { t } from '../translations';
import { 
  Users, 
  Store, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Trash2, 
  Plus, 
  Search, 
  Check, 
  X, 
  Phone, 
  MapPin, 
  AlertCircle,
  LogOut,
  Mail,
  User,
  Lock,
  Stethoscope,
  FlaskConical,
  Building2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  providers: Provider[];
  serviceRequests: ServiceRequest[];
  directoryItems: DirectoryItem[];
  onToggleVerifiedBadge: (providerId: string) => void;
  onApproveProvider: (providerId: string) => void;
  onRejectProvider: (providerId: string) => void;
  onDeleteProvider: (providerId: string) => void;
  onAddDirectoryItem: (newItem: DirectoryItem) => void;
  onDeleteDirectoryItem: (id: string) => void;
  onClearAllProviders?: () => void;
  onClearAllRequests?: () => void;
  onClearMedicalDirectory?: () => void;
  onOpenNewJoinModal?: () => void;
  adminEmail?: string;
  onLogout?: () => void;
  language: Language;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  providers,
  serviceRequests,
  directoryItems,
  onToggleVerifiedBadge,
  onApproveProvider,
  onRejectProvider,
  onDeleteProvider,
  onAddDirectoryItem,
  onDeleteDirectoryItem,
  onClearAllProviders,
  onClearAllRequests,
  onClearMedicalDirectory,
  onOpenNewJoinModal,
  adminEmail,
  onLogout,
  language
}) => {
  const [activeTab, setActiveTab] = useState<'providers' | 'pending' | 'directory' | 'requests'>('providers');
  const [providerSearch, setProviderSearch] = useState('');
  const [directoryFilter, setDirectoryFilter] = useState<DirectoryCategory | 'all'>('all');
  const [directorySearch, setDirectorySearch] = useState('');

  // Confirmation dialog state for clearing medical facilities
  const [showClearMedicalConfirm, setShowClearMedicalConfirm] = useState(false);

  // New Directory Contact Form
  const [newDirName, setNewDirName] = useState('');
  const [newDirPhone, setNewDirPhone] = useState('');
  const [newDirAddress, setNewDirAddress] = useState('');
  const [newDirSpecialty, setNewDirSpecialty] = useState('');
  const [newDirDoctorName, setNewDirDoctorName] = useState('');
  const [newDirCategory, setNewDirCategory] = useState<DirectoryItem['category']>('clinic');
  const [newDirEmoji, setNewDirEmoji] = useState('🩺');
  const [showAddDirForm, setShowAddDirForm] = useState(false);

  const pendingProviders = providers.filter(p => p.status === 'pending');
  const approvedProviders = providers.filter(p => p.status !== 'pending');

  const filteredProviders = approvedProviders.filter(p => 
    p.businessName.toLowerCase().includes(providerSearch.toLowerCase()) ||
    p.phone.includes(providerSearch) ||
    t(p.category as any, language).toLowerCase().includes(providerSearch.toLowerCase())
  );

  const medicalItemsCount = directoryItems.filter(i => i.category === 'clinic' || i.category === 'lab' || i.category === 'center').length;

  const filteredDirectory = directoryItems.filter(item => {
    const matchesCategory = directoryFilter === 'all' || item.category === directoryFilter;
    const query = directorySearch.trim().toLowerCase();
    const matchesQuery = !query || 
      item.name.toLowerCase().includes(query) ||
      item.phone.includes(query) ||
      (item.specialty && item.specialty.toLowerCase().includes(query)) ||
      (item.address && item.address.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  const handleCreateDirectoryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirName || !newDirPhone) return;

    const newItem: DirectoryItem = {
      id: 'dir-' + Date.now(),
      name: newDirName.trim(),
      phone: newDirPhone.trim(),
      address: newDirAddress.trim() || 'مدينة الدروة',
      category: newDirCategory,
      iconEmoji: newDirEmoji,
      specialty: newDirSpecialty.trim() || undefined,
      doctorName: newDirDoctorName.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    onAddDirectoryItem(newItem);
    setNewDirName('');
    setNewDirPhone('');
    setNewDirAddress('');
    setNewDirSpecialty('');
    setNewDirDoctorName('');
    setShowAddDirForm(false);
  };

  const handleConfirmClearMedical = () => {
    if (onClearMedicalDirectory) {
      onClearMedicalDirectory();
    }
    setShowClearMedicalConfirm(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Top Admin Header */}
      <div className="bg-gradient-to-r from-red-800 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-500/30 text-red-200 text-xs font-bold px-2 py-0.5 rounded-md border border-red-400/30">
              إدارة المنصة
            </span>
            <h2 className="text-lg sm:text-xl font-black">
              لوحة الإدارة الرئيسية - خدمات الدروة
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            مراجعة طلبات الانضمام، إدارة الحرفيين، ومسح وتحديث معطيات العيادات والمختبرات والمراكز
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
            <User className="w-3.5 h-3.5 text-red-300 shrink-0" />
            <span className="font-mono text-white/90 text-[11px] truncate max-w-[200px] sm:max-w-none" dir="ltr">
              {adminEmail || 'ibrahimaitaddimane@gmail.com'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs bg-black/20 px-2.5 py-1.5 rounded-xl border border-white/10">
            <span>{language === 'ar' ? 'الانتظار:' : 'En attente :'}</span>
            <span className="font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
              {pendingProviders.length}
            </span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-white text-xs font-bold transition-all border border-red-500/30 cursor-pointer shadow-xs"
              title={language === 'ar' ? 'تسجيل الخروج من لوحة الإدارة' : 'Déconnexion'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Banner for Medical Entities Data Reset */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-amber-950">
              {language === 'ar' ? 'إدارة معطيات العيادات والمختبرات والمراكز' : 'Gestion des données médicales'}
            </h4>
            <p className="text-[11px] text-amber-800">
              {language === 'ar'
                ? `يوجد حالياً (${medicalItemsCount}) منشأة طبية مسجلة. يمكنك مسح جميع معطياتها بنقرة واحدة لتهيئة النظام للتسجيلات الجديدة.`
                : `${medicalItemsCount} établissements médicaux enregistrés. Vous pouvez réinitialiser leurs données en un clic.`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowClearMedicalConfirm(true)}
          className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>{language === 'ar' ? 'مسح معطيات العيادات والمختبرات والمراكز' : 'Effacer cliniques & labos'}</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showClearMedicalConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-slate-900">
                {language === 'ar' ? 'تأكيد مسح المعطيات الطبية' : 'Confirmation de suppression'}
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'هل أنت متأكد من رغبتك في مسح جميع معطيات العيادات الطبية، مختبرات التحاليل، والمراكز الصحية؟ سيتم الاحتفاظ فقط بأرقام الطوارئ العامة.'
                : 'Voulez-vous vraiment effacer toutes les données des cabinets médicaux, laboratoires et centres ? Seuls les numéros d\'urgence seront conservés.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearMedicalConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleConfirmClearMedical}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs shadow-md shadow-red-900/20 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'نعم، مسح جميع المعطيات' : 'Oui, effacer'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">{t('totalProviders', language)}</span>
            <Store className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{providers.length}</p>
          <span className="text-[11px] text-teal-700 font-semibold">{approvedProviders.length} معتمد ونشط</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">{t('pendingApprovals', language)}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{pendingProviders.length}</p>
          <span className="text-[11px] text-amber-600 font-semibold">بانتظار الموافقة</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">{t('totalRequests', language)}</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-indigo-700 mt-2">{serviceRequests.length}</p>
          <span className="text-[11px] text-indigo-600 font-semibold">طلبات زبائن بالدروة</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold">دليل المنشآت</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">{directoryItems.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">{medicalItemsCount} عيادات ومختبرات</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 gap-2 border shadow-xs">
        <button
          onClick={() => setActiveTab('providers')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'providers' 
              ? 'bg-red-800 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t('manageProviders', language)} ({approvedProviders.length})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-extrabold transition-all relative cursor-pointer ${
            activeTab === 'pending' 
              ? 'bg-red-800 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{t('pendingApprovals', language)}</span>
          {pendingProviders.length > 0 && (
            <span className="mr-1.5 rtl:mr-1.5 ltr:ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
              {pendingProviders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'directory' 
              ? 'bg-red-800 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          دليل المدينة ({directoryItems.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
            activeTab === 'requests' 
              ? 'bg-red-800 text-white shadow-xs' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          سجل الطلبات ({serviceRequests.length})
        </button>
      </div>

      {/* Tab 1: Providers */}
      {activeTab === 'providers' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
              <input
                type="text"
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)}
                placeholder="البحث بالاسم، الحرفة، أو رقم الهاتف..."
                className="w-full text-xs py-2 pl-3 pr-10 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-600/30"
              />
            </div>

            <div className="flex items-center gap-2">
              {onOpenNewJoinModal && (
                <button
                  onClick={onOpenNewJoinModal}
                  className="px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة حرفي يدوياً</span>
                </button>
              )}

              {onClearAllProviders && (
                <button
                  onClick={onClearAllProviders}
                  className="px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  title="مسح جميع الحرفيين"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {filteredProviders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                لا يوجد حرفيون معتمدون يطابقون بحثك.
              </div>
            ) : (
              filteredProviders.map(p => (
                <div key={p.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt={p.businessName} className="w-11 h-11 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm">{p.businessName}</h4>
                        {p.isVerified && (
                          <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-teal-600" />
                            <span>موثق</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {t(p.category as any, language)} • <span className="dir-ltr font-semibold text-slate-700">{p.phone}</span> • {p.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onToggleVerifiedBadge(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        p.isVerified
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                          : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                      }`}
                    >
                      {p.isVerified ? 'إلغاء التوثيق' : 'منح شارة التوثيق'}
                    </button>
                    <button
                      onClick={() => onDeleteProvider(p.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Pending Approvals */}
      {activeTab === 'pending' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base">
            طلبات انضمام الحرفيين بانتظار الموافقة ({pendingProviders.length})
          </h3>

          {pendingProviders.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              لا توجد طلبات جديدة بانتظار المراجعة.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {pendingProviders.map((prov) => (
                <div key={prov.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/20">
                  <div className="flex items-center gap-3">
                    <img
                      src={prov.avatar}
                      alt={prov.businessName}
                      className="w-12 h-12 rounded-xl object-cover border border-amber-200"
                    />
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {prov.businessName}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        <strong>المهنة:</strong> {t(prov.category as any, language)} • <strong>الهاتف:</strong> <span className="dir-ltr">{prov.phone}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        العنوان: {prov.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onApproveProvider(prov.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('approve', language)}</span>
                    </button>

                    <button
                      onClick={() => onRejectProvider(prov.id)}
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {t('reject', language)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: City Directory Manager */}
      {activeTab === 'directory' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                دليل مدينة الدروة (العيادات، المختبرات، المراكز والطوارئ)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                إجمالي المدخلات: {directoryItems.length} ({medicalItemsCount} منشآت طبية)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowClearMedicalConfirm(true)}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>مسح العيادات والمختبرات</span>
              </button>

              <button
                onClick={() => setShowAddDirForm(!showAddDirForm)}
                className="px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة جهة جديدة</span>
              </button>
            </div>
          </div>

          {/* Directory Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              onClick={() => setDirectoryFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                directoryFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              الكل ({directoryItems.length})
            </button>
            <button
              onClick={() => setDirectoryFilter('clinic')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                directoryFilter === 'clinic' ? 'bg-teal-700 text-white' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
              }`}
            >
              🩺 العيادات ({directoryItems.filter(i => i.category === 'clinic').length})
            </button>
            <button
              onClick={() => setDirectoryFilter('lab')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                directoryFilter === 'lab' ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              }`}
            >
              🔬 المختبرات ({directoryItems.filter(i => i.category === 'lab').length})
            </button>
            <button
              onClick={() => setDirectoryFilter('center')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                directoryFilter === 'center' ? 'bg-amber-700 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              🏥 المراكز ({directoryItems.filter(i => i.category === 'center').length})
            </button>
            <button
              onClick={() => setDirectoryFilter('emergency')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                directoryFilter === 'emergency' ? 'bg-red-700 text-white' : 'bg-red-50 text-red-800 hover:bg-red-100'
              }`}
            >
              🚨 الطوارئ ({directoryItems.filter(i => i.category === 'emergency').length})
            </button>
          </div>

          {/* Search box */}
          <div>
            <input
              type="text"
              value={directorySearch}
              onChange={(e) => setDirectorySearch(e.target.value)}
              placeholder="بحث في الدليل..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none"
            />
          </div>

          {/* Add Form */}
          {showAddDirForm && (
            <form onSubmit={handleCreateDirectoryItem} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
              <h4 className="text-xs font-bold text-slate-800">إضافة منشأة أو جهة جديدة للدليل:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newDirName}
                  onChange={(e) => setNewDirName(e.target.value)}
                  placeholder="اسم المنشأة أو العيادة"
                  className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                />
                <input
                  type="tel"
                  required
                  value={newDirPhone}
                  onChange={(e) => setNewDirPhone(e.target.value)}
                  placeholder="رقم الهاتف"
                  className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-none dir-ltr text-right"
                />
                <input
                  type="text"
                  value={newDirAddress}
                  onChange={(e) => setNewDirAddress(e.target.value)}
                  placeholder="العنوان في الدروة"
                  className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                />
                <input
                  type="text"
                  value={newDirSpecialty}
                  onChange={(e) => setNewDirSpecialty(e.target.value)}
                  placeholder="التخصص الطبي (للعيادات والمراكز)"
                  className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                />
                <input
                  type="text"
                  value={newDirDoctorName}
                  onChange={(e) => setNewDirDoctorName(e.target.value)}
                  placeholder="اسم الطبيب أو المشرف المسؤول"
                  className="text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                />
                <div className="flex gap-2">
                  <select
                    value={newDirCategory}
                    onChange={(e) => {
                      const cat = e.target.value as DirectoryItem['category'];
                      setNewDirCategory(cat);
                      setNewDirEmoji(cat === 'emergency' ? '🚨' : cat === 'clinic' ? '🩺' : cat === 'lab' ? '🔬' : '🏥');
                    }}
                    className="flex-1 text-xs p-2.5 bg-white border border-slate-200 rounded-xl outline-none font-bold"
                  >
                    <option value="clinic">🩺 عيادة طبية</option>
                    <option value="lab">🔬 مختبر تحاليل</option>
                    <option value="center">🏥 مركز صحي/ترويض</option>
                    <option value="emergency">🚨 طوارئ وصيدليات</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    حفظ
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Directory List */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {filteredDirectory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                لا توجد عناصر في هذا التصنيف.
              </div>
            ) : (
              filteredDirectory.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl shrink-0">{item.iconEmoji || '📍'}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-slate-900">{item.name}</h5>
                        {item.specialty && (
                          <span className="text-[10px] bg-teal-50 text-teal-800 border border-teal-200 font-bold px-1.5 py-0.2 rounded-md">
                            {item.specialty}
                          </span>
                        )}
                        {item.labTests && item.labTests.length > 0 && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-800 font-bold px-1.5 py-0.2 rounded-md">
                            {item.labTests.length} تحليل متاح
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        <span className="dir-ltr font-semibold">{item.phone}</span> • {item.address}
                        {item.doctorName && ` • المشرف: ${item.doctorName}`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteDirectoryItem(item.id)}
                    className="text-slate-400 hover:text-red-600 p-1.5 transition-colors cursor-pointer"
                    title="حذف من الدليل"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* Tab 4: All Service Requests Logs */}
      {activeTab === 'requests' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-base">
              سجل كافة طلبات الخدمات المرسلة عبر التطبيق ({serviceRequests.length})
            </h3>
            {onClearAllRequests && (
              <button
                onClick={onClearAllRequests}
                className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح السجل</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {serviceRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                لا توجد طلبات مسجلة بعد في النظام.
              </div>
            ) : (
              serviceRequests.map(req => (
                <div key={req.id} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900">{req.clientName}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="text-teal-700 font-semibold">{req.category}</span>
                    <p className="text-slate-500 mt-0.5">{req.description}</p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center text-[11px]">
                    <span className="font-mono text-slate-600 dir-ltr">{req.clientPhone}</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                      req.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
