require 'ostruct'

module Api
  class TemplatesController < ApplicationController
    # GET /api/templates/loi25/:template_type
    # Retourne le HTML pour preview
    def show
      template_type = params[:template_type]
      tenant = current_tenant
      
      valid_types = %w[dpo_nomination pii_registry breach_procedure consent_form privacy_policy]
      unless valid_types.include?(template_type)
        return render json: { error: "Type de template invalide" }, status: :unprocessable_entity
      end
      
      # Pour la preview HTML, on lit et rend le template ERB manuellement
      data = build_template_data(tenant)
      template_path = Rails.root.join("app/views/templates/loi25/#{template_type}.html.erb")
      
      unless File.exist?(template_path)
        return render json: { error: "Template non trouvé" }, status: :not_found
      end
      
      template_content = File.read(template_path)
      
      # Utiliser OpenStruct pour créer un objet avec les données comme attributs
      context = OpenStruct.new(data)
      html_content = ERB.new(template_content).result(context.instance_eval { binding })
      
      render json: { 
        template_type: template_type,
        html_content: html_content,
        generated_at: Time.now.iso8601,
        tenant: tenant.name
      }
    rescue => e
      render json: { error: "Erreur génération: #{e.message}" }, status: :internal_server_error
    end
    
    # GET /api/templates/loi25/:template_type/download
    # Retourne le PDF via DocumentGenerator
    def download
      template_type = params[:template_type]
      tenant = current_tenant
      
      valid_types = %w[dpo_nomination pii_registry breach_procedure consent_form privacy_policy]
      unless valid_types.include?(template_type)
        return render json: { error: "Type de template invalide" }, status: :unprocessable_entity
      end
      
      # Utiliser DocumentGenerator.generate (méthode de classe)
      pdf_content = DocumentGenerator.generate(template_type, tenant)
      
      send_data pdf_content, 
        filename: "#{template_type}_#{tenant.name.parameterize}.pdf",
        type: 'application/pdf',
        disposition: 'inline'
    rescue ArgumentError => e
      render json: { error: e.message }, status: :unprocessable_entity
    rescue => e
      render json: { error: "Erreur génération PDF: #{e.message}" }, status: :internal_server_error
    end
    
    private
    
    def current_tenant
      # Utiliser le tenant ID par défaut ou celui de la session
      Tenant.find_by(id: params[:tenant_id]) || Tenant.find_by(id: '11111111-1111-1111-1111-111111111111')
    end
    
    def build_template_data(tenant)
      {
        company_name: tenant.name,
        date: Date.today.strftime('%d/%m/%Y'),
        year: Date.today.year,
        dpo_name: '_____________________',
        dpo_email: "dpo@#{tenant.domain || 'entreprise.com'}",
        dpo_phone: '_____________________',
        address: tenant.domain || '_____________________',
        sector: 'services'
      }
    end
  end
end