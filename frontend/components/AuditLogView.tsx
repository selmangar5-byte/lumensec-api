
import React, { useState, useEffect } from 'react';
import { lumensecApi } from '../services/api';

const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lumensecApi.getAuditLogs().then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-[2rem] p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] italic flex items-center">
          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Audit Log Explorer
        </h3>
        <span className="text-[8px] font-mono text-emerald-500 font-bold uppercase tracking-[0.2em] bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">Loi 25 Compliant</span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="text-center py-10 opacity-20 animate-pulse font-mono text-[10px]">Accessing immutable logs...</div>
        ) : logs.map((log) => (
          <div key={log.id} className="flex items-center justify-between p-4 bg-slate-950/40 border border-slate-800 rounded-2xl hover:bg-slate-900/60 transition-all">
            <div className="flex items-center space-x-4">
               <div className="text-[8px] font-black bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">{log.action}</div>
               <div>
                  <p className="text-[10px] font-black text-white uppercase">{log.user}</p>
                  <p className="text-[8px] text-slate-500 font-mono">Target: {log.target}</p>
               </div>
            </div>
            <div className="text-[9px] font-mono text-slate-600">{new Date(log.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogView;
