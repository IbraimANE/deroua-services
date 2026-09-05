import React from 'react';
import { UserRole, Language } from '../types';
import { t } from '../translations';
import { 
  BookOpen, 
  Clock, 
  ShieldCheck, 
  Languages, 
  MessageSquareWarning,
  User,
  Wrench,
  Building2,
  Lock,
  LogIn,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  onLanguageToggle: () => void;
  onOpenDirectory: () => void;
  onOpenComplaints: () => void;
  onOpenRequests: () => void;
  pendingRequestsCount: number;
  isAdminAuthenticated?: boolean;
  onOpenAuthScreen?: () => void;
  currentUser?: { userName: string; userType: UserRole; isGuest?: boolean } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageToggle,
  onOpenDirectory,
  onOpenComplaints,
  onOpenRequests,
  pendingRequestsCount,
  isAdminAuthenticated,
  onOpenAuthScreen,
  currentUser
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand with Requested Image */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onRoleChange('client')}
              className="cursor-pointer flex items-center gap-2.5 sm:gap-3 group"
            >
              <div className="p-1 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center">
                <img 
                  src="/deroua_logo.jpg" 
                  alt="Deroua Services Logo" 
                  className="h-9 sm:h-11 w-auto object-contain rounded-lg"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg sm:text-2xl text-slate-900 tracking-tight">
                    {language === 'ar' ? 'خدمات الدروة' : 'Deroua Services'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                    الدروة
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden sm:block">
                  {language === 'ar' ? 'منصة الحرفيين ودليل المدينة الشامل' : 'Portail des services & artisans de Deroua'}
                </p>
              </div>
            </div>
          </div>

          {/* Center / Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Comprehensive Directory Button */}
            <button
              onClick={onOpenDirectory}
              id="open-directory-btn"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs sm:text-sm font-bold border border-teal-200 transition-colors shadow-xs"
              title={t('directoryTitle', language)}
            >
              <BookOpen className="w-4 h-4 text-teal-700 shrink-0" />
              <span className="hidden md:inline">{t('directoryTitle', language)}</span>
              <span className="md:hidden">{language === 'ar' ? 'الدليل' : 'Guide'}</span>
            </button>

            {/* My Requests Button */}
            <button
              onClick={onOpenRequests}
              id="my-requests-btn"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors"
            >
              <Clock className="w-4 h-4 text-slate-600 shrink-0" />
              <span>{t('myRequests', language)}</span>
              {pendingRequestsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            {/* Complaints Button */}
            <button
              onClick={onOpenComplaints}
              id="complaint-btn"
              className="p-2 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-slate-100 transition-colors"
              title={t('complaintsTooltip', language)}
            >
              <MessageSquareWarning className="w-5 h-5" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={onLanguageToggle}
              id="lang-toggle-btn"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              title="تغيير اللغة / Changer la langue"
            >
              <Languages className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'ar' ? 'FR' : 'عربي'}</span>
            </button>

            {/* Auth / Account Profile Button */}
            {onOpenAuthScreen && (
              <button
                onClick={onOpenAuthScreen}
                id="auth-profile-btn"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                  currentUser && !currentUser.isGuest
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                    : 'bg-teal-700 hover:bg-teal-800 text-white'
                }`}
                title={language === 'ar' ? 'حساب المستخدم / تسجيل الدخول' : 'Compte utilisateur'}
              >
                {currentUser && !currentUser.isGuest ? (
                  <>
                    <User className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span className="max-w-[75px] sm:max-w-[120px] truncate">{currentUser.userName}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5 shrink-0" />
                    <span>{language === 'ar' ? 'تسجيل الدخول' : 'Connexion'}</span>
                  </>
                )}
              </button>
            )}

            {/* Role Switcher Pills */}
            <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => onRoleChange('client')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentRole === 'client' 
                    ? 'bg-white text-teal-800 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                {t('roleClient', language)}
              </button>

              <button
                onClick={() => onRoleChange('provider')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentRole === 'provider' 
                    ? 'bg-white text-teal-800 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                {t('roleProvider', language)}
              </button>

              <button
                onClick={() => onRoleChange('company')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentRole === 'company' 
                    ? 'bg-white text-teal-800 shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                {t('roleCompany', language)}
              </button>

              <button
                onClick={() => onRoleChange('admin')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  currentRole === 'admin' 
                    ? 'bg-red-700 text-white shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={isAdminAuthenticated ? (language === 'ar' ? 'المسؤول متصل' : 'Admin connecté') : (language === 'ar' ? 'محمي بكلمة مرور' : 'Protégé par mot de passe')}
              >
                {isAdminAuthenticated ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-red-500" />
                )}
                <span>{t('roleAdmin', language)}</span>
                {isAdminAuthenticated && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </button>
            </div>

            {/* Mobile Role Switcher Select */}
            <div className="lg:hidden">
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="text-xs font-bold py-1.5 px-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-teal-500"
              >
                <option value="client">{t('roleClient', language)}</option>
                <option value="provider">{t('roleProvider', language)}</option>
                <option value="company">{t('roleCompany', language)}</option>
                <option value="admin">
                  {isAdminAuthenticated ? `✅ ${t('roleAdmin', language)}` : `🔒 ${t('roleAdmin', language)}`}
                </option>
              </select>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
