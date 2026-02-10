import React, { useState, useEffect } from 'react';
import { lumensecApi } from './services/api';
import { DashboardStats } from './types';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Login from './components/Login';
import IncidentDetail from './components/IncidentDetail';
import InsuranceQuestionnaire from './components/InsuranceQuestionnaire';
import InsuranceDashboard from './components/InsuranceDashboard';
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
  const [currentView, setCurrentView] = useState<'dashboard' | 'insurance' | 'insurance-dashboard'>('insurance-dashboard');

  useEffect(() => {
    if (user && currentView === 'dashboard') {
      lumensecApi.getStats()
        .then(setStats)
        .catch(err => setError(err.message));
    }
  }, [user, currentView]);

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
        
        <div className="px-4 py-3 border-b border-slate-700">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 mr-2 rounded ${currentView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300'}`}
          >
            SOC Dashboard
          </button>
          <button
            onClick={() => setCurrentView('insurance-dashboard')}
            className={`px-4 py-2 mr-2 rounded ${currentView === 'insurance-dashboard' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300'}`}
          >
            Insurance Dashboard
          </button>
          <button
            onClick={() => setCurrentView('insurance')}
            className={`px-4 py-2 rounded ${currentView === 'insurance' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-300'}`}
          >
            New Assessment
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 mx-4 mt-4 rounded">
            {error}
          </div>
        )}

        {currentView === 'dashboard' ? (
          <Dashboard 
            stats={stats} 
            onSelectIncident={(id) => setSelectedIncidentId(id)}
          />
        ) : currentView === 'insurance-dashboard' ? (
          <InsuranceDashboard />
        ) : (
          <InsuranceQuestionnaire />
        )}

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