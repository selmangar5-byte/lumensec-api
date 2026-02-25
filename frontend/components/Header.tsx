import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface User {
  username: string;
  role: string;
  displayName: string;
}

interface HeaderProps {
  user?: User;
  currentView?: string;
  onViewChange?: (view: 'dashboard' | 'insurance' | 'insurance-dashboard' | 'report' | 'template-preview') => void;
  onLogout?: () => void;
}

export default function Header({ user, currentView = 'dashboard', onViewChange, onLogout }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();

  const defaultUser: User = {
    username: 'guest',
    role: 'Guest',
    displayName: 'Invité'
  };

  const currentUser = user || defaultUser;

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

  const navButtonClass = (view: string) => {
    const isActive = currentView === view;
    if (isActive) {
      return 'px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/40 scale-105 transition-all border border-indigo-400';
    }
    return 'px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-700 hover:text-white hover:border-indigo-400 border border-slate-700 transition-all';
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="container mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 cursor-pointer"
              onClick={() => onViewChange?.('dashboard')}
            >
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

        
          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-1 border border-slate-800">
              <button
                onClick={() => setLanguage('fr')}
                className={language === 'fr' ? 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md bg-indigo-600 text-white shadow-md' : 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md text-slate-500 hover:text-white hover:bg-slate-800'}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md bg-indigo-600 text-white shadow-md' : 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md text-slate-500 hover:text-white hover:bg-slate-800'}
              >
                EN
              </button>
            </div>

            <div className="w-px h-6 bg-slate-700"></div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs font-bold text-white">{currentUser.displayName}</p>
                <div className={'inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ' + getRoleBadgeColor(currentUser.role)}>
                  {currentUser.role}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{getUserInitials(currentUser.displayName)}</span>
              </div>
              {onLogout && (
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 text-xs font-bold text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-all uppercase tracking-wider border border-red-500/30 hover:border-red-500"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}