 import { Send, Download, Upload, AlertTriangle, Save } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
 import { useState, useEffect } from 'react';

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

   useEffect(() => {
     setSaved(false);
   }, [platformName, contactEmail, language, notifications]);

   const toggleNotification = (index) => {
     setNotifications((prev) => prev.map((n, i) => (i === index ? { ...n, checked: !n.checked } : n)));
   };

   const handleSave = async () => {
     setSaving(true);
     await new Promise((r) => setTimeout(r, 600));
     // Ici on pourrait persister vers une API ou localStorage
     setSaving(false);
     setSaved(true);
   };

   const handleImportUsers = () => {
     // Brancher vers la modale d’import si disponible
     console.log('Importer des utilisateurs');
   };
   const handleExportData = () => {
     console.log('Exporter les données');
   };
   const handleSendNotification = () => {
     console.log('Envoyer une notification');
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
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email de contact</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Langue par défaut</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
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
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
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
