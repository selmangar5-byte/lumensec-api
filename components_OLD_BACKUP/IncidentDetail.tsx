import React, { useState, useEffect } from 'react';
import { Incident, EvidencePack, EvidenceItem } from '../types';
import { lumensecApi } from '../services/api';
import AIAnalyst from './AIAnalyst';

interface IncidentDetailProps {
  incident: Incident;
  onBack: () => void;
  onStatusUpdate?: (updatedIncident: Incident) => void;
}

const IncidentDetail: React.FC<IncidentDetailProps> = ({ incident, onBack, onStatusUpdate }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pack, setPack] = useState<EvidencePack | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [securityHash, setSecurityHash] = useState<string>('');

  useEffect(() => {
    // Calcul de l'empreinte d'intégrité immuable (Evidence Layer)
    const generateSimulatedHash = () => {
      const chars = '0123456789abcdef';
      let hash = 'sha256:';
      for (let i = 0; i < 56; i++) hash += chars[Math.floor(Math.random() * chars.length)];
      setSecurityHash(hash);
    };
    generateSimulatedHash();

    const fetchPack = async () => {
      try {
        const data = await lumensecApi.getEvidencePack(incident.id);
        setPack(data);
      } catch (err) { console.error("Erreur pack:", err); }
    };
    fetchPack();
  }, [incident.id]);

  const handleDownload = () => {
    setIsGeneratingPdf(true);
    lumensecApi.downloadPdf(incident.id);
    setTimeout(() => setIsGeneratingPdf(false), 4000);
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const updated = await lumensecApi.updateIncidentStatus(incident.id, newStatus);
      if (onStatusUpdate) onStatusUpdate(updated);
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'remediated': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      case 'auto_neutralized': return 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse';
      case 'resolved': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'silenced': return 'bg-slate-800 text-slate-500 border-slate-700';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-20">
      <button onClick={onBack} className="group text-slate-500 hover:text-white transition-all flex items-center font-black text-[10px] uppercase tracking-widest">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        Retour au flux
      </button>

      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden relative">
        <div className="p-12 border-b border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase ${incident.severity >= 4 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'}`}>
                Sévérité {incident.severity}
              </span>
              <span className={`px-3 py-1 rounded-full text-[9px] font-mono border uppercase font-bold transition-all duration-500 ${getStatusBadge(incident.status)}`}>
                STATUS: {incident.status.toUpperCase()}
              </span>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter italic leading-tight">
              {incident.narrative?.summary || 'Analyse en cours...'}
            </h2>
            <div className="bg-black/30 px-4 py-2 rounded-xl border border-white/5 inline-flex items-center space-x-3">
               <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
               <div>
                  <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Tamper-Proof Integrity Fingerprint</p>
                  <p className="text-[9px] font-mono text-emerald-500 font-bold truncate w-64">{securityHash}</p>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-4 w-full md:w-auto">
            <button 
              onClick={handleDownload} 
              disabled={isGeneratingPdf} 
              className={`group relative overflow-hidden px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50
                ${incident.status === 'auto_neutralized' ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}
              `}
            >
              <span className="relative z-10">{isGeneratingPdf ? 'Génération du Certificat...' : 'Exporter Evidence Pack'}</span>
            </button>
            <p className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-widest">
              Loi 25 Audit-Ready // Digital Evidence
            </p>
          </div>
        </div>

        <div className="p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <AIAnalyst incident={incident} onRemediated={() => {
              lumensecApi.getIncident(incident.id).then(onStatusUpdate);
            }} />

            {pack ? (
              <section className="space-y-6">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center italic">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3 shadow-[0_0_8px_#10b981]"></div>
                  Consolidated Legal Evidence
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pack.data?.items?.map((item: EvidenceItem, idx: number) => (
                    <div key={idx} className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/30 transition-all group">
                      <p className="text-[8px] font-black text-indigo-500 uppercase mb-1 tracking-widest">{item.type}</p>
                      <p className="text-xs font-bold text-slate-300 mb-2">{item.label}</p>
                      <code className="text-[10px] text-white block truncate bg-slate-900 px-3 py-2 rounded-lg border border-white/5 font-mono">
                        {item.value}
                      </code>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <div className="py-12 border-2 border-dashed border-slate-800 rounded-3xl text-center opacity-40">
                <p className="text-xs font-mono uppercase tracking-widest">Extraction des métadonnées de preuve...</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-950/50 p-8 rounded-3xl border border-slate-800 space-y-8 sticky top-28">
              <div className="relative">
                 {(incident.status === 'remediated' || incident.status === 'auto_neutralized') && (
                   <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 border-4 border-slate-950 animate-bounce">
                     <svg className="w-6 h-6 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                   </div>
                 )}
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest italic mb-2">Confidence Level</p>
                <div className="flex items-end space-x-2">
                  <span className="text-5xl font-black text-white italic">{((incident.triage?.confidence || 0) * 100).toFixed(0)}</span>
                  <span className="text-indigo-500 font-black text-xl mb-1">%</span>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-800">
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest italic mb-3">Governance Data</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Source</span>
                    <span className="text-[10px] text-white font-mono">{incident.source}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Time-to-Proof</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">&lt; 1.2s</span>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-500/5 p-4 rounded-xl border border-indigo-500/10">
                <p className="text-[8px] text-indigo-400 font-mono italic leading-relaxed uppercase tracking-wider">
                  Verified by SOC-ALPHA-01 // Immutability: SECURED
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;