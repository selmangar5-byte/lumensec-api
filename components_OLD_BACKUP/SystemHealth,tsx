import React from 'react';

const SystemHealth: React.FC = () => {
  const modules = [
    { name: 'Immunity Core v2.8', status: 'Active', load: '12%', color: 'emerald' },
    { name: 'Noise Filter (SOAR)', status: 'Active', load: '08%', color: 'blue' },
    { name: 'Remediation Engine', status: 'Standby', load: '02%', color: 'indigo' },
    { name: 'Gemini 3 Pro Link', status: 'Connected', load: '15%', color: 'purple' }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500 opacity-30"></div>
      
      <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 italic flex items-center">
        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
        System Health Diagnostics
      </h3>

      <div className="space-y-5">
        {modules.map((mod, i) => (
          <div key={i} className="flex flex-col space-y-2">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
              <span className="text-slate-400">{mod.name}</span>
              <span className={`text-${mod.color}-400 italic`}>{mod.status}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full bg-${mod.color}-500 transition-all duration-1000 shadow-[0_0_10px_rgba(var(--${mod.color}-500),0.5)]`}
                style={{ width: mod.load }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
         <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Global Integrity</span>
         <span className="text-[10px] font-black text-emerald-400 italic">99.9% SECURE</span>
      </div>
    </div>
  );
};

export default SystemHealth;