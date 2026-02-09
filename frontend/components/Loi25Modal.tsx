import React from 'react';
import { X, Shield, CheckCircle, Lock, FileText, Database, AlertTriangle } from 'lucide-react';

interface Loi25ModalProps {
  onClose: () => void;
}

const Loi25Modal: React.FC<Loi25ModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-indigo-500/30 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-indigo-900/90 to-gray-900 border-b border-indigo-500/30 p-6 flex justify-between items-start backdrop-blur-sm">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-indigo-400" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-white">Loi 25 Compliance Dashboard</h2>
                <p className="text-indigo-300 text-sm">Quebec Privacy Law Protection</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-gray-800 rounded-xl p-6 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Overall Compliance Score</h3>
              <span className="text-5xl font-black text-emerald-400">98%</span>
            </div>
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 w-[98%] shadow-lg shadow-emerald-500/50"></div>
            </div>
            <p className="text-gray-400 text-sm mt-3">
              Lumensec meets Quebec's Loi 25 requirements for data protection and privacy.
            </p>
          </div>

          {/* Compliance Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Data Protection */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="text-emerald-400" size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white">Data Encryption</h4>
                    <CheckCircle className="text-emerald-400" size={20} />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    All data encrypted at rest (AES-256) and in transit (TLS 1.3)
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full"></div>
                    </div>
                    <span className="text-emerald-400 text-xs font-bold">100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Access Control */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="text-emerald-400" size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white">Access Control</h4>
                    <CheckCircle className="text-emerald-400" size={20} />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    Role-based access with audit logging and MFA enforcement
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full"></div>
                    </div>
                    <span className="text-emerald-400 text-xs font-bold">100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Integrity */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="text-emerald-400" size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white">Evidence Integrity</h4>
                    <CheckCircle className="text-emerald-400" size={20} />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    SHA-256 hashing on all evidence packs for tamper detection
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-full"></div>
                    </div>
                    <span className="text-emerald-400 text-xs font-bold">100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Residency */}
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <Database className="text-yellow-400" size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white">Data Residency</h4>
                    <AlertTriangle className="text-yellow-400" size={20} />
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    Canadian data centers (current: US-East, migration planned Q2)
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[90%]"></div>
                    </div>
                    <span className="text-yellow-400 text-xs font-bold">90%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Requirements */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Loi 25 Key Requirements Met</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
                <div>
                  <p className="text-white font-semibold">Consent Management</p>
                  <p className="text-gray-400 text-sm">User consent tracked and documented for all data collection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
                <div>
                  <p className="text-white font-semibold">Data Breach Notification</p>
                  <p className="text-gray-400 text-sm">Automated alerts within 72 hours to affected parties and CAI</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
                <div>
                  <p className="text-white font-semibold">Right to Erasure</p>
                  <p className="text-gray-400 text-sm">Data deletion requests processed within 30 days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-emerald-400 flex-shrink-0" size={20} />
                <div>
                  <p className="text-white font-semibold">Privacy Impact Assessments</p>
                  <p className="text-gray-400 text-sm">Quarterly PIA reviews for high-risk processing activities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-indigo-900/20 rounded-xl p-4 border border-indigo-500/20">
            <p className="text-indigo-300 text-sm text-center">
              <strong>Next Audit:</strong> March 15, 2026 | <strong>Last Updated:</strong> February 1, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loi25Modal;