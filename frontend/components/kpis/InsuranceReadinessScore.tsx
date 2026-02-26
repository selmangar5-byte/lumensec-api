import React, { useState } from 'react';
import { Award, X, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface InsuranceReadinessProps {
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  impact: number; // pourcentage impact sur prime (-20 = -20%, +15 = +15%)
  details: {
    mttc: number; // minutes
    backups: number; // score 0-100
    mfa: number; // pourcentage
    formation: number; // pourcentage
  };
}

export const InsuranceReadinessScore: React.FC<InsuranceReadinessProps> = ({ 
  grade, 
  impact, 
  details 
}) => {
  const [showModal, setShowModal] = useState(false);

  const getGradeColor = (g: string) => {
    switch(g) {
      case 'A+': return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/20' };
      case 'A': return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10' };
      case 'B+': return { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'shadow-blue-500/20' };
      case 'B': return { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'shadow-blue-500/10' };
      case 'C': return { text: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', glow: 'shadow-red-500/20' };
      default: return { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', glow: '' };
    }
  };

  const colors = getGradeColor(grade);
  const isPositive = impact < 0;
  const ImpactIcon = isPositive ? TrendingDown : (impact > 0 ? TrendingUp : Minus);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className={`bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 cursor-pointer hover:bg-slate-800/70 transition-all hover:border-indigo-500/30 group h-full flex flex-col ${colors.glow} shadow-lg`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Award className={`w-6 h-6 ${colors.text}`} />
          </div>
          <span className="text-xs text-slate-500 font-mono">ASSURANCE</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center space-y-3">
          <div className="flex items-baseline gap-3">
            <span className={`text-6xl font-black ${colors.text} tracking-tighter`}>{grade}</span>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} w-fit`}>
            <ImpactIcon className="w-4 h-4" />
            <span className="text-sm font-bold">
              Prime {isPositive ? '-' : '+'}{Math.abs(impact)}%
            </span>
          </div>
          
          <p className="text-slate-400 text-xs mt-2">
            Basé sur MTTC, Backups, MFA et Formation
          </p>
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
                <Award className="w-6 h-6 text-indigo-400" />
                Critères assureurs
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <span className={`text-7xl font-black ${colors.text}`}>{grade}</span>
              <p className="text-slate-400 mt-2">Notation de conformité</p>
            </div>

            <div className="space-y-3 mb-6">
              <DetailRow label="MTTC (Temps de réponse)" value={`${details.mttc} min`} status={details.mttc <= 15 ? 'good' : details.mttc <= 60 ? 'warning' : 'bad'} />
              <DetailRow label="Backups validés" value={`${details.backups}%`} status={details.backups >= 90 ? 'good' : details.backups >= 70 ? 'warning' : 'bad'} />
              <DetailRow label="MFA déployé" value={`${details.mfa}%`} status={details.mfa >= 80 ? 'good' : details.mfa >= 50 ? 'warning' : 'bad'} />
              <DetailRow label="Formation employés" value={`${details.formation}%`} status={details.formation >= 90 ? 'good' : details.formation >= 70 ? 'warning' : 'bad'} />
            </div>

            <div className={`p-4 rounded-xl border ${isPositive ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-red-500/20 bg-red-500/10'} text-center`}>
              <p className="text-sm text-slate-300">Impact estimé sur votre prime d'assurance</p>
              <p className={`text-2xl font-bold mt-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? 'Économie' : 'Surcoût'} de {Math.abs(impact)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DetailRow: React.FC<{ label: string, value: string, status: 'good' | 'warning' | 'bad' }> = ({ label, value, status }) => {
  const colors = {
    good: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    warning: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
    bad: 'text-red-400 border-red-500/20 bg-red-500/5'
  };
  
  return (
    <div className={`flex justify-between items-center p-3 rounded-lg border ${colors[status]}`}>
      <span className="text-slate-300 text-sm">{label}</span>
      <span className="font-mono font-bold">{value}</span>
    </div>
  );
};
