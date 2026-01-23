class AnalysisResultsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    analysis_result = AnalysisResult.create!(
      tenant_id: params[:tenant_id],
      webhook_event_id: params[:correlation_id],
      correlation_id: params[:correlation_id],
      source: params[:source],
      event_key: params[:event_key],
      triage: params[:triage],
      narrative: params[:narrative],
      evidence: params[:evidence]
    )

    render json: { id: analysis_result.id }, status: :created
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
  
  def show
    analysis_result = AnalysisResult.find(params[:id])
    render json: analysis_result, include: [:webhook_event, :evidence_packs]
  rescue => e
    render json: { error: e.message }, status: :not_found
  end
end
