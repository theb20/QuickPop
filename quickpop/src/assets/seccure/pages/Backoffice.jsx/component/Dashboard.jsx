import React, { useState, useEffect } from 'react';
import { Calendar, Download, Users, Video, TrendingUp, Award, CheckCircle, PlayCircle, Eye, Target, Clock, UserCheck, Star, Loader, Search } from 'lucide-react';
import * as reportService from '../../../../config/services/reports.js';
import * as userService from '../../../../config/services/users.js';
import { getVideos } from '../../../../config/services/videos.js';
import * as certService from '../../../../config/services/certifications.js';

const Dashboard = ({ setCurrentPage, searchTerm, activeFilters = { type: 'all' } }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalVideos: 0,
    completionRate: 0,
    avgScore: 0,
    certificatesIssued: 0,
    learningTime: 0,
    modulesCompleted: 0,
    newUsersThisMonth: 0,
    satisfactionRate: 0,
    monthlyCerts: 0
  });
  const [activities, setActivities] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search State
  const [searchResults, setSearchResults] = useState({
    users: [],
    videos: [],
    certifications: []
  });
  const [isSearching, setIsSearching] = useState(false);

  // Global Search Effect
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const shouldFetchUsers = activeFilters.type === 'all' || activeFilters.type === 'users';
        const shouldFetchVideos = activeFilters.type === 'all' || activeFilters.type === 'videos';
        const shouldFetchCerts = activeFilters.type === 'all' || activeFilters.type === 'certifications';

        const [usersData, videosData, certsData] = await Promise.all([
          shouldFetchUsers ? userService.getUsers() : [],
          shouldFetchVideos ? getVideos() : { data: [] },
          shouldFetchCerts ? certService.getCertifications() : []
        ]);

        const term = searchTerm.toLowerCase();
        const now = new Date();

        const isThisMonth = (dateStr) => {
          if (!dateStr) return false;
          const d = new Date(dateStr);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        };

        const filteredUsers = (Array.isArray(usersData) ? usersData : []).filter(u => {
          const matchesTerm = (u.fullname || '').toLowerCase().includes(term) ||
            (u.email || '').toLowerCase().includes(term) ||
            (u.code || '').toString().includes(term);
          
          const matchesStatus = activeFilters.status === 'all' || 
            (activeFilters.status === 'active' && u.is_active);
          
          const matchesDate = activeFilters.dateRange === 'all' || 
            (activeFilters.dateRange === 'month' && isThisMonth(u.created_at));

          return matchesTerm && matchesStatus && matchesDate;
        });

        const filteredVideos = (Array.isArray(videosData) ? videosData : (videosData.data || [])).filter(v => {
          const matchesTerm = (v.title || '').toLowerCase().includes(term) ||
            (v.category || '').toLowerCase().includes(term);
            
          // Videos don't strictly have an 'active' status in the same way, but we can assume checks
          const matchesDate = activeFilters.dateRange === 'all' || 
            (activeFilters.dateRange === 'month' && isThisMonth(v.created_at));
            
          return matchesTerm && matchesDate;
        });

        const filteredCerts = (Array.isArray(certsData) ? certsData : []).filter(c => {
          const matchesTerm = (c.name || '').toLowerCase().includes(term) ||
            (c.description || '').toLowerCase().includes(term);
            
          const matchesDate = activeFilters.dateRange === 'all' || 
            (activeFilters.dateRange === 'month' && isThisMonth(c.created_at));
            
          return matchesTerm && matchesDate;
        });

        setSearchResults({
          users: filteredUsers,
          videos: filteredVideos,
          certifications: filteredCerts
        });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchTerm, activeFilters]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await reportService.getDashboardStats();
        if (data) {
          setStats(prev => ({ ...prev, ...data.stats }));
          setActivities(data.activities || []);
          setVideos(data.videos || []);
        }
      } catch (err) {
        console.error("Error loading dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (searchTerm && searchTerm.length >= 2) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Résultats de recherche</h2>
          <p className="text-sm text-gray-500">Pour "{searchTerm}"</p>
        </div>

        {isSearching ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Users Results */}
            {searchResults.users.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600"/> 
                    Utilisateurs ({searchResults.users.length})
                  </h3>
                  <button onClick={() => setCurrentPage('users')} className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline">
                    Gérer les utilisateurs
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.users.slice(0, 6).map(u => (
                    <div key={u.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                          {u.fullname ? u.fullname.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.fullname}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Videos Results */}
            {searchResults.videos.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Video className="w-5 h-5 text-gray-600"/> 
                    Vidéos ({searchResults.videos.length})
                  </h3>
                  <button onClick={() => setCurrentPage('videos')} className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline">
                    Gérer les vidéos
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.videos.slice(0, 6).map(v => (
                    <div key={v.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition">
                       <p className="font-bold text-gray-900 truncate">{v.title}</p>
                       <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                         {v.category}
                       </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications Results */}
            {searchResults.certifications.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Award className="w-5 h-5 text-gray-600"/> 
                    Certifications ({searchResults.certifications.length})
                  </h3>
                  <button onClick={() => setCurrentPage('certifications')} className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline">
                    Gérer les certifications
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.certifications.slice(0, 6).map(c => (
                    <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition">
                       <p className="font-bold text-gray-900">{c.name}</p>
                       <p className="text-sm text-gray-500 truncate mt-1">{c.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {searchResults.users.length === 0 && searchResults.videos.length === 0 && searchResults.certifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
                <Search className="w-12 h-12 mb-4 text-gray-300"/>
                <p className="text-lg font-medium text-gray-900">Aucun résultat trouvé</p>
                <p className="text-sm mt-1">Essayez avec d'autres mots-clés pour "{searchTerm}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  const monthlyGoal = 500;
  const goalProgress = Math.min((stats.monthlyCerts / monthlyGoal) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de la plateforme QuickPop</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage('reports')} className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.totalUsers}</h3>
          <p className="text-sm text-gray-600 mt-1 font-medium">Utilisateurs totaux</p>
          <p className="text-xs text-gray-500 mt-2">{stats.activeUsers} actifs ce mois</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.totalVideos}</h3>
          <p className="text-sm text-gray-600 mt-1 font-medium">Vidéos disponibles</p>
          <p className="text-xs text-gray-500 mt-2">{videos.length} ajoutées ce mois</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.completionRate}%</h3>
          <p className="text-sm text-gray-600 mt-1 font-medium">Taux de complétion</p>
          <p className="text-xs text-gray-500 mt-2">Score moyen: {stats.avgScore}%</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.certificatesIssued}</h3>
          <p className="text-sm text-gray-600 mt-1 font-medium">Certificats délivrés</p>
          <p className="text-xs text-gray-500 mt-2">{stats.monthlyCerts} ce mois</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Activité récente</h3>
            <button onClick={() => setCurrentPage('reports')} className="text-sm text-red-600 hover:text-red-700 font-medium">Voir tout</button>
        </div>
        <div className="space-y-4">
          {activities.length > 0 ? activities.map((activity, i) => (
            <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                activity.type === 'certification' ? 'bg-amber-100' :
                activity.type === 'completion' ? 'bg-green-100' :
                activity.type === 'start' ? 'bg-blue-100' : 
                activity.type === 'signup' ? 'bg-purple-100' :
                activity.type === 'upload' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {activity.type === 'certification' ? <Award className="w-5 h-5 text-amber-600" /> :
                 activity.type === 'completion' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                 activity.type === 'start' ? <PlayCircle className="w-5 h-5 text-blue-600" /> :
                 activity.type === 'signup' ? <Users className="w-5 h-5 text-purple-600" /> :
                 activity.type === 'upload' ? <Video className="w-5 h-5 text-red-600" /> :
                 <Eye className="w-5 h-5 text-gray-600" />}
              </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            )) : <p className="text-sm text-gray-500">Aucune activité récente.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top vidéos</h3>
            <div className="space-y-3">
              {videos.length > 0 ? videos.slice(0, 4).map((video, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{video.title}</p>
                      <p className="text-xs text-gray-500">{video.views} vues</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                </div>
              )) : <p className="text-sm text-gray-500">Aucune vidéo.</p>}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
            <Target className="w-10 h-10 mb-3 opacity-80" />
            <h3 className="text-lg font-bold mb-2">Objectif mensuel</h3>
            <p className="text-sm opacity-90 mb-4">{monthlyGoal} certifications ce mois</p>
            <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
              <div className="bg-white h-2 rounded-full" style={{ width: `${goalProgress}%` }}></div>
            </div>
            <p className="text-xs opacity-75">{stats.monthlyCerts} / {monthlyGoal} ({Math.round(goalProgress)}%)</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Temps d'apprentissage</p>
              <p className="text-xl font-bold text-gray-900">{stats.learningTime}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Modules terminés</p>
              <p className="text-xl font-bold text-gray-900">{stats.modulesCompleted}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Nouveaux apprenants</p>
              <p className="text-xl font-bold text-gray-900">{stats.newUsersThisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Satisfaction</p>
              <p className="text-xl font-bold text-gray-900">{stats.satisfactionRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
