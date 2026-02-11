const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "https://symmetrical-system-wrpwxpjr57qx29wjr-10000.app.github.dev" : "https://lumensec-api.onrender.com");

const getHeaders = () => ({
  "Content-Type": "application/json",
  "X-Tenant-ID": "1"
});

export const lumensecApi = {
  getStats: async () => {
    const response = await fetch(API_BASE_URL + "/dashboard/stats", { 
      headers: getHeaders() 
    });
    if (!response.ok) throw new Error("Backend non joignable");
    const data = await response.json();
    return data.stats || data;
  },
  
  getIncident: async (id: string) => {
    const response = await fetch(API_BASE_URL + "/analysis_results/" + id, { 
      headers: getHeaders() 
    });
    if (!response.ok) throw new Error("Incident " + id + " introuvable");
    return response.json();
  },
  
  getAuditLogs: async () => {
    return [];
  },
  
  downloadActivityReport: (period: string) => {
    console.log(`Downloading ${period} report...`);
  }
};