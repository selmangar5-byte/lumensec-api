module Api
  class RansomwareAssessmentsController < ApplicationController
    def create
      tenant_id = current_tenant_id
      answers = params[:answers]
      
      result = RansomwareAssessment.calculate(tenant_id, answers)
      
      assessment = RansomwareAssessment.create!(
        tenant_id: tenant_id,
        score: result[:score],
        status: result[:status],
        answers: answers,
        backup_score: result[:backup_score],
        isolation_score: result[:isolation_score],
        detection_score: result[:detection_score],
        response_score: result[:response_score]
      )
      
      render json: {
        success: true,
        assessment: result.merge(id: assessment.id, created_at: assessment.created_at)
      }, status: :created
    end
    
    def index
      tenant_id = current_tenant_id
      
      assessments = RansomwareAssessment
        .where(tenant_id: tenant_id)
        .order(created_at: :desc)
        .limit(10)
        .map do |a|
          {
            id: a.id,
            score: a.score,
            status: a.status,
            readiness_level: a.readiness_level,
            created_at: a.created_at
          }
        end
      
      render json: { assessments: assessments }
    end
    
    def show
      tenant_id = current_tenant_id
      assessment = RansomwareAssessment.find_by(id: params[:id], tenant_id: tenant_id)
      
      unless assessment
        return render json: { error: 'Assessment not found' }, status: :not_found
      end
      
      result = RansomwareAssessment.calculate(assessment.tenant_id, assessment.answers)
      
      render json: {
        assessment: result.merge(
          id: assessment.id,
          created_at: assessment.created_at,
          updated_at: assessment.updated_at
        )
      }
    end
  end
end