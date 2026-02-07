import React from 'react';
import { Incident, DashboardStats } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import KPISection from './KPISection';
import CyberMap from './CyberMap';
import SOCTerminal from './SOCTerminal';
import SystemHealth from './SystemHealth';
import ReportCenter from './ReportCenter';
import AuditLogExplorer from './AuditLogExplorer';
import CommunityRulesMarket from './CommunityRulesMarket';

interface DashboardProps {
  stats: DashboardStats;
  onSelectIncident: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onSelectIncident }) => {
  const { t } = useLanguage();
  
  const getSeverityLabel = (severity: number) => {
    switch(severity) {
      case 5: return { label: t.critical, color: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]' };
      case 4: return { label: t.high, color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };
      case 3: return { label: t.medium, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
      default: return { label: t.low, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
    }
  };

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'auto_neutralized': return { label: t.immunized, color: 'text-emerald-400' };
      case 'silenced': return { label: t.silenced, color: 'text-slate-500' };
      case 'remediated': return { label: t.remediated, color: 'text-blue-400' };
      case 'new': return { label: t.new, color: 'text-indigo-400' };
      case 'triaging': return { label: t.triaging, color: 'text-yellow-400' };
      case 'resolved': return { label: t.resolved, color: 'text-green-400' };
      default: return { label: status.toUpperCase(), color: 'text-indigo-400' };
    }
  };

  const threatLevel = Math.min(100, (stats.total_incidents * 15) + (stats.by_severity["5"] || 0 * 20));

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <KPISection stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Section Ingestion Master Radar */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative group/table">
            <div className="px-10 py-8 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/40">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight uppercase italic flex items-center">
                   <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                   {t.ingestionLayer}
                </h2>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 italic">
                  {t.webhookApi} (84%) + {t.emailGateway} (16%)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
                    <th className="px-10 py-5 border-b border-slate-800/50">{t.traceId}</th>
                    <th className="px-10 py-5 border-b border-slate-800/50">{t.severity}</th>
                    <th className="px-10 py-5 border-b border-slate-800/50">{t.inferenceStatus}</th>
                    <th className="px-10 py-5 border-b border-slate-800/50 text-right">{t.action}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {stats.recent_incidents.map((incident) => {
                    const sev = getSeverityLabel(incident.severity);
                    const statusUI = getStatusDisplay(incident.status);
                    return (
                      <tr 
                        key={incident.id} 
                        className="hover:bg-emerald-500/[0.03] transition-all group cursor-pointer"
                        onClick={() => onSelectIncident(incident.id)}
                      >
                        <td className="px-10 py-6">
                          <span className="font-mono text-[11px] text-indigo-400 group-hover:text-emerald-400 transition-colors font-bold">
                            #{incident.id.toString().substring(0, 8)}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`px-3 py-1 rounded-lg border text-[9px] font-black tracking-widest ${sev.color}`}>
                            {sev.label}
                          </span>
                        </td>
                        <td className="px-10 py-6">
                          <div className={`text-[10px] font-black uppercase tracking-widest italic ${statusUI.color}`}>
                            {statusUI.label}
                          </div>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button className="p-2.5 bg-slate-800 group-hover:bg-emerald-600 rounded-xl text-slate-500 group-hover:text-white transition-all shadow-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <AuditLogExplorer />
          <SOCTerminal />
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Preuve & ROI (Sexy Upgrade) */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
            </div>
            <h3 className="text-white font-black text-xs uppercase tracking-widest italic mb-4">{t.loi25Compliance}</h3>
            <div className="flex items-center space-x-4 mb-6">
               <span className="text-4xl font-black text-emerald-400 italic">98%</span>
               <div className="flex-grow h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_#10b981]"></div>
               </div>
            </div>
            <p className="text-[9px] text-slate-400 font-medium leading-relaxed italic">
              {t.dataProtected}
            </p>
          </div>

          <ReportCenter />
          <SystemHealth />
          <CommunityRulesMarket />
          <CyberMap />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;