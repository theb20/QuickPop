  import React, { useState, useEffect } from 'react';
import { Award, MoreVertical, Plus, Trash2, Edit2, Users } from 'lucide-react';
import * as certService from '../../../../config/services/certifications.js';

const CertificationsPage = ({ openModal, refreshKey, searchTerm: globalSearchTerm }) => {
  const [certifications, setCertifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (typeof globalSearchTerm !== 'undefined') {
      setSearchTerm(globalSearchTerm);
    }
  }, [globalSearchTerm]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await certService.getCertifications();
        setCertifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading certifications", error);
        setCertifications([]);
      }
    };
    loadData();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (window.confirm("Attention : Cette action est irréversible et supprimera également tous les certificats délivrés aux utilisateurs.\n\nÊtes-vous sûr de vouloir supprimer cette certification ?")) {
      try {
        await certService.deleteCertification(id);
        const data = await certService.getCertifications();
        setCertifications(data);
      } catch (error) {
        console.error("Error deleting certification", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const filteredCertifications = certifications.filter(cert =>
    (cert.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cert.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des certifications</h2>
          <p className="text-sm text-gray-500 mt-1">{filteredCertifications.length} certifications actives</p>
        </div>
       
      </div>

      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {filteredCertifications.map(cert => (
          <div key={cert.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{cert.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{cert.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                      Validité: {cert.validity_months} mois
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => openModal('view-cert', cert)}
                  className="p-1 hover:bg-gray-100 rounded transition"
                  title="Voir les titulaires"
                >
                  <Users className="w-4 h-4 text-gray-600" />
                </button>
               
                
              </div>
            </div>
            <div 
              className="flex items-center justify-between pt-4 border-t border-gray-200 cursor-pointer hover:bg-gray-50 transition rounded-b-xl -mx-6 px-6 -mb-6 pb-6 mt-4"
              onClick={() => openModal('view-cert', cert)}
            >
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{cert.issued_count || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Certificats délivrés</p>
                </div>
              </div>
              <span className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-full font-semibold">
                Actif
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsPage;

