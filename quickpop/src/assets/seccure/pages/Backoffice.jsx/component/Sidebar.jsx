import { X, Menu, LayoutDashboard, Users, Video, Award, BarChart3, Settings, Zap } from 'lucide-react';
import { useState } from 'react';

 const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState('dashboard');
    return (
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
 };

export default Sidebar;
