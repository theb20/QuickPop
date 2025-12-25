 import { Send, Download, Upload, AlertTriangle, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import api from '../../../../config/api.js';
import * as notificationService from '../../../../config/services/notifications.js';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const [platformName, setPlatformName] = useState('QuickPop');
  const [contactEmail, setContactEmail] = useState('contact@quickpop.fr');
  const [language, setLanguage] = useState('Français');
  const [notifications, setNotifications] = useState([
    { label: 'Nouveaux utilisateurs', checked: true },
    { label: 'Certifications obtenues', checked: true },
    { label: 'Modules complétés', checked: false },
    { label: 'Rapports hebdomadaires', checked: true }
  ]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/app-settings/global');
      if (response) {
        const data = response;
        setPlatformName(data.app_name || 'QuickPop');
        setContactEmail(data.support_email || 'contact@quickpop.fr');
        setLanguage(data.default_language || 'Français');
        if (data.notification_preferences) {
          // Merge with defaults to ensure all keys exist
          const savedPrefs = typeof data.notification_preferences === 'string' 
            ? JSON.parse(data.notification_preferences) 
            : data.notification_preferences;
          
          setNotifications(prev => prev.map(p => {
             const found = savedPrefs.find(s => s.label === p.label);
             return found ? found : p;
          }));
        }
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  const toggleNotification = (index) => {
    setNotifications((prev) => prev.map((n, i) => (i === index ? { ...n, checked: !n.checked } : n)));
    setSaved(false);
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        app_name: platformName,
        support_email: contactEmail,
        default_language: language,
        notification_preferences: JSON.stringify(notifications)
      };

      await api.put('/app-settings/global', payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  const handleImportUsers = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Try parsing as JSON first
          let users = [];
          try {
            const json = JSON.parse(e.target.result);
            users = Array.isArray(json) ? json : (json.users || []);
          } catch (err) {
            console.warn('JSON parse failed, trying CSV', err);
            // Simple CSV fallback if JSON fails
            // Assuming CSV format: fullname,email,password,role
            const text = e.target.result;
            const lines = text.split('\n');
            // Skip header if present (simple heuristic: check if first line contains "email")
            const start = lines[0].toLowerCase().includes('email') ? 1 : 0;
            
            for (let i = start; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;
              const parts = line.split(',');
              if (parts.length >= 3) {
                users.push({
                  fullname: parts[0].trim(),
                  email: parts[1].trim(),
                  password: parts[2].trim(),
                  role: parts[3]?.trim() || 'user'
                });
              }
            }
          }

          if (users.length === 0) {
            alert("Aucun utilisateur valide trouvé dans le fichier.");
            return;
          }

          const response = await api.post('/app-settings/import-users', { users });
          alert(response.message);
        } catch (error) {
          alert("Erreur de lecture du fichier : " + error.message);
        }
      };
      reader.readAsText(file);
      event.target.value = null; // Reset input
    }
  };

  const handleExportData = async () => {
    try {
      const response = await api.get('/app-settings/global');
      const settings = response;
      
      const data = {
        platform: settings,
        exportDate: new Date().toISOString()
      };
      
      const fileName = `quickpop_export_${new Date().toISOString().slice(0, 10)}.json`;
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'export");
    }
  };

  const handleSendNotification = async () => {
    const message = prompt("Entrez le message de la notification globale :");
    if (message) {
      try {
        await notificationService.sendBroadcastNotification({
            title: 'Message Admin',
            body: message,
            type: 'info'
        });
        alert(`Notification envoyée à tous les utilisateurs : "${message}"`);
      } catch (error) {
        console.error("Failed to send notification", error);
        alert("Erreur lors de l'envoi de la notification");
      }
    }
  };

  const handleResetData = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action est irréversible et effacera tous les utilisateurs, vidéos et certifications.")) {
      if (window.confirm("Confirmez-vous vraiment la suppression TOTALE ?")) {
        try {
          await api.post('/app-settings/reset-data');
          alert("Réinitialisation effectuée avec succès.");
          navigate('/login');
        } catch {
          alert("Erreur serveur.");
        }
      }
    }
  };

   return (
     <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Paramètres</h2>
        <p className="text-sm text-gray-500 mt-1">Configurez votre plateforme QuickPop</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Paramètres généraux</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la plateforme</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={handleInputChange(setPlatformName)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={handleInputChange(setContactEmail)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Langue par défaut</label>
                <select
                  value={language}
                  onChange={handleInputChange(setLanguage)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option>Français</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-3">
              {notifications.map((item, i) => (
                <label
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                >
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleNotification(i)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".csv,.json,.xlsx"
              />
              <button
                onClick={handleImportUsers}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition"
              >
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Importer des utilisateurs</span>
              </button>
              <button
                onClick={handleExportData}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition"
              >
                <Download className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Exporter les données</span>
              </button>
              <button
                onClick={handleSendNotification}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition"
              >
                <Send className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Envoyer une notification</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-amber-900">Zone dangereuse</h3>
            </div>
            <p className="text-sm text-amber-700 mb-4">Actions irréversibles nécessitant une confirmation</p>
            <button 
              onClick={handleResetData}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              Réinitialiser les données
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {saved && (
          <span className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
            Paramètres enregistrés
          </span>
        )}
        <div className="flex justify-end gap-3 ml-auto">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            onClick={() => navigate('/backoffice')}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition text-sm font-medium flex items-center gap-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
     </div>
    </div>
   );
  };

 export default SettingsPage;
