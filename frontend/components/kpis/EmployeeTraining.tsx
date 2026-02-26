import React, { useState } from 'react';
import { GraduationCap, X, AlertCircle, CheckCircle2, MousePointerClick } from 'lucide-react';

interface TrainingProps {
  completionRate: number; // pourcentage
  phishingClicks: number; // nombre de clics ce mois
  totalEmployees: number;
  trainedEmployees: number;
}

export const EmployeeTraining: React.FC<TrainingProps> = ({ 
  completionRate, 
  phishingClicks,
  totalEmployees,
  trainedEmployees
}) => {
  const [showModal, setShowModal] = useState(false);

  const getStatus = (rate: number, clicks: number) => {
    if (rate >= 90 && clicks === 0) return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Conforme Loi 25' };
    if (rate >= 70 && clicks <= 2) return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'À surveiller' };
    return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Action requise Loi 25' };
  };

  const status = getStatus(completionRate, phishingClicks);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 cursor-pointer hover:bg-slate-800/70 transition-all hover:border-indigo-500/30 group h-full flex flex-col"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${status.bg}`}>
            <GraduationCap className={`w-6 h-6 ${status.color}`} />
          </div>
          {phishingClicks > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
              <AlertCircle className="w-3 h-3 text-red-400" />
              <span className="text-xs text-red-400 font-bold">{phishingClicks} clics</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col justify-center space-y-2">
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-bold ${status.color} tracking-tight`}>{completionRate}</span>
            <span className="text-slate-400 text-xl">%</span>
          </div>
          <p className="text-slate-300 text-sm font-medium">Employés formés</p>
          
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle2 className={`w-4 h-4 ${status.color}`} />
            <span className="text-xs text-slate-400">Conformité Loi 25</span>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-indigo-400" />
                Formation Employés
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className={`p-4 rounded-xl border ${status.border} ${status.bg} mb-6 text-center`}>
              <span className={`text-2xl font-bold ${status.color}`}>{status.label}</span>
              <p className="text-sm text-slate-400 mt-1">Basé sur les critères de la Loi 25 (Québec)</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-300 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Taux de complétion
                </span>
                <span className={`font-mono font-bold ${completionRate >= 80 ? 'text-emerald-400' : 'text-orange-400'}`}>
                  {trainedEmployees}/{totalEmployees} ({completionRate}%)
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg">
                <span className="text-slate-300 flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4" />
                  Clics phishing (mois)
                </span>
                <span className={`font-mono font-bold ${phishingClicks === 0 ? 'text-emerald-400' : phishingClicks <= 2 ? 'text-orange-400' : 'text-red-400'}`}>
                  {phishingClicks}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-slate-300">Exigences Loi 25 :</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Formation obligatoire à la sécurité</li>
                <li>Tests de phishing réguliers</li>
                <li>Documentation des incidents</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};