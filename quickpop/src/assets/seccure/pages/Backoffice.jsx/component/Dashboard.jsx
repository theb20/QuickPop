import { Calendar, Download, Users, Video, TrendingUp, Award, CheckCircle, PlayCircle, Eye, Target, Clock, UserCheck, Star } from 'lucide-react';

  const Dashboard = () => {
    const stats = {
      totalUsers: 1847,
      activeUsers: 1290,
      totalVideos: 76,
      completionRate: 68,
      avgScore: 82,
      certificatesIssued: 340,
      learningTime: 124,
      modulesCompleted: 580,
      newUsersThisMonth: 45,
      satisfactionRate: 91,
    };

    const activities = [
      { type: 'certification', user: 'Sophie M.', action: 'a obtenu', item: 'Hygiène en cuisine', time: 'il y a 2h' },
      { type: 'completion', user: 'Lucas D.', action: 'a terminé', item: 'Accueillir le client', time: 'il y a 4h' },
      { type: 'start', user: 'Emma B.', action: 'a démarré', item: 'Gestion du rush', time: 'hier' },
      { type: 'view', user: 'Thomas P.', action: 'a consulté', item: 'Nouveaux fours', time: 'hier' },
    ];

    const videos = [
      { title: 'Hygiène en cuisine : bonnes pratiques', views: 1245 },
      { title: 'Accueillir le client avec le sourire', views: 980 },
      { title: 'Gestion du rush de midi', views: 1430 },
      { title: 'Utilisation des nouveaux fours', views: 560 },
    ];

    return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de la plateforme QuickPop</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Période</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium">
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
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+12%</span>
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
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+8%</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.totalVideos}</h3>
          <p className="text-sm text-gray-600 mt-1 font-medium">Vidéos disponibles</p>
          <p className="text-xs text-gray-500 mt-2">12 ajoutées ce mois</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+5%</span>
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
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">+18%</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.certificatesIssued}</h3>
          <p className="text-sm text-gray-600 mt-1 font-medium">Certificats délivrés</p>
          <p className="text-xs text-gray-500 mt-2">245 ce mois</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Activité récente</h3>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">Voir tout</button>
          </div>
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === 'certification' ? 'bg-amber-100' :
                  activity.type === 'completion' ? 'bg-green-100' :
                  activity.type === 'start' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {activity.type === 'certification' ? <Award className="w-5 h-5 text-amber-600" /> :
                   activity.type === 'completion' ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                   activity.type === 'start' ? <PlayCircle className="w-5 h-5 text-blue-600" /> :
                   <Eye className="w-5 h-5 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top vidéos</h3>
            <div className="space-y-3">
              {videos.slice(0, 4).map((video, i) => (
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
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
            <Target className="w-10 h-10 mb-3 opacity-80" />
            <h3 className="text-lg font-bold mb-2">Objectif mensuel</h3>
            <p className="text-sm opacity-90 mb-4">500 certifications ce mois</p>
            <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
            <p className="text-xs opacity-75">340 / 500 (68%)</p>
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
              <p className="text-sm text-gray-500">Modules complétés</p>
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
              <p className="text-sm text-gray-500">Nouveaux utilisateurs</p>
              <p className="text-xl font-bold text-gray-900">{stats.newUsersThisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
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
