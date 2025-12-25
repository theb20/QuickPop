import {
  Plus,
  MapPin,
  Award,
  Eye,
  Edit2,
  Trash2,
  UserCheck,
  Filter,
  ChevronDown,
  Search,
  AlertTriangle
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import * as userService from '../../../../config/services/users.js';
import { useSocket } from '../../../../config/context/useSocket';

const UsersPage = ({ openModal, refreshKey, restaurants = [], searchTerm: globalSearchTerm }) => {
  const { onlineUsers } = useSocket();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sync global search term if provided
  useEffect(() => {
    if (typeof globalSearchTerm !== 'undefined') {
      setSearchTerm(globalSearchTerm);
    }
  }, [globalSearchTerm]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [filterRestaurant, setFilterRestaurant] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  /* ===================== DATA ===================== */

  const loadUsers = useCallback(async () => {
    try {
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
      setSelectedUsers(new Set());
    } catch (error) {
      console.error('Error loading users', error);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [refreshKey, loadUsers]);

  /* ===================== ACTIONS ===================== */

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    await userService.deleteUser(id);
    loadUsers();
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (id) => {
    const next = new Set(selectedUsers);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedUsers(next);
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Supprimer ${selectedUsers.size} utilisateurs ?`)) return;
    await Promise.all([...selectedUsers].map(id => userService.deleteUser(id)));
    loadUsers();
  };

  const handleBulkStatus = async (isActive) => {
    if (!window.confirm('Confirmer l’action ?')) return;
    await Promise.all(
      [...selectedUsers].map(id =>
        userService.updateUser(id, { is_active: isActive })
      )
    );
    loadUsers();
  };

  /* ===================== FILTERS ===================== */

  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    const matchSearch =
      user.fullname?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.code?.toString().includes(search);

    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'Actif' && user.is_active) ||
      (filterStatus === 'Inactif' && !user.is_active);

    const matchRole =
      filterRole === 'all' || user.role === filterRole;

    const matchRestaurant =
      filterRestaurant === 'all' ||
      user.restaurant === filterRestaurant;

    return matchSearch && matchStatus && matchRole && matchRestaurant;
  });

  /* ===================== RENDER ===================== */

  return (
    <div className="w-full space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des utilisateurs
          </h1>
          <p className="text-sm text-gray-500">
            {filteredUsers.length} utilisateur(s)
          </p>
        </div>

        <button
          onClick={() => openModal('add-user')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white w-full rounded-xl border p-4 space-y-4">
        {selectedUsers.size > 0 ? (
          <div className="flex items-center justify-between bg-red-50 p-2 rounded-lg -m-2">
            <div className="flex items-center gap-3 px-2">
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {selectedUsers.size}
              </span>
              <span className="text-sm font-medium text-red-900">
                Sélectionnés
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Validation en masse désactivée pour forcer la sélection du restaurant par utilisateur */}
              {/* <button
                onClick={() => handleBulkStatus(true)}
                className="p-2 hover:bg-white rounded-lg text-green-700 transition"
                title="Activer la sélection"
              >
                <UserCheck className="w-4 h-4" />
              </button> */}
              <button
                onClick={() => handleBulkStatus(false)}
                className="p-2 hover:bg-white rounded-lg text-amber-700 transition"
                title="Désactiver la sélection"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-red-200 mx-1" />
              <button
                onClick={handleBulkDelete}
                className="p-2 hover:bg-white rounded-lg text-red-700 transition"
                title="Supprimer la sélection"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filtres
              <ChevronDown
                className={`w-4 h-4 transition ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        )}

        {showFilters && selectedUsers.size === 0 && (
          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Tous statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>

            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Tous rôles</option>
              <option value="admin">Admin</option>
              <option value="user">Utilisateur</option>
            </select>

            <select
              value={filterRestaurant}
              onChange={e => setFilterRestaurant(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">Tous restaurants</option>
              {restaurants.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TABLE DESKTOP */}
      <div className="hidden sm:block w-full bg-white rounded-xl border overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="p-3 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredUsers.length > 0 &&
                    selectedUsers.size === filteredUsers.length
                  }
                />
              </th>
              <th className="p-3 text-left">Utilisateur</th>
              <th className="p-3 text-left">Restaurant</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredUsers.map(user => (
              <tr
                key={user.id}
                className={`hover:bg-gray-50 ${
                  selectedUsers.has(user.id) ? 'bg-red-50' : ''
                }`}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user.fullname}</p>
                    {onlineUsers && onlineUsers.some(id => String(id) === String(user.id)) && (
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="En ligne"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {user.restaurant || 'N/A'}
                  </div>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {user.is_active ? 'Actif' : 'En attente'}
                  </span>
                </td>

                <td className="p-3 text-right">
                  <div className="inline-flex gap-2">
                    {!user.is_active && (
                      <button
                        onClick={() => openModal('validate-user', user)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => openModal('assign-cert', user)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded"
                      title="Attribuer une certification"
                    >
                      <Award className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal('view-user', user)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openModal('edit-user', user)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE LIST VIEW */}
      <div className="sm:hidden space-y-4">
        {filteredUsers.map(user => (
          <div 
            key={user.id} 
            className={`bg-white p-4 rounded-xl border shadow-sm ${selectedUsers.has(user.id) ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.has(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{user.fullname}</h3>
                    {onlineUsers && onlineUsers.some(id => String(id) === String(user.id)) && (
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="En ligne"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full font-medium ${
                  user.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {user.is_active ? 'Actif' : 'En attente'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
              <MapPin className="w-4 h-4 text-gray-400" />
              {user.restaurant || 'N/A'}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              {!user.is_active && (
                <button
                  onClick={() => openModal('validate-user', user)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg bg-green-50/50"
                  title="Valider"
                >
                  <UserCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => openModal('assign-cert', user)}
                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg bg-amber-50/50"
                title="Certifier"
              >
                <Award className="w-4 h-4" />
              </button>
              <button
                onClick={() => openModal('view-user', user)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg bg-gray-50"
                title="Voir"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => openModal('edit-user', user)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg bg-blue-50/50"
                title="Éditer"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg bg-red-50/50"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default UsersPage;
