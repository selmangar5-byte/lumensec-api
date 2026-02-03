
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import IncidentDetail from './components/IncidentDetail';
import Login from './components/Login';
import CartographyView from './components/CartographyView';
import { lumensecApi } from './services/api';
import { DashboardStats, Incident } from './types';

/**
 * Lumensec Main Application Controller
 * © 2025 Lumensec Inc. - Nawal Tech Lead
 */
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('lumensec_token'));
  const [currentView, setCurrentView] = useState<'dashboard' | 'cartography'>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await lumensecApi.getStats();
      setStats(data);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("API Fetch Error:", err);
      setError("DÉFAUT DE LIAISON : Le SOC-SERVER (port 3000) ne répond pas. Nawal, assurez-vous que 'rails s -p 3000' est actif dans votre terminal.");
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchIncidentDetail = useCallback(async (id: string) => {
    try {
      const detail = await lumensecApi.getIncident(id);
      setSelectedIncident(detail);
    } catch (err) {
      console.error("Incident Detail Error:", err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchData]);

  useEffect(() => {
    if (selectedIncidentId) {
      fetchIncidentDetail(selectedIncidentId);
    } else {
      setSelectedIncident(null);
    }
  }, [selectedIncidentId, fetchIncidentDetail]);

  const handleStatusUpdate = (updated: Incident) => {
    setSelectedIncident(updated);
    fetchData(); // Refresh metrics
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-50"></div>
      
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {loading && !stats ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 bg-indigo-500/5 blur-xl rounded-full animate-pulse"></div>
            </div>
            <p className="text-slate-400 font-mono text-[10px] animate-pulse uppercase tracking-[0.4em] italic">Synchronizing Secure Link...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/10 border border-red-500/20 p-12 rounded-[2.5rem] text-center max-w-2xl mx-auto shadow-2xl backdrop-blur-md">
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tight">SOC-LINK DISRUPTED</h2>
            <p className="text-slate-400 mb-8 font-medium leading-relaxed italic text-sm">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => fetchData()}
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
              >
                Reconnect Node
              </button>
            </div>
          </div>
        ) : currentView === 'cartography' ? (
          <CartographyView />
        ) : selectedIncidentId && selectedIncident ? (
          <IncidentDetail 
            incident={selectedIncident} 
            onBack={() => setSelectedIncidentId(null)} 
            onStatusUpdate={handleStatusUpdate}
          />
        ) : stats ? (
          <Dashboard 
            stats={stats} 
            onSelectIncident={(id) => {
              setSelectedIncidentId(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
          />
        ) : null}
      </main>

      <footer className="py-12 border-t border-slate-900/50 text-center relative z-10">
        <p className="text-slate-600 text-[9px] uppercase tracking-[0.5em] font-mono">
          &copy; 2025 Lumensec // Security Operating Center // Project Finalized by Nawal
        </p>
      </footer>
    </div>
  );
};

export default App;
