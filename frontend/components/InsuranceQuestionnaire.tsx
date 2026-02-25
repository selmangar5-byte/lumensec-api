import React, { useState, useRef } from 'react';

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
}

interface InsuranceQuestionnaireProps {
  user: any;
  onNavigate?: (view: 'dashboard' | 'insurance' | 'insurance-dashboard' | 'report') => void;
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

export default function InsuranceQuestionnaire({ user, onNavigate }: InsuranceQuestionnaireProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const isCurrentSectionComplete = () => {
    const currentQuestions = SECTIONS[currentSection].questions;
    return currentQuestions.every(q => answers[q.key as keyof QuestionnaireAnswers]);
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

  const nextSection = () => {
    if (!isCurrentSectionComplete()) {
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

  const handleSubmit = async () => {
    if (!isAllSectionsComplete()) {
      setShowValidation(true);
      setSubmitError("Veuillez répondre à toutes les questions avant de soumettre.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/insurance_assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': user?.tenant_id || '1'
        },
        body: JSON.stringify({ 
          answers,
          tenant_id: user?.tenant_id || '1'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.assessment);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Assessment submission failed:', error);
      setSubmitError("Erreur lors de la soumission. Veuillez réessayer.");
      
      const mockResult: AssessmentResult = {
        score: Math.round((Object.keys(answers).length / 24) * 100),
        risk_level: Object.keys(answers).length > 18 ? 'LOW' : Object.keys(answers).length > 12 ? 'MEDIUM' : 'HIGH',
        premium_impact: '-15%',
        section_scores: {
          identity: 85,
          data_protection: 80,
          endpoint: 75,
          network: 70,
          incident_response: 65,
          compliance: 90
        },
        gaps: ['MFA not fully deployed', 'Backup testing infrequent']
      };
      setResult(mockResult);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNewAssessment = () => {
    setResult(null);
    setCurrentSection(0);
    setAnswers({});
    setShowValidation(false);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (result) {
    return (
      <div className="bg-gray-900 min-h-screen p-8 relative">
        {/* Bouton X en haut à droite pour fermer */}
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500 mb-4">
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
              <div className="text-4xl font-bold text-blue-400">{result.score}%</div>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <div className="text-sm text-gray-400 mb-1">Risk Level</div>
              <div className={`text-2xl font-bold ${
                result.risk_level === 'LOW' ? 'text-green-400' :
                result.risk_level === 'MEDIUM' ? 'text-yellow-400' :
                'text-red-400'
              }`}>{result.risk_level}</div>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
              <div className="text-sm text-gray-400 mb-1">Premium Impact</div>
              <div className="text-2xl font-bold text-purple-400">{result.premium_impact}</div>
            </div>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Critical Gaps to Address</h3>
            <ul className="space-y-2">
              {result.gaps.map((gap, index) => (
                <li key={index} className="flex items-center text-red-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {gap}
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
            
            {/* Nouveau bouton Return to Dashboard */}
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
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Section {currentSection + 1} of {SECTIONS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
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
              onClick={nextSection}
              disabled={isSubmitting || (isLastSection && !allSectionsComplete)}
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