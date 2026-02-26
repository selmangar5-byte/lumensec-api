import React, { useState } from 'react';
import { Timer, X, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface MTTCProps {
  minutes: number;
  trend: 'improving' | 'degrading' | 'stable'; // improving = temps qui diminue (c'est bien)
  previousMinutes: number;
}

export const MTTCRansomware: React.FC<MTTCProps> = ({ minutes, trend, previousMinutes }) => {
  const [showModal, setShowModal] = useState(false);

  const getStatus = (m: number) => {
    if (m <= 15) return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Optimal' };
    if (m <= 60) return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Acceptable' };
    return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Critique' };
  };

  const status = getStatus(minutes);
  const diff = previousMinutes - minutes; // positif = amélioration
  
  const TrendIcon = trend === 'improving' ? TrendingDown : (trend === 'degrading' ? TrendingUp : AlertTriangle);
  const trendColor = trend === 'improving' ? 'text-emerald-400' : (trend === 'degrading' ? 'text-red-400' : 'text-yellow-400');

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 cursor-pointer hover:bg-slate-800/70 transition-all hover:border-indigo-500/30 group h-full flex flex-col"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${status.bg}`}>
            <Timer className={`w-6 h-6 ${status.color}`} />
          </div>
          <div className="flex items-center gap-1">
            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
            <span className="text-xs text-slate-500 font-mono">MTTC</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center space-y-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-5xl font-bold ${status.color} tracking-tight`}>{minutes}</span>
            <span className="text-slate-400 text-lg">min</span>
          </div>
          <p className="text-slate-300 text-sm font-medium">Containment moyen</p>
          
          {diff !== 0 && (
            <div className={`flex items-center gap-1 text-xs ${trendColor} mt-2`}>
              <span>{diff > 0 ? '↓' : '↑'} {Math.abs(diff)} min vs dernier incident</span>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Timer className="w-6 h-6 text-indigo-400" />
                Mean Time To Contain
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <span className={`text-6xl font-bold ${status.color}`}>{minutes}</span>
              <span className="text-slate-400 text-xl ml-2">minutes</span>
              <p className="text-slate-500 text-sm mt-2">Temps moyen pour isoler une menace ransomware</p>
            </div>

            <div className={`p-4 rounded-xl border ${status.border} ${status.bg} mb-4 text-center`}>
              <span className={`text-lg font-bold ${status.color}`}>{status.label}</span>
              <p className="text-xs text-slate-400 mt-1">
                {minutes <= 15 ? 'Excellente réactivité' : minutes <= 60 ? 'Amélioration possible' : 'Risque élevé - Action requise'}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400">Seuil critique</span>
                <span className="text-red-400 font-mono">{'>1h'}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400">Seuil acceptable</span>
                <span className="text-orange-400 font-mono">{'<1h'}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-400">Objectif optimal</span>
                <span className="text-emerald-400 font-mono">{'<15min'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
