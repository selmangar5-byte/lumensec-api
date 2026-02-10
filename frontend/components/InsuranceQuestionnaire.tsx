import React, { useState } from 'react';

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
    title: 'Data Protection & Recovery',
    weight: 25,
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
    weight: 5,
    questions: [
      { key: 'loi25', text: 'Loi 25 (Quebec privacy law) compliance documented?', options: ['Yes', 'No', 'In progress'] },
      { key: 'security_policies', text: 'Security policies documented and current?', options: ['Yes', 'No', 'Outdated'] },
      { key: 'training', text: 'Employee security awareness training?', options: ['Mandatory', 'Optional', 'None'] },
      { key: 'third_party_audits', text: 'Third-party security audits?', options: ['Annual', 'Biannual', 'Never'] }
    ]
  }
];

const API_URL = import.meta.env.VITE_API_URL || 'https://lumensec-api.onrender.com';

export default function InsuranceQuestionnaire({ user }: { user: any }) {
  const [currentSection, setCurrentSection] = useState(0);
  console.log("USER OBJECT:", user);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handleAnswer = (questionKey: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionKey]: value }));
  };

  const currentQuestions = SECTIONS[currentSection].questions;
  const allAnswered = currentQuestions.every(q => answers[q.key as keyof QuestionnaireAnswers]);

  const handleNext = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/insurance_assessments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
  answers,
  tenant_id: user.tenant_id
})
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.assessment);
      }
    } catch (error) {
      console.error('Assessment submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Insurance Readiness Assessment Results</h2>
          
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-8 mb-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">{result.score}%</div>
              <div className={`text-2xl font-semibold mb-2 ${
                result.risk_level === 'EXCELLENT' ? 'text-green-400' :
                result.risk_level === 'GOOD' ? 'text-blue-400' :
                result.risk_level === 'FAIR' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {result.risk_level}
              </div>
              <div className="text-gray-300">Premium Impact: {result.premium_impact}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-white mb-4">Section Scores</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(result.section_scores).map(([key, score]) => (
                <div key={key} className="bg-slate-700 rounded p-4">
                  <div className="text-gray-300 text-sm capitalize">{key.replace(/_/g, ' ')}</div>
                  <div className="text-2xl font-bold text-white">{score}%</div>
                </div>
              ))}
            </div>
          </div>

          {result.gaps.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Priority Improvements</h3>
              <ul className="space-y-2">
                {result.gaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start text-gray-300">
                    <span className="text-yellow-400 mr-2">⚠</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">Cyber Insurance Readiness Assessment</h1>
        <p className="text-gray-300">Section {currentSection + 1} of {SECTIONS.length}: {SECTIONS[currentSection].title}</p>
        <p className="text-gray-400 text-sm mt-1">24 questions • 8-10 minutes</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {SECTIONS.map((section, idx) => (
            <div
              key={section.id}
              className={`flex-1 h-2 mx-1 rounded ${
                idx < currentSection ? 'bg-blue-600' : 
                idx === currentSection ? 'bg-blue-400' : 
                'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {currentQuestions.map((question, idx) => (
          <div key={question.key} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <label className="block mb-4">
              <span className="text-lg font-medium text-white">
                {idx + 1}. {question.text}
              </span>
            </label>
            <div className="space-y-2">
              {question.options.map(option => (
                <label key={option} className="flex items-center p-3 border border-slate-600 rounded hover:bg-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name={question.key}
                    value={option}
                    checked={answers[question.key as keyof QuestionnaireAnswers] === option}
                    onChange={() => handleAnswer(question.key, option)}
                    className="mr-3 h-4 w-4"
                  />
                  <span className="text-gray-200">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentSection === 0}
          className="px-6 py-2 border border-slate-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!allAnswered || isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
        >
          {isSubmitting ? 'Calculating...' : currentSection === SECTIONS.length - 1 ? 'Submit Assessment' : 'Next Section'}
        </button>
      </div>
    </div>
  );
}
