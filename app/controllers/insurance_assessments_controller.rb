class InsuranceAssessmentsController < ApplicationController
  skip_before_action :current_tenant_id, raise: false
  skip_before_action :set_tenant, raise: false
  skip_before_action :authenticate_user!, raise: false
  skip_before_action :verify_authenticity_token

  before_action :set_cors_headers

  def index
    @assessments = InsuranceAssessment.where(tenant_id: tenant_id).order(created_at: :desc)
    render json: @assessments
  end

  def create
    answers   = params[:answers].to_h rescue {}
    tenant_id = 1 # forcé pour test

    Rails.logger.info "DEBUG: tenant_id=#{tenant_id.inspect}"
    score, risk_level, premium_impact, section_scores, gaps = calculate_insurance_score(answers)
    Rails.logger.info "DEBUG2: tenant_id value=#{tenant_id} class=#{tenant_id.class}"

    @assessment = InsuranceAssessment.new(
      tenant_id:      tenant_id,
      answers:        answers,
      score:          score,
      risk_level:     risk_level,
      premium_impact: premium_impact,
      section_scores: section_scores,
      gaps:           gaps,
      assessed_at:    Time.now
    )

    if @assessment.save
      render json: {
        success:    true,
        assessment: @assessment.as_json.merge(
          score:           score,
          risk_level:      risk_level,
          premium_impact:  premium_impact,
          section_scores:  section_scores,
          gaps:            gaps,
          recommendations: build_recommendations(gaps)
        )
      }, status: :created
    else
      render json: { success: false, errors: @assessment.errors.full_messages }, status: :unprocessable_entity
    end
  rescue => e
    Rails.logger.error "InsuranceAssessmentsController#create error: #{e.class} -- #{e.message}\n#{e.backtrace.first(5).join("\n")}"
    render json: { success: false, error: e.message }, status: :internal_server_error
  end

  private

  def set_cors_headers
    headers["Access-Control-Allow-Origin"]  = "*"
    headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Tenant-ID"
  end

  SCORING_MAP = {
    "mfa"                => { "Yes" => 100, "Partial" => 50, "No" => 0 },
    "sso"                => { "Yes" => 100, "In progress" => 50, "No" => 0 },
    "pam"                => { "Yes" => 100, "Planned" => 25, "No" => 0 },
    "conditional_access" => { "Yes" => 100, "No" => 0, "Dont know" => 25 },
    "backups"            => { "Daily" => 100, "Weekly" => 75, "Monthly" => 40, "Never" => 0 },
    "backup_tested"      => { "Monthly" => 100, "Quarterly" => 80, "Yearly" => 40, "Never" => 0 },
    "offsite_backup"     => { "Yes" => 100, "No" => 0 },
    "immutable_backups"  => { "Yes" => 100, "Partial (30+ days)" => 60, "No" => 0, "Dont know" => 25 },
    "edr_coverage"       => { "100%" => 100, "80-99%" => 80, "50-79%" => 50, "<50%" => 20, "Dont know" => 20 },
    "patching"           => { "<7 days" => 100, "<30 days" => 80, "<90 days" => 40, ">90 days" => 10, "Dont know" => 30 },
    "endpoint_encryption"=> { "Full disk" => 100, "Partial" => 50, "None" => 0, "Dont know" => 30 },
    "usb_controls"       => { "Blocked" => 100, "Monitored" => 60, "No control" => 0, "Dont know" => 20 },
    "firewall"           => { "Yes" => 100, "Traditional firewall only" => 50, "No" => 0 },
    "network_segmentation"=> { "Full" => 100, "Partial" => 50, "None" => 0 },
    "vpn"                => { "Required" => 100, "Optional" => 50, "None" => 0 },
    "network_monitoring" => { "24/7" => 100, "Business hours" => 60, "No monitoring" => 0 },
    "ir_plan"            => { "Yes" => 100, "Outdated" => 40, "No" => 0 },
    "ir_tested"          => { "<6 months" => 100, "<12 months" => 70, "Yearly" => 40, ">12 months" => 30, "Never" => 0 },
    "cyber_insurance"    => { "Yes" => 100, "Expired" => 20, "No" => 0 },
    "tabletop"           => { "Quarterly" => 100, "Yearly" => 60, "Never" => 0 },
    "loi25"              => { "Yes" => 100, "In progress" => 50, "No" => 0 },
    "security_policies"  => { "Yes" => 100, "Outdated" => 40, "No" => 0 },
    "training"           => { "Mandatory" => 100, "Optional" => 50, "None" => 0 },
    "third_party_audits" => { "Annual" => 100, "Biannual" => 60, "Never" => 0 }
  }.freeze

  SECTIONS_CONFIG = {
    "identity"          => { weight: 25, keys: %w[mfa sso pam conditional_access] },
    "data_protection"   => { weight: 20, keys: %w[backups backup_tested offsite_backup immutable_backups] },
    "endpoint"          => { weight: 20, keys: %w[edr_coverage patching endpoint_encryption usb_controls] },
    "network"           => { weight: 15, keys: %w[firewall network_segmentation vpn network_monitoring] },
    "incident_response" => { weight: 10, keys: %w[ir_plan ir_tested cyber_insurance tabletop] },
    "compliance"        => { weight: 10, keys: %w[loi25 security_policies training third_party_audits] }
  }.freeze

  def calculate_insurance_score(answers)
    total_weighted = 0.0
    section_scores = {}
    gaps           = []

    SECTIONS_CONFIG.each do |section_name, config|
      section_raw = 0.0

      config[:keys].each do |key|
        value      = answers[key].to_s
        raw_score  = (SCORING_MAP[key] || {})[value] || 0
        section_raw += raw_score
        gaps << key if raw_score < 50
      end

      section_pct = section_raw / (config[:keys].size * 100.0) * 100
      weighted    = section_pct * config[:weight] / 100.0

      section_scores[section_name] = {
        "score"      => section_pct.round(1),
        "max"        => 100,
        "weighted"   => weighted.round(2),
        "percentage" => section_pct.round(1)
      }

      total_weighted += weighted
    end

    percentage = total_weighted.round(1)

    risk_level = if percentage <= 40 then "high"
                 elsif percentage <= 60 then "medium"
                 elsif percentage <= 80 then "low"
                 else "minimal"
                 end

    premium_impact = case risk_level
                     when "high"    then "+25-40%"
                     when "medium"  then "+10-25%"
                     when "low"     then "0-10%"
                     else "-10-0%"
                     end

    [percentage, risk_level, premium_impact, section_scores, gaps]
  end

  def build_recommendations(gaps)
    reco_map = {
      "mfa"                 => "Enable MFA on all accounts (critical -- +12pts insurance score)",
      "conditional_access"  => "Configure Conditional Access policies in Azure AD",
      "pam"                 => "Deploy a Privileged Access Management solution",
      "backups"             => "Implement daily automated backups",
      "backup_tested"       => "Schedule monthly backup restoration tests",
      "immutable_backups"   => "Enable immutable/versioned backups (ransomware protection)",
      "edr_coverage"        => "Deploy EDR on 100% of endpoints",
      "patching"            => "Reduce patch deployment cycle to under 7 days",
      "ir_plan"             => "Document a formal Incident Response plan",
      "ir_tested"           => "Conduct tabletop exercises at least annually",
      "cyber_insurance"     => "Obtain an active cyber insurance policy",
      "loi25"               => "Document Loi 25 compliance procedures",
      "network_segmentation"=> "Implement network segmentation between production and corporate"
    }
    gaps.filter_map { |g| reco_map[g] }.first(8)
  end
end
 