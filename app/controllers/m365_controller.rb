class M365Controller < ApplicationController
  before_action :set_tenant

  def alerts
    alerts = [
      {
        id: "alert-001",
        title: "Tentative de phishing détectée",
        severity: "high",
        status: "new",
        created_at: Time.now.iso8601,
        description: "Email suspect détecté",
        sender: "attacker@evil.com"
      },
      {
        id: "alert-002", 
        title: "Connexion anormale",
        severity: "medium",
        status: "in_progress",
        created_at: 2.hours.ago.iso8601,
        description: "Connexion depuis IP inhabituelle",
        ip_address: "185.123.456.78"
      }
    ]
    
    render json: { alerts: alerts, total: alerts.length }
  end

  def credentials
    render json: { connected: false, message: "M365 non configuré" }
  end

  private

  def set_tenant
    @tenant_id = request.headers['X-Tenant-ID'] || '1'
  end
end
