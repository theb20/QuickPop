import { Plus, MapPin, Award, Eye, Edit2, Trash2, Download } from 'lucide-react';
import { useState } from 'react';

  const users = [
    { id: 1, name: 'Sophie Martin', email: 'sophie.martin@quick.fr', restaurant: 'Quick Reims', role: 'Équipier', status: 'Actif', progress: 85, lastActive: '2024-12-10', modules: 12, certs: 3, phone: '+33 6 12 34 56 78' },
    { id: 2, name: 'Lucas Dubois', email: 'lucas.dubois@quick.fr', restaurant: 'Quick Paris', role: 'Manager', status: 'Actif', progress: 92, lastActive: '2024-12-11', modules: 18, certs: 5, phone: '+33 6 23 45 67 89' },
    { id: 3, name: 'Emma Bernard', email: 'emma.bernard@quick.fr', restaurant: 'Quick Lyon', role: 'Équipier', status: 'Inactif', progress: 45, lastActive: '2024-11-28', modules: 6, certs: 1, phone: '+33 6 34 56 78 90' },
    { id: 4, name: 'Thomas Petit', email: 'thomas.petit@quick.fr', restaurant: 'Quick Marseille', role: 'Équipier', status: 'Actif', progress: 67, lastActive: '2024-12-09', modules: 9, certs: 2, phone: '+33 6 45 67 89 01' },
    { id: 5, name: 'Julie Moreau', email: 'julie.moreau@quick.fr', restaurant: 'Quick Reims', role: 'Manager', status: 'Actif', progress: 88, lastActive: '2024-12-11', modules: 15, certs: 4, phone: '+33 6 56 78 90 12' },
    { id: 6, name: 'Marc Leroy', email: 'marc.leroy@quick.fr', restaurant: 'Quick Toulouse', role: 'Équipier', status: 'Actif', progress: 73, lastActive: '2024-12-10', modules: 10, certs: 2, phone: '+33 6 67 89 01 23' },
    { id: 7, name: 'Céline Roux', email: 'celine.roux@quick.fr', restaurant: 'Quick Bordeaux', role: 'Formateur', status: 'Actif', progress: 95, lastActive: '2024-12-11', modules: 20, certs: 6, phone: '+33 6 78 90 12 34' }
  ];
const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const filteredUsers = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
            <p className="text-sm text-gray-500 mt-1">{filteredUsers.length} utilisateurs trouvés</p>
          </div>
          <button 
            onClick={() => {
              console.log('Ajouter un utilisateur');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Ajouter un utilisateur
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Utilisateur</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Restaurant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rôle</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Progression</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Certifications</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-700">{user.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{user.restaurant}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all" 
                            style={{ width: `${user.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12">{user.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-gray-700">{user.certs}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            console.log('Voir utilisateur', user);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

export default UsersPage;
