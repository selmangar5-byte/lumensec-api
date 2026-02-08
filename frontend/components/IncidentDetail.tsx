import React, { useState } from 'react';
import { Incident } from '../types';

interface Props {
  incident: Incident;
  onClose: () => void;
}

const IncidentDetail: React.FC<Props> = ({ incident, onClose }) => {
  if (!incident) return null;

  const [hash] = useState(() => {
    const chars = '0123456789abcdef';
    let h = 'sha256:';
    for (let i = 0; i < 56; i++) h += chars[Math.floor(Math.random() * chars.length)];
    return h;
  });

  // Mock assigné basé sur sévérité
  const assignedAnalysts = {
    1: 'Alice Chen (Senior)',
    2: 'Bob Martin (Analyst)',
    3: 'Carol Davis (Analyst)',
    4: 'David Lee (Junior)',
    5: 'Emma Wilson (Triage)'
  };
  const assignedTo = assignedAnalysts[incident.severity as keyof typeof assignedAnalysts] || 'Unassigned';

  const statusColor = {
    new: 'bg-red-500/20 text-red-400 border-red-500/40',
    triaging: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  }[incident.status] || 'bg-slate-800 text-slate-400';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-CA', { 
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleAction = (action: string) => {
    alert(`Action "${action}" sera implémentée prochainement`);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black text-white">Incident #{incident.id}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Status et Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                {incident.status.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Sévérité {incident.severity}
              </span>
            </div>
            
            {/* Actions rapides */}
            <div className="flex gap-2">
              <button 
                onClick={() => handleAction('Escalade')}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold transition-all"
              >
                ⚠️ Escalade
              </button>
              <button 
                onClick={() => handleAction('Résoudre')}
                className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold transition-all"
              >
                ✓ Résoudre
              </button>
              <button 
                onClick={() => handleAction('Faux positif')}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg text-xs font-bold transition-all"
              >
                ✕ Faux positif
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Détecté</p>
                <p className="text-white font-mono text-sm">{formatDate(incident.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Dernière mise à jour</p>
                <p className="text-white font-mono text-sm">{formatDate(incident.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Titre et Description */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{incident.summary}</h3>
            <p className="text-slate-400 leading-relaxed">{incident.narrative}</p>
          </div>

          {/* Assignation */}
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 font-bold">
                {assignedTo.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-slate-500">Assigné à</p>
                <p className="text-white font-semibold">{assignedTo}</p>
              </div>
            </div>
          </div>

          {/* Détails techniques */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Source</p>
              <p className="text-white font-mono text-sm">{incident.source}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">IP Source</p>
              <p className="text-white font-mono text-sm">{incident.source_ip}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Système cible</p>
              <p className="text-white font-mono text-sm">{incident.target_system}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Hash intégrité</p>
              <p className="text-emerald-400 font-mono text-xs break-all">{hash}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;