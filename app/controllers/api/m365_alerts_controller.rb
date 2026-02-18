module Api
  class M365AlertsController < ApplicationController
    skip_before_action :verify_authenticity_token, raise: false
    
    def index
      tenant_id = request.headers['X-Tenant-ID'] || 'default'
      
      service = M365IntegrationService.new(tenant_id)
      alerts = service.fetch_security_alerts
      
      # Synchroniser avec la base de données
      alerts.each do |alert_data|
        M365Alert.find_or_create_by(tenant_id: tenant_id, alert_id: alert_data[:alert_id]) do |alert|
          alert.title = alert_data[:title]
          alert.description = alert_data[:description]
          alert.severity = alert_data[:severity]
          alert.status = alert_data[:status]
          alert.category = alert_data[:category]
          alert.user_email = alert_data[:user_email]
          alert.ip_address = alert_data[:ip_address]
          alert.detected_at = alert_data[:detected_at]
          alert.raw_data = alert_data
        end
      end
      
      # Récupérer toutes les alertes du tenant (y compris celles en base)
      db_alerts = M365Alert.where(tenant_id: tenant_id).order(detected_at: :desc).map do |alert|
        {
          alert_id: alert.alert_id,
          title: alert.title,
          description: alert.description,
          severity: alert.severity,
          status: alert.status,
          category: alert.category,
          user_email: alert.user_email,
          ip_address: alert.ip_address,
          detected_at: alert.detected_at,
          recommended_action: alert.raw_data&.dig('recommended_action')
        }
      end
      
      render json: {
        success: true,
        count: db_alerts.count,
        alerts: db_alerts,
        last_sync: Time.now
      }
    end
    
    def update
      tenant_id = request.headers['X-Tenant-ID'] || 'default'
      alert = M365Alert.find_by(tenant_id: tenant_id, alert_id: params[:id])
      
      # Si l'alerte n'existe pas en base, la créer d'abord à partir des données mockées
      if alert.nil?
        service = M365IntegrationService.new(tenant_id)
        mock_alerts = service.fetch_security_alerts
        mock_alert = mock_alerts.find { |a| a[:alert_id] == params[:id] }
        
        if mock_alert
          alert = M365Alert.create!(
            tenant_id: tenant_id,
            alert_id: mock_alert[:alert_id],
            title: mock_alert[:title],
            description: mock_alert[:description],
            severity: mock_alert[:severity],
            status: mock_alert[:status],
            category: mock_alert[:category],
            user_email: mock_alert[:user_email],
            ip_address: mock_alert[:ip_address],
            detected_at: mock_alert[:detected_at],
            raw_data: mock_alert
          )
        else
          return render json: { error: "Alerte non trouvée" }, status: :not_found
        end
      end
      
      # Mettre à jour le statut
      if alert.update(status: params[:status])
        render json: {
          success: true,
          message: "Statut mis à jour",
          alert: {
            alert_id: alert.alert_id,
            status: alert.status,
            updated_at: alert.updated_at
          }
        }
      else
        render json: { error: alert.errors.full_messages }, status: :unprocessable_entity
      end
    end
    
    def stats
      tenant_id = request.headers['X-Tenant-ID'] || 'default'
      
      stats = {
        total_alerts: M365Alert.where(tenant_id: tenant_id).count,
        critical: M365Alert.where(tenant_id: tenant_id, severity: [:critical, :high]).count,
        new_alerts: M365Alert.where(tenant_id: tenant_id, status: :new_alert).count,
        by_category: M365Alert.where(tenant_id: tenant_id).group(:category).count,
        last_24h: M365Alert.where(tenant_id: tenant_id, detected_at: 24.hours.ago..Time.now).count
      }
      
      render json: { success: true, stats: stats }
    end
  end
end