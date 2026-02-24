import React, { useState, useEffect } from 'react';
import { 
  X, Shield, CheckCircle, Lock, FileText, Database, AlertTriangle, 
  Loader2, Download, TrendingUp, AlertOctagon, FileDown, Printer, Eye 
} from 'lucide-react';

interface Loi25Assessment {
  id: number;
  tenant_id: string;
  score: number;
  status: 'COMPLIANT' | 'AT_RISK';
  governance: boolean;
  data_inventory: boolean;
  consent_management: boolean;
  security_measures: boolean;
  breach_notification: boolean;
  data_retention: boolean;
  created_at: string;
  updated_at: string;
  details: {
    pii_protection: { score: number; max: number; label: string; icon: string };
    access_logging: { score: number; max: number; label: string; icon: string };
    consent_management: { score: number; max: number; label: string; icon: string };
    retention_policies: { score: number; max: number; label: string; icon: string };
    breach_response: { score: number; max: number; label: string; icon: string };
    gaps: string[];
    pii_inventory: {
      locations_found: number;
      compliant: number;
      at_risk: number;
      types_detected: string[];
    };
  };
  score_percentage: number;
  gap_count: number;
}

interface Loi25ModalProps {
  onClose: () => void;
  onOpenTemplatePreview?: (templateType: string) => void; // 🆕 NOUVEAU
}

const API_BASE_URL = '/api';

const Loi25Modal: React.FC<Loi25ModalProps> = ({ onClose, onOpenTemplatePreview }) => {
  const [assessment, setAssessment] = useState<Loi25Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [consultingTemplate, setConsultingTemplate] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    governance: false,
    data_inventory: false,
    consent_management: false,
    security_measures: false,
    breach_notification: false,
    data_retention: false
  });

  const tenantId = localStorage.getItem('tenant_id') || '11111111-1111-1111-1111-111111111111';

  useEffect(() => {
    fetchLatestAssessment();
  }, []);

  const fetchLatestAssessment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/loi25_assessments`, {
        headers: { 
          'X-Tenant-ID': tenantId,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 404 || response.status === 204) {
        setShowForm(true);
        setLoading(false);
        return;
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const assessments = Array.isArray(data) ? data : data.assessments;
      
      if (assessments && assessments.length > 0) {
        setAssessment(assessments[0]);
        setShowForm(false);
      } else {
        setShowForm(true);
      }
    } catch (err) {
      console.error('Erreur fetch:', err);
      setError('Mode formulaire activé (API indisponible)');
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/loi25_assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId
        },
        body: JSON.stringify({ assessment: formData })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Erreur serveur');
      }

      const newAssessment = await response.json();
      setAssessment(newAssessment);
      setShowForm(false);
      
      setFormData({
        governance: false,
        data_inventory: false,
        consent_management: false,
        security_measures: false,
        breach_notification: false,
        data_retention: false
      });
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const generateReportHTML = (data: any) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Rapport Loi 25 - ${data.tenant_id || 'LumenSec'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
          .header h1 { margin: 0; font-size: 28px; }
          .score-container { text-align: center; margin: 40px 0; padding: 30px; background: #f8fafc; border-radius: 12px; border: 2px solid #e2e8f0; }
          .score { font-size: 72px; font-weight: bold; margin: 20px 0; }
          .compliant { color: #059669; } .at-risk { color: #dc2626; }
          .status-badge { display: inline-block; padding: 10px 20px; border-radius: 20px; font-weight: bold; font-size: 18px; }
          .status-compliant { background: #d1fae5; color: #065f46; }
          .status-at-risk { background: #fee2e2; color: #991b1b; }
          .section { margin: 30px 0; padding: 25px; background: #f8fafc; border-radius: 12px; border-left: 4px solid #3b82f6; }
          .checklist { list-style: none; padding: 0; }
          .checklist li { padding: 12px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px; }
          .gaps-section { background: #fef2f2; border-left-color: #dc2626; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 Rapport de Conformité Loi 25</h1>
          <p>Date: ${new Date(data.created_at).toLocaleDateString('fr-CA')}</p>
        </div>
        <div class="score-container">
          <div style="font-size: 18px; color: #64748b; margin-bottom: 10px;">Score de Conformité</div>
          <div class="score ${data.status === 'COMPLIANT' ? 'compliant' : 'at-risk'}">${Math.round((data.score / 10) * 100)}%</div>
          <div class="status-badge ${data.status === 'COMPLIANT' ? 'status-compliant' : 'status-at-risk'}">${data.status === 'COMPLIANT' ? '✅ CONFORME' : '⚠️ À RISQUE'}</div>
          <div style="margin-top: 15px; color: #64748b;">Score: ${data.score}/10 points</div>
        </div>
        <div class="section">
          <h2>📊 Points de contrôle</h2>
          <ul class="checklist">
            <li>${data.governance ? '✅' : '❌'} Gouvernance: DPO désigné</li>
            <li>${data.data_inventory ? '✅' : '❌'} Inventaire PII</li>
            <li>${data.consent_management ? '✅' : '❌'} Gestion consentements</li>
            <li>${data.security_measures ? '✅' : '❌'} Mesures sécurité</li>
            <li>${data.breach_notification ? '✅' : '❌'} Notification 72h</li>
            <li>${data.data_retention ? '✅' : '❌'} Conservation</li>
          </ul>
        </div>
        ${data.details?.gaps && data.details.gaps.length > 0 ? `
        <div class="section gaps-section">
          <h2>⚠️ Points d'amélioration</h2>
          <ul class="checklist">${data.details.gaps.map((gap: string) => `<li>🔴 ${gap}</li>`).join('')}</ul>
        </div>` : ''}
        <div class="footer">
          <p><strong>Document généré par LumenSec</strong></p>
          <p>Conformité Loi 25 Québec</p>
        </div>
      </body>
      </html>
    `;
  };

  const downloadReport = async () => {
    if (!assessment) return;
    try {
      const response = await fetch(`${API_BASE_URL}/loi25_assessments/${assessment.id}`, {
        headers: { 'X-Tenant-ID': tenantId }
      });
      if (!response.ok) throw new Error('Données non disponibles');
      const data = await response.json();
      const reportHTML = generateReportHTML(data);
      const blob = new Blob([reportHTML], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rapport_Loi25_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Erreur lors du téléchargement');
    }
  };

  const printReport = async () => {
    if (!assessment) return;
    try {
      const response = await fetch(`${API_BASE_URL}/loi25_assessments/${assessment.id}`, {
        headers: { 'X-Tenant-ID': tenantId }
      });
      if (!response.ok) throw new Error('Données non disponibles');
      const data = await response.json();
      const reportHTML = generateReportHTML(data);
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(reportHTML);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
      }
    } catch (err) {
      alert('Erreur lors de l\'impression');
    }
  };

  // 🆕 FONCTION MODIFIÉE : Utilise la prop onOpenTemplatePreview
  const consultTemplate = (templateType: string, templateName: string) => {
    setConsultingTemplate(templateType);
    if (onOpenTemplatePreview) {
      onOpenTemplatePreview(templateType);
    }
    onClose(); // Ferme le modal
  };

  const getRecommendedTemplates = () => {
    if (!assessment) return [];
    const templates = [];
    if (!assessment.governance) {
      templates.push({ key: 'dpo_nomination', label: 'Lettre de nomination DPO', description: 'Nommer un responsable de la protection des données (obligatoire)', icon: Shield, color: 'indigo', priority: 'high' });
    }
    if (!assessment.data_inventory) {
      templates.push({ key: 'pii_registry', label: 'Registre des données personnelles', description: 'Inventaire obligatoire de tous les traitements (Article 16)', icon: Database, color: 'blue', priority: 'high' });
    }
    if (!assessment.consent_management) {
      templates.push({ key: 'consent_form', label: 'Formulaire de consentement', description: 'Pour recueillir les consentements de manière valide', icon: CheckCircle, color: 'emerald', priority: 'medium' });
    }
    if (!assessment.breach_notification) {
      templates.push({ key: 'breach_procedure', label: 'Procédure violation 72h', description: 'Plan d\'action en cas de fuite de données (Article 19)', icon: AlertTriangle, color: 'red', priority: 'high' });
    }
    if (!assessment.data_retention || !assessment.security_measures || assessment.gap_count >= 2) {
      templates.push({ key: 'privacy_policy', label: 'Politique de confidentialité', description: 'Document légal à publier sur votre site web', icon: FileText, color: 'purple', priority: 'medium' });
    }
    return templates;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8) return 'from-emerald-500 to-green-400';
    if (score >= 5) return 'from-yellow-500 to-orange-400';
    return 'from-red-500 to-orange-500';
  };

  const categoryConfig = [
    { key: 'pii_protection', icon: Lock, title: 'Protection des données', desc: 'Inventaire et classification PII' },
    { key: 'access_logging', icon: FileText, title: 'Journalisation', desc: 'Logs d\'accès et audit trail' },
    { key: 'consent_management', icon: CheckCircle, title: 'Gestion consentements', desc: 'Recueil et retrait consentements' },
    { key: 'retention_policies', icon: Database, title: 'Conservation', desc: 'Politiques de rétention 5 ans' },
    { key: 'breach_response', icon: AlertTriangle, title: 'Réponse incidents', desc: 'Notification 72h et plan d\'action' }
  ];

  const requirements = [
    { key: 'governance', label: 'Gouvernance (DPO désigné)', icon: Shield },
    { key: 'data_inventory', label: 'Inventaire PII complet', icon: Database },
    { key: 'consent_management', label: 'Gestion des consentements', icon: CheckCircle },
    { key: 'security_measures', label: 'Mesures de sécurité (chiffrement)', icon: Lock },
    { key: 'breach_notification', label: 'Plan de notification 72h', icon: AlertTriangle },
    { key: 'data_retention', label: 'Politique de conservation', icon: FileText }
  ];

  const recommendedTemplates = getRecommendedTemplates();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-2xl p-8 flex items-center gap-3 border border-indigo-500/30">
          <Loader2 className="animate-spin text-indigo-400" size={24} />
          <span className="text-white">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-indigo-500/30 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-indigo-900/90 to-gray-900 border-b border-indigo-500/30 p-6 flex justify-between items-start backdrop-blur-sm z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-indigo-400" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-white">Loi 25 Compliance</h2>
                <p className="text-indigo-300 text-sm">Évaluation conformité Loi 25 (Québec)</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {assessment && (
              <>
                <button onClick={downloadReport} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-semibold">
                  <Download size={16} /> Télécharger
                </button>
                <button onClick={printReport} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-semibold">
                  <Printer size={16} /> Imprimer
                </button>
              </>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors ml-2">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm flex items-center gap-2">
              <AlertOctagon size={16} /> {error}
            </div>
          )}

          {showForm ? (
            <div className="space-y-6">
              <div className="bg-indigo-900/20 rounded-xl p-6 border border-indigo-500/20">
                <h3 className="text-xl font-bold text-white mb-2">Nouvelle évaluation Loi 25</h3>
                <p className="text-gray-400 text-sm">Cochez les mesures actuellement en place :</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {requirements.map((req) => {
                  const Icon = req.icon;
                  const checked = formData[req.key as keyof typeof formData];
                  return (
                    <label key={req.key} className={`flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all ${checked ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}>
                      <input type="checkbox" checked={checked} onChange={(e) => setFormData({...formData, [req.key]: e.target.checked})} className="mt-1 w-5 h-5 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 bg-gray-700" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={18} className={checked ? 'text-emerald-400' : 'text-gray-400'} />
                          <span className={`font-semibold ${checked ? 'text-white' : 'text-gray-300'}`}>{req.label}</span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Annuler</button>
                <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white rounded-lg font-semibold transition-colors">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  <TrendingUp size={16} />
                  {saving ? 'Calcul...' : 'Calculer le score'}
                </button>
              </div>
            </div>
          ) : assessment ? (
            <>
              {/* Score */}
              <div className={`bg-gradient-to-br rounded-xl p-6 border ${assessment.status === 'COMPLIANT' ? 'from-indigo-900/40 to-gray-800 border-indigo-500/20' : 'from-red-900/40 to-gray-800 border-red-500/20'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Score de Conformité</h3>
                    <p className="text-gray-400 text-sm mt-1">Statut: <span className={`font-bold ${assessment.status === 'COMPLIANT' ? 'text-emerald-400' : 'text-red-400'}`}>{assessment.status === 'COMPLIANT' ? 'CONFORME' : 'À RISQUE'}</span></p>
                  </div>
                  <span className={`text-5xl font-black ${getScoreColor(assessment.score)}`}>{Math.round((assessment.score / 10) * 100)}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${getScoreGradient(assessment.score)} shadow-lg transition-all duration-1000`} style={{ width: `${(assessment.score / 10) * 100}%` }}></div>
                </div>
                <p className="text-gray-400 text-sm mt-3">Évaluation du {new Date(assessment.created_at).toLocaleDateString('fr-CA')}</p>
              </div>

              {/* Catégories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryConfig.map((cat) => {
                  const Icon = cat.icon;
                  const catData = assessment.details?.[cat.key as keyof typeof assessment.details] as any;
                  if (!catData) return null;
                  const percentage = (catData.score / catData.max) * 100;
                  const isComplete = percentage >= 100;
                  return (
                    <div key={cat.key} className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-emerald-500/10' : 'bg-yellow-500/10'}`}>
                          <Icon className={isComplete ? 'text-emerald-400' : 'text-yellow-400'} size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-white">{cat.title}</h4>
                            {isComplete ? <CheckCircle className="text-emerald-400" size={20} /> : <AlertTriangle className="text-yellow-400" size={20} />}
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{cat.desc}</p>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 bg-gray-700 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-700 ${isComplete ? 'bg-emerald-500' : 'bg-yellow-500'}`} style={{ width: `${percentage}%` }}></div>
                            </div>
                            <span className={`text-xs font-bold ${isComplete ? 'text-emerald-400' : 'text-yellow-400'}`}>{catData.score}/{catData.max}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Templates recommandés */}
              {recommendedTemplates.length > 0 && (
                <div className="bg-gradient-to-br from-indigo-900/30 to-gray-800 rounded-xl p-6 border border-indigo-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <FileDown className="text-indigo-400" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">📄 Templates recommandés</h3>
                      <p className="text-indigo-300 text-sm">Consultez ces documents pour combler vos lacunes ({recommendedTemplates.length} document{recommendedTemplates.length > 1 ? 's' : ''})</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {recommendedTemplates.map((template) => {
                      const Icon = template.icon;
                      const isConsulting = consultingTemplate === template.key;
                      return (
                        <div key={template.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-indigo-500/50 transition-colors">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${template.priority === 'high' ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
                              <Icon className={template.priority === 'high' ? 'text-red-400' : 'text-blue-400'} size={16} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-white">{template.label}</h4>
                                {template.priority === 'high' && <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded font-medium">PRIORITAIRE</span>}
                              </div>
                              <p className="text-gray-400 text-sm mt-0.5">{template.description}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => consultTemplate(template.key, template.label)}
                            disabled={isConsulting}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm transition-colors ml-4 ${isConsulting ? 'bg-gray-700 text-gray-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                          >
                            {isConsulting ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                            {isConsulting ? 'Ouverture...' : 'Consulter'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-blue-300 text-sm flex items-center gap-2">
                      <Eye size={14} />
                      <strong>Nouveau :</strong> Navigation vers une page dédiée
                    </p>
                  </div>
                </div>
              )}

              {/* Gaps */}
              {assessment.details?.gaps && assessment.details.gaps.length > 0 && (
                <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <AlertOctagon size={20} className="text-red-400" />
                    Points d'amélioration ({assessment.gap_count})
                  </h3>
                  <ul className="space-y-2">
                    {assessment.details.gaps.map((gap: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-red-200 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex justify-between items-center">
                <p className="text-gray-400 text-sm"><strong className="text-white">Prochaine évaluation:</strong> {new Date(new Date(assessment.created_at).getTime() + 90*24*60*60*1000).toLocaleDateString('fr-CA')}</p>
                <button onClick={() => { setFormData({ governance: false, data_inventory: false, consent_management: false, security_measures: false, breach_notification: false, data_retention: false }); setShowForm(true); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors">Refaire l'évaluation</button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">Aucune donnée disponible</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Loi25Modal;