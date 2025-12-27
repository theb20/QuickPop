import React, { useState, useEffect } from 'react';
import { User, Building2, MapPin, Mail, Phone, Calendar, Clock, Award, BookOpen, TrendingUp, LayoutDashboard, LogOut, Bell, Globe, BrickWallShield, ChevronRight, ArrowLeft, Camera, Save, X, Check, Download, Send } from 'lucide-react';
import Badge from '../components/badge.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../config/hooks/auth.js';
import { useAccountData } from '../../config/hooks/account.js';
import { createSupport } from '../../config/services/support.js';
import NavBar from '../components/Nav.jsx'

// Sub-components for cleaner render
const ProfileHeader = ({ user, isAdmin, hasCertification, onUploadClick }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-red-600 to-red-500 opacity-10"></div>
    <div className="flex flex-col items-center text-center relative z-10 pt-4">
      <div className="relative w-28 h-28 mb-4 group cursor-pointer" onClick={onUploadClick}>
        <div className="w-full h-full bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg border-4 border-white">
          {user?.fullname ? user.fullname.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
        </div>
        <div className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera size={16} />
        </div>
        {(isAdmin || hasCertification) && (
          <div className="absolute -top-2 -right-2">
            <Badge />
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold text-gray-900">{user?.fullname || 'Utilisateur'}</h2>
      <p className="text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1 rounded-full mt-2">
        {isAdmin ? 'Administrateur' : 'Équipier polyvalent'}
      </p>
      
      <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-xs text-gray-500 uppercase tracking-wider">ID Employé</span>
          <span className="font-mono font-bold text-gray-900 mt-1">{user?.code || '—'}</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Depuis le</span>
          <span className="font-medium text-gray-900 mt-1">
            {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '—'}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, icon, color, suffix = '' }) => {
  const Icon = icon;
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value}<span className="text-sm text-gray-400 font-normal">{suffix}</span>
          </p>
        </div>
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default function QuickPopProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, updateProfile } = useAuth();
  const { data: accountData, loading: accountLoading, refetch } = useAccountData();
  
  // Refetch data when location changes (e.g. returning from video player)
  useEffect(() => {
    refetch();
  }, [location.key]);

  const [activeView, setActiveView] = useState('main'); // main, 
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');
  const [isEditing, setIsEditing] = useState(false);

  // State for editable profile data
  const [profileData, setProfileData] = useState({
    phone: '—',
    email: user?.email || '—',
    department: 'Service & Caisse',
    restaurant: user?.restaurant || 'inconue'
  });

  // Update profile data when user is loaded
  useEffect(() => {
    if (user && !isEditing) {
      const timer = setTimeout(() => {
        setProfileData(prev => ({
          ...prev,
          email: user.email || '—',
          restaurant: user.restaurant || 'inconue'
        }));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user?.email, user?.restaurant, isEditing]);

  // State for notifications
  // const [notifications, setNotifications] = useState({
  //   email: true,
  //   push: true,
  //   updates: false,
  //   marketing: false
  // });

  // Animation states
  const [showToast, setShowToast] = useState(null);

  // Support form state
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [sendingSupport, setSendingSupport] = useState(false);

  // Derived data
  const isAdmin = user?.role === 'admin';
  const stats = accountData?.stats || {
    completionRate: 0,
    totalHours: 0,
    certificatesEarned: 0,
    averageScore: 0
  };

  const certifications = accountData?.certifications || [];
  // Filter out completed items just in case backend status lags
  const inProgress = (accountData?.inProgress || []).filter(item => item.progress < 100);

  console.log(user)

  const formatRemaining = (item) => {
    if (item.duration && item.progress) {
      const remainingSeconds = item.duration * (1 - item.progress / 100);
      const mins = Math.floor(remainingSeconds / 60);
      return mins > 60 ? `${Math.floor(mins/60)}h ${mins%60}min` : `${mins}min`;
    }
    return item.estimatedTime || "Temps inconnu";
  };

  const handleTrainingClick = (item) => {
    if (item.videoId) {
      navigate('/app/play', { state: { videoId: item.videoId } });
    } else {
      // Should not happen if data is clean
      alert("Vidéo non disponible pour cette formation.");
    }
  };

  // Handlers
  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        email: profileData.email,
        phone: profileData.phone,
        restaurant: profileData.restaurant
      });
      setIsEditing(false);
      showNotification('Profil mis à jour avec succès');
    } catch (err) {
      showNotification('Erreur lors de la mise à jour');
      console.error(err);
    }
  };

  const handleDownloadCert = (certName) => {
    showNotification(`Téléchargement de "${certName}" lancé...`);
  };

  const showNotification = (message) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleNavigate = (path) => {
    if (path === '/account/setting/info') setActiveView('settings-info');
    else if (path === '/account/setting/notifications') setActiveView('settings-notif');
    else navigate(path);
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!contactSubject.trim() || !contactMessage.trim()) return;
    
    setSendingSupport(true);
    try {
      await createSupport({
        user_id: user.id,
        subject: contactSubject,
        message: contactMessage
      });
      showNotification('Message envoyé avec succès');
      setContactSubject('');
      setContactMessage('');
      setTimeout(() => setActiveView('main'), 1500);
    } catch (err) {
      console.error(err);
      showNotification("Erreur lors de l'envoi du message");
    } finally {
      setSendingSupport(false);
    }
  };


  // Views
  if (activeView === 'settings-info') {
    return (
      <div className="min-h-screen relative z-50 bg-gray-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setActiveView('main')} className="flex items-center text-gray-600 hover:text-red-600 mb-6 transition duration-200">
            <ArrowLeft className="w-5 h-5 mr-2" /> Retour
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Informations personnelles</h2>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2">
                  <User size={18} /> <span className="hidden sm:inline">Modifier</span>
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700 font-medium">Annuler</button>
                  <button onClick={handleSaveProfile} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium flex items-center gap-2">
                    <Save size={18} /> <span className="hidden sm:inline">Enregistrer</span>
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input 
                    type="text" 
                    value={user?.fullname || ''} 
                    disabled 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">Contactez votre manager pour modifier votre nom.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full pl-10 p-3 text-gray-900  border rounded-lg transition ${isEditing ? 'bg-white border-gray-300 focus:ring-2 focus:ring-red-100 focus:border-red-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                    value={user?.restaurant || ''} 
                    disabled 
                    className="w-full py-3 px-9 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Contactez votre manager pour modifier votre nom.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showToast && (
          <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in-up z-50 flex items-center justify-center sm:justify-start gap-3">
            <Check className="text-green-400" size={20} />
            {showToast}
          </div>
        )}
      </div>
    );
  }

  if (activeView === 'settings-notif') {
    return (
      <div className="relative z-50 min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setActiveView('main')} className="flex items-center text-gray-600 hover:text-red-600 mb-6 transition z-20">
            <ArrowLeft className="w-5 h-5 mr-2" /> Retour
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Contactez le support</h2>
              <p className="text-gray-500 text-sm mt-1">Laissez un message à l'administrateur.</p>
            </div>
            
            <form onSubmit={handleSupportSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input 
                  type="text" 
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition"
                  placeholder="Sujet de votre message"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition h-32 resize-none"
                  placeholder="Votre message..."
                  required
                />
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  type="submit" 
                  disabled={sendingSupport}
                  className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-red-500/30"
                >
                  {sendingSupport ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  <span>Envoyer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main View
  if (accountLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center relative justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full overflow-hidden flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">
                    <img src="/imgs/logo-mb.png" alt="Logo quick" className="w-full h-full object-cover" />
                </span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">Quick<span className="text-red-600">Pop</span></h1>
                <p className="text-xs text-gray-500 font-medium hidden sm:block">Espace Formation</p>
              </div>
            </div>

            <div className="absolute z-[1000] right-0">
              <NavBar />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <ProfileHeader 
              user={user} 
              isAdmin={isAdmin} 
              hasCertification={certifications.length > 0}
              onUploadClick={() => showNotification("Fonctionnalité d'upload bientôt disponible")} 
            />
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact & Infos</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600 break-all">{user?.email || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Lieu de travail</p>
                    <p className="text-sm text-gray-600">{user?.restaurant || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <StatCard label="Complétion" value={stats.completionRate} suffix="%" icon={TrendingUp} color="bg-green-50 text-green-600" />
              <StatCard label="Heures" value={stats.totalHours} suffix="h" icon={Clock} color="bg-blue-50 text-blue-600" />
              <StatCard label="Certificats" value={stats.certificatesEarned} icon={Award} color="bg-amber-50 text-amber-600" />
              <StatCard label="Score Moyen" value={stats.averageScore} suffix="/100" icon={BookOpen} color="bg-purple-50 text-purple-600" />
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto no-scrollbar">
                  {['overview', 'certifications', 'setting'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-8 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                        activeTab === tab
                          ? 'border-red-600 text-red-600 bg-red-50/50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tab === 'overview' && "Vue d'ensemble"}
                      {tab === 'certifications' && "Mes Certifications"}
                      {tab === 'setting' && "Paramètres"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 min-h-[400px]">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-red-600" />
                        Formations en cours
                      </h3>
                      <div className="grid gap-4">
                        {inProgress.length === 0 ? (
                          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">Aucune formation en cours</p>
                            <p className="text-sm text-gray-400 mt-1">Commencez une vidéo pour la voir apparaître ici</p>
                          </div>
                        ) : (
                          inProgress.map((item, index) => (
                          <div 
                            key={index} 
                            onClick={() => handleTrainingClick(item)}
                            className={`border border-gray-200 rounded-xl p-5 hover:border-red-100 hover:shadow-sm transition bg-gradient-to-r from-transparent to-transparent hover:from-red-50/30 cursor-pointer`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{item.module}</h4>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                  <Clock size={14} /> Reste : {formatRemaining(item)}
                                </p>
                              </div>
                              <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">{item.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-red-600 h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Certifications Tab */}
                {activeTab === 'certifications' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex flex-col md:flex-row md:items-center justify-between border border-gray-200 rounded-xl p-5 hover:shadow-md transition group bg-white">
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Award className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{cert.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">Obtenu le {cert.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-4 md:mt-0">
                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {cert.status}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">Exp: {cert.validUntil}</p>
                          </div>
                          <button 
                            onClick={() => handleDownloadCert(cert.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" 
                            title="Télécharger"
                          >
                            <Download size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'setting' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Paramètres du compte</h2>
                      <p className="text-gray-500">Gérez vos préférences personnelles.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleNavigate('/account/setting/info')}
                        className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-red-200 transition-all text-left overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">Informations personnelles</h3>
                            <p className="text-sm text-gray-500">Gérez votre nom, email et téléphone</p>
                          </div>
                        </div>
                        <ChevronRight className="absolute bottom-5 right-5 text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" size={20} />
                      </button>

                      <button
                        onClick={() => handleNavigate('/account/setting/notifications')}
                        className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-red-200 transition-all text-left overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-purple-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative flex items-start gap-4">
                          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <Bell className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">Support et assistance</h3>
                            <p className="text-sm text-gray-500">Contactez notre support pour toute question ou assistance</p>
                          </div>
                        </div>
                        <ChevronRight className="absolute bottom-5 right-5 text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" size={20} />
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => navigate('/backoffice')}
                          className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-red-200 transition-all text-left overflow-hidden col-span-full md:col-span-1"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-red-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                          <div className="relative flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                              <BrickWallShield className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 mb-1">Administration</h3>
                              <p className="text-sm text-gray-500">Paramètres globaux de l'application</p>
                            </div>
                          </div>
                          <ChevronRight className="absolute bottom-5 right-5 text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" size={20} />
                        </button>
                      )}

                      <button
                        onClick={async () => { await signOut(); navigate('/login'); }}
                        className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-red-200 transition-all text-left overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-red-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                        <div className="relative flex items-start gap-4">
                          <div className="w-12 h-12 bg-purple-50 text-red-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <LogOut className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">Déconnexion</h3>
                            <p className="text-sm text-gray-500">Se déconnecter de l'application</p>
                          </div>
                        </div>
                        <ChevronRight className="absolute bottom-5 right-5 text-gray-300 group-hover:text-red-600 group-hover:translate-x-1 transition-all" size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showToast && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl animate-fade-in-up z-50 flex items-center justify-center sm:justify-start gap-3">
          <Check className="text-green-400" size={20} />
          {showToast}
        </div>
      )}
    </div>
  );
}
