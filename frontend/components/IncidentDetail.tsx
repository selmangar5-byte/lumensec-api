import React, { useState, useEffect } from 'react';
import { Incident, EvidencePack, EvidenceItem } from '../types';
import { lumensecApi } from '../services/api';
import AIAnalyst from './AIAnalyst';

interface IncidentDetailProps {
  incident: Incident;
  onClose: () => void;
  onStatusUpdate?: (updatedIncident: Incident) => void;
}

const IncidentDetail: React.FC<IncidentDetailProps> = ({ incident, onClose, onStatusUpdate }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pack, setPack] = useState<EvidencePack | null>(null);
  const [securityHash, setSecurityHash] = useState<string>('');

  useEffect(() => {
    const generateSimulatedHash = () => {
      const chars = '0123456789abcdef';
      let hash = 'sha256:';
      for (let i = 0; i < 56; i++) hash += chars[Math.floor(Math.random() * chars.length)];
      setSecurityHash(hash);
    };
    generateSimulatedHash();
  }, []);

  const handleDownload = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => setIsGeneratingPdf(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'new': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'triaging': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-black text-white">Incident #{incident.id}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(incident.status)}`}>
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
              <p className="text-xs text-emerald-500 font-mono truncate">{securityHash}</p>
            </div>
          </div>

          <button 
            onClick={handleDownload}
            disabled={isGeneratingPdf}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-50"
          >
            {isGeneratingPdf ? 'Génération...' : 'Exporter Evidence Pack'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;
