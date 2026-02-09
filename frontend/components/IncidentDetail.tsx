import React from 'react';
import { X, Clock, User, Shield, AlertTriangle, CheckCircle, XCircle, Server, Hash } from 'lucide-react';

interface Incident {
  id: number;
  title: string;
  severity: any; // Can be string or object
  status: any;
  category: string;
  description: string;
  source_ip?: string;
  target_system?: string;
  detection_time: string;
  last_updated?: string;
  evidence_hash?: string;
}

interface IncidentDetailProps {
  incident: Incident;
  onClose: () => void;
}

const IncidentDetail: React.FC<IncidentDetailProps> = ({ incident, onClose }) => {
  // Extract severity and status as strings
  const severityStr = typeof incident.severity === 'string' ? incident.severity : (incident.severity?.name || 'low');
  const statusStr = typeof incident.status === 'string' ? incident.status : (incident.status?.name || 'active');

  const severityColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  };

  const statusColors = {
    active: 'bg-red-500',
    investigating: 'bg-yellow-500',
    resolved: 'bg-green-500',
    false_positive: 'bg-gray-500'
  };

  const getAssignedAnalyst = (severity: string) => {
    const analysts = {
      critical: 'Sarah Chen',
      high: 'Marcus Johnson',
      medium: 'Emily Rodriguez',
      low: 'Alex Kumar'
    };
    return analysts[severity as keyof typeof analysts] || 'Unassigned';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      // Handle ISO format with timezone
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if can't parse
      }
      
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/New_York' // Eastern Time for consistency
      });
    } catch (error) {
      return dateString || 'N/A';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded text-xs font-bold text-white ${severityColors[severityStr as keyof typeof severityColors] || 'bg-gray-500'}`}>
                {severityStr.toUpperCase()}
              </span>
              <span className={`px-3 py-1 rounded text-xs font-bold text-white ${statusColors[statusStr as keyof typeof statusColors] || 'bg-gray-500'}`}>
                {statusStr.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{incident.title}</h2>
            <p className="text-gray-400 text-sm">Incident #{incident.id}</p>
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
          {/* Timeline */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="text-blue-400" size={20} />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Detected</span>
                <span className="text-white font-mono">{formatDate(incident.detection_time)}</span>
              </div>
              {incident.last_updated && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Updated</span>
                  <span className="text-white font-mono">{formatDate(incident.last_updated)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
            <p className="text-gray-300">{incident.description}</p>
          </div>

          {/* Assigned Analyst */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="text-green-400" size={20} />
              Assigned to
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {getAssignedAnalyst(severityStr).split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-white font-semibold">{getAssignedAnalyst(severityStr)}</p>
                <p className="text-gray-400 text-sm">SOC Analyst</p>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="text-purple-400" size={20} />
              Technical Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <Server size={16} />
                  Source IP
                </span>
                <span className="text-white font-mono">{incident.source_ip || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Target System</span>
                <span className="text-white font-mono">{incident.target_system || 'N/A'}</span>
              </div>
              {incident.evidence_hash && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Hash size={16} />
                    Integrity Hash
                  </span>
                  <span className="text-white font-mono text-xs">{incident.evidence_hash}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <AlertTriangle size={18} />
              Escalate
            </button>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <CheckCircle size={18} />
              Resolve
            </button>
            <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <XCircle size={18} />
              False Positive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;