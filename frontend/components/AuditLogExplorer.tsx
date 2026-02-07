import React, { useState } from 'react';
import { mockAuditLogs } from '../data/mockAuditLogs';

export default function AuditLogExplorer() {
  const [filter, setFilter] = useState<'ALL' | 'SUCCESS' | 'WARNING' | 'ERROR'>('ALL');

  const filteredLogs = filter === 'ALL' 
    ? mockAuditLogs 
    : mockAuditLogs.filter(log => log.status === filter);

  const getStatusColor = (status: string) => {
    if (status === 'SUCCESS') return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (status === 'WARNING') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Audit Log Explorer</h3>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded">
            {filteredLogs.length} Events
          </span>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(['ALL', 'SUCCESS', 'WARNING', 'ERROR'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                filter === status
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-y-auto max-h-[400px]">
        <table className="w-full">
          <thead className="sticky top-0 bg-slate-900 border-b border-slate-800">
            <tr>
              <th className="text-left text-[10px] text-slate-500 font-mono uppercase tracking-wider px-4 py-3">Timestamp</th>
              <th className="text-left text-[10px] text-slate-500 font-mono uppercase tracking-wider px-4 py-3">User</th>
              <th className="text-left text-[10px] text-slate-500 font-mono uppercase tracking-wider px-4 py-3">Action</th>
              <th className="text-left text-[10px] text-slate-500 font-mono uppercase tracking-wider px-4 py-3">Resource</th>
              <th className="text-left text-[10px] text-slate-500 font-mono uppercase tracking-wider px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                <td className="px-4 py-3">
                  <div className="text-xs text-slate-400 font-mono">{log.timestamp}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-slate-300">{log.user}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{log.ip}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs font-medium text-white">{log.action}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-slate-300">{log.resource}</div>
                  <div className="text-[10px] text-slate-500 max-w-xs truncate">{log.details}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-mono uppercase px-2 py-1 rounded border ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-mono">
            Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            Affichage: {filteredLogs.length}/{mockAuditLogs.length} events
          </p>
        </div>
      </div>
    </div>
  );
}