import React from 'react';

const CyberMap: React.FC = () => {
  return (
    <div className="bg-slate-900/60 border border-indigo-500/30 rounded-[2rem] p-8 relative overflow-hidden group shadow-[0_0_50px_rgba(79,70,229,0.1)]">
      {/* Radar effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(16,185,129,0.3)_10deg,transparent_20deg)] animate-[spin_6s_linear_infinite]"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(16,185,129,0)" />
              <stop offset="50%" stopColor="rgba(16,185,129,1)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0)" />
            </linearGradient>
          </defs>
          <circle cx="400" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-emerald-500/30" />
          <path d="M150,100 Q400,300 650,120" fill="none" stroke="url(#flowGradient)" strokeWidth="3" strokeDasharray="100 100">
            <animate attributeName="stroke-dashoffset" from="200" to="0" dur="2s" repeatCount="indefinite" />
          </path>
          <circle cx="400" cy="200" r="6" className="text-emerald-500 animate-pulse shadow-[0_0_20px_#10b981]" fill="currentColor" />
        </svg>
      </div>
      
      <div className="relative z-10 flex justify-between items-start mb-8">
        <div>
          <h3 className="text-white font-black text-sm uppercase tracking-widest italic">Supabase Uplink</h3>
          <p className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mt-1 italic font-bold">TUNNEL: ESTABLISHED</p>
        </div>
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-emerald-500 text-slate-950 text-[8px] font-black rounded tracking-tighter shadow-[0_0_15px_rgba(16,185,129,0.4)]">ENCRYPTED</span>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/40 backdrop-blur-md">
          <div className="flex items-center space-x-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,1)]"></div>
             <span className="text-[10px] font-mono text-white font-bold italic tracking-tight">PostgreSQL: ACTIVE</span>
          </div>
          <span className="text-[9px] font-black text-emerald-400 uppercase italic tracking-widest">Connected</span>
        </div>
        
        <div className="p-3 border border-indigo-500/20 rounded-xl bg-slate-950/60">
           <p className="text-[8px] text-indigo-300 font-mono uppercase leading-relaxed tracking-wider">
             Nawal, la base de données est synchronisée. Les 3 incidents de simulation sont visibles dans le "Security Feed".
           </p>
        </div>
      </div>
    </div>
  );
};

export default CyberMap;