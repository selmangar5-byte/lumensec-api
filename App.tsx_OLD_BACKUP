import React, { useState, useEffect } from 'react';
import { lumensecApi } from './services/api';
import { DashboardStats } from './types';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Login from './components/Login';
import IncidentDetail from './components/IncidentDetail';
import InsuranceQuestionnaire from './components/InsuranceQuestionnaire';
import InsuranceDashboard from './components/InsuranceDashboard';
import ReportModal from './components/ReportModal';
import M365Config from './components/M365Config';
import TemplatePreviewPage from './pages/TemplatePreviewPage';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'insurance' | 'insurance-dashboard' | 'report' | 'database' | 'template-preview'>('dashboard');
  const [previewTemplateType, setPreviewTemplateType] = useState<string>('');

  useEffect(() => {
    if (authenticated) {
      lumensecApi.getStats()
        .then(setStats)
        .catch(err => setError(err.message));
    }
  }, [authenticated]);

  const handleSelectIncident = (id: string | number) => {
    setSelectedIncidentId(String(id));
  };

  const handleOpenTemplatePreview = (templateType: string) => {
    setPreviewTemplateType(templateType);
    setCurrentView('template-preview');
  };

  // CORRIGÉ : Retourne au dashboard et met le flag pour rouvrir Loi25
  const handleBackFromPreview = () => {
    localStorage.setItem('reopen_loi25_modal', 'true');
    setCurrentView('dashboard');
  };

  const selectedIncident = selectedIncidentId && stats
    ? stats.recent_incidents.find(i => String(i.id) === selectedIncidentId)
    : null;

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-950">
        <Header />
        
        {/* BARRE DE NAVIGATION - Cachée en mode preview */}
        {currentView !== 'template-preview' && (
          <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                currentView === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              SOC Dashboard
            </button>
            
            <button
              onClick={() => setCurrentView('insurance-dashboard')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                currentView === 'insurance-dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Insurance Dashboard
            </button>
            
            <button
              onClick={() => setCurrentView('report')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                currentView === 'report' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              📊 Rapport PDF
            </button>
            
            <button
              onClick={() => setCurrentView('insurance')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                currentView === 'insurance' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              New Assessment
            </button>
            
            <div className="flex-grow"></div>
            
            <button
              onClick={() => setCurrentView('database')}
              className={`px-3 py-1.5 text-xs rounded transition-colors border ${
                currentView === 'database' 
                  ? 'bg-cyan-600 text-white border-cyan-500' 
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
              }`}
            >
              🗄️ Base de données
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 mx-4 mt-4 rounded">
            {error}
          </div>
        )}

        {/* CONTENU */}
        {currentView === 'dashboard' && (
          <main className="container mx-auto px-8 py-12">
            <Dashboard stats={stats} onSelectIncident={handleSelectIncident} />
          </main>
        )}
        
        {currentView === 'insurance-dashboard' && (
          <main className="container mx-auto px-8 py-12">
            <InsuranceDashboard 
              user={{username: 'admin', role: 'analyst', displayName: 'Admin'}} 
              onOpenTemplatePreview={handleOpenTemplatePreview}
            />
          </main>
        )}
        
        {currentView === 'template-preview' && (
          <TemplatePreviewPage 
            templateType={previewTemplateType} 
            onBack={handleBackFromPreview}
          />
        )}
        
        {currentView === 'report' && (
          <main className="container mx-auto px-8 py-12">
            <ReportModal onClose={() => setCurrentView('dashboard')} />
          </main>
        )}
        
        {currentView === 'database' && (
          <main className="container mx-auto px-8 py-12">
            <M365Config />
          </main>
        )}
        
        {currentView === 'insurance' && (
          <main className="container mx-auto px-8 py-12">
            <InsuranceQuestionnaire user={{username: 'admin', role: 'analyst', displayName: 'Admin'}} />
          </main>
        )}

        {selectedIncident && (
          <IncidentDetail 
            incident={selectedIncident} 
            onClose={() => setSelectedIncidentId(null)} 
          />
        )}
        
        <footer className="border-t border-slate-800 py-8 mt-20">
          <div className="container mx-auto px-8 text-center">
            <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em]">
              © 2025 Lumensec // Security Operating Center
            </p>
          </div>
        </footer>
      </div>
    </LanguageProvider>
  );
}