module Api
  class Loi25AssessmentsController < ApplicationController
    before_action :set_tenant
    
    def create
      @assessment = @tenant.loi25_assessments.new(assessment_params)
      
      if @assessment.save
        render json: @assessment, status: :created
      else
        render json: { errors: @assessment.errors.full_messages }, status: :unprocessable_entity
      end
    rescue => e
      Rails.logger.error "Loi25 Create Error: #{e.message}"
      render json: { error: e.message }, status: :internal_server_error
    end
    
    def index
      @assessments = @tenant.loi25_assessments.order(created_at: :desc).limit(5)
      render json: @assessments
    end
    
    def show
      @assessment = @tenant.loi25_assessments.find(params[:id])
      render json: @assessment
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Assessment not found' }, status: :not_found
    end
    
    private
    
    def set_tenant
      tenant_uuid = request.headers['X-Tenant-ID']
      @tenant = Tenant.find(tenant_uuid) # Cherche par la PK id
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Tenant not found' }, status: :not_found
    end
    
    def assessment_params
      params.require(:assessment).permit(
        :governance, :data_inventory, :consent_management, 
        :security_measures, :breach_notification, :data_retention
      )
    end
  end
end