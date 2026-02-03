
import React, { useState } from 'react';
import { lumensecApi } from '../services/api';

const ReportCenter: React.FC = () => {
  const [activeReport, setActiveReport] = useState<string | null>(null);

  const reports = [
    { id: 'daily', label: 'Journalier', desc: 'Activités des dernières 24h', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'weekly', label: 'Hebdo', desc: 'Tendances d\'immunité 7j', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'monthly', label: 'Mensuel', desc: 'Bilan de sécurité global', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }
  ];

  const handleDownload = (id: any) => {
    setActiveReport(id);
    lumensecApi.downloadActivityReport(id);
    setTimeout(() => setActiveReport(null), 3000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic flex items-center">
          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Reporting Center
        </h3>
        <span className="text-[8px] font-mono text-emerald-500 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Ready</span>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <button
            key={report.id}
            onClick={() => handleDownload(report.id)}
            disabled={activeReport !== null}
            className="w-full flex items-center p-4 bg-slate-950/40 border border-slate-800 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-900 transition-all text-left group/btn"
          >
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center mr-4 group-hover/btn:scale-110 transition-transform">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={report.icon} />
              </svg>
            </div>
            <div className="flex-grow">
              <p className="text-[11px] font-black text-white uppercase tracking-widest">{report.label}</p>
              <p className="text-[9px] text-slate-500 font-mono italic">{report.desc}</p>
            </div>
            {activeReport === report.id ? (
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4 text-slate-700 group-hover/btn:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            )}
          </button>
        ))}
      </div>

      <p className="mt-6 text-[8px] text-slate-600 font-mono text-center uppercase tracking-widest italic leading-loose">
        Reports are generated with Gemini 3 Pro <br/> Consolidating SOC Activity for Nawal.
      </p>
    </div>
  );
};

export default ReportCenter;
