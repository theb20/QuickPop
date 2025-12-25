 import { Plus, BarChart3, Users, Award, Download, FileText, Filter, Loader, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import * as reportService from '../../../../config/services/reports.js';

const ReportsPage = ({ searchTerm: globalSearchTerm }) => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    if (typeof globalSearchTerm !== 'undefined') {
      setSearch(globalSearchTerm);
    }
  }, [globalSearchTerm]);

  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reportData, setReportData] = useState(null);

  const filteredReports = reports.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleGenerate = async (type = 'Personnalisé') => {
    setGenerating(true);
    try {
      const data = await reportService.generateReport(type);
      const newReport = {
        id: reports.length ? Math.max(...reports.map(r => r.id)) + 1 : 1,
        title: data.title,
        date: data.date,
        type: data.type,
        status: data.status,
        data: data.data // Store detailed data
      };
      setReports(prev => [newReport, ...prev]);
      setReportData(newReport); // Show immediate result if desired
      setModalOpen(true); // Optional: open modal to show result immediately
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération du rapport");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (report) => {
    if (!report.data) {
        alert("Ce rapport ne contient aucune donnée à télécharger.");
        return;
    }

    const fileName = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rapports et analyses</h2>
          <p className="text-sm text-gray-500 mt-1">Exportez et analysez vos données</p>
        </div>
        <button onClick={() => handleGenerate('Mensuel')} className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium disabled:opacity-60" disabled={generating}>
          {generating ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {generating ? 'Génération…' : 'Nouveau rapport'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          {/* Local search removed in favor of global search, but kept for fallback or mobile if needed */}
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
          {filteredReports.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Aucun rapport généré récemment.
            </div>
          )}
        </div>
      </div>
      
      {/* Report Modal */}
      {modalOpen && reportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                    <h3 className="text-lg font-bold text-gray-900">{reportData.title}</h3>
                    <div className="flex gap-2">
                        <button onClick={() => handleDownload(reportData)} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Télécharger">
                            <Download className="w-5 h-5 text-gray-600" />
                        </button>
                        <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition" title="Fermer">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Résumé</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(reportData.data || {}).map(([key, value]) => {
                                if (typeof value === 'object' && value !== null && !Array.isArray(value)) return null; // Skip complex objects for simple view
                                if (Array.isArray(value)) return null; // Skip arrays
                                return (
                                    <div key={key}>
                                        <p className="text-xs text-gray-500 uppercase">{key.replace(/_/g, ' ')}</p>
                                        <p className="text-lg font-bold">{value}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    {/* Render Arrays (like Top Users or Popular Certs) */}
                    {Object.entries(reportData.data || {}).map(([key, value]) => {
                        if (!Array.isArray(value)) return null;
                        return (
                            <div key={key} className="mt-4">
                                <h4 className="font-semibold mb-2 capitalize">{key.replace(/_/g, ' ')}</h4>
                                <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            {Object.keys(value[0] || {}).map(k => (
                                                <th key={k} className="px-4 py-2 capitalize">{k.replace(/_/g, ' ')}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {value.map((item, idx) => (
                                            <tr key={idx} className="border-t border-gray-200">
                                                {Object.values(item).map((v, i) => (
                                                    <td key={i} className="px-4 py-2">{v}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
      )}
    </div>
  );
 };

 export default ReportsPage;
