class AnalysisResultsController < ApplicationController
  protect_from_forgery with: :null_session

  def create
    analysis_result = AnalysisResult.create!(
      tenant_id: params[:tenant_id],
      webhook_event_id: params[:correlation_id],
      correlation_id: params[:correlation_id],
      source: params[:source],
      event_key: params[:event_key].to_json,
      triage: params[:triage].to_json,
      narrative: params[:narrative].to_json,
      evidence: params[:evidence].to_json
    )

    head :no_content
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end
