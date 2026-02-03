
import { DashboardStats, Incident, EvidencePack } from '../types';

const getApiBaseUrl = () => {
  const { hostname, protocol } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:3000';
  if (hostname.includes('github.dev') || hostname.includes('app.github.dev')) {
    const backendHostname = hostname.replace(/-\d+(\.|\-)/, '-3000$1');
    return `${protocol}//${backendHostname}`;
  }
  return 'https://lumensec-api.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Tenant-ID': localStorage.getItem('lumensec_tenant_id') || '1',
  'Authorization': `Bearer ${localStorage.getItem('lumensec_token')}`
});

export const lumensecApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, { headers: getHeaders() });
    if (!response.ok) throw new Error("SOC Backend non joignable");
    return response.json();
  },

  getIncident: async (id: string): Promise<Incident> => {
    const response = await fetch(`${API_BASE_URL}/analysis_results/${id}`, { headers: getHeaders() });
    return response.json();
  },

  getEvidencePack: async (id: string): Promise<EvidencePack> => {
    const response = await fetch(`${API_BASE_URL}/analysis_results/${id}/evidence_pack`, { headers: getHeaders() });
    return response.json();
  },

  getAuditLogs: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/audit_logs`, { headers: getHeaders() });
    if (!response.ok) return [
      { id: 1, action: 'PDF_EXPORT', user: 'Nawal', target: 'INC-742', timestamp: new Date().toISOString() },
      { id: 2, action: 'TENANT_SWITCH', user: 'Nawal', target: 'Pilot-B', timestamp: new Date().toISOString() }
    ];
    return response.json();
  },

  downloadPdf: (id: string): void => {
    const token = localStorage.getItem('lumensec_token');
    window.open(`${API_BASE_URL}/analysis_results/${id}/export_pdf?token=${token}`, '_blank');
  },

  downloadActivityReport: (period: 'daily' | 'weekly' | 'monthly'): void => {
    const token = localStorage.getItem('lumensec_token');
    window.open(`${API_BASE_URL}/dashboard/export_report?period=${period}&token=${token}`, '_blank');
  },

  updateIncidentStatus: async (id: string, newStatus: string): Promise<Incident> => {
    const response = await fetch(`${API_BASE_URL}/analysis_results/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ analysis_result: { status: newStatus } }),
    });
    return response.json();
  },

  login: async (passcode: string): Promise<boolean> => {
    const cleanCode = passcode.trim().toUpperCase();
    if (cleanCode === 'NAWAL-SOC-01' || cleanCode === 'ADMIN') {
      localStorage.setItem('lumensec_token', 'session_active_' + Date.now());
      localStorage.setItem('lumensec_tenant_id', '1');
      return true;
    }
    return false;
  },

  setTenant: (id: string) => {
    localStorage.setItem('lumensec_tenant_id', id);
    window.location.reload();
  },

  logout: () => {
    localStorage.removeItem('lumensec_token');
    localStorage.removeItem('lumensec_tenant_id');
    window.location.reload();
  }
};
