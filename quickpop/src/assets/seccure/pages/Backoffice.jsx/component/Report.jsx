 import { Plus, BarChart3, Users, Award, Download, FileText, Filter } from 'lucide-react';
 import { useState } from 'react';

 const ReportsPage = () => {
   const [reports, setReports] = useState([
     { id: 1, title: 'Rapport mensuel - Novembre', date: '2025-11-30', type: 'Mensuel', status: 'Complété' },
     { id: 2, title: 'Statistiques utilisateurs - Semaine 49', date: '2025-12-08', type: 'Utilisateurs', status: 'Complété' },
     { id: 3, title: 'Suivi certifications - Q4', date: '2025-12-01', type: 'Certifications', status: 'En cours' },
   ]);
   const [search, setSearch] = useState('');
   const [typeFilter, setTypeFilter] = useState('all');
   const [statusFilter, setStatusFilter] = useState('all');
   const [generating, setGenerating] = useState(false);

   const filteredReports = reports.filter((r) => {
     const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
     const matchesType = typeFilter === 'all' || r.type === typeFilter;
     const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
     return matchesSearch && matchesType && matchesStatus;
   });

   const handleGenerate = (type = 'Personnalisé') => {
     setGenerating(true);
     const newReport = {
       id: reports.length ? Math.max(...reports.map(r => r.id)) + 1 : 1,
       title: `${type} - ${new Date().toLocaleDateString('fr-FR')}`,
       date: new Date().toISOString().slice(0,10),
       type,
       status: 'En cours',
     };
     setReports(prev => [newReport, ...prev]);
     setTimeout(() => {
       setReports(prev => prev.map(r => r.id === newReport.id ? { ...r, status: 'Complété' } : r));
       setGenerating(false);
     }, 1200);
   };

   const handleDownload = (report) => {
     console.log('Téléchargement du rapport', report);
   };

   return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rapports et analyses</h2>
          <p className="text-sm text-gray-500 mt-1">Exportez et analysez vos données</p>
        </div>
        <button onClick={() => handleGenerate('Personnalisé')} className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium disabled:opacity-60" disabled={generating}>
          <Plus className="w-4 h-4" />
          {generating ? 'Génération…' : 'Nouveau rapport'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un rapport..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
            <Filter className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          </div>
        </div>
        <div className="flex gap-2">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="all">Tous les types</option>
            <option value="Mensuel">Mensuel</option>
            <option value="Utilisateurs">Utilisateurs</option>
            <option value="Certifications">Certifications</option>
            <option value="Personnalisé">Personnalisé</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="all">Tous les statuts</option>
            <option value="Complété">Complété</option>
            <option value="En cours">En cours</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Rapport mensuel</h3>
          <p className="text-sm text-gray-500 mb-4">Vue d'ensemble des activités du mois</p>
          <button onClick={() => handleGenerate('Mensuel')} className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
            Générer
            <Download className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Statistiques utilisateurs</h3>
          <p className="text-sm text-gray-500 mb-4">Analyse détaillée des utilisateurs</p>
          <button onClick={() => handleGenerate('Utilisateurs')} className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
            Générer
            <Download className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Suivi certifications</h3>
          <p className="text-sm text-gray-500 mb-4">Rapport sur les certifications obtenues</p>
          <button onClick={() => handleGenerate('Certifications')} className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
            Générer
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Rapports récents</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReports.map(report => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{report.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{report.date}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{report.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  report.status === 'Complété' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {report.status}
                </span>
                <button onClick={() => handleDownload(report)} className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
 };

 export default ReportsPage;
