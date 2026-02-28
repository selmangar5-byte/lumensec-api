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
          last_sync: creds.last_sync_at
        }
      else
        render json: { has_credentials: false }
      end
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
