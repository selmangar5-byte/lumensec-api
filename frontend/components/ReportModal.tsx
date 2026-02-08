import React from 'react';
import { generateDailyReport, generateWeeklyReport, generateMonthlyReport } from '../services/pdfGenerator';
import { DashboardStats } from '../types';

interface ReportModalProps {
  type: 'daily' | 'weekly' | 'monthly';
  stats: DashboardStats;
  onClose: () => void;
}

export default function ReportModal({ type, stats, onClose }: ReportModalProps) {
  const getTitle = () => {
    if (type === 'daily') return 'Daily Report - 24h';
    if (type === 'weekly') return 'Weekly Report - 7 days';
    return 'Monthly Summary';
  };

  const handleDownloadPDF = () => {
    if (type === 'daily') generateDailyReport(stats);
    else if (type === 'weekly') generateWeeklyReport(stats);
    else generateMonthlyReport(stats);
  };

  const getDailyData = () => ({
    kpis: [
      { label: 'Active Alerts', value: stats?.active_alerts || 102, status: 'NORMAL', color: 'blue' },
      { label: 'Auto-Neutralized', value: stats?.auto_neutralized || 42, status: 'EXCELLENT', color: 'green' },
      { label: 'Noise Reduced', value: (stats?.noise_reduction || 128) + ' incidents', status: 'OPTIMAL', color: 'indigo' },
      { label: 'Threat Level', value: (stats?.threat_level || 2.1) + '/5', status: 'LOW', color: 'green' },
    ],
    summary: [
      'Normal security activity over the last 24 hours.',
      'The system automatically neutralized 42 low-criticality incidents.',
      '128 false positives were filtered through SMA-256 integration.',
      'No manual action required at this time.',
    ]
  });

  const getWeeklyData = () => ({
    kpis: [
      { label: 'Incidents Detected', value: '714', trend: '+12%', color: 'yellow' },
      { label: 'Auto Neutralizations', value: '294', trend: '+8%', color: 'green' },
      { label: 'Manual Interventions', value: '18', trend: '-15%', color: 'green' },
      { label: 'Avg Resolution Time', value: '12 min', trend: '-22%', color: 'green' },
    ],
    highlights: [
      '✓ 22% reduction in average resolution time through automation',
      '✓ 294 incidents neutralized automatically (41% of total)',
      '✓ 15% improvement in system immunity via community rules',
      '⚠ Activity spike detected Tuesday 02/04 (investigation ongoing)',
    ]
  });

  const getMonthlyData = () => ({
    kpis: [
      { label: 'Incidents Processed', value: '3,142', target: '3,000', status: '✓ EXCEEDED', color: 'green' },
      { label: 'Automation Rate', value: '68%', target: '60%', status: '✓ ACHIEVED', color: 'green' },
      { label: 'Uptime', value: '99.97%', target: '99.9%', status: '✓ EXCELLENT', color: 'green' },
      { label: 'False Positives Reduced', value: '87%', target: '80%', status: '✓ EXCEEDED', color: 'green' },
    ],
    recommendations: [
      '1. Maintain current automation level (68%)',
      '2. Deploy 3 new identified community rules',
      '3. Train SOC team on newly detected attack vectors',
      '4. Schedule quarterly infrastructure audit',
    ]
  });

  const data = type === 'daily' ? getDailyData() : type === 'weekly' ? getWeeklyData() : getMonthlyData();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{getTitle()}</h2>
            <p className="text-sm text-slate-400 mt-1">
              Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* KPIs Grid */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              {type === 'monthly' ? 'Monthly Performance' : type === 'weekly' ? 'Weekly Analysis' : 'Key Indicators'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.kpis.map((kpi, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">{kpi.label}</div>
                  <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
                  {kpi.status && <div className={`text-xs font-medium text-${kpi.color}-400`}>{kpi.status}</div>}
                  {kpi.trend && <div className={`text-xs font-medium text-${kpi.color}-400`}>{kpi.trend}</div>}
                  {kpi.target && <div className="text-xs text-slate-500">Target: {kpi.target}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Summary/Highlights/Recommendations */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              {type === 'monthly' ? 'Strategic Recommendations' : type === 'weekly' ? 'Highlights' : 'Executive Summary'}
            </h3>
            <div className="space-y-3">
              {(data.summary || data.highlights || data.recommendations || []).map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-slate-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-6 bg-slate-900/50">
          <p className="text-xs text-slate-500 text-center">
            © 2025 Lumensec - Security Operations Center - Confidential Document
          </p>
        </div>
      </div>
    </div>
  );
}