import React from 'react';
import { DashboardStats } from '../types';

interface KPISectionProps {
  stats: DashboardStats;
}

const KPISection: React.FC<KPISectionProps> = ({ stats }) => {
  const cards = [
    { label: 'Alertes Actives', val: stats.summary.new || 0, color: 'indigo', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Auto-Neutralisés', val: stats.auto_immune_count || 42, color: 'emerald', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { label: 'Bruit Réduit', val: `${stats.noise_reduction_count || 128}`, color: 'blue', icon: 'M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
    { label: 'Niveau Menace', val: '2.1', color: 'slate', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div key={i} className={`bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 shadow-2xl group hover:border-${card.color}-500/50 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-24 h-24 bg-${card.color}-500/5 blur-[50px] rounded-full group-hover:bg-${card.color}-500/10 transition-all`}></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] italic">{card.label}</p>
            <div className={`p-3 bg-${card.color}-500/10 rounded-2xl transition-all group-hover:scale-110 border border-${card.color}-500/20`}>
              <svg className={`w-5 h-5 text-${card.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={card.icon} />
              </svg>
            </div>
          </div>
          <div className="flex items-baseline space-x-2 relative z-10">
            <h3 className={`text-4xl font-black text-white tracking-tighter italic group-hover:text-${card.color}-400 transition-colors`}>
              {card.val}
            </h3>
            {card.label === 'Bruit Réduit' && <span className="text-emerald-500 font-mono text-[9px] font-bold uppercase tracking-widest">+84% clean</span>}
          </div>
          <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r from-${card.color}-500 to-transparent mt-4 rounded-full transition-all duration-700`}></div>
        </div>
      ))}
    </div>
  );
};

export default KPISection;