import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface User {
  username: string;
  role: string;
  displayName: string;
}

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();

  const getRoleBadgeColor = (role: string) => {
    if (role === 'Admin') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (role === 'Analyst') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getUserInitials = (displayName: string) => {
    const parts = displayName.split('-');
    if (parts.length > 1) {
      return parts[0][0] + parts[1][0];
    }
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-2xl font-black text-white italic">L</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight italic">
                LUMENSEC
              </h1>
              <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">
                Security Operating Center
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <a href="#" className="text-sm font-bold text-white uppercase tracking-wider hover:text-indigo-400 transition-colors">
              {t.dashboard}
            </a>
            <a href="#" className="text-sm font-bold text-slate-500 uppercase tracking-wider hover:text-white transition-colors">
              {t.cartography}
            </a>
            
            {/* Language Switcher */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-800">
              <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  language === 'fr'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-500 hover:text-white hover:bg-slate-800'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-slate-500 hover:text-white hover:bg-slate-800'
                }`}
              >
                EN
              </button>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-800">
              <div className="text-right">
                <p className="text-xs font-bold text-white">{user.displayName}</p>
                <div className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{getUserInitials(user.displayName)}</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Tenant Selector */}
        <div className="mt-6 flex items-center space-x-3">
          <select className="bg-slate-900 border border-indigo-500/30 text-white text-xs font-mono px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>PILOT-ALPHA (QUEBEC)</option>
            <option>PILOT-BETA (MONTREAL)</option>
            <option>GLOBAL-DEMO</option>
          </select>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="uppercase tracking-wider">GLOBAL SHS TIME</span>
            <span className="text-white font-bold">{new Date().toLocaleTimeString('fr-FR')}</span>
          </div>
        </div>
      </div>
    </header>
  );
}