import React, { useState, useRef, useEffect } from 'react';
import { ConnectMicrosoftButton } from './ConnectMicrosoftButton';
interface QuestionnaireAnswers {
  mfa: string;
  sso: string;
  pam: string;
  conditional_access: string;
  backups: string;
  backup_tested: string;
  offsite_backup: string;
  immutable_backups: string;
  edr_coverage: string;
  patching: string;
  endpoint_encryption: string;
  usb_controls: string;
  firewall: string;
  network_segmentation: string;
  vpn: string;
  network_monitoring: string;
  ir_plan: string;
  ir_tested: string;
  cyber_insurance: string;
  tabletop: string;
  loi25: string;
  security_policies: string;
  training: string;
  third_party_audits: string;
}

interface AssessmentResult {
  score: number;
  risk_level: string;
  premium_impact: string;
  section_scores: {
    identity: number;
    data_protection: number;
    endpoint: number;
    network: number;
    incident_response: number;
    compliance: number;
  };
  gaps: string[];
  recommendations: string[];
}

interface InsuranceQuestionnaireProps {
  user: any;
  onNavigate?: (view: 'dashboard' | 'insurance' | 'insurance-dashboard' | 'report') => void;
  m365Email?: string;
  m365Name?: string;
}

const SECTIONS = [
  {
    id: 1,
    title: 'Identity & Access Management',
    weight: 25,
    questions: [
      { key: 'mfa', text: 'Multi-Factor Authentication (MFA) enabled on all accounts?', options: ['Yes', 'No', 'Partial'] },
      { key: 'sso', text: 'Single Sign-On (SSO) configured?', options: ['Yes', 'No', 'In progress'] },
      { key: 'pam', text: 'Privileged Access Management (PAM) solution deployed?', options: ['Yes', 'No', 'Planned'] },
      { key: 'conditional_access', text: 'Conditional Access policies configured?', options: ['Yes', 'No', 'Dont know'] }
    ]
  },
  {
    id: 2,
    title: 'Data Protection & Backup',
    weight: 20,
    questions: [
      { key: 'backups', text: 'Automated backup frequency?', options: ['Daily', 'Weekly', 'Monthly', 'Never'] },
      { key: 'backup_tested', text: 'Backup restoration tested?', options: ['Monthly', 'Quarterly', 'Yearly', 'Never'] },
      { key: 'offsite_backup', text: 'Offsite or cloud backup copies maintained?', options: ['Yes', 'No'] },
      { key: 'immutable_backups', text: 'Immutable backups (ransomware-proof)?', options: ['Yes', 'No', 'Dont know'] }
    ]
  },
  {
    id: 3,
    title: 'Endpoint Security',
    weight: 20,
    questions: [
      { key: 'edr_coverage', text: 'Endpoint Detection & Response (EDR) coverage?', options: ['100%', '80-99%', '50-79%', '<50%'] },
      { key: 'patching', text: 'Security patch deployment cadence?', options: ['<7 days', '<30 days', '<90 days', '>90 days'] },
      { key: 'endpoint_encryption', text: 'Endpoint disk encryption?', options: ['Full disk', 'Partial', 'None'] },
      { key: 'usb_controls', text: 'USB/removable media controls?', options: ['Blocked', 'Monitored', 'No control'] }
    ]
  },
  {
    id: 4,
    title: 'Network Security',
    weight: 15,
    questions: [
      { key: 'firewall', text: 'Next-generation firewall deployed?', options: ['Yes', 'No', 'Traditional firewall only'] },
      { key: 'network_segmentation', text: 'Network segmentation implemented?', options: ['Full', 'Partial', 'None'] },
      { key: 'vpn', text: 'VPN required for remote access?', options: ['Required', 'Optional', 'None'] },
      { key: 'network_monitoring', text: 'Network monitoring?', options: ['24/7', 'Business hours', 'No monitoring'] }
    ]
  },
  {
    id: 5,
    title: 'Incident Response',
    weight: 10,
    questions: [
      { key: 'ir_plan', text: 'Incident Response plan documented?', options: ['Yes', 'No', 'Outdated'] },
      { key: 'ir_tested', text: 'IR plan tested through exercises?', options: ['<6 months', '<12 months', '>12 months', 'Never'] },
      { key: 'cyber_insurance', text: 'Active cyber insurance policy?', options: ['Yes', 'No', 'Expired'] },
      { key: 'tabletop', text: 'Tabletop exercises conducted?', options: ['Quarterly', 'Yearly', 'Never'] }
    ]
  },
  {
    id: 6,
    title: 'Compliance & Governance',
    weight: 10,
    questions: [
      { key: 'loi25', text: 'Loi 25 (Quebec privacy law) compliance documented?', options: ['Yes', 'No', 'In progress'] },
      { key: 'security_policies', text: 'Security policies documented and current?', options: ['Yes', 'No', 'Outdated'] },
      { key: 'training', text: 'Employee security awareness training?', options: ['Mandatory', 'Optional', 'None'] },
      { key: 'third_party_audits', text: 'Third-party security audits?', options: ['Annual', 'Biannual', 'Never'] }
    ]
  }
];

// 🎯 FONCTION DE CALCUL DE SCORE INTELLIGENTE
const calculateAnswerScore = (questionKey: string, answer: string): number => {
  const scoringMap: Record<string, Record<string, number>> = {
    // Binary / Yes-No
    mfa: { Yes: 100, Partial: 50, No: 0 },
    offsite_backup: { Yes: 100, No: 0 },
    immutable_backups: { Yes: 100, No: 0, 'Dont know': 25 },
    conditional_access: { Yes: 100, No: 0, 'Dont know': 25 },
    
    // SSO & PAM
    sso: { Yes: 100, 'In progress': 50, No: 0 },
    pam: { Yes: 100, Planned: 25, No: 0 },
    
    // Backup frequency (Daily = meilleur)
    backups: { Daily: 100, Weekly: 75, Monthly: 40, Never: 0 },
    backup_tested: { Monthly: 100, Quarterly: 80, Yearly: 40, Never: 0 },
    
    // EDR Coverage
    edr_coverage: { '100%': 100, '80-99%': 80, '50-79%': 50, '<50%': 20 },
    
    // Patching (plus c'est rapide mieux c'est)
    patching: { '<7 days': 100, '<30 days': 80, '<90 days': 40, '>90 days': 10 },
    
    // Encryption
    endpoint_encryption: { 'Full disk': 100, Partial: 50, None: 0 },
    
    // USB Controls
    usb_controls: { Blocked: 100, Monitored: 60, 'No control': 0 },
    
    // Firewall
    firewall: { Yes: 100, 'Traditional firewall only': 50, No: 0 },
    
    // Segmentation
    network_segmentation: { Full: 100, Partial: 60, None: 0 },
    
    // VPN
    vpn: { Required: 100, Optional: 50, None: 0 },
    
    // Monitoring
    network_monitoring: { '24/7': 100, 'Business hours': 60, 'No monitoring': 0 },
    
    // IR Plan
    ir_plan: { Yes: 100, Outdated: 40, No: 0 },
    ir_tested: { '<6 months': 100, '<12 months': 80, '>12 months': 40, Never: 0 },
    
    // Insurance
    cyber_insurance: { Yes: 100, Expired: 20, No: 0 },
    tabletop: { Quarterly: 100, Yearly: 80, Never: 0 },
    
    // Compliance
    loi25: { Yes: 100, 'In progress': 60, No: 0 },
    security_policies: { Yes: 100, Outdated: 40, No: 0 },
    training: { Mandatory: 100, Optional: 60, None: 0 },
    third_party_audits: { Annual: 100, Biannual: 60, Never: 0 }
  };

  return scoringMap[questionKey]?.[answer] ?? 50; // Default 50 si inconnu
};

const calculateMockResult = (answers: Partial<QuestionnaireAnswers>): AssessmentResult => {
  let totalScore = 0;
  let maxPossible = 0;
  const sectionScores = {
    identity: 0,
    data_protection: 0,
    endpoint: 0,
    network: 0,
    incident_response: 0,
    compliance: 0
  };
  
  const gaps: string[] = [];
  const recommendations: string[] = [];

  SECTIONS.forEach(section => {
    let sectionTotal = 0;
    let sectionCount = 0;
    
    section.questions.forEach(q => {
      const answer = answers[q.key as keyof QuestionnaireAnswers];
      if (answer) {
        const score = calculateAnswerScore(q.key, answer);
        sectionTotal += score;
        sectionCount++;
        
        // Détection des gaps critiques
        if (score < 50) {
          if (q.key === 'mfa' && answer === 'No') gaps.push('MFA not deployed (critical)');
          if (q.key === 'backups' && answer === 'Never') gaps.push('No backup strategy');
          if (q.key === 'edr_coverage' && (answer === '<50%' || answer === '50-79%')) gaps.push('Insufficient EDR coverage');
          if (q.key === 'patching' && (answer === '>90 days' || answer === '<90 days')) gaps.push('Patching delays');
          if (q.key === 'loi25' && answer === 'No') gaps.push('Non-compliance Loi 25');
        }
      }
    });
    
    const sectionAverage = sectionCount > 0 ? (sectionTotal / sectionCount) : 0;
    const weightedScore = (sectionAverage * section.weight) / 100;
    
    sectionScores[section.title.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_') as keyof typeof sectionScores] = Math.round(sectionAverage);
    totalScore += weightedScore;
    maxPossible += section.weight;
  });

  // Normalisation sur 100
  const finalScore = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
  
  // Détermination du niveau de risque
  let riskLevel = 'HIGH';
  let premiumImpact = '+35%';
  
  if (finalScore >= 85) {
    riskLevel = 'LOW';
    premiumImpact = '-25%';
  } else if (finalScore >= 70) {
    riskLevel = 'MEDIUM';
    premiumImpact = '-5%';
  } else if (finalScore >= 50) {
    riskLevel = 'ELEVATED';
    premiumImpact = '+15%';
  }

  // Recommandations basées sur les gaps
  if (gaps.length === 0) {
    recommendations.push('Maintain current security posture');
    recommendations.push('Consider advanced threat hunting');
  } else {
    if (gaps.some(g => g.includes('MFA'))) recommendations.push('Deploy MFA immediately (highest ROI)');
    if (gaps.some(g => g.includes('backup'))) recommendations.push('Implement 3-2-1 backup strategy');
    if (gaps.some(g => g.includes('EDR'))) recommendations.push('Extend EDR coverage to all endpoints');
    if (gaps.some(g => g.includes('Loi 25'))) recommendations.push('Start Loi 25 compliance documentation');
  }

  return {
    score: finalScore,
    risk_level: riskLevel,
    premium_impact: premiumImpact,
    section_scores: sectionScores,
    gaps: gaps.length > 0 ? gaps : ['No critical gaps identified'],
    recommendations
  };
};

export default function InsuranceQuestionnaire({ user, onNavigate, m365Email, m365Name }: InsuranceQuestionnaireProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const [m365Loading, setM365Loading] = useState(true);
  const [m365Error, setM365Error] = useState<string | null>(null);
  const [m365Info, setM365Info] = useState<{ connected_by_email?: string; connected_by_name?: string } | null>(null);

  // Pré-remplir depuis les paramètres OAuth si disponibles
  useEffect(() => {
    if (m365Email || m365Name) {
      setAnswers(prev => ({
        ...prev,
        company_email: m365Email || prev.company_email,
        responsible_name: m365Name || prev.responsible_name
      }));
    }
  }, [m365Email, m365Name]);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 💾 SAUVEGARDE AUTO DANS LOCALSTORAGE
  useEffect(() => {
    // Chargement au démarrage
    const skipLoad = window.location.search.includes('m365_connected=true');
    const saved = skipLoad ? null : localStorage.getItem('insurance_assessment_draft');
    const savedSection = skipLoad ? null : localStorage.getItem('insurance_assessment_section');
    
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved answers');
      }
    }
    if (savedSection) {
      setCurrentSection(parseInt(savedSection, 10));
    }
    setIsLoading(false);
  }, []);

  // 🔍 Scan M365 pour pré-remplir automatiquement les réponses
  useEffect(() => {
    let mounted = true;
    const scanM365 = async () => {
      try {
        setM365Loading(true);
        setM365Error(null);
        const baseUrl = window.location.origin.replace(":5173", ":3000");
        
        // 1. Vérifier la connexion existante
        const credsResp = await fetch(`${baseUrl}/api/m365/credentials`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Tenant-ID': user?.tenant_id || 'default'
          },
          credentials: 'omit'
        });
        
        if (!mounted) return;
        
        if (credsResp.status === 404) {
          setM365Error('Connectez-vous à Microsoft 365 pour pré-remplir ce formulaire');
          setM365Loading(false);
          return;
        }
        
        // 2. Lancer le scan de sécurité
        const scanResp = await fetch(`${baseUrl}/api/m365_credentials/scan`, {
          headers: {
            'Content-Type': 'application/json',
            'X-Tenant-ID': user?.tenant_id || 'default'
          }
        });
        
        if (!scanResp.ok) {
          throw new Error(`Scan failed: ${scanResp.status}`);
        }
        
        const data = await scanResp.json();
        
        if (data.security_profile) {
          const profile = data.security_profile;
          
          // Pré-remplir les réponses avec les données du scan
          // Pré-remplir les réponses avec les données du scan
          setAnswers(prev => ({
            ...prev,
            mfa: profile.mfa === "Dont know" ? "Partial" : profile.mfa || prev.mfa,
            sso: profile.sso || prev.sso,
            conditional_access: profile.conditional_access || prev.conditional_access,
            pam: profile.pam || prev.pam,
            security_policies: profile.security_policies || prev.security_policies,
            backups: profile.backups || prev.backups,
            offsite_backup: profile.offsite_backup || prev.offsite_backup,
            backup_tested: profile.backup_tested || prev.backup_tested,
            immutable_backups: profile.immutable_backups || prev.immutable_backups,
            edr_coverage: profile.edr_coverage || prev.edr_coverage,
            patching: profile.patching || prev.patching,
            endpoint_encryption: profile.endpoint_encryption || prev.endpoint_encryption,
            usb_controls: profile.usb_controls || prev.usb_controls,
            firewall: profile.firewall || prev.firewall,
            network_segmentation: profile.network_segmentation || prev.network_segmentation,
            vpn: profile.vpn || prev.vpn,
            network_monitoring: profile.network_monitoring || prev.network_monitoring,
            ir_plan: profile.ir_plan || prev.ir_plan,
            ir_tested: profile.ir_tested || prev.ir_tested,
            cyber_insurance: profile.cyber_insurance || prev.cyber_insurance,
            tabletop: profile.tabletop || prev.tabletop,
            loi25: profile.loi25 || prev.loi25,
            training: profile.training || prev.training,
            third_party_audits: profile.third_party_audits || prev.third_party_audits,
            company_email: data.connected_by_email || (prev as any).company_email,
            responsible_name: data.connected_by_name || (prev as any).responsible_name
          }));
        }
      } catch (e) {
        console.error('Erreur scan M365:', e);
        setM365Error('Connectez-vous à Microsoft 365 pour pré-remplir ce formulaire');
      } finally {
        if (mounted) setM365Loading(false);
      }
    };
    
    scanM365();
    return () => { mounted = false; };
  }, [user?.tenant_id]);

  // Sauvegarde à chaque changement
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('insurance_assessment_draft', JSON.stringify(answers));
      localStorage.setItem('insurance_assessment_section', currentSection.toString());
    }
  }, [answers, currentSection, isLoading]);

  const isCurrentSectionComplete = () => {
    const currentQuestions = SECTIONS[currentSection].questions;
    return currentQuestions.every(q => answers[q.key as keyof QuestionnaireAnswers]);
  };

  const isSectionComplete = (sectionIndex: number) => {
    const section = SECTIONS[sectionIndex];
    return section.questions.every(q => answers[q.key as keyof QuestionnaireAnswers]);
  };

  const isAllSectionsComplete = () => {
    return SECTIONS.every(section => 
      section.questions.every(q => answers[q.key as keyof QuestionnaireAnswers])
    );
  };

  const handleAnswer = (questionKey: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionKey]: value
    }));
    setShowValidation(false);
    setSubmitError(null);
  };

  const scrollToFirstUnanswered = () => {
    const currentQuestions = SECTIONS[currentSection].questions;
    const firstUnansweredIndex = currentQuestions.findIndex(
      q => !answers[q.key as keyof QuestionnaireAnswers]
    );
    
    if (firstUnansweredIndex !== -1 && questionRefs.current[firstUnansweredIndex]) {
      questionRefs.current[firstUnansweredIndex]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const clearSavedProgress = () => {
    localStorage.removeItem('insurance_assessment_draft');
    localStorage.removeItem('insurance_assessment_section');
  };

  const nextSection = () => {
    if (!m365Info && !isCurrentSectionComplete()) {
    console.log("DEBUG nextSection - m365Info:", m365Info, "| isCurrentSectionComplete:", isCurrentSectionComplete());
      setShowValidation(true);
      setTimeout(() => scrollToFirstUnanswered(), 100);
      return;
    }
    
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(prev => prev + 1);
      setShowValidation(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      setShowValidation(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const jumpToSection = (index: number) => {
    if (index <= currentSection || isSectionComplete(index - 1)) {
      setCurrentSection(index);
      setShowValidation(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!isAllSectionsComplete()) {
      setShowValidation(true);
      setSubmitError("Veuillez répondre à toutes les questions avant de soumettre.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Calcul local intelligent
      const mockResult = calculateMockResult(answers);
      
      // Tentative d'envoi au backend
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiBase}/api/insurance_assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': user?.tenant_id || 'default'
        },
        body: JSON.stringify({ 
          answers,
          tenant_id: user?.tenant_id || 'default',
          calculated_score: mockResult.score
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.assessment);
        clearSavedProgress(); // On efface la sauvegarde après succès
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Assessment submission failed:', error);
      // Utilise le calcul local en fallback
      const mockResult = calculateMockResult(answers);
      setResult(mockResult);
      clearSavedProgress();
    } finally {
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartNewAssessment = () => {
    setResult(null);
    setCurrentSection(0);
    setAnswers({});
    setShowValidation(false);
    setSubmitError(null);
    clearSavedProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-gray-900 min-h-screen p-8 relative">
        <button 
          onClick={() => onNavigate?.('dashboard')}
          className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-full transition-all border border-gray-700 hover:border-gray-500 z-10"
          title="Return to Dashboard"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              result.score >= 85 ? 'bg-green-500' : 
              result.score >= 70 ? 'bg-yellow-500' : 
              result.score >= 50 ? 'bg-orange-500' : 'bg-red-500'
            }`}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Assessment Complete!</h2>
            <p className="text-gray-400">Your cybersecurity posture has been analyzed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <div className="text-sm text-gray-400 mb-1">Security Score</div>
              <div className={`text-4xl font-bold ${
                result.score >= 85 ? 'text-green-400' : 
                result.score >= 70 ? 'text-yellow-400' : 
                result.score >= 50 ? 'text-orange-400' : 'text-red-400'
              }`}>{result.score}%</div>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <div className="text-sm text-gray-400 mb-1">Risk Level</div>
              <div className={`text-2xl font-bold ${
                result.risk_level === 'LOW' ? 'text-green-400' :
                result.risk_level === 'MEDIUM' ? 'text-yellow-400' :
                result.risk_level === 'ELEVATED' ? 'text-orange-400' :
                'text-red-400'
              }`}>{result.risk_level}</div>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <div className="text-sm text-gray-400 mb-1">Premium Impact</div>
              <div className={`text-2xl font-bold ${
                result.premium_impact.startsWith('-') ? 'text-green-400' : 'text-red-400'
              }`}>{result.premium_impact}</div>
            </div>
          </div>

          {/* Section Scores Detail */}
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Detailed Scores by Category</h3>
            <div className="space-y-3">
              {Object.entries(result.section_scores).map(([key, score]) => (
                <div key={key} className="flex items-center">
                  <div className="w-48 text-sm text-gray-300 capitalize">{key.replace(/_/g, ' ')}</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-right font-bold text-white">{score}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Critical Gaps to Address</h3>
            <ul className="space-y-2">
              {result.gaps.map((gap, index) => (
                <li key={index} className={`flex items-center ${
                  gap.includes('critical') ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {gap}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-500/30 mb-8">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-center text-blue-300">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleStartNewAssessment}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200"
            >
              Start New Assessment
            </button>
            
            <button 
              onClick={() => onNavigate?.('dashboard')}
              className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition duration-200 border border-gray-600 hover:border-gray-500 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const section = SECTIONS[currentSection];
  const progress = ((currentSection + 1) / SECTIONS.length) * 100;
  const sectionComplete = isCurrentSectionComplete();
  const allSectionsComplete = isAllSectionsComplete();

  const isLastSection = currentSection === SECTIONS.length - 1;
  const showGreenButton = isLastSection && allSectionsComplete;

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
         {/* 🔌 CONNECT MICROSOFT 365 */}
      <ConnectMicrosoftButton 
        tenantId={user?.tenant_id || 'default'} 
        onConnected={(data) => {
          console.log('M365 Connected:', data);
          // Optionnel: auto-remplir certaines réponses si données disponibles
          if (data?.scan?.mfa?.mfa_percentage === 100) {
            handleAnswer('mfa', 'Yes');
          }
        }}
        onError={(error) => console.error('Connection error:', error)}
      />     
        {m365Loading ? (
          <div className="text-sm text-gray-400 mt-2">Pré-remplissage depuis Microsoft 365…</div>
        ) : m365Error ? (
          <div className="mt-3 mb-4 p-3 bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 rounded">
            {m365Error}
          </div>
        ) : m365Info ? (
          <div className="mt-3 mb-4 text-sm text-green-300">Pré-rempli depuis Microsoft 365: {m365Info.connected_by_email || ''}</div>
        ) : null}
        {/* 🎯 INDICATEUR DE PROGRESSION PAR SECTION */}
        <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">Progression</span>
            <button 
              onClick={() => {
                if (confirm('Effacer toutes les réponses et recommencer ?')) {
                  handleStartNewAssessment();
                }
              }}
              className="text-xs text-red-400 hover:text-red-300 underline"
            >
              Réinitialiser
            </button>
          </div>
          <div className="flex justify-between gap-2">
            {SECTIONS.map((s, idx) => {
              const completed = isSectionComplete(idx);
              const isCurrent = idx === currentSection;
              const isAccessible = idx <= currentSection || (idx > 0 && isSectionComplete(idx - 1));
              
              return (
                <button
                  key={s.id}
                  onClick={() => jumpToSection(idx)}
                  disabled={!isAccessible}
                  className={`flex-1 py-2 px-1 rounded text-xs font-medium transition-all ${
                    completed 
                      ? 'bg-green-600 text-white' 
                      : isCurrent 
                        ? 'bg-blue-600 text-white' 
                        : isAccessible 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                  title={s.title}
                >
                  <div className="flex flex-col items-center">
                    <span className="mb-1">{idx + 1}</span>
                    {completed && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-center text-xs text-gray-500">
            {SECTIONS.filter((_, idx) => isSectionComplete(idx)).length} / {SECTIONS.length} sections complétées
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">{section.title}</h2>
            {showValidation && !sectionComplete && (
              <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">
                Réponses requises
              </span>
            )}
          </div>
          <p className="text-gray-400 mb-6">Weight: {section.weight}% of total score</p>

          {submitError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
              {submitError}
            </div>
          )}

          <div className="space-y-6">
            {section.questions.map((question, index) => {
              const isAnswered = answers[question.key as keyof QuestionnaireAnswers];
              const showError = showValidation && !isAnswered;
              
              return (
                <div 
                  key={question.key} 
                  ref={el => questionRefs.current[index] = el}
                  className={`bg-gray-700 p-6 rounded-lg border transition-all duration-300 ${
                    showError ? 'border-red-500 shadow-red-500/20 shadow-lg' : 'border-gray-600'
                  }`}
                >
                  <label className="block text-white font-medium mb-3">
                    {question.text}
                    {!isAnswered && (
                      <span className="text-red-400 ml-2">*</span>
                    )}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {question.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(question.key, option)}
                        className={`py-2 px-4 rounded-lg border-2 transition-all duration-200 ${
                          answers[question.key as keyof QuestionnaireAnswers] === option
                            ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                            : 'border-gray-600 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  {showError && (
                    <p className="text-red-400 text-sm mt-2">Veuillez sélectionner une réponse</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={prevSection}
              disabled={currentSection === 0}
              className={`py-2 px-6 rounded-lg font-medium ${
                currentSection === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Previous
            </button>

            <button
              onClick={isLastSection ? handleSubmit : nextSection}
              disabled={isSubmitting}
              className={`py-2 px-6 rounded-lg font-medium ${
                showGreenButton
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30'
                  : !sectionComplete && showValidation
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${isSubmitting || (isLastSection && !allSectionsComplete) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : isLastSection ? 'Submit Assessment' : 'Next Section'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}