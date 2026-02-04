const API_BASE_URL = "https://lumensec-api.onrender.com";

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
    return response.json();
  },
  
  getIncident: async (id: string) => {
    const response = await fetch(API_BASE_URL + "/analysis_results/" + id, { 
      headers: getHeaders() 
    });
    if (!response.ok) throw new Error("Incident " + id + " introuvable");
    return response.json();
  },
  
  getAuditLogs: async () => {
    // Fonction stub - retourne un tableau vide pour l'instant
    return [];
  }
};
