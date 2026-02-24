class RansomwareAssessment < ApplicationRecord
  belongs_to :tenant
  
  validates :tenant_id, presence: true
  validates :score, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  
  STATUS_READY = 'RANSOMWARE_READY'.freeze
  STATUS_AT_RISK = 'AT_RISK'.freeze
  
  def self.calculate(tenant_id, answers)
    new(tenant_id: tenant_id).calculate(answers)
  end
  
  def calculate(answers)
    @answers = answers
    
    backup_score = calculate_backup_score
    isolation_score = calculate_isolation_score  
    detection_score = calculate_detection_score
    response_score = calculate_response_score
    
    total_score = backup_score + isolation_score + detection_score + response_score
    
    {
      score: total_score.round,
      status: total_score >= 80 ? STATUS_READY : STATUS_AT_RISK,
      backup_score: backup_score.round,
      isolation_score: isolation_score.round,
      detection_score: detection_score.round,
      response_score: response_score.round,
      gaps: identify_gaps,
      readiness_level: readiness_level(total_score)
    }
  end
  
  private
  
  def calculate_backup_score
    score = 0.0
    score += 15 if @answers['immutable_backups'] == 'yes'
    score += 10 if @answers['air_gap_backup'] == 'yes'
    score += 5 if @answers['offline_backup'] == 'yes'
    score += 10 if @answers['backup_tested_monthly'] == 'yes'
    score += 5 if @answers['backup_tested_quarterly'] == 'yes'
    score += 5 if @answers['rto_defined'] == 'yes'
    [score, 30].min
  end
  
  def calculate_isolation_score
    score = 0.0
    score += 10 if @answers['network_segmentation'] == 'yes'
    score += 5 if @answers['vlan_critical_assets'] == 'yes'
    score += 5 if @answers['zero_trust'] == 'yes'
    score += 5 if @answers['privileged_access_management'] == 'yes'
    score += 5 if @answers['backup_network_isolated'] == 'yes'
    score += 5 if @answers['no_domain_admin_on_backups'] == 'yes'
    [score, 25].min
  end
  
  def calculate_detection_score
    score = 0.0
    score += 10 if @answers['edr_deployed'] == 'yes'
    score += 5 if @answers['behavioral_analysis'] == 'yes'
    score += 5 if @answers['lateral_movement_detection'] == 'yes'
    score += 5 if @answers['encryption_detection'] == 'yes'
    score += 5 if @answers['soc_monitoring'] == 'yes'
    score += 5 if @answers['automated_response'] == 'yes'
    [score, 25].min
  end
  
  def calculate_response_score
    score = 0.0
    score += 10 if @answers['ransomware_playbook'] == 'yes'
    score += 5 if @answers['tabletop_tested'] == 'yes'
    score += 5 if @answers['cyber_insurance_contact'] == 'yes'
    score += 5 if @answers['ransom_policy_defined'] == 'yes'
    score += 5 if @answers['legal_counsel_ready'] == 'yes'
    [score, 20].min
  end
  
  def identify_gaps
    gaps = []
    gaps << 'Activer immutabilité des backups' unless @answers['immutable_backups'] == 'yes'
    gaps << 'Créer air-gap pour backups critiques' unless @answers['air_gap_backup'] == 'yes'
    gaps << 'Tester restauration mensuellement' unless @answers['backup_tested_monthly'] == 'yes'
    gaps << 'Segmenter réseau (VLAN)' unless @answers['network_segmentation'] == 'yes'
    gaps << 'Déployer EDR sur tous les endpoints' unless @answers['edr_deployed'] == 'yes'
    gaps << 'Créer playbook spécifique ransomware' unless @answers['ransomware_playbook'] == 'yes'
    gaps << 'Définir politique de non-paiement' unless @answers['ransom_policy_defined'] == 'yes'
    gaps
  end
  
  def readiness_level(score)
    case score
    when 90..100 then 'EXCELLENT - Résilience complète'
    when 80..89 then 'GOOD - Résilience acceptable'
    when 60..79 then 'FAIR - Vulnérabilités majeures'
    else 'CRITICAL - Risque élevé de compromission'
    end
  end
end