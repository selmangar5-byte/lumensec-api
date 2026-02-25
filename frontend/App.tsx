import React, { useState, useEffect } from 'react';
import { lumensecAPI } from './services/api';
import { DashboardStats } from './types';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Login from './components/Login';
import IncidentDetail from './components/IncidentDetail';
import InsuranceQuestionnaire from './components/InsuranceQuestionnaire';
import InsuranceDashboard from './components/InsuranceDashboard';
import ReportModal from './components/ReportModal';
import TemplatePreviewPage from './pages/TemplatePreviewPage';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'insurance' | 'insurance-dashboard' | 'report' | 'template-preview'>('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [reopenLoi25Modal, setReopenLoi25Modal] = useState(false);

  useEffect(() => {
    if (authenticated) {
      loadStats();
    }
  }, [authenticated]);

  const loadStats = async () => {
    try {
      const data = await lumensecAPI.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Erreur chargement données');
    }
  };

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-950">
        <Header 
          currentView={currentView} 
          onViewChange={setCurrentView}
          onLogout={() => setAuthenticated(false)}
        />
        
        <main className="container mx-auto p-6">
          {currentView === 'dashboard' && (
            <Dashboard 
              stats={stats} 
              onSelectIncident={setSelectedIncidentId}
              onOpenTemplatePreview={(type) => {
                setSelectedTemplate(type || '');
                setCurrentView('template-preview');
              }}
              onNavigate={setCurrentView}
              currentView={currentView}
              onViewChange={setCurrentView}
              reopenLoi25Modal={reopenLoi25Modal}
              onLoi25ModalReopened={() => setReopenLoi25Modal(false)}
            />
          )}
          
          {currentView === 'insurance' && <InsuranceQuestionnaire />}
          {currentView === 'insurance-dashboard' && <InsuranceDashboard />}
          {currentView === 'report' && <ReportModal onClose={() => setCurrentView('dashboard')} />}
          {currentView === 'template-preview' && (
            <TemplatePreviewPage 
              templateType={selectedTemplate} 
              onBack={() => {
                setCurrentView('dashboard');
                setReopenLoi25Modal(true);
              }} 
            />
          )}
          
          {selectedIncidentId && (
            <IncidentDetail 
              incidentId={selectedIncidentId} 
              onClose={() => setSelectedIncidentId(null)}
            />
          )}
        </main>
      </div>
    </LanguageProvider>
  );
}