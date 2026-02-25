import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  Lock,
  Server,
  Database,
  Calendar,
  DollarSign,
  Target,
  ChevronRight,
  Download,
  Plus,
  ArrowLeft
} from 'lucide-react';

interface Assessment {
  id: number;
  score: number;
  risk_level: string;
  created_at: string;
  section_scores: {
    identity: number;
    data_protection: number;
    endpoint: number;
    network: number;
    incident_response: number;
    compliance: number;
  };
}

interface ComplianceDocument {
  id: string;
  name: string;
  category: 'policy' | 'technical' | 'training' | 'audit';
  status: 'complete' | 'missing' | 'expired' | 'expiring';
  lastUpdated?: string;
  expiryDate?: string;
  required: boolean;
}

interface KPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: any;
  section_key?: string;
}

interface Alert {
  id: string;
  type: 'deadline' | 'vulnerability' | 'compliance' | 'document';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  date: string;
  action?: string;
}

interface InsuranceDashboardProps {
  user: any;
  onStartAssessment?: () => void;
  onNavigate?: (view: 'insurance' | 'dashboard' | 'insurance-dashboard') => void;
}

// Mock data pour documents et alertes (en attendant le backend)
const MOCK_DOCUMENTS: ComplianceDocument[] = [
  { id: '1', name: 'Politique de sécurité informatique', category: 'policy', status: 'complete', lastUpdated: '2024-01-15', required: true },
  { id: '2', name: 'Plan de continuité (PCSI)', category: 'policy', status: 'complete', lastUpdated: '2024-02-01', required: true },
  { id: '3', name: 'Certificat MFA 100%', category: 'technical', status: 'complete', lastUpdated: '2024-02-20', required: true },
  { id: '4', name: 'Rapport de test intrusion', category: 'audit', status: 'expiring', lastUpdated: '2023-08-15', expiryDate: '2024-08-15', required: true },
  { id: '5', name: 'Formation phishing employés', category: 'training', status: 'missing', required: true },
  { id: '6', name: 'Audit Loi 25', category: 'audit', status: 'complete', lastUpdated: '2024-01-10', required: false },
  { id: '7', name: 'Certificat conformité backups', category: 'technical', status: 'expired', lastUpdated: '2023-06-01', expiryDate: '2023-12-01', required: true },
];

const MOCK_ALERTS: Alert[] = [
  { id: '1', type: 'deadline', severity: 'critical', title: 'Renouvellement assurance', description: 'Expire dans 15 jours', date: '2024-03-10', action: 'Préparer documents' },
  { id: '2', type: 'vulnerability', severity: 'critical', title: 'CVE-2024-1234 critique', description: 'Affecte vos firewalls - patch disponible', date: '2024-02-24', action: 'Mettre à jour' },
  { id: '3', type: 'compliance', severity: 'warning', title: 'Certificat backup expiré', description: 'Validez vos backups immuables', date: '2024-02-20', action: 'Relancer test' },
  { id: '4', type: 'document', severity: 'info', title: 'Nouvel assessment disponible', description: 'Vos données ont été mises à jour', date: '2024-02-25' },
];

export default function InsuranceDashboard({ user, onStartAssessment, onNavigate }: InsuranceDashboardProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPI[]>([]);
  
  // Données dérivées des assessments réels
  const latestAssessment = assessments[0];
  const previousAssessment = assessments[1];
  const currentScore = latestAssessment?.score || 0;
  const previousScore = previousAssessment?.score || 0;
  const scoreChange = currentScore - previousScore;
  const trend = scoreChange >= 0 ? 'up' : 'down';
  
  // Données mock pour la démo (à remplacer par API plus tard)
  const [daysUntilRenewal] = useState(15);
  const [potentialSavings] = useState(3500);
  
  const criticalAlerts = MOCK_ALERTS.filter(a => a.severity === 'critical').length;
  const warningAlerts = MOCK_ALERTS.filter(a => a.severity === 'warning').length;
  const missingDocs = MOCK_DOCUMENTS.filter(d => d.status === 'missing' || d.status === 'expired').length;
  const complianceRate = Math.round(((MOCK_DOCUMENTS.length - missingDocs) / MOCK_DOCUMENTS.length) * 100);

  useEffect(() => {
    fetchAssessments();
  }, []);

  useEffect(() => {
    if (latestAssessment?.section_scores) {
      // Mapper les section_scores vers les KPIs
      const mappedKpis: KPI[] = [
        { 
          id: '1', 
          name: 'Taux MFA', 
          value: latestAssessment.section_scores.identity, 
          target: 100, 
          unit: '%', 
          status: latestAssessment.section_scores.identity >= 90 ? 'good' : latestAssessment.section_scores.identity >= 70 ? 'warning' : 'critical',
          trend: 'up', 
          icon: Lock,
          section_key: 'identity'
        },
        { 
          id: '2', 
          name: 'Patching Endpoint', 
          value: latestAssessment.section_scores.endpoint, 
          target: 95, 
          unit: '%', 
          status: latestAssessment.section_scores.endpoint >= 90 ? 'good' : latestAssessment.section_scores.endpoint >= 70 ? 'warning' : 'critical',
          trend: 'stable', 
          icon: Server,
          section_key: 'endpoint'
        },
        { 
          id: '3', 
          name: 'Protection Données', 
          value: latestAssessment.section_scores.data_protection, 
          target: 100, 
          unit: '%', 
          status: latestAssessment.section_scores.data_protection >= 90 ? 'good' : latestAssessment.section_scores.data_protection >= 70 ? 'warning' : 'critical',
          trend: 'up', 
          icon: Database,
          section_key: 'data_protection'
        },
        { 
          id: '4', 
          name: 'Conformité', 
          value: latestAssessment.section_scores.compliance, 
          target: 100, 
          unit: '%', 
          status: latestAssessment.section_scores.compliance >= 90 ? 'good' : latestAssessment.section_scores.compliance >= 70 ? 'warning' : 'critical',
          trend: latestAssessment.section_scores.compliance > (previousAssessment?.section_scores?.compliance || 0) ? 'up' : 'stable', 
          icon: Target,
          section_key: 'compliance'
        },
      ];
      setKpis(mappedKpis);
    }
  }, [latestAssessment, previousAssessment]);

  const fetchAssessments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/insurance_assessments?tenant_id=${user?.tenant_id || '1'}`);
      const data = await response.json();
      // Trier par date décroissante
      const sorted = (data.assessments || []).sort((a: Assessment, b: Assessment) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setAssessments(sorted);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'good': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'complete': return 'text-emerald-400';
      case 'missing': return 'text-red-400';
      case 'expired': return 'text-red-400';
      case 'expiring': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch(level) {
      case 'EXCELLENT': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'GOOD': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'FAIR': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'LOW': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'HIGH': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const handleStartAssessment = () => {
    if (onStartAssessment) {
      onStartAssessment();
    } else if (onNavigate) {
      onNavigate('insurance');
    }
  };

  const handleBackToDashboard = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
        <div className="text-white flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          Chargement des assessments...
        </div>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={handleBackToDashboard}
            className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Retour au Dashboard
          </button>
          
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aucun assessment encore</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Complétez votre premier assessment pour voir votre score de readiness assurance et débloquer les recommandations personnalisées.
            </p>
            <button 
              onClick={handleStartAssessment}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Nouvel Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 space-y-6">
      {/* Navigation retour */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button 
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Retour au Dashboard
        </button>
        
        <button 
          onClick={handleStartAssessment}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all"
        >
          <Plus size={16} />
          Nouvel Assessment
        </button>
      </div>

      {/* HEADER - Score Global */}
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20">
          <Shield className="w-32 h-32 text-indigo-500" />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Insurance Dashboard</h1>
            <p className="text-indigo-300">Cyber Insurance Readiness & Compliance</p>
          </div>
          
          <div className="flex items-center gap-8">
            {/* Score Global */}
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-1">Security Score</div>
              <div className="flex items-center gap-3">
                <span className={`text-5xl font-black ${
                  currentScore >= 80 ? 'text-emerald-400' : 
                  currentScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {currentScore}%
                </span>
                <div className={`flex items-center ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trend === 'up' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  <span className="text-sm font-bold ml-1">{Math.abs(scoreChange)}%</span>
                </div>
              </div>
            </div>
            
            {/* Jours avant renouvellement */}
            <div className="text-center px-8 border-l border-indigo-500/30">
              <div className="text-sm text-slate-400 mb-1">Renouvellement</div>
              <div className={`text-3xl font-black ${daysUntilRenewal <= 15 ? 'text-red-400' : 'text-yellow-400'}`}>
                {daysUntilRenewal}j
              </div>
              {daysUntilRenewal <= 15 && (
                <span className="text-xs text-red-400 bg-red-500/20 px-2 py-1 rounded border border-red-500/30 mt-1 inline-block">
                  Urgent
                </span>
              )}
            </div>
            
            {/* Économies */}
            <div className="text-center px-8 border-l border-indigo-500/30">
              <div className="text-sm text-slate-400 mb-1">Économies potentielles</div>
              <div className="text-3xl font-black text-emerald-400">
                -{potentialSavings.toLocaleString()}$
              </div>
              <span className="text-xs text-slate-500">sur prime annuelle</span>
            </div>
          </div>
        </div>
        
        {/* Barre de progression conformité */}
        <div className="mt-6 pt-6 border-t border-indigo-500/20">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Conformité documents ({complianceRate}%)</span>
            <span className="text-slate-400">{MOCK_DOCUMENTS.length - missingDocs}/{MOCK_DOCUMENTS.length} documents</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 border border-slate-700">
            <div 
              className={`h-3 rounded-full transition-all ${
                complianceRate >= 90 ? 'bg-emerald-500' : 
                complianceRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${complianceRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        
        {/* COLONNE GAUCHE - KPIs (4 colonnes) */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="text-indigo-400" size={20} />
            KPIs Critiques
          </h2>
          
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/30 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(kpi.status)}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-slate-300 font-medium">{kpi.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(kpi.status)}`}>
                    {kpi.status === 'good' ? 'Bon' : kpi.status === 'warning' ? 'Alerte' : 'Critique'}
                  </span>
                </div>
                
                <div className="flex items-end justify-between mb-2">
                  <span className={`text-2xl font-black ${
                    kpi.status === 'good' ? 'text-emerald-400' : 
                    kpi.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {kpi.value}{kpi.unit}
                  </span>
                  <span className="text-xs text-slate-500">Cible: {kpi.target}{kpi.unit}</span>
                </div>
                
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      kpi.status === 'good' ? 'bg-emerald-500' : 
                      kpi.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
          
          {/* Benchmark */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 mt-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="text-indigo-400" size={18} />
              Benchmark Sectoriel
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Votre score</span>
                <span className="text-white font-bold">{currentScore}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Moyenne PME</span>
                <span className="text-yellow-400 font-bold">62%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Top 10%</span>
                <span className="text-emerald-400 font-bold">89%</span>
              </div>
              <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-400 text-center">
                {currentScore > 75 ? 'Vous êtes dans le top 25%' : 'Objectif: atteindre 80%'}
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE CENTRE - Documents & Alertes (5 colonnes) */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          
          {/* Documents de conformité */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="text-indigo-400" size={20} />
                Documents Requis
              </h2>
              {missingDocs > 0 && (
                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-bold border border-red-500/30">
                  {missingDocs} manquant{missingDocs > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {MOCK_DOCUMENTS.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-all">
                  <div className="flex items-center gap-3">
                    {doc.status === 'complete' ? (
                      <CheckCircle className="text-emerald-400" size={18} />
                    ) : doc.status === 'expiring' ? (
                      <AlertCircle className="text-yellow-400" size={18} />
                    ) : (
                      <XCircle className="text-red-400" size={18} />
                    )}
                    <div>
                      <div className="text-sm font-medium text-slate-200">{doc.name}</div>
                      <div className="text-xs text-slate-500 capitalize">
                        {doc.category} {doc.required && <span className="text-red-400">*</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {doc.status === 'complete' && (
                      <span className="text-xs text-emerald-400">{doc.lastUpdated}</span>
                    )}
                    {doc.status === 'expired' && (
                      <span className="text-xs text-red-400">Expiré</span>
                    )}
                    {doc.status === 'expiring' && (
                      <span className="text-xs text-yellow-400">Expire bientôt</span>
                    )}
                    {doc.status === 'missing' && (
                      <button className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded transition-all">
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Alertes */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="text-yellow-400" size={20} />
                Alertes Prioritaires
              </h2>
              <div className="flex gap-2">
                {criticalAlerts > 0 && (
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-bold border border-red-500/30">
                    {criticalAlerts} Critique
                  </span>
                )}
                {warningAlerts > 0 && (
                  <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-bold border border-yellow-500/30">
                    {warningAlerts} Avert.
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              {MOCK_ALERTS.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${
                  alert.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                  alert.severity === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-blue-500/10 border-blue-500/30'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {alert.type === 'deadline' && <Calendar size={16} className="text-slate-400" />}
                      {alert.type === 'vulnerability' && <AlertTriangle size={16} className="text-red-400" />}
                      {alert.type === 'compliance' && <Shield size={16} className="text-yellow-400" />}
                      {alert.type === 'document' && <FileText size={16} className="text-blue-400" />}
                      <span className="font-bold text-white text-sm">{alert.title}</span>
                    </div>
                    <span className="text-xs text-slate-500">{alert.date}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{alert.description}</p>
                  {alert.action && (
                    <button className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded border border-indigo-500/30 hover:border-indigo-500 transition-all flex items-center gap-1">
                      {alert.action}
                      <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE - Historique & Évolution (3 colonnes) */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          
          {/* Graphique évolution simple */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="text-indigo-400" size={18} />
              Évolution Score
            </h2>
            
            <div className="relative h-32 flex items-end justify-between gap-2">
              {[...assessments].reverse().slice(-6).map((assessment, index) => (
                <div key={assessment.id} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full group">
                    <div 
                      className="bg-indigo-500/80 rounded-t transition-all hover:bg-indigo-400"
                      style={{ height: `${(assessment.score / 100) * 80}px` }}
                    />
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded">
                      {assessment.score}%
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(assessment.created_at).toLocaleDateString('fr-FR', { month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
            
            {assessments.length > 1 && (
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs">
                <span className="text-emerald-400">
                  +{assessments[0].score - assessments[assessments.length - 1].score} points depuis le début
                </span>
                <span className="text-slate-500">Tendance: ↗</span>
              </div>
            )}
          </div>
          
          {/* Historique assessments */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Historique</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {assessments.slice(0, 5).map((assessment) => (
                <div key={assessment.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-300">
                      {new Date(assessment.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold border ${getRiskLevelColor(assessment.risk_level)}`}>
                      {assessment.risk_level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-white">{assessment.score}%</span>
                    <div className="text-right text-xs text-slate-500">
                      <div className="flex flex-col gap-1">
                        {Object.entries(assessment.section_scores).slice(0, 2).map(([key, score]) => (
                          <span key={key}>{key.split('_')[0]}: {score}%</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions rapides basées sur le dernier assessment */}
          <div className="bg-gradient-to-br from-red-900/20 to-slate-900 border border-red-500/30 rounded-xl p-4">
            <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
              <AlertTriangle size={18} />
              Actions Prioritaires
            </h3>
            <div className="space-y-2">
              {latestAssessment && Object.entries(latestAssessment.section_scores)
                .filter(([_, score]) => score < 80)
                .slice(0, 3)
                .map(([key, score], idx) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${score < 60 ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'}`}>
                      {score}%
                    </span>
                  </div>
                ))}
              {(!latestAssessment || Object.values(latestAssessment.section_scores).every(s => s >= 80)) && (
                <div className="text-sm text-emerald-400 text-center py-2">
                  Tous les indicateurs sont bons !
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
        <div className="text-center">
          <div className="text-2xl font-black text-white">
            {(assessments.reduce((acc, a) => acc + a.score, 0) / assessments.length / 20).toFixed(1)}/5
          </div>
          <div className="text-xs text-slate-500">Maturité cyber moyenne</div>
        </div>
        <div className="text-center border-l border-slate-800">
          <div className={`text-2xl font-black ${
            currentScore >= 80 ? 'text-emerald-400' : 
            currentScore >= 60 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {currentScore >= 80 ? 'A-' : currentScore >= 60 ? 'B+' : 'C'}
          </div>
          <div className="text-xs text-slate-500">Notation assureur estimée</div>
        </div>
        <div className="text-center border-l border-slate-800">
          <div className="text-2xl font-black text-indigo-400">{assessments.length}</div>
          <div className="text-xs text-slate-500">Assessments réalisés</div>
        </div>
        <div className="text-center border-l border-slate-800">
          <div className="text-2xl font-black text-blue-400">98.5%</div>
          <div className="text-xs text-slate-500">Disponibilité service</div>
        </div>
      </div>
    </div>
  );
}