class InsuranceScoringEngine
  WEIGHTS = {
    identity: 25,
    data_protection: 20,
    endpoint: 20,
    network: 15,
    incident_response: 10,
    compliance: 10
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
      recommendations: generate_recommendations,
      status: 'completed',
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

  def calculate_identity_score
    score = 0.0
    max = WEIGHTS[:identity]
    
    mfa_verification = verify_m365_mfa
    
    if mfa_verification && mfa_verification[:verified]
      coverage = mfa_verification[:coverage_percentage]
      
      if coverage == 100
        score += (max * 0.40)
      elsif coverage >= 80
        score += (max * 0.30)
        @mfa_verified_data[:note] = "MFA à 80% - objectif 100%"
      elsif coverage >= 50
        score += (max * 0.15)
        @mfa_verified_data[:note] = "MFA insuffisant (#{coverage}%)"
      else
        @mfa_verified_data[:note] = "MFA critique (#{coverage}%)"
      end
      
      @mfa_verified_data[:discrepancy_warning] = (coverage < 100 && answer_yes?('mfa'))
    else
      score += (max * 0.40) if answer_yes?('mfa')
    end
    
    score += (max * 0.15) if answer_value('mfa').to_s.downcase == 'partial'
    score += (max * 0.25) if answer_yes?('sso')
    score += (max * 0.25) if answer_yes?('pam')
    score += (max * 0.20) if answer_yes?('conditional_access')
    
    score
  end

  def verify_m365_mfa
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
    
    # MODIFIÉ : Clés React 'backups' et 'backup_tested'
    backup_val = answer_value('backups').to_s.downcase
    score += (max * 0.30) if backup_val.include?('daily')
    score += (max * 0.20) if backup_val.include?('weekly')
    score += (max * 0.10) if backup_val.include?('month')
    
    backup_tested_val = answer_value('backup_tested').to_s.downcase
    score += (max * 0.20) if backup_tested_val.include?('month')
    score += (max * 0.15) if backup_tested_val.include?('quarter')
    
    score += (max * 0.20) if answer_yes?('offsite_backup')
    score += (max * 0.20) if answer_yes?('immutable_backups')
    
    score
  end

  def calculate_endpoint_score
    score = 0.0
    max = WEIGHTS[:endpoint]
    
    edr_val = answer_value('edr_coverage').to_s.downcase
    score += (max * 0.35) if edr_val.include?('100')
    score += (max * 0.25) if edr_val.include?('80-99')
    
    # MODIFIÉ : Clé React exacte 'endpoint_encryption'
    enc_val = answer_value('endpoint_encryption').to_s.downcase
    score += (max * 0.30) if enc_val.include?('full')
    score += (max * 0.15) if enc_val.include?('partial')
    
    # MODIFIÉ : Clé React exacte 'patching'
    patching_val = answer_value('patching').to_s.downcase
    score += (max * 0.30) if patching_val.include?('7')
    score += (max * 0.20) if patching_val.include?('30')
    
    # MODIFIÉ : Clé React exacte 'usb_controls'
    score += (max * 0.15) if answer_value('usb_controls').to_s.downcase == 'blocked'
    score += (max * 0.08) if answer_value('usb_controls').to_s.downcase == 'monitored'
    
    score
  end

  def calculate_network_score
    score = 0.0
    max = WEIGHTS[:network]
    
    score += (max * 0.30) if answer_yes?('firewall')
    
    seg_val = answer_value('network_segmentation').to_s.downcase
    score += (max * 0.25) if seg_val == 'full'
    score += (max * 0.15) if seg_val == 'partial'
    
    score += (max * 0.25) if answer_value('vpn').to_s.downcase == 'required'
    score += (max * 0.15) if answer_value('vpn').to_s.downcase == 'optional'
    
    mon_val = answer_value('network_monitoring').to_s.downcase
    score += (max * 0.20) if mon_val.include?('24/7')
    score += (max * 0.12) if mon_val.include?('business')
    
    score
  end

  def calculate_incident_response_score
    score = 0.0
    max = WEIGHTS[:incident_response]
    
    score += (max * 0.30) if answer_yes?('ir_plan')
    
    tested_val = answer_value('ir_tested').to_s.downcase
    score += (max * 0.30) if tested_val.include?('6')
    score += (max * 0.20) if tested_val.include?('12')
    
    score += (max * 0.20) if answer_yes?('cyber_insurance')
    
    tabletop_val = answer_value('tabletop').to_s.downcase
    score += (max * 0.20) if tabletop_val.include?('quarter')
    score += (max * 0.15) if tabletop_val.include?('year')
    
    score
  end

  def calculate_compliance_score
    score = 0.0
    max = WEIGHTS[:compliance]
    
    # MODIFIÉ : Clé React exacte 'loi25'
    loi25_val = answer_value('loi25').to_s.downcase
    score += (max * 0.30) if loi25_val == 'yes'
    score += (max * 0.15) if loi25_val == 'in progress'
    
    score += (max * 0.25) if answer_yes?('security_policies')
    
    training_val = answer_value('training').to_s.downcase
    score += (max * 0.25) if training_val == 'mandatory'
    score += (max * 0.15) if training_val == 'optional'
    
    audit_val = answer_value('third_party_audits').to_s.downcase
    score += (max * 0.20) if audit_val.include?('annual')
    score += (max * 0.10) if audit_val.include?('bi')
    
    score
  end

  def risk_level(score)
    case score
    when 85..100 then 'LOW'
    when 70..84 then 'MEDIUM'
    when 50..69 then 'ELEVATED'
    else 'HIGH'
    end
  end

  def premium_impact(score)
    case score
    when 85..100 then '-25%'
    when 70..84 then '-5%'
    when 50..69 then '+15%'
    else '+35%'
    end
  end

  def identify_gaps
    gaps = []
    
    if @mfa_verified_data && @mfa_verified_data[:verified]
      coverage = @mfa_verified_data[:coverage_percentage]
      if coverage < 100
        gaps << "MFA incomplet: #{coverage}% des utilisateurs protégés"
      end
    else
      gaps << 'Enable MFA on all accounts' unless answer_yes?('mfa')
    end
    
    # MODIFIÉ : Clés React exactes
    backup_val = answer_value('backups').to_s.downcase
    gaps << 'Implement daily backups' unless backup_val.include?('daily')
    
    backup_tested_val = answer_value('backup_tested').to_s.downcase
    gaps << 'Test backup restoration monthly' unless backup_tested_val.include?('month')
    
    gaps << 'Backups not immutable (ransomware risk)' unless answer_yes?('immutable_backups')
    
    edr_val = answer_value('edr_coverage').to_s.downcase
    gaps << 'EDR coverage insufficient' unless edr_val.include?('100') || edr_val.include?('80-99')
    
    gaps << 'No incident response plan' unless answer_yes?('ir_plan')
    
    loi25_val = answer_value('loi25').to_s.downcase
    gaps << 'Non-compliance Loi 25' if loi25_val == 'no'
    
    gaps.uniq
  end

  def generate_recommendations
    return ["Maintain current security posture", "Consider advanced threat hunting"] if identify_gaps.empty?
    
    recs = []
    recs << "Deploy MFA immediately" if identify_gaps.any? { |g| g.include?('MFA') }
    recs << "Implement 3-2-1 backup strategy with immutability" if identify_gaps.any? { |g| g.include?('backup') }
    recs << "Extend EDR coverage" if identify_gaps.any? { |g| g.include?('EDR') }
    recs << "Establish Loi 25 compliance" if identify_gaps.any? { |g| g.include?('Loi 25') }
    recs << "Create incident response plan" if identify_gaps.any? { |g| g.include?('incident') }
    recs
  end
end