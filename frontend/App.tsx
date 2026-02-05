import React, { useState, useEffect } from 'react';
import { lumensecApi } from './services/api';
import { DashboardStats } from './types';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Login from './components/Login';

export default function App() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated) {
      lumensecApi.getStats()
        .then(setStats)
        .catch(err => setError(err.message));
    }
  }, [authenticated]);

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erreur</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p>Chargement du SOC...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main className="container mx-auto px-8 py-12">
        <Dashboard stats={stats} onSelectIncident={(id) => console.log('Incident:', id)} />
      </main>
      <footer className="border-t border-slate-800 py-8 mt-20">
        <div className="container mx-auto px-8 text-center">
          <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em]">
            © 2025 Lumensec // Security Operating Center // Project Finalized by Nawal
          </p>
        </div>
      </footer>
    </div>
  );
}
