import React, { useState } from 'react';
import { Incident } from '../types';

interface Props {
  incident: Incident;
  onClose: () => void;
}

const IncidentDetail: React.FC<Props> = ({ incident, onClose }) => {
  const [hash] = useState(() => {
    const chars = '0123456789abcdef';
    let h = 'sha256:';
    for (let i = 0; i < 56; i++) h += chars[Math.floor(Math.random() * chars.length)];
    return h;
  });

  const statusColor = {
    new: 'bg-red-500/20 text-red-400 border-red-500/40',
    triaging: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    resolved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  }[incident.status] || 'bg-slate-800 text-slate-400';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-black text-white">Incident #{incident.id}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
              {incident.status.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Sévérité {incident.severity}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2">{incident.summary}</h3>
            <p className="text-slate-400">{incident.narrative}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Source</p>
              <p className="text-sm text-white font-mono">{incident.source}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">IP Source</p>
              <p className="text-sm text-white font-mono">{incident.source_ip}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Système Cible</p>
              <p className="text-sm text-white font-mono">{incident.target_system}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Hash Intégrité</p>
              <p className="text-xs text-emerald-500 font-mono truncate">{hash}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;
