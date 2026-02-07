import React, { useState, useEffect } from 'react';
import { lumensecApi } from './services/api';
import { DashboardStats } from './types';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Login from './components/Login';
import IncidentDetail from './components/IncidentDetail';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

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

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-900">
        <Header />
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 mx-4 mt-4 rounded">
            {error}
          </div>
        )}
        <Dashboard 
          stats={stats} 
          onIncidentClick={(id) => setSelectedIncidentId(id)}
        />
        {selectedIncidentId && (
          <IncidentDetail
            incidentId={selectedIncidentId}
            onClose={() => setSelectedIncidentId(null)}
          />
        )}
      </div>
    </LanguageProvider>
  );
}