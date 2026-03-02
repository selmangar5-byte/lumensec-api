module Api
  class M365CredentialsController < ApplicationController
    skip_before_action :verify_authenticity_token, raise: false
    before_action :set_cors_headers
    
    # Handle preflight OPTIONS requests
    def options
      render plain: '', status: :ok
    end
    
    def show
      tenant_id = request.headers['X-Tenant-ID'] || 'default'
      creds = M365Credential.find_by(tenant_id: tenant_id)
      
      if creds
        render json: {
          has_credentials: true,
          client_id: creds.client_id,
          m365_tenant_id: creds.m365_tenant_id,
          active: creds.active,
          last_sync: creds.last_sync_at,
          connected_by_email: creds.connected_by_email,
          connected_by_name: creds.connected_by_name
        }
      else
        render json: { has_credentials: false }
      end
    end
    
    # 🔍 NOUVEAU : Scan de sécurité M365 pour pré-remplir le questionnaire
    def scan
      tenant_id = request.headers['X-Tenant-ID'] || 'default'
      creds = M365Credential.find_by(tenant_id: tenant_id)
      
      if creds.nil?
        return render json: { 
          error: "Aucune connexion M365 trouvée",
          connected: false 
        }, status: 404
      end
      
      if creds.access_token.blank?
        return render json: { 
          error: "Token d'accès manquant, reconnectez-vous",
          connected: false 
        }, status: 400
      end
      
      # Vérifier si le token n'est pas expiré (simple vérification, à améliorer si besoin)
      if creds.expires_at && creds.expires_at < Time.current
        return render json: {
          error: "Token expiré, reconnectez-vous",
          connected: false,
          expired: true
        }, status: 401
      end
      
      # Lancer le scan
      scanner = M365SecurityScanner.new(creds.access_token)
      security_data = scanner.scan_all
      
      render json: {
        connected: true,
        connected_by_email: creds.connected_by_email,
        connected_by_name: creds.connected_by_name,
        security_profile: security_data,
        scanned_at: Time.current.iso8601
      }
      
    rescue => e
      Rails.logger.error "M365 Scan Error: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { 
        error: "Erreur lors du scan Microsoft",
        details: e.message,
        connected: false 
      }, status: 500
    end
    
    def create
      tenant_id = request.headers['X-Tenant-ID'] || 'default'
      
      creds = M365Credential.find_or_initialize_by(tenant_id: tenant_id)
      creds.assign_attributes(credential_params)
      creds.active = true
      
      if creds.save
        render json: { 
          success: true, 
          message: "Configuration sauvegardée",
          active: creds.active 
        }
      else
        render json: { 
          success: false, 
          errors: creds.errors.full_messages 
        }, status: :unprocessable_entity
      end
    end
    
    def test_connection
      tenant_id = request.headers['X-Tenant-ID'] || 'default'
      creds = M365Credential.find_by(tenant_id: tenant_id)
      
      if creds.nil?
        return render json: { 
          success: false, 
          error: "Aucune configuration trouvée" 
        }
      end
      
      render json: { 
        success: true, 
        message: "Configuration valide" 
      }
    end
    
    def toggle_mode
      tenant_id = request.headers['X-Tenant-ID'] || 'default'
      creds = M365Credential.find_by(tenant_id: tenant_id)
      
      if creds
        creds.update(active: !creds.active)
        render json: { 
          success: true, 
          active: creds.active,
          mode: creds.active ? "live" : "mock"
        }
      else
        render json: { 
          success: false, 
          error: "Configurez d'abord vos credentials" 
        }
      end
    end
    
    private
    
    def credential_params
      params.require(:m365_credential).permit(:client_id, :client_secret, :m365_tenant_id)
    end

    def set_cors_headers
      response.headers['Access-Control-Allow-Origin'] = '*'
      response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD'
      response.headers['Access-Control-Allow-Headers'] = request.headers['Access-Control-Request-Headers'] || 'Content-Type, X-Tenant-ID'
      response.headers['Access-Control-Expose-Headers'] = 'X-Tenant-ID'
    end
  end
end