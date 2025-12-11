import React, { useState } from 'react';
import { User, Building2, MapPin, Mail, Phone, Calendar, Clock, Award, BookOpen, TrendingUp, LayoutDashboard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function QuickPopProfile() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate()
  
  const profile = {
    name: 'Sophie Martin',
    role: 'Équipier polyvalent',
    employeeId: 'QR-2024-1847',
    restaurant: 'Quick Reims Centre',
    department: 'Service & Caisse',
    email: 'sophie.martin@quick.fr',
    phone: '+33 6 12 34 56 78',
    joinDate: '15 mars 2024',
    manager: 'Pierre Durand',
    stats: {
      completionRate: 85,
      totalHours: 42.5,
      certificatesEarned: 12,
      averageScore: 92
    },
    certifications: [
      { name: 'Hygiène et sécurité alimentaire', date: '10/12/2024', status: 'Valide', validUntil: '10/12/2025' },
      { name: 'Procédures de caisse', date: '05/12/2024', status: 'Valide', validUntil: '05/12/2025' },
      { name: 'Service client excellence', date: '28/11/2024', status: 'Valide', validUntil: '28/11/2025' },
      { name: 'Gestion des commandes drive', date: '20/11/2024', status: 'Valide', validUntil: '20/11/2025' }
    ],
    recentActivity: [
      { module: 'Ouverture & Fermeture', completed: '08/12/2024', score: 95, duration: '25 min' },
      { module: 'Gestion des stocks', completed: '05/12/2024', score: 88, duration: '30 min' },
      { module: 'Normes HACCP', completed: '01/12/2024', score: 92, duration: '45 min' }
    ],
    inProgress: [
      { module: 'Management d\'équipe', progress: 60, estimatedTime: '2h 15min' },
      { module: 'Procédures d\'urgence', progress: 35, estimatedTime: '1h 30min' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-full overflow-hidden flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                    <img src="/imgs/logo-mb.png" alt="Logo quick" />
                </span>
              </div>
              <div>
                <h1 className="text-xl font-semibold font-bold text-gray-900">Quick  <span className="font-bold text-red-600">Pop</span></h1>
                <p className="text-xs text-gray-500">Formation & Développement</p>
              </div>
            </div>
            <div className="flex items-center gap-3 cursor-pointer">
              <button onClick={() => navigate('/backoffice')} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <LayoutDashboard className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{profile.role}</p>
                <p className="text-xs text-gray-500 mt-1">ID: {profile.employeeId}</p>
                <div className="w-full mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs">{profile.restaurant}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">{profile.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Depuis le {profile.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600">{profile.phone}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Responsable</p>
                <p className="text-sm font-medium text-gray-900">{profile.manager}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Taux de complétion</p>
                    <p className="text-2xl font-bold text-gray-900">{profile.stats.completionRate}%</p>
                  </div>
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Heures totales</p>
                    <p className="text-2xl font-bold text-gray-900">{profile.stats.totalHours}h</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Certifications</p>
                    <p className="text-2xl font-bold text-gray-900">{profile.stats.certificatesEarned}</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Score moyen</p>
                    <p className="text-2xl font-bold text-gray-900">{profile.stats.averageScore}%</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex gap-8 px-6">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 text-sm font-medium border-b-2 transition ${
                      activeTab === 'overview'
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Vue d'ensemble
                  </button>
                  <button
                    onClick={() => setActiveTab('certifications')}
                    className={`py-4 text-sm font-medium border-b-2 transition ${
                      activeTab === 'certifications'
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Certifications
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`py-4 text-sm font-medium border-b-2 transition ${
                      activeTab === 'activity'
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Activité
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Formations en cours</h3>
                      <div className="space-y-4">
                        {profile.inProgress.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{item.module}</h4>
                                <p className="text-xs text-gray-500 mt-1">Temps restant estimé : {item.estimatedTime}</p>
                              </div>
                              <span className="text-xs font-semibold text-gray-900">{item.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div
                                className="bg-red-600 h-2 rounded-full transition-all"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'certifications' && (
                  <div>
                    <div className="space-y-3">
                      {profile.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                              <Award className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{cert.name}</h4>
                              <p className="text-xs text-gray-500 mt-1">Obtenu le {cert.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {cert.status}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">Valide jusqu'au {cert.validUntil}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Modules récemment complétés</h3>
                    <div className="space-y-3">
                      {profile.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{activity.module}</h4>
                            <p className="text-xs text-gray-500 mt-1">Complété le {activity.completed} • Durée : {activity.duration}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">{activity.score}%</div>
                            <p className="text-xs text-gray-500">Score</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}