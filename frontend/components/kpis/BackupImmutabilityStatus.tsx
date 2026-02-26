import React, { useState } from 'react';
import { Database, X, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';

interface BackupProps {
  lastTestDays: number; // 0 = aujourd'hui, 5 = il y a 5 jours
  coverage: number; // pourcentage
  totalBackups: number;
  immutableCount: number;
}

export const BackupImmutabilityStatus: React.FC<BackupProps> = ({ 
  lastTestDays, 
  coverage, 
  totalBackups,
  immutableCount 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const getStatus = (days: number) => {
    if (days <= 7) return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2, label: 'À jour' };
    if (days <= 30) return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle, label: 'Vérification conseillée' };
    return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle, label: 'Test requis' };
  };

  const status = getStatus(lastTestDays);
  const StatusIcon = status.icon;

  const handleTest = () => {
    setIsTesting(true);
    setTimeout(() => setIsTesting(false), 2000);
  };

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 cursor-pointer hover:bg-slate-800/70 transition-all hover:border-indigo-500/30 group h-full flex flex-col"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${status.bg}`}>
            <Database className={`w-6 h-6 ${status.color}`} />
          </div>
          <span className="text-xs text-slate-500 font-mono">BACKUPS</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center space-y-3">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-5 h-5 ${status.color}`} />
            <span className={`text-sm font-medium ${status.color}`}>
              {lastTestDays === 0 ? 'Testé aujourd\'hui' : `Testé il y a ${lastTestDays} jours`}
            </span>
          </div>

          <div className="relative pt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Immutables</span>
              <span className={`font-bold ${coverage >= 90 ? 'text-emerald-400' : coverage >= 70 ? 'text-orange-400' : 'text-red-400'}`}>
                {coverage}%
              </span>
            </div>
            <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className={`h-full ${coverage >= 90 ? 'bg-emerald-500' : coverage >= 70 ? 'bg-orange-500' : 'bg-red-500'} transition-all duration-1000`}
                style={{ width: `${coverage}%` }}
              />
            </div>
          </div>

          <p className="text-slate-500 text-xs">
            {immutableCount}/{totalBackups} backups air-gapped
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="w-6 h-6 text-indigo-400" />
                État des Backups
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className={`p-4 rounded-xl border ${status.border} ${status.bg} mb-6 text-center`}>
              <StatusIcon className={`w-8 h-8 ${status.color} mx-auto mb-2`} />
              <p className={`text-lg font-bold ${status.color}`}>{status.label}</p>
              <p className="text-sm text-slate-400">
                Dernier test : {lastTestDays === 0 ? 'Aujourd\'hui' : `Il y a ${lastTestDays} jours`}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <span className="text-slate-300">Backups immuables</span>
                <span className="text-white font-mono">{immutableCount} / {totalBackups}</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <span className="text-slate-300">Taux de coverage</span>
                <span className={`font-mono font-bold ${status.color}`}>{coverage}%</span>
              </div>
            </div>

            <button 
              onClick={handleTest}
              disabled={isTesting}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {isTesting ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Test en cours...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Tester maintenant (simulation)
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};