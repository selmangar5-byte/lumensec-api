import React, { useState, useEffect } from 'react';
import { Shield, Lock, Unlock, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface RansomwareStats {
  protectionLevel: 'secure' | 'warning' | 'critical';
  blockedToday: number;
  lastAttack: string | null;
  signaturesUpdated: string;
  backupStatus: 'complete' | 'pending' | 'failed';
  encryptedFiles: number;
  isolatedEndpoints: number;
}

const RansomwareWedge: React.FC = () => {
  const [stats, setStats] = useState<RansomwareStats>({
    protectionLevel: 'secure',
    blockedToday: 3,
    lastAttack: 'Il y a 2 heures',
    signaturesUpdated: 'Il y a 15 min',
    backupStatus: 'complete',
    encryptedFiles: 0,
    isolatedEndpoints: 2
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getProtectionColor = () => {
    switch (stats.protectionLevel) {
      case 'secure': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'warning': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'critical': return 'text-red-400 border-red-500/30 bg-red-500/10';
    }
  };

  const getShieldIcon = () => {
    switch (stats.protectionLevel) {
      case 'secure': return <Shield className="w-8 h-8 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-8 h-8 text-amber-400" />;
      case 'critical': return <Unlock className="w-8 h-8 text-red-400" />;
    }
  };

  const handleEmergencyIsolate = () => {
    alert('🚨 Mode d\'urgence activé - Tous les endpoints sont isolés');
  };

  const handleForceBackup = () => {
    alert('💾 Sauvegarde immédiate lancée sur tous les systèmes critiques');
  };

  return (
    <>
      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}</style>
      
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${getProtectionColor()}`}>
              {getShieldIcon()}
            </div>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight uppercase">
                Anti-Ransomware Core
              </h3>
              <p className="text-slate-400 text-xs mt-1 flex items-center gap-2">
                <Activity className="w-3 h-3" />
                Protection temps réel active
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
            stats.protectionLevel === 'secure' 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {stats.protectionLevel === 'secure' ? 'SECURE' : 'ALERT'}
          </div>
        </div>

        {/* Circular Protection Indicator avec pulse */}
        <div className="flex justify-center mb-6">
          <div className={`relative w-32 h-32 rounded-full border-4 ${
            isAnimating ? 'animate-pulse' : ''
          } ${stats.protectionLevel === 'secure' ? 'border-emerald-500/50' : 'border-amber-500/50'}`}>
            <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
              <span className="text-3xl font-black text-white">
                {stats.blockedToday}
              </span>
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                Bloqués
              </span>
            </div>
            {/* Anneau tournant */}
            <div className={`absolute inset-[-4px] rounded-full border-2 border-t-transparent border-l-transparent ${
              stats.protectionLevel === 'secure' ? 'border-emerald-400' : 'border-amber-400'
            } animate-spin`} style={{ animationDuration: '3s' }} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/50">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Dernière attaque</p>
            <p className="text-white font-semibold text-sm">{stats.lastAttack || 'Aucune'}</p>
          </div>
          
          <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/50">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Signatures</p>
            <p className="text-emerald-400 font-semibold text-sm flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {stats.signaturesUpdated}
            </p>
          </div>
          
          <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/50">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Fichiers chiffrés</p>
            <p className={`font-semibold text-sm ${stats.encryptedFiles > 0 ? 'text-red-400' : 'text-white'}`}>
              {stats.encryptedFiles} détectés
            </p>
          </div>
          
          <div className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/50">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Endpoints isolés</p>
            <p className="text-amber-400 font-semibold text-sm">{stats.isolatedEndpoints}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button 
            onClick={handleEmergencyIsolate}
            className="w-full py-3 bg-gradient-to-r from-red-600/80 to-orange-600/80 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-red-500/30"
          >
            <Lock className="w-4 h-4" />
            Isoler tous les endpoints
          </button>
          
          {/* Bouton avec effet de scan laser */}
          <button 
            onClick={handleForceBackup}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-cyan-500/30 relative overflow-hidden"
          >
            {/* Effet de bande de scan continue */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent w-full h-full animate-scan skew-x-12"></div>
            
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Forcer la sauvegarde immédiate
            </span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Protection 24/7</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Actif
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RansomwareWedge;