import React, { useState } from 'react';
import { ShieldAlert, Lock, Mail, Eye, EyeOff, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: Language;
}

const AUTHORIZED_EMAIL = 'ibrahimaitaddimane@gmail.com';
const AUTHORIZED_PASSWORD = 'azertyuiop123456789@';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (cleanEmail === AUTHORIZED_EMAIL.toLowerCase() && cleanPassword === AUTHORIZED_PASSWORD) {
        setIsLoading(false);
        onSuccess();
      } else {
        setIsLoading(false);
        if (cleanEmail !== AUTHORIZED_EMAIL.toLowerCase()) {
          setErrorMessage(
            language === 'ar'
              ? 'البريد الإلكتروني المدخل غير مسجل كمسؤول للنظام.'
              : 'Cet email n\'est pas autorisé pour l\'administration.'
          );
        } else {
          setErrorMessage(
            language === 'ar'
              ? 'الرقم السري غير صحيح. يرجى التأكد من كلمة المرور.'
              : 'Mot de passe administrateur incorrect.'
          );
        }
      }
    }, 300);
  };

  const BackArrow = language === 'ar' ? ArrowRight : ArrowLeft;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Banner */}
        <div className="bg-gradient-to-r from-red-800 via-red-700 to-slate-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title={language === 'ar' ? 'إغلاق' : 'Fermer'}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-3 shadow-inner">
            <Lock className="w-7 h-7 text-red-200" />
          </div>

          <h2 className="text-lg font-black tracking-wide">
            {language === 'ar' ? 'فضاء الإدارة المحمي' : 'Espace Administrateur Sécurisé'}
          </h2>
          <p className="text-xs text-red-100/80 mt-1 max-w-xs mx-auto">
            {language === 'ar' 
              ? 'الوصول إلى هذه اللوحة خاص بمسؤول منصة خدمات الدروة فقط' 
              : 'Accès strictement réservé à l\'administrateur de la plateforme'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-semibold">{errorMessage}</div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {language === 'ar' ? 'البريد الإلكتروني للمسؤول' : 'Email administrateur'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ibrahimaitaddimane@gmail.com"
                dir="ltr"
                className="w-full text-xs font-medium py-3 pr-10 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600/30 focus:border-red-600 outline-none transition-all placeholder:text-slate-400 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {language === 'ar' ? 'الرقم السري (كلمة المرور)' : 'Mot de passe'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                dir="ltr"
                className="w-full text-xs font-medium py-3 pr-10 pl-10 rtl:pr-10 rtl:pl-10 ltr:pl-10 ltr:pr-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-600/30 focus:border-red-600 outline-none transition-all text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? 'إخفاء' : 'إظهار'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-bold text-xs shadow-md shadow-red-900/10 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span>{language === 'ar' ? 'جارٍ التحقق...' : 'Vérification...'}</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الدخول إلى لوحة الإدارة' : 'Accéder à l\'administration'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <BackArrow className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إلغاء' : 'Annuler'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              {language === 'ar' 
                ? 'الحساب المصرح له: ibrahimaitaddimane@gmail.com' 
                : 'Compte autorisé : ibrahimaitaddimane@gmail.com'}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
