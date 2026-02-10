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
      gaps: identify_gaps
    }
  end

  private

  def calculate_identity_score
    score = 0.0
    max = WEIGHTS[:identity]
    
    score += (max * 0.30) if @answers['mfa'] == 'Yes'
    score += (max * 0.15) if @answers['mfa'] == 'Partial'
    score += (max * 0.25) if @answers['sso'] == 'Yes'
    score += (max * 0.25) if @answers['pam'] == 'Yes'
    score += (max * 0.20) if @answers['conditional_access'] == 'Yes'
    
    score
  end

  def calculate_data_protection_score
    score = 0.0
    max = WEIGHTS[:data_protection]
    
    score += (max * 0.30) if @answers['backups'] == 'Daily'
    score += (max * 0.20) if @answers['backups'] == 'Weekly'
    score += (max * 0.30) if @answers['backup_tested'] == 'Monthly'
    score += (max * 0.15) if @answers['backup_tested'] == 'Quarterly'
    score += (max * 0.20) if @answers['offsite_backup'] == 'Yes'
    score += (max * 0.20) if @answers['immutable_backups'] == 'Yes'
    
    score
  end

  def calculate_endpoint_score
    score = 0.0
    max = WEIGHTS[:endpoint]
    
    score += (max * 0.35) if @answers['edr_coverage'] == '100%'
    score += (max * 0.25) if @answers['edr_coverage'] == '80-99%'
    score += (max * 0.30) if @answers['patching'] == '<7 days'
    score += (max * 0.20) if @answers['patching'] == '<30 days'
    score += (max * 0.20) if @answers['endpoint_encryption'] == 'Full disk'
    score += (max * 0.15) if @answers['usb_controls'] == 'Blocked'
    
    score
  end

  def calculate_network_score
    score = 0.0
    max = WEIGHTS[:network]
    
    score += (max * 0.30) if @answers['firewall'] == 'Yes'
    score += (max * 0.25) if @answers['network_segmentation'] == 'Full'
    score += (max * 0.15) if @answers['network_segmentation'] == 'Partial'
    score += (max * 0.25) if @answers['vpn'] == 'Required'
    score += (max * 0.20) if @answers['network_monitoring'] == '24/7'
    
    score
  end

  def calculate_incident_response_score
    score = 0.0
    max = WEIGHTS[:incident_response]
    
    score += (max * 0.30) if @answers['ir_plan'] == 'Yes'
    score += (max * 0.30) if @answers['ir_tested'] == '<6 months'
    score += (max * 0.15) if @answers['ir_tested'] == '<12 months'
    score += (max * 0.20) if @answers['cyber_insurance'] == 'Yes'
    score += (max * 0.20) if @answers['tabletop'] == 'Quarterly'
    
    score
  end

  def calculate_compliance_score
    score = 0.0
    max = WEIGHTS[:compliance]
    
    score += (max * 0.30) if @answers['loi25'] == 'Yes'
    score += (max * 0.25) if @answers['security_policies'] == 'Yes'
    score += (max * 0.25) if @answers['training'] == 'Mandatory'
    score += (max * 0.20) if @answers['third_party_audits'] == 'Annual'
    
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
    
    gaps << 'Enable MFA on all accounts' if @answers['mfa'] != 'Yes'
    gaps << 'Implement daily backups' if @answers['backups'] != 'Daily'
    gaps << 'Test backup restoration monthly' if @answers['backup_tested'] != 'Monthly'
    gaps << 'Deploy EDR on 100% of endpoints' if @answers['edr_coverage'] != '100%'
    gaps << 'Document Incident Response plan' if @answers['ir_plan'] != 'Yes'
    
    gaps
  end
end
