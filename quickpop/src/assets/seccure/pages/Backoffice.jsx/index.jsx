import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Video, Award, FileText, Settings, 
  Search, Bell, ChevronDown, Menu, X, Plus, Edit2, Trash2,
  TrendingUp, Clock, CheckCircle, AlertCircle, Eye, Download,
  Filter, MoreVertical, Upload, Calendar, BarChart3, Save,
  Mail, Phone, MapPin, Star, PlayCircle, Send, Book,
  Target, Zap, DollarSign, UserCheck, AlertTriangle
} from 'lucide-react';
import SettingsPage from './component/Settings.jsx';
import ReportsPage from './component/Report.jsx';
import CertificationsPage from './component/Certification.jsx';
import VideosPage from './component/Video.jsx';
import UsersPage from './component/user.jsx';
import Dashboard from './component/Dashboard.jsx';


export default function BackofficeQuickPop() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Données fictives enrichies
  const stats = {
    totalUsers: 1847,
    activeUsers: 1234,
    totalVideos: 156,
    completionRate: 78,
    avgScore: 85,
    certificatesIssued: 3421,
    learningTime: 2847,
    modulesCompleted: 567,
    newUsersThisMonth: 234,
    satisfactionRate: 92
  };

  const videos = [
    { id: 1, title: 'Procédure de caisse', category: 'Caisse', duration: '12:30', views: 1245, likes: 234, status: 'Publié', date: '2024-11-15', description: 'Formation complète sur les procédures de caisse et encaissement' },
    { id: 2, title: 'Hygiène et sécurité', category: 'Sécurité', duration: '18:45', views: 2156, likes: 445, status: 'Publié', date: '2024-11-10', description: 'Normes HACCP et bonnes pratiques d\'hygiène alimentaire' },
    { id: 3, title: 'Service client excellence', category: 'Service', duration: '15:20', views: 987, likes: 189, status: 'Publié', date: '2024-11-20', description: 'Techniques pour offrir un service client de qualité' },
    { id: 4, title: 'Gestion des stocks', category: 'Gestion', duration: '22:15', views: 654, likes: 98, status: 'Brouillon', date: '2024-12-05', description: 'Optimisation de la gestion des stocks et inventaires' },
    { id: 5, title: 'Préparation des burgers', category: 'Cuisine', duration: '10:45', views: 1876, likes: 367, status: 'Publié', date: '2024-10-28', description: 'Standards de préparation des burgers Quick' },
    { id: 6, title: 'Ouverture du restaurant', category: 'Gestion', duration: '14:30', views: 756, likes: 145, status: 'Publié', date: '2024-11-05', description: 'Check-list et procédures d\'ouverture' },
    { id: 7, title: 'Clôture de caisse', category: 'Caisse', duration: '9:15', views: 892, likes: 167, status: 'Publié', date: '2024-11-18', description: 'Procédure de fermeture et comptage de caisse' },
    { id: 8, title: 'Gestion des allergènes', category: 'Sécurité', duration: '16:00', views: 1123, likes: 223, status: 'Publié', date: '2024-10-22', description: 'Identification et gestion des allergènes alimentaires' }
  ];

  const activities = [
    { user: 'Sophie Martin', action: 'a complété', item: 'Hygiène alimentaire', time: 'Il y a 5 min', type: 'completion' },
    { user: 'Lucas Dubois', action: 'a obtenu', item: 'Certification Caisse', time: 'Il y a 12 min', type: 'certification' },
    { user: 'Emma Bernard', action: 'a commencé', item: 'Service client', time: 'Il y a 25 min', type: 'start' },
    { user: 'Thomas Petit', action: 'a complété', item: 'Sécurité incendie', time: 'Il y a 1h', type: 'completion' },
    { user: 'Julie Moreau', action: 'a regardé', item: 'Procédure de caisse', time: 'Il y a 1h', type: 'view' },
    { user: 'Marc Leroy', action: 'a obtenu', item: 'Certification HACCP', time: 'Il y a 2h', type: 'certification' }
  ];

  const Sidebar = () => (
    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${sidebarOpen ? 'md:w-64' : 'md:w-20'} fixed md:relative inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
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

      <div className="p-3 border-t border-gray-200">
        {(sidebarOpen || window.innerWidth < 768) ? (
          <div className="p-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-red-600" />
              <span className="text-xs font-semibold text-red-900">Pro Tips</span>
            </div>
            <p className="text-xs text-gray-600">Exportez vos rapports mensuels avant le 5 de chaque mois</p>
          </div>
        ) : (
          <div className="w-full h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-red-600" />
          </div>
        )}
      </div>
    </div>
  );

  const Header = () => (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative transition">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">AD</span>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );







  const Modal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
            <h3 className="text-lg font-bold text-gray-900">
              {modalType === 'view-user' && 'Détails de l\'utilisateur'}
              {modalType === 'add-user' && 'Ajouter un utilisateur'}
              {modalType === 'view-video' && 'Détails de la vidéo'}
              {modalType === 'add-video' && 'Ajouter une vidéo'}
              {modalType === 'view-cert' && 'Détails de la certification'}
              {modalType === 'add-cert' && 'Créer une certification'}
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
                    <span className="text-2xl font-bold text-gray-700">{selectedItem.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{selectedItem.name}</h4>
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
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </div>
                    <p className="text-sm font-medium text-gray-900">{selectedItem.phone}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <MapPin className="w-4 h-4" />
                      Restaurant
                    </div>
                    <p className="text-sm font-medium text-gray-900">{selectedItem.restaurant}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      Dernière activité
                    </div>
                    <p className="text-sm font-medium text-gray-900">{selectedItem.lastActive}</p>
                  </div>
                </div>
              </div>
            )}

            {modalType === 'add-user' && (
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Nom</label>
                    <input type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Nom complet" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Rôle</label>
                    <select className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                      <option>Équipier</option>
                      <option>Manager</option>
                      <option>Administrateur</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <input type="email" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="email@quick.fr" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Téléphone</label>
                    <input type="tel" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="+33 …" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Annuler</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Ajouter
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

            {modalType === 'add-video' && (
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Titre</label>
                    <input type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Durée</label>
                    <input type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="5:30" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-gray-600">Catégorie</label>
                    <input type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="Procédures" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Annuler</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </form>
            )}

            {modalType === 'view-cert' && selectedItem && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-900">{selectedItem.name}</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Validité</div>
                    <div className="text-sm font-medium text-gray-900">{selectedItem.validity}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Émis</div>
                    <div className="text-sm font-medium text-gray-900">{selectedItem.issued}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{selectedItem.description}</p>
                <div className="flex justify-end">
                  <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Fermer</button>
                </div>
              </div>
            )}

            {modalType === 'add-cert' && (
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Nom</label>
                    <input type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Validité</label>
                    <input type="text" className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" placeholder="12 mois" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm text-gray-600">Description</label>
                    <textarea className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent" rows="3"></textarea>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">Annuler</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Créer
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'users' && <UsersPage />}
          {currentPage === 'videos' && <VideosPage />}
          {currentPage === 'certifications' && <CertificationsPage />}
          {currentPage === 'reports' && <ReportsPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>
      <Modal />
    </div>
  );
}
