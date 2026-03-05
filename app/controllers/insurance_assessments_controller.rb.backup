class InsuranceAssessmentsController < ApplicationController
  skip_before_action :authenticate_user!, raise: false
  skip_before_action :verify_authenticity_token
  
  before_action :set_cors_headers
  
  def index
    tenant_id = params[:tenant_id]
    @assessments = InsuranceAssessment.where(tenant_id: tenant_id).order(created_at: :desc)
    render json: @assessments
  end
  
  def create
    answers = params[:answers] || {}
    tenant_id = params[:tenant_id] || 1
    
    # Calcul du scoring
    score, risk_level, premium_impact, section_scores, gaps = calculate_insurance_score(answers)
    
    @assessment = InsuranceAssessment.new(
      tenant_id: tenant_id,
      answers: answers,
      score: score,
      risk_level: risk_level,
      premium_impact: premium_impact,
      section_scores: section_scores,
      gaps: gaps,
      assessed_at: Time.now
    )
    
    if @assessment.save
      render json: @assessment, status: :created
    else
      render json: { errors: @assessment.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  private
  
  def set_cors_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
  end
  
  def calculate_insurance_score(answers)
    # Logique de scoring basée sur les réponses
    total_score = 0
    max_score = 0
    section_scores = {}
    gaps = []
    
    # Sections et pondération
    sections = {
      'governance' => { weight: 25, questions: 5 },
      'identification' => { weight: 20, questions: 4 },
      'protection' => { weight: 25, questions: 5 },
      'detection' => { weight: 15, questions: 3 },
      'response' => { weight: 10, questions: 2 },
      'recovery' => { weight: 5, questions: 2 }
    }
    
    sections.each do |section, config|
      section_score = 0
      section_max = config[:weight]
      
      # Calculer score section basé sur les réponses
      (1..config[:questions]).each do |q_num|
        key = "#{section}_q#{q_num}"
        value = answers[key] || answers[key.to_sym]
        
        if value == 'yes' || value == true
          section_score += (section_max / config[:questions].to_f)
        elsif value == 'partial'
          section_score += (section_max / config[:questions].to_f) * 0.5
        else
          gaps << "#{section}_q#{q_num}"
        end
      end
      
      section_scores[section] = {
        'score' => section_score.round(2),
        'max' => section_max,
        'percentage' => ((section_score / section_max) * 100).round(1)
      }
      
      total_score += section_score
      max_score += section_max
    end
    
    # Calcul niveau de risque
    percentage = (total_score / max_score) * 100
    
    risk_level = case percentage
    when 0..40 then 'high'
    when 41..60 then 'medium'
    when 61..80 then 'low'
    else 'minimal'
    end
    
    # Impact prime (réduction ou augmentation)
    premium_impact = case risk_level
    when 'high' then '+25-40%'
    when 'medium' then '+10-25%'
    when 'low' then '0-10%'
    when 'minimal' then '-10-0%'
    end
    
    [total_score.round(2), risk_level, premium_impact, section_scores, gaps]
  end
end