import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Video, Award, FileText, Settings, 
  Search, Bell, ChevronDown, Menu, X, Plus, Edit2, Trash2,
  TrendingUp, Clock, CheckCircle, AlertCircle, Eye, Download,
  Filter, MoreVertical, Upload, Calendar, BarChart3, Save,
  Mail, Phone, MapPin, Star, PlayCircle, Send, Book,
  Target, Zap, DollarSign, UserCheck, AlertTriangle, ExternalLink, Loader,
  LogOut, Home, User
} from 'lucide-react';
import SettingsPage from './component/Settings.jsx';
import ReportsPage from './component/Report.jsx';
import CertificationsPage from './component/Certification.jsx';
import VideosPage from './component/Video.jsx';
import UsersPage from './component/user.jsx';
import Dashboard from './component/Dashboard.jsx';

import * as userService from '../../../config/services/users.js';
import * as videoService from '../../../config/services/videos.js';
import * as certService from '../../../config/services/certifications.js';
import * as categoryService from '../../../config/services/category.js';
import { useAuth } from '../../../config/hooks/auth.js';
import { useSocket } from '../../../config/context/useSocket';
import * as notificationService from '../../../config/services/notifications.js';

const RESTAURANTS = [
  "Quick Paris Sebastopol",
  "Quick Paris Barbès",
  "Quick Paris Place de Clichy",
  "Quick Paris Gare du nord",
  "Quick Paris Opéra",
  "SUP"
];

export default function BackofficeQuickPop() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    type: 'all', // all, users, videos, certifications
    status: 'all',
    dateRange: 'all'
  });
  // const [filterStatus, setFilterStatus] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [bulkProgress, setBulkProgress] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await categoryService.getCategories();
        setCategories(Array.isArray(res) ? res : (res.data || []));
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };
    const loadCertifications = async () => {
      try {
        const res = await certService.getCertifications();
        setCertifications(Array.isArray(res) ? res : (res.data || []));
      } catch (err) {
        console.error("Error loading certifications", err);
      }
    };
    loadCategories();
    loadCertifications();
  }, [refreshKey]);

  const refreshData = () => setRefreshKey(prev => prev + 1);

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    let data = item || {};
    
    // Fix duration for edit-video
    if (type === 'edit-video' && item) {
       data = { ...item, duration: item.raw_duration };
    }

    // Initialiser le mode d'ajout de vidéo
    if (type === 'add-video') {
      data = { videoSource: 'file', ...data };
    } else if (type === 'edit-video') {
      // Si on édite, on suppose par défaut qu'on garde l'URL existante, sauf si on veut changer
      data = { videoSource: 'url', ...data };
    }
    
    setFormData(data);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Nettoyage des données avant envoi
    const cleanData = { ...formData };
    if (cleanData.code === '') cleanData.code = null;
    if (cleanData.restaurant === '') cleanData.restaurant = null;
    if (modalType === 'edit-user' && !cleanData.password) {
      delete cleanData.password;
    }

    // Suppression des champs système qui ne doivent pas être mis à jour manuellement
    delete cleanData.last_login;
    delete cleanData.created_at;
    delete cleanData.updated_at;
    delete cleanData.reset_code;
    delete cleanData.reset_expires;

    try {
      if (modalType === 'add-user') {
        await userService.createUser(cleanData);
      } else if (modalType === 'edit-user') {
        try {
          await userService.updateUser(selectedItem.id, cleanData);
        } catch (err) {
          // Ignorer l'erreur si aucune modification n'a été faite
          if (err?.error === 'Aucune modification') {
            setShowModal(false);
            return;
          }
          throw err;
        }
      } else if (modalType === 'validate-user') {
        await userService.updateUser(selectedItem.id, { ...cleanData, is_active: true });
      } else if (modalType === 'add-video') {
        if (formData.videoSource === 'file' && formData.videoFile) {
           const data = new FormData()
           data.append('video', formData.videoFile)
           data.append('title', formData.title)
           data.append('description', formData.description || '')
           data.append('category_id', formData.category_id)
           data.append('is_featured', formData.is_featured || false)
           data.append('is_trending', formData.is_trending || false)
           data.append('uploaded_by', 1)
           if (formData.thumbnail_url) data.append('thumbnail_url', formData.thumbnail_url)
           if (formData.duration) data.append('duration', formData.duration)
           
           await videoService.uploadVideo(data)
        } else {
           // Standard creation via URL
           if (!formData.video_url) {
             alert("Veuillez entrer une URL de vidéo valide.");
             return;
           }
           await videoService.createVideo({ ...formData, uploaded_by: 1 });
        }
      } else if (modalType === 'edit-video') {
        await videoService.updateVideo(selectedItem.id, formData);
      } else if (modalType === 'add-cert') {
        await certService.createCertification(formData);
      } else if (modalType === 'edit-cert') {
        await certService.updateCertification(selectedItem.id, formData);
      } else if (modalType === 'bulk-video') {
        if (!formData.bulkFiles || formData.bulkFiles.length === 0) {
          alert("Veuillez sélectionner des vidéos.");
          return;
        }

        const filesToProcess = formData.bulkFiles;
        const totalToProcess = filesToProcess.filter(f => f.status !== 'success').length;
        
        if (totalToProcess === 0) {
             alert("Toutes les vidéos ont déjà été importées.");
             return;
        }

        setBulkProgress({ total: totalToProcess, current: 0, success: 0, failed: 0 });
        let successCount = 0;
        let failedCount = 0;
        let processedCount = 0;

        for (let i = 0; i < filesToProcess.length; i++) {
          const fileObj = filesToProcess[i];
          if (fileObj.status === 'success') continue;
          
          processedCount++;
          setBulkProgress(prev => ({ ...prev, current: processedCount, fileName: fileObj.file.name }));

          if (!fileObj.category_id) {
               setFormData(prev => {
                   const newFiles = [...prev.bulkFiles];
                   newFiles[i] = { ...newFiles[i], status: 'error', errorMsg: 'Catégorie manquante' };
                   return { ...prev, bulkFiles: newFiles };
               });
               failedCount++;
               setBulkProgress(prev => ({ ...prev, failed: prev.failed + 1 }));
               continue;
          }

          setFormData(prev => {
               const newFiles = [...prev.bulkFiles];
               newFiles[i] = { ...newFiles[i], status: 'uploading' };
               return { ...prev, bulkFiles: newFiles };
          });

          try {
             const data = new FormData();
             data.append('video', fileObj.file);
             data.append('title', fileObj.title || fileObj.file.name.replace(/\.[^/.]+$/, ""));
             data.append('description', fileObj.description || '');
             data.append('category_id', fileObj.category_id);
             data.append('is_featured', fileObj.is_featured || false);
             data.append('is_trending', fileObj.is_trending || false);
             data.append('uploaded_by', user?.id || 1);
             
             if (fileObj.duration) data.append('duration', fileObj.duration);

             await videoService.uploadVideo(data);
             
             setFormData(prev => {
               const newFiles = [...prev.bulkFiles];
               newFiles[i] = { ...newFiles[i], status: 'success', errorMsg: null };
               return { ...prev, bulkFiles: newFiles };
             });
             successCount++;
             setBulkProgress(prev => ({ ...prev, success: prev.success + 1 }));
          } catch (error) {
             console.error("Error uploading " + fileObj.file.name, error);
             setFormData(prev => {
               const newFiles = [...prev.bulkFiles];
               newFiles[i] = { ...newFiles[i], status: 'error', errorMsg: 'Erreur upload' };
               return { ...prev, bulkFiles: newFiles };
             });
             failedCount++;
             setBulkProgress(prev => ({ ...prev, failed: prev.failed + 1 }));
          }
        }
        await new Promise(r => setTimeout(r, 1000));
        setBulkProgress(null);
        
        if (failedCount === 0) {
             alert("Importation terminée avec succès !");
             setShowModal(false);
             // Refresh videos list? We might need to trigger a refresh.
             // But the current code doesn't seem to have a refresh trigger passed to Modal save.
             // Usually modifying state triggers re-fetch if useEffect depends on it, but here we probably need manual refresh.
             // Assuming Backoffice refreshes on some state change or user navigation.
        } else {
             alert(`Importation terminée. ${successCount} succès, ${failedCount} erreurs.`);
        }
      }
      if (modalType === 'assign-cert') {
        await certService.assignCertification({ userId: selectedItem.id, certId: formData.cert_id });
      }
      
      setShowModal(false);
      refreshData();
    } catch (error) {
      console.error("Error saving data", error);
      const msg = error?.error || error?.message || "Erreur lors de l'enregistrement";
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        user={user}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <div className="flex overflow-hidden">
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
        />
        <main className="flex-1 w-full p-4 md:p-6 overflow-y-auto">
          {currentPage === 'dashboard' && <Dashboard setCurrentPage={setCurrentPage} searchTerm={searchTerm} activeFilters={activeFilters} />}
          {currentPage === 'users' && <UsersPage openModal={openModal} refreshKey={refreshKey} restaurants={RESTAURANTS} searchTerm={searchTerm} />}
          {currentPage === 'videos' && <VideosPage openModal={openModal} refreshKey={refreshKey} searchTerm={searchTerm} />}
          {currentPage === 'certifications' && <CertificationsPage openModal={openModal} refreshKey={refreshKey} searchTerm={searchTerm} />}
          {currentPage === 'reports' && <ReportsPage searchTerm={searchTerm} />}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>
      <Modal 
        showModal={showModal}
        setShowModal={setShowModal}
        modalType={modalType}
        selectedItem={selectedItem}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        categories={categories}
        certifications={certifications}
        restaurants={RESTAURANTS}
        bulkProgress={bulkProgress}
      />
    </div>
  );
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage }) => (
  <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${sidebarOpen ? 'md:w-64' : 'md:w-20'} fixed md:relative inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col min-h-screen`}>
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        {(sidebarOpen || window.innerWidth < 768) && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm">QuickPop</h1>
              <p className="text-xs text-gray-500">Backoffice</p>
            </div>
          </div>
        )}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
    </div>

    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      {[
        { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Tableau de bord' },
        { id: 'users', icon: <Users className="w-5 h-5" />, label: 'Utilisateurs' },
        { id: 'videos', icon: <Video className="w-5 h-5" />, label: 'Vidéos' },
        { id: 'certifications', icon: <Award className="w-5 h-5" />, label: 'Certifications' },
        { id: 'reports', icon: <BarChart3 className="w-5 h-5" />, label: 'Rapports' },
        { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Paramètres' }
      ].map(item => (
        <button
          key={item.id}
          onClick={() => {
            setCurrentPage(item.id);
            if (window.innerWidth < 768) setSidebarOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
            currentPage === item.id
              ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          {item.icon}
          {(sidebarOpen || window.innerWidth < 768) && <span className="text-sm font-medium">{item.label}</span>}
        </button>
      ))}
    </nav>
  </div>
);

const Header = ({ sidebarOpen, setSidebarOpen, searchTerm, setSearchTerm, user, activeFilters, setActiveFilters, setCurrentPage, currentPage }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { notifications, setNotifications } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const handleNotificationClick = async (notification) => {
    if (!notification.read_at) {
        try {
            await notificationService.markAsRead(notification.id);
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read_at: new Date() } : n));
        } catch (e) { console.error(e); }
    }
    if (notification.url) {
        // Handle internal navigation if needed
    }
    setShowNotifications(false);
  };

  const handleMarkAllRead = async () => {
      try {
          await notificationService.markAllAsRead();
          setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })));
      } catch (e) { console.error(e); }
  };

  const handleSearchFocus = () => {
    setShowFilters(true);
    if (currentPage === 'settings') {
      setCurrentPage('dashboard');
    }
  };

  const handleTypeFilterClick = (type) => {
    setActiveFilters(prev => ({ ...prev, type }));
    setCurrentPage('dashboard');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="relative z-10 flex-1 max-w-2xl">
            <div className={`relative flex items-center transition-all duration-200 ${showFilters ? 'ring-2 ring-red-100 rounded-t-xl bg-white z-20' : ''}`}>
              <Search className="w-5 h-5 text-gray-400 absolute left-3 z-10" />
              <input
                type="text"
                placeholder="Rechercher partout (utilisateurs, vidéos, certifications)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleSearchFocus}
                className={`w-full pl-10 pr-12 py-2.5 border border-gray-300 ${showFilters ? 'rounded-t-xl border-b-0' : 'rounded-lg'} text-sm focus:outline-none focus:border-red-500 transition-all`}
              />
              
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Advanced Search Dropdown */}
            {showFilters && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowFilters(false)}
                />
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 rounded-b-xl shadow-xl z-20 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-4">
                    {/* Quick Filters */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Filtrer par type</h4>
                      <div className="flex flex-wrap gap-2">
                        {['all', 'users', 'videos', 'certifications'].map(type => (
                          <button
                            key={type}
                            onClick={() => handleTypeFilterClick(type)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 ${
                              activeFilters.type === type 
                                ? 'bg-red-100 text-red-700 ring-1 ring-red-200' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {type === 'all' && <LayoutDashboard className="w-3 h-3" />}
                            {type === 'users' && <Users className="w-3 h-3" />}
                            {type === 'videos' && <Video className="w-3 h-3" />}
                            {type === 'certifications' && <Award className="w-3 h-3" />}
                            {type === 'all' ? 'Tout' : 
                             type === 'users' ? 'Utilisateurs' :
                             type === 'videos' ? 'Vidéos' : 'Certifications'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Filters based on type */}
                    {activeFilters.type !== 'all' && (
                      <div className="pt-3 border-t border-gray-100">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Options avancées</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                            <input 
                              type="checkbox" 
                              className="rounded text-red-600 focus:ring-red-500"
                              checked={activeFilters.status === 'active'}
                              onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.checked ? 'active' : 'all' }))}
                            />
                            Uniquement actifs
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                            <input 
                              type="checkbox" 
                              className="rounded text-red-600 focus:ring-red-500"
                              checked={activeFilters.dateRange === 'month'}
                              onChange={(e) => setActiveFilters(prev => ({ ...prev, dateRange: e.target.checked ? 'month' : 'all' }))}
                            />
                            Nouveaux (Ce mois)
                          </label>
                        </div>
                      </div>
                    )}
                    
                    {searchTerm.length > 0 && (
                      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-xs text-gray-500">Appuyez sur Entrée pour rechercher</span>
                        <button 
                          onClick={() => setShowFilters(false)}
                          className="text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          Fermer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="relative">
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 hover:bg-gray-100 rounded-lg relative transition"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                
                {showNotifications && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                            <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button onClick={handleMarkAllRead} className="text-xs text-red-600 hover:text-red-700 font-medium">
                                        Tout marquer comme lu
                                    </button>
                                )}
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">Aucune notification</div>
                                ) : (
                                    notifications.map(notification => (
                                        <div 
                                            key={notification.id} 
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition ${!notification.read_at ? 'bg-red-50/50' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!notification.read_at ? 'bg-red-500' : 'bg-gray-300'}`} />
                                                <div>
                                                    <p className={`text-sm ${!notification.read_at ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.body}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 sm:border-l border-gray-200 hover:bg-gray-50 p-1.5 sm:p-2 rounded-lg transition-colors outline-none"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold text-white">{user?.fullname ? user.fullname.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}</span>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullname || 'Utilisateur'}</p>
                <p className="text-xs text-gray-500">Administrateur</p>
              </div>
              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Retour au site
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/account');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Mon compte
                  </button>

                  <div className="h-px bg-gray-100 my-1" />

                  <button 
                    onClick={async () => {
                      setShowUserMenu(false);
                      await signOut();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ showModal, setShowModal, modalType, selectedItem, formData, setFormData, handleInputChange, handleSave, categories, certifications, restaurants, bulkProgress }) => {
  const [certHolders, setCertHolders] = useState([]);
  const [loadingHolders, setLoadingHolders] = useState(false);

  useEffect(() => {
    if (modalType === 'view-cert' && selectedItem?.id) {
      const fetchHolders = async () => {
        setLoadingHolders(true);
        try {
          const data = await certService.getCertificationHolders(selectedItem.id);
          setCertHolders(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingHolders(false);
        }
      };
      fetchHolders();
    } else {
      setCertHolders([]);
    }
  }, [modalType, selectedItem]);

  const handleBulkChange = (index, field, value) => {
    setFormData(prev => {
      const newFiles = [...prev.bulkFiles];
      newFiles[index] = { ...newFiles[index], [field]: value };
      return { ...prev, bulkFiles: newFiles };
    });
  };

  const removeBulkItem = (index) => {
    setFormData(prev => {
      const newFiles = prev.bulkFiles.filter((_, i) => i !== index);
      return { ...prev, bulkFiles: newFiles };
    });
  };

  const applyGlobalToAll = (field, value) => {
     setFormData(prev => {
        if (!prev.bulkFiles) return prev;
        const newFiles = prev.bulkFiles.map(f => {
            if (f.status === 'success') return f;
            return { ...f, [field]: value };
        });
        return { ...prev, bulkFiles: newFiles };
     });
  };

  const handleFileSelect = (e) => {
    if (modalType === 'bulk-video') {
       const files = Array.from(e.target.files);
       const existingCount = formData.bulkFiles ? formData.bulkFiles.length : 0;
       
       const newBulkFiles = files.map(file => ({
         file: file,
         title: file.name.replace(/\.[^/.]+$/, ""),
         description: formData.description || '',
         category_id: formData.category_id || '',
         is_featured: formData.is_featured || false,
         is_trending: formData.is_trending || false,
         status: 'pending',
         duration: 0
       }));

       setFormData(prev => ({ 
           ...prev, 
           bulkFiles: [...(prev.bulkFiles || []), ...newBulkFiles] 
       }));

       // Detect duration for new files
       newBulkFiles.forEach((item, index) => {
         const video = document.createElement('video');
         video.preload = 'metadata';
         video.onloadedmetadata = () => {
           window.URL.revokeObjectURL(video.src);
           const duration = Math.round(video.duration);
           setFormData(prev => {
              const newFiles = [...prev.bulkFiles];
              const targetIndex = existingCount + index;
              if (newFiles[targetIndex]) {
                  newFiles[targetIndex].duration = duration;
              }
              return { ...prev, bulkFiles: newFiles };
           });
         };
         video.src = URL.createObjectURL(item.file);
       });
       return;
    }

    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, videoFile: file }));
      
      // Auto-detect duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        const duration = Math.round(video.duration);
        setFormData(prev => ({ ...prev, duration: duration }));
      };
      video.src = URL.createObjectURL(file);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-bold text-gray-900">
            {modalType === 'view-user' && 'Détails de l\'utilisateur'}
            {modalType === 'add-user' && 'Ajouter un utilisateur'}
            {modalType === 'edit-user' && 'Modifier l\'utilisateur'}
            {modalType === 'validate-user' && 'Valider l\'utilisateur'}
            {modalType === 'view-video' && 'Détails de la vidéo'}
            {modalType === 'add-video' && 'Ajouter une vidéo'}
            {modalType === 'edit-video' && 'Modifier la vidéo'}
            {modalType === 'view-cert' && 'Détails de la certification'}
            {modalType === 'add-cert' && 'Créer une certification'}
            {modalType === 'edit-cert' && 'Modifier la certification'}
            {modalType === 'bulk-video' && 'Ajout de vidéos en masse'}
          </h3>
          <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {modalType === 'view-user' && selectedItem && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">{selectedItem.fullname ? selectedItem.fullname.split(' ').map(n => n[0]).join('') : '?'}</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedItem.fullname}</h4>
                  <p className="text-sm text-gray-500">{selectedItem.role}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                  <p className="text-sm font-medium text-gray-900">{selectedItem.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Award className="w-4 h-4" />
                    Code Employé
                  </div>
                  <p className="text-sm font-medium text-gray-900">{selectedItem.code || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    Restaurant
                  </div>
                  <p className="text-sm font-medium text-gray-900">{selectedItem.restaurant || 'Non assigné'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <CheckCircle className="w-4 h-4" />
                    Statut
                  </div>
                  <p className={`text-sm font-medium ${selectedItem.is_active ? 'text-green-600' : 'text-amber-600'}`}>
                    {selectedItem.is_active ? 'Actif' : 'En attente / Inactif'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    Dernière activité
                  </div>
                  <p className="text-sm font-medium text-gray-900">{selectedItem.last_login ? new Date(selectedItem.last_login).toLocaleDateString() : 'Jamais'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    Progression
                  </div>
                  <p className="text-sm font-medium text-gray-900">{selectedItem.avg_progress || 0}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                    <Award className="w-4 h-4" />
                    Certifications
                  </div>
                  <p className="text-sm font-medium text-gray-900">{selectedItem.certs_count || 0}</p>
                </div>
              </div>
            </div>
          )}

          {modalType === 'view-cert' && selectedItem && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedItem.name}</h4>
                  <p className="text-sm text-gray-500">{selectedItem.description}</p>
                  <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                    Validité: {selectedItem.validity_months} mois
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Titulaires ({certHolders.length})
                </h5>
                
                {loadingHolders ? (
                  <div className="flex justify-center py-4">
                    <Loader className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : certHolders.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 text-gray-600 font-medium border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-2">Utilisateur</th>
                          <th className="px-4 py-2">Restaurant</th>
                          <th className="px-4 py-2">Obtenu le</th>
                          <th className="px-4 py-2">Expire le</th>
                          <th className="px-4 py-2">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {certHolders.map((holder, idx) => (
                          <tr key={idx} className="hover:bg-white transition">
                            <td className="px-4 py-2 font-medium text-gray-900">{holder.fullname}</td>
                            <td className="px-4 py-2 text-gray-500">{holder.restaurant || '-'}</td>
                            <td className="px-4 py-2 text-gray-500">{new Date(holder.obtained_at).toLocaleDateString()}</td>
                            <td className="px-4 py-2 text-gray-500">{new Date(holder.expires_at).toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                holder.status === 'valid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {holder.status === 'valid' ? 'Valide' : 'Expiré'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Aucun titulaire pour le moment.</p>
                )}
              </div>
            </div>
          )}

          {(modalType === 'add-user' || modalType === 'edit-user') && (
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Nom complet</label>
                  <input name="fullname" value={formData.fullname || ''} onChange={handleInputChange} type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Nom complet" required />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Rôle</label>
                  <select name="role" value={formData.role || 'user'} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option value="user">Équipier (User)</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Restaurant</label>
                  <select 
                    name="restaurant" 
                    value={formData.restaurant || ''} 
                    onChange={handleInputChange} 
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un restaurant</option>
                  {restaurants && restaurants.map((resto, index) => (
                    <option key={index} value={resto}>{resto}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Statut</label>
                  <select 
                    name="is_active" 
                    value={formData.is_active ? '1' : '0'} 
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === '1' }))} 
                    className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="1">Actif</option>
                    <option value="0">Inactif / En attente</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input name="email" value={formData.email || ''} onChange={handleInputChange} type="email" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="email@quick.fr" required />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Code Employé (Unique)</label>
                  <input name="code" value={formData.code || ''} onChange={handleInputChange} type="number" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="12345" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Mot de passe {modalType === 'edit-user' && '(laisser vide pour ne pas changer)'}</label>
                  <input name="password" value={formData.password || ''} onChange={handleInputChange} type="password" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="******" required={modalType === 'add-user'} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  {modalType === 'add-user' ? 'Ajouter' : 'Enregistrer'}
                </button>
              </div>
            </form>
          )}

          {modalType === 'validate-user' && (
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                <p className="text-sm text-amber-800">
                  Veuillez sélectionner le restaurant de l'utilisateur pour valider son compte.
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Restaurant</label>
                <select 
                  name="restaurant" 
                  value={formData.restaurant || ''} 
                  onChange={handleInputChange} 
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner un restaurant</option>
                  {restaurants && restaurants.map((resto, index) => (
                    <option key={index} value={resto}>{resto}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Valider le compte
                </button>
              </div>
            </form>
          )}

          {modalType === 'view-video' && selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedItem.title}</h4>
                  <p className="text-sm text-gray-500">{selectedItem.duration} • {selectedItem.category}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{selectedItem.description || 'Aucune description fournie.'}</p>
              <div className="flex justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Fermer</button>
              </div>
            </div>
          )}

          {(modalType === 'add-video' || modalType === 'edit-video') && (
            <form className="space-y-4" onSubmit={handleSave}>
              {/* Toggle Source Mode */}
              <div className="flex gap-4 p-1 bg-gray-100 rounded-lg mb-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, videoSource: 'file' }))}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.videoSource === 'file' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Upload className="w-4 h-4 inline-block mr-2" />
                  Importer une vidéo
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, videoSource: 'url' }))}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    formData.videoSource === 'url' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <ExternalLink className="w-4 h-4 inline-block mr-2" />
                  Lien externe
                </button>
              </div>

              {formData.videoSource === 'file' ? (
                <div className="sm:col-span-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 transition-colors bg-gray-50">
                   <label className="text-sm font-medium text-gray-700 mb-2 block">Fichier Vidéo</label>
                   <input 
                     type="file" 
                     accept="video/*" 
                     onChange={handleFileSelect}
                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" 
                   />
                   <p className="text-xs text-gray-500 mt-2">Le fichier sera uploadé sur Backblaze B2 (Stockage Sécurisé).</p>
                </div>
              ) : (
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">URL de la vidéo</label>
                  <input name="video_url" value={formData.video_url || ''} onChange={handleInputChange} type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="https://..." required={formData.videoSource === 'url'} />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Titre</label>
                  <input name="title" value={formData.title || ''} onChange={handleInputChange} type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Durée (secondes)</label>
                  <input name="duration" value={formData.duration || ''} onChange={handleInputChange} type="number" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Ex: 120" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">Catégorie</label>
                  <select name="category_id" value={formData.category_id || ''} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required>
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">Description</label>
                  <textarea name="description" value={formData.description || ''} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" rows="3"></textarea>
                </div>
                
                 <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">URL de la miniature {formData.videoSource === 'file' && '(Optionnel)'}</label>
                  <input name="thumbnail_url" value={formData.thumbnail_url || ''} onChange={handleInputChange} type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="http://..." />
                  {formData.videoSource === 'file' && <p className="text-xs text-gray-500 mt-1">Si laissé vide, une miniature par défaut sera utilisée.</p>}
                </div>
                
                <div className="sm:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-2 border rounded-lg hover:bg-gray-50 transition w-full">
                    <input 
                      type="checkbox" 
                      name="is_featured" 
                      checked={formData.is_featured || false} 
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))} 
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500" 
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">À la une</span>
                      <span className="text-xs text-gray-500">Mettre en avant sur l'accueil</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-2 border rounded-lg hover:bg-gray-50 transition w-full">
                    <input 
                      type="checkbox" 
                      name="is_trending" 
                      checked={formData.is_trending || false} 
                      onChange={(e) => setFormData(prev => ({ ...prev, is_trending: e.target.checked }))} 
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500" 
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">Tendance</span>
                      <span className="text-xs text-gray-500">Afficher dans les tendances</span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {modalType === 'add-video' ? 'Ajouter' : 'Enregistrer'}
                </button>
              </div>
            </form>
          )}



          {(modalType === 'add-cert' || modalType === 'edit-cert') && (
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Nom</label>
                  <input name="name" value={formData.name || ''} onChange={handleInputChange} type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" required />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Validité (mois)</label>
                  <input name="validity_months" value={formData.validity_months || ''} onChange={handleInputChange} type="number" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="12" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600">Description</label>
                  <textarea name="description" value={formData.description || ''} onChange={handleInputChange} className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" rows="3"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  {modalType === 'add-cert' ? 'Créer' : 'Enregistrer'}
                </button>
              </div>
            </form>
          )}

          {modalType === 'bulk-video' && (
            <div className="space-y-4">
               {bulkProgress && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 sticky top-0 z-10 shadow-sm">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                       <Loader className="w-4 h-4 animate-spin" />
                       Traitement en cours...
                    </h4>
                    <p className="text-sm text-blue-800 mb-2">
                      Vidéo {bulkProgress.current} sur {bulkProgress.total} : {bulkProgress.fileName}
                    </p>
                    <div className="w-full bg-blue-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-blue-700 mt-2 font-medium">
                       <span className="text-green-600">Succès: {bulkProgress.success}</span>
                       <span className="text-red-600">Échecs: {bulkProgress.failed}</span>
                    </div>
                  </div>
               )}

               <div className="grid gap-4">
                  {/* Global Settings & Add */}
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                     <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full relative">
                           <label className="text-sm font-medium text-gray-700 mb-1 block">Ajouter des fichiers</label>
                           <div className="relative">
                               <input 
                                 type="file" 
                                 accept="video/*" 
                                 multiple
                                 onChange={handleFileSelect}
                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                               />
                               <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-500 hover:border-red-400 transition-colors">
                                  <Upload className="w-4 h-4" />
                                  <span>Glisser-déposer ou cliquer pour ajouter</span>
                               </div>
                           </div>
                        </div>
                        <div className="flex-1 w-full">
                            <label className="text-sm font-medium text-gray-700 mb-1 block">Appliquer à tous (En attente)</label>
                            <select 
                                onChange={(e) => applyGlobalToAll('category_id', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            >
                                <option value="">Choisir catégorie...</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                     </div>
                  </div>

                  {/* File List */}
                  <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1">
                    {formData.bulkFiles && formData.bulkFiles.length > 0 ? (
                        formData.bulkFiles.map((item, idx) => (
                           <div key={idx} className={`p-3 rounded-lg border transition-all ${
                               item.status === 'error' ? 'border-red-300 bg-red-50' : 
                               item.status === 'success' ? 'border-green-300 bg-green-50 opacity-75' : 
                               item.status === 'uploading' ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100' :
                               'border-gray-200 bg-white hover:border-red-200'
                           }`}>
                              <div className="flex gap-3 items-start">
                                 <div className={`w-10 h-10 rounded flex items-center justify-center flex-shrink-0 ${
                                     item.status === 'success' ? 'bg-green-100' : 'bg-gray-100'
                                 }`}>
                                    <Video className={`w-5 h-5 ${
                                        item.status === 'success' ? 'text-green-600' : 'text-gray-500'
                                    }`} />
                                 </div>
                                 <div className="flex-1 space-y-2 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                                       <input 
                                          type="text" 
                                          value={item.title} 
                                          onChange={(e) => handleBulkChange(idx, 'title', e.target.value)}
                                          className="flex-1 border-b border-gray-300 bg-transparent text-sm font-medium focus:outline-none focus:border-red-500 px-1 py-0.5 min-w-0"
                                          placeholder="Titre de la vidéo"
                                          disabled={item.status === 'success' || item.status === 'uploading'}
                                       />
                                       <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                                          {Math.round(item.file.size / 1024 / 1024)} MB
                                          {item.duration > 0 && ` • ${Math.floor(item.duration/60)}:${String(item.duration%60).padStart(2,'0')}`}
                                       </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 items-center">
                                       <select 
                                          value={item.category_id} 
                                          onChange={(e) => handleBulkChange(idx, 'category_id', e.target.value)}
                                          className={`text-xs border rounded px-2 py-1 outline-none focus:border-red-500 ${!item.category_id && item.status !== 'success' ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}`}
                                          disabled={item.status === 'success' || item.status === 'uploading'}
                                       >
                                          <option value="">Catégorie (Requis)</option>
                                          {categories.map(c => (
                                             <option key={c.id} value={c.id}>{c.name}</option>
                                          ))}
                                       </select>
                                       
                                       <label className="flex items-center gap-1 text-xs cursor-pointer select-none px-2 py-1 rounded hover:bg-gray-100">
                                          <input 
                                             type="checkbox" 
                                             checked={item.is_featured} 
                                             onChange={(e) => handleBulkChange(idx, 'is_featured', e.target.checked)}
                                             className="rounded text-red-600 focus:ring-red-500 w-3 h-3"
                                             disabled={item.status === 'success' || item.status === 'uploading'}
                                          />
                                          À la une
                                       </label>
                                       
                                       <label className="flex items-center gap-1 text-xs cursor-pointer select-none px-2 py-1 rounded hover:bg-gray-100">
                                          <input 
                                             type="checkbox" 
                                             checked={item.is_trending} 
                                             onChange={(e) => handleBulkChange(idx, 'is_trending', e.target.checked)}
                                             className="rounded text-red-600 focus:ring-red-500 w-3 h-3"
                                             disabled={item.status === 'success' || item.status === 'uploading'}
                                          />
                                          Tendance
                                       </label>
                                    </div>
                                    
                                    {item.status === 'error' && (
                                       <p className="text-xs text-red-600 flex items-center gap-1">
                                           <AlertCircle className="w-3 h-3" />
                                           {item.errorMsg || 'Erreur inconnue'}
                                       </p>
                                    )}
                                 </div>
                                 
                                 <div className="flex flex-col gap-1 items-end pl-2">
                                    {item.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                    {item.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                                    {item.status === 'uploading' && <Loader className="w-5 h-5 text-blue-500 animate-spin" />}
                                    {item.status === 'pending' && (
                                       <button 
                                          onClick={() => removeBulkItem(idx)}
                                          className="text-gray-400 hover:text-red-500 transition p-1 hover:bg-red-50 rounded"
                                          title="Retirer"
                                       >
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                    )}
                                 </div>
                              </div>
                           </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center">
                           <Upload className="w-12 h-12 mb-3 text-gray-300" />
                           <p className="font-medium text-gray-600">Aucune vidéo sélectionnée</p>
                           <p className="text-xs mt-1">Utilisez le bouton ci-dessus pour ajouter des fichiers</p>
                        </div>
                    )}
                  </div>
               </div>

               <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 bg-white sticky bottom-0">
                  <button 
                     type="button" 
                     onClick={() => setShowModal(false)} 
                     className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                     disabled={bulkProgress !== null}
                  >
                      Fermer
                  </button>
                  <button 
                      type="button" 
                      onClick={() => {
                          // Mock event for handleSave
                          handleSave({ preventDefault: () => {} });
                      }}
                     className={`px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium flex items-center gap-2 ${
                         (!formData.bulkFiles || formData.bulkFiles.length === 0 || bulkProgress !== null) ? 'opacity-50 cursor-not-allowed' : ''
                     }`}
                     disabled={!formData.bulkFiles || formData.bulkFiles.length === 0 || bulkProgress !== null}
                  >
                     {bulkProgress ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                     {bulkProgress ? 'Traitement...' : `Importer ${formData.bulkFiles ? formData.bulkFiles.filter(f => f.status !== 'success').length : 0} vidéos`}
                  </button>
               </div>
            </div>
          )}

          {modalType === 'assign-cert' && (
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                <p className="text-sm text-amber-800">
                  Sélectionnez la certification à attribuer à <strong>{selectedItem?.fullname}</strong>.
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Certification</label>
                <select 
                  name="cert_id" 
                  value={formData.cert_id || ''} 
                  onChange={handleInputChange} 
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Sélectionner une certification</option>
                  {certifications && certifications.map(cert => (
                    <option key={cert.id} value={cert.id}>{cert.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Annuler</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-lg transition text-sm font-medium flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Attribuer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};