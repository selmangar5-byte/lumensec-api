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
}

const API_URL = import.meta.env.VITE_API_URL || 'https://lumensec-api.onrender.com';

export default function InsuranceDashboard({ user }: InsuranceDashboardProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/insurance_assessments?tenant_id=${user.tenant_id}`);
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

  const latestAssessment = assessments[0];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Insurance Readiness Dashboard</h1>

      {/* Current Score Card */}
      {latestAssessment && (
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-300 text-sm mb-2">Current Score</div>
              <div className="text-6xl font-bold text-white">{latestAssessment.score}%</div>
              <div className={`text-2xl font-semibold mt-2 ${
                latestAssessment.risk_level === 'EXCELLENT' ? 'text-green-400' :
                latestAssessment.risk_level === 'GOOD' ? 'text-blue-400' :
                latestAssessment.risk_level === 'FAIR' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {latestAssessment.risk_level}
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-300 text-sm">Last Updated</div>
              <div className="text-white text-lg">
                {new Date(latestAssessment.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Scores */}
      {latestAssessment && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Section Breakdown</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(latestAssessment.section_scores).map(([key, score]) => (
              <div key={key} className="bg-slate-700 rounded p-4">
                <div className="text-gray-300 text-sm capitalize mb-2">
                  {key.replace('_', ' ')}
                </div>
                <div className="flex items-center">
                  <div className="flex-1 bg-slate-600 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{width: `${score}%`}}
                    />
                  </div>
                  <div className="text-white font-bold">{score}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assessment History */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Assessment History</h2>
        {assessments.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No assessments yet. Complete your first assessment to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="flex items-center justify-between bg-slate-700 rounded p-4">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-white">{assessment.score}%</div>
                  <div>
                    <div className={`font-semibold ${
                      assessment.risk_level === 'EXCELLENT' ? 'text-green-400' :
                      assessment.risk_level === 'GOOD' ? 'text-blue-400' :
                      assessment.risk_level === 'FAIR' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {assessment.risk_level}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(assessment.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                {assessments.indexOf(assessment) > 0 && (
                  <div className="text-sm">
                    <span className={`font-semibold ${
                      assessment.score > assessments[assessments.indexOf(assessment) - 1].score
                        ? 'text-green-400'
                        : assessment.score < assessments[assessments.indexOf(assessment) - 1].score
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}>
                      {assessment.score > assessments[assessments.indexOf(assessment) - 1].score ? '↑' : 
                       assessment.score < assessments[assessments.indexOf(assessment) - 1].score ? '↓' : '→'}
                      {' '}
                      {Math.abs(assessment.score - assessments[assessments.indexOf(assessment) - 1].score)}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}