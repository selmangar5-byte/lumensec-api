import React, { useState } from 'react';
import { Shield, X, Lock, Monitor, Network, Wrench } from 'lucide-react';

interface RansomwareResistanceProps {
  score: number;
  components: {
    mfa: number;
    edr: number;
    segmentation: number;
    patchManagement: number;
  };
}

export const RansomwareResistanceIndex: React.FC<RansomwareResistanceProps> = ({ 
  score, 
  components 
}) => {
  const [showModal, setShowModal] = useState(false);

  const getColorClass = (value: number) => {
    if (value < 60) return { text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', bar: 'bg-red-500' };
    if (value <= 80) return { text: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', bar: 'bg-orange-500' };
    return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: 'bg-emerald-500' };
  };

  const colors = getColorClass(score);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 cursor-pointer hover:bg-slate-800/70 transition-all hover:border-indigo-500/30 group h-full flex flex-col"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Shield className={`w-6 h-6 ${colors.text}`} />
          </div>
          <span className="text-xs text-slate-500 font-mono">RANSOMWARE</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center space-y-2">
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-bold ${colors.text} tracking-tight`}>{score}</span>
            <span className="text-slate-400 text-xl font-light">/100</span>
          </div>
          <p className="text-slate-300 text-sm font-medium">Résistance au ransomware</p>
          
          <div className="h-2 w-full bg-slate-700/50 rounded-full mt-4 overflow-hidden">
            <div 
              className={`h-full ${colors.bar} transition-all duration-1000 ease-out`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-indigo-400" />
                Détails du score
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className={`p-4 rounded-xl border ${colors.border} ${colors.bg} mb-6`}>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Score composite</span>
                <span className={`text-3xl font-bold ${colors.text}`}>{score}/100</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Moyenne pondérée des 4 piliers anti-ransomware
              </p>
            </div>

            <div className="space-y-3">
              <MetricRow icon={Lock} label="MFA (Authentification)" value={components.mfa} />
              <MetricRow icon={Monitor} label="EDR (Détection endpoints)" value={components.edr} />
              <MetricRow icon={Network} label="Segmentation réseau" value={components.segmentation} />
              <MetricRow icon={Wrench} label="Patch Management" value={components.patchManagement} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MetricRow: React.FC<{ icon: any, label: string, value: number }> = ({ icon: Icon, label, value }) => {
  const barColor = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-orange-500' : 'bg-red-500';
  
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-800 rounded-lg">
          <Icon className="w-4 h-4 text-slate-300" />
        </div>
        <span className="text-slate-300 text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-20 h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full ${barColor}`} style={{ width: `${value}%` }} />
        </div>
        <span className="text-white font-mono text-sm w-8 text-right">{value}%</span>
      </div>
    </div>
  );
};