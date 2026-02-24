class DocumentGenerator
  TEMPLATES = {
    dpo_nomination: { 
      label: 'Lettre de nomination DPO', 
      filename: 'nomination_dpo.pdf',
      category: 'gouvernance'
    },
    pii_registry: { 
      label: 'Registre des données personnelles', 
      filename: 'registre_pii.pdf',
      category: 'inventory'
    },
    breach_procedure: { 
      label: 'Procédure violation 72h', 
      filename: 'procedure_violation_72h.pdf',
      category: 'incident'
    },
    consent_form: { 
      label: 'Formulaire de consentement', 
      filename: 'consentement_client.pdf',
      category: 'consent'
    },
    privacy_policy: { 
      label: 'Politique de confidentialité', 
      filename: 'politique_confidentialite.pdf',
      category: 'legal'
    }
  }

  def self.generate(template_key, tenant, custom_fields = {})
    config = TEMPLATES[template_key.to_sym]
    raise ArgumentError, "Template inconnu: #{template_key}" unless config

    data = build_data(tenant, custom_fields)
    html = render_template(template_key, data)
    
    Grover.new(html, format: 'A4', margin: { top: '20mm', bottom: '20mm' }).to_pdf
  end

  private

  def self.build_data(tenant, custom_fields)
    {
      company_name: tenant.name,
      date: Date.today.strftime('%d/%m/%Y'),
      dpo_name: custom_fields[:dpo_name] || '_____________________',
      dpo_email: custom_fields[:dpo_email] || "dpo@#{tenant.domain || 'entreprise.com'}",
      dpo_phone: custom_fields[:dpo_phone] || '_____________________',
      address: custom_fields[:address] || '_____________________',
      sector: custom_fields[:sector] || 'services',
      year: Date.today.year
    }.merge(custom_fields)
  end

  def self.render_template(template_key, data)
    template_path = Rails.root.join("app/views/templates/loi25/#{template_key}.html.erb")
    template = File.read(template_path)
    ERB.new(template).result(OpenStruct.new(data).instance_eval { binding })
  end
end
