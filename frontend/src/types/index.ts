export interface DashboardStats {
  tenant: {
    name: string;
    subdomain: string;
    plan: 'free' | 'pro' | 'enterprise';
  };
  incidents: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  complianceScore: number;
  lastScan: string;
  isLoading?: boolean;
}