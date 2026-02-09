import React from 'react';
import { X, Server, Database, Wifi, Cpu, HardDrive, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

interface SystemHealthModalProps {
  onClose: () => void;
}

const SystemHealthModal: React.FC<SystemHealthModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-emerald-500/30 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-emerald-900/90 to-gray-900 border-b border-emerald-500/30 p-6 flex justify-between items-start backdrop-blur-sm">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-emerald-400" size={32} />
              <div>
                <h2 className="text-2xl font-bold text-white">System Health Diagnostics</h2>
                <p className="text-emerald-300 text-sm">Real-time Infrastructure Monitoring</p>
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
          {/* Overall Status */}
          <div className="bg-gradient-to-br from-emerald-900/40 to-gray-800 rounded-xl p-6 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">All Systems Operational</h3>
                <p className="text-gray-400 text-sm">Last checked: 2 minutes ago</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                <span className="text-emerald-400 font-bold text-lg">99.8% Uptime</span>
              </div>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Core Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* API Gateway */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Server className="text-emerald-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">API Gateway</h4>
                      <CheckCircle className="text-emerald-400" size={20} />
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Status: <span className="text-emerald-400 font-semibold">Active</span>
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Response Time</span>
                        <span className="text-white font-mono">42ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Requests/min</span>
                        <span className="text-white font-mono">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Error Rate</span>
                        <span className="text-emerald-400 font-mono">0.02%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Database */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Database className="text-emerald-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">PostgreSQL Database</h4>
                      <CheckCircle className="text-emerald-400" size={20} />
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Status: <span className="text-emerald-400 font-semibold">Connected</span>
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Query Time</span>
                        <span className="text-white font-mono">18ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Active Connections</span>
                        <span className="text-white font-mono">12/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Storage Used</span>
                        <span className="text-white font-mono">2.4GB / 10GB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Webhook Ingestion */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Wifi className="text-emerald-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">Webhook Engine</h4>
                      <CheckCircle className="text-emerald-400" size={20} />
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Status: <span className="text-emerald-400 font-semibold">Processing</span>
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Events/min</span>
                        <span className="text-white font-mono">847</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Queue Depth</span>
                        <span className="text-white font-mono">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Success Rate</span>
                        <span className="text-emerald-400 font-mono">99.94%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Inference */}
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <Cpu className="text-yellow-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">AI Inference Engine</h4>
                      <AlertTriangle className="text-yellow-400" size={20} />
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      Status: <span className="text-yellow-400 font-semibold">High Load</span>
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">GPU Utilization</span>
                        <span className="text-yellow-400 font-mono">87%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Predictions/min</span>
                        <span className="text-white font-mono">2,341</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Avg Latency</span>
                        <span className="text-white font-mono">124ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Infrastructure Metrics */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Infrastructure Metrics</h3>
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Cpu size={16} className="text-blue-400" />
                    CPU Usage
                  </span>
                  <span className="text-white font-mono text-sm">34%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[34%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <Activity size={16} className="text-green-400" />
                    Memory Usage
                  </span>
                  <span className="text-white font-mono text-sm">5.2GB / 16GB</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[32%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <HardDrive size={16} className="text-purple-400" />
                    Disk I/O
                  </span>
                  <span className="text-white font-mono text-sm">142 MB/s</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[56%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-emerald-900/20 rounded-xl p-4 border border-emerald-500/20">
            <p className="text-emerald-300 text-sm text-center">
              <strong>Monitoring:</strong> Datadog + CloudWatch | <strong>SLA:</strong> 99.9% Uptime Guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthModal;