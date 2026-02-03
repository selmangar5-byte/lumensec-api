/* © 2025 Lumensec Inc. - Propriété Exclusive de Nawal - Tech Lead */

export interface Narrative {
  summary?: string;
  details?: string;
}

export interface Triage {
  verdict?: string;
  priority?: string;
  confidence?: number;
}

export interface Evidence {
  files?: string[];
  hashes?: string[];
  processes?: string[];
}

export interface EvidenceItem {
  type: string;
  label: string;
  value: string;
}

export interface EvidencePackData {
  pack_label: string;
  items: EvidenceItem[];
  confidence_score: number;
  sha256_fingerprint?: string; // Ajouté pour le plan Master
  compliance_status?: string; // Ajouté pour Loi 25
}

export interface EvidencePack {
  id: string;
  analysis_result_id: string;
  data: EvidencePackData;
  created_at: string;
}

export interface RemediationAction {
  id: string;
  type: 'block_ip' | 'isolate_host' | 'kill_process' | 'reset_credentials';
  target: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp: string;
}

export interface Incident {
  id: string;
  tenant_id: string;
  webhook_event_id: string;
  correlation_id: string | null;
  source: string;
  event_key: any;
  triage: Triage;
  narrative: Narrative;
  evidence: Evidence;
  status: 'new' | 'triaging' | 'triaged' | 'resolved' | 'false_positive' | 'remediated' | 'auto_neutralized' | 'silenced';
  severity: 1 | 2 | 3 | 4 | 5;
  created_at: string;
  updated_at: string;
  evidence_pack?: EvidencePack;
  remediations?: RemediationAction[];
}

export interface DashboardStats {
  total_incidents: number;
  by_status: Record<string, number>;
  by_severity: Record<string, number>;
  recent_incidents: Incident[];
  summary: Record<string, number>;
  noise_reduction_count: number;
  auto_immune_count: number;
  compliance_score?: number; // Nouveau KPI Master
}