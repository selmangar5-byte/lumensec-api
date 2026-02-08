import React from 'react';

interface LogInvestigationModalProps {
  log: any;
  onClose: () => void;
}

export default function LogInvestigationModal({ log, onClose }: LogInvestigationModalProps) {
  const sections = [
    {
      icon: '📅',
      title: 'Complete Timeline',
      subtitle: 'Event Sequence & Causality Chain',
      description: 'Full reconstruction of the event timeline with precise timestamps, including precursor actions and cascading effects.'
    },
    {
      icon: '📦',
      title: 'Evidence Packs',
      subtitle: 'Forensic Artifacts & Digital Traces',
      description: 'Comprehensive collection of logs, network captures, file hashes, and system snapshots for deep forensic analysis.'
    },
    {
      icon: '🌍',
      title: 'Source Attribution',
      subtitle: 'Geolocation, User Agent & Session Context',
      description: 'Detailed analysis of the origin: IP geolocation, device fingerprint, browser metadata, and session correlation.'
    },
    {
      icon: '⚙️',
      title: 'Technical Stacktrace',
      subtitle: 'Code Execution Path & System Calls',
      description: 'Low-level system call trace, application stack dump, and database query logs for root cause analysis.'
    },
    {
      icon: '✅',
      title: 'Remediation Playbook',
      subtitle: 'Automated Response & Mitigation Steps',
      description: 'Pre-configured response actions, incident containment procedures, and recommended security hardening measures.'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-orange-500/30 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-orange-500/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Detailed Investigation</h2>
                  <p className="text-sm text-orange-400 font-mono">Event #{log.id} • {log.timestamp}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm italic">Complete forensic file available for Enterprise tier</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="bg-slate-800/50 border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{section.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{section.title}</h3>
                  <p className="text-sm text-orange-400 font-mono mb-3">{section.subtitle}</p>
                  <p className="text-slate-300 text-sm leading-relaxed italic">{section.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Full data available with Enterprise license</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-orange-500/30 p-6 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              © 2025 Lumensec - Advanced Forensic Investigation Platform
            </p>
            <div className="flex items-center gap-2 text-orange-400 text-sm font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Available with Enterprise tier</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}