import React, { useState } from 'react';
import { mockCommunityRules, CommunityRule } from '../data/mockCommunityRules';

export default function CommunityRulesMarket() {
  const [rules, setRules] = useState(mockCommunityRules);
  const [installing, setInstalling] = useState<string | null>(null);

  const handleInstall = (ruleId: string) => {
    setInstalling(ruleId);
    
    setTimeout(() => {
      setRules(rules.map(rule => 
        rule.id === ruleId ? { ...rule, installed: true } : rule
      ));
      setInstalling(null);
    }, 1500);
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'CRITICAL') return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (severity === 'HIGH') return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    if (severity === 'MEDIUM') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      RANSOMWARE: '🔒',
      BRUTE_FORCE: '🔨',
      SQL_INJECTION: '💉',
      DDoS: '🌊',
      MALWARE: '🦠',
      PHISHING: '🎣'
    };
    return icons[category] || '🛡️';
  };

  const installedCount = rules.filter(r => r.installed).length;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Community Rules Market</h3>
              <p className="text-[10px] text-slate-500 font-mono">{installedCount}/{rules.length} installed rules</p>
            </div>
          </div>
          <span className="text-[10px] text-purple-400 font-mono uppercase tracking-widest px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded">
            {rules.length} Available
          </span>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getCategoryIcon(rule.category)}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">{rule.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">{rule.author}</p>
                </div>
              </div>
              <span className={`text-[9px] font-mono uppercase px-2 py-1 rounded border ${getSeverityColor(rule.severity)}`}>
                {rule.severity}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 line-clamp-2">{rule.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-[10px] font-medium">{rule.rating}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {rule.installs.toLocaleString()} installs
                </div>
              </div>

              {rule.installed ? (
                <div className="flex items-center gap-1 text-green-400 text-xs font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Installed</span>
                </div>
              ) : (
                <button
                  onClick={() => handleInstall(rule.id)}
                  disabled={installing !== null}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {installing === rule.id ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      <span>Installing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Install</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <p className="text-[10px] text-slate-500 text-center font-mono">
          Your data is protected with SHA-256 integrity verification on every evidence pack.
        </p>
      </div>
    </div>
  );
}