import React, { useState, useEffect } from 'react';
import { lumensecAPI } from '../services/api';

interface M365Alert {
  alert_id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  status: 'new_alert' | 'in_progress' | 'resolved' | 'dismissed';
  category: 'phishing' | 'suspiciousLogin' | 'malware' | 'dataExfiltration' | string;
  user_email: string;
  ip_address: string | null;
  detected_at: string;
  recommended_action: string;
}

interface AIAnalysis {
  threat_score: number;
  is_false_positive: boolean;
  recommended_action: 'monitor' | 'isolate' | 'block' | 'destroy';
  explanation: string;
  indicators: string[];
}

const M365Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<M365Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [aiResults, setAiResults] = useState<Record<string, AIAnalysis>>({});
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await lumensecAPI.getM365Alerts();
      setAlerts(data.alerts || []);
      setError(null);
    } catch (err) {
      setError("Erreur de connexion à M365 Security");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeWithAI = async (alert: M365Alert) => { console.log("ALERT STRUCTURE:", JSON.stringify(alert));
    try {
      setAnalyzing(alert.id);
      const data = await lumensecAPI.analyzeWithAI(alert.id);
      const analysis = data.results[0];
      setAiResults(prev => ({...prev, [alert.id]: analysis}));
      setMessage(`✅ Analyse IA terminée pour ${alert.id}`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de l'analyse IA");
      setTimeout(() => setError(null), 3000);
    } finally {
      setAnalyzing(null);
    }
  };

  const updateStatus = async (alertId: string, newStatus: string) => {
    try {
      setUpdating(alertId);
      await lumensecAPI.updateAlertStatus(alertId, newStatus);
      setAlerts(alerts.map(alert => alert.id === alertId ? { ...alert, status: newStatus as M365Alert['status'] } : alert));
      setMessage(`Alerte ${alertId} mise à jour`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de la mise à jour");
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdating(null);
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 85) return 'text-red-500';
    if (score >= 60) return 'text-orange-500';
    if (score >= 30) return 'text-yellow-500';
    return 'text-emerald-500';
  };

  const getAIActionLabel = (action: string) => {
    const labels: Record<string, string> = {monitor: '👁️ Surveiller', isolate: '🔒 Isoler', block: '🚫 Bloquer', destroy: '💥 Détruire'};
    return labels[action] || action;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new_alert': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'dismissed': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new_alert': return 'Nouveau';
      case 'in_progress': return 'En cours';
      case 'resolved': return 'Résolu';
      case 'dismissed': return 'Ignoré';
      default: return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'phishing': return '🎣';
      case 'suspiciousLogin': return '🔑';
      case 'malware': return '🦠';
      case 'dataExfiltration': return '📤';
      default: return '⚠️';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
  };

  if (loading) {
    return (<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div></div>);
  }

  return (
    <div className="space-y-6">
      {message && (<div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg">{message}</div>)}
      {error && (<div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">{error}</div>)}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Alertes M365 Security</h2>
        <button onClick={fetchAlerts} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">🔄 Rafraîchir</button>
      </div>
      <div className="space-y-4">
        {alerts.length === 0 ? (<div className="text-center py-12 text-slate-400">Aucune alerte détectée</div>) : (
          alerts.map((alert) => (
            <div key={alert.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">{getCategoryIcon(alert.category)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>{alert.severity.toUpperCase()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>{getStatusLabel(alert.status)}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm text-slate-400 bg-slate-900/50 p-4 rounded-lg">
                <div><span className="text-slate-500">Utilisateur:</span><p className="text-slate-200">{alert.user_email}</p></div>
                <div><span className="text-slate-500">IP:</span><p className="text-slate-200">{alert.ip_address || 'N/A'}</p></div>
                <div><span className="text-slate-500">Détecté:</span><p className="text-slate-200">{formatDate(alert.detected_at)}</p></div>
              </div>
              {aiResults[alert.id] && (
                <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-purple-300 font-semibold flex items-center gap-2">🧠 Analyse IA - Système Immunitaire</h4>
                    <div className={`text-2xl font-bold ${getAIScoreColor(aiResults[alert.id].threat_score)}`}>{aiResults[alert.id].threat_score}/100</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div><span className="text-slate-400 text-sm">Action recommandée:</span><p className="text-white font-medium">{getAIActionLabel(aiResults[alert.id].recommended_action)}</p></div>
                    <div><span className="text-slate-400 text-sm">Faux positif:</span><p className={aiResults[alert.id].is_false_positive ? 'text-yellow-400' : 'text-emerald-400'}>{aiResults[alert.id].is_false_positive ? '⚠️ Oui (probable)' : '✅ Non (menace réelle)'}</p></div>
                  </div>
                  <p className="text-slate-300 text-sm italic border-t border-slate-700 pt-2">"{aiResults[alert.id].explanation}"</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <div className="flex space-x-2">
                  {alert.status === 'new_alert' && (<button onClick={() => updateStatus(alert.id, 'in_progress')} disabled={updating === alert.id} className="px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg text-sm transition-colors disabled:opacity-50">{updating === alert.id ? '...' : 'Prendre en charge'}</button>)}
                  {alert.status === 'in_progress' && (<><button onClick={() => updateStatus(alert.id, 'resolved')} disabled={updating === alert.id} className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-sm transition-colors disabled:opacity-50">{updating === alert.id ? '...' : 'Résoudre'}</button><button onClick={() => updateStatus(alert.id, 'dismissed')} disabled={updating === alert.id} className="px-4 py-2 bg-slate-600/20 hover:bg-slate-600/30 text-slate-400 rounded-lg text-sm transition-colors disabled:opacity-50">Ignorer</button></>)}
                </div>
                <button onClick={() => analyzeWithAI(alert)} disabled={analyzing === alert.id} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-2">
                  {analyzing === alert.id ? (<><div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div>Analyse...</>) : (<>🔍 Analyser avec IA</>)}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default M365Alerts;