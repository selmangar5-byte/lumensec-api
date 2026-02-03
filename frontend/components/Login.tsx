import React, { useState, useEffect } from 'react';
import { lumensecApi } from '../services/api';

interface LoginProps {
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [passcode, setPasscode] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    console.log("LUMENSEC // BOOT SEQUENCE INITIALIZED");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    // Simulation de décryptage pour l'immersion
    setTimeout(async () => {
      const success = await lumensecApi.login(passcode);
      if (success) {
        onSuccess();
      } else {
        setErrorCount(prev => prev + 1);
        setIsAuthenticating(false);
        setPasscode('');
      }
    }, 800);
  };

  const handleEmergencyReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950 opacity-80"></div>
      
      <div className={`relative w-full max-w-md p-10 bg-slate-900/40 backdrop-blur-3xl border ${errorCount > 0 ? 'border-red-500/50 shadow-[0_0_50px_rgba(239,68,68,0.1)]' : 'border-slate-800 shadow-2xl'} rounded-[3rem] text-center transition-all duration-500 ${errorCount > 0 ? 'animate-shake' : ''}`}>
        
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
          }
          .animate-shake { animation: shake 0.5s ease-in-out; }
        `}</style>

        <div className="mb-10 inline-flex items-center justify-center w-24 h-24 bg-slate-950 border border-slate-800 rounded-3xl relative group">
          <div className="absolute inset-0 bg-indigo-500/10 blur-xl group-hover:bg-indigo-500/20 transition-all rounded-full"></div>
          <span className="text-4xl font-black text-white italic relative z-10 tracking-tighter">L</span>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-slate-950 shadow-lg"></div>
        </div>

        <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic mb-2">SOC Commander Login</h1>
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.4em] mb-10">Credentials Required // Operator: Nawal</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input 
              type="password"
              autoFocus
              placeholder="ENTER PASSCODE"
              className={`w-full bg-slate-950 border ${errorCount > 0 ? 'border-red-500 text-red-400' : 'border-slate-800 text-white'} rounded-2xl px-6 py-5 text-center font-mono text-sm tracking-[0.5em] outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800`}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              disabled={isAuthenticating}
            />
            {errorCount > 0 && (
              <p className="absolute -bottom-6 left-0 w-full text-[8px] text-red-500 font-black uppercase tracking-widest italic animate-pulse">
                Access Denied. Try: NAWAL-SOC-01
              </p>
            )}
          </div>

          <button 
            type="submit"
            disabled={isAuthenticating || !passcode}
            className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden
              ${isAuthenticating ? 'bg-indigo-950 text-indigo-400' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 active:scale-95'}
            `}
          >
            {isAuthenticating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : 'Decrypt & Enter'}
          </button>
        </form>

        <div className="mt-12 flex flex-col items-center space-y-6">
          <div className="text-slate-600 text-[8px] font-mono uppercase tracking-widest leading-loose">
            Terminal Node: SOC-ALPHA-01<br/>
            Target: Rails-API:3000
          </div>
          
          <div className="flex space-x-4">
            <button 
              onClick={handleEmergencyReset}
              className="px-4 py-2 border border-slate-800 rounded-lg text-[7px] text-slate-500 hover:text-white uppercase tracking-widest font-black transition-all hover:bg-slate-800"
            >
              [ Flush Cache ]
            </button>
            <a 
              href="http://localhost:3000" 
              target="_blank" 
              className="px-4 py-2 border border-slate-800 rounded-lg text-[7px] text-slate-500 hover:text-emerald-400 uppercase tracking-widest font-black transition-all hover:bg-slate-800"
            >
              [ Check API ]
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;