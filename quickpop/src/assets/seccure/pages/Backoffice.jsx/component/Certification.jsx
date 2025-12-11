  import { Award, MoreVertical, Plus } from 'lucide-react';

  const certifications = [
    { id: 1, name: 'Hygiène alimentaire HACCP', issued: 245, validity: '12 mois', status: 'Actif', modules: 4, passingScore: 80, description: 'Certification obligatoire en hygiène alimentaire' },
    { id: 2, name: 'Caisse et encaissement', issued: 412, validity: '12 mois', status: 'Actif', modules: 3, passingScore: 75, description: 'Maîtrise des procédures de caisse' },
    { id: 3, name: 'Service client', issued: 356, validity: '6 mois', status: 'Actif', modules: 5, passingScore: 70, description: 'Excellence du service client Quick' },
    { id: 4, name: 'Sécurité incendie', issued: 198, validity: '24 mois', status: 'Actif', modules: 2, passingScore: 85, description: 'Prévention et sécurité incendie' },
    { id: 5, name: 'Manager de restaurant', issued: 87, validity: '18 mois', status: 'Actif', modules: 8, passingScore: 80, description: 'Compétences managériales avancées' },
    { id: 6, name: 'Formateur interne', issued: 34, validity: '12 mois', status: 'Actif', modules: 6, passingScore: 85, description: 'Formation de formateurs' }
  ];
const CertificationsPage = () => {
    const totalUsers = 1847;
    return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des certifications</h2>
          <p className="text-sm text-gray-500 mt-1">{certifications.length} certifications actives</p>
        </div>
        <button 
          onClick={() => {
            console.log('Créer une certification');
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Créer une certification
        </button>
      </div>

      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {certifications.map(cert => (
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
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                      {cert.modules} modules
                    </span>
                    <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">
                      Score minimum: {cert.passingScore}%
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                      Validité: {cert.validity}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  console.log('Voir certification', cert);
                }}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{cert.issued}</p>
                  <p className="text-xs text-gray-500 mt-1">Certificats délivrés</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((cert.issued / totalUsers) * 100)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Taux d'obtention</p>
                </div>
              </div>
              <span className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-full font-semibold">
                {cert.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsPage;
