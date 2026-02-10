module Api
  class InsuranceAssessmentsController < ApplicationController
    def create
      answers = params[:answers]
      tenant_id = request.headers['X-Tenant-ID'] || '00000000-0000-0000-0000-000000000001'
      
      result = InsuranceScoringEngine.calculate(answers)
      
      assessment = InsuranceAssessment.create!(
        tenant_id: tenant_id,
        score: result[:score],
        risk_level: result[:risk_level],
        answers: answers
      )
      
      render json: {
        success: true,
        assessment: result.merge(id: assessment.id, created_at: assessment.created_at)
      }, status: :created
    end
    
    def index
      tenant_id = request.headers['X-Tenant-ID'] || '00000000-0000-0000-0000-000000000001'
      
      assessments = InsuranceAssessment
        .where(tenant_id: tenant_id)
        .order(created_at: :desc)
        .limit(10)
        .map do |a|
          result = InsuranceScoringEngine.calculate(a.answers)
          {
            id: a.id,
            score: a.score,
            risk_level: a.risk_level,
            created_at: a.created_at,
            section_scores: result[:section_scores]
          }
        end
      
      render json: { assessments: assessments }
    end
  end
end
