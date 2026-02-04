import React, { useState, useEffect } from 'react';
import { lumensecApi } from './services/api';
import { DashboardStats } from './types';
import Dashboard from './components/Dashboard';
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

  return <Dashboard stats={stats} onSelectIncident={(id) => console.log('Incident:', id)} />;
}
