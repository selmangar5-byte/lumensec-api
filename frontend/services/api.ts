const API_URL = ''; // Vide car Vite proxy tout

class LumensecAPI {
  private baseUrl: string;
  private tenantId: string;

  constructor() {
    this.baseUrl = API_URL;
    this.tenantId = localStorage.getItem('tenant_id') || '1';
  }

  private headers() {
    return {
      'Content-Type': 'application/json',
      'X-Tenant-ID': this.tenantId
    };
  }

  async getDashboardStats() {
    const response = await fetch(`${this.baseUrl}/dashboard/stats`, {
      headers: this.headers()
    });
    if (!response.ok) throw new Error('Erreur stats');
    return response.json();
  }

  async analyzeWithAI(alertId: string) {
    const response = await fetch(`${this.baseUrl}/alerts/${alertId}/analyze`, {
      method: 'POST',
      headers: this.headers()
    });
    if (!response.ok) throw new Error('Erreur analyse IA');
    return response.json();
  }

  async getM365Alerts() {
    const response = await fetch(`${this.baseUrl}/m365/alerts`, {
      headers: this.headers()
    });
    if (!response.ok) throw new Error('Erreur alerts M365');
    return response.json();
  }

  async getM365Credentials() {
    const response = await fetch(`${this.baseUrl}/m365/credentials`, {
      headers: this.headers()
    });
    if (!response.ok) throw new Error('Erreur credentials');
    return response.json();
  }

  async saveM365Credentials(credentials: any) {
    const response = await fetch(`${this.baseUrl}/m365/credentials`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error('Erreur sauvegarde credentials');
    return response.json();
  }

  async testM365Connection() {
    const response = await fetch(`${this.baseUrl}/m365/test`, {
      headers: this.headers()
    });
    if (!response.ok) throw new Error('Erreur test connexion');
    return response.json();
  }

  async toggleM365Mode() {
    const response = await fetch(`${this.baseUrl}/m365/toggle`, {
      method: 'POST',
      headers: this.headers()
    });
    if (!response.ok) throw new Error('Erreur toggle mode');
    return response.json();
  }

  async updateAlertStatus(alertId: string, status: string) {
    const response = await fetch(`${this.baseUrl}/alerts/${alertId}/status`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Erreur mise à jour statut');
    return response.json();
  }
}

export const lumensecAPI = new LumensecAPI();