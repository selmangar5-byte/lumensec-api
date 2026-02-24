
import React, { useState } from 'react';
import { lumensecApi } from '../services/api';

interface Action {
  name: string;
  args: any;
}

interface RemediationConsoleProps {
  actions: Action[];
  incidentId: string;
  onSuccess: () => void;
}

const RemediationConsole: React.FC<RemediationConsoleProps> = ({ actions, incidentId, onSuccess }) => {
  const [executing, setExecuting] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);

  const runAction = async (actionName: string) => {
    setExecuting(actionName);
    
    // Simulation d'approbation et exécution avec log d'audit
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCompleted(prev => [...prev, actionName]);
    setExecuting(null);

    if (completed.length + 1 === actions.length) {
      try {
        await lumensecApi.updateIncidentStatus(incidentId, 'remediated');
        onSuccess();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (actions.length === 0) return null;

  return (
    <div className="mt-8 bg-slate-950 border-2 border-cyan-500/20 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-500">
      <div className="px-10 py-6 bg-cyan-500/5 border-b border-cyan-500/20 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
          <h3 className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.4em] italic">S6 : Console d'Approbation Humaine</h3>
        </div>
        <span className="text-[9px] font-mono text-cyan-600 font-bold uppercase tracking-widest italic">Validation requise par Nawal</span>
      </div>
      
      <div className="p-10 space-y-6">
        <p className="text-[10px] text-slate-400 font-mono italic leading-relaxed">
          Les contre-mesures suivantes ont été générées par S3/S4. <br/>
          <span className="text-cyan-500 font-bold">L'approbation manuelle enregistrera votre décision comme preuve d'audit Loi 25.</span>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action, idx) => {
            const isDone = completed.includes(action.name);
            const isRunning = executing === action.name;
            
            return (
              <div key={idx} className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${isDone ? 'bg-cyan-500/5 border-cyan-500/30' : 'bg-slate-900 border-slate-800'}`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{action.name.replace('_', ' ')}</span>
                    {isDone && <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <code className="text-[10px] text-white font-mono block bg-black/40 p-2 rounded border border-white/5 truncate">
                    {JSON.stringify(action.args)}
                  </code>
                </div>
                
                <button
                  onClick={() => runAction(action.name)}
                  disabled={isDone || isRunning}
                  className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all
                    ${isDone ? 'bg-cyan-500/10 text-cyan-500 cursor-default' : 
                      isRunning ? 'bg-amber-500/10 text-amber-500 animate-pulse' : 
                      'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg active:scale-95'}
                  `}
                >
                  {isDone ? 'Action Validée' : isRunning ? 'Signature...' : 'Approuver & Exécuter'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RemediationConsole;
