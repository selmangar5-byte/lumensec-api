export interface Incident {
  id: string | number;
  tenant_id: string;
  source: string;
  status: 'new' | 'triaging' | 'resolved';
  severity: number;
  summary: string;
  narrative: string;
  source_ip: string;
  target_system: string;
  event_key: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_incidents: number;
  by_status: Record<string, number>;
  by_severity: Record<string, number>;
  recent_incidents: Incident[];
  summary: Record<string, number>;
}
