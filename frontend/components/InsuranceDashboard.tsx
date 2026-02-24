import React, { useState, useEffect } from 'react';

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

interface InsuranceDashboardProps {
  user: any;
  onStartAssessment?: () => void;
}  

const API_URL = '';
export default function InsuranceDashboard({ user, onStartAssessment }: InsuranceDashboardProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
     const response = await fetch(`/api/insurance_assessments?tenant_id=${user?.tenant_id || '1'}`);
      const data = await response.json();
      setAssessments(data.assessments || []);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="text-white text-center">Loading assessments...</div>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No assessments yet</h3>
          <p className="text-slate-500 mb-6">Complete your first assessment to see your insurance readiness score.</p>
          <button 
           onClick={() => onStartAssessment && onStartAssessment()}
           className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight italic">Insurance Readiness Dashboard</h1>
          <p className="text-slate-500 mt-2">Track your cyber insurance readiness over time</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-6 py-3">
          <span className="text-slate-500 text-xs uppercase tracking-wider">Total Assessments</span>
          <div className="text-2xl font-bold text-white">{assessments.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.map((assessment) => (
          <div key={assessment.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`text-3xl font-black ${
                assessment.score >= 80 ? 'text-emerald-400' :
                assessment.score >= 60 ? 'text-blue-400' :
                assessment.score >= 40 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {assessment.score}%
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                assessment.risk_level === 'EXCELLENT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                assessment.risk_level === 'GOOD' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                assessment.risk_level === 'FAIR' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {assessment.risk_level}
              </div>
            </div>
            
            <div className="text-slate-400 text-sm mb-4">
              {new Date(assessment.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>

            <div className="space-y-2">
              {Object.entries(assessment.section_scores).map(([key, score]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="text-white font-semibold">{score}%</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}