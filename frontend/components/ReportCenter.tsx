import React, { useState } from 'react';
import { generateDailyReport, generateWeeklyReport, generateMonthlyReport } from '../services/pdfGenerator';
import { DashboardStats } from '../types';

interface ReportingCenterProps {
  stats: DashboardStats;
}

export default function ReportingCenter({ stats }: ReportingCenterProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDownload = (type: 'daily' | 'weekly' | 'monthly') => {
    setLoading(type);
    
    setTimeout(() => {
      if (type === 'daily') {
        generateDailyReport(stats);
      } else if (type === 'weekly') {
        generateWeeklyReport(stats);
      } else {
        generateMonthlyReport(stats);
      }
      setLoading(null);
    }, 800);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Reporting Center</h3>
        </div>
        <span className="text-[10px] text-green-400 font-mono uppercase tracking-widest px-3 py-1 bg-green-500/10 border border-green-500/20 rounded">Ready</span>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleDownload('daily')}
          disabled={loading !== null}
          className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-4 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">Journalier</div>
                <div className="text-[10px] text-slate-400 font-mono">Activités des dernières 24h</div>
              </div>
            </div>
            {loading === 'daily' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400"></div>
            ) : (
              <svg className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </div>
        </button>

        <button
          onClick={() => handleDownload('weekly')}
          disabled={loading !== null}
          className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-4 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">Hebdo</div>
                <div className="text-[10px] text-slate-400 font-mono">Tendances d'immunité 7j</div>
              </div>
            </div>
            {loading === 'weekly' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400"></div>
            ) : (
              <svg className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </div>
        </button>

        <button
          onClick={() => handleDownload('monthly')}
          disabled={loading !== null}
          className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-4 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">Mensuel</div>
                <div className="text-[10px] text-slate-400 font-mono">Bilan de sécurité global</div>
              </div>
            </div>
            {loading === 'monthly' ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400"></div>
            ) : (
              <svg className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}