
import React, { useState, useEffect } from 'react';
import { lumensecApi } from '../services/api';

interface HeaderProps {
  currentView?: 'dashboard' | 'cartography';
  onViewChange?: (view: 'dashboard' | 'cartography') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [time, setTime] = useState(new Date());
  const [load, setLoad] = useState(12);
  const currentTenant = localStorage.getItem('lumensec_tenant_id') || '1';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const loadTimer = setInterval(() => setLoad(prev => Math.max(5, Math.min(45, prev + (Math.random() * 4 - 2)))), 3000);
    return () => {
      clearInterval(timer);
      clearInterval(loadTimer);
    };
  }, []);

  return (
    <header className="bg-slate-950/80 border-b border-slate-800/50 sticky top-0 z-50 backdrop-blur-2xl overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50 animate-[scan_4s_linear_infinite]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-6">
            <div className="relative group cursor-pointer" onClick={() => onViewChange?.('dashboard')}>
               <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000"></div>
               <div className="relative w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 shadow-2xl transition-all group-hover:scale-105">
                 <span className="text-white font-black text-2xl tracking-tighter italic">L</span>
               </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black tracking-tighter text-white uppercase leading-none italic">Lumensec</h1>
                <select 
                  value={currentTenant}
                  onChange={(e) => lumensecApi.setTenant(e.target.value)}
                  className="bg-emerald-500/10 text-emerald-400 text-[10px] px-3 py-1 rounded-lg border border-emerald-500/20 font-black tracking-widest uppercase outline-none focus:border-emerald-500 transition-all cursor-pointer"
                >
                  <option value="1" className="bg-slate-950">Pilot-Alpha (Quebec)</option>
                  <option value="2" className="bg-slate-950">Pilot-Beta (Montreal)</option>
                  <option value="3" className="bg-slate-950">Global-Demo</option>
                </select>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
             <button 
               onClick={() => onViewChange?.('dashboard')}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
             >
               Dashboard
             </button>
             <button 
               onClick={() => onViewChange?.('cartography')}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'cartography' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
             >
               Cartography
             </button>
          </nav>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex flex-col text-right mr-2">
               <span className="text-slate-500 text-[9px] font-mono uppercase tracking-widest">Global Ops Time</span>
               <span className="text-white text-[11px] font-black font-mono tracking-widest">{time.toLocaleTimeString()}</span>
            </div>
            <div 
              className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 p-1 flex items-center justify-center overflow-hidden hover:border-emerald-500 transition-colors cursor-pointer group" 
              onClick={() => lumensecApi.logout()}
              title="Logout / Switch Operator"
            >
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Nawal&backgroundColor=0f172a`} alt="Avatar" className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
