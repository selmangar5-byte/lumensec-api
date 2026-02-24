import React from 'react';
import { DashboardStats } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface KPISectionProps {
  stats: DashboardStats;
}

export default function KPISection({ stats }: KPISectionProps) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Alertes Actives */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-indigo-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{t.activeAlerts}</h3>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-6xl font-black text-white tracking-tight">{stats.active_alerts}</div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-slate-400 font-mono">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Neutralisés */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{t.autoNeutralized}</h3>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-6xl font-black text-white tracking-tight">{stats.auto_neutralized}</div>
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-slate-400 font-mono">AUTO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bruit Réduit */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{t.noiseReduction}</h3>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-6xl font-black text-white tracking-tight">{stats.noise_reduction}</div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-emerald-400 font-mono font-bold">{t.seenClean}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Niveau Menace */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{t.threatLevel}</h3>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-6xl font-black text-white tracking-tight">{stats.threat_level}</div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-mono">/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}