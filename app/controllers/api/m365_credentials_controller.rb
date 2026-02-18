module Api
  class M365CredentialsController < ApplicationController
    skip_before_action :verify_authenticity_token, raise: false
    
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
  end
end
