import React, { useState, useEffect } from 'react';
import { Shield, Key, ToggleLeft, ToggleRight, TestTube, Save, Edit3, AlertCircle, CheckCircle } from 'lucide-react';
import { lumensecAPI } from '../services/api';

const M365Config: React.FC = () => {
  const [credentials, setCredentials] = useState({
    client_id: '',
    client_secret: '',
    m365_tenant_id: ''
  });
  const [hasCredentials, setHasCredentials] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const data = await lumensecAPI.getM365Credentials();
      setHasCredentials(data.has_credentials);
      if (data.has_credentials) {
        setCredentials({
          client_id: data.client_id || '',
          client_secret: '', // On ne récupère jamais le secret en clair
          m365_tenant_id: data.m365_tenant_id || ''
        });
        setIsActive(data.active);
      }
    } catch (err) {
      console.error('Erreur chargement credentials:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const result = await lumensecAPI.saveM365Credentials(credentials);
      if (result.success) {
        setMessage({text: "Configuration sauvegardée avec succès !", type: 'success'});
        setHasCredentials(true);
        setIsActive(true);
        setShowForm(false);
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({text: result.errors?.join(', ') || "Erreur lors de la sauvegarde", type: 'error'});
      }
    } catch (err: any) {
      setMessage({text: err.message || "Erreur de connexion au serveur", type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    setMessage(null);
    
    try {
      const result = await lumensecAPI.testM365Connection();
      if (result.success) {
        setMessage({text: "Connexion test réussie ! ✓", type: 'success'});
      } else {
        setMessage({text: "Échec du test : " + result.error, type: 'error'});
      }
    } catch (err: any) {
      setMessage({text: "Erreur lors du test : " + err.message, type: 'error'});
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleToggle = async () => {
    setLoading(true);
    try {
      const result = await lumensecAPI.toggleM365Mode();
      if (result.success) {
        setIsActive(result.active);
        setMessage({
          text: `Mode ${result.mode.toUpperCase()} activé ${result.active ? '(API Microsoft Graph réelle)' : '(Données simulées)'}`,
          type: 'success'
        });
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({text: result.error || "Erreur lors du changement de mode", type: 'error'});
      }
    } catch (err: any) {
      setMessage({text: "Erreur : " + err.message, type: 'error'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-8 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30">
            <Shield className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">
              Configuration Microsoft 365
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              {hasCredentials 
                ? `Connecté • Mode ${isActive ? 'PRODUCTION' : 'SIMULATION'}` 
                : 'Non configuré • Mode Simulation uniquement'}
            </p>
          </div>
        </div>
        
        {hasCredentials && (
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
              isActive 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
            } disabled:opacity-50`}
          >
            {isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            {isActive ? 'Mode Live ON' : 'Mode Mock'}
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-emerald-900/20 border border-emerald-500/30 text-emerald-400'
            : 'bg-red-900/20 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {!showForm && !hasCredentials && (
        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
          <p className="text-slate-300 mb-4">
            Connectez votre tenant Microsoft 365 pour obtenir des alertes de sécurité réelles via l'API Microsoft Graph.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Key className="w-5 h-5" />
            Configurer la connexion M365
          </button>
        </div>
      )}

      {!showForm && hasCredentials && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Modifier la configuration
          </button>
          <button
            onClick={handleTest}
            disabled={loading}
            className="flex-1 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <TestTube className="w-4 h-4" />
            {loading ? 'Test en cours...' : 'Tester la connexion'}
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
              <Key className="w-3 h-3" />
              Client ID (Azure AD App)
            </label>
            <input
              type="text"
              value={credentials.client_id}
              onChange={(e) => setCredentials({...credentials, client_id: e.target.value})}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              required
            />
          </div>
          
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Client Secret
            </label>
            <input
              type="password"
              value={credentials.client_secret}
              onChange={(e) => setCredentials({...credentials, client_secret: e.target.value})}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              placeholder="••••••••••••••••"
              required={!hasCredentials}
            />
            {hasCredentials && (
              <p className="text-xs text-slate-500 mt-2">Laissez vide pour conserver le secret actuel</p>
            )}
          </div>
          
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
            <label className="block text-slate-400 text-xs uppercase tracking-wider mb-2">
              Tenant ID (votre organisation M365)
            </label>
            <input
              type="text"
              value={credentials.m365_tenant_id}
              onChange={(e) => setCredentials({...credentials, m365_tenant_id: e.target.value})}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              placeholder="votre-entreprise.onmicrosoft.com ou ID"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default M365Config;
