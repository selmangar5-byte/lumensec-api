import React, { useState, useEffect } from 'react';
import { lumensecApi } from './services/api';
import { DashboardStats } from './types';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Login from './components/Login';
import IncidentDetail from './components/IncidentDetail';
import { LanguageProvider } from './contexts/LanguageContext';

interface User {
  username: string;
  role: string;
  displayName: string;
}

export default function App() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      lumensecApi.getStats()
        .then(setStats)
        .catch(err => setError(err.message));
    }
  }, [user]);

  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />;
  }

  const selectedIncident = selectedIncidentId && stats
    ? stats.recent_incidents.find(i => i.id.toString() === selectedIncidentId)
    : null;

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-900">
        <Header user={user} />
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 mx-4 mt-4 rounded">
            {error}
          </div>
        )}
        <Dashboard 
          stats={stats} 
          onSelectIncident={(id) => setSelectedIncidentId(id)}
        />
        {selectedIncident && (
          <IncidentDetail
            incident={selectedIncident}
            onClose={() => setSelectedIncidentId(null)}
          />
        )}
      </div>
    </LanguageProvider>
  );
}