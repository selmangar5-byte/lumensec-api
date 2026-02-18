class DashboardController < ApplicationController
  skip_before_action :verify_authenticity_token, raise: false
  
  def stats
    tenant_id = request.headers['X-Tenant-ID']
    
    if tenant_id.blank?
      # Version simplifiée sans .to_h qui plante
      return render json: { 
        error: "Header X-Tenant-ID manquant"
      }, status: :bad_request
    end
    
    render json: {
      success: true,
      tenant_received: tenant_id,
      stats: {
        total_incidents: 123,
        critical_incidents: 12,
        active_threats: 5,
        by_severity: {
          "1" => 15,
          "2" => 28,
          "3" => 45,
          "4" => 23,
          "5" => 12
        },
        recent_incidents: [
          {
            id: 1,
            title: "Suspicious Login Attempt",
            severity: "high",
            status: "open",
            created_at: Time.now - 2.hours
          },
          {
            id: 2,
            title: "Malware Detection",
            severity: "critical",
            status: "investigating",
            created_at: Time.now - 5.hours
          },
          {
            id: 3,
            title: "Unauthorized Access",
            severity: "medium",
            status: "resolved",
            created_at: Time.now - 1.day
          }
        ]
      }
    }
  rescue => e
    # Si ça plante encore, on verra l'erreur exacte
    render json: { 
      error: e.message,
      backtrace: e.backtrace.first(5)
    }, status: :internal_server_error
  end
end