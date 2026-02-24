class InsuranceScoringEngine
  WEIGHTS = {
    identity: 25,
    data_protection: 25,
    endpoint: 20,
    network: 15,
    incident_response: 10,
    compliance: 5
  }.freeze

  def self.calculate(answers)
    new(answers).calculate
  end

  def initialize(answers)
    @answers = answers
    @mfa_verified_data = nil
  end

  def calculate
    score = calculate_identity_score +
            calculate_data_protection_score +
            calculate_endpoint_score +
            calculate_network_score +
            calculate_incident_response_score +
            calculate_compliance_score

    {
      score: score.round,
      risk_level: risk_level(score),
      premium_impact: premium_impact(score),
      section_scores: {
        identity: calculate_identity_score.round,
        data_protection: calculate_data_protection_score.round,
        endpoint: calculate_endpoint_score.round,
        network: calculate_network_score.round,
        incident_response: calculate_incident_response_score.round,
        compliance: calculate_compliance_score.round
      },
      gaps: identify_gaps,
      # AJOUT : Données de vérification MFA
      mfa_verification: @mfa_verified_data || { verified: false, reason: 'Not checked' }
    }
  end

  private

  def answer_value(key, alternatives = [])
    keys = [key, *alternatives].flat_map { |k| [k.to_s, k.to_sym] }
    keys.each { |k| return @answers[k] if @answers.key?(k) && @answers[k].present? }
    nil
  end
  
  def answer_yes?(key, alternatives = [])
    val = answer_value(key, alternatives)
    return false if val.nil?
    val.to_s.downcase == 'yes' || val.to_s.downcase == 'true'
  end

  # MODIFICATION : Vérification MFA M365 automatique
  def calculate_identity_score
    score = 0.0
    max = WEIGHTS[:identity]
    
    # NOUVEAU : Vérification MFA automatique si M365 connecté
    mfa_verification = verify_m365_mfa
    
    if mfa_verification && mfa_verification[:verified]
      # MFA vérifié automatiquement via M365
      coverage = mfa_verification[:coverage_percentage]
      
      if coverage == 100
        score += (max * 0.40)  # Full points si 100% MFA
      elsif coverage >= 80
        score += (max * 0.30)  # Partial si 80%+
        @mfa_verified_data[:note] = "MFA à 80% - objectif 100%"
      elsif coverage >= 50
        score += (max * 0.15)  # Minimal si 50%+
        @mfa_verified_data[:note] = "MFA insuffisant (#{coverage}%)"
      else
        @mfa_verified_data[:note] = "MFA critique (#{coverage}%)"
      end
      
      @mfa_verified_data[:discrepancy_warning] = (coverage < 100 && answer_yes?('mfa'))
    else
      # Fallback sur la réponse au questionnaire (ancien système)
      score += (max * 0.40) if answer_yes?('mfa', ['mfa_enabled'])
    end
    
    score += (max * 0.15) if answer_value('mfa', ['mfa_enabled']).to_s.downcase == 'partial'
    score += (max * 0.25) if answer_yes?('sso')
    score += (max * 0.25) if answer_yes?('pam')
    score += (max * 0.20) if answer_yes?('conditional_access')
    
    score
  end

  # NOUVEAU : Méthode de vérification MFA via M365
  def verify_m365_mfa
    # Essayer de récupérer le tenant_id des answers ou du contexte
    tenant_id = @answers['tenant_id'] || @answers[:tenant_id]
    return nil unless tenant_id.present?
    
    @mfa_verified_data = M365IntegrationService.new(tenant_id).verify_mfa_status
    @mfa_verified_data
  rescue => e
    Rails.logger.error("MFA Verification failed: #{e.message}")
    nil
  end

  def calculate_data_protection_score
    score = 0.0
    max = WEIGHTS[:data_protection]
    
    backup_val = answer_value('backups', ['backup_frequency', 'backup_tested']).to_s.downcase
    score += (max * 0.30) if backup_val.include?('daily')
    score += (max * 0.20) if backup_val.include?('weekly')
    score += (max * 0.30) if backup_val.include?('month')
    
    score += (max * 0.20) if answer_yes?('offsite_backup', ['offsite'])
    score += (max * 0.20) if answer_yes?('immutable_backups', ['immutable'])
    
    score
  end

  def calculate_endpoint_score
    score = 0.0
    max = WEIGHTS[:endpoint]
    
    edr_val = answer_value('edr_coverage').to_s.downcase
    score += (max * 0.35) if edr_val.include?('100') || answer_yes?('edr_coverage')
    
    enc_val = answer_value('encryption', ['endpoint_encryption', 'disk_encryption']).to_s.downcase
    score += (max * 0.30) if enc_val.include?('full') || enc_val.include?('yes') || enc_val.include?('disk')
    
    patching_val = answer_value('patching', ['patching_frequency']).to_s.downcase
    score += (max * 0.30) if patching_val.include?('7') || patching_val.include?('week')
    
    score += (max * 0.15) if answer_yes?('usb_controls', ['usb'])
    
    score
  end

  def calculate_network_score
    score = 0.0
    max = WEIGHTS[:network]
    
    score += (max * 0.30) if answer_yes?('firewall')
    score += (max * 0.25) if answer_yes?('network_segmentation') || answer_value('network_segmentation').to_s.downcase == 'full'
    score += (max * 0.15) if answer_value('network_segmentation').to_s.downcase == 'partial'
    score += (max * 0.25) if answer_yes?('vpn')
    score += (max * 0.20) if answer_yes?('network_monitoring')
    
    score
  end

  def calculate_incident_response_score
    score = 0.0
    max = WEIGHTS[:incident_response]
    
    score += (max * 0.30) if answer_yes?('ir_plan')
    score += (max * 0.30) if answer_value('ir_tested').to_s.downcase.include?('6') || answer_value('ir_tested').to_s.downcase.include?('month')
    score += (max * 0.15) if answer_value('ir_tested').to_s.downcase.include?('12') || answer_value('ir_tested').to_s.downcase.include?('year')
    score += (max * 0.20) if answer_yes?('cyber_insurance')
    score += (max * 0.20) if answer_value('tabletop').to_s.downcase.include?('quarter')
    
    score
  end

  def calculate_compliance_score
    score = 0.0
    max = WEIGHTS[:compliance]
    
    score += (max * 0.30) if answer_yes?('loi25', ['loi_25', 'quebec_compliance'])
    score += (max * 0.25) if answer_yes?('security_policies')
    score += (max * 0.25) if answer_yes?('training')
    score += (max * 0.20) if answer_yes?('third_party_audits')
    
    score
  end

  def risk_level(score)
    case score
    when 85..100 then 'EXCELLENT'
    when 70..84 then 'GOOD'
    when 50..69 then 'FAIR'
    else 'AT RISK'
    end
  end

  def premium_impact(score)
    case score
    when 85..100 then '-30% to -40%'
    when 70..84 then '-15% to -25%'
    when 50..69 then 'Standard rate'
    else '+50% to +200% or DENIAL'
    end
  end

  def identify_gaps
    gaps = []
    
    # MODIFICATION : Vérifier aussi les données M365 si disponibles
    if @mfa_verified_data && @mfa_verified_data[:verified]
      coverage = @mfa_verified_data[:coverage_percentage]
      if coverage < 100
        gaps << "MFA incomplet: #{coverage}% des utilisateurs protégés (objectif: 100%)"
      end
    else
      gaps << 'Enable MFA on all accounts' unless answer_yes?('mfa', ['mfa_enabled'])
    end
    
    gaps << 'Implement daily backups' unless answer_value('backups', ['backup_frequency', 'backup_tested'])&.to_s&.downcase&.include?('daily')
    gaps << 'Test backup restoration monthly' unless answer_value('backup_tested', ['tested'])&.to_s&.downcase&.include?('month')
    gaps << 'Deploy EDR on 100% of endpoints' unless answer_value('edr_coverage')&.to_s&.include?('100')
    gaps << 'Document Incident Response plan' unless answer_yes?('ir_plan', ['incident_response_plan'])
    
    gaps
  end
end