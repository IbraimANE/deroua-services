import React, { useState } from 'react';
import { DirectoryItem, Language, DirectoryCategory } from '../types';
import { t } from '../translations';
import { 
  X, 
  Phone, 
  MapPin, 
  Search, 
  ExternalLink, 
  FlaskConical, 
  Check, 
  AlertCircle,
  Stethoscope,
  Building2,
  Clock,
  Home,
  Tag
} from 'lucide-react';

interface DirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  directoryItems: DirectoryItem[];
}

export const DirectoryModal: React.FC<DirectoryModalProps> = ({
  isOpen,
  onClose,
  language,
  directoryItems
}) => {
  const [activeTab, setActiveTab] = useState<DirectoryCategory>('emergency');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLabForTests, setSelectedLabForTests] = useState<DirectoryItem | null>(null);
  const [labTestFilter, setLabTestFilter] = useState('');

  if (!isOpen) return null;

  const filteredItems = directoryItems.filter(item => {
    const matchesCategory = item.category === activeTab;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      item.name.toLowerCase().includes(query) ||
      (item.nameFr && item.nameFr.toLowerCase().includes(query)) ||
      item.phone.includes(query) ||
      (item.specialty && item.specialty.toLowerCase().includes(query)) ||
      (item.address && item.address.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-emerald-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-2xl">
              📖
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                {t('directoryTitle', language)}
              </h2>
              <p className="text-xs text-teal-100">
                {t('directorySubtitle', language)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection: 4 Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5">
          <button
            onClick={() => { setActiveTab('emergency'); setSelectedLabForTests(null); }}
            className={`py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'emergency'
                ? 'bg-white text-red-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span className="text-base">🚨</span>
            <span className="truncate">{t('emergencyTab', language)}</span>
          </button>

          <button
            onClick={() => { setActiveTab('clinic'); setSelectedLabForTests(null); }}
            className={`py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'clinic'
                ? 'bg-white text-teal-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span className="text-base">🩺</span>
            <span className="truncate">{t('clinicsTab', language)}</span>
          </button>

          <button
            onClick={() => { setActiveTab('lab'); setSelectedLabForTests(null); }}
            className={`py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'lab'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span className="text-base">🔬</span>
            <span className="truncate">{t('labsTab', language)}</span>
          </button>

          <button
            onClick={() => { setActiveTab('center'); setSelectedLabForTests(null); }}
            className={`py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'center'
                ? 'bg-white text-amber-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span className="text-base">🏥</span>
            <span className="truncate">{language === 'ar' ? 'المراكز الصحية' : 'Centres médicaux'}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3 sm:p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'بحث في الدليل بالاسم، التخصص، الهاتف، أو العنوان...' : 'Rechercher par nom, spécialité, téléphone...'}
              className="w-full pl-3 pr-10 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-slate-900"
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-slate-600">
                {activeTab === 'clinic' && (
                  language === 'ar' 
                    ? 'لا توجد عيادات طبية مسجلة حالياً بالدروة. يمكن للأطباء والعيادات إنشاء حسابهم بسهولة للظهور هنا.' 
                    : 'Aucun cabinet médical enregistré à Deroua pour le moment.'
                )}
                {activeTab === 'lab' && (
                  language === 'ar' 
                    ? 'لا توجد مختبرات تحاليل مسجلة حالياً بالدروة. يمكن للمختبرات إنشاء حسابهم وتحديد الفحوصات والأسعار للظهور هنا.' 
                    : 'Aucun laboratoire d\'analyses enregistré à Deroua pour le moment.'
                )}
                {activeTab === 'center' && (
                  language === 'ar' 
                    ? 'لا توجد مراكز صحية مسجلة حالياً بالدروة. يمكن للمراكز إنشاء حسابهم بسهولة للظهور هنا.' 
                    : 'Aucun centre médical enregistré à Deroua pour le moment.'
                )}
                {activeTab === 'emergency' && (
                  language === 'ar' ? 'لا توجد أرقام مطابقة لبحثك' : 'Aucun résultat trouvé.'
                )}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="pt-3 first:pt-0 pb-1 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0 border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                    {item.iconEmoji || (item.category === 'clinic' ? '🩺' : item.category === 'lab' ? '🔬' : item.category === 'center' ? '🏥' : '🚨')}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {language === 'ar' ? item.name : (item.nameFr || item.name)}
                      </h3>
                      
                      {/* Clinic / Center Specialty Badge */}
                      {item.specialty && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-md border border-teal-200/60">
                          <Stethoscope className="w-3 h-3 text-teal-600" />
                          <span>{item.specialty}</span>
                        </span>
                      )}

                      {/* Lab Home sampling badge */}
                      {item.category === 'lab' && item.homeSampling && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Home className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{language === 'ar' ? 'أخذ عينات بالمنزل' : 'Prélèvement à domicile'}</span>
                        </span>
                      )}
                    </div>

                    {/* Doctor / In-charge name */}
                    {item.doctorName && (
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        <span className="text-slate-400 font-normal">{language === 'ar' ? 'المشرف المسؤول: ' : 'Responsable: '}</span>
                        {item.doctorName}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dir-ltr">
                        <Phone className="w-3 h-3 text-teal-600" />
                        {item.phone}
                      </span>
                      {item.address && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.address}
                        </span>
                      )}
                      {item.workHours && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.workHours}
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-slate-600 mt-1 font-medium bg-slate-100 px-2 py-0.5 rounded-md inline-block">
                        {item.notes}
                      </p>
                    )}

                    {/* If Lab tests exist, show button to view and check exact prices */}
                    {item.labTests && item.labTests.length > 0 && (
                      <div className="mt-2.5">
                        <button
                          onClick={() => setSelectedLabForTests(selectedLabForTests?.id === item.id ? null : item)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                            selectedLabForTests?.id === item.id 
                              ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs' 
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                          }`}
                        >
                          <FlaskConical className="w-3.5 h-3.5" />
                          <span>
                            {selectedLabForTests?.id === item.id
                              ? (language === 'ar' ? 'إغلاق لائحة الفحوصات والأسعار' : 'Masquer la liste des tarifs')
                              : (language === 'ar' ? `عرض الفحوصات والتحاليل وأثمنتها (${item.labTests.length})` : `Voir les analyses & tarifs (${item.labTests.length})`)}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center mt-2 sm:mt-0">
                  {item.googleMapsUrl && (
                    <a
                      href={item.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors"
                      title={t('openInMaps', language)}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={`tel:${item.phone}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('callNow', language)}</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Embedded Lab Tests Pricing Viewer Drawer (when a lab or center is chosen) */}
        {selectedLabForTests && selectedLabForTests.labTests && (
          <div className="border-t-2 border-indigo-200 bg-indigo-50/50 p-4 max-h-72 overflow-y-auto animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-indigo-700" />
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  {language === 'ar' ? 'الفحوصات والتحاليل الطبية المعتمدة وأثمنتها بالدرهم (DH)' : 'Analyses médicales & Tarifs en DH'} - {selectedLabForTests.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedLabForTests(null)}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold cursor-pointer"
              >
                {language === 'ar' ? 'إغلاق ✕' : 'Fermer ✕'}
              </button>
            </div>

            {/* Quick Filter */}
            <div className="mb-2.5">
              <input
                type="text"
                value={labTestFilter}
                onChange={(e) => setLabTestFilter(e.target.value)}
                placeholder={language === 'ar' ? 'بحث في أسماء الفحوصات والتحاليل (مثال: سكري، كولسترول)...' : 'Filtrer les analyses...'}
                className="w-full text-xs py-1.5 px-3 bg-white border border-indigo-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedLabForTests.labTests
                .filter(t => !labTestFilter.trim() || t.name.toLowerCase().includes(labTestFilter.toLowerCase()) || (t.nameFr && t.nameFr.toLowerCase().includes(labTestFilter.toLowerCase())))
                .map((test) => (
                  <div key={test.id} className="bg-white p-2.5 rounded-xl border border-indigo-100 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {language === 'ar' ? test.name : (test.nameFr || test.name)}
                      </div>
                      {test.duration && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5 text-slate-400" />
                          {test.duration}
                        </span>
                      )}
                    </div>
                    
                    <div className="shrink-0 text-right">
                      <span className="inline-block font-black text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                        {test.price} DH
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
