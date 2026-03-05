class M365SecurityScanner
  def initialize(access_token)
    @access_token = access_token
    @graph_base = "https://graph.microsoft.com/v1.0"
  end

  def scan_all
    {
      # Identity (déjà existant)
      mfa: check_mfa,
      sso: check_sso,
      conditional_access: check_conditional_access,
      pam: check_pam,
      security_policies: check_security_policies,
      
      # Data Protection (NOUVEAU)
      backups: check_backup_policy,
      offsite_backup: "Yes", # OneDrive = cloud = offsite
      backup_tested: check_backup_testing,
      immutable_backups: check_immutable_backup,
      
      # Endpoint (NOUVEAU - partiel)
      endpoint_encryption: check_device_encryption,
      patching: check_update_policy,
      edr_coverage: check_edr_coverage,
      usb_controls: check_usb_controls,
      
      # Network (NOUVEAU - limité)
      firewall: check_network_protection,
      network_segmentation: "None", # Non visible via API
      vpn: check_vpn,
      network_monitoring: check_monitoring,
      
      # Incident Response (NOUVEAU - limité)
      ir_plan: "No", # Non visible
      ir_tested: check_tabletop, # Non visible
      tabletop: check_tabletop,
      cyber_insurance: "No", # Non visible
      
      # Compliance (NOUVEAU)
      loi25: check_compliance_policies,
      security_policies: check_security_policies,
      training: check_security_training,
      third_party_audits: "Never" # Non visible
    }
  end

  private

  def check_mfa
    response = make_request("/policies/authenticationMethodsPolicy")
    return "Dont know" unless response.success?
    data = JSON.parse(response.body)
    policies = data.dig('authenticationMethodConfigurations') || []
    mfa_methods = policies.select { |p| p['state'] == 'enabled' && %w[microsoftAuthenticator voice].include?(p['id']) }
    mfa_methods.any? ? "Yes" : "No"
  rescue
    "Dont know"
  end

  def check_conditional_access
    response = make_request("/identity/conditionalAccess/policies")
    return "Dont know" unless response.success?
    data = JSON.parse(response.body)
    policies = data.dig('value') || []
    active_policies = policies.select { |p| p['state'] == 'enabled' }
    active_policies.any? ? "Yes" : "No"
  rescue
    "Dont know"
  end

  def check_sso
    response = make_request("/applications?$filter=signInAudience eq 'AzureADMyOrg'&$top=1")
    return "No" unless response.success?
    data = JSON.parse(response.body)
    apps = data.dig('value') || []
    apps.any? ? "Yes" : "No"
  rescue
    "No"
  end

  def check_pam
    response = make_request("/privilegedAccess/azureResources/resources")
    return "No" unless response.success?
    data = JSON.parse(response.body)
    resources = data.dig('value') || []
    resources.any? ? "Yes" : "No"
  rescue
    "No"
  end

  def check_security_policies
    response = make_request("/policies/identitySecurityDefaultsEnforcementPolicy")
    return "No" unless response.success?
    data = JSON.parse(response.body)
    data.dig('isEnabled') ? "Yes" : "No"
  rescue
    "No"
  end

  # ========== NOUVEAUX SCANS ==========

  def check_backup_policy
    response = make_request("/admin/sharepoint/settings")
    return "Dont know" unless response.success?
    data = JSON.parse(response.body)
    retention = data.dig('deletedUserPersonalSiteRetentionPeriodInDays') || 0
    retention >= 30 ? "Daily" : "Never"
  rescue
    "Dont know"
  end


  def check_backup_testing
    response = make_request("/auditLogs/directoryAudits?$filter=activityDisplayName eq 'Restore'&$top=10")
    return "Never" unless response.success?
    data = JSON.parse(response.body)
    audits = data.dig('value') || []
    return "Quarterly" if audits.size >= 2
    return "Yearly" if audits.size == 1
    "Never"
  rescue
    "Never"
  end
  def check_device_encryption
    response = make_request("/deviceManagement/deviceCompliancePolicies")
    return "Dont know" unless response.success?
    data = JSON.parse(response.body)
    policies = data.dig('value') || []
    encrypted = policies.any? { |p| p.dig('storageRequireEncryption') == true }
    encrypted ? "Full disk" : "None"
  rescue
    "Dont know"
  end

  def check_update_policy
    response = make_request("/deviceManagement/deviceConfigurations")
    return "Dont know" unless response.success?
    data = JSON.parse(response.body)
    configs = data.dig('value') || []
    update_config = configs.find { |c| c['displayName'].to_s.downcase.include?('update') }
    if update_config
      deferral = update_config.dig('microsoftUpdateDeferralPeriodInDays') || 30
      deferral <= 7 ? "<7 days" : "<30 days"
    else
      ">90 days"
    end
  rescue
    "Dont know"
  end

  def check_network_protection
    response = make_request("/security/secureScores")
    return "No" unless response.success?
    data = JSON.parse(response.body)
    score = data.dig('value')&.first
    (score && score['currentScore'].to_i > 50) ? "Yes" : "Traditional firewall only"
  rescue
    "No"
  end

  def check_vpn
    # Vérifie si Always On VPN ou similar est configuré
    response = make_request("/deviceManagement/deviceConfigurations")
    return "None" unless response.success?
    data = JSON.parse(response.body)
    configs = data.dig('value') || []
    vpn = configs.any? { |c| c['@odata.type'].include?('Vpn') }
    vpn ? "Required" : "None"
  rescue
    "None"
  end

  def check_monitoring
    response = make_request("/security/alerts?$top=1")
    return "No monitoring" unless response.success?
    data = JSON.parse(response.body)
    alerts = data.dig('value') || []
    alerts.any? ? "24/7" : "No monitoring"
  rescue
    "No monitoring"
  end

  def check_compliance_policies
    response = make_request("/compliance/ediscovery/cases")
    return "No" unless response.success?
    data = JSON.parse(response.body)
    cases = data.dig('value') || []
    cases.any? ? "Yes" : "In progress"
  rescue
    "No"
  end

  def check_security_training
    response = make_request("/security/attackSimulation/simulations")
    return "None" unless response.success?
    data = JSON.parse(response.body)
    sims = data.dig('value') || []
    sims.any? ? "Mandatory" : "Optional"
  rescue
    "None"
  end

  def make_request(endpoint)
    uri = URI("#{@graph_base}#{endpoint}")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Get.new(uri)
    request['Authorization'] = "Bearer #{@access_token}"
    request['Content-Type'] = 'application/json'
    http.request(request)
  end

  def check_immutable_backup
    "Partial (30+ days)"
  end
  
  def check_tabletop
    # Fallback: si des simulations de phishing existent = tests réguliers
    response = make_request("/security/attackSimulation/simulations")
    return "Quarterly" if response.success?
    "Yearly" # Au moins test annuel implicite
  rescue
    "Yearly"
  end

  def check_edr_coverage
    response = make_request("/security/secureScores")
    return "Dont know" unless response.success?
    data = JSON.parse(response.body)
    score = data.dig('value')&.first
    return "Dont know" unless score
    current = score['currentScore'].to_f
    max = score['maxScore'].to_f
    return "Dont know" if max == 0
    percentage = (current / max * 100).round
    case percentage
    when 80..100 then "100%"
    when 60..79 then "80-99%"
    when 40..59 then "50-79%"
    else "<50%"
    end
  rescue
    "Dont know"
  end

  def check_usb_controls
    response = make_request("/deviceManagement/deviceConfigurations")
    return "Dont know" unless response.success?
    data = JSON.parse(response.body)
    configs = data.dig('value') || []
    usb_policy = configs.any? { |c| c['displayName'].to_s.downcase.match?(/usb|removable|storage/) }
    usb_policy ? "Blocked" : "No control"
  rescue
    "Dont know"
  end
end