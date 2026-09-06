import React, { useState } from 'react';
import { Language, UserRole, DirectoryItem, LabTest } from '../types';
import { 
  User, 
  Wrench, 
  Lock, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Languages, 
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  Stethoscope,
  FlaskConical,
  Building2,
  Plus,
  Trash2,
  Clock,
  MapPin,
  Check,
  BookOpen
} from 'lucide-react';

interface WelcomeAuthScreenProps {
  onLoginSuccess: (session: {
    userType: UserRole;
    userName: string;
    email?: string;
    phone?: string;
    establishmentId?: string;
  }) => void;
  onOpenArtisanJoin: () => void;
  onOpenDirectory?: () => void;
  onRegisterEstablishment?: (item: DirectoryItem) => void;
  directoryItems?: DirectoryItem[];
  language: Language;
  onLanguageToggle: () => void;
  onContinueAsGuest: () => void;
}

const CLINIC_SPECIALTIES = [
  { ar: 'طب عام ومستعجلات', fr: 'Médecine Générale & Urgences' },
  { ar: 'طب الأطفال وحديثي الولادة', fr: 'Pédiatrie' },
  { ar: 'أمراض وجراحة الأسنان', fr: 'Chirurgie Dentaire' },
  { ar: 'أمراض النساء والتوليد', fr: 'Gynécologie & Obstétrique' },
  { ar: 'أمراض القلب والشرايين', fr: 'Cardiologie' },
  { ar: 'طب وجراحة العيون', fr: 'Ophtalmologie' },
  { ar: 'أمراض وجراحة العظام والمفاصل', fr: 'Orthopédie & Traumatologie' },
  { ar: 'أمراض الجهاز الهضمي والكبد', fr: 'Gastro-entérologie' },
  { ar: 'أمراض الأنف والأذن والحنجرة', fr: 'ORL' },
  { ar: 'أمراض الجلد والحساسية', fr: 'Dermatologie' },
  { ar: 'أمراض الكلى والمسالك البولية', fr: 'Néphrologie & Urologie' },
  { ar: 'الطب النفسي والعصبي', fr: 'Psychiatrie & Neurologie' },
  { ar: 'تخصص آخر...', fr: 'Autre spécialité...' },
];

const CENTER_TYPES = [
  { ar: 'مركز ترويض طبي وفيزيائي', fr: 'Kinésithérapie & Rééducation' },
  { ar: 'مركز أشعة وتصوير وفحص بالصدى', fr: 'Radiologie & Échographie' },
  { ar: 'مركز تصفية الكلى', fr: 'Centre d\'Hémodialyse' },
  { ar: 'مركز تمريض وإسعافات وعلاجات منزلية', fr: 'Soins Infirmiers & Soins à domicile' },
  { ar: 'مركز طبي وصحي متعدد التخصصات', fr: 'Centre Médical Polyvalent' },
  { ar: 'نوع آخر...', fr: 'Autre type de centre...' },
];

interface StandardTestItem {
  id: string;
  name: string;
  nameFr: string;
  price: number;
  selected: boolean;
  duration?: string;
}

const INITIAL_LAB_TESTS: StandardTestItem[] = [
  { id: 't1', name: 'تحليل تعداد الدم الكامل (NFS)', nameFr: 'Numération Formule Sanguine (NFS)', price: 100, selected: true, duration: 'نفس اليوم' },
  { id: 't2', name: 'تحليل السكري في الدم صائم (Glycémie à jeun)', nameFr: 'Glycémie à jeun', price: 40, selected: true, duration: 'نفس اليوم' },
  { id: 't3', name: 'مخزون السكري 3 أشهر (HbA1c)', nameFr: 'Hémoglobine Glyquée (HbA1c)', price: 120, selected: true, duration: 'نفس اليوم' },
  { id: 't4', name: 'تحليل الدهون والكولسترول الكامل (Bilan lipidique)', nameFr: 'Bilan Lipidique complet', price: 170, selected: true, duration: 'نفس اليوم' },
  { id: 't5', name: 'تحليل وظائف الكلى (Urée + Créatinine)', nameFr: 'Bilan Rénal', price: 90, selected: true, duration: 'نفس اليوم' },
  { id: 't6', name: 'تحليل وظائف الكبد (ASAT / ALAT)', nameFr: 'Bilan Hépatique', price: 110, selected: true, duration: 'نفس اليوم' },
  { id: 't7', name: 'تحليل الالتهاب السريع (CRP)', nameFr: 'Protéine C-Réactive (CRP)', price: 80, selected: true, duration: 'ساعتان' },
  { id: 't8', name: 'تحليل هرمون الغدة الدرقية (TSH)', nameFr: 'Hormone TSH', price: 150, selected: true, duration: '24 ساعة' },
  { id: 't9', name: 'تحليل مخزون الحديد (Ferritine)', nameFr: 'Ferritine sérique', price: 160, selected: true, duration: '24 ساعة' },
  { id: 't10', name: 'تحليل فيتامين د (Vitamine D)', nameFr: 'Vitamine D (25-OH)', price: 250, selected: true, duration: '48 ساعة' },
  { id: 't11', name: 'تحليل تخثر الدم (TP / INR)', nameFr: 'Taux de Prothrombine (TP/INR)', price: 70, selected: true, duration: 'نفس اليوم' },
  { id: 't12', name: 'تحليل ميكروبات البول (ECBU)', nameFr: 'Examen Cytobactériologique (ECBU)', price: 90, selected: true, duration: '48 ساعة' },
];

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({
  onLoginSuccess,
  onOpenArtisanJoin,
  onOpenDirectory,
  onRegisterEstablishment,
  directoryItems = [],
  language,
  onLanguageToggle,
  onContinueAsGuest
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Login form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRole, setLoginRole] = useState<UserRole>('client');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Signup form states
  const [signupType, setSignupType] = useState<'client' | 'provider' | 'clinic' | 'lab' | 'center'>('client');
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Standard Client Signup
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [showClientPassword, setShowClientPassword] = useState(false);

  // Medical Clinic (عيادة) State
  const [clinicName, setClinicName] = useState('');
  const [clinicSpecialty, setClinicSpecialty] = useState(CLINIC_SPECIALTIES[0].ar);
  const [clinicCustomSpecialty, setClinicCustomSpecialty] = useState('');
  const [clinicDoctorName, setClinicDoctorName] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicWorkHours, setClinicWorkHours] = useState('الإثنين - الجمعة: 09:00 - 18:00 | السبت: 09:00 - 14:00');
  const [clinicPassword, setClinicPassword] = useState('');
  const [clinicNotes, setClinicNotes] = useState('');

  // Medical Lab (مختبر تحاليل) State
  const [labName, setLabName] = useState('');
  const [labDoctorName, setLabDoctorName] = useState('');
  const [labPhone, setLabPhone] = useState('');
  const [labAddress, setLabAddress] = useState('');
  const [labWorkHours, setLabWorkHours] = useState('07:30 - 19:00 بدون انقطاع');
  const [labHomeSampling, setLabHomeSampling] = useState(true);
  const [labPassword, setLabPassword] = useState('');
  const [labTestsList, setLabTestsList] = useState<StandardTestItem[]>(INITIAL_LAB_TESTS);
  
  // Adding custom test to lab
  const [customTestName, setCustomTestName] = useState('');
  const [customTestPrice, setCustomTestPrice] = useState('');

  // Center (مركز صحي / ترويض / تشخيص) State
  const [centerName, setCenterName] = useState('');
  const [centerType, setCenterType] = useState(CENTER_TYPES[0].ar);
  const [centerCustomType, setCenterCustomType] = useState('');
  const [centerDirectorName, setCenterDirectorName] = useState('');
  const [centerPhone, setCenterPhone] = useState('');
  const [centerAddress, setCenterAddress] = useState('');
  const [centerWorkHours, setCenterWorkHours] = useState('08:30 - 19:30');
  const [centerPassword, setCenterPassword] = useState('');
  const [centerServices, setCenterServices] = useState<{ id: string; name: string; price: number }[]>([
    { id: 'cs-1', name: 'حصة ترويض طبي كاملة', price: 150 },
    { id: 'cs-2', name: 'استشارة وفحص سريري', price: 100 }
  ]);
  const [customCenterServiceName, setCustomCenterServiceName] = useState('');
  const [customCenterServicePrice, setCustomCenterServicePrice] = useState('');

  const handleAddCustomLabTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTestName.trim() || !customTestPrice) return;
    const priceVal = parseFloat(customTestPrice);
    if (isNaN(priceVal) || priceVal < 0) return;

    const newTest: StandardTestItem = {
      id: 'ct-' + Date.now(),
      name: customTestName.trim(),
      nameFr: customTestName.trim(),
      price: priceVal,
      selected: true,
      duration: 'نفس اليوم'
    };
    setLabTestsList(prev => [...prev, newTest]);
    setCustomTestName('');
    setCustomTestPrice('');
  };

  const handleToggleLabTest = (id: string) => {
    setLabTestsList(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  };

  const handleUpdateLabTestPrice = (id: string, newPrice: number) => {
    setLabTestsList(prev => prev.map(t => t.id === id ? { ...t, price: newPrice } : t));
  };

  const handleAddCustomCenterService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCenterServiceName.trim() || !customCenterServicePrice) return;
    const priceVal = parseFloat(customCenterServicePrice);
    if (isNaN(priceVal) || priceVal < 0) return;

    setCenterServices(prev => [
      ...prev,
      { id: 'cs-' + Date.now(), name: customCenterServiceName.trim(), price: priceVal }
    ]);
    setCustomCenterServiceName('');
    setCustomCenterServicePrice('');
  };

  const handleRemoveCenterService = (id: string) => {
    setCenterServices(prev => prev.filter(s => s.id !== id));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const identifier = loginIdentifier.trim().toLowerCase();
    const password = loginPassword.trim();

    // Check if admin login credentials
    if (identifier === 'ibrahimaitaddimane@gmail.com') {
      if (password === 'azertyuiop123456789@') {
        onLoginSuccess({
          userType: 'admin',
          userName: 'Ibrahim (المسؤول)',
          email: 'ibrahimaitaddimane@gmail.com'
        });
        return;
      } else {
        setLoginError(
          language === 'ar'
            ? 'كلمة المرور غير صحيحة لحساب الإدارة.'
            : 'Mot de passe administrateur incorrect.'
        );
        return;
      }
    }

    if (!identifier || !password) {
      setLoginError(
        language === 'ar' 
          ? 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف وكلمة المرور.' 
          : 'Veuillez saisir votre email ou téléphone et mot de passe.'
      );
      return;
    }

    // Check if it's a registered clinic, lab, or center in directoryItems
    const matchedFacility = directoryItems.find(item => 
      item.phone === identifier || (item.email && item.email.toLowerCase() === identifier) || item.name.toLowerCase().includes(identifier)
    );

    if (matchedFacility && (loginRole === 'company' || matchedFacility.category !== 'emergency')) {
      onLoginSuccess({
        userType: 'company',
        userName: matchedFacility.name,
        phone: matchedFacility.phone,
        establishmentId: matchedFacility.id
      });
      return;
    }

    // Normal client or provider login
    const userName = identifier.includes('@') ? identifier.split('@')[0] : 'مستخدم الدروة';
    onLoginSuccess({
      userType: loginRole,
      userName: userName,
      email: identifier.includes('@') ? identifier : undefined,
      phone: !identifier.includes('@') ? identifier : undefined
    });
  };

  const handleClientSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPassword.trim()) return;

    setSignupSuccess(true);
    setTimeout(() => {
      onLoginSuccess({
        userType: 'client',
        userName: clientName.trim(),
        phone: clientPhone.trim(),
        email: clientEmail.trim()
      });
    }, 500);
  };

  const handleClinicSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicName.trim() || !clinicPhone.trim() || !clinicPassword.trim()) return;

    const actualSpecialty = clinicSpecialty === 'تخصص آخر...' || clinicSpecialty === 'Autre spécialité...'
      ? (clinicCustomSpecialty.trim() || 'طب عام')
      : clinicSpecialty;

    const newClinicItem: DirectoryItem = {
      id: 'clinic-' + Date.now(),
      name: clinicName.trim(),
      nameFr: clinicName.trim(),
      category: 'clinic',
      phone: clinicPhone.trim(),
      address: clinicAddress.trim() || 'مدينة الدروة',
      iconEmoji: '🩺',
      specialty: actualSpecialty,
      specialtyFr: actualSpecialty,
      doctorName: clinicDoctorName.trim(),
      workHours: clinicWorkHours.trim(),
      notes: clinicNotes.trim() || `تخصص: ${actualSpecialty}`,
      password: clinicPassword.trim(),
      createdAt: new Date().toISOString()
    };

    if (onRegisterEstablishment) {
      onRegisterEstablishment(newClinicItem);
    }

    setSignupSuccess(true);
    setTimeout(() => {
      onLoginSuccess({
        userType: 'company',
        userName: newClinicItem.name,
        phone: newClinicItem.phone,
        establishmentId: newClinicItem.id
      });
    }, 600);
  };

  const handleLabSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labName.trim() || !labPhone.trim() || !labPassword.trim()) return;

    const selectedTests: LabTest[] = labTestsList
      .filter(t => t.selected)
      .map(t => ({
        id: t.id,
        name: t.name,
        nameFr: t.nameFr,
        price: t.price,
        duration: t.duration || 'نفس اليوم'
      }));

    const newLabItem: DirectoryItem = {
      id: 'lab-' + Date.now(),
      name: labName.trim(),
      nameFr: labName.trim(),
      category: 'lab',
      phone: labPhone.trim(),
      address: labAddress.trim() || 'مدينة الدروة',
      iconEmoji: '🔬',
      doctorName: labDoctorName.trim(),
      homeSampling: labHomeSampling,
      workHours: labWorkHours.trim(),
      notes: labHomeSampling ? 'أخذ العينات بالمنزل متوفر لكبار السن والمرضى' : 'مختبر تحاليل طبية معتمد بالدروة',
      labTests: selectedTests,
      password: labPassword.trim(),
      createdAt: new Date().toISOString()
    };

    if (onRegisterEstablishment) {
      onRegisterEstablishment(newLabItem);
    }

    setSignupSuccess(true);
    setTimeout(() => {
      onLoginSuccess({
        userType: 'company',
        userName: newLabItem.name,
        phone: newLabItem.phone,
        establishmentId: newLabItem.id
      });
    }, 600);
  };

  const handleCenterSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!centerName.trim() || !centerPhone.trim() || !centerPassword.trim()) return;

    const actualType = centerType === 'نوع آخر...' || centerType === 'Autre type de centre...'
      ? (centerCustomType.trim() || 'مركز صحي وتأهيلي')
      : centerType;

    const testsFormatted: LabTest[] = centerServices.map(s => ({
      id: s.id,
      name: s.name,
      nameFr: s.name,
      price: s.price,
      duration: 'عند الطلب'
    }));

    const newCenterItem: DirectoryItem = {
      id: 'center-' + Date.now(),
      name: centerName.trim(),
      nameFr: centerName.trim(),
      category: 'center',
      phone: centerPhone.trim(),
      address: centerAddress.trim() || 'مدينة الدروة',
      iconEmoji: '🏥',
      specialty: actualType,
      specialtyFr: actualType,
      doctorName: centerDirectorName.trim(),
      workHours: centerWorkHours.trim(),
      notes: `نوع المركز: ${actualType}`,
      labTests: testsFormatted,
      password: centerPassword.trim(),
      createdAt: new Date().toISOString()
    };

    if (onRegisterEstablishment) {
      onRegisterEstablishment(newCenterItem);
    }

    setSignupSuccess(true);
    setTimeout(() => {
      onLoginSuccess({
        userType: 'company',
        userName: newCenterItem.name,
        phone: newCenterItem.phone,
        establishmentId: newCenterItem.id
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Top Bar with Language Toggle & Deroua Badge */}
      <div className="max-w-2xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
          <span className="text-xs font-black text-slate-700 tracking-wider uppercase">
            Deroua • الدروة
          </span>
        </div>

        <button
          onClick={onLanguageToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
          title="Changer la langue / تغيير اللغة"
        >
          <Languages className="w-3.5 h-3.5 text-teal-600" />
          <span>{language === 'ar' ? 'Français' : 'العربية'}</span>
        </button>
      </div>

      {/* Main Form Box */}
      <div className="max-w-xl w-full mx-auto my-auto py-4 z-10">
        
        {/* Brand Logo & Presentation */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden shadow-xl border-3 border-white ring-4 ring-teal-500/20 bg-white p-1">
              <img
                src="/deroua_logo.jpg"
                alt="شعار منصة خدمات الدروة - Deroua Services Logo"
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-1.5 rounded-xl shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {language === 'ar' ? 'منصة ودليل خدمات مدينة الدروة' : 'Plateforme & Annuaire de Deroua'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {language === 'ar' 
              ? 'المنصة الرقمية الموحدة لجميع خدمات، حرفيي، عيادات ومختبرات مدينة الدروة'
              : 'La plateforme unifiée pour tous les services, artisans, cliniques et laboratoires de Deroua'}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-5 sm:p-7 backdrop-blur-sm">
          
          {/* Mode Switcher: Login vs Signup */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setLoginError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setLoginError(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {language === 'ar' ? 'إنشاء حساب جديد' : 'Créer un compte'}
            </button>
          </div>

          {authMode === 'login' ? (
            /* Login Mode */
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {language === 'ar' ? 'تسجيل الدخول للمتابعة' : 'Connexion pour continuer'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ar' ? 'أدخل معلومات حسابك للوصول إلى خدماتك' : 'Accédez à votre espace'}
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Login Role Switcher */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLoginRole('client')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    loginRole === 'client' 
                      ? 'bg-white text-teal-800 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'زبون' : 'Client'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginRole('provider')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    loginRole === 'provider' 
                      ? 'bg-white text-teal-800 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'حرفي' : 'Artisan'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginRole('company')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    loginRole === 'company' 
                      ? 'bg-white text-teal-800 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'عيادة/مختبر' : 'Établissement'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginRole('admin')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    loginRole === 'admin' 
                      ? 'bg-red-700 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إدارة' : 'Admin'}</span>
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {loginRole === 'admin' 
                      ? (language === 'ar' ? 'بريد المسؤول المعتمد' : 'Email administrateur') 
                      : (language === 'ar' ? 'البريد الإلكتروني أو رقم الهاتف' : 'Email ou Numéro de téléphone')}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={loginRole === 'admin' ? 'ibrahimaitaddimane@gmail.com' : '06XXXXXXXX / exemple@email.com'}
                      dir="ltr"
                      className="w-full text-xs font-medium py-2.5 pr-10 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none transition-all placeholder:text-slate-400 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      dir="ltr"
                      className="w-full text-xs font-medium py-2.5 pr-10 pl-10 rtl:pr-10 rtl:pl-10 ltr:pl-10 ltr:pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none transition-all text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-extrabold text-sm shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 cursor-pointer transition-all group mt-2"
                >
                  <span>{language === 'ar' ? 'تسجيل الدخول للمتابعة' : 'Se connecter pour continuer'}</span>
                  {language === 'ar' ? (
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </form>

              {/* Guest browsing alternative */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onContinueAsGuest}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <span>{language === 'ar' ? 'أو تصفح خدمات ودليل الدروة كزائر' : 'Ou continuer en tant que visiteur'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Signup Mode with 5 Account Types: Client, Provider, Clinic, Lab, Center */
            <div className="space-y-4">
              <div className="text-center">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {language === 'ar' ? 'إنشاء حساب جديد بالدروة' : 'Créer un nouveau compte'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ar' 
                    ? 'اختر نوع الحساب المناسب لك للتسجيل في دليل ومنصة الدروة' 
                    : 'Sélectionnez le type de compte correspondant à votre activité'}
                </p>
              </div>

              {signupSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'ar' ? 'تم إنشاء الحساب وإضافته بنجاح! جاري الدخول...' : 'Compte créé avec succès ! Redirection en cours...'}</span>
                </div>
              )}

              {/* 5 Account Type Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSignupType('client')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    signupType === 'client' 
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-xs' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <User className="w-4 h-4 mx-auto text-teal-700 mb-1" />
                  <span className="block text-xs font-black text-slate-900">
                    {language === 'ar' ? 'زبون' : 'Client'}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {language === 'ar' ? 'طلب الخدمات' : 'Particulier'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignupType('provider')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    signupType === 'provider' 
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-xs' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <Wrench className="w-4 h-4 mx-auto text-teal-700 mb-1" />
                  <span className="block text-xs font-black text-slate-900">
                    {language === 'ar' ? 'حرفي / مهني' : 'Artisan'}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {language === 'ar' ? 'تقديم المهن' : 'Services'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignupType('clinic')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    signupType === 'clinic' 
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-xs' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 mx-auto text-teal-700 mb-1" />
                  <span className="block text-xs font-black text-slate-900">
                    {language === 'ar' ? 'عيادة طبية' : 'Clinique'}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {language === 'ar' ? 'ذكر التخصص' : 'Cabinet médical'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignupType('lab')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    signupType === 'lab' 
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-xs' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <FlaskConical className="w-4 h-4 mx-auto text-teal-700 mb-1" />
                  <span className="block text-xs font-black text-slate-900">
                    {language === 'ar' ? 'مختبر تحاليل' : 'Laboratoire'}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {language === 'ar' ? 'التحاليل والأثمنة' : 'Analyses & Tarifs'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSignupType('center')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer sm:col-span-2 ${
                    signupType === 'center' 
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-xs' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto text-teal-700 mb-1" />
                  <span className="block text-xs font-black text-slate-900">
                    {language === 'ar' ? 'مركز صحي / تشخيصي' : 'Centre Médical'}
                  </span>
                  <span className="block text-[10px] text-slate-500">
                    {language === 'ar' ? 'ترويض، أشعة، تصفية كلى' : 'Rééducation, Radio'}
                  </span>
                </button>
              </div>

              {/* 1. PROVIDER SIGNUP REDIRECT */}
              {signupType === 'provider' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3 animate-in fade-in">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {language === 'ar' 
                      ? 'لتسجيل حرفتك أو مهنتك بالدروة (سباكة، كهرباء، صباغة، سيارات، إلخ)، ستفتح لك استمارة التسجيل الرسمية للحرفيين لملء معلوماتك وبطاقتك المهنية.'
                      : 'Pour enregistrer votre activité d\'artisan à Deroua, vous allez être redirigé vers le formulaire officiel d\'inscription.'}
                  </p>
                  <button
                    type="button"
                    onClick={onOpenArtisanJoin}
                    className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>{language === 'ar' ? 'متابعة استمارة تسجيل الحرفي' : 'Continuer vers l\'inscription artisan'}</span>
                  </button>
                </div>
              )}

              {/* 2. CLIENT SIGNUP FORM */}
              {signupType === 'client' && (
                <form onSubmit={handleClientSignupSubmit} className="space-y-3 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder={language === 'ar' ? 'محمد بناني' : 'Mohammed Bennani'}
                      className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'رقم الهاتف' : 'Numéro de téléphone'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="0612345678"
                      dir="ltr"
                      className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (optionnel)'}
                    </label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@exemple.com"
                      dir="ltr"
                      className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                    </label>
                    <div className="relative">
                      <input
                        type={showClientPassword ? 'text' : 'password'}
                        required
                        value={clientPassword}
                        onChange={(e) => setClientPassword(e.target.value)}
                        placeholder="••••••••"
                        dir="ltr"
                        className="w-full text-xs font-medium py-2.5 pr-10 pl-10 rtl:pr-3 rtl:pl-10 ltr:pl-3 ltr:pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowClientPassword(!showClientPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-slate-400 hover:text-slate-600 p-1"
                      >
                        {showClientPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'تأكيد إنشاء حساب زبون' : 'Créer mon compte client'}</span>
                  </button>
                </form>
              )}

              {/* 3. CLINIC SIGNUP FORM (مع ذكر التخصص) */}
              {signupType === 'clinic' && (
                <form onSubmit={handleClinicSignupSubmit} className="space-y-3 animate-in fade-in">
                  <div className="bg-teal-50/50 p-2.5 rounded-xl border border-teal-200/80 text-xs text-teal-800 font-bold flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>{language === 'ar' ? 'تسجيل عيادة طبية مع تحديد التخصص للظهور في الدليل الصحي للدروة' : 'Inscription d\'un cabinet médical avec spécialité'}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'اسم العيادة الطبية' : 'Nom du cabinet / clinique'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: عيادة د. محمد العلمي' : 'Ex: Cabinet Dr. El Alami'}
                      className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none text-slate-900"
                    />
                  </div>

                  {/* SPECIALTY (ذكر التخصص) */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                      <span>{language === 'ar' ? 'التخصص الطبي للعيادة *' : 'Spécialité Médicale *'}</span>
                    </label>
                    <select
                      value={clinicSpecialty}
                      onChange={(e) => setClinicSpecialty(e.target.value)}
                      className="w-full text-xs font-bold py-2.5 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none text-slate-900"
                    >
                      {CLINIC_SPECIALTIES.map(s => (
                        <option key={s.ar} value={s.ar}>
                          {language === 'ar' ? s.ar : s.fr}
                        </option>
                      ))}
                    </select>

                    {(clinicSpecialty === 'تخصص آخر...' || clinicSpecialty === 'Autre spécialité...') && (
                      <input
                        type="text"
                        required
                        value={clinicCustomSpecialty}
                        onChange={(e) => setClinicCustomSpecialty(e.target.value)}
                        placeholder={language === 'ar' ? 'اكتب التخصص الطبي هنا (مثال: طب وجراحة الأورام)' : 'Précisez la spécialité médicale'}
                        className="w-full text-xs font-medium py-2 px-3 bg-white border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-600 outline-none text-slate-900"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'اسم الطبيب(ة) المشرف(ة)' : 'Médecin responsable'}
                      </label>
                      <input
                        type="text"
                        value={clinicDoctorName}
                        onChange={(e) => setClinicDoctorName(e.target.value)}
                        placeholder={language === 'ar' ? 'د. كريم الوزاني' : 'Dr. Karim Ouazzani'}
                        className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'رقم الهاتف للتواصل وحجز المواعيد' : 'Numéro de téléphone'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={clinicPhone}
                        onChange={(e) => setClinicPhone(e.target.value)}
                        placeholder="0522XXXXXX / 06XXXXXXXX"
                        dir="ltr"
                        className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'العنوان بالدروة' : 'Adresse à Deroua'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      placeholder={language === 'ar' ? 'تجزئة الوفاء، عمارة 3، الطابق 1، الدروة' : 'Lotissement Al Wafaa, Deroua'}
                      className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'أوقات العمل' : 'Horaires de travail'}
                    </label>
                    <input
                      type="text"
                      value={clinicWorkHours}
                      onChange={(e) => setClinicWorkHours(e.target.value)}
                      placeholder="الإثنين - الجمعة: 09:00 - 18:00"
                      className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'كلمة المرور لحساب العيادة' : 'Mot de passe du compte'} *
                    </label>
                    <input
                      type="password"
                      required
                      value={clinicPassword}
                      onChange={(e) => setClinicPassword(e.target.value)}
                      placeholder="••••••••"
                      dir="ltr"
                      className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600/30 focus:border-teal-600 outline-none text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إنشاء حساب العيادة وإدراجها في الدليل' : 'Enregistrer le cabinet médical'}</span>
                  </button>
                </form>
              )}

              {/* 4. LAB SIGNUP FORM (تحديد الفحوصات والتحاليل وأثمنتها) */}
              {signupType === 'lab' && (
                <form onSubmit={handleLabSignupSubmit} className="space-y-3.5 animate-in fade-in">
                  <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200 text-xs text-indigo-900 font-bold flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-indigo-700 shrink-0" />
                    <span>{language === 'ar' ? 'تسجيل مختبر تحاليل طبية مع تحديد لائحة الفحوصات وأثمنتها بالدرهم' : 'Inscription du laboratoire avec définition des analyses et tarifs'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'اسم المختبر' : 'Nom du laboratoire'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={labName}
                        onChange={(e) => setLabName(e.target.value)}
                        placeholder={language === 'ar' ? 'مثال: مختبر الدروة للتحاليل الطبية' : 'Laboratoire d\'analyses Deroua'}
                        className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'الصيدلي البيولوجي المشرف' : 'Biologiste responsable'}
                      </label>
                      <input
                        type="text"
                        value={labDoctorName}
                        onChange={(e) => setLabDoctorName(e.target.value)}
                        placeholder={language === 'ar' ? 'د. نادية بنجلون' : 'Dr. Nadia Benjelloun'}
                        className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'رقم الهاتف للتواصل' : 'Numéro de téléphone'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={labPhone}
                        onChange={(e) => setLabPhone(e.target.value)}
                        placeholder="0522XXXXXX"
                        dir="ltr"
                        className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'العنوان بالدروة' : 'Adresse'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={labAddress}
                        onChange={(e) => setLabAddress(e.target.value)}
                        placeholder={language === 'ar' ? 'شارع الحسن الثاني، الدروة' : 'Avenue Hassan II, Deroua'}
                        className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Home sampling toggle */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {language === 'ar' ? 'خدمة أخذ العينات بالمنزل' : 'Prélèvement à domicile'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {language === 'ar' ? 'توفير ممرض للتنقل لمنازل كبار السن والمرضى' : 'Disponible pour personnes âgées et patients'}
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={labHomeSampling} 
                        onChange={(e) => setLabHomeSampling(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>

                  {/* LABORATORY TESTS & PRICES SECTION (تحديد الفحوصات والتحاليل وأثمنتها) */}
                  <div className="p-3.5 bg-indigo-50/40 rounded-2xl border border-indigo-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-indigo-700" />
                        <h4 className="text-xs font-black text-indigo-950">
                          {language === 'ar' ? 'تحديد الفحوصات والتحاليل الطبية وأثمنتها (DH)' : 'Analyses médicales & Tarifs en DH'}
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                        {labTestsList.filter(t => t.selected).length} {language === 'ar' ? 'تحليل مفعل' : 'sélectionnés'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600">
                      {language === 'ar' 
                        ? 'يمكنك تفعيل أو إلغاء أي تحليل، وتعديل ثمنه بالدرهم كما يقدمه مختبركم، كما يمكنك إضافة تحاليل أخرى:' 
                        : 'Cochez les analyses proposées et ajustez les prix en Dirhams (DH) :'}
                    </p>

                    {/* Scrollable tests checklist with price editors */}
                    <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 divide-y divide-indigo-100/60">
                      {labTestsList.map(test => (
                        <div key={test.id} className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 text-xs bg-white p-2 rounded-xl border border-indigo-100/80 shadow-2xs">
                          <label className="flex items-center gap-2 flex-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={test.selected}
                              onChange={() => handleToggleLabTest(test.id)}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                            />
                            <span className={`font-bold ${test.selected ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                              {language === 'ar' ? test.name : test.nameFr}
                            </span>
                          </label>

                          <div className="flex items-center gap-1 shrink-0">
                            <input
                              type="number"
                              min="0"
                              disabled={!test.selected}
                              value={test.price}
                              onChange={(e) => handleUpdateLabTestPrice(test.id, parseFloat(e.target.value) || 0)}
                              className="w-16 text-xs font-black text-center py-1 px-1.5 bg-indigo-50/70 border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-40 text-indigo-900"
                            />
                            <span className="text-[10px] font-bold text-slate-500">DH</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Custom Test Box */}
                    <div className="pt-2 border-t border-indigo-100">
                      <div className="text-[11px] font-bold text-indigo-900 mb-1.5 flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{language === 'ar' ? 'إضافة تحليل طبي مخصص جديد:' : 'Ajouter une analyse spécifique :'}</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customTestName}
                          onChange={(e) => setCustomTestName(e.target.value)}
                          placeholder={language === 'ar' ? 'اسم التحليل (مثال: Bilan Hormonal)' : 'Nom de l\'analyse'}
                          className="flex-1 text-xs py-1.5 px-2.5 bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <input
                          type="number"
                          value={customTestPrice}
                          onChange={(e) => setCustomTestPrice(e.target.value)}
                          placeholder="الثمن DH"
                          className="w-20 text-xs py-1.5 px-2 bg-white border border-indigo-200 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomLabTest}
                          className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
                        >
                          {language === 'ar' ? 'إضافة' : 'Ajouter'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'كلمة المرور لإدارة حساب المختبر' : 'Mot de passe du compte'} *
                    </label>
                    <input
                      type="password"
                      required
                      value={labPassword}
                      onChange={(e) => setLabPassword(e.target.value)}
                      placeholder="••••••••"
                      dir="ltr"
                      className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 outline-none text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs shadow-md shadow-indigo-900/10 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إنشاء حساب المختبر وحفظ الفحوصات والأسعار' : 'Enregistrer le laboratoire et ses tarifs'}</span>
                  </button>
                </form>
              )}

              {/* 5. CENTER SIGNUP FORM (مركز صحي / تشخيصي / ترويض) */}
              {signupType === 'center' && (
                <form onSubmit={handleCenterSignupSubmit} className="space-y-3.5 animate-in fade-in">
                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{language === 'ar' ? 'تسجيل مركز صحي، ترويض طبي، أشعة، أو تشخيص' : 'Inscription d\'un centre de santé, kinésithérapie, ou radiologie'}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'اسم المركز' : 'Nom du centre'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={centerName}
                      onChange={(e) => setCenterName(e.target.value)}
                      placeholder={language === 'ar' ? 'مثال: مركز الدروة للترويض الطبي والفيزيائي' : 'Ex: Centre de kinésithérapie Deroua'}
                      className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 outline-none text-slate-900"
                    />
                  </div>

                  {/* CENTER TYPE & SPECIALTY */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-black text-slate-900">
                      {language === 'ar' ? 'نوع وتخصص المركز *' : 'Type et spécialité du centre *'}
                    </label>
                    <select
                      value={centerType}
                      onChange={(e) => setCenterType(e.target.value)}
                      className="w-full text-xs font-bold py-2.5 px-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 outline-none text-slate-900"
                    >
                      {CENTER_TYPES.map(t => (
                        <option key={t.ar} value={t.ar}>
                          {language === 'ar' ? t.ar : t.fr}
                        </option>
                      ))}
                    </select>

                    {(centerType === 'نوع آخر...' || centerType === 'Autre type de centre...') && (
                      <input
                        type="text"
                        required
                        value={centerCustomType}
                        onChange={(e) => setCenterCustomType(e.target.value)}
                        placeholder={language === 'ar' ? 'حدد نوع المركز هنا' : 'Précisez le type de centre'}
                        className="w-full text-xs font-medium py-2 px-3 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-600 outline-none text-slate-900"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'المشرف أو المسؤول' : 'Responsable'}
                      </label>
                      <input
                        type="text"
                        value={centerDirectorName}
                        onChange={(e) => setCenterDirectorName(e.target.value)}
                        placeholder={language === 'ar' ? 'الأخصائي أو الدكتور المسؤول' : 'Responsable du centre'}
                        className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 outline-none text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {language === 'ar' ? 'رقم الهاتف للتواصل' : 'Numéro de téléphone'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={centerPhone}
                        onChange={(e) => setCenterPhone(e.target.value)}
                        placeholder="0522XXXXXX"
                        dir="ltr"
                        className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 outline-none text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'العنوان بالدروة' : 'Adresse à Deroua'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={centerAddress}
                      onChange={(e) => setCenterAddress(e.target.value)}
                      placeholder={language === 'ar' ? 'شارع محمد الخامس، الدروة' : 'Avenue Mohammed V, Deroua'}
                      className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 outline-none text-slate-900"
                    />
                  </div>

                  {/* CENTER SERVICES & PRICES */}
                  <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-950">
                        {language === 'ar' ? 'الخدمات والفحوصات المقدمة وأثمنتها (DH):' : 'Services proposés et tarifs (DH) :'}
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {centerServices.map(service => (
                        <div key={service.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-200 text-xs shadow-2xs">
                          <span className="font-bold text-slate-800">{service.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md">
                              {service.price} DH
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCenterService(service.id)}
                              className="text-slate-400 hover:text-red-600 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add service form */}
                    <div className="flex gap-2 pt-1 border-t border-amber-200/60">
                      <input
                        type="text"
                        value={customCenterServiceName}
                        onChange={(e) => setCustomCenterServiceName(e.target.value)}
                        placeholder={language === 'ar' ? 'اسم الخدمة أو الفحص' : 'Nom du service'}
                        className="flex-1 text-xs py-1.5 px-2 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <input
                        type="number"
                        value={customCenterServicePrice}
                        onChange={(e) => setCustomCenterServicePrice(e.target.value)}
                        placeholder="الثمن DH"
                        className="w-20 text-xs py-1.5 px-2 bg-white border border-amber-300 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomCenterService}
                        className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
                      >
                        {language === 'ar' ? 'إضافة' : 'Ajouter'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {language === 'ar' ? 'كلمة المرور لإدارة حساب المركز' : 'Mot de passe du centre'} *
                    </label>
                    <input
                      type="password"
                      required
                      value={centerPassword}
                      onChange={(e) => setCenterPassword(e.target.value)}
                      placeholder="••••••••"
                      dir="ltr"
                      className="w-full text-xs font-medium py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 outline-none text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs shadow-md shadow-amber-900/10 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إنشاء حساب المركز وإدراجه في الدليل' : 'Enregistrer le centre médical'}</span>
                  </button>
                </form>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Bottom of Login Screen - ONLY Deroua Directory as explicitly requested */}
      <div className="max-w-md w-full mx-auto text-center z-10 py-3">
        {onOpenDirectory && (
          <button
            type="button"
            onClick={onOpenDirectory}
            id="welcome-open-directory-btn"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white text-xs font-black shadow-md shadow-teal-900/10 border border-teal-700 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-teal-200" />
            <span>{language === 'ar' ? 'تصفح دليل الدروة الشامل (العيادات، الصيدليات والمختبرات)' : 'Consulter l\'annuaire complet de Deroua'}</span>
          </button>
        )}
      </div>

    </div>
  );
};
