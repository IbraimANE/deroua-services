import React, { useState, useEffect } from 'react';
import { UserRole, Language, Provider, ServiceRequest, DirectoryItem } from './types';
import { initialProviders, initialDirectory, initialRequests } from './data/initialData';
import { Navbar } from './components/Navbar';
import { ClientHome } from './components/ClientHome';
import { ProviderDashboard } from './components/ProviderDashboard';
import { CompanyDashboard } from './components/CompanyDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DirectoryModal } from './components/DirectoryModal';
import { ProviderDetailsModal } from './components/ProviderDetailsModal';
import { RequestServiceModal } from './components/RequestServiceModal';
import { RateProviderModal } from './components/RateProviderModal';
import { ComplaintsModal } from './components/ComplaintsModal';
import { NewProviderModal } from './components/NewProviderModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { WelcomeAuthScreen } from './components/WelcomeAuthScreen';
import { CheckCircle2, Info, Lock, BookOpen } from 'lucide-react';

export default function App() {
  // Persistence for Providers with automatic cleanup of old mock data
  const [providers, setProviders] = useState<Provider[]>(() => {
    if (!localStorage.getItem('deroua_v2_clean_init')) {
      localStorage.removeItem('deroua_providers');
      localStorage.removeItem('deroua_requests');
      localStorage.setItem('deroua_v2_clean_init', 'true');
      return [];
    }
    const saved = localStorage.getItem('deroua_providers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialProviders;
  });

  // Persistence for Directory - Cleaned all mock clinics, labs, and centers as requested
  const [directoryItems, setDirectoryItems] = useState<DirectoryItem[]>(() => {
    const cleanKey = 'deroua_directory_v5_clean';
    const saved = localStorage.getItem(cleanKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Remove old mock clinics and labs
    localStorage.removeItem('deroua_directory');
    localStorage.setItem(cleanKey, JSON.stringify(initialDirectory));
    return initialDirectory;
  });

  // Persistence for Requests
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('deroua_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return initialRequests;
  });

  // User Authentication & Welcome Screen State
  const [currentUser, setCurrentUser] = useState<{
    userName: string;
    userType: UserRole;
    email?: string;
    phone?: string;
    isGuest?: boolean;
  } | null>(() => {
    const saved = localStorage.getItem('deroua_user_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return null;
  });

  const [isWelcomeAuthVisible, setIsWelcomeAuthVisible] = useState<boolean>(() => {
    return !localStorage.getItem('deroua_user_session');
  });

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('deroua_admin_auth') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Role & Language
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = (localStorage.getItem('deroua_role') as UserRole) || 'client';
    // If previously saved as admin but session is not authenticated, revert to client
    if (saved === 'admin' && localStorage.getItem('deroua_admin_auth') !== 'true') {
      return 'client';
    }
    return saved;
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('deroua_lang') as Language) || 'ar';
  });

  // Active sub-views & modals
  const [clientSubView, setClientSubView] = useState<'browse' | 'myRequests'>('browse');
  const [activeProviderId, setActiveProviderId] = useState<string>(providers[0]?.id || 'prov-1');

  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isComplaintsOpen, setIsComplaintsOpen] = useState(false);
  const [isNewJoinOpen, setIsNewJoinOpen] = useState(false);
  const [selectedProviderForDetails, setSelectedProviderForDetails] = useState<Provider | null>(null);
  const [selectedProviderForRequest, setSelectedProviderForRequest] = useState<Provider | null>(null);
  const [selectedRequestForRating, setSelectedRequestForRating] = useState<ServiceRequest | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('deroua_providers', JSON.stringify(providers));
  }, [providers]);

  useEffect(() => {
    localStorage.setItem('deroua_directory_v5_clean', JSON.stringify(directoryItems));
    localStorage.setItem('deroua_directory', JSON.stringify(directoryItems));
  }, [directoryItems]);

  useEffect(() => {
    localStorage.setItem('deroua_requests', JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  useEffect(() => {
    localStorage.setItem('deroua_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('deroua_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Handlers
  const handleToggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'fr' : 'ar'));
  };

  // Request creation
  const handleSubmitServiceRequest = (details: {
    clientName: string;
    clientPhone: string;
    clientLocation: string;
    description: string;
  }) => {
    if (!selectedProviderForRequest) return;

    const newReq: ServiceRequest = {
      id: 'req-' + Date.now(),
      clientId: 'client-user',
      clientName: details.clientName,
      clientPhone: details.clientPhone,
      clientLocation: details.clientLocation,
      providerId: selectedProviderForRequest.id,
      providerName: selectedProviderForRequest.businessName,
      category: selectedProviderForRequest.category,
      status: 'Pending',
      createdAt: language === 'ar' ? 'الآن' : 'À l\'instant',
      description: details.description
    };

    setServiceRequests(prev => [newReq, ...prev]);
    showToast(
      language === 'ar' 
        ? `تم إرسال طلبك إلى ${selectedProviderForRequest.businessName} بنجاح!` 
        : `Demande envoyée avec succès à ${selectedProviderForRequest.businessName} !`
    );
  };

  // Update request status (e.g. from provider dashboard)
  const handleUpdateRequestStatus = (requestId: string, newStatus: ServiceRequest['status']) => {
    setServiceRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req)
    );
    showToast(
      language === 'ar' 
        ? `تم تحديث حالة الطلب إلى "${newStatus}"` 
        : `Statut de la demande mis à jour (${newStatus})`
    );
  };

  // Rating submission
  const handleSubmitRating = (requestId: string, ratingScore: number, reviewText: string) => {
    // Update request
    setServiceRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, rating: ratingScore, reviewText } : req)
    );

    // Update provider rating average
    const targetReq = serviceRequests.find(r => r.id === requestId);
    if (targetReq) {
      setProviders(prev => prev.map(p => {
        if (p.id === targetReq.providerId) {
          const newCount = p.reviewCount + 1;
          const newRating = Number(((p.rating * p.reviewCount + ratingScore) / newCount).toFixed(1));
          return { ...p, rating: newRating, reviewCount: newCount };
        }
        return p;
      }));
    }

    showToast(language === 'ar' ? 'شكراً لتقييمك! تم تحديث تقييم الحرفي.' : 'Merci pour votre évaluation !');
  };

  // Update provider profile
  const handleUpdateProviderProfile = (updatedProvider: Provider) => {
    setProviders(prev => prev.map(p => p.id === updatedProvider.id ? updatedProvider : p));
  };

  // Admin: Toggle verified blue badge
  const handleToggleVerifiedBadge = (providerId: string) => {
    setProviders(prev => prev.map(p => {
      if (p.id === providerId) {
        const newStatus = p.status === 'verified' ? 'active' : 'verified';
        showToast(
          newStatus === 'verified'
            ? `تم منح العلامة الزرقاء 🔵 لـ ${p.businessName}`
            : `تم سحب العلامة الزرقاء من ${p.businessName}`
        );
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  // Admin: Approve / Reject / Delete provider
  const handleApproveProvider = (providerId: string) => {
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, status: 'active' } : p));
    showToast(language === 'ar' ? 'تم قبول الحساب وتفعيله بنجاح ✅' : 'Compte validé avec succès ✅');
  };

  const handleRejectProvider = (providerId: string) => {
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, status: 'rejected' } : p));
    showToast(language === 'ar' ? 'تم رفض طلب الانضمام' : 'Demande refusée');
  };

  const handleDeleteProvider = (providerId: string) => {
    setProviders(prev => prev.filter(p => p.id !== providerId));
    showToast(language === 'ar' ? 'تم حذف الحرفي من المنصة' : 'Prestataire supprimé');
  };

  const handleClearAllProviders = () => {
    setProviders([]);
    localStorage.removeItem('deroua_providers');
    showToast(language === 'ar' ? 'تم إفراغ قائمة الحرفيين بالكامل' : 'Liste des prestataires entièrement vidée');
  };

  const handleClearAllRequests = () => {
    setServiceRequests([]);
    localStorage.removeItem('deroua_requests');
    showToast(language === 'ar' ? 'تم مسح سجل الطلبات' : 'Historique des demandes effacé');
  };

  // Directory item handlers
  const handleUpdateDirectoryItem = (updated: DirectoryItem) => {
    setDirectoryItems(prev => prev.map(d => d.id === updated.id ? updated : d));
  };

  const handleAddDirectoryItem = (newItem: DirectoryItem) => {
    setDirectoryItems(prev => [newItem, ...prev]);
    showToast(language === 'ar' ? 'تمت إضافة جهة الاتصال إلى دليل الدروة' : 'Ajouté à l\'annuaire');
  };

  const handleDeleteDirectoryItem = (id: string) => {
    setDirectoryItems(prev => prev.filter(d => d.id !== id));
    showToast(language === 'ar' ? 'تم الحذف من دليل الدروة' : 'Supprimé de l\'annuaire');
  };

  const handleRegisterEstablishment = (newItem: DirectoryItem) => {
    handleAddDirectoryItem(newItem);
    showToast(
      language === 'ar' 
        ? `تم تسجيل ${newItem.name} بنجاح وإدراجها في دليل الدروة!` 
        : `${newItem.name} a été enregistré avec succès !`
    );
  };

  const handleClearMedicalDirectory = () => {
    setDirectoryItems(prev => prev.filter(d => d.category === 'emergency'));
    showToast(
      language === 'ar' 
        ? 'تم مسح جميع معطيات العيادات، المختبرات والمراكز' 
        : 'Toutes les cliniques, laboratoires et centres ont été vidés'
    );
  };

  // Self-register new provider
  const handleRegisterNewProvider = (newProv: Provider) => {
    setProviders(prev => [newProv, ...prev]);
  };

  // Role Switch Handler with Admin Protection
  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === 'admin') {
      if (!isAdminAuthenticated) {
        setIsAdminLoginModalOpen(true);
        return;
      }
    }
    setCurrentRole(newRole);
  };

  const handleAuthSuccess = (session: {
    userType: UserRole;
    userName: string;
    email?: string;
    phone?: string;
  }) => {
    const userSession = {
      ...session,
      isGuest: false
    };
    setCurrentUser(userSession);
    localStorage.setItem('deroua_user_session', JSON.stringify(userSession));
    setIsWelcomeAuthVisible(false);

    if (session.userType === 'admin') {
      setIsAdminAuthenticated(true);
      localStorage.setItem('deroua_admin_auth', 'true');
      setCurrentRole('admin');
      showToast(
        language === 'ar' 
          ? 'مرحباً بك! تم تسجيل الدخول كمسؤول للمنصة بنجاح' 
          : 'Connecté en tant qu\'administrateur'
      );
    } else {
      setCurrentRole(session.userType);
      showToast(
        language === 'ar' 
          ? `مرحباً بك ${session.userName} في منصة خدمات الدروة!` 
          : `Bienvenue ${session.userName} sur Deroua Services !`
      );
    }
  };

  const handleContinueAsGuest = () => {
    const guestSession = {
      userName: language === 'ar' ? 'زائر' : 'Visiteur',
      userType: 'client' as UserRole,
      isGuest: true
    };
    setCurrentUser(guestSession);
    localStorage.setItem('deroua_user_session', JSON.stringify(guestSession));
    setIsWelcomeAuthVisible(false);
    setCurrentRole('client');
  };

  const handleFullLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('deroua_user_session');
    setIsAdminAuthenticated(false);
    localStorage.removeItem('deroua_admin_auth');
    setCurrentRole('client');
    setIsWelcomeAuthVisible(true);
    showToast(language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Déconnexion réussie');
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('deroua_admin_auth', 'true');
    setIsAdminLoginModalOpen(false);
    setCurrentRole('admin');
    showToast(
      language === 'ar'
        ? 'مرحباً بك! تم تسجيل الدخول كمسؤول للمنصة بنجاح'
        : 'Connecté avec succès en tant qu\'administrateur'
    );
  };

  const handleAdminLogout = () => {
    handleFullLogout();
  };

  // Count pending requests for client badge
  const pendingRequestsCount = serviceRequests.filter(r => r.status === 'Pending').length;

  // Render Welcome/Auth Screen if not logged in or requested
  if (isWelcomeAuthVisible) {
    return (
      <div className="min-h-screen bg-slate-50 selection:bg-teal-500 selection:text-white">
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-60 bg-slate-900 text-white text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <WelcomeAuthScreen
          language={language}
          onLanguageToggle={handleToggleLanguage}
          onLoginSuccess={handleAuthSuccess}
          onOpenArtisanJoin={() => setIsNewJoinOpen(true)}
          onRegisterEstablishment={handleRegisterEstablishment}
          directoryItems={directoryItems}
          onContinueAsGuest={handleContinueAsGuest}
        />

        <NewProviderModal
          isOpen={isNewJoinOpen}
          onClose={() => setIsNewJoinOpen(false)}
          language={language}
          onRegisterProvider={(prov) => {
            handleRegisterNewProvider(prov);
            handleAuthSuccess({
              userType: 'provider',
              userName: prov.businessName,
              phone: prov.phone
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-500 selection:text-white">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-60 bg-slate-900 text-white text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        language={language}
        onLanguageToggle={handleToggleLanguage}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onOpenComplaints={() => setIsComplaintsOpen(true)}
        onOpenRequests={() => {
          setCurrentRole('client');
          setClientSubView('myRequests');
        }}
        pendingRequestsCount={pendingRequestsCount}
        isAdminAuthenticated={isAdminAuthenticated}
        currentUser={currentUser}
        onOpenAuthScreen={() => setIsWelcomeAuthVisible(true)}
      />

      {/* Role Banner Indicator */}
      <div className="bg-slate-200/70 border-b border-slate-300/60 px-4 py-1.5 text-center text-xs text-slate-700 flex items-center justify-center gap-2">
        <Info className="w-3.5 h-3.5 text-teal-700 shrink-0" />
        <span>
          {currentRole === 'client' && (language === 'ar' ? 'واجهة الزبون: تصفح الحرفيين، طلب الخدمات، والاطلاع على دليل الدروة' : 'Vue Client : Parcourez et réservez des services.')}
          {currentRole === 'provider' && (language === 'ar' ? 'لوحة الحرفي: إدارة التوفر (Online/Offline)، قبول الطلبات وتحديث الأسعار ومعرض الأعمال' : 'Tableau de bord Artisan : Gérez vos commandes et disponibilités.')}
          {currentRole === 'company' && (language === 'ar' ? 'واجهة المنشآت الطبية: إدارة بيانات العيادات ولائحة أسعار التحاليل بالمختبر' : 'Espace Cliniques & Labos : Tarifs des analyses et localisation.')}
          {currentRole === 'admin' && (language === 'ar' ? 'لوحة الإدارة: منح العلامة الزرقاء 🔵، مراجعة طلبات الانضمام، وإدارة دليل المدينة' : 'Administration : Validation et attribution des badges.')}
        </span>
      </div>

      {/* Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7">
        {currentRole === 'client' && (
          <ClientHome
            providers={providers}
            serviceRequests={serviceRequests}
            language={language}
            onSelectProvider={(p) => setSelectedProviderForDetails(p)}
            onRequestService={(p) => setSelectedProviderForRequest(p)}
            onOpenDirectory={() => setIsDirectoryOpen(true)}
            onOpenNewJoinModal={() => setIsNewJoinOpen(true)}
            onRateRequest={(req) => setSelectedRequestForRating(req)}
            activeSubView={clientSubView}
            setActiveSubView={setClientSubView}
          />
        )}

        {currentRole === 'provider' && (
          <ProviderDashboard
            providers={providers}
            activeProviderId={activeProviderId}
            onSelectActiveProvider={setActiveProviderId}
            serviceRequests={serviceRequests}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onUpdateProviderProfile={handleUpdateProviderProfile}
            onOpenNewJoinModal={() => setIsNewJoinOpen(true)}
            language={language}
          />
        )}

        {currentRole === 'company' && (
          <CompanyDashboard
            directoryItems={directoryItems}
            onUpdateDirectoryItem={handleUpdateDirectoryItem}
            language={language}
          />
        )}

        {currentRole === 'admin' && (
          !isAdminAuthenticated ? (
            <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-lg animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-700 mx-auto mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-black text-slate-900 mb-2">
                {language === 'ar' ? 'فضاء الإدارة محمي برمز سري' : 'Espace Administrateur Protégé'}
              </h2>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                {language === 'ar' 
                  ? 'الوصول إلى هذه اللوحة مخصص حصرياً للمسؤول (ibrahimaitaddimane@gmail.com). يرجى تسجيل الدخول بالبريد والرقم السري للمتابعة.' 
                  : 'L\'accès à ce tableau de bord est strictement réservé à l\'administrateur. Veuillez vous identifier pour continuer.'}
              </p>
              <div className="space-y-2.5">
                <button
                  onClick={() => setIsAdminLoginModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-bold text-xs shadow-md shadow-red-900/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تسجيل الدخول كمسؤول الآن' : 'Se connecter en tant qu\'administrateur'}</span>
                </button>
                <button
                  onClick={() => setCurrentRole('client')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  {language === 'ar' ? 'الرجوع إلى واجهة الزبون' : 'Retour à l\'accueil'}
                </button>
              </div>
            </div>
          ) : (
            <AdminDashboard
              providers={providers}
              serviceRequests={serviceRequests}
              directoryItems={directoryItems}
              onToggleVerifiedBadge={handleToggleVerifiedBadge}
              onApproveProvider={handleApproveProvider}
              onRejectProvider={handleRejectProvider}
              onDeleteProvider={handleDeleteProvider}
              onAddDirectoryItem={handleAddDirectoryItem}
              onDeleteDirectoryItem={handleDeleteDirectoryItem}
              onClearAllProviders={handleClearAllProviders}
              onClearAllRequests={handleClearAllRequests}
              onClearMedicalDirectory={handleClearMedicalDirectory}
              onOpenNewJoinModal={() => setIsNewJoinOpen(true)}
              adminEmail="ibrahimaitaddimane@gmail.com"
              onLogout={handleAdminLogout}
              language={language}
            />
          )
        )}
      </main>

      {/* Footer - Only comprehensive Deroua directory as requested */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-5 text-center text-xs text-slate-500 mb-14 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-sm">خدمات الدروة</span>
            <span>•</span>
            <span>Deroua Services © {new Date().getFullYear()}</span>
          </div>

          <div>
            <button 
              onClick={() => setIsDirectoryOpen(true)} 
              id="footer-directory-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-700 hover:bg-teal-800 active:bg-teal-900 text-white text-xs font-black rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-teal-100" />
              <span>{language === 'ar' ? 'دليل الدروة الشامل' : 'Annuaire complet de Deroua'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Access for the Comprehensive Directory */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 p-2.5 shadow-lg">
        <button
          onClick={() => setIsDirectoryOpen(true)}
          id="mobile-bottom-directory-btn"
          className="w-full py-2.5 px-4 bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'ar' ? 'دليل الدروة الشامل' : 'Annuaire complet de Deroua'}</span>
        </button>
      </div>

      {/* Global Modals */}
      <DirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        language={language}
        directoryItems={directoryItems}
      />

      <ProviderDetailsModal
        isOpen={!!selectedProviderForDetails}
        onClose={() => setSelectedProviderForDetails(null)}
        provider={selectedProviderForDetails}
        language={language}
        onRequestService={() => {
          const p = selectedProviderForDetails;
          setSelectedProviderForDetails(null);
          setSelectedProviderForRequest(p);
        }}
      />

      <RequestServiceModal
        isOpen={!!selectedProviderForRequest}
        onClose={() => setSelectedProviderForRequest(null)}
        provider={selectedProviderForRequest}
        language={language}
        onSubmitRequest={handleSubmitServiceRequest}
      />

      <RateProviderModal
        isOpen={!!selectedRequestForRating}
        onClose={() => setSelectedRequestForRating(null)}
        request={selectedRequestForRating}
        language={language}
        onSubmitRating={handleSubmitRating}
      />

      <ComplaintsModal
        isOpen={isComplaintsOpen}
        onClose={() => setIsComplaintsOpen(false)}
        language={language}
      />

      <NewProviderModal
        isOpen={isNewJoinOpen}
        onClose={() => setIsNewJoinOpen(false)}
        language={language}
        onRegisterProvider={handleRegisterNewProvider}
      />

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
        language={language}
      />

    </div>
  );
}

